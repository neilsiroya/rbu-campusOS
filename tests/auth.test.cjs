const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const { NextRequest } = require("next/server");

// Transpile the actual modules and inject only the auth service boundary.
// All tests are offline and use Next's real request/response cookie behavior.
function loadModule(file, dependencies = {}, env = {}, search = "?from=%2Fevents") {
  const source = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const loaded = { exports: {} };
  vm.runInNewContext(output, {
    module: loaded,
    exports: loaded.exports,
    require: (name) => Object.hasOwn(dependencies, name) ? dependencies[name] : require(name),
    process: { env },
    URL,
    URLSearchParams,
    window: { location: { search } },
  }, { filename: file });
  return loaded.exports;
}

const redirects = loadModule("lib/auth-redirect.ts");
const configured = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-public-key",
};

function loadProxy(getUser, env = configured) {
  return loadModule("proxy.ts", {
    "./lib/auth-redirect": redirects,
    "@supabase/ssr": {
      createServerClient: (_url, _key, { cookies }) => ({ auth: { getUser: () => getUser(cookies) } }),
    },
  }, env).proxy;
}

test("return paths preserve local path, query, and anchor", () => {
  assert.equal(redirects.getSafeReturnPath("/events?filter=music#today"), "/events?filter=music#today");
  assert.equal(redirects.getSafeReturnPath("/notes/../events"), "/events");
});

test("return paths reject external destinations and browser normalization tricks", () => {
  for (const value of [null, "", "https://evil.invalid", "//evil.invalid", "/\\evil.invalid", "/\n/evil.invalid", "/%5cevil.invalid", "/%2fevil.invalid", "/.%2e//evil.invalid", "/%00events", "/%zz", "javascript:alert(1)"]) {
    assert.equal(redirects.getSafeReturnPath(value), "/dashboard", String(value));
  }
});

test("return paths cannot loop through authentication", () => {
  for (const value of ["/auth", "/auth/login", "/auth/signup?from=/events", "/events/../auth/login", "/%61uth/login"]) {
    assert.equal(redirects.getSafeReturnPath(value), "/dashboard", value);
  }
});

test("missing configuration gates protected routes but leaves sign-in and public pages available", async () => {
  const proxy = loadProxy(() => { throw new Error("Must not call auth"); }, {});
  const response = await proxy(new NextRequest("https://campus.test/events?filter=music"));
  const url = new URL(response.headers.get("location"));
  assert.equal(url.pathname, "/auth/login");
  assert.deepEqual([...url.searchParams], [["from", "/events?filter=music"]]);
  for (const pathname of ["/", "/auth/login", "/auth/signup"]) {
    assert.equal((await proxy(new NextRequest(`https://campus.test${pathname}`))).status, 200);
  }
});

test("auth service failure fails closed without breaking the login page", async () => {
  const proxy = loadProxy(async () => { throw new Error("Network unavailable"); });
  assert.equal((await proxy(new NextRequest("https://campus.test/dashboard"))).status, 307);
  assert.equal((await proxy(new NextRequest("https://campus.test/auth/login"))).status, 200);
});

test("auth errors cannot admit a user even if the service also returns user data", async () => {
  const proxy = loadProxy(async () => ({ data: { user: { id: "test" } }, error: new Error("Invalid token") }));
  assert.equal((await proxy(new NextRequest("https://campus.test/notes"))).status, 307);
});

test("authenticated redirect honors safe destination and keeps refreshed cookies", async () => {
  const proxy = loadProxy(async (cookies) => {
    cookies.setAll([{ name: "session", value: "new", options: { httpOnly: true, sameSite: "lax", path: "/" } }]);
    cookies.setAll([{ name: "refresh", value: "newer", options: { path: "/" } }]);
    return { data: { user: { id: "test" } }, error: null };
  });
  const response = await proxy(new NextRequest("https://campus.test/auth/login?from=%2Fevents%3Ffilter%3Dmusic"));
  assert.equal(response.headers.get("location"), "https://campus.test/events?filter=music");
  assert.equal(response.cookies.get("session").value, "new");
  assert.equal(response.cookies.get("session").httpOnly, true);
  assert.equal(response.cookies.get("refresh").value, "newer");
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  const unsafe = await proxy(new NextRequest("https://campus.test/auth/signup?from=%2F%5Cevil.invalid"));
  assert.equal(unsafe.headers.get("location"), "https://campus.test/dashboard");
});

test("expired session cookie deletion survives redirect to login", async () => {
  const proxy = loadProxy(async (cookies) => {
    cookies.setAll([{ name: "session", value: "", options: { path: "/", maxAge: 0 } }]);
    return { data: { user: null }, error: null };
  });
  const response = await proxy(new NextRequest("https://campus.test/settings"));
  assert.equal(response.status, 307);
  assert.equal(response.cookies.get("session").maxAge, 0);
});

test("refresh cache headers survive later cookie writes and both response paths", async () => {
  const cacheHeaders = {
    "Cache-Control": "private, no-cache, no-store, must-revalidate, max-age=0",
    Expires: "0",
    Pragma: "no-cache",
  };
  const proxy = loadProxy(async (cookies) => {
    cookies.setAll([{ name: "session", value: "new", options: { path: "/" } }], cacheHeaders);
    cookies.setAll([{ name: "refresh", value: "new", options: { path: "/" } }], {});
    return { data: { user: { id: "test" } }, error: null };
  });
  for (const pathname of ["/dashboard", "/auth/login"]) {
    const response = await proxy(new NextRequest(`https://campus.test${pathname}`));
    for (const [name, value] of Object.entries(cacheHeaders)) {
      assert.equal(response.headers.get(name), value);
    }
  }
});

test("browser auth never uses placeholder credentials", () => {
  let calls = 0;
  const dependencies = { "@supabase/ssr": { createBrowserClient: () => { calls++; return {}; } } };
  for (const env of [{}, { ...configured, NEXT_PUBLIC_SUPABASE_URL: "https://placeholder.supabase.co" }]) {
    assert.throws(() => loadModule("lib/supabase.ts", dependencies, env).createClient(), /temporarily unavailable/);
  }
  assert.equal(calls, 0);
  loadModule("lib/supabase.ts", dependencies, configured).createClient();
  assert.equal(calls, 1);
});

function authForm(page, createClient, search, server = false) {
  const updates = [];
  const navigations = [];
  const dependencies = {
    react: {
      useState: (initial) => [initial, (value) => updates.push(value)],
      useSyncExternalStore: (_subscribe, snapshot, serverSnapshot) => server ? serverSnapshot() : snapshot(),
    },
    "@/lib/supabase": { createClient },
    "@/lib/auth-redirect": redirects,
    "next/link": { default: "a" },
    "next/navigation": { useRouter: () => ({ replace: (url) => navigations.push(url), refresh: () => {} }) },
    "framer-motion": { motion: { div: "div" }, useReducedMotion: () => true },
    "lucide-react": { User: "svg", Mail: "svg", Lock: "svg", GraduationCap: "svg" },
    "@/lib/utils": { cn: (...values) => values.join(" ") },
    "@/components/ui/button": { Button: "button" },
    "@/components/ui/input": { Input: "input" },
    "@/components/ui/card": { Card: "div" },
  };
  const tree = loadModule(`app/auth/${page}/page.tsx`, dependencies, {}, search).default();
  function findForm(node) {
    if (!node || typeof node !== "object") return null;
    if (node.type === "form") return node;
    const children = node.props?.children;
    for (const child of Array.isArray(children) ? children : [children]) {
      const result = findForm(child);
      if (result) return result;
    }
    return null;
  }
  const form = findForm(tree);
  assert.ok(form, "Auth screen must render a form");
  function findAuthLink(node) {
    if (!node || typeof node !== "object") return null;
    if (node.props?.href?.startsWith("/auth/")) return node;
    const children = node.props?.children;
    for (const child of Array.isArray(children) ? children : [children]) {
      const result = findAuthLink(child);
      if (result) return result;
    }
    return null;
  }
  return { submit: () => form.props.onSubmit({ preventDefault() {} }), updates, navigations, authLink: findAuthLink(tree) };
}

test("switching between auth forms preserves a safe destination including query and anchor", () => {
  const destination = "/events?filter=music#today";
  for (const [page, other] of [["login", "signup"], ["signup", "login"]]) {
    const form = authForm(page, () => {}, `?from=${encodeURIComponent(destination)}`);
    assert.equal(form.authLink.props.href, `/auth/${other}?from=${encodeURIComponent(destination)}`);
  }
});

test("auth cross-links sanitize unsafe destinations and provide a stable server snapshot", () => {
  for (const page of ["login", "signup"]) {
    for (const destination of ["//evil.invalid", "/\\evil.invalid", "/auth/login"]) {
      const form = authForm(page, () => {}, `?from=${encodeURIComponent(destination)}`);
      assert.equal(new URL(form.authLink.props.href, "https://campus.test").searchParams.get("from"), "/dashboard");
    }
    const serverForm = authForm(page, () => {}, "?from=%2Fevents", true);
    assert.equal(new URL(serverForm.authLink.props.href, "https://campus.test").searchParams.get("from"), "/dashboard");
  }
});

test("signup requiring email verification stays on the form with confirmation guidance", async () => {
  const form = authForm("signup", () => ({ auth: { signUp: async () => ({ data: { session: null }, error: null }) } }));
  await form.submit();
  assert.equal(form.navigations.length, 0);
  assert.ok(form.updates.some((value) => value?.tone === "success" && /confirmation link/.test(value.text)));
  assert.equal(form.updates.at(-1), false, "Loading stops after signup completes");
});

test("failed login shows an error and never enters the protected application", async () => {
  const form = authForm("login", () => ({ auth: { signInWithPassword: async () => ({ error: new Error("Invalid credentials") }) } }));
  await form.submit();
  assert.equal(form.navigations.length, 0);
  assert.ok(form.updates.some((value) => value?.tone === "error"));
});

test("missing configuration shows an error instead of a login redirect loop", async () => {
  for (const page of ["login", "signup"]) {
    const form = authForm(page, () => { throw new Error("Sign-in unavailable"); });
    await form.submit();
    assert.equal(form.navigations.length, 0);
    assert.ok(form.updates.some((value) => value?.tone === "error"));
  }
});

test("successful login and confirmed signup return to the requested campus page", async () => {
  const createClient = () => ({ auth: {
    signInWithPassword: async () => ({ error: null }),
    signUp: async () => ({ data: { session: { access_token: "test-session" } }, error: null }),
  } });
  for (const page of ["login", "signup"]) {
    const form = authForm(page, createClient);
    await form.submit();
    assert.deepEqual(form.navigations, ["/events"]);
  }
});

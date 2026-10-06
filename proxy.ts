import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSafeReturnPath } from "./lib/auth-redirect";

const protectedPrefixes = [
  "/dashboard",
  "/academics",
  "/feed",
  "/confessions",
  "/events",
  "/clubs",
  "/people",
  "/lost-found",
  "/marketplace",
  "/map",
  "/facilities",
  "/services",
  "/notes",
  "/timetable",
  "/attendance",
  "/assignments",
  "/exams",
  "/internships",
  "/hackathons",
  "/placements",
  "/notifications",
  "/settings",
  "/profile",
  "/campus-ai",
  "/gaming",
  "/hostels",
  "/sports",
];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedPrefixes.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
  const isAuthRoute = path === "/auth/login" || path === "/auth/signup";

  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next({ request });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const loginUrl = () => {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.search = "";
    url.searchParams.set("from", `${path}${request.nextUrl.search}`);
    return url;
  };

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("placeholder") || supabaseAnonKey.includes("placeholder")) {
    if (isProtectedRoute) {
      return NextResponse.redirect(loginUrl());
    }

    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const authHeaders: Record<string, string> = {};
  let user = null;
  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookies, headers = {}) => {
            cookies.forEach(({ name, value }) => request.cookies.set(name, value));
            Object.assign(authHeaders, headers);
            const previousCookies = response.cookies.getAll();
            response = NextResponse.next({ request });
            previousCookies.forEach((cookie) => response.cookies.set(cookie));
            cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
            Object.entries(authHeaders).forEach(([name, value]) => response.headers.set(name, value));
          },
        },
      }
    );

    const { data, error } = await supabase.auth.getUser();
    if (!error) user = data.user;
  } catch {
    // An unavailable auth service must not expose protected pages or break login.
  }

  const redirectWithCookies = (url: URL) => {
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    redirect.headers.set("Cache-Control", "private, no-store");
    Object.entries(authHeaders).forEach(([name, value]) => redirect.headers.set(name, value));
    return redirect;
  };

  if (!user && isProtectedRoute) {
    return redirectWithCookies(loginUrl());
  }

  if (user && isAuthRoute) {
    const destination = getSafeReturnPath(request.nextUrl.searchParams.get("from"));
    return redirectWithCookies(new URL(destination, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

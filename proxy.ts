import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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

  if (!supabaseUrl || !supabaseAnonKey) {
    if (isProtectedRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("from", `${path}${request.nextUrl.search}`);
      return NextResponse.redirect(url);
    }

    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("from", `${path}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// paths that don't require authentication
const publicPaths = ["/", "/auth/callback"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const currentPath = request.nextUrl.pathname;
  // Check if the current path matches any public path pattern
  const isPublicPath = publicPaths.some((path) => {
    // Convert path pattern to regex
    const pattern = path.replace(":id", "[^/]+");
    const regex = new RegExp(`^${pattern}$`);

    return regex.test(currentPath);
  });

  if (!session && !isPublicPath) {
    // no user, redirect to login page with current path as next
    const url = request.nextUrl.clone();

    url.pathname = "/";
    url.searchParams.set("next", currentPath);

    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

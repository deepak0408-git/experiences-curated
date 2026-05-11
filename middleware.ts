import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Refresh session — do not add logic between createServerClient and getUser()
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Protect /event-pack/[slug]/pack — redirect unauthenticated users to landing page
    if (
      !user &&
      request.nextUrl.pathname.match(/^\/event-pack\/[^/]+\/pack/)
    ) {
      const slug = request.nextUrl.pathname.split("/")[2];
      const url = request.nextUrl.clone();
      url.pathname = `/event-pack/${slug}`;
      return NextResponse.redirect(url);
    }
  } catch {
    // Never let a Supabase error break page rendering
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — cookies will be set by middleware
          }
        },
      },
    }
  );
}

// A stale/invalid refresh-token cookie makes supabase.auth.getUser() throw
// (AuthApiError: Invalid Refresh Token) instead of returning user: null —
// middleware.ts already guards against this with its own try-catch; this
// helper brings every Server Component/Action that calls getUser() up to the
// same standard, since none of them had that protection and the unhandled
// throw was crashing whole pages in production. Treat a throw exactly like
// "not signed in" — every call site already has real handling for that case.
export async function getAuthUser() {
  const supabase = await createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return { supabase, user };
  } catch {
    return { supabase, user: null };
  }
}

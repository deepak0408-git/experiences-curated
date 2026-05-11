"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const next = searchParams.get("next") ?? "/";
    const supabase = createClient();

    // PKCE flow — code in query string
    const code = searchParams.get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(() => router.replace(next));
      return;
    }

    // Implicit flow — tokens in hash fragment (admin-generated links)
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (accessToken && refreshToken) {
      supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(({ error }) => {
          if (!error) router.replace(next);
        });
      return;
    }

    // Already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace(next);
    });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-sm text-neutral-400 tracking-wide">Signing you in…</p>
    </div>
  );
}

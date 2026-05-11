"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

function SignInForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrorMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(next)}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  };

  if (status === "sent") {
    return (
      <div className="text-center">
        <p className="text-base font-semibold text-neutral-900 mb-2">Check your inbox</p>
        <p className="text-sm text-neutral-500 leading-6">
          We sent a sign-in link to <span className="text-neutral-700">{email}</span>.
          <br />Click it to continue.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        autoFocus
        className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors"
      />
      {errorMessage && (
        <p className="text-xs text-red-500">{errorMessage}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full px-4 py-3 rounded-xl bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-700 disabled:opacity-50 transition-colors"
      >
        {status === "loading" ? "Sending…" : "Send sign-in link"}
      </button>
      <p className="text-xs text-neutral-400 text-center pt-1">
        No password. Just a magic link to your inbox.
      </p>
    </form>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="border-b border-neutral-100 px-6 py-4">
        <Link
          href="/"
          className="text-sm font-semibold tracking-widest uppercase text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          Experiences | Curated
        </Link>
      </nav>
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-2 text-center">
            Sign in
          </p>
          <h1 className="text-2xl font-bold text-neutral-900 text-center mb-8">
            Welcome back
          </h1>
          <Suspense>
            <SignInForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

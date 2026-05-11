"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function HomepageTripBoardCTA({ isSignedIn }: { isSignedIn: boolean }) {
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
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=/`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  };

  if (isSignedIn === true) return null;

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-neutral-200 p-6">
        <p className="text-sm font-semibold text-neutral-900 mb-1">
          Check your inbox
        </p>
        <p className="text-sm text-neutral-500 leading-6">
          We sent a sign-in link to{" "}
          <span className="text-neutral-700">{email}</span>. Click it to
          access your account and start planning.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-200 p-6">
      <p className="text-sm font-semibold text-neutral-900 mb-1">
        Create your free account
      </p>
      <p className="text-xs text-neutral-400 mb-5">
        No password. No credit card. Just a magic link.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full px-4 py-3 rounded-lg border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full px-4 py-3 rounded-lg bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-700 disabled:opacity-50 transition-colors"
        >
          {status === "loading" ? "Sending..." : "Get started — it's free"}
        </button>
        {status === "error" && (
          <p className="text-xs text-red-500">{errorMessage ?? "Something went wrong. Please try again."}</p>
        )}
      </form>
      <p className="mt-4 text-xs text-neutral-400">
        By continuing, you agree to receive a sign-in link by email.
      </p>
    </div>
  );
}

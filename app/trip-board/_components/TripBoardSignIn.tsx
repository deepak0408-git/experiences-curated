"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function TripBoardSignIn() {
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
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=/trip-board`,
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
      <div>
        <p className="text-sm font-semibold text-neutral-900 mb-1">Check your inbox</p>
        <p className="text-sm text-neutral-500 leading-6">
          We sent a sign-in link to <span className="text-neutral-700">{email}</span>.
          Click it to open your Trip Board.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-left">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors"
      />
      {errorMessage && (
        <p className="text-xs text-red-500">{errorMessage}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full px-6 py-3 rounded-xl bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-700 transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "Sending…" : "Send sign-in link"}
      </button>
    </form>
  );
}

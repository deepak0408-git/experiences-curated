"use client";

import { useState } from "react";

export default function HomepageTripBoardCTA({ isSignedIn }: { isSignedIn: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrorMessage(null);

    const res = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), next: "/" }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErrorMessage(data.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    } else {
      setStatus("sent");
    }
  };

  if (isSignedIn === true) {
    return (
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-6">
        <p className="text-sm font-black text-white mb-1">Your Trip Board is ready</p>
        <p className="text-xs text-[#A3A3A3] mb-5">Save experiences, schedule days, share with travel companions.</p>
        <a
          href="/trip-board"
          className="block w-full px-4 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black tracking-wide hover:bg-[#BBFF33] transition-colors text-center"
        >
          Go to Trip Board →
        </a>
      </div>
    );
  }

  if (status === "sent") {
    return (
      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#141414] p-6">
        <p className="text-sm font-black text-white mb-1">
          Check your inbox
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          We sent a sign-in link to{" "}
          <span className="text-[#AAFF00]">{email}</span>. Click it to
          access your account and start planning.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-6">
      <p className="text-sm font-black text-white mb-1">
        Create your free account
      </p>
      <p className="text-xs text-[#A3A3A3] mb-5">
        No password. No credit card. Just a magic link.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full px-4 py-3 rounded-sm border border-[#2A2A2A] bg-[#0A0A0A] text-sm text-white placeholder:text-[#6A6A6A] focus:outline-none focus:border-[#AAFF00] transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full px-4 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black tracking-wide hover:bg-[#BBFF33] disabled:opacity-50 transition-colors"
        >
          {status === "loading" ? "Sending..." : "Get started — it's free"}
        </button>
        {status === "error" && (
          <p className="text-xs text-red-400">{errorMessage ?? "Something went wrong. Please try again."}</p>
        )}
      </form>
      <p className="mt-4 text-xs text-[#6A6A6A]">
        By continuing, you agree to receive a sign-in link by email.
      </p>
    </div>
  );
}

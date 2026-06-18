"use client";

import { useState } from "react";

export default function ProComingSoon({ userEmail }: { userEmail?: string }) {
  const [email, setEmail] = useState(userEmail ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/pro-waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus(res.ok ? "done" : "error");
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 text-center">
      <span className="inline-block px-3 py-1 rounded-full bg-neutral-100 text-neutral-500 text-xs font-semibold tracking-widest uppercase mb-6">
        Coming soon
      </span>
      <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight max-w-xl mb-4">
        Pro membership — coming soon
      </h1>
      <p className="text-base text-neutral-500 leading-7 max-w-lg mb-2">
        The insider layer, for travellers who want more than a ticket.
      </p>
      <p className="text-sm text-neutral-500 leading-7 max-w-lg mb-10">
        Pro unlocks the concierge detail behind every experience — lead times, direct booking contacts, and the tactical information that doesn&apos;t make it onto the public page. It also personalises your pack by travel archetype and removes all limits on your Trip Board.
      </p>

      {status === "done" ? (
        <p className="text-sm font-semibold text-neutral-900">
          You&apos;re on the list — we&apos;ll be in touch.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 px-4 py-3 rounded-full border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-3 rounded-full bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-700 transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "Saving…" : "Notify me"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-3 text-xs text-red-500">Something went wrong — please try again.</p>
      )}
    </div>
  );
}

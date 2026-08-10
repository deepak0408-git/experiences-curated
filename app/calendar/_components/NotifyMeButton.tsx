"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/actions";

// Compact inline variant of NewsletterForm — a calendar row has no room for
// the full email-input form, so this collapses to a single button that
// reveals the input on click. Reuses the same subscribeToNewsletter action
// (source: "calendar") rather than a new per-event interest mechanism —
// confirmed as the right reuse target since newsletter_subscribers has no
// per-event granularity and the design doc doesn't ask for one.
export default function NotifyMeButton({ eventName }: { eventName: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  if (status === "done") {
    return <p className="text-xs text-[#AAFF00]">You&apos;re on the list.</p>;
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-bold text-[#6A6A6A] hover:text-[#AAFF00] transition-colors text-left"
      >
        🔔 Guide coming — get notified
      </button>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("loading");
        const result = await subscribeToNewsletter(email, "calendar");
        setStatus(result.ok ? "done" : "error");
      }}
      className="flex items-center gap-2"
    >
      <input
        type="email"
        required
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        aria-label={`Get notified when the ${eventName} guide is live`}
        className="w-40 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] px-2.5 py-1.5 text-xs text-white placeholder:text-[#6A6A6A] focus:outline-none focus:border-[#AAFF00] transition-colors"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-sm bg-[#AAFF00] text-black text-xs font-black px-3 py-1.5 hover:bg-[#BBFF33] transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "..." : "Notify me"}
      </button>
    </form>
  );
}

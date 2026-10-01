"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "@/app/newsletter/actions";

// Same subscribeToNewsletter(email, source) pattern as the experience page's
// NotifyMeRow (ExperienceActionSidebar.tsx) and the Calendar page's
// NotifyMeButton — no per-event interest table, newsletter_subscribers has
// no per-event granularity.
export default function EventNotifyRow({ eventName, userEmail }: { eventName: string; userEmail: string | null }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(userEmail ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  if (status === "done") {
    return (
      <div className="flex items-center gap-2 mt-3">
        <span className="text-sm flex-shrink-0">✓</span>
        <span className="text-xs font-bold text-[#AAFF00]">You&apos;re on the list</span>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className="mt-3 flex items-center gap-2 text-xs text-[#6A6A6A] hover:text-[#AAFF00] transition-colors"
      >
        <span>🔔</span>
        <span className="font-bold">Guide coming — get notified</span>
      </button>
    );
  }

  return (
    <form
      onClick={(e) => e.stopPropagation()}
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("loading");
        const result = await subscribeToNewsletter(email, "destination_page");
        setStatus(result.ok ? "done" : "error");
      }}
      className="mt-3"
    >
      <p className="text-xs text-[#6A6A6A] mb-2">We&apos;ll email you when the {eventName} guide is live.</p>
      <div className="flex items-center gap-2">
        <input
          type="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-label={`Get notified when the ${eventName} guide is live`}
          className="w-0 flex-1 min-w-0 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] px-2.5 py-1.5 text-xs text-white placeholder:text-[#6A6A6A] focus:outline-none focus:border-[#AAFF00] transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex-shrink-0 rounded-sm bg-[#AAFF00] text-black text-xs font-black px-3 py-1.5 hover:bg-[#BBFF33] transition-colors disabled:opacity-60"
        >
          {status === "loading" ? "..." : "Notify me"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-red-400 mt-1.5">Something went wrong — try again.</p>
      )}
    </form>
  );
}

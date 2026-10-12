"use client";

import { useState } from "react";
import Link from "next/link";
import { notifyMe } from "@/app/planner/_lib/actions";

// Same isBuilt/open/status state machine and notifyMe() call as
// EventGuideCta.tsx (the hero sidebar's version), but laid out to sit
// inline inside an alternative ResultCard rather than bleeding to a
// sidebar card's edges, and without the leading emoji — founder request,
// 10 Oct 2026: "Get the guide" on alternatives, no icon, same familiar
// get-notified fallback when the guide isn't built yet.
export default function AlternativeGuideCta({
  eventSlug,
  eventId,
  sport,
  isBuilt,
  userEmail,
}: {
  eventSlug: string;
  eventId: string;
  sport: string;
  isBuilt: boolean;
  userEmail: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(userEmail ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  if (isBuilt) {
    return (
      <Link
        href={`/event-pack/${eventSlug}`}
        className="inline-flex items-center rounded-sm bg-[#AAFF00] hover:bg-[#BBFF33] transition-colors px-4 py-2.5"
      >
        <span className="text-sm font-black text-black">Get the guide</span>
      </Link>
    );
  }

  if (status === "done") {
    return <p className="text-xs text-[#AAFF00]">You&apos;re on the list.</p>;
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center rounded-sm border border-[#2A2A2A] hover:border-[#AAFF00] transition-colors px-4 py-2.5"
      >
        <span className="text-sm font-bold text-[#A3A3A3]">Get notified when the guide is ready</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("loading");
        try {
          await notifyMe(
            email,
            {
              sports: [sport],
              budgetMin: 0,
              budgetMax: 100000,
              timeWindow: "flexible",
              tripLengthDays: 0,
              originMarket: "unspecified",
            },
            [],
            eventId,
          );
          setStatus("done");
        } catch {
          setStatus("error");
        }
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
        aria-label="Get notified when this guide is live"
        className="flex-1 min-w-0 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] px-2.5 py-1.5 text-xs text-white placeholder:text-[#6A6A6A] focus:outline-none focus:border-[#AAFF00] transition-colors"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="flex-shrink-0 rounded-sm bg-[#AAFF00] text-black text-xs font-black px-3 py-1.5 hover:bg-[#BBFF33] transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "..." : "Notify me"}
      </button>
    </form>
  );
}

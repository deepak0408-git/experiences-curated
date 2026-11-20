"use client";

import { useState } from "react";
import Link from "next/link";
import { notifyMe } from "@/app/planner/_lib/actions";
import { phEvent } from "@/lib/posthog-events";

// Ported from app/ticket-intelligence/[slug]/_components/TicketIntelligenceSidebar.tsx's
// EventGuideCta exactly — same isBuilt/open/status state machine, same
// notifyMe() call shape. Founder request (10 Oct 2026): "Guide coming
// soon" should offer the same real get-notified flow Ticket Intelligence
// has, not static unclickable text.
export default function EventGuideCta({
  eventSlug,
  eventId,
  sport,
  isBuilt,
  userEmail,
  sidebarPage,
  variant = "bottom",
}: {
  eventSlug: string;
  eventId: string;
  sport: string;
  isBuilt: boolean;
  userEmail: string | null;
  // Reused by both the F1 and tennis Trip Intelligence results sidebars —
  // needed so sidebarCtaClicked can tell the two apart. Defaults to the
  // original (F1) caller so the existing import site doesn't need updating.
  sidebarPage?: "trip_intelligence_f1" | "trip_intelligence_tennis";
  // "bottom" (default): bleeds to the box's edges as the box's final,
  // rounded-bottom item — the original layout. "list": a plain item among
  // the box's secondary links (icon + two-line text, bottom border, no
  // lime fill even when built), per the UX Journey Map spec (20 Nov 2026,
  // corrected same day) — "Find your seat" is this screen's sole primary
  // CTA, and Get the Event Guide sits first in the plain list below it.
  variant?: "bottom" | "list";
}) {
  const page = sidebarPage ?? "trip_intelligence_f1";
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(userEmail ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const isList = variant === "list";
  const built = isList ? "flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity" : "flex items-center gap-2.5 py-4 px-5 -mx-5 -mb-5 mt-0 rounded-b-sm bg-[#AAFF00] hover:bg-[#BBFF33] transition-colors";
  const done = isList ? "py-3 border-b border-[#2A2A2A]" : "py-4 px-5 -mx-5 -mb-5 mt-0";
  const closed = isList ? "flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] w-full text-left hover:opacity-80 transition-opacity" : "flex items-center gap-2.5 py-4 px-5 -mx-5 -mb-5 mt-0 w-[calc(100%+2.5rem)] text-left hover:opacity-80 transition-opacity";
  const formWrap = isList ? "flex items-center gap-2 py-3 border-b border-[#2A2A2A]" : "flex items-center gap-2 py-4 px-5 -mx-5 -mb-5 mt-0";

  if (isBuilt) {
    return (
      <Link
        href={`/event-pack/${eventSlug}`}
        onClick={() => phEvent.sidebarCtaClicked({ page, cta: "get_full_guide", slug: eventSlug })}
        className={built}
      >
        <span className="text-base flex-shrink-0 w-5 text-center">🎟</span>
        <span className="flex-1">
          <span className={isList ? "block text-sm font-bold text-[#A3A3A3]" : "block text-sm font-black text-black"}>Get the event guide</span>
          <span className={isList ? "block text-xs text-[#6A6A6A] mt-0.5" : "block text-xs text-black/65 mt-0.5"}>Trip costs, curated picks, booking detail</span>
        </span>
      </Link>
    );
  }

  if (status === "done") {
    return (
      <div className={done}>
        <p className="text-xs text-[#AAFF00]">You&apos;re on the list.</p>
      </div>
    );
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className={closed}>
        <span className="text-base flex-shrink-0 w-5 text-center">🔔</span>
        <span className="flex-1">
          <span className="block text-sm font-bold text-[#A3A3A3]">Guide coming soon</span>
          <span className="block text-xs text-[#6A6A6A] mt-0.5">Get notified when it&apos;s ready</span>
        </span>
      </button>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("loading");
        phEvent.sidebarCtaClicked({ page, cta: "notify_me", slug: eventSlug });
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
      className={formWrap}
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

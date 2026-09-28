"use client";

import { useState } from "react";
import { notifyMe } from "@/app/planner/_lib/actions";

// Compact inline variant of NewsletterForm — a calendar row has no room for
// the full email-input form, so this collapses to a single button that
// reveals the input on click.
//
// Switched 28 Sep 2026 from subscribeToNewsletter (newsletter_subscribers,
// no per-event linkage) to notifyMe (planner_sessions, gateAction:
// "notified", gateActionEventIds: [eventId]) — the former put a signup on
// the GENERAL newsletter list, which meant a person asking to be notified
// about ONE event's guide would instead get emailed about EVERY future
// pack activation. notifyMe is what app/api/cron/newsletter-new-pack-
// announcement/route.ts actually queries (arrayContains gateActionEventIds)
// to send a targeted "the guide you asked about is now live" email — see
// that route's Post-Planner Drip Sequence block. Same reasoning applied to
// TicketIntelligenceSidebar's equivalent button the same day.
//
// No real PlannerIntake exists in this context (no sports/budget/time-
// window quiz was answered) — the same honest neutral placeholder values
// used elsewhere (originMarket: "unspecified", budgetMax >= 100000 =
// "Flexible" sentinel) fill the required-but-irrelevant columns.
//
// userEmail pre-fills the input for a signed-in visitor (mirrors the
// Planner's GateModal defaultEmail pattern) so they don't have to retype
// an email we already know — fixed 19 Sep 2026 after this was caught live
// as a glitch: a logged-in user still had to type their email by hand.
export default function NotifyMeButton({
  eventName,
  eventId,
  sport,
  userEmail,
}: {
  eventName: string;
  eventId: string;
  sport: string;
  userEmail: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(userEmail ?? "");
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
            eventId
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

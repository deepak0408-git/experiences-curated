"use client";

import { useState } from "react";
import Link from "next/link";
import { notifyMe } from "@/app/planner/_lib/actions";

// Shared sidebar — used on the quiz entry page (TicketQuiz.tsx), the
// already-purchased teaser reveal (TeaserResult.tsx), and the result page
// (result/page.tsx), per founder direction 27 Sep 2026. Moved out of
// result/_components (where it started as ResultActionSidebar) into this
// shared _components folder once the quiz page needed it too.
//
// Two stacked boxes, same flex flex-col gap-5 wrapper as the blog's
// ArticleActionSidebar: "This Event" (4-action model — Budget your trip /
// See it on the calendar / Build a custom itinerary / Get the Event Guide,
// matching SpokeActionSidebar/ArticleActionSidebar/ExperienceActionSidebar)
// plus a second "Your Personalized Seat Match" box added 27 Sep 2026,
// pointing at /ticket-intelligence (the event picker) — same slot as the
// blog sidebar's "More '{category}' Pieces" box.
//
// No retake action in the first box — FullResult already has its own
// inline "Retake the quiz" link right below its h1, and the quiz page
// itself IS the retake flow, so a retake link here would be redundant on
// both pages it renders on.
//
// Season Pass upsell (28 Sep 2026) does NOT live here — it's a primary/
// secondary CTA pair right under the paywall's own checkout button in
// TeaserResult.tsx, matching the "Buy Ticket Guide" / "Or get every guide
// in the Event Pack" pattern from SpokeShell.tsx, not a third sidebar box.
// getEventGuideCta — bottom action in "This Event": a real, activated pack
// links straight through (as before); an unbuilt/not-yet-activated pack
// (packStatus/isHidden, same isBuilt formula as the Season Planner's
// ShortlistResults.tsx) instead shows the Calendar page's own "Guide
// coming — get notified" inline pattern, wired to notifyMe() so the
// signup writes a real planner_sessions row (gateAction: "notified",
// gateActionEventIds: [eventId]) and gets picked up by the existing
// newsletter-new-pack-announcement cron's targeted send when this event
// activates. Fixed 28 Sep 2026 — this button previously linked straight to
// /event-pack/<slug> unconditionally, which 404'd/showed nothing for any
// event still isHidden/packStatus "planned" (caught live on Miami GP 2027,
// also present on Japanese and Chinese GP).
function EventGuideCta({
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
        className="flex items-center gap-2.5 py-4 px-5 -mx-5 -mb-5 mt-0 rounded-b-sm bg-[#AAFF00] hover:bg-[#BBFF33] transition-colors"
      >
        <span className="text-base flex-shrink-0 w-5 text-center">🎟</span>
        <span className="flex-1">
          <span className="block text-sm font-black text-black">Get the event guide</span>
          <span className="block text-xs text-black/65 mt-0.5">Trip costs, curated picks, booking detail</span>
        </span>
      </Link>
    );
  }

  if (status === "done") {
    return (
      <div className="py-4 px-5 -mx-5 -mb-5 mt-0">
        <p className="text-xs text-[#AAFF00]">You&apos;re on the list.</p>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2.5 py-4 px-5 -mx-5 -mb-5 mt-0 w-[calc(100%+2.5rem)] text-left hover:opacity-80 transition-opacity"
      >
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
      className="flex items-center gap-2 py-4 px-5 -mx-5 -mb-5 mt-0"
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

export default function TicketIntelligenceSidebar({
  eventSlug,
  eventId,
  sport,
  isBuilt,
  userEmail,
  showBudgetLink,
}: {
  eventSlug: string;
  eventId: string;
  sport: string;
  isBuilt: boolean;
  userEmail: string | null;
  // Gates "Budget your trip" (links to Price Radar) — founder executive
  // decision, 28 Sep 2026: only show this when flights, hotels, tickets,
  // food AND local travel are ALL seeded for this event's edition (see
  // hasFullPlannerCostData in getSeatingData.ts). Price Radar's own page
  // never blocks on missing data, so without this gate a partially-seeded
  // event (Miami GP 2027: 4 ticket tiers, zero flights/hotels/bands) linked
  // straight to a page that renders but shows an essentially empty table.
  showBudgetLink: boolean;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
        <p className="text-xs font-black tracking-widest uppercase text-white mb-3.5">
          This Event
        </p>

        {showBudgetLink && (
          <Link
            href={`/price-radar/${eventSlug}`}
            className="flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
          >
            <span className="text-base flex-shrink-0 w-5 text-center">💰</span>
            <span className="flex-1">
              <span className="block text-sm font-bold text-[#A3A3A3]">Budget your trip</span>
              <span className="block text-xs text-[#6A6A6A] mt-0.5">Real flight, hotel and ticket costs</span>
            </span>
          </Link>
        )}

        <Link
          href="/calendar"
          className="flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
        >
          <span className="text-base flex-shrink-0 w-5 text-center">📅</span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-[#A3A3A3]">See it on the calendar</span>
            <span className="block text-xs text-[#6A6A6A] mt-0.5">Dates, venue, full fixture</span>
          </span>
        </Link>

        <Link
          href="/custom-itinerary"
          className="flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
        >
          <span className="text-base flex-shrink-0 w-5 text-center">🧭</span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-[#A3A3A3]">Build a custom itinerary</span>
            <span className="block text-xs text-[#6A6A6A] mt-0.5">Tell us your trip, we&apos;ll shape it</span>
          </span>
        </Link>

        <EventGuideCta eventSlug={eventSlug} eventId={eventId} sport={sport} isBuilt={isBuilt} userEmail={userEmail} />
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
        <p className="text-xs font-black tracking-widest uppercase text-white mb-3.5">
          Your Personalized Seat Match
        </p>
        <Link
          href="/ticket-intelligence"
          className="flex items-center gap-2.5 py-3 hover:opacity-80 transition-opacity"
        >
          <span className="text-base flex-shrink-0 w-5 text-center">🎯</span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-[#A3A3A3]">Explore more events</span>
            <span className="block text-xs text-[#6A6A6A] mt-0.5">Match your ticket at every live event</span>
          </span>
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { notifyMe } from "@/app/planner/_lib/actions";
import { phEvent } from "@/lib/posthog-events";

// Mirrors app/ticket-intelligence/[slug]/_components/TicketIntelligenceSidebar.tsx's
// "This Event" box exactly (title, item set, Event Guide CTA as the
// highlighted bottom button) — founder direction, 20 Oct 2026. Originally
// omitted F1's second "Your Personalized Seat Match" box (no tennis picker
// page existed yet, 20 Oct 2026) — added once /ticket-intelligence/tennis
// (the tennis picker) shipped later the same day.
function EventGuideCta({
  eventSlug,
  eventId,
  sport,
  isBuilt,
  userEmail,
  variant = "bottom",
}: {
  eventSlug: string;
  eventId: string;
  sport: string;
  isBuilt: boolean;
  userEmail: string | null;
  // "bottom" (default): bleeds to the box's edges as its final, rounded-
  // bottom item. "top": same lime-filled styling, but as a normal
  // rounded-sm full-width button sitting under the "This Event" heading
  // (no edge-bleed — bleeding to the top edge would overlap/clip against
  // the heading text right above it, unlike the bottom case which has
  // nothing below it) — per the UX Journey Map spec (20 Nov 2026), same
  // fix as F1's TicketIntelligenceSidebar.tsx.
  variant?: "bottom" | "top";
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(userEmail ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const isTop = variant === "top";
  const built = isTop ? "flex items-center gap-2.5 py-4 px-5 mb-4 rounded-sm bg-[#AAFF00] hover:bg-[#BBFF33] transition-colors" : "flex items-center gap-2.5 py-4 px-5 -mx-5 -mb-5 mt-0 rounded-b-sm bg-[#AAFF00] hover:bg-[#BBFF33] transition-colors";
  const done = isTop ? "py-2 mb-4" : "py-4 px-5 -mx-5 -mb-5 mt-0";
  const closed = isTop ? "flex items-center gap-2.5 py-4 px-5 mb-4 rounded-sm border border-[#2A2A2A] w-full text-left hover:opacity-80 transition-opacity" : "flex items-center gap-2.5 py-4 px-5 -mx-5 -mb-5 mt-0 w-[calc(100%+2.5rem)] text-left hover:opacity-80 transition-opacity";
  const formWrap = isTop ? "flex items-center gap-2 py-2 mb-4" : "flex items-center gap-2 py-4 px-5 -mx-5 -mb-5 mt-0";

  if (isBuilt) {
    return (
      <Link
        href={`/event-pack/${eventSlug}`}
        onClick={() => phEvent.sidebarCtaClicked({ page: "ticket_intelligence_tennis", cta: "get_full_guide", slug: eventSlug })}
        className={built}
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
        phEvent.sidebarCtaClicked({ page: "ticket_intelligence_tennis", cta: "notify_me", slug: eventSlug });
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

const SPORT_LABELS: Record<string, string> = {
  tennis: "Tennis",
  cricket: "Cricket",
  football: "Football",
  rugby: "Rugby",
  golf: "Golf",
  formula_one: "Formula 1",
  cycling: "Cycling",
  athletics: "Athletics",
  other: "Sport",
};

export default function TennisTicketIntelligenceSidebar({
  eventSlug,
  eventId,
  sport,
  isBuilt,
  userEmail,
  showBudgetLink,
  showContinuationMessage = false,
  guideCtaAtTop = false,
}: {
  eventSlug: string;
  eventId: string;
  sport: string;
  isBuilt: boolean;
  userEmail: string | null;
  showBudgetLink: boolean;
  // This sidebar renders on the quiz entry and the real result — the UX
  // Journey Map spec's "Found your ticket match?" continuation message
  // belongs only on the real result page. Defaults off; only
  // result/page.tsx and TeaserResult.tsx's alreadyPurchased branch pass
  // true. Same reasoning as F1's TicketIntelligenceSidebar.tsx.
  showContinuationMessage?: boolean;
  // Independent from showContinuationMessage — moves "Get the event guide"
  // to the first item in "This Event" (EventGuideCta's "top" variant)
  // without the message card itself. Used on the quiz entry page
  // (TennisTicketQuiz.tsx), same reasoning as F1's TicketIntelligenceSidebar.tsx.
  // showContinuationMessage being true always implies this too.
  guideCtaAtTop?: boolean;
}) {
  const showGuideCtaAtTop = showContinuationMessage || guideCtaAtTop;

  return (
    <div className="flex flex-col gap-5">
      {/* Approved continuation message, per the UX Journey Map spec (20
          Nov 2026) — own card above the "This Event" box. "Get the event
          guide" is this screen's only real CTA (no second product to send
          a fan to, unlike Trip Intelligence's two-CTA case) and moves to
          the FIRST item inside the box (EventGuideCta's "top" variant)
          once this message is showing, rather than staying at the bottom.
          Real-result screen only — see showContinuationMessage's own
          comment above. */}
      {showContinuationMessage && (
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] px-5 py-4">
          <p className="text-sm font-black text-white mb-1.5">Found your ticket match? Now plan the rest of your event.</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            You&apos;ve explored the ticket options and identified the seating experience that suits you. Now
            discover more about your event — hotels, transit, dining, day trips and everything else you need
            around the event dates.
          </p>
        </div>
      )}

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
        <p className="text-xs font-black tracking-widest uppercase text-white mb-3.5">This Event</p>

        {showGuideCtaAtTop && (
          <EventGuideCta eventSlug={eventSlug} eventId={eventId} sport={sport} isBuilt={isBuilt} userEmail={userEmail} variant="top" />
        )}

        {showBudgetLink && (
          <Link
            href={`/price-radar/${eventSlug}`}
            onClick={() => phEvent.sidebarCtaClicked({ page: "ticket_intelligence_tennis", cta: "budget_trip", slug: eventSlug })}
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
          onClick={() => phEvent.sidebarCtaClicked({ page: "ticket_intelligence_tennis", cta: "calendar", slug: eventSlug })}
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
          onClick={() => phEvent.sidebarCtaClicked({ page: "ticket_intelligence_tennis", cta: "custom_itinerary", slug: eventSlug })}
          className="flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
        >
          <span className="text-base flex-shrink-0 w-5 text-center">🧭</span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-[#A3A3A3]">Build a custom itinerary</span>
            <span className="block text-xs text-[#6A6A6A] mt-0.5">Tell us your trip, we&apos;ll shape it</span>
          </span>
        </Link>

        <Link
          href={`/?sport=${sport}#on-the-calendar`}
          onClick={() => phEvent.sidebarCtaClicked({ page: "ticket_intelligence_tennis", cta: "see_upcoming_events", slug: eventSlug })}
          className="flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
        >
          <span className="text-base flex-shrink-0 w-5 text-center">🏆</span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-[#A3A3A3]">
              See upcoming {SPORT_LABELS[sport] ?? sport} events
            </span>
            <span className="block text-xs text-[#6A6A6A] mt-0.5">Don&apos;t miss the next one</span>
          </span>
        </Link>

        {/* Second-to-last item, directly above the Event Guide CTA —
            founder direction, 28 Oct 2026: every Trip/Ticket Intelligence
            sidebar (F1 and tennis, both surfaces) links to its sport's own
            Travel Planning Cockpit (/formula-1 or /tennis). */}
        <Link
          href="/tennis"
          onClick={() => phEvent.sidebarCtaClicked({ page: "ticket_intelligence_tennis", cta: "visit_cockpit", slug: eventSlug })}
          className="flex items-center gap-2.5 py-3 mb-4 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
        >
          <span className="text-base flex-shrink-0 w-5 text-center">🗺️</span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-[#A3A3A3]">Visit Travel Planning Cockpit</span>
            <span className="block text-xs text-[#6A6A6A] mt-0.5">Discover, compare and plan tennis trips</span>
          </span>
        </Link>

        {!showGuideCtaAtTop && (
          <EventGuideCta eventSlug={eventSlug} eventId={eventId} sport={sport} isBuilt={isBuilt} userEmail={userEmail} />
        )}
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
        <p className="text-xs font-black tracking-widest uppercase text-white mb-3.5">
          Your Personalized Ticket Match
        </p>
        <Link
          href="/ticket-intelligence/tennis"
          onClick={() => phEvent.sidebarCtaClicked({ page: "ticket_intelligence_tennis", cta: "explore_more_events", slug: eventSlug })}
          className="flex items-center gap-2.5 py-3 hover:opacity-80 transition-opacity"
        >
          <span className="text-base flex-shrink-0 w-5 text-center">🎯</span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-[#A3A3A3]">Explore more events</span>
            <span className="block text-xs text-[#6A6A6A] mt-0.5">Match your ticket at every live Grand Slam</span>
          </span>
        </Link>
      </div>
    </div>
  );
}

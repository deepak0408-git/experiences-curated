"use client";

import { useState } from "react";
import Link from "next/link";
import { notifyMe } from "@/app/planner/_lib/actions";
import { phEvent } from "@/lib/posthog-events";

// Same map used across the site (homepage, calendar, event pack, etc.) —
// the raw DB enum value should never be shown to visitors directly.
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
  // nothing below it) — per the UX Journey Map spec (20 Nov 2026): this
  // screen's one real CTA moves to the top of "This Event" once the
  // continuation message is showing above the box, rather than staying at
  // the bottom.
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
        onClick={() => phEvent.sidebarCtaClicked({ page: "ticket_intelligence", cta: "get_full_guide", slug: eventSlug })}
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
        phEvent.sidebarCtaClicked({ page: "ticket_intelligence", cta: "notify_me", slug: eventSlug });
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

export default function TicketIntelligenceSidebar({
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
  // Gates "Budget your trip" (links to Price Radar) — founder executive
  // decision, 28 Sep 2026: only show this when flights, hotels, tickets,
  // food AND local travel are ALL seeded for this event's edition (see
  // hasFullPlannerCostData in getSeatingData.ts). Price Radar's own page
  // never blocks on missing data, so without this gate a partially-seeded
  // event (Miami GP 2027: 4 ticket tiers, zero flights/hotels/bands) linked
  // straight to a page that renders but shows an essentially empty table.
  showBudgetLink: boolean;
  // This sidebar renders on three screens (quiz entry, paywalled teaser,
  // real result) — the UX Journey Map spec's "Found your seat match?"
  // continuation message belongs only on the real recommendations/result
  // page (result/page.tsx), never the quiz entry or the pre-purchase
  // teaser, where no seat match has actually been revealed yet. Defaults
  // off; only result/page.tsx and TeaserResult.tsx's alreadyPurchased
  // branch pass true.
  showContinuationMessage?: boolean;
  // Independent from showContinuationMessage — moves "Get the event guide"
  // to the first item in "This Event" (EventGuideCta's "top" variant)
  // without the message card itself. Used on the quiz entry page
  // (TicketQuiz.tsx), per founder direction 20 Nov 2026: same CTA
  // placement as the real-result screens, even though no seat match has
  // been revealed yet here, so there's no "Found your seat match?" copy to
  // show. showContinuationMessage being true always implies this too.
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
          <p className="text-sm font-black text-white mb-1.5">Found your seat match? Now plan the rest of your event.</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            You&apos;ve explored the ticket options and identified the seating experience that suits you. Now
            discover more about your event — hotels, transit, dining, day trips and everything else you need
            around the event dates.
          </p>
        </div>
      )}

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
        <p className="text-xs font-black tracking-widest uppercase text-white mb-3.5">
          This Event
        </p>

        {showGuideCtaAtTop && (
          <EventGuideCta eventSlug={eventSlug} eventId={eventId} sport={sport} isBuilt={isBuilt} userEmail={userEmail} variant="top" />
        )}

        {showBudgetLink && (
          <Link
            href={`/price-radar/${eventSlug}`}
            onClick={() => phEvent.sidebarCtaClicked({ page: "ticket_intelligence", cta: "budget_trip", slug: eventSlug })}
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
          onClick={() => phEvent.sidebarCtaClicked({ page: "ticket_intelligence", cta: "calendar", slug: eventSlug })}
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
          onClick={() => phEvent.sidebarCtaClicked({ page: "ticket_intelligence", cta: "custom_itinerary", slug: eventSlug })}
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
          onClick={() => phEvent.sidebarCtaClicked({ page: "ticket_intelligence", cta: "see_upcoming_events", slug: eventSlug })}
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
          href="/formula-1"
          onClick={() => phEvent.sidebarCtaClicked({ page: "ticket_intelligence", cta: "visit_cockpit", slug: eventSlug })}
          className="flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
        >
          <span className="text-base flex-shrink-0 w-5 text-center">🗺️</span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-[#A3A3A3]">Visit Travel Planning Cockpit</span>
            <span className="block text-xs text-[#6A6A6A] mt-0.5">Discover, compare and plan F1 trips</span>
          </span>
        </Link>

        {/* "Watch how Ticket Intelligence works" — added 19 Nov 2026, right
            below Visit Travel Planning Cockpit per founder direction.
            Opens the actual YouTube link directly (not an in-page embed) —
            a sidebar row is a navigation link, same as every other row
            here, not a place to embed a player. Plain <a>, not next/link's
            Link, since this is a genuinely external URL opening in a new
            tab — same convention as the reseller links in FullResult.tsx
            (CLAUDE.md's Link-over-<a> rule is about internal paths and
            bfcache, which doesn't apply to an external new-tab link). */}
        <a
          href="https://www.youtube.com/watch?v=ROsERYXtY2g"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => phEvent.sidebarCtaClicked({ page: "ticket_intelligence", cta: "watch_how_it_works", slug: eventSlug })}
          className="flex items-center gap-2.5 py-3 mb-4 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
        >
          <span className="text-base flex-shrink-0 w-5 text-center leading-none">🎬</span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-[#A3A3A3]">Watch how this works</span>
            <span className="block text-xs text-[#6A6A6A] mt-0.5">A short video walkthrough</span>
          </span>
        </a>

        {!showGuideCtaAtTop && (
          <EventGuideCta eventSlug={eventSlug} eventId={eventId} sport={sport} isBuilt={isBuilt} userEmail={userEmail} />
        )}
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
        <p className="text-xs font-black tracking-widest uppercase text-white mb-3.5">
          Your Personalized Seat Match
        </p>
        <Link
          href="/ticket-intelligence"
          onClick={() => phEvent.sidebarCtaClicked({ page: "ticket_intelligence", cta: "explore_more_events", slug: eventSlug })}
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

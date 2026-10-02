"use client";

import { useState } from "react";
import Link from "next/link";
import { subscribeToNewsletter } from "@/app/newsletter/actions";

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

// Same 4-action model as blog's ArticleActionSidebar (see that file for the
// locked design rationale — all real next actions shown at once, no forced
// sequencing). This is the experience-page variant: every experience has an
// eventPackSlug/eventPackName (defaults to Wimbledon per getExperienceData
// in page.tsx), so "This Experience" always renders — no fallback/standalone
// state needed here the way the blog sidebar needs one for event-agnostic
// articles.
//
// !hasLivePack notify state reuses the exact same pattern as the Calendar
// page's NotifyMeButton — subscribeToNewsletter(email, source), not a new
// per-event interest table. newsletter_subscribers has no per-event
// granularity, same reasoning as NotifyMeButton's own comment. userEmail
// pre-fills the input for a signed-in visitor, same fix as NotifyMeButton
// (19 Sep 2026).

export default function ExperienceActionSidebar({
  eventPackSlug,
  eventPackName,
  eventPackFormat,
  hasLivePack,
  userEmail,
  showTicketIntelligenceLink,
  sport,
  experienceSlug,
}: {
  eventPackSlug: string;
  eventPackName: string;
  // Added 25 Sep 2026 for the Price Radar link below — only hub_and_spoke
  // events have a real /price-radar page (it depends on getSpokeData).
  // Classic events (e.g. US Open, Belgian GP) fall back to /planner.
  eventPackFormat: string | null;
  hasLivePack: boolean;
  userEmail: string | null;
  // "Find your perfect seat" row — gated sport-only (F1 + real seeded
  // Ticket Intelligence data) as of 30 Sep 2026, computed by the page from
  // eventPackSport/eventPackId + hasTicketIntelligence(). Deliberately NOT
  // per-experience filtered yet — see page.tsx's showTicketIntelligenceLink
  // comment for the documented gaps in that filter (scratchpad/
  // _ti-sidebar-filter-table.md) that are still open.
  showTicketIntelligenceLink: boolean;
  // DB sport enum (e.g. "formula_one") for the "See upcoming X events" link
  // below — same eventPackSport the page already resolves for Ticket
  // Intelligence gating. Optional since not every experience resolves one.
  sport?: string;
  // This experience's own slug — used to build the Ticket Intelligence
  // back-link (?from=experience:<slug>) so a visitor who arrives there from
  // here returns to this exact experience, not the generic event guide.
  experienceSlug: string;
}) {
  const canPlanCosts = eventPackFormat === "hub_and_spoke";
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
      <p className="text-xs font-black tracking-widest uppercase text-white mb-3.5">
        This Experience
      </p>

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

      {/* Links to Price Radar when eligible (hub_and_spoke, real data),
          else falls back to /planner — href replaced 25 Sep 2026. See
          ArticleActionSidebar.tsx's comment for why the old plain /planner
          link was already known-broken as a deep-link. Label/copy
          deliberately kept as "Budget your trip" in both cases per founder
          instruction (same day) — only the destination changes. */}
      <Link
        href={canPlanCosts ? `/price-radar/${eventPackSlug}` : "/planner"}
        className="flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
      >
        <span className="text-base flex-shrink-0 w-5 text-center">💰</span>
        <span className="flex-1">
          <span className="block text-sm font-bold text-[#A3A3A3]">Budget your trip</span>
          <span className="block text-xs text-[#6A6A6A] mt-0.5">Real flight, hotel and ticket costs</span>
        </span>
      </Link>

      {showTicketIntelligenceLink && (
        <Link
          href={`/ticket-intelligence/${eventPackSlug}?from=${encodeURIComponent(`experience:${experienceSlug}`)}`}
          className="flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
        >
          <span className="text-base flex-shrink-0 w-5 text-center">🎯</span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-[#A3A3A3]">Find your perfect seat</span>
            <span className="block text-xs text-[#6A6A6A] mt-0.5">Answer 6 questions, get matched to a seat</span>
          </span>
        </Link>
      )}

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

      {sport && (
        <Link
          href={`/?sport=${sport}#on-the-calendar`}
          className="flex items-center gap-2.5 py-3 mb-4 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
        >
          <span className="text-base flex-shrink-0 w-5 text-center">🏆</span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-[#A3A3A3]">
              See upcoming {SPORT_LABELS[sport] ?? sport} events
            </span>
            <span className="block text-xs text-[#6A6A6A] mt-0.5">Don&apos;t miss the next one</span>
          </span>
        </Link>
      )}

      {hasLivePack ? (
        <Link
          href={`/event-pack/${eventPackSlug}`}
          className="flex items-center gap-2.5 py-4 px-5 -mx-5 -mb-5 mt-0 rounded-b-sm bg-[#AAFF00] hover:bg-[#BBFF33] transition-colors"
        >
          <span className="text-base flex-shrink-0 w-5 text-center">🎟</span>
          <span className="flex-1">
            <span className="block text-sm font-black text-black">Get the full guide</span>
            <span className="block text-xs text-black/65 mt-0.5">Seating, arrival timing, where to stay</span>
          </span>
        </Link>
      ) : (
        <NotifyMeRow eventPackName={eventPackName} userEmail={userEmail} />
      )}
    </div>
  );
}

function NotifyMeRow({ eventPackName, userEmail }: { eventPackName: string; userEmail: string | null }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(userEmail ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  if (status === "done") {
    return (
      <div className="flex items-center gap-2.5 py-3">
        <span className="text-base flex-shrink-0 w-5 text-center">✓</span>
        <span className="text-sm font-bold text-[#AAFF00]">You&apos;re on the list</span>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2.5 py-3 text-left hover:opacity-80 transition-opacity"
      >
        <span className="text-base flex-shrink-0 w-5 text-center">🔔</span>
        <span className="flex-1">
          <span className="block text-sm font-bold text-[#6A6A6A]">Guide coming — get notified</span>
          <span className="block text-xs text-[#6A6A6A] mt-0.5">We&apos;ll email you when it&apos;s live</span>
        </span>
      </button>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("loading");
        const result = await subscribeToNewsletter(email, "experience_page");
        setStatus(result.ok ? "done" : "error");
      }}
      className="py-3"
    >
      <p className="text-xs text-[#6A6A6A] mb-2">We&apos;ll email you when the {eventPackName} guide is live.</p>
      <div className="flex items-center gap-2">
        <input
          type="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-label={`Get notified when the ${eventPackName} guide is live`}
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

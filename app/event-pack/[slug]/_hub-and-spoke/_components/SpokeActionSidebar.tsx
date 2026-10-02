import Link from "next/link";

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

// Same 4-action model as blog's ArticleActionSidebar / experience page's
// ExperienceActionSidebar. Spoke-page variant: rendered inside SpokeShell
// (which only ever renders for an event whose hub-and-spoke pack already
// exists and is being actively viewed — so unlike the other two sidebars,
// there's no "pack not live yet" state to branch on here) and, as of 27 Sep
// 2026, also reused directly on Price Radar's own page. The 4th action
// always points back to the hub, same destination as SpokeShell's own
// "All N guides" nav link, just reframed as a clear commerce CTA.

export default function SpokeActionSidebar({
  eventSlug,
  hideBudgetRow,
  heading,
  showTicketIntelligence,
  showPlannerLink,
  finalCtaLabel,
  finalCtaSubtext,
  sport,
  spokeId,
  spokeLabel,
}: {
  eventSlug: string;
  // Suppresses the "Budget your trip" row — set true when this sidebar
  // renders ON Price Radar itself (that row's destination IS the current
  // page, so it would just be a pointless self-link/reload). Added 27 Sep
  // 2026 when this sidebar was reused on Price Radar's page for the first
  // time.
  hideBudgetRow?: boolean;
  // Overrides the default "This Guide" heading — Price Radar uses
  // "This Event" instead (founder direction, 27 Sep 2026), since it's not
  // itself a spoke/guide page. Every spoke page keeps the default.
  heading?: string;
  // Real, data-driven check (does this event have any
  // circuit_seating_profile rows?) passed in from the page — this
  // component has no DB access itself. Added 27 Sep 2026 (Price Radar's
  // sidebar). Only shows the row when true; never a hardcoded per-event
  // list.
  showTicketIntelligence?: boolean;
  // Adds a "Compare trip costs with other events" row linking to /planner.
  // Price-Radar-only per founder direction 27 Sep 2026 — every spoke page
  // keeps the default (no row), since it would duplicate the "Budget your
  // trip" row's destination context there.
  showPlannerLink?: boolean;
  // Overrides the bottom CTA's label/subtext — Price Radar uses the exact
  // same "Get the Event Guide" / "Trip costs, curated picks, booking
  // detail" wording as TicketIntelligenceSidebar's equivalent row (founder
  // direction 27 Sep 2026: "we need a consistent UI experience for the
  // fan"). Every spoke page keeps the default "Get the full guide" /
  // "Every planning guide in one place" wording.
  finalCtaLabel?: string;
  finalCtaSubtext?: string;
  // DB sport enum (e.g. "formula_one") for the "See upcoming X events" row
  // below — same eventSport SpokeShell already resolves. Optional since not
  // every caller (e.g. Price Radar) necessarily has it.
  sport?: string;
  // This spoke's own id/label — used to build the Ticket Intelligence
  // back-link (?from=spoke:<id>) so a visitor who arrives there from a
  // spoke page returns to this exact spoke, not the generic hub page.
  // Price Radar (not a spoke) never passes these, so that link falls back
  // to the generic hub destination, same as before.
  spokeId?: string;
  spokeLabel?: string;
}) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
      <p className="text-xs font-black tracking-widest uppercase text-white mb-3.5">
        {heading ?? "This Guide"}
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

      {/* Links to Price Radar, not /planner — SpokeActionSidebar only ever
          renders for an event whose hub-and-spoke pack already exists (see
          file header comment), so this event always has a real Price Radar
          page; no eligibility check needed here. href replaced 25 Sep 2026,
          same reasoning as ArticleActionSidebar/ExperienceActionSidebar/
          CalendarEventRow — label/copy deliberately kept as "Budget your
          trip" per founder instruction (same day), only the destination
          changed. */}
      {!hideBudgetRow && (
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

      {showTicketIntelligence && (
        <Link
          href={`/ticket-intelligence/${eventSlug}${
            spokeId
              ? `?from=${encodeURIComponent(`spoke:${spokeId}`)}${spokeLabel ? `&fromLabel=${encodeURIComponent(spokeLabel)}` : ""}`
              : ""
          }`}
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

      {showPlannerLink && (
        <Link
          href="/planner"
          className="flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
        >
          <span className="text-base flex-shrink-0 w-5 text-center">📊</span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-[#A3A3A3]">Compare costs with other events</span>
            <span className="block text-xs text-[#6A6A6A] mt-0.5">Real flight, hotel and ticket costs</span>
          </span>
        </Link>
      )}

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

      <Link
        href={`/event-pack/${eventSlug}`}
        className="flex items-center gap-2.5 py-4 px-5 -mx-5 -mb-5 mt-0 rounded-b-sm bg-[#AAFF00] hover:bg-[#BBFF33] transition-colors"
      >
        <span className="text-base flex-shrink-0 w-5 text-center">🎟</span>
        <span className="flex-1">
          <span className="block text-sm font-black text-black">{finalCtaLabel ?? "Get the full guide"}</span>
          <span className="block text-xs text-black/65 mt-0.5">{finalCtaSubtext ?? "Every planning guide in one place"}</span>
        </span>
      </Link>
    </div>
  );
}

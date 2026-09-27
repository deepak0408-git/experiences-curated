import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import HomepageNav from "@/app/_components/HomepageNav";
import { getAuthUser } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { plannerTicketTierSportLabel } from "@/schema/database";
import { eq } from "drizzle-orm";
import { getSpokeData } from "../../event-pack/[slug]/_hub-and-spoke/_lib/getSpokeData";
import { INTRO_BY_EVENT } from "../../event-pack/[slug]/_hub-and-spoke/HubPage";
import SpokeActionSidebar from "../../event-pack/[slug]/_hub-and-spoke/_components/SpokeActionSidebar";
import { hasTicketIntelligence } from "../../ticket-intelligence/[slug]/_lib/getSeatingData";
import { PriceRadarProvider, PriceRadarFilters, PriceRadarResults } from "./_components/PriceRadarTable";

// Price Radar — free, public, citable cost-index page. Pilot event: US GP
// 2026 (united-states-grand-prix). See project_seven_revenue_models_review
// memory for the strategic origin (revenue-model idea #1, "become the cost
// index for sports travel").
//
// REBUILT 25 Sep 2026 after the first pass was rejected live — v1 copied
// CostSpoke.tsx's card/narrative structure almost verbatim (spend-tier
// cards, "four ways to do this trip" copy, advice voice), which read as a
// duplicate of the pack's own free Cost spoke rather than a genuinely
// different, citable data asset. Founder's replacement spec (25 Sep 2026,
// dictated directly): ONE table, no cards, no advice voice — city
// (region-grouped, same grouping as the Planner's origin-market picker) x
// flight/hotel/ticket/food/local-travel/total, with Hotel Tier and Ticket
// Tier as top-level filters. Filter UI copied pixel-for-pixel from
// PlannerIntakeForm.tsx's "Which sport?" block (eyebrow + description +
// pill row) per founder screenshot, so this reads as a sibling of the
// Planner's own tools rather than inventing new UI language.
//
// Deliberately still a SEPARATE surface from the pack's own Cost spoke: the
// Cost spoke's flight range is curated/narrowed to this event's real
// dominant fan base (e.g. US GP excludes Canada — see CostSpoke.tsx), while
// this table shows all 49 seeded markets with zero exclusions, since its
// job is SEO long-tail + citability, not a curated narrative.
//
// Reuses getSpokeData(slug) for flights/hotels/tickets/destinationBand/
// costDataVerifiedAt — same cached, edition-year-and-seasonal-band-filtered
// query every spoke already uses. No new DB query logic beyond the ticket
// tier label fallback below.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getSpokeData(slug).catch(() => null);
  if (!data) return { title: "Price Radar" };
  const { event, flights } = data;

  // Real, curated display name (same source HubPage.tsx uses for its own
  // H1/venueLine) — falls back to the raw event.name for any hub-and-spoke
  // event not yet added to INTRO_BY_EVENT. Generalized into a template
  // 25 Sep 2026 (was hardcoded to US GP only) — "How much does the X Cost"
  // reads naturally across every current event (GP, Slam, or series), so
  // no per-event override was needed to extend it.
  const displayName = INTRO_BY_EVENT[slug]?.displayName ?? event.name;
  const title = `How much does the ${displayName} Cost`;
  const description = flights.length
    ? `Flight, hotel, ticket, food and local travel costs for ${event.name}, across ${flights.length} origin cities. Free, sourced, filterable by tier.`
    : `Real cost data for ${event.name} — free, sourced, and filterable by tier.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: event.heroImageUrl ? [{ url: event.heroImageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: event.heroImageUrl ? [event.heroImageUrl] : [],
    },
  };
}

export default async function PriceRadarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { user } = await getAuthUser();

  const data = await getSpokeData(slug).catch(() => {
    notFound();
  });
  if (!data) notFound();
  const { event, hotels, tickets, destinationBand, flights, costDataVerifiedAt } = data;
  if (!event) notFound();

  const showTicketIntelligence = await hasTicketIntelligence(event.id);

  // Sport-level default ticket tier labels (e.g. F1's "Grandstand" family)
  // — fallback for any tier this event hasn't set a real eventTierLabel
  // override for. DB-driven, not hardcoded — see plannerTicketTierSportLabel
  // schema comment.
  const sportLabels = await db
    .select({ tierKey: plannerTicketTierSportLabel.tierKey, defaultLabel: plannerTicketTierSportLabel.defaultLabel })
    .from(plannerTicketTierSportLabel)
    .where(eq(plannerTicketTierSportLabel.sport, event.sport));
  const sportLabelByTier = Object.fromEntries(sportLabels.map((r) => [r.tierKey, r.defaultLabel]));

  // Short label (sport-level default, e.g. F1's "Grandstand") kept
  // separate from the full event-specific eventTierLabel (e.g. "Turn
  // 4/9/12/15/19 Grandstand") — the ticket tier filter shows both:
  // "Grandstand — e.g. Turn 4/9/12/15/19 Grandstand", per founder spec
  // 25 Sep 2026. Falls back to the tier key itself only if this sport has
  // no row in plannerTicketTierSportLabel yet.
  const ticketTiers = tickets.map((t) => ({
    tier: t.tier,
    label: sportLabelByTier[t.tier] ?? t.tier,
    example: t.eventTierLabel ?? sportLabelByTier[t.tier] ?? t.tier,
    costLow: Number(t.costLow),
    costHigh: Number(t.costHigh),
  }));

  const hotelTiers = hotels.map((h) => ({
    tier: h.tier,
    costLow: Number(h.costLow),
    costHigh: Number(h.costHigh),
  }));

  const flightsByCity = flights.map((f) => ({
    city: f.originMarket,
    region: f.region,
    costLow: Number(f.costLow),
    costHigh: Number(f.costHigh),
  }));

  const foodBand = destinationBand
    ? { low: Number(destinationBand.foodPerDayLow), high: Number(destinationBand.foodPerDayHigh) }
    : null;
  const localTravelBand = destinationBand
    ? { low: Number(destinationBand.localTravelLow), high: Number(destinationBand.localTravelHigh) }
    : null;
  // Real, per-destination narrative notes (not every destination has these
  // written) — same fields CostSpoke.tsx already surfaces ("Getting
  // around, cheaply" / "A local money-saving trick"). Added to Price
  // Radar's footnotes 25 Sep 2026, alongside the generic column captions.
  const localTravelNote = destinationBand?.localTravelNote ?? null;
  const foodNote = destinationBand?.foodNote ?? null;

  // Same curated displayName as generateMetadata above — real, sourced
  // per-event name (falls back to event.name), used for the H1/summary/
  // footer copy so the page never shows a raw internal event.name that
  // doesn't match how the event is actually presented elsewhere on the
  // site (e.g. Bahrain GP's "Bahrain Grand Prix in Malaysia").
  const displayName = INTRO_BY_EVENT[slug]?.displayName ?? event.name;

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <HomepageNav email={user?.email ?? null} secondaryLink={{ href: "/planning-methodology", label: "Planning Methodology", mobileLabel: "Planning Method" }} />

      <PriceRadarProvider
        flights={flightsByCity}
        hotelTiers={hotelTiers}
        ticketTiers={ticketTiers}
        food={foodBand}
        localTravel={localTravelBand}
        localTravelNote={localTravelNote}
        foodNote={foodNote}
      >
        {/* Narrow container (max-w-6xl, same as the page's original width)
            for the title/filters + sidebar grid — kept intentionally
            narrower than the table below it, per founder direction 27 Sep
            2026: cramming the wide table into this same narrow column (the
            first attempt at adding the sidebar) visibly squeezed its
            columns. Table renders in its own separate, wider container
            further down instead. */}
        <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-12">
          {/* Eyebrow + backlink share a row, right-aligned backlink — same
              pattern as the Ticket Intelligence quiz page. Added 27 Sep
              2026. */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00]">
              Price Radar
            </p>
            <Link
              href={`/event-pack/${slug}`}
              className="text-xs font-semibold text-[#6A6A6A] hover:text-[#AAFF00] underline transition-colors"
            >
              ← Back to {displayName} guide
            </Link>
          </div>

          <div className="grid lg:grid-cols-[1fr_300px] gap-14 items-start">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">
                {displayName} — real trip cost by city
              </h1>
              {costDataVerifiedAt && (
                <p className="mt-3 text-xs text-[#6A6A6A]">
                  Prices verified {costDataVerifiedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} — not real-time. All figures USD. See our{" "}
                  <Link href="/planning-methodology" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
                    Planning methodology
                  </Link>.
                </p>
              )}

              <PriceRadarFilters />
            </div>

            <SpokeActionSidebar
              eventSlug={slug}
              hideBudgetRow
              heading="This Event"
              showTicketIntelligence={showTicketIntelligence}
              showPlannerLink
              finalCtaLabel="Get the event guide"
              finalCtaSubtext="Trip costs, curated picks, booking detail"
            />
          </div>
        </div>

        {/* Full-width container for the results table — deliberately wider
            than the max-w-6xl grid above it, so the table's own columns
            keep their original, uncompressed width regardless of the
            sidebar. */}
        <div className="max-w-6xl mx-auto px-6 sm:px-8 pb-12">
          <PriceRadarResults />
        </div>
      </PriceRadarProvider>
    </main>
  );
}

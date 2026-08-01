import { db } from "@/lib/db";
import {
  sportingEvents,
  experiences,
  sportingEventExperiences,
  plannerHotelTierCost,
  plannerTicketTierCost,
  plannerDestinationBands,
} from "@/schema/database";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";

// Shared data fetch for the pilot hub + all 12 spokes. Pulls real Italian GP
// data once, in one shape, so every spoke page (and the hub index) reads
// from the same source rather than each re-deriving its own query.
//
// Still the live slug (italian-gp-2026) — pilot only, evergreen-slug
// migration is separate, deliberately not bundled into this.
const EVENT_SLUG = "italian-gp-2026";

// Day trips — curated pick, NOT a live experienceType='day_trip' filter.
// Confirmed against the real DB while building the first pilot pass: zero
// Italian GP experiences carry that type tag today, even though 3 are
// genuinely day-trip-shaped (mistagged as cultural_site/neighborhood/
// accommodation instead). Named explicitly here rather than silently
// querying for a type that returns nothing. Retagging these 3 is a real,
// separate follow-up — not done as part of this pilot.
const DAY_TRIP_SLUGS = ["alfa-romeo-museum-arese", "monza-town-the-royal-villa", "lake-como-race-weekend-from-the-lake"];

export async function getSpokeData() {
  const [event] = await db.select().from(sportingEvents).where(eq(sportingEvents.slug, EVENT_SLUG)).limit(1);
  if (!event) notFound();

  const linkedExperiences = await db
    .select({
      id: experiences.id,
      slug: experiences.slug,
      title: experiences.title,
      subtitle: experiences.subtitle,
      experienceType: experiences.experienceType,
      budgetTier: experiences.budgetTier,
      neighborhood: experiences.neighborhood,
      heroImageUrl: experiences.heroImageUrl,
      practicalInfo: experiences.practicalInfo,
      whyItsSpecial: experiences.whyItsSpecial,
      packRank: sportingEventExperiences.packRank,
    })
    .from(sportingEventExperiences)
    .innerJoin(experiences, eq(experiences.id, sportingEventExperiences.experienceId))
    .where(and(eq(sportingEventExperiences.sportingEventId, event.id), eq(experiences.status, "published")))
    .orderBy(sportingEventExperiences.packRank);

  const hotels = event.destinationId
    ? await db.select().from(plannerHotelTierCost).where(eq(plannerHotelTierCost.destinationId, event.destinationId))
    : [];
  const tickets = await db.select().from(plannerTicketTierCost).where(eq(plannerTicketTierCost.sportingEventId, event.id));
  const [destinationBand] = event.destinationId
    ? await db.select().from(plannerDestinationBands).where(eq(plannerDestinationBands.destinationId, event.destinationId))
    : [];

  return {
    event,
    linkedExperiences,
    hotels,
    tickets,
    destinationBand,
    diningExperiences: linkedExperiences.filter((e) => e.experienceType === "dining"),
    accommodationExperiences: linkedExperiences.filter((e) => e.experienceType === "accommodation"),
    transitExperiences: linkedExperiences.filter((e) => e.experienceType === "transit"),
    dayTrips: linkedExperiences.filter((e) => DAY_TRIP_SLUGS.includes(e.slug)),
    luxuryExperiences: linkedExperiences.filter((e) => e.budgetTier === "splurge" || e.budgetTier === "luxury"),
    dateRange: `${new Date(event.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}–${new Date(event.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`,
  };
}

export type SpokeStatus = "public" | "teaser" | "gated";

// imageSlug — a substring matched against real experience slugs (see
// getSpokeImage below) to pick which already-uploaded photo represents this
// spoke on the hub tile grid. Picked for thematic fit (e.g. the ticket
// guide borrows a grandstand photo, not because that experience "belongs"
// to the ticket guide). All 16 Italian GP experiences confirmed to have
// real hero images (checked 27 Jul 2026) — no placeholder/stock imagery
// used anywhere in this pilot. Matched by substring rather than exact slug
// since real slugs carry unique-id suffixes (e.g.
// "grandstand-26-pit-lane-grid-podium-mqz5lk5k").
export const SPOKES: { id: string; label: string; question: string; status: SpokeStatus; href: string; imageSlug: string }[] = [
  { id: "cost", label: "Cost Guide", question: "How much does a Monza weekend cost?", status: "teaser", href: "/event-pack-preview/italian-grand-prix/cost", imageSlug: "grandstand-26-pit-lane-grid-podium" },
  { id: "tickets", label: "Ticket Guide", question: "Monza grandstand vs general admission — what's the difference?", status: "teaser", href: "/event-pack-preview/italian-grand-prix/tickets", imageSlug: "curva-grande-general-admission" },
  { id: "hotels", label: "Where to Stay", question: "Where should I stay for Monza F1?", status: "teaser", href: "/event-pack-preview/italian-grand-prix/hotels", imageSlug: "hotel-de-la-ville-monza" },
  { id: "getting-there", label: "Getting There", question: "How do I get to Monza from Milan, and how far is the walk?", status: "public", href: "/event-pack-preview/italian-grand-prix/getting-there", imageSlug: "getting-to-the-circuit-monza" },
  { id: "weather", label: "Weather & What to Pack", question: "What's the weather like at Monza, and what should I pack?", status: "public", href: "/event-pack-preview/italian-grand-prix/weather", imageSlug: "the-fan-zone-ascari-to-parabolica" },
  { id: "first-timer-guide", label: "First-Timer's Guide", question: "What do first-time Monza visitors get wrong?", status: "public", href: "/event-pack-preview/italian-grand-prix/first-timer-guide", imageSlug: "the-tifosi-ferraris-red-army" },
  { id: "where-to-eat", label: "Where to Eat", question: "Where to eat near Monza during race weekend?", status: "teaser", href: "/event-pack-preview/italian-grand-prix/where-to-eat", imageSlug: "eating-in-monza-risotto-luganega" },
  { id: "day-trips", label: "Day Trips", question: "What are the best day trips from Monza?", status: "teaser", href: "/event-pack-preview/italian-grand-prix/day-trips", imageSlug: "lake-como-race-weekend-from-the-lake" },
  { id: "itinerary", label: "Your Race Weekend Plan", question: "What does a 3-day Monza GP weekend actually look like?", status: "gated", href: "/event-pack-preview/italian-grand-prix/itinerary", imageSlug: "monza-town-royal-villa" },
  { id: "arrival", label: "Arrival & Queue Guide", question: "What time should I arrive at Monza gates?", status: "public", href: "/event-pack-preview/italian-grand-prix/arrival", imageSlug: "grandstand-22-parabolica-corner" },
  { id: "map", label: "Venue Map", question: "Where are the Monza grandstands on the circuit map?", status: "public", href: "/event-pack-preview/italian-grand-prix/map", imageSlug: "history-of-monza-walking-old-banking" },
  { id: "luxury", label: "Luxury Guide", question: "What's the best paddock club / luxury option at Monza?", status: "teaser", href: "/event-pack-preview/italian-grand-prix/luxury", imageSlug: "paddock-club-champions-club-hospitality" },
];

export function getSpokeImage(linkedExperiences: { slug: string; heroImageUrl: string | null }[], imageSlug: string): string | null {
  return linkedExperiences.find((e) => e.slug.includes(imageSlug))?.heroImageUrl ?? null;
}

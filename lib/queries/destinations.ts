import { db } from "@/lib/db";
import { destinations, experiences, sportingEvents } from "@/schema/database";
import { eq, and, asc, desc, isNotNull, gte, sql } from "drizzle-orm";
import { notFound } from "next/navigation";

// "Nearby" events radius — confirmed with founder 1 Oct 2026 during the
// destination-page brainstorm. Not a day-trip-commute distance (CLAUDE.md's
// day-trip rule uses ~30-45 min); this is a looser "worth mentioning on this
// city's page" radius.
const NEARBY_RADIUS_KM = 200;

export async function getDestinationBySlug(slug: string) {
  const results = await db
    .select()
    .from(destinations)
    .where(eq(destinations.slug, slug))
    .limit(1);

  if (!results.length) notFound();
  return results[0];
}

export type DestinationDetail = Awaited<ReturnType<typeof getDestinationBySlug>>;

export async function getDestinationExperiences(destinationId: string) {
  return db
    .select({
      id: experiences.id,
      slug: experiences.slug,
      title: experiences.title,
      subtitle: experiences.subtitle,
      experienceType: experiences.experienceType,
      budgetTier: experiences.budgetTier,
      heroImageUrl: experiences.heroImageUrl,
      heroImageAlt: experiences.heroImageAlt,
      pace: experiences.pace,
      neighborhood: experiences.neighborhood,
      availability: experiences.availability,
      bookingLinks: experiences.bookingLinks,
    })
    .from(experiences)
    .where(
      and(
        eq(experiences.destinationId, destinationId),
        eq(experiences.status, "published")
      )
    )
    .orderBy(desc(experiences.publishedAt));
}

export type DestinationExperience = Awaited<ReturnType<typeof getDestinationExperiences>>[number];

// Events whose destinationId matches this destination directly.
//
// Deliberately NOT filtered on isHidden/packStatus — this page shows
// planned/hidden events too, badged "Coming soon" with no link-through.
// Confirmed explicitly in the 1 Oct 2026 destination-page brainstorm as an
// intentional exception to how every other surface (homepage calendar,
// Algolia search) filters hidden events. Do not "fix" this to match those
// without checking back first.
//
// DOES filter to endDate >= today though — same as the homepage's "On the
// calendar" section (app/page.tsx) — a past event (e.g. "India in England
// 2026" once its July 2026 dates have passed) has nothing left to show for
// either persona this page serves. Founder-confirmed 1 Oct 2026.
export async function getDestinationSportingEvents(destinationId: string) {
  const today = new Date().toISOString().split("T")[0];
  return db
    .select({
      id: sportingEvents.id,
      slug: sportingEvents.slug,
      name: sportingEvents.name,
      sport: sportingEvents.sport,
      startDate: sportingEvents.startDate,
      endDate: sportingEvents.endDate,
      packStatus: sportingEvents.packStatus,
      isHidden: sportingEvents.isHidden,
      earlyBirdDisplay: sportingEvents.earlyBirdDisplay,
      standardDisplay: sportingEvents.standardDisplay,
      editorialOverview: sportingEvents.editorialOverview,
      heroImageUrl: sportingEvents.heroImageUrl,
      packFormat: sportingEvents.packFormat,
    })
    .from(sportingEvents)
    .where(and(eq(sportingEvents.destinationId, destinationId), gte(sportingEvents.endDate, today)))
    .orderBy(asc(sportingEvents.startDate));
}

export type DestinationSportingEvent = Awaited<ReturnType<typeof getDestinationSportingEvents>>[number];

// Events belonging to OTHER destinations, within NEARBY_RADIUS_KM of this
// destination's centroid. Requires both sides to have lat/lng — returns []
// (never throws) when the source destination has no coordinates, so the
// page's "Nearby" section degrades to simply not rendering rather than
// erroring. Haversine computed in SQL (no PostGIS/extra dependency).
export async function getNearbyDestinationEvents(destination: {
  id: string;
  lat: string | number | null;
  lng: string | number | null;
}) {
  if (destination.lat == null || destination.lng == null) return [];

  const lat = Number(destination.lat);
  const lng = Number(destination.lng);
  const today = new Date().toISOString().split("T")[0];

  const rows = await db
    .select({
      id: sportingEvents.id,
      slug: sportingEvents.slug,
      name: sportingEvents.name,
      sport: sportingEvents.sport,
      startDate: sportingEvents.startDate,
      endDate: sportingEvents.endDate,
      packStatus: sportingEvents.packStatus,
      isHidden: sportingEvents.isHidden,
      earlyBirdDisplay: sportingEvents.earlyBirdDisplay,
      standardDisplay: sportingEvents.standardDisplay,
      editorialOverview: sportingEvents.editorialOverview,
      heroImageUrl: sportingEvents.heroImageUrl,
      packFormat: sportingEvents.packFormat,
      nearDestinationName: destinations.name,
      distanceKm: sql<number>`
        6371 * acos(
          least(1, greatest(-1,
            cos(radians(${lat})) * cos(radians(${destinations.lat})) *
              cos(radians(${destinations.lng}) - radians(${lng})) +
            sin(radians(${lat})) * sin(radians(${destinations.lat}))
          ))
        )
      `.as("distance_km"),
    })
    .from(sportingEvents)
    .innerJoin(destinations, eq(sportingEvents.destinationId, destinations.id))
    .where(
      and(
        sql`${sportingEvents.destinationId} != ${destination.id}`,
        isNotNull(destinations.lat),
        isNotNull(destinations.lng),
        gte(sportingEvents.endDate, today)
      )
    );

  // distanceKm comes back as a string from postgres (raw numeric SQL
  // expression — sql<number>` is a type hint only, not a runtime cast), so
  // coerce explicitly rather than relying on implicit comparison coercion.
  return rows
    .map((r) => ({ ...r, distanceKm: Number(r.distanceKm) }))
    .filter((r) => r.distanceKm <= NEARBY_RADIUS_KM)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

export type NearbyDestinationEvent = Awaited<ReturnType<typeof getNearbyDestinationEvents>>[number];

// Destinations featured on the homepage "Browse by Destination" section —
// curator-set via homepageSlot, same pattern as sportingEvents.homepageSlot.
export async function getDestinationsForHomepage() {
  return db
    .select({
      id: destinations.id,
      slug: destinations.slug,
      name: destinations.name,
      countryCode: destinations.countryCode,
      heroImageUrl: destinations.heroImageUrl,
      homepageSlot: destinations.homepageSlot,
    })
    .from(destinations)
    .where(isNotNull(destinations.homepageSlot))
    .orderBy(asc(destinations.homepageSlot));
}

export type HomepageDestination = Awaited<ReturnType<typeof getDestinationsForHomepage>>[number];

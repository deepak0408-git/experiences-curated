import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { algoliasearch } from "algoliasearch";
import { experiences, destinations, sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const algolia = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_KEY
);
const INDEX = process.env.ALGOLIA_EXPERIENCES_INDEX;

const TIER_RANK = { editorial: 3, local_expert: 2, community: 1 };

function computeEventBoost(availability, startDate, endDate) {
  if (!startDate || availability === "perennial") return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : start;
  if (today >= start && today <= end) return 100;
  if (today < start) {
    const daysUntil = Math.floor((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 14) return 80;
    if (daysUntil <= 60) return 60;
    if (daysUntil <= 180) return 30;
  }
  return 0;
}

const rows = await db
  .select({
    id: experiences.id,
    title: experiences.title,
    subtitle: experiences.subtitle,
    slug: experiences.slug,
    experienceType: experiences.experienceType,
    neighborhood: experiences.neighborhood,
    lat: experiences.lat,
    lng: experiences.lng,
    heroImageUrl: experiences.heroImageUrl,
    moodTags: experiences.moodTags,
    interestCategories: experiences.interestCategories,
    pace: experiences.pace,
    physicalIntensity: experiences.physicalIntensity,
    budgetTier: experiences.budgetTier,
    budgetMinCost: experiences.budgetMinCost,
    budgetMaxCost: experiences.budgetMaxCost,
    bestSeasons: experiences.bestSeasons,
    availability: experiences.availability,
    curationTier: experiences.curationTier,
    saveCount: experiences.saveCount,
    publishedAt: experiences.publishedAt,
    lastVerifiedDate: experiences.lastVerifiedDate,
    destinationId: destinations.id,
    destinationName: destinations.name,
    destinationCountry: destinations.countryCode,
    eventStartDate: sportingEvents.startDate,
    eventEndDate: sportingEvents.endDate,
  })
  .from(experiences)
  .innerJoin(destinations, eq(experiences.destinationId, destinations.id))
  .leftJoin(sportingEvents, eq(experiences.sportingEventId, sportingEvents.id))
  .where(eq(experiences.status, "published"));

console.log(`Syncing ${rows.length} published experience${rows.length !== 1 ? "s" : ""}…`);
console.log(`Today: ${new Date().toISOString().slice(0, 10)}\n`);

const objects = rows.map((row) => {
  const lat = row.lat ? parseFloat(row.lat) : undefined;
  const lng = row.lng ? parseFloat(row.lng) : undefined;
  const curationTierRank = TIER_RANK[row.curationTier] ?? 1;
  const hasHeroImage = row.heroImageUrl ? 1 : 0;
  const lastVerifiedTimestamp = row.lastVerifiedDate
    ? Math.floor(new Date(row.lastVerifiedDate).getTime() / 1000)
    : 0;
  const eventBoost = computeEventBoost(
    row.availability,
    row.eventStartDate ?? null,
    row.eventEndDate ?? null
  );

  console.log(
    `  ${row.title.padEnd(40)} eventBoost=${String(eventBoost).padStart(3)}  tier=${curationTierRank}  img=${hasHeroImage}`
  );

  return {
    objectID: row.id,
    title: row.title,
    subtitle: row.subtitle,
    slug: row.slug,
    experienceType: row.experienceType,
    neighborhood: row.neighborhood,
    ...(lat !== undefined && lng !== undefined ? { _geoloc: { lat, lng } } : {}),
    heroImageUrl: row.heroImageUrl,
    moodTags: row.moodTags ?? [],
    interestCategories: row.interestCategories ?? [],
    pace: row.pace,
    physicalIntensity: row.physicalIntensity,
    budgetTier: row.budgetTier,
    budgetMinCost: row.budgetMinCost ? parseFloat(row.budgetMinCost) : undefined,
    budgetMaxCost: row.budgetMaxCost ? parseFloat(row.budgetMaxCost) : undefined,
    bestSeasons: row.bestSeasons ?? [],
    availability: row.availability,
    curationTier: row.curationTier,
    curationTierRank,
    hasHeroImage,
    lastVerifiedTimestamp,
    eventBoost,
    saveCount: row.saveCount,
    publishedAt: row.publishedAt ? Math.floor(row.publishedAt.getTime() / 1000) : null,
    destinationId: row.destinationId,
    destinationName: row.destinationName,
    destinationCountry: row.destinationCountry,
  };
});

await algolia.saveObjects({ indexName: INDEX, objects });

console.log(`\n✓ ${rows.length} experience${rows.length !== 1 ? "s" : ""} synced to Algolia index "${INDEX}".`);
await client.end();

// Lat/lng backfill for the 4-city destination-page pilot (London, Melbourne,
// Shanghai, Abu Dhabi) — 1 Oct 2026 brainstorm. Scoped backfill only, not
// all 39 destinations (see project memory). Also backfills Dubai, the one
// genuine ≤200km neighbor among the 4 pilot cities with no coordinates yet
// (Abu Dhabi <-> Dubai, ~123km) — Dubai has zero linked sporting events
// today, so this doesn't change Abu Dhabi's "Nearby" section yet, but sets
// up for when golf/cricket events land there (per founder's Abu Dhabi
// editorial copy, which already references Dubai). Silverstone and Monaco
// already have real coordinates from earlier seeding — London <-> Silverstone
// (~88km) becomes a live "Nearby" match the moment London's own coordinates
// are set, since getNearbyDestinationEvents is pure haversine with no
// per-pair manual linking required.
//
// Coordinates are standard city-center reference points (Wikipedia/
// findlatitudeandlongitude.com), same precision level as the existing
// Monaco/Silverstone/Mexico City rows already in the DB.
import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { destinations } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const coords = {
  "london-gb": { lat: "51.507400", lng: "-0.127800" },
  "melbourne-au": { lat: "-37.814000", lng: "144.963300" },
  "shanghai": { lat: "31.232500", lng: "121.469200" },
  "abu-dhabi": { lat: "24.453900", lng: "54.377300" },
  "dubai": { lat: "25.204800", lng: "55.270800" },
};

for (const [slug, { lat, lng }] of Object.entries(coords)) {
  await db.update(destinations)
    .set({ lat, lng, updatedAt: new Date() })
    .where(eq(destinations.slug, slug));
  console.log(`✓ ${slug} → ${lat}, ${lng}`);
}

console.log("\nCoordinates backfilled for pilot cities + Dubai.");
await client.end();

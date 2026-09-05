import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { destinations, sportingEvents } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [austin] = await db
  .select({ id: destinations.id })
  .from(destinations)
  .where(eq(destinations.slug, "austin"));

if (!austin) {
  throw new Error("Austin destination not found — run seed-austin-destination.mjs first.");
}

await db.insert(sportingEvents).values({
  name: "United States Grand Prix 2026",
  slug: "united-states-grand-prix",
  sport: "formula_one",
  tournamentSeries: "Formula 1",
  editionYear: 2026,
  destinationId: austin.id,
  venueName: "Circuit of the Americas",
  venueAddress: "9201 Circuit of the Americas Blvd, Austin, TX 78617, USA",
  venueLat: "30.134580",
  venueLng: "-97.635811",
  startDate: "2026-10-23",
  endDate: "2026-10-25",
  isHidden: true,
  packStatus: "planned",
  packFormat: "hub_and_spoke",
});

console.log("United States Grand Prix 2026 event seeded (planned, hidden).");
await client.end();

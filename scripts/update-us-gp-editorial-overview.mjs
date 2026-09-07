import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// editorialOverview was never set for this event — no seed script wrote it,
// so the pack page's SEO title/description/OpenGraph tags were silently
// falling back to the generic auto-generated string in
// app/event-pack/[slug]/page.tsx's generateMetadata(). Written in the same
// style/length as Abu Dhabi/Bahrain/Singapore/Las Vegas GP's own overviews
// (1-3 short sentences, a distinctive real fact, under 160 chars).
const EDITORIAL_OVERVIEW = "The first purpose-built F1 circuit in the US in a generation. COTA's steepest climb, a party-hard Austin crowd, and a headliner concert every night.";

const [row] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, "united-states-grand-prix"));

if (!row) {
  console.error("Event not found");
  process.exit(1);
}

await db.update(sportingEvents).set({ editorialOverview: EDITORIAL_OVERVIEW }).where(eq(sportingEvents.id, row.id));

console.log("✓ Updated editorialOverview:", EDITORIAL_OVERVIEW);
console.log("  Length:", EDITORIAL_OVERVIEW.length, "chars");
await client.end();

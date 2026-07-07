import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { destinations, sportingEvents } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

try {
  // 1. Milan destination already exists — just look it up
  const [destination] = await db
    .select({ id: destinations.id, name: destinations.name })
    .from(destinations)
    .where(eq(destinations.slug, "milan"));

  console.log("✓ Destination found:", destination.name, "→", destination.id);

  // 2. Create Italian GP 2026 sporting event
  const [event] = await db
    .insert(sportingEvents)
    .values({
      name: "Formula 1 Italian Grand Prix 2026",
      slug: "italian-gp-2026",
      sport: "formula_one",
      tournamentSeries: "Formula 1 World Championship",
      editionYear: 2026,
      startDate: "2026-09-04",
      endDate: "2026-09-07",
      venueName: "Autodromo Nazionale Monza",
      destinationId: destination.id,
      isHidden: true,
      editorialOverview: "The fastest circuit on the F1 calendar. Monza in September means the Tifosi, the Parabolica, and one of the great sporting weekends in Europe.",
    })
    .returning({ id: sportingEvents.id, name: sportingEvents.name, slug: sportingEvents.slug });

  console.log("✓ Sporting event created:", event.name);
  console.log("  ID:  ", event.id);
  console.log("  Slug:", event.slug);
  console.log("\nAdd these to CLAUDE.md Key IDs:");
  console.log(`  Milan destination:     ${destination.id}`);
  console.log(`  Italian GP 2026 event: ${event.id}`);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

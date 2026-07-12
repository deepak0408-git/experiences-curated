import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { destinations, sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

try {
  const [destination] = await db
    .insert(destinations)
    .values({
      name: "Budapest",
      slug: "budapest",
      countryCode: "HU",
      region: "Central Hungary",
      destinationType: "city",
      currency: "HUF",
      language: "Hungarian",
      timezone: "Europe/Budapest",
      editorialOverview:
        "Budapest splits the Danube into Buda's hills and Pest's flat grid of grand boulevards, ruin bars, and thermal baths — and sits about 35 minutes from the Hungaroring, making it the closest capital-city base on the F1 calendar.",
      gettingThere: "Budapest Ferenc Liszt International Airport (BUD), connected to the city centre by the 100E airport bus (~30 min to Deák Ferenc tér).",
      gettingAround: "Extensive metro, tram, and HÉV suburban rail network. The M2 red metro line connects to the HÉV line used to reach the Hungaroring.",
      bestSeasons: ["jul"],
    })
    .onConflictDoNothing()
    .returning({ id: destinations.id, name: destinations.name });

  let destinationId;
  if (destination) {
    destinationId = destination.id;
    console.log("✓ Destination created:", destination.name, "→", destinationId);
  } else {
    const [existing] = await db
      .select({ id: destinations.id })
      .from(destinations)
      .where(eq(destinations.slug, "budapest"));
    destinationId = existing?.id;
    console.log("✓ Destination already exists:", destinationId);
  }

  const [event] = await db
    .insert(sportingEvents)
    .values({
      name: "Hungarian Grand Prix 2026",
      slug: "hungarian-gp-2026",
      sport: "formula_one",
      tournamentSeries: "Formula 1",
      editionYear: 2026,
      destinationId,
      venueName: "Hungaroring",
      venueAddress: "Hungaroring, 2146 Mogyoród, Hungary",
      startDate: "2026-07-24",
      endDate: "2026-07-26",
      recurrence: "annual",
      ticketingUrl: "https://tickets.formula1.com/en/f1-3277-hungary",
      editorialOverview:
        "A tight, technical circuit in the hills north of Budapest — one of the toughest overtaking tracks on the calendar, paired with one of Europe's most characterful capital cities as its base.",
      isHidden: true,
    })
    .onConflictDoNothing()
    .returning({ id: sportingEvents.id, name: sportingEvents.name });

  let eventId;
  if (event) {
    eventId = event.id;
    console.log("✓ Sporting event created:", event.name, "→", eventId);
  } else {
    const [existing] = await db
      .select({ id: sportingEvents.id })
      .from(sportingEvents)
      .where(eq(sportingEvents.slug, "hungarian-gp-2026"));
    eventId = existing?.id;
    console.log("✓ Sporting event already exists:", eventId);
  }

  console.log("\nDestination ID:", destinationId);
  console.log("Event ID:      ", eventId);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

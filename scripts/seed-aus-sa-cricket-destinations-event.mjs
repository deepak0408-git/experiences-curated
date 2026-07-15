import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { destinations, sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// ─── 1. Cape Town — already exists, just look it up ────────────────────────
const [capeTown] = await db.select({ id: destinations.id, name: destinations.name }).from(destinations).where(eq(destinations.slug, "cape-town"));
console.log("✓ Cape Town found:", capeTown?.id);

// ─── 2. Durban — new ────────────────────────────────────────────────────────
const [durbanInsert] = await db
  .insert(destinations)
  .values({
    name: "Durban",
    slug: "durban",
    countryCode: "ZA",
    region: "KwaZulu-Natal",
    destinationType: "city",
    currency: "ZAR",
    language: "English, Zulu",
    timezone: "Africa/Johannesburg",
    editorialOverview:
      "Durban is South Africa's warm-water coastal city — a subtropical Indian Ocean beachfront with the country's largest Indian diaspora, and Kingsmead cricket ground sits close enough to the surf that the tide reportedly changes how the pitch plays.",
    gettingThere: "King Shaka International Airport (DUR), about 35km north of the city centre.",
    gettingAround: "Metered taxis, Uber, and the MyCiTi-style Durban People Mover along the beachfront. Most sights cluster along the Golden Mile and central beachfront.",
    bestSeasons: ["sep", "oct"],
  })
  .onConflictDoNothing()
  .returning({ id: destinations.id, name: destinations.name });

let durbanId;
if (durbanInsert) {
  durbanId = durbanInsert.id;
  console.log("✓ Durban created:", durbanId);
} else {
  const [existing] = await db.select({ id: destinations.id }).from(destinations).where(eq(destinations.slug, "durban"));
  durbanId = existing?.id;
  console.log("✓ Durban already exists:", durbanId);
}

// ─── 3. Johannesburg — new ──────────────────────────────────────────────────
const [joburgInsert] = await db
  .insert(destinations)
  .values({
    name: "Johannesburg",
    slug: "johannesburg",
    countryCode: "ZA",
    region: "Gauteng",
    destinationType: "city",
    currency: "ZAR",
    language: "English, Zulu, Afrikaans",
    timezone: "Africa/Johannesburg",
    editorialOverview:
      "Johannesburg is South Africa's largest city and its economic engine — a sprawling, high-altitude city built on gold, holding the Wanderers Stadium (the 'Bullring'), Soweto's living history, and the gateway to Kruger National Park a few hours east.",
    gettingThere: "OR Tambo International Airport (JNB), one of Africa's busiest hubs, about 24km from Sandton.",
    gettingAround: "Uber and metered taxis are the practical default. The Gautrain rapid rail connects the airport, Sandton, Rosebank, and Pretoria. Self-driving is common for day trips (Cradle of Humankind, Kruger).",
    bestSeasons: ["sep", "oct"],
  })
  .onConflictDoNothing()
  .returning({ id: destinations.id, name: destinations.name });

let joburgId;
if (joburgInsert) {
  joburgId = joburgInsert.id;
  console.log("✓ Johannesburg created:", joburgId);
} else {
  const [existing] = await db.select({ id: destinations.id }).from(destinations).where(eq(destinations.slug, "johannesburg"));
  joburgId = existing?.id;
  console.log("✓ Johannesburg already exists:", joburgId);
}

// ─── 4. Sporting event — Australia in South Africa 2026-27 ────────────────
// Multi-venue tour, like the India in England cricket pack. destinationId set
// to Johannesburg as the primary/gateway destination (largest city, main
// airport hub) — individual experiences carry their own destinationId per city.
const [eventInsert] = await db
  .insert(sportingEvents)
  .values({
    name: "Australia tour of South Africa 2026-27",
    slug: "australia-in-south-africa-2026",
    sport: "cricket",
    tournamentSeries: "Australia tour of South Africa",
    editionYear: 2026,
    destinationId: joburgId,
    venueName: "Multiple venues — Kingsmead (Durban), Wanderers (Johannesburg), Newlands (Cape Town)",
    venueAddress: null,
    startDate: "2026-09-24",
    endDate: "2026-10-31",
    recurrence: null,
    ticketingUrl: "https://www.cricketsa.com/tickets",
    isHidden: true,
  })
  .onConflictDoNothing()
  .returning({ id: sportingEvents.id, name: sportingEvents.name });

let eventId;
if (eventInsert) {
  eventId = eventInsert.id;
  console.log("✓ Sporting event created:", eventInsert.name, "→", eventId);
} else {
  const [existing] = await db.select({ id: sportingEvents.id }).from(sportingEvents).where(eq(sportingEvents.slug, "australia-in-south-africa-2026"));
  eventId = existing?.id;
  console.log("✓ Sporting event already exists:", eventId);
}

console.log("\n--- IDs for CLAUDE.md ---");
console.log("Cape Town destination:  ", capeTown?.id);
console.log("Durban destination:     ", durbanId);
console.log("Johannesburg destination:", joburgId);
console.log("Australia in SA 2026 event:", eventId);

await client.end();

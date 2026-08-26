import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { destinations, sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [paris] = await db.select().from(destinations).where(eq(destinations.slug, "paris-fr"));
if (!paris) throw new Error("Paris destination not found");

// Dates confirmed live on travel.rolandgarros.com (official Roland-Garros
// Travel site), 26 Aug 2026: "MAY 17 - JUNE 6 2027". tickets.rolandgarros.com
// itself still shows 2026 dates (18 May - 7 Jun) since individual 2027
// tickets aren't on sale yet — the official travel site is the authoritative
// source for confirmed 2027 tournament dates.
const [inserted] = await db
  .insert(sportingEvents)
  .values({
    name: "French Open 2027",
    slug: "french-open",
    sport: "tennis",
    tournamentSeries: "Grand Slam",
    editionYear: 2027,
    destinationId: paris.id,
    venueName: "Stade Roland-Garros",
    venueAddress: "2 Avenue Gordon Bennett, 75016 Paris, France",
    startDate: "2027-05-17",
    endDate: "2027-06-06",
    ticketingUrl: "https://tickets.rolandgarros.com/en",
    // Planner-only build for now, per founder instruction 26 Aug 2026 — pack
    // itself comes later. hub_and_spoke is the standing default format for
    // every new event (see hub-and-spoke-event-pack skill), set now so no
    // migration is needed when the real pack build starts.
    packFormat: "hub_and_spoke",
    packStatus: "planned",
    isHidden: true,
  })
  .returning({ id: sportingEvents.id, slug: sportingEvents.slug, name: sportingEvents.name });

console.log("Inserted:", inserted);
await client.end();

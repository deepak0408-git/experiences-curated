import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const LONDON_ID = "75758888-28b9-4e09-82ba-f05681ecc904";

const [event] = await db
  .insert(sportingEvents)
  .values({
    name: "India in England 2026",
    slug: "india-in-england-cricket-2026",
    sport: "cricket",
    tournamentSeries: "India in England",
    editionYear: 2026,
    destinationId: LONDON_ID,
    venueName: "Lord's Cricket Ground",
    venueAddress: "St John's Wood Road, London, NW8 8QN",
    startDate: "2026-07-01",
    endDate: "2026-07-19",
    recurrence: "other",
    ticketingUrl: "https://www.ecb.co.uk/tickets/england",
    editorialOverview: "Five T20Is and three ODIs across England in July 2026. The climax at Lord's on the 19th. But the spiritual heart of this tour is Edgbaston on the 14th — Birmingham turns blue, the Bharat Army fills the stands, and a city with deep South Asian roots treats an India home game as exactly that. This pack covers how to be inside that, not just watching it.",
  })
  .returning({ id: sportingEvents.id, name: sportingEvents.name });

console.log(`✓ Seeded: ${event.name} (${event.id})`);
await client.end();

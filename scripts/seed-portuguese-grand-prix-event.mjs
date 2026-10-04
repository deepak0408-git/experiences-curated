import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sportingEvents, externalCalendarEvents } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const PORTIMAO_DESTINATION_ID = "b867db4d-a5d4-455a-a18a-b1b6c074dd7b";
const EXTERNAL_CALENDAR_EVENT_ID = "6afa7ba6-51f1-4849-99c0-ac70a9154bc3";

const [event] = await db
  .insert(sportingEvents)
  .values({
    name: "Portuguese Grand Prix 2027",
    slug: "portuguese-grand-prix",
    sport: "formula_one",
    tournamentSeries: "Formula 1",
    editionYear: 2027,
    seasonYear: 2027,
    destinationId: PORTIMAO_DESTINATION_ID,
    venueName: "Autódromo Internacional do Algarve",
    venueAddress: "N124, 8500-148 Portimão, Portugal",
    startDate: "2027-06-18",
    endDate: "2027-06-20",
    recurrence: "annual",
    ticketingUrl: "https://ticketing.formula1.com/portugal",
    editorialOverview:
      "Formula 1 returns to the Autódromo Internacional do Algarve for the 2027 Portuguese Grand Prix, the undulating, blind-crested circuit that hosted back-to-back races during the pandemic-disrupted 2020-21 seasons. Its long back straight and elevation changes make overtaking genuinely possible, a rarity on the current calendar. Race weekend falls in mid-June, peak season on the Algarve's beach coast.",
    isHidden: true,
    isTestEvent: false,
    packStatus: "planned",
    packFormat: "hub_and_spoke",
    packCurrency: "USD",
  })
  .returning({ id: sportingEvents.id });

console.log("Portuguese Grand Prix 2027 event seeded:", event.id);

await db
  .update(externalCalendarEvents)
  .set({ matchedSportingEventId: event.id })
  .where(eq(externalCalendarEvents.id, EXTERNAL_CALENDAR_EVENT_ID));

console.log("Linked to externalCalendarEvents row", EXTERNAL_CALENDAR_EVENT_ID);

await client.end();

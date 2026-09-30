import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sportingEvents, externalCalendarEvents } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SILVERSTONE_DESTINATION_ID = "38b9fd34-3f80-4a6e-8e03-f30013f66cf0";
const EXTERNAL_CALENDAR_EVENT_ID = "21bcd068-9bfc-4c48-ab36-a1525bb5a584";

const [event] = await db
  .insert(sportingEvents)
  .values({
    name: "British Grand Prix 2027",
    slug: "british-grand-prix",
    sport: "formula_one",
    tournamentSeries: "Formula 1",
    editionYear: 2027,
    seasonYear: 2027,
    destinationId: SILVERSTONE_DESTINATION_ID,
    venueName: "Silverstone Circuit",
    venueAddress: "Silverstone, Towcester NN12 8TN, United Kingdom",
    startDate: "2027-07-02",
    endDate: "2027-07-04",
    recurrence: "annual",
    ticketingUrl: "https://www.silverstone.co.uk/events/formula-1-british-grand-prix/tickets",
    editorialOverview:
      "Formula 1's home race returns to Silverstone Circuit for the 2027 British Grand Prix, run on the site of the sport's first-ever World Championship race in 1950. The fast Maggotts-Becketts-Chapel complex remains one of the calendar's defining corner sequences, and the British Grand Prix consistently draws the largest crowds of any F1 weekend, with campsites spread across the Northamptonshire countryside around the circuit.",
    isHidden: true,
    isTestEvent: false,
    packStatus: "planned",
    packFormat: "hub_and_spoke",
    packCurrency: "USD",
  })
  .returning({ id: sportingEvents.id });

console.log("British Grand Prix 2027 event seeded:", event.id);

await db
  .update(externalCalendarEvents)
  .set({ matchedSportingEventId: event.id })
  .where(eq(externalCalendarEvents.id, EXTERNAL_CALENDAR_EVENT_ID));

console.log("Linked to externalCalendarEvents row", EXTERNAL_CALENDAR_EVENT_ID);

await client.end();

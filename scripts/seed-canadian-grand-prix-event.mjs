import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sportingEvents, externalCalendarEvents } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const MONTREAL_DESTINATION_ID = "4d171bf6-5a01-4c5e-b05f-3b2dc74b8fad";
const EXTERNAL_CALENDAR_EVENT_ID = "236a6084-c12a-4553-bdfc-2a445d63b7ea";

const [event] = await db
  .insert(sportingEvents)
  .values({
    name: "Canadian Grand Prix 2027",
    slug: "canadian-grand-prix",
    sport: "formula_one",
    tournamentSeries: "Formula 1",
    editionYear: 2027,
    destinationId: MONTREAL_DESTINATION_ID,
    venueName: "Circuit Gilles Villeneuve",
    venueAddress: "1 Avenue du Circuit, Montréal, QC H3C 1A9, Canada",
    startDate: "2027-05-21",
    endDate: "2027-05-23",
    recurrence: "annual",
    ticketingUrl: "https://ticketing.formula1.com/canada",
    editorialOverview:
      "Formula 1 returns to Circuit Gilles Villeneuve on Île Notre-Dame for the 2027 Canadian Grand Prix, one of the calendar's most unpredictable street-adjacent circuits. The Wall of Champions and the tight final chicane routinely catch out even seasoned drivers, and the fan atmosphere downtown after each session is among the best on the calendar. Race weekend falls in late May, when Montreal's patio and festival season is just getting started.",
    isHidden: true,
    isTestEvent: false,
    packStatus: "planned",
    packFormat: "hub_and_spoke",
  })
  .returning({ id: sportingEvents.id });

console.log("Canadian Grand Prix 2027 event seeded:", event.id);

await db
  .update(externalCalendarEvents)
  .set({ matchedSportingEventId: event.id })
  .where(eq(externalCalendarEvents.id, EXTERNAL_CALENDAR_EVENT_ID));

console.log("Linked to externalCalendarEvents row", EXTERNAL_CALENDAR_EVENT_ID);

await client.end();

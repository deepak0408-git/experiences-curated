import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sportingEvents, externalCalendarEvents } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const MONACO_DESTINATION_ID = process.argv[2];
const EXTERNAL_CALENDAR_EVENT_ID = "eeffbd0d-9b6f-4002-bcc2-5ecfe02c8e27"; // 2027-06-04, non-provisional, confirmed via DB query 30 Sep 2026

if (!MONACO_DESTINATION_ID) {
  console.error("Usage: node seed-monaco-grand-prix-event.mjs <monaco-destination-id>");
  process.exit(1);
}

const [event] = await db
  .insert(sportingEvents)
  .values({
    name: "Monaco Grand Prix 2027",
    slug: "monaco-grand-prix",
    sport: "formula_one",
    tournamentSeries: "Formula 1",
    editionYear: 2027,
    destinationId: MONACO_DESTINATION_ID,
    venueName: "Circuit de Monaco",
    venueAddress: "23 Boulevard Albert 1er, La Condamine, 98000 Monaco",
    startDate: "2027-06-04",
    endDate: "2027-06-06",
    recurrence: "annual",
    ticketingUrl: "https://ticketing.formula1.com/monaco/",
    editorialOverview:
      "Formula 1's oldest and most prestigious street race returns to the Circuit de Monaco for the 2027 Grand Prix, run through the tight, barrier-lined streets of Monte Carlo and La Condamine with zero run-off and the tightest margins on the calendar. 2027 introduces a sprint weekend format to Monaco for the first time. The principality itself becomes the venue — balconies, rooftop terraces and superyachts in the harbour all double as vantage points, and most of the paddock area is walkable on foot once the street closures begin.",
    isHidden: true,
    isTestEvent: false,
    packStatus: "planned",
    packFormat: "hub_and_spoke",
  })
  .returning({ id: sportingEvents.id });

console.log("Monaco Grand Prix 2027 event seeded:", event.id);

await db
  .update(externalCalendarEvents)
  .set({ matchedSportingEventId: event.id })
  .where(eq(externalCalendarEvents.id, EXTERNAL_CALENDAR_EVENT_ID));

console.log("Linked to externalCalendarEvents row", EXTERNAL_CALENDAR_EVENT_ID);

await client.end();

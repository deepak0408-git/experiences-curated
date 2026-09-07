import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sportingEvents, externalCalendarEvents } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const MEXICO_CITY_DESTINATION_ID = "883ac422-5318-460f-819a-6ae784ac4b8c";

const [event] = await db
  .insert(sportingEvents)
  .values({
    name: "Mexico City Grand Prix 2026",
    slug: "mexico-city-grand-prix",
    sport: "formula_one",
    tournamentSeries: "Formula 1",
    editionYear: 2026,
    destinationId: MEXICO_CITY_DESTINATION_ID,
    venueName: "Autódromo Hermanos Rodríguez",
    venueAddress: "Av. Río Churubusco S/N, Granjas México, Iztacalco, 08400 Ciudad de México, CDMX",
    startDate: "2026-10-30",
    endDate: "2026-11-01",
    isHidden: true,
    isTestEvent: false,
    packFormat: "hub_and_spoke",
    packStatus: "built_hidden",
    packCurrency: "USD",
    earlyBirdDisplay: "US$10",
    standardDisplay: "US$15",
    earlyBirdCutoff: "2026-09-30",
    ticketingUrl: "https://tickets.formula1.com/en/f1-4861-mexico",
    editorialOverview:
      "F1 returns to the Autódromo Hermanos Rodríguez for one of the loudest race weekends on the calendar, where the final sector runs straight through a converted baseball stadium packed with fans. High altitude, serious food, and a genuinely raucous crowd make this one of the most distinctive stops on the F1 season.",
  })
  .returning({ id: sportingEvents.id });

console.log("Mexico City Grand Prix 2026 event seeded:", event.id);

const updated = await db
  .update(externalCalendarEvents)
  .set({ matchedSportingEventId: event.id })
  .where(eq(externalCalendarEvents.id, "8f3e57df-6729-4048-8aac-c06705c8e201"))
  .returning({ id: externalCalendarEvents.id });

console.log("externalCalendarEvents row linked:", updated[0]?.id);

await client.end();

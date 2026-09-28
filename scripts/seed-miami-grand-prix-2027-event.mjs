import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const MIAMI_DESTINATION_ID = "d4ec0c4f-4c48-445c-be38-909a87b845e6";

const [event] = await db
  .insert(sportingEvents)
  .values({
    name: "Miami Grand Prix 2027",
    slug: "miami-grand-prix-2027",
    sport: "formula_one",
    tournamentSeries: "Formula 1",
    editionYear: 2027,
    destinationId: MIAMI_DESTINATION_ID,
    venueName: "Miami International Autodrome, Hard Rock Stadium",
    startDate: "2027-04-30",
    endDate: "2027-05-02",
    recurrence: "annual",
    editorialOverview:
      "Formula 1 race weekend on the temporary street circuit built around Hard Rock Stadium in Miami Gardens, 30 Apr - 2 May 2027.",
    isHidden: true,
    isTestEvent: false,
    packStatus: "planned",
    packFormat: "hub_and_spoke",
  })
  .returning({ id: sportingEvents.id });

console.log("Miami Grand Prix 2027 event seeded. ID:", event.id);
await client.end();

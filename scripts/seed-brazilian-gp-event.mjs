import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [event] = await db
  .insert(sportingEvents)
  .values({
    name: "Brazilian Grand Prix 2026",
    slug: "brazilian-grand-prix",
    sport: "formula_one",
    tournamentSeries: "Formula 1",
    editionYear: 2026,
    destinationId: "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb",
    venueName: "Autódromo José Carlos Pace (Interlagos)",
    venueAddress: "Av. Senador Teotônio Vilela, 261, Interlagos, 04329-030 São Paulo, SP, Brazil",
    startDate: "2026-11-06",
    endDate: "2026-11-08",
    ticketingUrl: "https://www.formula1.com/en/racing/2026/brazil",
    editorialOverview:
      "F1 returns to Interlagos, one of the most beloved circuits on the calendar — a short, punchy anticlockwise lap through the hills south of São Paulo, famous for late-race chaos and a home crowd that never lets up. This is where championships have swung in the final laps more often than almost anywhere else on the calendar, and where the city's food, samba, and altitude all shape the weekend as much as the racing does.",
    isHidden: true,
    packStatus: "built_hidden",
    packFormat: "hub_and_spoke",
    packCurrency: "USD",
  })
  .returning({ id: sportingEvents.id });

console.log("Brazilian Grand Prix 2026 event seeded:", event.id);
await client.end();

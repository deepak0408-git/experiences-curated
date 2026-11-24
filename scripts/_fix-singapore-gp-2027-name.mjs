import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { sportingEvents } from "../schema/database.ts";

// Follow-up fix to rollover-singapore-gp-2027.mjs — that script rolled
// editionYear/dates forward but left `name` untouched ("Singapore Grand
// Prix 2026"), because the rollover-event-into-next-year skill wrongly
// assumed these 5 GPs are name-unsuffixed evergreen events like the Belgian/
// Hungarian GP precedent. They are NOT — slug is evergreen
// ("singapore-grand-prix") but name carries the edition year, same pattern
// as Belgian/Hungarian GP's OWN rollover scripts, which do update name.
// Corrected here; skill itself corrected separately.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SINGAPORE_GP_ID = "48aa4415-f6a2-4867-b390-eb6b28b6903b";

const [before] = await db.select({ name: sportingEvents.name, editionYear: sportingEvents.editionYear }).from(sportingEvents).where(eq(sportingEvents.id, SINGAPORE_GP_ID));
if (before.editionYear !== 2027) throw new Error(`Refusing — editionYear is ${before.editionYear}, expected 2027. Run the rollover first.`);
if (before.name !== "Singapore Grand Prix 2026") throw new Error(`Refusing — name is already "${before.name}", not the expected stale "Singapore Grand Prix 2026".`);

const [after] = await db
  .update(sportingEvents)
  .set({ name: "Singapore Grand Prix 2027", updatedAt: new Date() })
  .where(eq(sportingEvents.id, SINGAPORE_GP_ID))
  .returning({ name: sportingEvents.name, editionYear: sportingEvents.editionYear, startDate: sportingEvents.startDate, endDate: sportingEvents.endDate });

console.log("Fixed:", after);
await client.end();

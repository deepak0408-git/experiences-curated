import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { destinations, plannerDestinationBands } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const dests = await db.select().from(destinations);
const mumbai = dests.find(d => /mumbai/i.test(d.name));
console.log("Mumbai destination:", mumbai?.id, mumbai?.name);
if (mumbai) {
  const bands = await db.select().from(plannerDestinationBands).where(eq(plannerDestinationBands.destinationId, mumbai.id));
  console.log(JSON.stringify(bands, null, 2));
}
await client.end();

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { destinations } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const MILAN_ID = "0b0d8f9a-911d-4cc7-8049-50e4685958ca";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

await db.update(destinations)
  .set({ region: "Lombardy", currency: "EUR" })
  .where(eq(destinations.id, MILAN_ID));

console.log("✓ Milan destination updated — region: Lombardy, currency: EUR");
await client.end();

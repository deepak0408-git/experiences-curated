import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [row] = await db.select({ id: experiences.id, practicalInfo: experiences.practicalInfo })
  .from(experiences)
  .where(eq(experiences.title, "Getting to the Autódromo Hermanos Rodríguez"));

console.log("ID:", row.id);
console.log("Before:", row.practicalInfo.costRange);

const [result] = await db
  .update(experiences)
  .set({
    practicalInfo: { ...row.practicalInfo, costRange: "Mexico City Metro fare is a flat 5 pesos (roughly US$0.30) per ride, regardless of distance or transfers" },
    lastVerifiedDate: "2026-09-06",
  })
  .where(eq(experiences.id, row.id))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`\n✓ Updated: ${result.title}`);
await client.end();

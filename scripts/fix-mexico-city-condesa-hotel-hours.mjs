import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "beb0a3f4-97bc-4c8b-bea9-c77ce72afd45";

const hours = "Condesa df: check-in from 3:00pm, check-out by 12:00pm. Casa Cuenca: check-in 3:00pm-midnight, check-out by 12:00pm. Early check-in/late check-out available on request, subject to availability.";

const [existing] = await db
  .select({ practicalInfo: experiences.practicalInfo })
  .from(experiences)
  .where(eq(experiences.id, EXPERIENCE_ID));

const [result] = await db
  .update(experiences)
  .set({
    practicalInfo: { ...existing.practicalInfo, hours },
    lastVerifiedDate: "2026-09-07",
  })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Updated: ${result.title}`);
await client.end();

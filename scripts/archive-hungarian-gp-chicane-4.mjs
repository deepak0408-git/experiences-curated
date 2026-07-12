import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "f0937340-73dc-47ca-915d-648a65caa639"; // Chicane 4 Grandstand

try {
  await db.delete(sportingEventExperiences).where(eq(sportingEventExperiences.experienceId, EXPERIENCE_ID));

  const [result] = await db
    .update(experiences)
    .set({ status: "archived" })
    .where(eq(experiences.id, EXPERIENCE_ID))
    .returning({ id: experiences.id, title: experiences.title, status: experiences.status });

  console.log("✓ Archived:", result.title, "-", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

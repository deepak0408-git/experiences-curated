import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const IDS_TO_ARCHIVE = [
  "2a9fcad5-c41b-426e-8504-366821e72331", // T1 Grandstand
  "6ce06047-434e-4c9c-a7d1-a8dc62254eb6", // Apex Grandstand
  "801a9256-514a-4302-a059-ed4171a4836e", // Hungaroring Grandstand
];

try {
  for (const id of IDS_TO_ARCHIVE) {
    await db.delete(sportingEventExperiences).where(eq(sportingEventExperiences.experienceId, id));
    const [result] = await db
      .update(experiences)
      .set({ status: "archived" })
      .where(eq(experiences.id, id))
      .returning({ id: experiences.id, title: experiences.title, status: experiences.status });
    console.log("✓ Archived:", result.title, "-", result.status);
  }
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

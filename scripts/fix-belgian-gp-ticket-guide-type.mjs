import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [result] = await db
  .update(experiences)
  .set({ experienceType: "fan_experience" })
  .where(eq(experiences.title, "Your Belgian GP Ticket Guide"))
  .returning({ id: experiences.id, title: experiences.title, experienceType: experiences.experienceType });

console.log(result ? `✓ ${result.title} → experienceType: ${result.experienceType}` : "No matching row found");

await client.end();

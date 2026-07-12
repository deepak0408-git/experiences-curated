import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "3d4dd55a-bd01-4d8c-8daa-6a5702ed35cf"; // Your Hungarian GP Ticket Guide

const [result] = await db
  .update(experiences)
  .set({ experienceType: "fan_experience" })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title, experienceType: experiences.experienceType });

console.log(`✓ ${result.title} → experienceType: ${result.experienceType}`);

await client.end();

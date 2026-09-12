import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "4d17efb3-ca57-4a1a-a25f-cb79ac8fa03c"; // Arrival & Queue Guide

const practicalInfo = {
  hours: "Gates open 08:00 on Friday, Saturday, and Sunday of race weekend (6-8 Nov 2026), subject to change",
};

const [row] = await db
  .update(experiences)
  .set({ practicalInfo })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ title: experiences.title, practicalInfo: experiences.practicalInfo });

console.log("✓", row.title, "→", JSON.stringify(row.practicalInfo));
await client.end();

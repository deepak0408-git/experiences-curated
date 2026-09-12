import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "c737f67b-c034-46bb-a418-9cd595a932cf"; // Hotel Emiliano — Jardins' Boutique Luxury Pick

const practicalInfo = {
  costRange: "Rates typically start around US$290-360+ per night depending on room category and season; expect race-weekend premium pricing",
  bookingMethod: "Book directly via SLH (Small Luxury Hotels of the World, the Emiliano's affiliated network) or through major booking platforms.",
};

const [row] = await db
  .update(experiences)
  .set({ practicalInfo })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ title: experiences.title, practicalInfo: experiences.practicalInfo });

console.log("✓", row.title, "→", JSON.stringify(row.practicalInfo));
await client.end();

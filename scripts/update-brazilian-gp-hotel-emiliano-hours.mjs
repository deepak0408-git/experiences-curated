import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, sql } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "c737f67b-c034-46bb-a418-9cd595a932cf"; // Hotel Emiliano — Jardins' Boutique Luxury Pick

const hours = "Check-in from 3:00 PM, check-out by 12:00 PM; early check-in/late check-out available for an additional fee, subject to availability.";

const editorialNoteAppend = " Check-in/check-out times (3:00 PM / 12:00 PM) confirmed 12 Sep 2026 via consistent figures across multiple independent booking sources (Trivago, Guest Reservations, hotel-reseller listings) — the hotel's own official site (emiliano.com.br) does not publish a specific check-in/check-out policy page, so this is a cross-source consensus rather than a single primary confirmation; flagged as such.";

const [row] = await db
  .update(experiences)
  .set({
    practicalInfo: sql`jsonb_set(jsonb_set(${experiences.practicalInfo}, '{hours}', ${JSON.stringify(hours)}::jsonb), '{website}', '"https://emiliano.com.br/en/"')`,
    editorialNote: sql`${experiences.editorialNote} || ${editorialNoteAppend}`,
  })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ title: experiences.title, practicalInfo: experiences.practicalInfo });

console.log("✓", row.title, "→", JSON.stringify(row.practicalInfo));
await client.end();

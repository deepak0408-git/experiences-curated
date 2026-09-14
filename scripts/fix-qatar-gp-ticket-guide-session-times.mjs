// Qatar GP 2026 Ticket Guide — fix incorrect session times in body_content.
// Original seed (seed-qatar-01-ticket-guide.mjs) claimed FP1 1:30-2:30pm/5-6pm,
// FP2/Quali Sat 2:30-3:30pm/6-7pm, race Sunday 4pm. Corrected against the live
// formula1.com/en/racing/2026/qatar official schedule (verified 14 Sep 2026):
// FP1 Fri 16:30-17:30, FP2 Fri 20:00-21:00, FP3 Sat 17:30-18:30,
// Qualifying Sat 21:00-22:00, Race Sun 19:00 — all local (Doha/AST) time.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "f46fe80e-b09c-4305-98da-93786203c811"; // qatar-gp-ticket-guide-mtymjjwm

const OLD_SENTENCE = "The weekend itself is a standard format, no sprint race: practice runs Friday (1:30-2:30pm and 5-6pm local), practice and qualifying Saturday (2:30-3:30pm and 6-7pm), and the race goes green Sunday at 4pm — timed so the final laps run fully under the floodlights regardless of session slippage.";

const NEW_SENTENCE = "The weekend itself is a standard format, no sprint race: practice runs Friday (4:30-5:30pm and 8-9pm local), practice continues Saturday (5:30-6:30pm) ahead of qualifying at 9-10pm, and the race goes green Sunday at 7pm — timed so the final laps run fully under the floodlights regardless of session slippage.";

const [row] = await db.select({ bodyContent: experiences.bodyContent }).from(experiences).where(eq(experiences.id, EXPERIENCE_ID));

if (!row) {
  throw new Error("Experience not found: " + EXPERIENCE_ID);
}
if (!row.bodyContent.includes(OLD_SENTENCE)) {
  throw new Error("Old sentence not found verbatim in body_content — aborting to avoid a bad replace.");
}

const updatedBody = row.bodyContent.replace(OLD_SENTENCE, NEW_SENTENCE);

await db.update(experiences).set({ bodyContent: updatedBody }).where(eq(experiences.id, EXPERIENCE_ID));

console.log("Updated session times for qatar-gp-ticket-guide-mtymjjwm (id " + EXPERIENCE_ID + ")");
await client.end();

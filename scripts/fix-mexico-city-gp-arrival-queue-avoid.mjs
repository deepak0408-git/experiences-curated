import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "3109372f-7cf4-46eb-b9a0-3843c7a3362e";

const whatToAvoid = `Don't trust generic "what to bring to Foro Sol" advice that recommends a seat cushion for the concrete stands — that's genuinely good comfort advice everywhere else on the F1 calendar, but here it's on the same prohibited list as chairs, and it gets confiscated just the same. Check this circuit's specific rules rather than assuming standard grandstand-comfort advice applies. And don't plan to bring a cooler for a full day of food and drinks — it's explicitly banned alongside the more obvious prohibited items, so budget for buying food and drink inside the venue rather than packing your own for the day.`;

const editorialNote = "Bag policy dimensions, security screening detail, prohibited items list (chairs/cushions, umbrella rule, 300mm/2-lens camera limit) sourced from oversteer48.com's dedicated 'Entrance Gates & Bag Policy' guide, cross-checked against mexico.gp's own 'Rules for Visitors' page, Sep 2026. What to Avoid rebuilt 6 Sep 2026 after both original avoids were found to restate bodyContent verbatim — replaced with 2 genuinely new avoids sourced directly from mexico.gp/en/rules-for-visitors-19: the seat-cushion contradiction (widely recommended online for Foro Sol's concrete seating, but actually banned here) and the cooler ban (not otherwise mentioned in this experience).";

const [result] = await db
  .update(experiences)
  .set({ whatToAvoid, editorialNote, lastVerifiedDate: "2026-09-06" })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Updated: ${result.title}`);
await client.end();

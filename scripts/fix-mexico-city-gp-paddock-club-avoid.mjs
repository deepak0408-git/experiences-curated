import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Replaces the first What to Avoid on F1 Paddock Club & Champions Club —
// Mexico City, flagged by the founder 6 Sep 2026 as a restatement of the
// Paddock Club/Champions Club distinction already fully explained in
// bodyContent (fails the researcher skill's "not mentioned elsewhere" bar
// for a genuine avoid). Replacement: a real, F1 Experiences-confirmed dress
// code pitfall (f1experiences.com/blog/your-ultimate-checklist-for-a-day-at-the-track,
// 6 Sep 2026) — smart-casual required, flip-flops/beach/gym wear explicitly
// banned, general F1 Experiences policy across all races. The second avoid
// (hospitality inventory doesn't reliably reappear once sold out) is
// genuinely new and unchanged.

const EXPERIENCE_ID = "41cf34c3-c937-4e8b-8ab9-029224f3f6d1";

const whatToAvoid = `Don't show up in flip-flops, beach wear, or gym clothes assuming hospitality means anything-goes — F1 Experiences enforces a smart-casual dress code across both tiers, and those three categories specifically are turned away at entry regardless of ticket type. Smart jeans and tailored shorts are fine, but pack accordingly rather than finding out at the gate. And don't leave booking until close to race week assuming hospitality always has room — unlike general admission resale, hospitality packages here don't reliably reappear once sold out, since they're a fixed, catered headcount rather than a seat that can be resold individually.`;

const [existing] = await db
  .select({ whatToAvoid: experiences.whatToAvoid })
  .from(experiences)
  .where(eq(experiences.id, EXPERIENCE_ID));

console.log("Before:", existing.whatToAvoid);

const [result] = await db
  .update(experiences)
  .set({ whatToAvoid, lastVerifiedDate: "2026-09-06" })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`\n✓ Updated: ${result.title}`);

await client.end();

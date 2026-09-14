// Qatar GP 2026 Ticket Guide — replace Avoid 1, which restated the body
// copy's own GA-sold-out paragraph almost verbatim. New Avoid 1 is a
// genuinely new practical warning (North Grandstand's unallocated seating
// creates real arrival-timing risk on a sold-out weekend) grounded in a fact
// already present in the body but never turned into an avoid-point there.
// Avoid 2 (Main Grandstand podium-view vs overtaking tradeoff) is unchanged.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "f46fe80e-b09c-4305-98da-93786203c811"; // qatar-gp-ticket-guide-mtymjjwm

const OLD_AVOID_1 = "Don't assume General Admission will still be biddable at the gate the way it has been at some other circuits — Lusail's GA sold out entirely on the official platform ahead of the weekend, so anyone without a ticket already is looking at resale markup, not a walk-up option.";
const NEW_AVOID_1 = "Don't leave North Grandstand entry until close to a session start — seating there is unallocated, so a late arrival on a sold-out race weekend means standing or a compromised sightline, not just a worse-but-guaranteed seat.";

const [row] = await db.select({ whatToAvoid: experiences.whatToAvoid }).from(experiences).where(eq(experiences.id, EXPERIENCE_ID));

if (!row) {
  throw new Error("Experience not found: " + EXPERIENCE_ID);
}
if (!row.whatToAvoid.includes(OLD_AVOID_1)) {
  throw new Error("Old Avoid 1 sentence not found verbatim in what_to_avoid — aborting to avoid a bad replace. Current value: " + row.whatToAvoid);
}

const updatedWhatToAvoid = row.whatToAvoid.replace(OLD_AVOID_1, NEW_AVOID_1);

await db.update(experiences).set({ whatToAvoid: updatedWhatToAvoid }).where(eq(experiences.id, EXPERIENCE_ID));

console.log("Updated Avoid 1 for qatar-gp-ticket-guide-mtymjjwm (id " + EXPERIENCE_ID + ")");
await client.end();

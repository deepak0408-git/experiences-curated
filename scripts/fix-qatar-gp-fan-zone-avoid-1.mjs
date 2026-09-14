// Qatar GP 2026 Fan Zone — replace Avoid 1, which restated the body's own
// "2026 lineup hadn't been announced yet" sentence almost verbatim. New
// Avoid 1 is a genuinely new practical warning (entrance/parking location
// creates a real crowd-bottleneck risk at arrival and post-concert exodus),
// a consequence of the body's location fact rather than a restatement of it,
// and distinct from both insider tips. Avoid 2 (driver appearance timing)
// is unchanged.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-fan-zone-mtympq8u";

const OLD_AVOID_1 = "Don't expect the concert headliners to be confirmed far in advance — lineup announcements for this event have historically landed close to the race weekend, so don't plan your travel dates around a specific act until it's officially confirmed.";
const NEW_AVOID_1 = "Don't expect a quick in-and-out visit right before the race or right after the concert — the Fan Zone sits directly against the circuit's main entrance and parking, exactly where arrival and post-race crowds bottleneck hardest.";

const [row] = await db.select({ id: experiences.id, whatToAvoid: experiences.whatToAvoid })
  .from(experiences).where(eq(experiences.slug, SLUG));
if (!row) throw new Error("Experience not found: " + SLUG);
if (!row.whatToAvoid.includes(OLD_AVOID_1)) {
  throw new Error("Old Avoid 1 not found verbatim — aborting. Current: " + row.whatToAvoid);
}

const updated = row.whatToAvoid.replace(OLD_AVOID_1, NEW_AVOID_1);
await db.update(experiences).set({ whatToAvoid: updated }).where(eq(experiences.id, row.id));

console.log("Replaced Avoid 1 for", SLUG);
await client.end();

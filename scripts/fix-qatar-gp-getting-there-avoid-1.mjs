// Qatar GP 2026 Getting to Lusail Circuit — replace Avoid 1, which
// duplicated both Insider Tip 1 and the body's own Uber/Karwa sentence
// almost verbatim. New Avoid 1 is grounded in the body's "parking is free
// but limited" fact, never turned into a warning elsewhere, and distinct
// from both insider tips and Avoid 2 (Al Khor Coastal Road bottleneck).

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-getting-there-mtymqst2";

const OLD_AVOID_1 = "Don't rely on Uber for your return trip from the circuit — it's fine for getting there but doesn't reliably pick up from the venue itself, and Karwa is the dependable option for departures.";
const NEW_AVOID_1 = "Don't assume free parking means guaranteed parking — spaces are limited, and arriving without a plan for a full lot means circling or a longer walk than expected on the day everyone else drives too.";

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

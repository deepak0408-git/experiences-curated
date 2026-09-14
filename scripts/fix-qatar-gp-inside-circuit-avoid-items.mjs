// Qatar GP 2026 Inside Lusail Circuit — replace the two "avoid" items, which
// were weak trivia corrections (circuit age, pit building construction date)
// rather than genuinely useful warnings. Now that the body covers the
// circuit's real bookable track-day programmes (added in
// fix-qatar-gp-inside-circuit-add-track-days.mjs), there's better practical
// material: mandatory advance registration, the no-refund cancellation
// policy, and Karting's hard age/height/weight eligibility gates — all
// sourced from lcsc.qa/circuit-experience, verified 14 Sep 2026.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-inside-lusail-circuit-mtymp2ma";

const OLD_AVOID = "Don't mistake Lusail for a brand-new circuit built purely for F1 — the track itself dates to 2004 and ran two decades of motorcycle racing first, which is worth knowing if you want to talk to it with any real context rather than assuming it's a generic modern layout. Don't assume the pit lane building you see is original construction — it's part of the 2023 rebuild, replacing what was there for the circuit's first two decades.";

const NEW_AVOID = "Don't assume you can book a track-day slot on short notice — advance registration through members.lcsc.qa is mandatory, and on-site signups aren't accepted; Mixed Training Days explicitly warn that walk-up registration delays your track access. Don't expect a refund if a session is cancelled for weather or safety — Lusail's policy issues a future-use voucher only, and bookings can't be exchanged, rescheduled, transferred, or refunded. Don't bring younger kids expecting to kart together — Karting sets a hard minimum of 13 years and 153cm, a 120kg weight cap, and requires a guardian present for anyone under 18.";

const [row] = await db.select({ id: experiences.id, whatToAvoid: experiences.whatToAvoid })
  .from(experiences).where(eq(experiences.slug, SLUG));
if (!row) throw new Error("Experience not found: " + SLUG);
if (row.whatToAvoid !== OLD_AVOID) {
  throw new Error("what_to_avoid did not match expected value verbatim — aborting. Current: " + row.whatToAvoid);
}

await db.update(experiences).set({ whatToAvoid: NEW_AVOID }).where(eq(experiences.id, row.id));

console.log("Replaced what_to_avoid for", SLUG);
await client.end();

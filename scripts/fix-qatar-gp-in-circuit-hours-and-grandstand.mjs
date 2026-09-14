// Qatar GP 2026 — fix stale/placeholder session-time references across
// in-circuit experiences, sourced from the live formula1.com/en/racing/2026/qatar
// official schedule, Track Time (Doha/AST, UTC+3, no DST), verified 14 Sep 2026
// — same source already used for the Ticket Guide fix.
//
// 1. Main Grandstand body: "Sunday's 4pm race" was stale (correct is 7pm).
// 2. Main Grandstand Avoid 1: restated the body's own Zone A / Turn 1 point
//    almost verbatim as Avoid 2 already covers that — replaced with two
//    genuinely new points (screen dependency despite the highest grandstand
//    price; price vs plastic-chair seat-comfort mismatch), both grounded in
//    facts already stated in the body/Ticket Guide but never turned into a
//    warning. Existing Zone A/D-E point (formerly Avoid 2) is kept as Avoid 3.
// 3. practical_info.hours updated on all 7 in-circuit experiences (physically
//    at Lusail Circuit) to state the real 2026 session schedule instead of a
//    vague "published closer to race weekend" placeholder.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SESSION_HOURS = "2026 session times (local/Doha, AST): Practice 1 Fri 4:30-5:30pm, Practice 2 Fri 8-9pm, Practice 3 Sat 5:30-6:30pm, Qualifying Sat 9-10pm, Race Sun 7pm.";

async function updateHours(slug, buildNewHours) {
  const [row] = await db.select({ id: experiences.id, practicalInfo: experiences.practicalInfo })
    .from(experiences).where(eq(experiences.slug, slug));
  if (!row) throw new Error("Experience not found: " + slug);
  const newHours = buildNewHours(row.practicalInfo?.hours);
  const updated = { ...row.practicalInfo, hours: newHours };
  await db.update(experiences).set({ practicalInfo: updated }).where(eq(experiences.id, row.id));
  console.log("Updated hours for", slug, "->", newHours);
}

// --- 1 & 2: Main Grandstand body + Avoid 1 ---
const [mainGrandstand] = await db.select({ id: experiences.id, bodyContent: experiences.bodyContent, whatToAvoid: experiences.whatToAvoid })
  .from(experiences).where(eq(experiences.slug, "qatar-gp-main-grandstand-mtymn305"));
if (!mainGrandstand) throw new Error("Main Grandstand experience not found");

const OLD_BODY_SENTENCE = "and by the time Sunday's 4pm race reaches its closing laps under floodlights, the evening chill is real — pack a layer regardless of how warm the afternoon felt.";
const NEW_BODY_SENTENCE = "and by the time Sunday's 7pm race reaches its closing laps under floodlights, the evening chill is real — pack a layer regardless of how warm the afternoon felt.";
if (!mainGrandstand.bodyContent.includes(OLD_BODY_SENTENCE)) {
  throw new Error("Main Grandstand: old body sentence not found verbatim — aborting.");
}
const newBody = mainGrandstand.bodyContent.replace(OLD_BODY_SENTENCE, NEW_BODY_SENTENCE);

const OLD_AVOID_1 = "Don't assume the whole stand is covered because it's advertised with a roof — only the back half actually has shade, and a front-row seat can mean full sun through a Friday afternoon practice session.";
const NEW_AVOID_1 = "Don't assume paying the most for a grandstand ticket means you'll see the whole lap live — Main Grandstand still relies on the venue's big screens to cover corners outside the front straight, the same as every other stand.";
const NEW_AVOID_2 = "Don't expect a premium physical seat to match the price — Main Grandstand is the most expensive grandstand ticket at Lusail, but seating throughout is individual plastic chairs, the same seating standard as the cheaper corner stands.";
if (!mainGrandstand.whatToAvoid.includes(OLD_AVOID_1)) {
  throw new Error("Main Grandstand: old Avoid 1 not found verbatim — aborting.");
}
const newAvoid = mainGrandstand.whatToAvoid.replace(OLD_AVOID_1, NEW_AVOID_1 + " " + NEW_AVOID_2);

await db.update(experiences).set({ bodyContent: newBody, whatToAvoid: newAvoid }).where(eq(experiences.id, mainGrandstand.id));
console.log("Updated Main Grandstand body (4pm->7pm) and Avoid 1 (screen dependency).");

// --- 3: hours field across all 7 in-circuit experiences ---
await updateHours("qatar-gp-main-grandstand-mtymn305", () =>
  "Gates open several hours before first session. " + SESSION_HOURS);

await updateHours("qatar-gp-north-grandstand-mtymo0an", () =>
  "Gates open several hours before first session. " + SESSION_HOURS);

await updateHours("qatar-gp-lusail-hill-general-admission-mtzc059v", () =>
  "Gates open ahead of each day's on-track session, Fri 27 – Sun 29 Nov 2026. " + SESSION_HOURS);

await updateHours("qatar-gp-lusail-hill-lounge-mtymm3gw", () =>
  "Opens ahead of first session each day, through the post-race concert programme. " + SESSION_HOURS);

await updateHours("qatar-gp-paddock-champions-club-mtymkynt", () =>
  "Hospitality suites open ahead of first session each day, close after the race concert programme ends. " + SESSION_HOURS);

await updateHours("qatar-gp-inside-lusail-circuit-mtymp2ma", () =>
  "Gates open several hours before first session each race day. " + SESSION_HOURS);

await updateHours("qatar-gp-fan-zone-mtympq8u", () =>
  "Opens with circuit gates each race day, runs through the post-race concert programme. " + SESSION_HOURS);

console.log("Done.");
await client.end();

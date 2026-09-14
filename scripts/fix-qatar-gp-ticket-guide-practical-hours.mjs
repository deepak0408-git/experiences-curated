// Qatar GP 2026 Ticket Guide — update practical_info.hours with the real
// confirmed session schedule (was a deferred placeholder: "exact times
// published closer to the race weekend"). Sourced from the live
// formula1.com/en/racing/2026/qatar official schedule, Track Time (Doha/AST,
// UTC+3, no DST), verified 14 Sep 2026 — same source used to fix the body
// copy in fix-qatar-gp-ticket-guide-session-times.mjs.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "f46fe80e-b09c-4305-98da-93786203c811"; // qatar-gp-ticket-guide-mtymjjwm

const OLD_HOURS = "Gates open several hours before first session each day; exact times published closer to the race weekend";
const NEW_HOURS = "Gates open several hours before first session each day. 2026 session times (local/Doha, AST): Practice 1 Fri 4:30-5:30pm, Practice 2 Fri 8-9pm, Practice 3 Sat 5:30-6:30pm, Qualifying Sat 9-10pm, Race Sun 7pm.";

const [row] = await db.select({ practicalInfo: experiences.practicalInfo }).from(experiences).where(eq(experiences.id, EXPERIENCE_ID));

if (!row) {
  throw new Error("Experience not found: " + EXPERIENCE_ID);
}
if (row.practicalInfo?.hours !== OLD_HOURS) {
  throw new Error("practical_info.hours did not match expected placeholder verbatim — aborting to avoid a bad overwrite. Current value: " + row.practicalInfo?.hours);
}

const updatedPracticalInfo = { ...row.practicalInfo, hours: NEW_HOURS };

await db.update(experiences).set({ practicalInfo: updatedPracticalInfo }).where(eq(experiences.id, EXPERIENCE_ID));

console.log("Updated practical_info.hours for qatar-gp-ticket-guide-mtymjjwm (id " + EXPERIENCE_ID + ")");
await client.end();

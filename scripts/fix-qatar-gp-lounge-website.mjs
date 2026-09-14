// Qatar GP 2026 Lusail Hill Lounge — replace practical_info.website with
// https://f1experiences.com/2026-qatar-grand-prix per curator instruction
// 14 Sep 2026 (was hospitality.lcsc.qa direct booking link).

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-lusail-hill-lounge-mtymm3gw";
const OLD_WEBSITE = "https://hospitality.lcsc.qa/2026-f1-qatar-grand-prix/lusail-hill-lounge-3-days";
const NEW_WEBSITE = "https://f1experiences.com/2026-qatar-grand-prix";

const [row] = await db.select({ id: experiences.id, practicalInfo: experiences.practicalInfo })
  .from(experiences).where(eq(experiences.slug, SLUG));
if (!row) throw new Error("Experience not found: " + SLUG);
if (row.practicalInfo?.website !== OLD_WEBSITE) {
  throw new Error("website field did not match expected value verbatim — aborting. Current value: " + row.practicalInfo?.website);
}

const updated = { ...row.practicalInfo, website: NEW_WEBSITE };
await db.update(experiences).set({ practicalInfo: updated }).where(eq(experiences.id, row.id));

console.log("Updated website for", SLUG, "->", NEW_WEBSITE);
await client.end();

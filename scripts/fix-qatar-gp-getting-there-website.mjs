// Qatar GP 2026 Getting to Lusail Circuit — replace practical_info.website
// with the official Visit Qatar Doha Metro page per curator instruction
// 14 Sep 2026 (was gpdestinations.com, a third-party guide site).

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-getting-there-mtymqst2";
const OLD_WEBSITE = "https://gpdestinations.com/how-to-get-to-lusail-circuit-qatar-grand-prix/";
const NEW_WEBSITE = "https://visitqatar.com/intl-en/plan-your-trip/getting-around/doha-metro";

const [row] = await db.select({ id: experiences.id, practicalInfo: experiences.practicalInfo })
  .from(experiences).where(eq(experiences.slug, SLUG));
if (!row) throw new Error("Experience not found: " + SLUG);
if (row.practicalInfo?.website !== OLD_WEBSITE) {
  throw new Error("website field did not match expected value verbatim — aborting. Current: " + row.practicalInfo?.website);
}

const updated = { ...row.practicalInfo, website: NEW_WEBSITE };
await db.update(experiences).set({ practicalInfo: updated }).where(eq(experiences.id, row.id));

console.log("Updated website for", SLUG, "->", NEW_WEBSITE);
await client.end();

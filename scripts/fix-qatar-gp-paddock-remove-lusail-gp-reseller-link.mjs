// Qatar GP 2026 Paddock Club & Champions Club — remove www.lusail.gp from
// practical_info.website. Per curator (14 Sep 2026): lusail.gp is a reseller,
// not an official/authorized source, and shouldn't be listed as a website
// link. Confirmed via DB-wide search this is the only occurrence of
// "lusail.gp" across experiences (all text fields) and blog_articles.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-paddock-champions-club-mtymkynt";

const [row] = await db.select({ id: experiences.id, practicalInfo: experiences.practicalInfo })
  .from(experiences).where(eq(experiences.slug, SLUG));
if (!row) throw new Error("Experience not found: " + SLUG);

const OLD_WEBSITE = "https://f1experiences.com/2026-qatar-grand-prix, https://www.lusail.gp/en/ticket-info/paddock-club-3";
const NEW_WEBSITE = "https://f1experiences.com/2026-qatar-grand-prix";

if (row.practicalInfo?.website !== OLD_WEBSITE) {
  throw new Error("website field did not match expected value verbatim — aborting. Current value: " + row.practicalInfo?.website);
}

const updated = { ...row.practicalInfo, website: NEW_WEBSITE };
await db.update(experiences).set({ practicalInfo: updated }).where(eq(experiences.id, row.id));

console.log("Removed lusail.gp reseller link from", SLUG, "-> website now:", NEW_WEBSITE);
await client.end();

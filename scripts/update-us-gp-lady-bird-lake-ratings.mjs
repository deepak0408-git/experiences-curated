import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const ZILKER_LINK = "https://maps.google.com/?cid=14614379205218396474&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA";
const TEXAS_ROWING_LINK = "https://maps.google.com/?cid=3980143022682206700&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA";

const [row] = await db
  .select({ id: experiences.id, bodyContent: experiences.bodyContent })
  .from(experiences)
  .where(eq(experiences.slug, "us-gp-lady-bird-lake-mtns0w9a"));

const oldSentence = "Zilker Park Boat Rentals and Texas Rowing Center both offer similar hourly and daily rates if Rowing Dock isn't convenient to your specific spot on the lake.";
const newSentence = `Zilker Park Boat Rentals [See live rating and reviews on Google Maps](${ZILKER_LINK}) and Texas Rowing Center [See live rating and reviews on Google Maps](${TEXAS_ROWING_LINK}) both offer similar hourly and daily rates if Rowing Dock isn't convenient to your specific spot on the lake.`;

if (!row.bodyContent.includes(oldSentence)) {
  console.log("NO MATCH — sentence not found, aborting without writing.");
  process.exit(1);
}

const fixed = row.bodyContent.replace(oldSentence, newSentence);
await db.update(experiences).set({ bodyContent: fixed }).where(eq(experiences.id, row.id));

console.log("✓ Updated bodyContent with real Zilker Park Boat Rentals (4.6/735) and Texas Rowing Center (4.6/665) rating links.");
await client.end();

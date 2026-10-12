import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, sql } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

// Multi-venue inline rating pattern for Camping at the Circuit — GPtents
// and IntentsGP both confidently matched via Google Places API (on-site in
// Stavelot, near the circuit), 12 Oct 2026. Glamping Green deliberately
// left unrated — no confident match found under that name anywhere near
// Spa; the closest hits (Durbuy, Gembloux, Gavere) are unrelated operators,
// and per the "don't force a weak match" rule this is not cited as if
// verified. Per the standing rule, no static rating number/review count in
// prose — live Google Maps links only.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const GPTENTS_MAPS_URL = "https://maps.google.com/?cid=369940456000188960";
const INTENTSGP_MAPS_URL = "https://maps.google.com/?cid=16212250360368861786";

const [exp] = await db.select({ bodyContent: experiences.bodyContent }).from(experiences).where(eq(experiences.slug, "camping-at-the-circuit-belgian-gp-mqdpzgc8"));

const oldPara = "For those who want to camp without sleeping in a tent they carried on a plane, the premium options are worth knowing. GPtents operates within the Green Zone — pre-erected tents with electricity, hot showers on site, and a restaurant. Last availability for 2026 was visible in May; check gptents.com. IntentsGP runs a private compound with bell tents and yurts, breakfast included, priced from £949 to £1,439 per tent for the weekend. Glamping Green offers similar pre-erected tents at approximately €1,150 per unit.";

const newPara = `For those who want to camp without sleeping in a tent they carried on a plane, the premium options are worth knowing. GPtents operates within the Green Zone — pre-erected tents with electricity, hot showers on site, and a restaurant. [See live rating and reviews on Google Maps](${GPTENTS_MAPS_URL}). Last availability for 2026 was visible in May; check gptents.com. IntentsGP runs a private compound with bell tents and yurts, breakfast included, priced from £949 to £1,439 per tent for the weekend. [See live rating and reviews on Google Maps](${INTENTSGP_MAPS_URL}). Glamping Green offers similar pre-erected tents at approximately €1,150 per unit — no independently verified rating found for this operator under this name as of this writing.`;

if (!exp.bodyContent.includes(oldPara)) {
  throw new Error("Expected paragraph not found verbatim — body content may have changed since this script was written.");
}

const updatedBody = exp.bodyContent.replace(oldPara, newPara);

await db.update(experiences).set({ bodyContent: updatedBody }).where(eq(experiences.slug, "camping-at-the-circuit-belgian-gp-mqdpzgc8"));

console.log("✓ Updated Camping at the Circuit body content with real GPtents/IntentsGP Google Maps links.");
await client.end();

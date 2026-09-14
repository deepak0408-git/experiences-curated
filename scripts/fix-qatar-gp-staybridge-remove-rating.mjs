// Qatar GP 2026 Staybridge Suites Lusail — remove the Google-rating sentence
// from the body per curator instruction 14 Sep 2026 (single-venue experience;
// curator does not want the rating call-out in body copy for this type).

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-staybridge-suites-lusail-mtymtkn0";

const OLD_SENTENCE = "The property backs that value pitch up with a genuinely strong Google rating — 4.7 from 703 reviews. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=12120076132753572246&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) ";
const NEW_TEXT = "";

const [row] = await db.select({ id: experiences.id, bodyContent: experiences.bodyContent })
  .from(experiences).where(eq(experiences.slug, SLUG));
if (!row) throw new Error("Experience not found: " + SLUG);
if (!row.bodyContent.includes(OLD_SENTENCE)) throw new Error("Sentence not found verbatim — aborting.");

const newBody = row.bodyContent.replace(OLD_SENTENCE, NEW_TEXT);
await db.update(experiences).set({ bodyContent: newBody }).where(eq(experiences.id, row.id));

console.log("Removed Google rating sentence from", SLUG);
await client.end();

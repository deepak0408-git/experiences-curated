// Qatar GP 2026 Raffles Doha & Fairmont Doha — remove the Google-rating
// claims from the Raffles and Fairmont paragraphs per curator instruction
// 14 Sep 2026. Raffles' sentence needed a grammatical rewrite (removing just
// the rating clause left a dangling fragment); Fairmont's rating sentence is
// removed outright since it was a standalone sentence.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-lusail-marina-hotels-mtymsd31";

const OLD_RAFFLES = "It's ranked #2 of 12 hotels in Lusail on TripAdvisor, and its Google rating backs that up at a genuinely strong 4.6 from 1,848 reviews — guests consistently single out the suite layouts and the views as the standout.";
const NEW_RAFFLES = "It's ranked #2 of 12 hotels in Lusail on TripAdvisor — guests consistently single out the suite layouts and the views as the standout.";

const OLD_FAIRMONT = " Fairmont's Google rating sits at 4.5 from 3,238 reviews, a genuinely large sample backing a strong score.";
const NEW_FAIRMONT = "";

const [row] = await db.select({ id: experiences.id, bodyContent: experiences.bodyContent })
  .from(experiences).where(eq(experiences.slug, SLUG));
if (!row) throw new Error("Experience not found: " + SLUG);
if (!row.bodyContent.includes(OLD_RAFFLES)) throw new Error("Raffles sentence not found verbatim — aborting.");
if (!row.bodyContent.includes(OLD_FAIRMONT)) throw new Error("Fairmont sentence not found verbatim — aborting.");

let newBody = row.bodyContent.replace(OLD_RAFFLES, NEW_RAFFLES);
newBody = newBody.replace(OLD_FAIRMONT, NEW_FAIRMONT);

await db.update(experiences).set({ bodyContent: newBody }).where(eq(experiences.id, row.id));

console.log("Updated body_content for", SLUG, "— removed Raffles and Fairmont Google rating claims.");
await client.end();

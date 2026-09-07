import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "f4a8b4a0-a573-495f-9ab7-947789e136a8";

const whatToAvoid = `Don't plan to see the museum and Chapultepec Castle in the same short visit without budgeting real time for both — each deserves a couple of hours minimum, and trying to compress both into an afternoon usually means rushing through one or the other. And don't expect most exhibit labels to be in English — the majority of the museum's information is Spanish-only, so if you don't read Spanish comfortably, budget for the English audio guide (75 pesos, photo ID required as a deposit) rather than assuming you'll follow along with wall text alone.`;

const editorialNote = "Museum hours, entry fee, and queue-time detail sourced from Rehlat.bh and WonderfulMuseums.com's Anthropology Museum guides, Sep 2026. Park scale (2x Central Park) sourced from WeRoad.com's Mexico City guide. Google ratings via Places API lookup same session: Bosque de Chapultepec 4.7/267,836 reviews, Museo Nacional de Antropología 4.8/91,878 reviews. Multi-venue: MULTI_VENUE_RATINGS entry required, venueCount 2. Second What to Avoid replaced 6 Sep 2026 — the original restated bodyContent's queue-time fact almost verbatim. Replaced with the Spanish-only exhibit labeling and paid English audio guide detail (75 pesos + photo ID deposit), sourced from Mexico Insider's museum guide and a Tripadvisor forum thread on English-language access, 6 Sep 2026 — not previously mentioned in this experience.";

const [result] = await db
  .update(experiences)
  .set({ whatToAvoid, editorialNote, lastVerifiedDate: "2026-09-06" })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Updated: ${result.title}`);
await client.end();

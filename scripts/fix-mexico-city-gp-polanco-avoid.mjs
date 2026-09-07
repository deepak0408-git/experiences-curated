import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "e908dbad-1080-470f-9f0e-f5d02cc0cc3f";

const whatToAvoid = `Don't book here expecting the same walkable, café-hopping character as Roma Norte or Condesa — Polanco's blocks are wider and more commercial, built around shopping and dining destinations rather than a dense network of small independent spots to wander between. And don't assume the whole neighborhood is equally safe and lively late at night just because Polanco has a strong overall safety reputation — the main strips (Avenida Presidente Masaryk, Campos Elíseos, around Parque Lincoln) stay busy and well-lit, but the quieter residential side streets thin out well before midnight, so use a rideshare rather than walking those stretches alone late.`;

const editorialNote = "Polanco safety/character sourced from CasaGoliana.com's safest-neighborhoods guide, Sep 2026. Hotel picks (Las Alcobas, JW Marriott Polanco) sourced from Expedia and TravelExperta.com Polanco luxury-hotel roundups; Google ratings via Places API lookup same session (Las Alcobas 4.6/589 reviews, JW Marriott 4.7/6,189 reviews). Multi-venue: MULTI_VENUE_RATINGS entry required, venueCount 2. First What to Avoid replaced 6 Sep 2026 — it restated bodyContent's own 'furthest from circuit' fact verbatim. Replaced with street-level late-night guidance (main strips vs. quieter residential side streets), sourced from TravelInsighter.com and TourInABox.com's Polanco safety guides, 6 Sep 2026 — a more specific, actionable distinction than the neighborhood's general safety reputation already covered elsewhere.";

const [result] = await db
  .update(experiences)
  .set({ whatToAvoid, editorialNote, lastVerifiedDate: "2026-09-06" })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Updated: ${result.title}`);
await client.end();

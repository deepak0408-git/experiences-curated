import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "4de61674-a79c-4c0a-a94c-1c85c7bd7db0";

const whatToAvoid = `Don't use the Belem dock — locals and repeat visitors consistently point to it as the one where operators overcharge tourists the most, sometimes claiming a posted rate is "per person" when it's actually per boat, which can double what you end up paying versus the real regulated rate. Nuevo Nativitas or Cuemanco are the more reliably fair-priced starting points. And don't drink heavily while you're on the water — it's a genuinely easy environment to overdo it in given how freely vendor boats sell micheladas and beer throughout the trip, but intoxication on a boat with open sides and no real supervision is a real, avoidable safety risk, not just a buzzkill warning.`;

const editorialNote = "Pricing (750 MXN/hour regulated rate, shared trajinera pricing), embarcadero comparison, and cash-only/practical detail sourced from CasaGoliana.com's 2026 Xochimilco guide and SlightNorth.com's boat guide, Sep 2026. Google rating via Places API lookup, retried with more specific query per skill guidance after a bare 'Xochimilco' search returned no rating (borough-level entity, not a rateable single venue) — Embarcadero Nuevo Nativitas 4.4/16,370 reviews used as the real, addressable launch point. What to Avoid rebuilt 6 Sep 2026 after both original avoids were found to restate bodyContent verbatim — replaced with 2 genuinely new avoids: the Belem dock overcharging risk and the per-person/per-boat pricing scam mechanic (sourced from ForTheRoadTravels.com's Xochimilco scam-avoidance guide, 6 Sep 2026), and on-water alcohol safety (sourced from general Xochimilco visitor-safety guides, 6 Sep 2026) — neither previously mentioned in this experience.";

const [result] = await db
  .update(experiences)
  .set({ whatToAvoid, editorialNote, lastVerifiedDate: "2026-09-06" })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Updated: ${result.title}`);
await client.end();

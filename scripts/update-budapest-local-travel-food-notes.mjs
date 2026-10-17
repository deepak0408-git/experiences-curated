import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { plannerDestinationBands } from "../schema/database.ts";

// Budapest planner_destination_bands — localTravelNote / foodNote rewrite.
// planner-data-researcher skill, §4.
//
// Original notes (seeded 23 Jul 2026) were judged thinner than the
// Melbourne precedent, which names a specific everyday transit pass price
// AND a specific named food venue (Queen Victoria Market). User flagged
// this 16 Oct 2026 while reviewing Hungarian GP 2027 planning data.
//
// Local Travel: added a named everyday BKK fare (single ticket ~500 Ft,
// 24-hour travelcard ~2,750 Ft) ahead of the existing race-weekend perks
// (Budapest Card free travel, Kerepes HEV fan bus to Gate 3, F1 combined
// day ticket). BKK's own site could not be directly confirmed — multiple
// travel-blog sources converged on these figures (one citing a June fare
// rise to 2,750 Ft from 2,500 Ft) but conflicted on exact current pricing,
// so this is directional, softened with "about"/"around" per the skill's
// sourcing-confidence rule, not stated as exact.
//
// Food: kept the existing "napi menü"/"ebédmenü" fixed-lunch tip, added a
// second real named venue (Great Market Hall's upstairs stalls, a classic
// langos ~EUR 5-9) to match Melbourne's named-place density. Source:
// travel-blog guides (doeatbetterexperience.com and others), directional
// only, softened with "about".
//
// Still 2 sentences each (what the band covers -> one real actionable
// tip), dollar bands themselves ($12/day local travel, $47/day food)
// still not restated in the note text. User-approved 16 Oct 2026.

const BUDAPEST_DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const localTravelNote =
  "This range covers Budapest's BKK metro, tram, and bus network — a single ticket runs about 500 Ft (~$1.50), or a 24-hour travelcard for around 2,750 Ft (~$8) — genuinely no car needed. Ticket-holders get real perks on race day too: Budapest Card holders ride completely free to the Hungaroring, a direct fan bus runs from Kerepes HÉV station to Gate 3, and F1's own combined day ticket (3,749 Ft, about $10) covers unlimited transport plus the shuttle.";

const foodNote =
  "This range covers solid, unpretentious Hungarian dining, not fine dining. Look for a \"napi menü\" or \"ebédmenü\" — a fixed lunch menu most restaurants outside the tourist strip offer for 2,000–3,500 Ft (roughly $5–9) — or head to the Great Market Hall's upstairs stalls, where a classic lángos runs about €5–9 for a filling, fast meal.";

const result = await db
  .update(plannerDestinationBands)
  .set({ localTravelNote, foodNote, lastUpdated: new Date() })
  .where(eq(plannerDestinationBands.destinationId, BUDAPEST_DESTINATION_ID))
  .returning();

console.log(`Updated ${result.length} planner_destination_bands row(s) for Budapest.`);
console.log(JSON.stringify(result, null, 2));

await client.end();

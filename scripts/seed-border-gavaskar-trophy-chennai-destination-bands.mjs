import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Local Travel + Food daily USD cost data for Chennai (Border-Gavaskar
// Trophy 2027), researched 9 Oct 2026 per the planner-data-researcher
// skill's Local Travel & Food methodology (§4).
//
// Standing decision (9 Oct 2026, founder-confirmed): Chennai is the SOLE
// researched Local Travel/Food baseline for this 3-city pack (Nagpur,
// Chennai, Ahmedabad) — same scope decision as the Chennai-only hotel
// research (see scripts/seed-border-gavaskar-trophy-chennai-hotels.mjs).
// Nagpur/Ahmedabad will reuse these figures as an extrapolated baseline,
// with an explicit disclaimer in the Cost/Tickets spoke copy — still
// outstanding as of this script.
//
// SOURCE: Budget Your Trip (budgetyourtrip.com/india/chennai), "Past
// travelers have spent, on average for one day" section — $9.61/day food,
// $2.26/day local transportation (both "All travelers" blended figures).
// No data-quality concerns vs. comparable cities (Mumbai: $38/day food,
// $7/day local travel — Chennai being notably lower is directionally
// correct for a smaller, cheaper metro; BYT's own copy independently
// states Chennai is "in the top 10% of cities in Asia for affordability").
//
// FOUNDER OVERRIDE on local travel, 9 Oct 2026: seeded at $7/day instead
// of BYT's raw $2.26/day. The raw figure reflects public-transit-only
// spend; founder's explicit call was to extrapolate to a realistic
// taxi+local-transit MIX (matching Mumbai's own already-seeded $7/day
// band) rather than publish a bare-public-transit figure that undersells
// real visitor spend. This is a deliberate judgment override, not a
// sourcing correction — flagged here rather than silently blended in.
// Food ($9.61/day) is unchanged, seeded as directly sourced.
//
// localTravelNote: Chepauk MRTS station (Line 1, Chennai Beach <->
// St. Thomas Mount) is a confirmed 4-minute walk from the stadium gate —
// the real, specific, named direct route (sourced via multiple transit-
// direction sites, not BYT). Also checked for an event-specific transit
// perk per skill requirement: Chennai/TNCA have REPEATEDLY offered free
// metro + bus travel for ticket holders at Chepauk for major cricket
// fixtures (IPL 2025, India-Australia T20 2025) — a real, recurring
// pattern, though not yet confirmed for this specific 2027 Test, so
// phrased as "worth checking," not promised.
//
// foodNote: Chennai's fixed-price "meals" (thali-style set lunch — rice,
// sambar, rasam, a couple of curries) at a tiffin chain like Murugan Idli
// Shop, real priced example ~₹270-350 for a full plate (aggregator-sourced,
// directional only, softened with "around" per skill confidence-tiering).

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9"; // Chennai

const LOCAL_TRAVEL_NOTE = "This range covers a mix of taxis/autos and Chennai's MTC buses and rail — the Chepauk MRTS station sits a 4-minute walk from the stadium gate if you want the cheaper option. Chennai has repeatedly offered free metro and bus travel for match ticket holders at Chepauk (IPL 2025, the 2025 India-Australia T20) — worth checking before the Test, since the same offer may well repeat.";

const FOOD_NOTE = "This range covers casual tiffin-house and \"meals\" dining, not restaurant dining — Chennai's food costs are low even by Indian standards. The real budget move is a fixed-price lunch \"meals\" (rice, sambar, rasam, a couple of curries, thali-style) at a tiffin chain like Murugan Idli Shop, typically around ₹270-350 for a full plate.";

const result = await sql`
  INSERT INTO planner_destination_bands (destination_id, local_travel_low, local_travel_high, food_per_day_low, food_per_day_high, currency, local_travel_note, food_note)
  VALUES (${DESTINATION_ID}, '7.00', '7.00', '9.61', '9.61', 'USD', ${LOCAL_TRAVEL_NOTE}, ${FOOD_NOTE})
  ON CONFLICT (destination_id) DO UPDATE SET
    local_travel_low = EXCLUDED.local_travel_low,
    local_travel_high = EXCLUDED.local_travel_high,
    food_per_day_low = EXCLUDED.food_per_day_low,
    food_per_day_high = EXCLUDED.food_per_day_high,
    currency = EXCLUDED.currency,
    local_travel_note = EXCLUDED.local_travel_note,
    food_note = EXCLUDED.food_note,
    last_updated = NOW()
  RETURNING id
`;
console.log(`✓ Chennai destination bands seeded, row id ${result[0].id}`);

const rows = await sql`
  SELECT local_travel_low, local_travel_high, food_per_day_low, food_per_day_high, currency
  FROM planner_destination_bands WHERE destination_id = ${DESTINATION_ID}
`;
console.log(rows);
await sql.end();

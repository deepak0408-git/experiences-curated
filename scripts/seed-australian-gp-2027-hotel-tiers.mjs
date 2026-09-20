import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Real hotel tier data for Melbourne (Australian Grand Prix 2027, Albert
// Park Circuit), researched 19 Sep 2026 per the planner-data-researcher
// skill's Hotels methodology.
//
// EVENT WINDOW: race weekend 2-4 Apr 2027. Search window = eventStartDate-2
// to eventStartDate+5 = 31 Mar - 7 Apr 2027 (7 nights). seasonalBand = "apr".
// This is a NEW seasonal band for Melbourne -- prior seeded rows (dec/jan)
// are for the NZ-in-Australia Boxing Day Test tour, a different event/season
// entirely; this row does not touch or overwrite those.
//
// ZONE: Melbourne is a genuine standalone destination -- no zone/satellite
// question. nextClosestHotelDestinationId stays NULL. Confirmed with curator
// (MEL 100%, no split) 19 Sep 2026.
//
// SOURCE -- Booking.com only (single-source, documented methodology gap).
// order=review_score_and_price sort, ht_id=204 (Hotels only) + review_score=70
// filter, USD pricing via selected_currency=USD. Two fetches (base +
// offset=25) merged to reach a 25-hotel qualifying sample -- a single fetch
// only surfaced 20 results, consistent with GP-weekend demand already
// pulling some inventory off the market. Excluded for <50 reviews: Novotel
// St Kilda (1), United Places Hotel Botanic Gardens (19), Private Unit in
// Heritage Building Fitzroy North (2).
//
// All prices = 7-night Booking.com total / 7, rounded to USD cents.
//
// TIER METHOD -- price-slab, NOT star-based (curator decision, 19 Sep 2026).
// Self-declared Booking.com star ratings did not separate price at all in
// this sample: 4-star and 5-star listings overlapped almost completely
// ($165-$808 spread within "5-star" alone), same failure mode as the
// Wimbledon 2027 London budget/moderate overlap precedent -- here it
// affected the whole distribution, not just one adjacent pair. Curator
// chose the 3 cheapest hotels as budget, then natural price gaps in the
// remaining 22 to split moderate/splurge, with a final adjustment merging
// everything except the single top outlier into splurge.
//
// Real natural gaps used as slab boundaries: $171->$189 (budget/moderate),
// $266->$335 (moderate/splurge). Airport hotels (~24km from Albert Park,
// outside the skill's normal 20km NULL-zone radius) explicitly INCLUDED
// per curator decision 19 Sep 2026 -- still genuinely "Melbourne" and
// genuinely bookable for this event.
//
// LUXURY TIER -- single-hotel exception, curator-approved 19 Sep 2026.
// Only Park Hyatt Melbourne ($807.71) qualifies as luxury; this is BELOW
// the skill's standing 3-hotel minimum. Curator explicitly chose to override
// the minimum here rather than fold Park Hyatt into splurge or leave luxury
// unseeded -- a deliberate, one-off exception (same category as the NYC
// price-reclassification precedent), not a silent rule violation. costLow
// = costHigh = 807.71 (single real price point, no range).
//
// CURRENCY: USD (Booking.com served USD directly via selected_currency=USD
// -- no FX conversion needed).

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne
const SEASONAL_BAND = "apr";
const EDITION_YEAR = 2027;

const TIERS = [
  {
    tier: "budget",
    costLow: "165.29",
    costHigh: "171.14",
    note: "3 hotels: Adina Apartment Hotel Melbourne, Pentridge (5-star, $165.29), ibis Styles Melbourne Airport (4-star, $169.43), Mantra Melbourne Airport (4-star, $171.14).",
  },
  {
    tier: "moderate",
    costLow: "189.29",
    costHigh: "266.71",
    note: "6 hotels: Novotel Melbourne Airport (5-star, $189.29), Quest Preston (4-star, $197.14), Quest Bundoora (5-star, $227.71), lyf Collingwood Melbourne (4-star, $233.57), MainStay Suites Abbotsford (5-star, $254.71), The Sebel Melbourne Moonee Ponds (5-star, $266.71).",
  },
  {
    tier: "splurge",
    costLow: "335.14",
    costHigh: "594.86",
    note: "15 hotels (curator merged the original top price-slab, $489-$595, into splurge rather than a separate luxury tier -- 19 Sep 2026): Quest Collingwood (4-star, $335.14), The Motley Hotel Melbourne Tapestry Collection by Hilton (5-star, $355.00), Crowne Plaza Melbourne Carlton by IHG (4-star, $366.71), Melbourne City Apartment Hotel (4-star, $393.43), Meriton Suites Melbourne (5-star, $398.57), Zagame's House (5-star, $409.14), The StandardX Melbourne (5-star, $420.86), Oakwood Premier Melbourne (5-star, $430.86), Lanson Place Parliament Gardens (5-star, $440.00), Holiday Inn Melbourne Bourke Street Mall by IHG (4-star, $449.57), Quay West Suites Melbourne (5-star, $489.14), Hilton Melbourne Little Queen Street (5-star, $502.86), The Lyall (5-star, $519.57), Treasury on Collins Melbourne (5-star, $565.86), Pullman East Melbourne (5-star, $594.86).",
  },
  {
    tier: "luxury",
    costLow: "807.71",
    costHigh: "807.71",
    note: "1 hotel (curator-approved exception to the 3-hotel minimum, 19 Sep 2026): Park Hyatt Melbourne (5-star, $807.71) -- a genuine standalone outlier, ~$213/night above the next-highest hotel in the whole sample.",
  },
];

for (const t of TIERS) {
  const result = await sql`
    INSERT INTO planner_hotel_tier_cost (destination_id, tier, seasonal_band, edition_year, cost_low, cost_high, currency, refresh_pass)
    VALUES (${DESTINATION_ID}, ${t.tier}, ${SEASONAL_BAND}, ${EDITION_YEAR}, ${t.costLow}, ${t.costHigh}, 'USD', 'initial')
    ON CONFLICT (destination_id, tier, seasonal_band, edition_year) DO UPDATE SET
      cost_low = EXCLUDED.cost_low,
      cost_high = EXCLUDED.cost_high,
      currency = EXCLUDED.currency,
      refresh_pass = EXCLUDED.refresh_pass,
      last_updated = NOW()
    RETURNING tier
  `;
  console.log(`✓ ${result[0].tier} seeded`);
}

const rows = await sql`
  SELECT tier, seasonal_band, edition_year, cost_low, cost_high, currency, refresh_pass
  FROM planner_hotel_tier_cost
  WHERE destination_id = ${DESTINATION_ID} AND seasonal_band = ${SEASONAL_BAND} AND edition_year = ${EDITION_YEAR}
  ORDER BY
    CASE tier WHEN 'budget' THEN 1 WHEN 'moderate' THEN 2 WHEN 'splurge' THEN 3 WHEN 'luxury' THEN 4 END
`;
console.log("\nConfirmed state (Australian GP 2027, Melbourne, apr):");
console.table(rows);

await sql.end();

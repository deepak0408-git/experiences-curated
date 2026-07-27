import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

const BELGIAN_GP_DEST_ID = "101b815a-ba64-4484-aad6-63721a44ed85"; // Belgian Ardennes
const ITALIAN_GP_DEST_ID = "0b0d8f9a-911d-4cc7-8049-50e4685958ca"; // Milan

// ─── 1. Abu Dhabi destination + sporting_events row (packStatus: planned) ──
// Real Content Calendar entry: Yas Marina, Abu Dhabi, 4-6 Dec 2026, currently
// "TO BUILD" — no pack exists. This is the first real use of packStatus, per
// explicit user confirmation (18 Jul 2026) after the full 9-file hard-gate
// audit was completed and verified.

const [abuDhabiDest] = await sql`
  INSERT INTO destinations (name, slug, country_code, region, destination_type, currency)
  VALUES ('Abu Dhabi', 'abu-dhabi', 'AE', 'Abu Dhabi Emirate', 'city', 'AED')
  ON CONFLICT (slug) DO NOTHING
  RETURNING id
`;
let abuDhabiDestId = abuDhabiDest?.id;
if (!abuDhabiDestId) {
  const [existing] = await sql`SELECT id FROM destinations WHERE slug = 'abu-dhabi'`;
  abuDhabiDestId = existing.id;
}
console.log("✓ Abu Dhabi destination:", abuDhabiDestId);

const [abuDhabiEvent] = await sql`
  INSERT INTO sporting_events (
    name, slug, sport, tournament_series, edition_year, destination_id,
    venue_name, venue_address, start_date, end_date, recurrence,
    is_hidden, pack_status
  ) VALUES (
    'Abu Dhabi Grand Prix 2026', 'abu-dhabi-gp-2026', 'formula_one', 'Formula 1', 2026,
    ${abuDhabiDestId}, 'Yas Marina Circuit', 'Yas Island, Abu Dhabi, UAE',
    '2026-12-04', '2026-12-06', 'annual',
    true, 'planned'
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id
`;
let abuDhabiEventId = abuDhabiEvent?.id;
if (!abuDhabiEventId) {
  const [existing] = await sql`SELECT id FROM sporting_events WHERE slug = 'abu-dhabi-gp-2026'`;
  abuDhabiEventId = existing.id;
}
console.log("✓ Abu Dhabi GP sporting_events row (packStatus=planned):", abuDhabiEventId);

// Resolve Belgian GP / Italian GP event IDs (both already exist, packStatus=live)
const [belgianGp] = await sql`SELECT id FROM sporting_events WHERE slug = 'belgian-gp-2026'`;
const [italianGp] = await sql`SELECT id FROM sporting_events WHERE slug = 'italian-gp-2026'`;

// ─── 2. Hotel tier cost — keyed by destination (USD) ───────────────────────
// Matches the mock line items already shown in the UI, now as real rows.

const hotelRows = [
  // Belgian Ardennes
  { destId: BELGIAN_GP_DEST_ID, tier: "general", low: 150, high: 250 },
  { destId: BELGIAN_GP_DEST_ID, tier: "budget", low: 80, high: 130 },
  { destId: BELGIAN_GP_DEST_ID, tier: "moderate", low: 150, high: 250 },
  { destId: BELGIAN_GP_DEST_ID, tier: "splurge", low: 250, high: 400 },
  { destId: BELGIAN_GP_DEST_ID, tier: "luxury", low: 400, high: 700 },
  // Milan
  { destId: ITALIAN_GP_DEST_ID, tier: "general", low: 350, high: 500 },
  { destId: ITALIAN_GP_DEST_ID, tier: "budget", low: 150, high: 220 },
  { destId: ITALIAN_GP_DEST_ID, tier: "moderate", low: 350, high: 500 },
  { destId: ITALIAN_GP_DEST_ID, tier: "splurge", low: 500, high: 750 },
  { destId: ITALIAN_GP_DEST_ID, tier: "luxury", low: 750, high: 1200 },
  // Abu Dhabi
  { destId: abuDhabiDestId, tier: "general", low: 300, high: 450 },
  { destId: abuDhabiDestId, tier: "budget", low: 150, high: 220 },
  { destId: abuDhabiDestId, tier: "moderate", low: 300, high: 450 },
  { destId: abuDhabiDestId, tier: "splurge", low: 450, high: 700 },
  { destId: abuDhabiDestId, tier: "luxury", low: 700, high: 1100 },
];

for (const row of hotelRows) {
  await sql`
    INSERT INTO planner_hotel_tier_cost (destination_id, tier, cost_low, cost_high)
    VALUES (${row.destId}, ${row.tier}, ${row.low}, ${row.high})
    ON CONFLICT (destination_id, tier) DO UPDATE SET cost_low = ${row.low}, cost_high = ${row.high}, last_updated = now()
  `;
}
console.log(`✓ Seeded ${hotelRows.length} planner_hotel_tier_cost rows`);

// ─── 3. Ticket tier cost — keyed by event (USD) ────────────────────────────

const ticketRows = [
  // Belgian GP
  { eventId: belgianGp.id, tier: "general", low: 90, high: 180 },
  { eventId: belgianGp.id, tier: "general_admission", low: 90, high: 130 },
  { eventId: belgianGp.id, tier: "grandstand", low: 180, high: 280 },
  { eventId: belgianGp.id, tier: "premium_grandstand", low: 280, high: 450 },
  { eventId: belgianGp.id, tier: "hospitality", low: 900, high: 2500 },
  // Italian GP
  { eventId: italianGp.id, tier: "general", low: 220, high: 350 },
  { eventId: italianGp.id, tier: "general_admission", low: 120, high: 180 },
  { eventId: italianGp.id, tier: "grandstand", low: 220, high: 350 },
  { eventId: italianGp.id, tier: "premium_grandstand", low: 350, high: 550 },
  { eventId: italianGp.id, tier: "hospitality", low: 1200, high: 3000 },
  // Abu Dhabi GP
  { eventId: abuDhabiEventId, tier: "general", low: 250, high: 400 },
  { eventId: abuDhabiEventId, tier: "general_admission", low: 150, high: 220 },
  { eventId: abuDhabiEventId, tier: "grandstand", low: 250, high: 400 },
  { eventId: abuDhabiEventId, tier: "premium_grandstand", low: 400, high: 650 },
  { eventId: abuDhabiEventId, tier: "hospitality", low: 1500, high: 3500 },
];

for (const row of ticketRows) {
  await sql`
    INSERT INTO planner_ticket_tier_cost (sporting_event_id, tier, cost_low, cost_high)
    VALUES (${row.eventId}, ${row.tier}, ${row.low}, ${row.high})
    ON CONFLICT (sporting_event_id, tier) DO UPDATE SET cost_low = ${row.low}, cost_high = ${row.high}, last_updated = now()
  `;
}
console.log(`✓ Seeded ${ticketRows.length} planner_ticket_tier_cost rows`);

// ─── 4. Destination bands — local travel + food/day (USD) ──────────────────

const bandRows = [
  { destId: BELGIAN_GP_DEST_ID, localLow: 40, localHigh: 60, foodLow: 30, foodHigh: 40 },
  { destId: ITALIAN_GP_DEST_ID, localLow: 30, localHigh: 50, foodLow: 30, foodHigh: 40 },
  { destId: abuDhabiDestId, localLow: 40, localHigh: 60, foodLow: 27, foodHigh: 33 },
];

for (const row of bandRows) {
  await sql`
    INSERT INTO planner_destination_bands (destination_id, local_travel_low, local_travel_high, food_per_day_low, food_per_day_high)
    VALUES (${row.destId}, ${row.localLow}, ${row.localHigh}, ${row.foodLow}, ${row.foodHigh})
    ON CONFLICT (destination_id) DO UPDATE SET
      local_travel_low = ${row.localLow}, local_travel_high = ${row.localHigh},
      food_per_day_low = ${row.foodLow}, food_per_day_high = ${row.foodHigh}, last_updated = now()
  `;
}
console.log(`✓ Seeded ${bandRows.length} planner_destination_bands rows`);

// ─── 5. Flight route-season matrix — one placeholder origin market ─────────
// Real ~20-market list still undefined (deferred to detailed build per
// standing decision) — seeding a single "unspecified" origin row per
// destination/season so the UI has something real to query for now.

const flightRows = [
  { destId: BELGIAN_GP_DEST_ID, origin: "unspecified", band: "jul", low: 280, high: 420 },
  { destId: ITALIAN_GP_DEST_ID, origin: "unspecified", band: "sep", low: 320, high: 480 },
  { destId: abuDhabiDestId, origin: "unspecified", band: "dec", low: 450, high: 700 },
];

for (const row of flightRows) {
  await sql`
    INSERT INTO planner_flight_cost (destination_id, origin_market, seasonal_band, cost_low, cost_high)
    VALUES (${row.destId}, ${row.origin}, ${row.band}, ${row.low}, ${row.high})
    ON CONFLICT (destination_id, origin_market, seasonal_band) DO UPDATE SET
      cost_low = ${row.low}, cost_high = ${row.high}, last_updated = now()
  `;
}
console.log(`✓ Seeded ${flightRows.length} planner_flight_cost rows`);

console.log("\nDone. Real planner cost data now backs Belgian GP, Italian GP, and Abu Dhabi GP.");

await sql.end();

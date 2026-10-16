import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

// circuit_seating_profile seed for the Hungaroring (Hungarian GP 2027) —
// Ticket Intelligence app. Full inventory: 14 grandstands, 1 General
// Admission zone, 3 hospitality products (18 seats). Researched 16 Oct
// 2026, immediately after this event's evergreen-slug migration and
// 2026->2027 rollover (migrate-from-classic-to-hub-spoke skill).
//
// The Hungaroring underwent a full grandstand reconstruction/renaming
// ahead of the 2025 race (105 billion HUF project — rebuilt paddock, new
// main grandstand, renamed stands). The 14-turn circuit LAYOUT itself is
// unchanged since 2003 — only the grandstand infrastructure changed.
// Official corner names (announced 2025 for the circuit's 40th
// anniversary, F1.com/motorsport.com): Turn 1 Piquet, Turn 2 Hamilton,
// Turn 3 Spring, Turn 4 Mansell, Turn 5 Mogyoród, Turns 6-7 Driving Centre
// (the chicane), Turns 8-9 Buda and Pest, Turn 10 Danube, Turn 11 Alesi,
// Turn 12 Schumacher, Turn 13 Senna, Turn 14 Szisz.
//
// Stand list confirmed against the OFFICIAL Hungaroring circuit map
// (gpticketshop.hu — the official reseller — screenshots + map image
// supplied directly by founder, 16 Oct 2026, credit gpticketshop.hu),
// which overrides earlier secondary-site (oversteer48.com,
// gpdestinations.com) research that incorrectly listed a "Chicane 3",
// "Pit Exit 2", and "Grid 3" — none of these appear on the official map
// or official price list, and are excluded here (founder decision, 16 Oct
// 2026). "3 Corner" multi-zone tickets (3 Corner T1, 3 Corner Grid 2, 3
// Corner Fan) are a ticket-purchasing VARIANT of existing stands, not
// distinct seats — also excluded (founder decision, 16 Oct 2026).
//
// PRICING: gpticketshop.hu's real official 2026 Weekend (3-day) EUR prices
// per stand (converted to USD at 1.08 for tier placement only — see
// seed-hungarian-grand-prix-ticket-tier-cost.mjs; ordinal rank only, never
// displayed to the fan). Champions Club priced directly from
// f1experiences.com's real 2027 package page ($4,899 USD, screenshot
// supplied by founder). F1 Paddock Club has no official per-package price
// published; ordinal placement uses a real reseller range (~$6,670-11,935
// USD, 3-day, multiple 2026 resellers), clearly the most expensive product
// regardless of exact figure.
//
// COVER STATUS: confirmed by 3+ independent sources including F1's own
// official ticketing page — "the Hungaroring grandstand is the circuit's
// only covered grandstand." Every other grandstand (T1, Grid 1/2, Pit Exit
// 1, Grand Prix 1/2, Apex 1/2, Fan, Chicane 1/2/4) is confirmed UNCOVERED
// by oversteer48.com's per-stand reviews (consistent pattern, zero
// exceptions found across 12 separate stand pages). Only Hungaroring and
// Hungaroring Platinum (the two tiers of the single rebuilt main
// grandstand) are covered.
//
// RESERVED SEATING: every grandstand reviewed (oversteer48.com,
// gpdestinations.com, 12+ separate stand pages) describes numbered
// sector/row/seat charts with individual bucket/plastic seats — confirmed
// true for all 14 grandstands. General Admission is explicitly open
// hillside, no assigned seat (confirmed in our own published "General
// Admission & Fan Zone" experience copy). Hospitality products (F1 Fan
// Lounge, Champions Club, F1 Paddock Club) are named/assigned access by
// definition — reservedSeating true.
//
// SINGLE-DAY AVAILABILITY: gpticketshop.hu sells both Weekend (3-day) and
// Sunday-only single-day tickets for every grandstand/GA tier (confirmed
// directly in the official screenshots) — singleDayAvailable true for all
// 18 seats. (No longer scored in the quiz per ticket-intelligence-
// researcher skill §4, but still seeded as real per-seat data.)
//
// LINKED EXPERIENCES: matched against the 5 real, currently-published
// Hungarian GP experiences that cover specific seats: "Where to Sit — T1,
// Apex, or the Covered Grandstand" (T1, Apex 1, Apex 2, Hungaroring,
// Hungaroring Platinum), "The Chicane — Where Hungaroring Laps Quietly
// Fall Apart" (Chicane 1, Chicane 2, Chicane 4), "General Admission & Fan
// Zone" (General Admission), "F1 Fan Lounge — Comfort Without the Paddock
// Club Price" (F1 Fan Lounge), "Paddock Club — Above the Garages, Inside
// the Pit Lane" (F1 Paddock Club). Grid 1, Grid 2, Grand Prix 1, Grand
// Prix 2, Fan, Pit Exit 1, and Champions Club have no dedicated write-up
// yet — linkedExperienceId left null, falls back automatically to "Your
// Hungarian GP Ticket Guide" via getFallbackTicketExperienceSlug. This is
// the real coverage gap flagged for follow-up research (7 of 18 seats).

const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86"; // Hungarian GP 2027 (hungarian-grand-prix)

const tierRows = await sql`
  SELECT id, tier FROM planner_ticket_tier_cost WHERE sporting_event_id = ${EVENT_ID} AND edition_year = 2027
`;
const tierIdByKey = Object.fromEntries(tierRows.map((r) => [r.tier, r.id]));
for (const t of ["tier1", "tier2", "tier3", "tier4"]) {
  if (!tierIdByKey[t]) throw new Error(`Missing expected ${t} row for event ${EVENT_ID} — aborting.`);
}

// Real, published experience IDs (confirmed via DB query, 16 Oct 2026).
const EXP_WHERE_TO_SIT = "32aa24f0-c709-4c7a-b030-ed30b7810fd8";
const EXP_CHICANE = "fcf7dbbb-a170-40a2-b4c5-ac7dbf134fc4";
const EXP_GENERAL_ADMISSION = "1b2a72c8-cef1-4fef-bce7-bac7da5356f5";
const EXP_FAN_LOUNGE = "6199e022-81d0-4354-8a0f-0ab40fed63a2";
const EXP_PADDOCK_CLUB = "752d5d06-1e81-403b-8e57-4f77dd8b57e3";

const SOURCE_COVER = "Covered status: confirmed via F1's own official ticketing page (\"the Hungaroring grandstand is the circuit's only covered grandstand\") plus oversteer48.com's per-stand review (3+ independent sources).";
const SOURCE_RESERVED = "Reserved seating: confirmed via oversteer48.com's numbered sector/row/seat chart for this stand.";

const SEATS = [
  // ─── tier4 — hospitality + premium main-straight grandstands ───────────
  {
    seatName: "F1 Paddock Club",
    seatType: "hospitality",
    zoneLabel: "Main straight, above the team garages, overlooking pit lane and the start-finish straight between Turn 14 (Szisz) and Turn 1 (Piquet)",
    actionTags: ["pit_lane", "start_grid", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "Real reseller price range ~$6,670-11,935 USD (3-day, multiple 2026 resellers — Engage Hospitality, Edge Global Events, Race Experiences; no official F1-published per-package price found) — clearly the most expensive product at this event regardless of exact figure, placed in tier4 as the correct ordinal bucket. F1's own official hospitality product (not third-party), includes Aramco F1 Pit Lane Walk, guided paddock tour, driver/ambassador appearances. Sources: engagehospitality.co.uk/the-definitive-guide-to-f1-paddock-club-hospitality-worldwide, our own published \"Paddock Club\" experience (16 Oct 2026).",
    ticketTierId: tierIdByKey.tier4,
    linkedExperienceId: EXP_PADDOCK_CLUB,
  },
  {
    seatName: "Champions Club",
    seatType: "hospitality",
    zoneLabel: "Main straight hospitality, overlooking the start-finish straight between Turn 14 (Szisz) and Turn 1 (Piquet)",
    actionTags: ["pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "Real official price $4,899 USD (3-day), f1experiences.com's own 2027 Hungarian GP package page, screenshot supplied directly by founder 16 Oct 2026. Includes Grid Walk with Championship Trophy photo op, guided paddock tour, covered hospitality seating with TV screen. Below F1 Paddock Club in price/prestige.",
    ticketTierId: tierIdByKey.tier4,
    linkedExperienceId: null,
  },
  {
    seatName: "F1 Fan Lounge",
    seatType: "hospitality",
    zoneLabel: "Main straight, Gate 7, between the Hungaroring and Hungaroring Platinum grandstands",
    actionTags: ["start_grid", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "Real official price €1,950 Weekend (3-day) = $2,106 USD at 1.08 EUR/USD, gpticketshop.hu VIP Tickets section (official reseller, screenshot supplied by founder 16 Oct 2026). Air-conditioned lounge, buffet, open bar, plus a reserved covered seat in the Hungaroring grandstand — confirmed in our own published \"F1 Fan Lounge\" experience.",
    ticketTierId: tierIdByKey.tier4,
    linkedExperienceId: EXP_FAN_LOUNGE,
  },
  {
    seatName: "Hungaroring Platinum",
    seatType: "grandstand",
    zoneLabel: "Main straight, upper deck, Gate 7, facing the podium and start-finish line between Turn 14 (Szisz) and Turn 1 (Piquet)",
    actionTags: ["start_grid", "podium_atmosphere", "pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      `Real official price €740 Weekend (3-day) = $799 USD, gpticketshop.hu (official reseller, screenshot supplied by founder 16 Oct 2026). Upper deck of the rebuilt main grandstand, Sectors A-P, 5 rows. Best views and most exclusive tier at the circuit, per gpdestinations.com's grandstand review (16 Oct 2026). ${SOURCE_COVER} ${SOURCE_RESERVED}`,
    ticketTierId: tierIdByKey.tier4,
    linkedExperienceId: EXP_WHERE_TO_SIT,
  },
  {
    seatName: "Hungaroring",
    seatType: "grandstand",
    zoneLabel: "Main straight, lower deck, Gate 7, facing the podium and start-finish line between Turn 14 (Szisz) and Turn 1 (Piquet)",
    actionTags: ["start_grid", "podium_atmosphere", "pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      `Real official price €650 Weekend (3-day) = $702 USD, gpticketshop.hu (official reseller, screenshot supplied by founder 16 Oct 2026). Lower deck of the rebuilt main grandstand, Sectors A-S, 17 rows. The circuit's only fully covered grandstand (upper Platinum deck guaranteed full protection; lower deck front rows can still get wet — gpdestinations.com). Some Sector A seats reserved for Paddock Club overflow. ${SOURCE_COVER} ${SOURCE_RESERVED}`,
    ticketTierId: tierIdByKey.tier4,
    linkedExperienceId: EXP_WHERE_TO_SIT,
  },

  // ─── tier3 ───────────────────────────────────────────────────────────
  {
    seatName: "T1",
    seatType: "grandstand",
    zoneLabel: "Turn 1 (Piquet), outside the circuit, Gate 8 — the tight right-hander at the end of the pit straight",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      `Real official price €500 Weekend (3-day) = $540 USD, gpticketshop.hu (official reseller, screenshot supplied by founder 16 Oct 2026). Site of Nelson Piquet's famous outside pass on Ayrton Senna, lap 68 of the inaugural 1986 race — now the official name of this corner (Piquet, per F1's 2025 corner-naming announcement). The circuit's one reliably reliable overtaking zone, confirmed in our own published \"Where to Sit\" experience. ${SOURCE_COVER} ${SOURCE_RESERVED}`,
    ticketTierId: tierIdByKey.tier3,
    linkedExperienceId: EXP_WHERE_TO_SIT,
  },
  {
    seatName: "Grid 1",
    seatType: "grandstand",
    zoneLabel: "Start/finish straight, Gate 7, sectors span from near Turn 1 (Piquet) to near Turn 14 (Szisz)",
    actionTags: ["start_grid"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      `Real official price €430 Weekend (3-day) = $464 USD, gpticketshop.hu (official reseller, screenshot supplied by founder 16 Oct 2026). Formed from the pre-2025 Gold 2 and Silver 2 stands, merged and renamed during the circuit's reconstruction (oversteer48.com). Close view of the starting grid; the new main grandstand partially blocks the view toward Turn 1. ${SOURCE_COVER} ${SOURCE_RESERVED}`,
    ticketTierId: tierIdByKey.tier3,
    linkedExperienceId: null,
  },
  {
    seatName: "Grid 2",
    seatType: "grandstand",
    zoneLabel: "Start/finish straight, Gate 7, below Grid 1, closer to Turn 14 (Szisz)",
    actionTags: ["start_grid"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      `Real official price €430 Weekend (3-day) = $464 USD, gpticketshop.hu (official reseller, screenshot supplied by founder 16 Oct 2026). Formerly Silver 1, renamed for the 2025 season (oversteer48.com). View of the grid and, once racing starts, of Turn 14 from Sector C; Turn 12 (Schumacher) visible only from higher rows in Sector A. ${SOURCE_COVER} ${SOURCE_RESERVED}`,
    ticketTierId: tierIdByKey.tier3,
    linkedExperienceId: null,
  },
  {
    seatName: "Pit Exit 1",
    seatType: "grandstand",
    zoneLabel: "Outside the circuit, Gate 8, between the pit lane exit and Turn 1 (Piquet) braking zone",
    actionTags: ["pit_lane", "overtaking"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      `Real official price €430 Weekend (3-day) = $464 USD, gpticketshop.hu (official reseller, screenshot supplied by founder 16 Oct 2026). Roughly equidistant between the pit exit and Turn 1; Sectors A-B have the best Turn 1 view, Sectors E-F the best pit-exit/start-finish-straight view (gpdestinations.com). ${SOURCE_COVER} ${SOURCE_RESERVED}`,
    ticketTierId: tierIdByKey.tier3,
    linkedExperienceId: null,
  },

  // ─── tier2 ───────────────────────────────────────────────────────────
  {
    seatName: "Grand Prix 2",
    seatType: "grandstand",
    zoneLabel: "Turn 14 (Szisz) exit, outside the circuit, between Gate 7 and Gate 6",
    actionTags: ["technical_corner", "overtaking"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      `Real official price €350 Weekend (3-day) = $378 USD, gpticketshop.hu (official reseller, screenshot supplied by founder 16 Oct 2026). Sits directly beside Grid 2, separated by a fence (oversteer48.com). ${SOURCE_COVER} ${SOURCE_RESERVED}`,
    ticketTierId: tierIdByKey.tier2,
    linkedExperienceId: null,
  },
  {
    seatName: "Apex 2",
    seatType: "grandstand",
    zoneLabel: "Turn 14 (Szisz), natural hill overlooking the final corner, Gate 6",
    actionTags: ["technical_corner", "high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      `Real official price €340 Weekend (3-day) = $367 USD, gpticketshop.hu (official reseller, screenshot supplied by founder 16 Oct 2026). More rows but less elevation than Apex 1; seats above row 16 clear the catch fencing for a near-eye-level view of Turn 14 (gpdestinations.com). Confirmed in our own published \"Where to Sit\" experience. ${SOURCE_COVER} ${SOURCE_RESERVED}`,
    ticketTierId: tierIdByKey.tier2,
    linkedExperienceId: EXP_WHERE_TO_SIT,
  },

  // ─── tier1 — cheapest grandstands + General Admission ──────────────────
  {
    seatName: "Grand Prix 1",
    seatType: "grandstand",
    zoneLabel: "Turn 14 (Szisz) exit, outside the circuit, Gate 6",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      `Real official price €300 Weekend (3-day) = $324 USD, gpticketshop.hu (official reseller, screenshot supplied by founder 16 Oct 2026). Formerly the Red Bull grandstand/tribune (oversteer48.com). Curves around Turn 14; Sectors J-M, row 20+ give the best corner view, Sectors A-B the best starting-grid view. ${SOURCE_COVER} ${SOURCE_RESERVED}`,
    ticketTierId: tierIdByKey.tier1,
    linkedExperienceId: null,
  },
  {
    seatName: "Apex 1",
    seatType: "grandstand",
    zoneLabel: "Turn 14 (Szisz), natural hill overlooking the final corner, Gate 6",
    actionTags: ["technical_corner", "high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      `Real official price €300 Weekend (3-day) = $324 USD, gpticketshop.hu (official reseller, screenshot supplied by founder 16 Oct 2026). Formerly Silver 3 (oversteer48.com). Sectors A-B and C-D rated best — final-turn, pit-entry, and start-finish-straight views, plus distant sight of Turns 11-12. Confirmed in our own published \"Where to Sit\" experience. ${SOURCE_COVER} ${SOURCE_RESERVED}`,
    ticketTierId: tierIdByKey.tier1,
    linkedExperienceId: EXP_WHERE_TO_SIT,
  },
  {
    seatName: "Fan",
    seatType: "grandstand",
    zoneLabel: "Turn 11 (Alesi) exit to Turn 12 (Schumacher), Gate 5",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      `Real official price €270 Weekend (3-day) = $292 USD, gpticketshop.hu (official reseller, screenshot supplied by founder 16 Oct 2026). Formerly Silver 5 (oversteer48.com). View covers Turn 11 exit, the short straight to Turn 12, and the run beyond — doesn't quite reach Turn 13 (Senna). ${SOURCE_COVER} ${SOURCE_RESERVED}`,
    ticketTierId: tierIdByKey.tier1,
    linkedExperienceId: null,
  },
  {
    seatName: "Chicane 1",
    seatType: "grandstand",
    zoneLabel: "Turns 6-7 (Driving Centre chicane), Gate 2, middle of the 3-stand cluster",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      `Real official price €240 Weekend (3-day) = $259 USD, gpticketshop.hu (official reseller, screenshot supplied by founder 16 Oct 2026). Formerly Bronze 3 (oversteer48.com). Sees Turn 5 (Mogyoród) exit and Turns 6-7 entry; Chicane 2 sits adjacent, partially blocking the view toward Turn 4 (Mansell) from lower rows. Confirmed in our own published \"The Chicane\" experience. ${SOURCE_COVER} ${SOURCE_RESERVED}`,
    ticketTierId: tierIdByKey.tier1,
    linkedExperienceId: EXP_CHICANE,
  },
  {
    seatName: "Chicane 2",
    seatType: "grandstand",
    zoneLabel: "Turns 6-7 (Driving Centre chicane), Gate 2, northernmost of the 3-stand cluster, closest to Turn 5 (Mogyoród)",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      `Real official price €240 Weekend (3-day) = $259 USD, gpticketshop.hu (official reseller, screenshot supplied by founder 16 Oct 2026). Formerly \"Super Bronze\" (oversteer48.com). Highest of the three Chicane stands — wide view across Turns 5-8, though standing spectators in front can block sightlines. Confirmed in our own published \"The Chicane\" experience. ${SOURCE_COVER} ${SOURCE_RESERVED}`,
    ticketTierId: tierIdByKey.tier1,
    linkedExperienceId: EXP_CHICANE,
  },
  {
    seatName: "Chicane 4",
    seatType: "grandstand",
    zoneLabel: "Turns 6-7 (Driving Centre chicane), Gate 2, southernmost of the 3-stand cluster, closest to Turn 8 (Buda)",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      `Real official price €240 Weekend (3-day) = $259 USD, gpticketshop.hu (official reseller, screenshot supplied by founder 16 Oct 2026). Part of the Turns 6-7 chicane grandstand cluster alongside Chicane 1 and Chicane 2, confirmed on the official Hungaroring circuit map (gpticketshop.hu). Uncovered, individual seat-back seating, large TV screens opposite the stands (grandprixevents.com). ${SOURCE_COVER} ${SOURCE_RESERVED}`,
    ticketTierId: tierIdByKey.tier1,
    linkedExperienceId: EXP_CHICANE,
  },
  {
    seatName: "General Admission",
    seatType: "festival_lawn",
    zoneLabel: "Open hillside, Gates 3/4/5, outer loop spanning roughly Turn 8 (Buda) through Turn 13 (Senna)",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: false,
    sourceNote:
      "Real official price €170 Weekend (3-day) = $184 USD, gpticketshop.hu (official reseller, screenshot supplied by founder 16 Oct 2026). Open meadow/hillside, no assigned seat — confirmed directly in our own published \"General Admission & Fan Zone\" experience. The Hungaroring's natural bowl terrain gives genuine elevated sightlines across multiple corners without a fixed grandstand seat, a real differentiator from flatter F1 circuits.",
    ticketTierId: tierIdByKey.tier1,
    linkedExperienceId: EXP_GENERAL_ADMISSION,
  },
];

for (const s of SEATS) {
  const result = await sql`
    INSERT INTO circuit_seating_profile
      (sporting_event_id, ticket_tier_cost_id, seat_name, seat_type, zone_label, action_tags, covered, min_age, single_day_available, reserved_seating, source_note, linked_experience_id)
    VALUES
      (${EVENT_ID}, ${s.ticketTierId}, ${s.seatName}, ${s.seatType}, ${s.zoneLabel}, ${s.actionTags}, ${s.covered}, ${s.minAge}, ${s.singleDayAvailable}, ${s.reservedSeating}, ${s.sourceNote}, ${s.linkedExperienceId})
    ON CONFLICT (sporting_event_id, seat_name) DO UPDATE SET
      ticket_tier_cost_id = EXCLUDED.ticket_tier_cost_id,
      seat_type = EXCLUDED.seat_type,
      zone_label = EXCLUDED.zone_label,
      action_tags = EXCLUDED.action_tags,
      covered = EXCLUDED.covered,
      min_age = EXCLUDED.min_age,
      single_day_available = EXCLUDED.single_day_available,
      reserved_seating = EXCLUDED.reserved_seating,
      source_note = EXCLUDED.source_note,
      linked_experience_id = EXCLUDED.linked_experience_id,
      last_verified_date = NOW()
    RETURNING seat_name
  `;
  console.log(`✓ ${result[0].seat_name} seeded`);
}

const rows = await sql`
  SELECT seat_name, seat_type, covered, reserved_seating, linked_experience_id, ticket_tier_cost_id
  FROM circuit_seating_profile
  WHERE sporting_event_id = ${EVENT_ID}
  ORDER BY seat_type, seat_name
`;
console.log("\nConfirmed state:");
console.table(rows);
console.log(`\nTotal seats: ${rows.length}`);
console.log(`Seats with linkedExperienceId: ${rows.filter((r) => r.linked_experience_id).length}`);
console.log(`Seats WITHOUT linkedExperienceId (fall back to Ticket Guide): ${rows.filter((r) => !r.linked_experience_id).length}`);

await sql.end();

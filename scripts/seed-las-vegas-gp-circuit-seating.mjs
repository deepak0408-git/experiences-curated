import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

// Note: DIRECT_URL times out from this machine (see feedback_db_migration.md)
// — use DATABASE_URL (transaction pooler, port 6543) instead.
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

// circuit_seating_profile seed for the Las Vegas Strip Circuit (Las Vegas GP
// 2026) — built for the Ticket Intelligence app ($10 standalone "which seat
// fits you" tool). Researched 27 Sep 2026.
//
// FULL INVENTORY FOUND (per skill §1 — the existing planner_ticket_tier_cost
// 4-tier table and the 6 pre-existing published experiences covered only
// 7 of the real ~22 products at this circuit): 5 assigned-seat grandstands,
// 3 general admission zones, and a genuinely deep 9-product hospitality
// lineup (this circuit's hospitality structure is unusually wide compared
// to Brazilian/Mexico City/US GP — grandstand-attached clubs like Turn 3
// Club and SkyBox sit alongside independent Strip-hotel venues like Club
// Paris and HGV Clubhouse, on top of F1's own global Paddock Club/House 44/
// Legend line).
//
// EXCLUDED BY FOUNDER DECISION (27 Sep 2026), not for sourcing reasons —
// all four are genuine, officially confirmed products, dropped from scope
// rather than flagged as unsourced:
// - Bellagio Fountain Club (own f1lasvegasgp.com page, $8,400 3-day, real)
// - Wynn Grid Club (own f1lasvegasgp.com page, $25,997 3-day, real)
// - TGR Haas F1 Team Club Suite (f1experiences.com Paddock Club variant)
// - BWT Alpine Formula One Team Suite (f1experiences.com Paddock Club variant)
//
// Deliberately organized by SEAT (grandstand/festival_lawn/hospitality),
// not by planner_ticket_tier_cost's tier1-4 pricing rows — see that table's
// own comment on why tier is a separate, price-sortable axis.
//
// PRICING SOURCING NOTE:
// - HIGH confidence: existence + 3-day price independently corroborated by
//   2+ sources (official f1lasvegasgp.com/lasvegas.gp pages, SI.com's
//   ticket-options exclusive, GPDestinations.com's cost breakdown, and/or
//   our own already-published, curator-reviewed experience copy).
// - LOWER confidence: existence confirmed officially, but a specific field
//   (covered/reserved/single-day) is either unconfirmed or sources
//   conflict — left NULL rather than guessed, noted per seat below.
//
// KNOWN GAPS, left honest rather than guessed:
// - Heineken Silver Main Grandstand: `covered` left NULL. Our own published
//   experience describes a raised/elevated seat but never states covered
//   vs. open-air; oversteer48/fanamp did not independently confirm either
//   way for this specific stand — genuinely unconfirmed, not assumed true
//   like a typical premium grandstand would be.
// - T-Mobile Grandstands (GSG1-8, sold as one ticketed product): `covered`
//   left NULL — fanamp says covered, oversteer48 says uncovered, directly
//   conflicting with no tiebreaking third source found. Flagging rather
//   than picking a side.
// - Hello Kitty Grandstand (TG3/TG4): single-sourced on 3-day pricing
//   ($1,450, F1 Academy/Sanrio partner announcement + oversteer48 corroborates
//   existence/location only) — LOWER confidence throughout, singleDayAvailable
//   left NULL (not stated anywhere found).
// - Heineken GA+, HGV Clubhouse, Trackside Tavern at Paddock Club Rooftop,
//   Gordon Ramsay at F1 Garage: singleDayAvailable left NULL — 3-day pricing
//   well corroborated, but no source confirmed or denied a single-day product
//   for these four specifically (unlike Turn 3 Club/SkyBox/Club Paris/Paddock
//   Club family, which do have confirmed single-day options).
//
// PRESTIGE_SEAT_NAMES / STAR_OVERRIDE_BY_SEAT_NAME name-collision check
// (skill §6): this event seeds seats named "Paddock Club" and "House 44 at
// F1 Paddock Club", both of which already exist in the GLOBAL (not
// per-event) prestige maps in scoreSeats.ts / FullResult.tsx from an
// earlier event. Flagged to founder 27 Sep 2026 — decision: accept the
// inherited 5-star/tiebreaker treatment as-is, since it's directionally
// correct for Las Vegas too (Paddock Club genuinely is this circuit's
// top F1-Experiences-branded tier). No map changes made in this build.
//
// linkedExperienceId set for the 6 seats with a real, dedicated,
// curator-reviewed write-up already published in `experiences` (queried
// 27 Sep 2026, sportingEventId = Las Vegas GP 2026). The remaining seats
// are left null — they fall back automatically to the event's general
// Ticket Guide experience via getFallbackTicketExperienceSlug.

const EVENT_ID = "cd5785a7-d37c-4d4b-a545-a8b8e28eac57"; // Las Vegas Grand Prix 2026

const EXP = {
  mainGrandstand: "ff43697f-0b26-4e54-adab-e77ecc1b4346", // Heineken Silver Main Grandstand — the start/finish seat
  turn3: "1f2f1569-a072-423b-8569-d4a4253cd9d9", // Turn 3 Grandstand — the Koval Straight's real DRS view
  westHarmon: "e8657ae2-43b5-401d-a937-1c05f2fed395", // West Harmon Grandstand — the real budget assigned seat
  flamingoGA: "4f6eeec9-f3eb-44da-8166-74443be81316", // Flamingo Zone GA — the cheapest way into race weekend
  tmobileGA: "00fdb184-c5dd-44ea-bb1d-2fe32c4ba833", // T-Mobile Zone at Sphere — race weekend's real festival
  paddockClub: "fbf4cc53-e27f-438a-aaf4-cc8fbfcb7897", // F1 Paddock Club — Las Vegas's top hospitality tier
};

// tier1-4 planner_ticket_tier_cost row IDs for this event, looked up by tier.
const tierRows = await sql`
  SELECT id, tier FROM planner_ticket_tier_cost WHERE sporting_event_id = ${EVENT_ID}
`;
const tierIdByKey = Object.fromEntries(tierRows.map((r) => [r.tier, r.id]));
for (const t of ["tier1", "tier2", "tier3", "tier4"]) {
  if (!tierIdByKey[t]) throw new Error(`Missing expected ${t} row for event ${EVENT_ID} — aborting.`);
}

const SEATS = [
  // ─── tier1 ($807 seeded) ─────────────────────────────────────────────
  {
    seatName: "Flamingo Zone GA",
    seatType: "festival_lawn",
    zoneLabel: "Koval Straight toward Turn 5G braking zone",
    actionTags: ["overtaking", "high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: false,
    linkedExperienceId: EXP.flamingoGA,
    sourceNote:
      "HIGH confidence — matches existing tier1 seeded range directly, our own published experience. Standing-room, first-come-first-served viewing platforms, single-zone-locked (no wandering into other zones). Single-day tickets confirmed (Thu $50 / Fri $99 / Sat $393, per own experience copy + GPDestinations.com cost breakdown). Sources: our own published experience (las-vegas-gp-flamingo-ga), f1lasvegasgp.com official page, gpdestinations.com/cost-of-trip-to-las-vegas-grand-prix (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier1,
  },
  // ─── tier2 ($1,047-1,499 seeded) ─────────────────────────────────────
  {
    seatName: "Turn 3 Grandstand",
    seatType: "grandstand",
    zoneLabel: "Koval Zone, Koval Straight into Turn 5G braking zone (Turns 3-5)",
    actionTags: ["overtaking", "high_speed", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: EXP.turn3,
    sourceNote:
      "HIGH confidence — matches existing tier2 seeded range directly, our own published experience. Reserved/assigned seating, covered per fanamp.com corroboration. DRS detection ~20m past Turn 4, real passing zone at Turn 5G. Connects to Heineken Silver Stage. Sources: our own published experience (las-vegas-gp-turn3-grandstand), fanamp.com/tr/where-to-sit-las-vegas-grand-prix (covered/reserved), gpdestinations.com (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "West Harmon Grandstand",
    seatType: "grandstand",
    zoneLabel: "West Harmon Zone, run into Turn 17 and pit lane entrance",
    actionTags: ["high_speed", "pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: EXP.westHarmon,
    sourceNote:
      "HIGH confidence — matches existing tier2 seeded range directly, our own published experience. Officially sold as the Lewis Hamilton Grandstand Package. Reserved/assigned, covered per fanamp.com. Top-speed straight into final corner, single-grandstand zone (shorter lines). Sources: our own published experience (las-vegas-gp-west-harmon-grandstand), fanamp.com (covered/reserved), grandprixgrandtours.com/las-vegas-circuit-guide (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "T-Mobile Grandstands",
    seatType: "grandstand",
    zoneLabel: "T-Mobile/Sphere Zone, Turns 5-9 chicane (sold as GSG1-8 sub-sectors, one ticketed product)",
    actionTags: ["technical_corner", "overtaking"],
    covered: null,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence on existence/price/reserved status (3-day from $1,445, single-day from $145 — GPDestinations.com, oversteer48.com). `covered` left NULL — fanamp.com states covered, oversteer48.com states uncovered for the same zone, directly conflicting with no third source resolving it. Distinct from T-Mobile Zone GA (standing, no assigned seat) — this is the assigned-seat grandstand product within the same zone. Sources: gpdestinations.com/tickets-f1-las-vegas-grand-prix, oversteer48.com/las-vegas-f1-grandstands, fanamp.com/tr/where-to-sit-las-vegas-grand-prix (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "T-Mobile Zone GA",
    seatType: "festival_lawn",
    zoneLabel: "Sphere Zone, beneath the Exosphere, Turns 5-9 chicane",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: false,
    linkedExperienceId: EXP.tmobileGA,
    sourceNote:
      "HIGH confidence — matches existing tier2 seeded range directly, our own published experience. Standing-room GA, single-zone-locked, includes food/drink for 3-day holders. Live concert stage each night of race weekend. Sources: our own published experience (las-vegas-gp-tmobile-sphere), f1lasvegasgp.com official page (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Hello Kitty Grandstand",
    seatType: "grandstand",
    zoneLabel: "East Harmon Zone, Turns 3-4, near Virgin Hotels Las Vegas",
    actionTags: ["technical_corner"],
    covered: null,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "LOWER confidence — 3-day price ($1,450, includes 2 exclusive F1 Academy x Hello Kitty merchandise items) confirmed via the F1 Academy/Sanrio partnership announcement (profootballnetwork.com) and corroborated on existence/location by oversteer48.com, but no second source independently confirmed the exact price or covered/single-day status — placed in tier2 as the closest existing band to $1,450. F1 Academy-themed package, East Harmon Zone alongside Main Grandstand and Heineken Grandstands, close-up view through Turns 3-4. Sources: profootballnetwork.com/nascar/las-vegas-gp-premium-as-f1-academy-hello-kitty-launch-1450-fans, oversteer48.com/las-vegas-f1-grandstands (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Heineken GA+",
    seatType: "festival_lawn",
    zoneLabel: "South Koval Zone, Koval Straight DRS zone",
    actionTags: ["overtaking", "high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: false,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence on existence/price ($1,350+ 3-day, corp.formula1.com official announcement) — unassigned bleacher-style standing, first-come-first-served, complimentary pub fare/soft drinks/water for 3-day holders. Distinct product from both Flamingo Zone GA and the reserved Heineken/T-Mobile Grandstands. `singleDayAvailable` left NULL — no source confirmed or denied a single-day option specifically for this product. Sources: corp.formula1.com/formula-1-heineken-silver-las-vegas-grand-prix-announces-new-heineken-ga-ticket-for-november-2024-race, news3lv.com (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  // ─── tier3 ($1,499-2,076 seeded) ─────────────────────────────────────
  {
    seatName: "Heineken Silver Main Grandstand",
    seatType: "grandstand",
    zoneLabel: "East Harmon Zone, dead level with start/finish line, overlooking pit lane",
    actionTags: ["start_grid", "pit_lane", "podium_atmosphere"],
    covered: null,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: EXP.mainGrandstand,
    sourceNote:
      "HIGH confidence — matches existing tier3 seeded range directly, our own published experience. Blocks PG1-103 through PG1-116, start line lines up with 114/116. Raised/elevated seating (front row clears the wall) per own experience copy, but `covered` genuinely left NULL — no source (own copy, oversteer48, fanamp) explicitly confirms covered vs. open-air for this specific stand. Known sightline trap: blocks 103/115 rows 32-40 sit in Skybox structure's shadow. Historically the first stand to sell out. Sources: our own published experience (las-vegas-gp-main-grandstand), gpdestinations.com (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  // ─── tier4 ($5,489-21,268 seeded) ─────────────────────────────────────
  {
    seatName: "Turn 3 Club",
    seatType: "hospitality",
    zoneLabel: "Koval Zone, between Turns 3-4, indoor suite + outdoor terrace",
    actionTags: ["overtaking", "high_speed"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — F1-themed indoor suite with expansive outdoor terrace, single-day from $824 including taxes/fees (official, per SI.com exclusive), 3-day from $5,489 (GPDestinations.com, matches tier4 floor). Sources: si.com/onsi/f1/las-vegas-grand-prix-2026-unveils-ticket-options-for-every-type-of-f1-fan-exclusive, gpdestinations.com/cost-of-trip-to-las-vegas-grand-prix, f1lasvegasgp.com/tickets/hospitality/ (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "SkyBox",
    seatType: "hospitality",
    zoneLabel: "East Harmon Zone, above the Heineken Silver Main Grandstand",
    actionTags: ["start_grid", "pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — puts guests above the start/finish line with all-inclusive food and beverage, roaming entertainment, pit lane views, plus a reserved seat in the Main Grandstand itself. Single-day from $1,257 including taxes/fees (SI.com exclusive), 3-day pricing corroborated in the $7,750-8,377 range across two aggregator sources (GPDestinations.com, SI.com). Sources: si.com/onsi/f1/las-vegas-grand-prix-2026-unveils-ticket-options-for-every-type-of-f1-fan-exclusive, gpdestinations.com, f1lasvegasgp.com/tickets/hospitality/skybox/ (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Club Paris",
    seatType: "hospitality",
    zoneLabel: "Paris Las Vegas hotel (Alexxa's, Beer Park, Chéri Rooftop) — West Harmon-adjacent",
    actionTags: ["podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — least expensive of the 5 official single-day hospitality venues, race-night single-day $1,780 (creators.yahoo.com), 3-day from $2,542 (GPDestinations.com, SI.com). Trackside terrace, rooftop lounge, all-inclusive food and drinks, live entertainment. Sources: creators.yahoo.com/lifestyle/story/las-vegas-f1-hospitality-can-cost-18198-caesars-has-a-650-race-night-option, gpdestinations.com, f1lasvegasgp.com/tickets/hospitality/club-paris/ (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "HGV Clubhouse",
    seatType: "hospitality",
    zoneLabel: "West Harmon Zone, Elara by Hilton Grand Vacations, Harmon Straightaway/final turn",
    actionTags: ["high_speed"],
    covered: true,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence on existence/price/location — multi-story hospitality space, 450+ feet of viewing along the Harmon Straightaway and final turn, 3-day from $3,728 (GPDestinations.com, SI.com). `singleDayAvailable` left NULL — no source confirmed a single-day option for this specific venue. Sources: corporate.hgv.com/news/news-details/2025 (Hilton Grand Vacations official announcement), gpdestinations.com, f1lasvegasgp.com/tickets/hospitality/hgv-clubhouse/ (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Trackside Tavern at Paddock Club Rooftop",
    seatType: "hospitality",
    zoneLabel: "Grand Prix Plaza, Paddock Club rooftop, 360-degree start/finish view",
    actionTags: ["pit_lane", "start_grid", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence on existence/price/location — luxury sports-bar-style rooftop above the Paddock Club, watches pit lane below with 360-degree views of start/finish, 3-day from $10,902 (GPDestinations.com, SI.com). `singleDayAvailable` left NULL — not confirmed either way in sources found. Sources: f1lasvegasgp.com official announcement (via WebSearch summary of f1lasvegasgp.com/2026/05 ticket-secrets post), gpdestinations.com (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Gordon Ramsay at F1 Garage",
    seatType: "hospitality",
    zoneLabel: "Grand Prix Plaza, real F1 garage between the paddock and pit lane",
    actionTags: ["pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence on existence/price/location — a real F1 team garage transformed into a Gordon Ramsay-branded culinary hospitality experience, positioned directly between paddock and pit lane, 3-day from $28,885 (GPDestinations.com, SI.com) — the single highest sourced price at this circuit. `singleDayAvailable` left NULL. Sources: robbreport.com/food-drink/dining/gordon-ramsay-trackside-restaurant-f1-las-vegas-grand-prix, gpdestinations.com, f1lasvegasgp.com/tickets/hospitality/ramsays-garage/ (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Paddock Club",
    seatType: "hospitality",
    zoneLabel: "Grand Prix Plaza, covered outdoor balcony above the F1 Team Garages",
    actionTags: ["pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: EXP.paddockClub,
    sourceNote:
      "HIGH confidence — matches existing tier4 seeded floor directly, our own published experience. F1 Experiences Suite tier, open bar, guided paddock tour. Own official page confirms covered/reserved. Name-collision note (skill §6): shares its name with an earlier event's global PRESTIGE_SEAT_NAMES entry — founder decision 27 Sep 2026 was to accept the inherited 5-star tiebreaker treatment as directionally correct here too, no map changes made. Sources: our own published experience (las-vegas-gp-paddock-club), f1experiences.com/2026-las-vegas-grand-prix (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "House 44 at F1 Paddock Club",
    seatType: "hospitality",
    zoneLabel: "Grand Prix Plaza, same location as Paddock Club — Lewis Hamilton-branded tier",
    actionTags: ["pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: EXP.paddockClub,
    sourceNote:
      "HIGH confidence — matches existing tier4 seeded range, our own published experience (which covers both Paddock Club and House 44 together). Lewis Hamilton-branded hospitality collaboration, same physical location/access as standard Paddock Club with more curated branding layered on top. Same name-collision note as Paddock Club above — inherited 5-star treatment accepted, no map changes. Sources: our own published experience (las-vegas-gp-paddock-club), f1experiences.com/2026-las-vegas-grand-prix/house-44-at-f1-paddock-club (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Legend",
    seatType: "hospitality",
    zoneLabel: "Grand Prix Plaza, same location as Paddock Club — full-day paddock pass upgrade",
    actionTags: ["pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: EXP.paddockClub,
    sourceNote:
      "HIGH confidence — matches existing tier4 seeded ceiling ($21,268), our own published experience covers this tier within the Paddock Club family. Top F1 Experiences Suite upgrade over standard Paddock Club, adds a single full-day F1 Paddock Pass on top of the standard inclusions. Genuinely Las Vegas's real top price point within this event's tier4 band — considered for its own PRESTIGE_SEAT_NAMES entry (skill §6) but founder decision 27 Sep 2026 was to leave the global maps untouched for this build. Sources: our own published experience (las-vegas-gp-paddock-club), f1experiences.com/2026-las-vegas-grand-prix (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
];

for (const s of SEATS) {
  const result = await sql`
    INSERT INTO circuit_seating_profile
      (sporting_event_id, ticket_tier_cost_id, seat_name, seat_type, zone_label, action_tags, covered, min_age, single_day_available, reserved_seating, linked_experience_id, source_note)
    VALUES
      (${EVENT_ID}, ${s.ticketTierId}, ${s.seatName}, ${s.seatType}, ${s.zoneLabel}, ${s.actionTags}, ${s.covered}, ${s.minAge}, ${s.singleDayAvailable}, ${s.reservedSeating}, ${s.linkedExperienceId ?? null}, ${s.sourceNote})
    ON CONFLICT (sporting_event_id, seat_name) DO UPDATE SET
      ticket_tier_cost_id = EXCLUDED.ticket_tier_cost_id,
      seat_type = EXCLUDED.seat_type,
      zone_label = EXCLUDED.zone_label,
      action_tags = EXCLUDED.action_tags,
      covered = EXCLUDED.covered,
      min_age = EXCLUDED.min_age,
      single_day_available = EXCLUDED.single_day_available,
      reserved_seating = EXCLUDED.reserved_seating,
      linked_experience_id = EXCLUDED.linked_experience_id,
      source_note = EXCLUDED.source_note,
      last_verified_date = NOW()
    RETURNING seat_name
  `;
  console.log(`✓ ${result[0].seat_name} seeded`);
}

const rows = await sql`
  SELECT seat_name, seat_type, covered, reserved_seating, single_day_available, linked_experience_id, ticket_tier_cost_id
  FROM circuit_seating_profile
  WHERE sporting_event_id = ${EVENT_ID}
  ORDER BY seat_type, seat_name
`;
console.log("\nConfirmed state:");
console.table(rows);

await sql.end();

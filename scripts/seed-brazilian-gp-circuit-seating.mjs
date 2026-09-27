import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

// Note: DIRECT_URL times out from this machine (see feedback_db_migration.md)
// — use DATABASE_URL (transaction pooler, port 6543) instead.
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

// circuit_seating_profile seed for Interlagos (Brazilian GP 2026) — built
// for the Ticket Intelligence app ($10 standalone, "which seat fits your
// preferences" decision tool). Full inventory: 10 grandstands, Heineken
// Village (2 sub-tiers), 4 named hospitality products. Porto Bank Grandstand
// deliberately excluded — real stand, but sales restricted to Porto Bank
// credit card holders, not purchasable by a general fan (per 25 Sep 2026
// decision). Researched 25 Sep 2026.
//
// Deliberately organized by SEAT (grandstand/festival-lawn/hospitality),
// not by planner_ticket_tier_cost's tier1-4 pricing rows — tier is a
// price-sortable, sport-agnostic axis on purpose (see that table's own
// comment) and is the wrong axis for "what does this seat actually show
// you." ticketTierCostId links back to the priced tier where one exists.
//
// PRICING SOURCING NOTE — two tiers of confidence, both honestly labeled:
// 1. HIGH confidence: Grandstand A/G/M/R and Heineken Village Field/Star
//    match planner_ticket_tier_cost's existing seeded USD ranges directly
//    (tier1-3), sourced to that table's own bar.
// 2. LOWER confidence, ordinal-only: the remaining 6 grandstands (B, D, H,
//    N, S, V) and Pit Stop Club / Grand Prix Club were placed using a mix
//    of (a) one unverified secondary site's face-value BRL→USD table
//    (provenance not independently confirmed — domain didn't surface in
//    search) and (b) real official face-value figures found separately for
//    S/V/N/Pit Stop Club/Grand Prix Club. Used ONLY to rank these seats
//    against the existing tier1-4 bands (cheap → expensive) — the rubric
//    never displays a $ figure to the fan, only relative tier rank, so
//    approximate ordinal placement was judged acceptable by the founder
//    (25 Sep 2026) even where the exact number isn't independently
//    verified. Per-seat sourceNote below documents which basis applied.
//
// Known gaps, left honest rather than guessed:
// - Grandstand A screen visibility: sources conflicted (one says visible,
//   one says no big screen) — left untagged rather than guessed.
// - Grandstand B/M: RESERVED (numbered) seating — every other grandstand at
//   Interlagos is unreserved/first-come-first-served within the stand
//   (confirmed via brasilf1.com FAQ, cross-checked per-stand page).
// - All 16 seats: singleDayAvailable = false. Confirmed via Eventim/
//   official source — Interlagos sells 3-day (Fri-Sun) tickets only, no
//   single-day product exists for any tier/seat. This means the "which
//   days are you attending" rubric question has no real variation at this
//   circuit and should be hidden for it, driven by this data rather than
//   hardcoded per-circuit logic.
// - Grand Prix Club ($3,743 sourced) exceeds tier4's current seeded
//   ceiling ($2,361) — decision (25 Sep 2026): placed in tier4 anyway
//   (still the correct "most expensive" ordinal bucket), tier4's own range
//   left unchanged rather than widened.

const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4"; // Brazilian GP 2026

// tier1-4 planner_ticket_tier_cost row IDs for this event, looked up by tier.
const tierRows = await sql`
  SELECT id, tier FROM planner_ticket_tier_cost WHERE sporting_event_id = ${EVENT_ID}
`;
const tierIdByKey = Object.fromEntries(tierRows.map((r) => [r.tier, r.id]));
for (const t of ["tier1", "tier2", "tier3", "tier4"]) {
  if (!tierIdByKey[t]) throw new Error(`Missing expected ${t} row for event ${EVENT_ID} — aborting.`);
}

const SEATS = [
  // ─── tier1 ($177-283 seeded) ─────────────────────────────────────────
  {
    seatName: "Grandstand A",
    seatType: "grandstand",
    zoneLabel: "Finish straight, elevated bowl section (view varies by row)",
    actionTags: ["high_speed", "podium_atmosphere"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: false,
    sourceNote:
      "HIGH confidence — matches existing tier1 seeded range directly. Largest stand on the circuit, bleacher-style uncovered seating. Upper rows (near Junção end) see infield T4-T14; lower/pit-building end has infield view obstructed but borders the grid. Screen visibility conflicting across sources — left untagged. Unreserved seating (confirmed via brasilf1.com FAQ — all grandstands except B & M). Sources: sitwhere.com/brazil-formula-1-grand-prix-interlagos, motorsporttickets.com/blog/brazil-grand-prix-grandstand-guide, grandprixgrandtours.com/brazil-circuit-guide, brasilf1.com/en/ticket-info/grandstand-a-2 (25 Sep 2026).",
    ticketTierId: tierIdByKey.tier1,
  },
  {
    seatName: "Grandstand G",
    seatType: "grandstand",
    zoneLabel: "Subida dos Boxes (pit rise) / back straight past Turn 3",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: false,
    sourceNote:
      "HIGH confidence — matches existing tier1 seeded range directly. 370m long, uncovered bleacher-style seating, panoramic views. Sees braking from 330→160 km/h. Unreserved. Sources: sitwhere.com, motorsporttickets.com, brasilf1.com/en/ticket-info/grandstand-g-2 (25 Sep 2026).",
    ticketTierId: tierIdByKey.tier1,
  },
  {
    seatName: "Grandstand S",
    seatType: "grandstand",
    zoneLabel: "Turn 4 entry (Descida do Lago), end of Reta Oposta back straight",
    actionTags: ["overtaking"],
    covered: null,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: false,
    sourceNote:
      "LOWER confidence ordinal placement — official face-value ~$205 USD (~1,140 BRL) found via secondary aggregator (racegetaways.com/gp1tickets.com/grandstandtravel.com references), places it alongside tier1. Front-row DRS zone, one of the best overtaking spots on the circuit, entirely uncovered per one source (not independently cross-checked — left null rather than asserted). Unreserved. Sources: brasilf1.com/en/ticket-info/grandstand-s-1 (location/reserved status only), secondary pricing aggregator (25 Sep 2026).",
    ticketTierId: tierIdByKey.tier1,
  },
  {
    seatName: "Grandstand V",
    seatType: "grandstand",
    zoneLabel: "Turn 4 (outside, adjacent to S), extending toward Turn 5",
    actionTags: ["overtaking"],
    covered: null,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: false,
    sourceNote:
      "LOWER confidence ordinal placement — official face-value ~$220 USD (~1,230 BRL) found via secondary aggregator, places it alongside tier1/S. Adjacent to Grandstand S, very similar pricing/action — late-braking battles into Turn 4, view extends to Turn 5 on exit. Uncovered per one source (not independently cross-checked — left null). Unreserved. Sources: brasilf1.com/en/ticket-info/grandstand-v (location/reserved status only), secondary pricing aggregator (25 Sep 2026).",
    ticketTierId: tierIdByKey.tier1,
  },
  // ─── tier2 ($385-640 seeded) ─────────────────────────────────────────
  {
    seatName: "Grandstand M",
    seatType: "grandstand",
    zoneLabel: "Turn 1, end of main straight",
    actionTags: ["overtaking", "start_grid"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — matches existing tier2 seeded range directly. Covered, RESERVED numbered seating (one of only 2 reserved stands at Interlagos, with B), 14 rows high-tiered. Views main straight into Turn 1 plus glimpses of T2/T3. Confirmed covered by 2 independent sources: f1saopaulo.com.br/en/stands, grandprixgrandtours.com/brazil-circuit-guide (25 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Grandstand R",
    seatType: "grandstand",
    zoneLabel: "Curva do Sol (Turn 3) / start of back straight",
    actionTags: ["overtaking", "pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: false,
    sourceNote:
      "HIGH confidence — matches existing tier2 seeded range directly. Covered seating, food/beverage + merch vendors. Views opening 3 corners and cars rejoining after pit stops. No big screen visible — confirmed by 2 sources. Unreserved. Sources: sitwhere.com, motorsporttickets.com (25 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Grandstand H",
    seatType: "grandstand",
    zoneLabel: "Senna S (Turns 1-2), start of back straight, pit exit",
    actionTags: ["technical_corner", "pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: false,
    sourceNote:
      "LOWER confidence ordinal placement — secondary aggregator's face-value figure (~$511 USD / 2,850 BRL) falls inside tier2's existing $385-640 seeded range, cross-checked against a separate 2025 social-media half-price repost (~R$1,250) which also implied a similar band. Covered, view of Senna S, back straight start, pit exit. More competitively priced than D despite similar view (no stadium food/drinks included). Fan Zone free entry for G/H/N/R/Porto grandstand holders. Unreserved. Sources: brasilf1.com/en/ticket-info/grandstand-h-2, grandprixgrandtours.com/brazil-circuit-guide (location/coverage), secondary pricing aggregator + 2025 social repost (25 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Grandstand N",
    seatType: "grandstand",
    zoneLabel: "Turn 3 (Curva do Sol), between Grandstands H and R",
    actionTags: ["technical_corner", "overtaking"],
    covered: null,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: false,
    sourceNote:
      "LOWER confidence ordinal placement — base seat price found at $600+ USD via secondary aggregator (a higher €1,889 figure cited elsewhere is a bundled 'F1 Live' hospitality-addon package price, not the base seat, and was NOT used for placement). Sits between H and R, view of cars exiting Senna S curves onto the back straight. Coverage not independently confirmed — left null. Unreserved. Sources: brasilf1.com/en/ticket-info/grandstand-n-2 (location/reserved status only), secondary pricing aggregator (25 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  // ─── tier3 ($444-810 seeded) ─────────────────────────────────────────
  {
    seatName: "Heineken Village – Field",
    seatType: "festival_lawn",
    zoneLabel: "Infield lawn, between Turns 10 and 14",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: 18,
    singleDayAvailable: false,
    reservedSeating: false,
    sourceNote:
      "HIGH confidence — matches existing tier3 seeded range directly. Festival-style standing/lawn zone, ~70% of track visible, 30m from track. Field area = cheaper, no F&B included. 18+ only (confirmed, security-related restriction). Not applicable seating (standing/lawn) — reservedSeating false by definition. Sources: gpdestinations.com/trackside-brazilian-grand-prix-interlagos, tickets.formula1.com/en/f1-3325-brazil/18927-heineken-village, brasilf1.com/en/ticket-info/heineken-village (25 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Heineken Village – Star",
    seatType: "festival_lawn",
    zoneLabel: "Infield lawn, between Turns 10 and 14 (elevated Star-shaped floor)",
    actionTags: ["overtaking", "technical_corner"],
    covered: true,
    minAge: 18,
    singleDayAvailable: false,
    reservedSeating: false,
    sourceNote:
      "HIGH confidence — matches existing tier3 seeded range directly. Premium sub-tier within Heineken Village — elevated floor, finger food + open bar (Heineken draft) included. Same 18+ restriction as Field. Sources: gpdestinations.com/trackside-brazilian-grand-prix-interlagos, tickets.formula1.com/en/f1-3325-brazil/18927-heineken-village (25 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Grandstand D",
    seatType: "grandstand",
    zoneLabel: "Senna S (Turns 1-2) / end of main straight, start/finish view",
    actionTags: ["technical_corner", "start_grid"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: false,
    sourceNote:
      "LOWER confidence ordinal placement — secondary aggregator's face-value figure (~$838 USD / 4,680 BRL) exceeds tier2's seeded ceiling, placed in tier3 alongside Heineken Village. A separate 2025 social-media repost showed a full-price 'Inteira' figure of R$4,230 for this stand, roughly consistent. Covered, front view of race start + pit lane exit, giant screen. Unreserved. Sources: brasilf1.com/en/ticket-info/grandstand-d, motorsporttickets.com (location/coverage), secondary pricing aggregator + 2025 social repost (25 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Grandstand B",
    seatType: "grandstand",
    zoneLabel: "Start of main straight, next to start/finish line",
    actionTags: ["start_grid", "pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "LOWER confidence ordinal placement — secondary aggregator's face-value figure (~$947 USD / 5,290 BRL) is this table's highest grandstand price, placed in tier3 alongside D/Heineken Star. Covered, RESERVED numbered seating (one of only 2 reserved stands, with M) — catering included per aggregator description, high catch fencing may affect some sightlines. View of grid forming up, race start, pit lane, podium ceremony. Sources: brasilf1.com/en/ticket-info/grandstand-b-2, motorsporttickets.com (location/coverage/reserved status), secondary pricing aggregator (25 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  // ─── tier4 (seeded $1955-2361; Grand Prix Club exceeds this ceiling,
  //     placed here anyway per 25 Sep 2026 decision — see header note) ──
  {
    seatName: "Orange Tree Club",
    seatType: "hospitality",
    zoneLabel: "Curva do Laranjinha (final sector, inside of track)",
    actionTags: ["technical_corner", "high_speed"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: null,
    sourceNote:
      "Ordinal placement only — bundled into existing tier4 row ('Orange Tree Club / F1 Paddock Experience', $1955-2361) alongside Paddock Club despite being a physically different product; both showed sold-out/coming-soon with no live 2026 price on official or reseller channels checked. Trackside hospitality suite, lounge seating, hot/cold F&B + beer, giant screen, 3-day only. Sources: f1experiences.com/2026-brazilian-grand-prix/f1-experiences-live-orange-tree-club, brasilf1.com/en/ticket-info/orange-tree-club, gpexperiences.com/f1-brazil-orange-tree-club (25 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Paddock Club",
    seatType: "hospitality",
    zoneLabel: "Above the pit lane",
    actionTags: ["pit_lane", "start_grid", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: null,
    sourceNote:
      "Ordinal placement only — same tier4 bundling as Orange Tree Club above. One unverified reseller figure found ($14,550/person, Edge Global Events) suggests real Paddock Club pricing likely exceeds the seeded tier4 range considerably; doesn't affect the rubric since only relative rank (most expensive) is used, not a displayed $ figure. Most premium hospitality tier, covered terrace above team garages, gourmet catering, open bar, driver appearances. 3-day only. Sources: edgeglobalevents.com/f1-paddock-club/brazil, brasilf1.com/en/ticket-info/paddock-club-5, tickets.formula1.com/en/pc-3325-brazil-paddock-club (25 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Pit Stop Club",
    seatType: "hospitality",
    zoneLabel: "Elevated above the pit lane and main straight",
    actionTags: ["pit_lane", "start_grid", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: null,
    sourceNote:
      "Real official face-value price found: 10,750 BRL ≈ $1,925 USD, 3-day (Fri-Sun) — lands almost exactly at tier4's existing seeded floor ($1,955), placed accordingly. Premium covered seating + private lounge (up to 30 guests), buffet + open bar, F1 simulators, daily pit lane visit. View of starting grid, pits, podium, start/finish. Sources: tickets.formula1.com/en/ah-3325-brazil-additional-hospitality/pit-stop-club, f1saopaulo.com.br/en/hospitality, GPDestinations.com pricing summary (25 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Grand Prix Club",
    seatType: "hospitality",
    zoneLabel: "Pinheirinho, Bico de Pato and Laranjinha turns (panoramic trackside)",
    actionTags: ["technical_corner", "pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: null,
    sourceNote:
      "Real official face-value price found: 20,900 BRL ≈ $3,743 USD, 3-day (Fri-Sun) — exceeds tier4's current seeded ceiling ($2,361). Decision (25 Sep 2026): placed in tier4 anyway as the correct ordinal 'most expensive' bucket rather than widening tier4's range or fabricating a 5th tier; described by sources as 'the most expensive and prestigious official local track package before upgrading to the global F1 Paddock Club.' Gourmet festival-style catering, open bar, entertainment area, pit lane access, panoramic multi-turn views. Sources: GPDestinations.com pricing summary, f1experiences.com/blog/where-to-watch-the-action-at-the-sao-paulo-gp (25 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
];

for (const s of SEATS) {
  const result = await sql`
    INSERT INTO circuit_seating_profile
      (sporting_event_id, ticket_tier_cost_id, seat_name, seat_type, zone_label, action_tags, covered, min_age, single_day_available, reserved_seating, source_note)
    VALUES
      (${EVENT_ID}, ${s.ticketTierId}, ${s.seatName}, ${s.seatType}, ${s.zoneLabel}, ${s.actionTags}, ${s.covered}, ${s.minAge}, ${s.singleDayAvailable}, ${s.reservedSeating}, ${s.sourceNote})
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
      last_verified_date = NOW()
    RETURNING seat_name
  `;
  console.log(`✓ ${result[0].seat_name} seeded`);
}

const rows = await sql`
  SELECT seat_name, seat_type, covered, reserved_seating, min_age, ticket_tier_cost_id
  FROM circuit_seating_profile
  WHERE sporting_event_id = ${EVENT_ID}
  ORDER BY seat_type, seat_name
`;
console.log("\nConfirmed state:");
console.table(rows);

await sql.end();

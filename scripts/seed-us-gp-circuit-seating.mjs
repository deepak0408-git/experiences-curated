import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

// Note: DIRECT_URL times out from this machine (see feedback_db_migration.md)
// — use DATABASE_URL (transaction pooler, port 6543) instead.
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

// circuit_seating_profile seed for Circuit of the Americas (US GP 2026) —
// built for the Ticket Intelligence app ($10 standalone, "which seat fits
// your preferences" decision tool). Second event built via the
// ticket-intelligence-researcher skill (see
// C:\Users\HP\.claude\skills\ticket-intelligence-researcher\SKILL.md),
// following the process established on the Brazilian GP pilot.
// Researched 26 Sep 2026, cross-checked across 2+ independent sources per
// seat (oversteer48.com, motorsporttickets.com, circuitoftheamericas.com
// official pages, tickets.formula1.com, f1experiences.com) — plus the
// event's own existing TicketsSpoke.tsx, which already had 4 of these 9
// seats curator-reviewed and sourced (GA, Turn 1 "Big Red", Turn 15
// Stadium Section, Main Grandstand).
//
// Deliberately organized by SEAT (grandstand/festival-lawn/hospitality),
// not by planner_ticket_tier_cost's tier1-4 pricing rows — see that
// table's own comment for why tier is the wrong axis for "what does this
// seat show you."
//
// Key divergence from Brazilian GP, confirmed via research (not assumed
// to match): COTA sells SINGLE-DAY tickets for every seat, including
// General Admission ("a separate, cheaper Sunday race-day-only ticket
// also exists for each stand" — TicketsSpoke.tsx's own curator-reviewed
// copy). singleDayAvailable = true for all 9 seats here, meaning Q6
// ("which days are you attending") is a real, scored rubric question at
// this circuit — not hidden, the way it is at Interlagos.
//
// Mixed-coverage seats (Turn 4, Turn 19, Main Grandstand) — each has some
// rows/levels covered and others not (e.g. Turn 4's upper rows 15-21
// covered, lower rows open; Main Grandstand's Club Level only). Per
// founder decision 26 Sep 2026: covered = true for these, since the
// covered sections are the premium/notable rows within each stand — see
// each seat's sourceNote for the real nuance.
//
// No access-gated seats found at COTA (unlike Interlagos's Porto Bank
// Grandstand) — nothing excluded from this inventory.
// No prestige-tiebreaker collision found — Champions Club and Paddock
// Club have genuinely distinct actionTags (trackside high-speed/technical
// view vs. pit-lane/start-grid/podium view), so PRESTIGE_SEAT_NAMES was
// not touched for this event; revisit only if real testing shows a tie.

const EVENT_ID = "4d56ef8b-5026-4ca1-88ad-f87ccebcde1a"; // United States Grand Prix 2026

// tier1-4 planner_ticket_tier_cost row IDs for this event, looked up by tier.
const tierRows = await sql`
  SELECT id, tier FROM planner_ticket_tier_cost WHERE sporting_event_id = ${EVENT_ID}
`;
const tierIdByKey = Object.fromEntries(tierRows.map((r) => [r.tier, r.id]));
for (const t of ["tier1", "tier2", "tier3", "tier4"]) {
  if (!tierIdByKey[t]) throw new Error(`Missing expected ${t} row for event ${EVENT_ID} — aborting.`);
}

const SEATS = [
  // ─── tier1 ($555, General Admission) ─────────────────────────────────
  {
    seatName: "General Admission",
    seatType: "festival_lawn",
    zoneLabel: "9 grassy/hillside zones spread around the circuit",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: false,
    sourceNote:
      "HIGH confidence — matches existing tier1 seeded price directly, cross-checked against the event's own TicketsSpoke.tsx. 9 real grassy/hillside GA zones around the 3.42-mile circuit, no reserved seating, uncovered. Grandstand ticket holders also get GA access on their valid day (not modeled here — this row represents a GA-only purchase). Sources: oversteer48.com/cota-general-admission, chron.com (Houston Chronicle) F1 GA explainer, app/event-pack/[slug]/_hub-and-spoke/spokes/united-states-grand-prix/TicketsSpoke.tsx (26 Sep 2026).",
    ticketTierId: tierIdByKey.tier1,
  },
  // ─── tier2 ($730-1,175, bundled under one label; Turn 15 already ─────
  //     has its own TicketsSpoke.tsx-sourced row) ─────────────────────
  {
    seatName: "Turn 4 Grandstand",
    seatType: "grandstand",
    zoneLabel: "Fast left-right esses, Turns 3-4",
    actionTags: ["technical_corner", "high_speed"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "LOWER-to-HIGH confidence (2 independent sources, real specifics) — covered=true reflects the premium upper rows (15-21, confirmed covered with an awning); lower rows are open — mixed coverage, founder decision 26 Sep 2026 to record as covered given the notable/premium section is covered. Reserved, individual premium seats (formerly 3 separate bleacher sets, now one full grandstand). Located in what drivers call the fastest, most exhilarating section of COTA. Sources: oversteer48.com/cota-turn-4, circuitoftheamericas.com/ticket/williams-package (26 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Turn 9 Grandstand",
    seatType: "grandstand",
    zoneLabel: "Panoramic Turns 6-11, back straight approach",
    actionTags: ["technical_corner", "overtaking"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — 2 independent sources. Reserved bleacher grandstand, stair/ramp access, assigned seats. Second-highest vantage point at COTA — panoramic view spanning 6 corners (Turns 6-11) and 3 short straights. Fully uncovered, no shade. Sources: oversteer48.com/cota-turn-9, tickets.formula1.com/en/f1-3320-united-states/10525-us-turn-9 (26 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Turn 12 Grandstand",
    seatType: "grandstand",
    zoneLabel: "End of the longest straight, top-speed braking zone into Turn 12",
    actionTags: ["overtaking", "high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — 2 independent sources. Reserved bleacher grandstand, stair/ramp access, assigned seats. Directly opposite Turn 12, one of the circuit's key overtaking opportunities as cars arrive at top speed off the longest straight. Uncovered. Sources: oversteer48.com/cota-turn-12, motorsporttickets.com/blog/f1-us-grand-prix-circuit-of-the-americas-grandstand-guide (26 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Turn 19 Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turns 18-20, next to the Grand Plaza / F1 Fan Zone",
    actionTags: ["overtaking", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence (2 independent sources) — covered=true reflects rows 10-21 with upper rows (15-21) specifically covered; not the full stand — mixed coverage, same founder decision as Turn 4. View of cars exiting Turn 18, braking hard into Turn 19-20. Grand Plaza/Fan Zone with food and drink vendors directly behind. Sources: oversteer48.com/cota-turn-19, austin.gp/en/ticket-info/grandstand-turn-19 (26 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Turn 15 — Stadium Section",
    seatType: "grandstand",
    zoneLabel: "5 corners (Turns 12-15) plus the back straight, in one sightline",
    actionTags: ["technical_corner", "overtaking"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — already curator-reviewed, sourced content in the event's own TicketsSpoke.tsx (\"The value seat — five corners in one sightline, at the mid-tier grandstand price\"). One of 3 permanent grandstands at COTA. Source: app/event-pack/[slug]/_hub-and-spoke/spokes/united-states-grand-prix/TicketsSpoke.tsx (26 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  // ─── tier3 ($1,420-1,545) ──────────────────────────────────────────
  {
    seatName: "Turn 1 \"Big Red\"",
    seatType: "grandstand",
    zoneLabel: "11% climb into COTA's signature blind hairpin, plus the start-finish straight",
    actionTags: ["technical_corner", "start_grid"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — already curator-reviewed, sourced content in the event's own TicketsSpoke.tsx (\"The drama seat — an 11% climb to a blind hairpin\"). One of 3 permanent grandstands at COTA; the marquee view of 20 cars braking uphill on lap one. Source: app/event-pack/[slug]/_hub-and-spoke/spokes/united-states-grand-prix/TicketsSpoke.tsx (26 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Main Grandstand",
    seatType: "grandstand",
    zoneLabel: "Grid, pit lane, start/finish straight, podium",
    actionTags: ["start_grid", "pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — already curator-reviewed, sourced content in the event's own TicketsSpoke.tsx (\"The ceremony seat — grid, pit stops, podium\"). covered=true reflects Club Level specifically (\"the only fully covered tier at the entire circuit\" per the spoke) — Lower/Mezzanine tiers within this same grandstand are not covered, mixed coverage, same founder decision as Turn 4/19. One of 3 permanent grandstands. Source: app/event-pack/[slug]/_hub-and-spoke/spokes/united-states-grand-prix/TicketsSpoke.tsx (26 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  // ─── tier4 ($1,569-6,169, hospitality) ──────────────────────────────
  {
    seatName: "Champions Club",
    seatType: "hospitality",
    zoneLabel: "Trackside terrace",
    actionTags: ["high_speed", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, single clear source — climate-controlled venue with a partially-covered outdoor terrace, trackside views, light bites + curated lunch, premium open bar. covered=true reflects the climate-controlled/partially-covered nature being the notable feature. Distinct from Paddock Club — trackside terrace view, not pit-lane/start-finish. Source: f1experiences.com/2026-united-states-grand-prix/champions-club-3-days (26 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Paddock Club",
    seatType: "hospitality",
    zoneLabel: "Above the pit lane, start/finish straight and the Tower",
    actionTags: ["pit_lane", "start_grid", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, single clear source — most premium hospitality tier, climate-controlled, perched directly above the pit lane with a panoramic view of the starting grid and pit-stop sequences. Open bar, Michelin-star-calibre dining. Named sub-variants (House 44, Gordon Ramsay at F1 Paddock, Club 300/Legend) are products WITHIN Paddock Club, not separate seats — not seeded individually. Source: f1experiences.com/2026-united-states-grand-prix/house-44-at-f1-paddock-club, edgeglobalevents.com/f1-paddock-club/united-states (26 Sep 2026).",
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
  SELECT seat_name, seat_type, covered, reserved_seating, single_day_available, ticket_tier_cost_id
  FROM circuit_seating_profile
  WHERE sporting_event_id = ${EVENT_ID}
  ORDER BY seat_type, seat_name
`;
console.log("\nConfirmed state:");
console.table(rows);

await sql.end();

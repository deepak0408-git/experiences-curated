import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

// Note: DIRECT_URL times out from this machine (see feedback_db_migration.md)
// — use DATABASE_URL (transaction pooler, port 6543) instead.
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

// circuit_seating_profile seed for Red Bull Ring (Austrian GP 2027,
// Spielberg) — built for the Ticket Intelligence app ($10 standalone,
// "which seat fits your preferences" decision tool). Full inventory: 9
// grandstand seats (Red Bull Grandstand split into A/B premium + C-P
// standard per founder direction, 14 Oct 2026), 1 festival/GA zone, 2
// hospitality products.
//
// Researched 14 Oct 2026.
//
// STAND LIST — validated against an official-style Red Bull Ring zone map
// (Blue/Yellow/Green ticket zones, founder-provided 14 Oct 2026) showing
// Grandstand T3, Schönberg, North, T9, T10, Red Bull, Steiermark,
// Start-Ziel (Covered), Champions Club, F1 Fan Zone, and General Admission
// as the real current stand roster. T8 and Mitte — described with specific
// location/seat-count detail in fan guides (oversteer48.com, fanamp.com)
// during initial research — do NOT appear anywhere on this official zone
// map and were REMOVED from this seed (founder decision, 14 Oct 2026):
// treated as not part of the current real sellable inventory (possibly
// retired/renamed) rather than seeded against stronger contrary evidence.
//
// SOURCING — three tiers of confidence, all honestly labeled:
// 1. HIGH confidence: Steiermark, Start-Ziel, T3, T10, General Admission —
//    real prices from the official tickets.redbullring.com 2027 event page,
//    corroborated by grandprixevents.com and/or grandprixgrandtours.com for
//    location. Red Bull A/B's location/pricing signal also HIGH (confirmed
//    sold-out on official site at a price above C-P, and independently via
//    f1experiences.com's bundled "Red Bull B" package at $2,159 vs Red Bull
//    FGHI/JK's $999-1,199 — a real, sourced price gap, not guessed).
// 2. LOWER confidence, ordinal-only: Red Bull C-P (bulk), T9, North/Nord,
//    Schönberg — no independently-priced official source found; placed by
//    relative position/premium-ness described in fan guides (oversteer48.com,
//    fanamp.com, grandprixgrandtours.com) rather than a real price. Never
//    displayed to the fan as a $ figure, only relative tier rank (see
//    planner_ticket_tier_cost's own design note).
// 3. Hospitality: Champions Club price is HIGH confidence, sourced directly
//    to f1experiences.com's 2027 Austrian GP page ($4,919, 3-Days). F1
//    Paddock Club's real 2027 price is NOT published anywhere (official F1
//    ticketing hospitality page is waitlist-only) — tier4's $6,500 ceiling
//    is an UNCONFIRMED ESTIMATE (founder direction, 14 Oct 2026) scaled
//    above Champions Club's confirmed price, pending real 2027 Paddock Club
//    pricing release.
//
// CIRCUIT VALIDATION: all 10 numbered turns and their official names
// (Turn 1 Niki Lauda, Turn 3 Ams Ag, Turn 4 Rauch, Turn 9 Jochen Rindt;
// Turns 2, 5-8, 10 unnamed on the reference map) cross-checked against
// Wikipedia's "Spielberg_bare_map_numbers_contextless_2021_corner_names.svg"
// (sourced to projekt-spielberg.com's 2021 circuit page), grandprixgrandtours.com's
// circuit diagram, and the founder-provided official zone map — every
// stand's claimed turn-location/zone-color in zoneLabel below was verified
// against all three with no contradictions found.
//
// Known gaps, left honest rather than guessed:
// - minAge: NULL for every seat — no age restriction found anywhere in
//   research (unlike e.g. Interlagos's Heineken Village 18+).
// - reservedSeating: Schönberg's numbered-seat plan exists per oversteer48,
//   but the source doesn't explicitly confirm "reserved" vs a
//   numbered-but-general-admission-zone ambiguity — seeded true since a
//   numbered seat plan was found, but flagged as the weaker of the
//   reservedSeating confirmations here.
// - singleDayAvailable: confirmed true only for Steiermark, T3, T10, and
//   Red Bull C-D-E/F-G-H-I (official site sells a Sunday single-day rate
//   for these specifically) and confirmed false for Paddock
//   Club/Champions Club (multi-day package only, per f1experiences.com).
//   Everywhere else left NULL — not independently confirmed either way.
// - Red Bull Grandstand A-P: the real on-sale product history shows this
//   stand sold in sub-bundles (e.g. "Red Bull FGHI", "Red Bull JK") rather
//   than one simple A-P sweep — the circuit map confirms one continuous
//   physical structure, so it's seeded as two seats (A/B premium, C-P
//   standard) per founder direction rather than the finer historical
//   sub-bundles, since those aren't independently priced beyond the A/B
//   vs rest split.

const EVENT_ID = "5ef66790-1609-4969-8c20-46f3d9d796a6"; // Austrian GP 2027

// tier1-4 planner_ticket_tier_cost row IDs for this event, looked up by tier.
const tierRows = await sql`
  SELECT id, tier FROM planner_ticket_tier_cost WHERE sporting_event_id = ${EVENT_ID}
`;
const tierIdByKey = Object.fromEntries(tierRows.map((r) => [r.tier, r.id]));
for (const t of ["tier1", "tier2", "tier3", "tier4"]) {
  if (!tierIdByKey[t]) throw new Error(`Missing expected ${t} row for event ${EVENT_ID} — aborting.`);
}

const SEATS = [
  // ─── tier1 ($185-220 seeded) ─────────────────────────────────────────
  {
    seatName: "General Admission",
    seatType: "festival_lawn",
    zoneLabel: "Whole-circuit standing access, incl. F1 Fan Zone (behind Niki Lauda corner, Turn 1) and Steiermark Village (opposite Red Bull Grandstand)",
    actionTags: [],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: false,
    sourceNote:
      "HIGH confidence — matches tier1 seeded range directly, official tickets.redbullring.com 2027 price (€170 weekend / €155 Sunday, ≈$185-220 USD). Unreserved standing/lawn access across the circuit. Fan Zone and Steiermark Village locations per redbullring.com's official F1 FAQ page. Sources: tickets.redbullring.com/en/f1/f1-grand-prix-oesterreich-2027/tickets.html, redbullring.com/en/events-tickets/formel-1/formel-1-faq-service (14 Oct 2026).",
    ticketTierId: tierIdByKey.tier1,
  },
  {
    seatName: "Schönberg",
    seatType: "grandstand",
    zoneLabel: "Short downhill straight between Ams Ag corner (Turn 3) and Rauch corner (Turn 4), grassy bank, Green zone",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: true,
    sourceNote:
      "LOWER confidence ordinal placement — no independent official price found; placed at tier1 as the cheapest named grandstand per its General-Admission-zone positioning and fan-guide description. Uncovered, individual plastic chairs, 2 sections (A nearer Turn 3, B nearer Turn 4). Numbered seat plan found but reserved-vs-GA status not explicitly confirmed by any source — seeded true since a numbered plan exists. Location cross-checked against grandprixgrandtours.com's circuit guide (confirms 'further along from T3 on the short downhill straight') and the official turn-number map. Sources: oversteer48.com/schonberg-grandstand-red-bull-ring-austria, grandprixgrandtours.com/austria-circuit-guide (14 Oct 2026).",
    ticketTierId: tierIdByKey.tier1,
  },
  // ─── tier2 ($350-480 seeded) ─────────────────────────────────────────
  {
    seatName: "Red Bull Grandstand C-P",
    seatType: "grandstand",
    zoneLabel: "Hillside climb from Niki Lauda corner (Turn 1) exit up to Ams Ag corner (Turn 3), sections C-P, Blue zone",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — matches tier2 directly via official tickets.redbullring.com pricing for the on-sale sub-bundles within this range (Red Bull C,D,E: €390 Sunday/€212.50 reduced weekend; Red Bull F,G,H,I: €330 Sunday/€180 reduced weekend — both ≈$350-430 USD). Red Bull J,K sold out on the official site but corroborated at the low end of this band via f1experiences.com's bundled 'Red Bull JK' package ($999, cheapest Red Bull product) and 'Red Bull FGHI' ($1,199). One continuous uncovered hillside grandstand, individual plastic numbered chairs, structure confirmed via grandprixgrandtours.com's circuit diagram. Sources: tickets.redbullring.com/en/f1/f1-grand-prix-oesterreich-2027/tickets.html, f1experiences.com/2027-austrian-grand-prix/starter, grandprixgrandtours.com/austria-circuit-guide, oversteer48.com/red-bull-grandstand-austria-red-bull-ring (14 Oct 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "T 10",
    seatType: "grandstand",
    zoneLabel: "Final corner (Turn 10), opposite pit lane entrance, leading onto start/finish straight; sections A-F, Yellow zone",
    actionTags: ["high_speed", "technical_corner", "pit_lane"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — matches tier2 directly, official tickets.redbullring.com price (€435 weekend/€400 Sunday ≈ $400-470 USD). Uncovered, numbered individual plastic chairs, faces west. Beside the smaller T9 stand. Location cross-checked against the official turn-number map (Turn 10 leads directly onto the start/finish straight, pit entry nearby) and grandprixevents.com corroboration. Sources: tickets.redbullring.com/en/f1/f1-grand-prix-oesterreich-2027/tickets.html, oversteer48.com/t10-grandstand-red-bull-ring-austria, grandprixevents.com/2027-austrian-grand-prix (14 Oct 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "T 9",
    seatType: "grandstand",
    zoneLabel: "Jochen Rindt corner (Turn 9) entry, opposite the pit lane entrance, beside the T10 stand, Yellow zone",
    actionTags: ["pit_lane", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: true,
    sourceNote:
      "LOWER confidence ordinal placement — no independent official price found; placed at tier2 alongside the similarly-sized T10 stand per fan-guide description. Uncovered, 3 sections (A-C), individual plastic numbered chairs. Confirmed as a real current stand (labeled 'Grandstand T9') on the official-style Red Bull Ring zone map (Yellow zone) provided by the founder 14 Oct 2026. Location cross-checked against the official turn-number map (Turn 9 = Jochen Rindt, immediately before Turn 10 and the pit straight). Sources: redbullring.com zone map (founder-provided, 14 Oct 2026), oversteer48.com/t9-grandstand-red-bull-ring, grandprixgrandtours.com/austria-circuit-guide.",
    ticketTierId: tierIdByKey.tier2,
  },
  // ─── tier3 ($480-790 seeded) ─────────────────────────────────────────
  {
    seatName: "Steiermark",
    seatType: "grandstand",
    zoneLabel: "Niki Lauda corner (Turn 1) apex and run-off, end of start/finish straight; sections A-E, Blue zone",
    actionTags: ["start_grid", "overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — matches tier3 directly, official tickets.redbullring.com price (€730 weekend ≈ $790 USD, sold out; reduced weekend €365/child €36 still available). Uncovered, numbered individual plastic chairs, 14 rows for most sections. Most premium ordinary grandstand at the circuit — sells out fastest. Location cross-checked against the official turn-number map and grandprixgrandtours.com's circuit diagram (both confirm position at Turn 1/Niki Lauda, start of the hillside climb). Sources: tickets.redbullring.com/en/f1/f1-grand-prix-oesterreich-2027/tickets.html, oversteer48.com/steiermark-grandstand-red-bull-ring-austria, grandprixgrandtours.com/austria-circuit-guide (14 Oct 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Start-Ziel",
    seatType: "grandstand",
    zoneLabel: "Start/finish straight, opposite team garages/pit lane, between Turn 10 and Niki Lauda corner; sections A-J, L-Q, only barrier-free stand",
    actionTags: ["start_grid", "pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — matches tier3 directly, official tickets.redbullring.com price (€730 weekend ≈ $790 USD, sold out entirely including wheelchair places; only reachable via the '3 Corner Grandstand Hopping' rotation ticket, €365 reduced). Only covered stand confirmed sold standalone, and the only stand with barrier-free wheelchair access and parking permits per redbullring.com's official FAQ. Location/section-layout cross-checked against grandprixgrandtours.com's circuit diagram (shows sections Q,P,O,N,M,L on one side and A-J on the other, either side of the finish line) and the official turn-number map. Sources: tickets.redbullring.com/en/f1/f1-grand-prix-oesterreich-2027/tickets.html, redbullring.com/en/events-tickets/formel-1/formel-1-faq-service, grandprixgrandtours.com/austria-circuit-guide (14 Oct 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "North/Nord",
    seatType: "grandstand",
    zoneLabel: "Rauch corner (Turn 4), facing back along the straight from Ams Ag (Turn 3); one of only two covered stands, Yellow zone",
    actionTags: ["technical_corner", "overtaking"],
    covered: true,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: true,
    sourceNote:
      "LOWER confidence ordinal placement — no independent official price found; placed at tier3 alongside Steiermark/Start-Ziel/T3 per its covered-stand premium status (shares 'one of only two covered stands' distinction with Start-Ziel). Roof covers all 3 sections (A-C, 13 rows), faces west, shaded ~8am-3:30pm on race day. Some fan-guide sources describe a Dutch-market/Verstappen-fan sale channel for this stand — seeded as a normal seat per founder direction (14 Oct 2026), not flagged as restricted or excluded. Location cross-checked against the official turn-number map (Turn 4 = Rauch, immediately after Ams Ag/Turn 3). Sources: oversteer48.com/north-nord-grandstand-red-bull-ring, grandprixgrandtours.com/austria-circuit-guide (14 Oct 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "T 3",
    seatType: "grandstand",
    zoneLabel: "Ams Ag corner (Turn 3), circuit's steepest incline, next to entrance gate D, ~70% of circuit visible, Blue zone",
    actionTags: ["overtaking", "technical_corner", "high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — matches tier3 directly, official tickets.redbullring.com price (€570 weekend/€520 Sunday ≈ $540-615 USD). Uncovered, 8 sections (A-H), individual plastic numbered chairs. Most-recommended grandstand across fan guides for its wide circuit visibility; sells out fast. Location cross-checked against the official turn-number map (Turn 3 = Ams Ag, the circuit's high point before the hillside descent). Sources: tickets.redbullring.com/en/f1/f1-grand-prix-oesterreich-2027/tickets.html, oversteer48.com/red-bull-ring-t3-grandstand, grandprixgrandtours.com/austria-circuit-guide (14 Oct 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Red Bull Grandstand A/B",
    seatType: "grandstand",
    zoneLabel: "Niki Lauda corner (Turn 1) exit, sections A-B, nearest the corner — most premium part of the Red Bull Grandstand, Blue zone",
    actionTags: ["start_grid", "overtaking"],
    covered: false,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence on the premium-vs-standard price gap — confirmed sold out on the official circuit site at a price point above the C-P bulk range, and independently corroborated via f1experiences.com's bundled 'Red Bull B' package ($2,159) pricing meaningfully above 'Red Bull FGHI' ($1,199) and 'Red Bull JK' ($999) — a real, sourced gap justifying a separate premium row (founder direction, 14 Oct 2026: A/B rated a 3-star price tier vs C-P's 2-star). Same uncovered, numbered-chair structure as the rest of the Red Bull Grandstand; Sector A faces the Turn 1 TV screen and has the best view down the start/finish straight. Location cross-checked against the official turn-number map and grandprixgrandtours.com's circuit diagram. Sources: tickets.redbullring.com/en/f1/f1-grand-prix-oesterreich-2027/tickets.html, f1experiences.com/2027-austrian-grand-prix/starter, oversteer48.com/red-bull-grandstand-austria-red-bull-ring, grandprixgrandtours.com/austria-circuit-guide (14 Oct 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  // ─── tier4 ($4,919-6,500 seeded) ─────────────────────────────────────
  {
    seatName: "Champions Club",
    seatType: "hospitality",
    zoneLabel: "Near the pit building, per the official zone map; exact position not independently disclosed on its own product page",
    actionTags: ["pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence on price — real, directly sourced 2027 figure from f1experiences.com ('Champions Club 3-Days', $4,919, matching tier4's seeded floor exactly). LOWER confidence on exact physical location — the product page itself gives no site position, only inclusions (club viewing/hospitality, F1-insider appearances, grid walk with trophy photo, guided paddock tour, F1 Experiences gift, covered seat with TV screen). 3-day package only, no single-day option. Source: f1experiences.com/2027-austrian-grand-prix/champions-club (14 Oct 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "F1 Paddock Club",
    seatType: "hospitality",
    zoneLabel: "Main straight, above team garages, between Turn 10 and Niki Lauda corner; two-floor building, views into pit lane and grid",
    actionTags: ["pit_lane", "start_grid", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "LOWER confidence on price — the official F1 ticketing hospitality page (ticketing.formula1.com) is waitlist-only for 2027, stating 'full details on available packages will be announced soon'; no real 2027 Paddock Club price is published anywhere. Tier4's $6,500 ceiling is an UNCONFIRMED ESTIMATE (founder direction, 14 Oct 2026) scaled above Champions Club's confirmed $4,919 — re-verify and replace once official 2027 Paddock Club pricing is released. Location (above team garages, pit lane/grid views, two-floor air-conditioned building) is HIGH confidence, corroborated by grandprixevents.com and engagehospitality.co.uk descriptions of recent editions at the same site. Includes pit lane walks, driver/ambassador interviews, track tours, food and drink throughout the weekend. 3-day package only. Sources: ticketing.formula1.com/hospitality-tickets/en/austria/hospitality-f1-red-bull-ring-waitlist, grandprixevents.com/austrian-grand-prix/2025/f1-paddock-club, engagehospitality.co.uk/event/2024-formula-1-austrian-grand-prix (14 Oct 2026).",
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

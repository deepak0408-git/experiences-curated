import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

// Note: DIRECT_URL times out from this machine (see feedback_db_migration.md)
// — use DATABASE_URL (transaction pooler, port 6543) instead.
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

// circuit_seating_profile seed for Madring (Spanish GP 2027) — built for
// the Ticket Intelligence app ($10 standalone "which seat fits you" tool).
// Madring is a brand-new circuit (debuted 2026) with no prior Ticket
// Intelligence data to reuse. No event pack / hub-and-spoke spoke exists
// yet for this event (packStatus: planned, isHidden: true) — this is a
// Trip Intelligence placeholder build, same category as Austrian/Saudi/
// Spanish/Azerbaijan/Turkish GP 2027. Researched 17 Oct 2026.
//
// ALL MADRING TICKETS ARE 3-DAY PASSES ONLY (Fri-Sun) — confirmed via the
// official ticketsf1.madring.com FAQ ("tickets are only available as a
// 3-day pass"). singleDayAvailable = false for every seat.
//
// Primary sources: ticketsf1.madring.com (official ticketing site — covered
// status, turn coverage, confirms ALL grandstand tickets include a numbered
// seat), madring.com/en/circuit (official turn-by-turn circuit description),
// founder-supplied screenshots of Fever's live Madring grandstand sales page
// and F1 Experiences' 2027-spanish-grand-prix hospitality packages (17 Oct
// 2026). Cross-checked open-air/covered status and precise turn framing
// against oversteer48.com's stand-by-stand reviews (GC02/GC03/GC04/GC05/
// GE20/GE21/GB02 — confirmed-reliable source per this skill's §1).
//
// Hospitality scope: per founder direction 17 Oct 2026, Starter / F1
// Experiences Live / Podium Club packages are EXCLUDED — these are
// grandstand-seat hospitality upsells (bundled with a named grandstand
// section), not standalone hospitality products, so they don't belong in
// the hospitality seatType. Only Champions Club 3-Day and Paddock Club
// remain as genuine hospitality seats.
//
// PRESTIGE TIEBREAKER — STANDING RULE (founder direction, 17 Oct 2026,
// updated in this skill's §6): Paddock Club ALWAYS wins the tier4
// tiebreaker against Champions Club, regardless of which has the stronger
// sourced price. This is a structural fact about F1 hospitality's format,
// not a per-circuit pricing judgment. Paddock Club is added to
// PRESTIGE_SEAT_NAMES / STAR_OVERRIDE_BY_SEAT_NAME in
// app/ticket-intelligence/[slug]/_lib/scoreSeats.ts and FullResult.tsx as a
// separate manual step (not done by this script).
//
// Known gaps, left honest rather than guessed:
// - General Admission (Pelouse) price: no confirmed 2027 figure exists
//   yet. Used the confirmed 2026 pattern (EUR 195 early bird -> EUR 345
//   current release) as a LOWER-confidence placeholder, per founder
//   direction 17 Oct 2026 — re-verify once a real 2027 Pelouse price is
//   published (Madring's 2027 general sale opened 29 Sep 2026).
// - Paddock Club: no Madring-specific page or price found on the two
//   official channels used (ticketsf1.madring.com, f1experiences.com —
//   f1experiences.com/2027-spanish-grand-prix does list an "F1 Paddock
//   Club" product page but with 0 options available / no live price at
//   research time). Only a 2026 Barcelona-circuit reference price (EUR
//   6,999, different circuit/year) was available — used for ordinal
//   top-tier placement only, LOWER confidence, per founder direction 17
//   Oct 2026.
// - MULTI-CHANNEL CONFLICT, flagged not silently resolved (17 Oct 2026):
//   a third-party aggregator (gpdestinations.com) describes a DIFFERENT
//   Pelouse location (inside the track, overlooking Turns 6-8) than the
//   two independent sources used for this seed (gpdestinations' own
//   separate budget-planner article + a secondary cross-reference, both
//   saying Turns 14-15/Distrito Fan Zone) — AND five additional local
//   hospitality products not seeded here (Ignition Club, El Mirador,
//   Traction Club, La Terminal, La Azotea — 2026 prices, unconfirmed
//   official/2027 status). Per founder direction 17 Oct 2026, this build
//   deliberately sticks to the two already-used official channels
//   (ticketsf1.madring.com + f1experiences.com) and does NOT seed the
//   gpdestinations-only products or reconcile the Pelouse conflict — flag
//   for a future pass if gpdestinations' claims are later confirmed
//   official.
// - Zone letter naming on Fever's site (Zone A/C/E) does not map 1:1 to
//   individual stand groupings used by oversteer48.com (GB/GC/GE prefixes)
//   — this script uses the circuit's real turn numbers for zoneLabel
//   rather than either site's zone-lettering scheme, per this skill's
//   mandatory zoneLabel bar (§2).
// - Seat naming: official ticketsf1.madring.com names this stand "Straight
//   14A" (not "Turn 14A" as Fever's product page and this script's earlier
//   draft called it) — corrected to match the official site's own naming
//   in the seatName below.

const EVENT_ID = "0738c013-2644-4784-825f-d112ec603825"; // Spanish GP 2027

// tier1-4 planner_ticket_tier_cost row IDs for this event, looked up by tier.
const tierRows = await sql`
  SELECT id, tier FROM planner_ticket_tier_cost WHERE sporting_event_id = ${EVENT_ID}
`;
const tierIdByKey = Object.fromEntries(tierRows.map((r) => [r.tier, r.id]));
for (const t of ["tier1", "tier2", "tier3", "tier4"]) {
  if (!tierIdByKey[t]) throw new Error(`Missing expected ${t} row for event ${EVENT_ID} — aborting.`);
}

const SEATS = [
  // ─── tier1 — General Admission ──────────────────────────────────────
  {
    seatName: "Pelouse (General Admission)",
    seatType: "festival_lawn",
    zoneLabel:
      "Open viewing field between Turn 14 and Turn 15, part of the Las Enlazadas de Valdebebas sequence, beside the Distrito Fan Zone",
    actionTags: ["high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: false,
    sourceNote:
      "LOWER confidence — no confirmed 2027 price published yet (Madring's 2027 general sale opened 29 Sep 2026 but no live Pelouse figure was found); used the confirmed 2026 pattern (EUR 195 early bird -> EUR 345 current release, 3-day) as a placeholder per founder direction 17 Oct 2026, to be re-verified once a real 2027 figure is published. Location independently confirmed via two sources: an open viewing field between Turns 14 and 15 beside the Distrito Fan Zone. Unreserved standing/lawn access by definition. Sources: gpdestinations.com/madrid-budget-planner-spanish-grand-prix, secondary Madring circuit-guide cross-reference (17 Oct 2026).",
    ticketTierId: tierIdByKey.tier1,
  },
  // ─── tier2 — Grandstand (Bronze) ────────────────────────────────────
  {
    seatName: "Straight 3 Bronze",
    seatType: "grandstand",
    zoneLabel:
      "Straight between Turn 3 (Hortaleza) exit and Turn 4 entry, on the Ribera del Sena section; pit lane exit visible",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — exact current 2027 price (EUR 435, 3-day) from Fever's live Madring sales page (founder screenshot, 17 Oct 2026). Open-air, confirmed via oversteer48.com's GC02 stand review (\"completely uncovered\") — GC02/GC01 together make up this Fever-listed 'Bronze 3' stand. All grandstand tickets include a numbered seat, confirmed via ticketsf1.madring.com's official FAQ. Not an overtaking spot per the same review (straight-line viewing only, Turn 3 exit/Turn 4 entry both out of sight). Sources: feverup.com (Fever official Madring sales page, founder screenshot), oversteer48.com/?p=47422, ticketsf1.madring.com, madring.com/en/circuit (17 Oct 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Turn 4A Bronze",
    seatType: "grandstand",
    zoneLabel:
      "Turn 4 and the start of Turn 5, on the Ribera del Sena section — the circuit's top-speed point (up to 340 km/h, taken flat out)",
    actionTags: ["high_speed", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — exact current 2027 price (EUR 509, 3-day) from Fever's live Madring sales page (founder screenshot, 17 Oct 2026). Open-air, confirmed via two independent oversteer48.com stand reviews (GC03/GC04, both described as 'no cover and no shade'). Main view is cars slowing at the end of Turn 4 approaching Turn 5; Turn 5 entry only partially visible from left-hand seats. Numbered seating confirmed via official ticketsf1.madring.com FAQ. Sources: feverup.com (founder screenshot), oversteer48.com/?p=47458, oversteer48.com/?p=47471, ticketsf1.madring.com, madring.com/en/circuit (17 Oct 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Straight 14A Bronze",
    seatType: "grandstand",
    zoneLabel:
      "Turn 14, start of Las Enlazadas de Valdebebas — flat-out linked corners (14-16) before braking into Turn 17",
    actionTags: ["high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — exact current 2027 price (EUR 509, 3-day) from Fever's live Madring sales page (founder screenshot, 17 Oct 2026). Named 'Straight 14A' on the official ticketsf1.madring.com site (Fever's product listing calls it 'Turn 14A' — corrected to the official site's naming here). Open-air, inferred from the same Las Enlazadas de Valdebebas grandstand cluster (GE19/20/21) that oversteer48.com confirms uncovered for the adjacent Turn 15 stands — same structure type, same section. Numbered seating confirmed via official ticketsf1.madring.com FAQ. Sources: feverup.com (founder screenshot), oversteer48.com/?p=48234, oversteer48.com/?p=48252, madring.com/en/circuit, ticketsf1.madring.com (17 Oct 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Turn 14B Bronze",
    seatType: "grandstand",
    zoneLabel:
      "Turns 14-16 (Las Enlazadas de Valdebebas) into the Turn 17 braking zone — a confirmed overtaking spot",
    actionTags: ["high_speed", "overtaking"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — exact current 2027 price (EUR 475, 3-day, 2nd release) from Fever's live Madring sales page (founder screenshot, 17 Oct 2026). Open-air, confirmed via oversteer48.com's GE21 stand review ('no shade for this grandstand'); GE21 sits within the same Curva 15 Bronze cluster (GE19/20/21) that Fever splits into separately-sold 'Turn 14A/14B/Turn 15' products. Numbered seating confirmed via official ticketsf1.madring.com FAQ, which also states this section overlooks Turns 14-16 into the Turn 17 braking zone. Sources: feverup.com (founder screenshot), oversteer48.com/?p=48234, ticketsf1.madring.com, madring.com/en/circuit (17 Oct 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Turn 15 Bronze",
    seatType: "grandstand",
    zoneLabel:
      "Turn 15, the final corner of the Las Enlazadas de Valdebebas sequence, within view of the extended S-curve exit",
    actionTags: ["high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — exact current 2027 price (EUR 435, 3-day) from Fever's live Madring sales page (founder screenshot, 17 Oct 2026). Open-air, directly confirmed via oversteer48.com's GE20 stand review ('completely uncovered and there's no shade at all') — GE20 is explicitly named as part of Madring's own 'Curva 15 Bronze' stand grouping. Numbered seating confirmed via official ticketsf1.madring.com FAQ. Sources: feverup.com (founder screenshot), oversteer48.com/?p=48252, ticketsf1.madring.com, madring.com/en/circuit (17 Oct 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  // ─── tier3 — Premium Grandstand (Silver / Gold) ─────────────────────
  {
    seatName: "Turn 10 Silver",
    seatType: "grandstand",
    zoneLabel:
      "Turn 10, the uphill section leading into Subida de las Cárcavas (the circuit's 8% climb toward its highest point)",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — exact current 2027 price (EUR 585, 3-day, 1st release) from Fever's live Madring sales page (founder screenshot, 17 Oct 2026). Open-air — the official ticketsf1.madring.com page does not state covered status for this stand explicitly, but the circuit-wide pattern confirmed by this skill's research (only Gold 1A/1B/1C and Monumental 12C are covered; every other reviewed Silver/Bronze stand is open-air) supports false here; no source states it is covered. Turn coverage confirmed directly: official site describes this as 'Turn 10, on the uphill section to Las Cárcavas.' Numbered seating confirmed via official FAQ. Sources: feverup.com (founder screenshot), ticketsf1.madring.com, madring.com/en/circuit (17 Oct 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Straight 13A Silver",
    seatType: "grandstand",
    zoneLabel:
      "Heavy braking into Turn 13 hairpin, right after La Monumental's exit — 300+ to ~140 km/h, a confirmed overtaking spot",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — exact current 2027 price (EUR 585, 3-day, 1st release) from Fever's live Madring sales page (founder screenshot, 17 Oct 2026). Official ticketsf1.madring.com describes this section as the 'heavy braking zone into Turn 13.' Open-air per the circuit-wide covered pattern (only 1A/1B/1C and 12C confirmed covered); no source states 13A is covered. Numbered seating confirmed via official FAQ. Sources: feverup.com (founder screenshot), ticketsf1.madring.com, madring.com/en/circuit (17 Oct 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Monumental 12B Silver",
    seatType: "grandstand",
    zoneLabel:
      "La Monumental (Turn 12), the circuit's signature 24%-banked bullring-inspired corner — approximately 548m long with a 45,000-spectator capacity",
    actionTags: ["high_speed", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — exact current 2027 price (EUR 665, 3-day, 2nd release) from Fever's live Madring sales page (founder screenshot, 17 Oct 2026). Open-air — official ticketsf1.madring.com explicitly marks the adjacent 12C as covered while not marking 12B, consistent with 12B being open-air. Turn/banking detail confirmed via madring.com/en/circuit (24% banking, ~548m, 45,000 capacity, cars spend roughly six seconds in the corner). Numbered seating confirmed via official FAQ. Sources: feverup.com (founder screenshot), ticketsf1.madring.com, madring.com/en/circuit (17 Oct 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Monumental 12C Covered Silver",
    seatType: "grandstand",
    zoneLabel:
      "Exit of La Monumental (Turn 12), the circuit's 24%-banked bullring-inspired corner — a covered stand positioned at the corner's exit",
    actionTags: ["high_speed", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — exact current 2027 price (EUR 585, 3-day, 1st release) from Fever's live Madring sales page (founder screenshot, 17 Oct 2026; shown sold out at time of research, included anyway as a real purchasable-when-available seat per founder direction). Covered status explicitly confirmed by official ticketsf1.madring.com ('covered grandstand with shade'), describing this section as the 'exit of the La Monumental banked turn.' Numbered seating confirmed via official FAQ. Sources: feverup.com (founder screenshot), ticketsf1.madring.com, madring.com/en/circuit (17 Oct 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Main Straight 1A Covered Gold",
    seatType: "grandstand",
    zoneLabel:
      "Turn 22 (El Parque, the final corner) and the start of the Main Straight, overlooking the start/finish line",
    actionTags: ["start_grid", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — exact current 2027 price (EUR 989, 3-day, 1st release) from Fever's live Madring sales page (founder screenshot, 17 Oct 2026). Covered status explicitly confirmed by official ticketsf1.madring.com ('covered grandstand (except the first few rows)'), describing this section as the 'final turn and start of main straight.' Final-corner identity (Turn 22, El Parque) confirmed via madring.com/en/circuit's own turn-by-turn description. Numbered seating confirmed via official FAQ. Sources: feverup.com (founder screenshot), ticketsf1.madring.com, madring.com/en/circuit (17 Oct 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Main Straight 1B Covered Gold",
    seatType: "grandstand",
    zoneLabel:
      "Starting grid, Main Straight, and pit lane, directly overlooking the start/finish line",
    actionTags: ["start_grid", "podium_atmosphere", "pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — exact current 2027 price (EUR 989, 3-day, 1st release) from Fever's live Madring sales page (founder screenshot, 17 Oct 2026). Covered status explicitly confirmed by official ticketsf1.madring.com ('covered grandstand'), describing this section as covering the 'starting grid, main straight, pit lane.' Numbered seating confirmed via official FAQ. Sources: feverup.com (founder screenshot), ticketsf1.madring.com (17 Oct 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Main Straight 1C Covered Gold",
    seatType: "grandstand",
    zoneLabel:
      "Starting grid, Main Straight, and pit lane, directly overlooking the start/finish line",
    actionTags: ["start_grid", "podium_atmosphere", "pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — exact current 2027 price (EUR 1,275, 3-day, 3rd release) from Fever's live Madring sales page (founder screenshot, 17 Oct 2026). Covered status explicitly confirmed by official ticketsf1.madring.com ('covered grandstand'), describing this section as covering the 'starting grid, main straight, pit lane' (same text as 1B — 1A/1B/1C are adjacent sub-sections of the same Gold Main Straight stand, priced separately by release stage). Numbered seating confirmed via official FAQ. Sources: feverup.com (founder screenshot), ticketsf1.madring.com (17 Oct 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  // ─── tier4 — Hospitality ─────────────────────────────────────────────
  {
    seatName: "Champions Club 3-Day",
    seatType: "hospitality",
    zoneLabel:
      "Main Straight / Turn 3 area — top-tier 3-day hospitality with a choice of Main Straight or Straight 3 Bronze-adjacent viewing",
    actionTags: ["start_grid", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — exact current 2027 price ($4,999 base, $5,299 Section 3 Bronze variant, 3-day) from F1 Experiences' official 2027-spanish-grand-prix hospitality page (founder screenshot, 17 Oct 2026). Premium hospitality product with reserved/assigned access per F1 Experiences' standard package format. Does NOT win the tier4 prestige tiebreaker against Paddock Club — per this skill's standing rule (§6, 17 Oct 2026), Paddock Club always wins regardless of relative sourcing confidence. Sources: f1experiences.com/2027-spanish-grand-prix/champions-club (founder screenshot), f1experiences.com/2027-spanish-grand-prix/rising-stars-section-3-bronze (17 Oct 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Paddock Club",
    seatType: "hospitality",
    zoneLabel:
      "Paddock, directly above the pit lane — exact Madring-specific section not yet published",
    actionTags: ["pit_lane", "start_grid", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "LOWER confidence — no Madring-specific Paddock Club page or price exists yet. Used Barcelona-Catalunya circuit's 2026 reference price (EUR 6,999/person) for ordinal top-tier placement ONLY — different circuit, different year, not Madring-specific; to be re-verified once Madring's own Paddock Club page is published. Covered/reserved status and above-pit-lane positioning assumed from F1 Paddock Club's standard global format (consistent across every circuit this skill has researched to date — Brazilian GP, Mexico City GP, Bahrain GP, Austrian GP), not from a Madring-specific source. WINS the tier4 prestige tiebreaker against Champions Club by standing rule (§6 of this skill, founder direction 17 Oct 2026) — Paddock Club is the structurally top-tier F1 hospitality product on every circuit, independent of which seat has the stronger per-circuit sourced price. Sources: tickets GP Barcelona 2026 Paddock Club listing (reference price only), this skill's cross-event Paddock Club format pattern (17 Oct 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
];

for (const s of SEATS) {
  const result = await sql`
    INSERT INTO circuit_seating_profile
      (sporting_event_id, ticket_tier_cost_id, seat_name, seat_type, zone_label, action_tags, covered, min_age, single_day_available, reserved_seating, source_note)
    VALUES
      (${EVENT_ID}, ${s.ticketTierId}, ${s.seatName}, ${s.seatType}, ${s.zoneLabel}, ${s.actionTags}, ${s.covered}, ${s.minAge}, ${s.singleDayAvailable}, ${s.reservedSeating}, ${s.sourceNote})
    RETURNING seat_name
  `;
  console.log(`✓ ${result[0].seat_name} seeded`);
}

const rows = await sql`
  SELECT seat_name, seat_type, covered, reserved_seating, min_age, single_day_available, ticket_tier_cost_id
  FROM circuit_seating_profile
  WHERE sporting_event_id = ${EVENT_ID}
  ORDER BY seat_type, seat_name
`;
console.log("\nConfirmed state:");
console.table(rows);

await sql.end();

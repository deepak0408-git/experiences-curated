import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

// Note: DIRECT_URL times out from this machine (see feedback_db_migration.md)
// — use DATABASE_URL (transaction pooler, port 6543) instead.
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

// circuit_seating_profile seed for Miami International Autodrome (Miami GP
// 2027) — built for the Ticket Intelligence app. Full inventory: 6 named
// grandstands + Grandstand Pass + Campus Pass (GA), 5 hospitality products
// (4 standalone clubs + Paddock Club, its 4 internal venues folded into one
// row per founder direction, 28 Sep 2026). Researched 28 Sep 2026.
//
// PRIMARY SOURCE: f1miamigp.com/tickets/* (official local promoter site,
// live 2027 pricing/product pages) — this is the only channel with real,
// current per-seat detail; tickets.formula1.com/miami and f1experiences.com
// both redirect to generic/waitlist content with no per-seat breakdown.
// Cross-checked against f1miamiusa.com/en/ticket-info/* (per-stand pages,
// confirms coverage/reserved-seating wording independently) and two
// independent grandstand guides: grandprixgrandtours.com/miami-circuit-guide,
// oversteer48.com (both confirmed-reliable sources per skill's source list).
//
// Deliberately organized by SEAT (grandstand/festival-lawn/hospitality),
// not by planner_ticket_tier_cost's tier1-4 pricing rows — see that table's
// own comment for why. ticketTierCostId links back to the priced tier.
//
// Excluded from inventory, with reasons (founder-confirmed, 28 Sep 2026):
// - 8 F1 Team Grandstands ($685-$1,185, e.g. Cadillac Formula 1 Team
//   Grandstand, Atlassian Williams F1 Team Grandstand, etc.) — real,
//   separately-priced catalog SKUs, but each occupies the exact same
//   physical seat as its host grandstand (Turn 1 North, North Beach, or
//   South Beach), just team-branded. Would score identically to the host
//   stand on every rubric question — not a distinct seat.
// - Precision Drive Club — a 100-member annual membership (workshop/
//   simulator/pit-lane access, ~40 track days/year), not a per-race-weekend
//   ticket a general fan can purchase. Access-gated, same exclusion logic
//   as Interlagos's Porto Bank Grandstand in the Brazilian GP build.
//
// PRICING/COVERAGE SOURCING NOTE:
// - Coverage for Start/Finish, Turn 1 North, Turn 18, Marina, North Beach,
//   South Beach: HIGH confidence, corroborated by f1miamiusa.com's per-stand
//   pages AND oversteer48.com's independent row-by-row guide (e.g. "roof
//   directly covers the back 12 rows" for Turn 18, "back 13 rows" for
//   Marina) — coded covered:true since the roofed sections are what each
//   stand's own product page badges as its defining feature, with the
//   partial-coverage nuance kept in sourceNote.
// - MSC Yacht Club covered:true — founder-confirmed 28 Sep 2026, also
//   independently matches oversteer48.com's "Reserved, covered seating"
//   wording for the flagship Deck 2/Deck 3 tickets.
// - 72 Club coverage: founder-confirmed 28 Sep 2026 as partially covered
//   (covered:true) — no independent source stated this explicitly, so it's
//   recorded here as a founder-supplied fact, same discipline as any other
//   sourceNote entry.
// - Grandstand Pass coverage: NULL — spans 3 different physical venues
//   (Turns 1-3, 6-8, 17-19) with different coverage each, no single honest
//   covered/uncovered value applies.
// - Campus Pass (GA): uncovered, unreserved by definition (standing/roaming
//   general admission, per f1miamigp.com/tickets/campus-pass and
//   f1miamiusa.com's general-admission page).
// - singleDayAvailable: left NULL for all seats — no official source found
//   confirming or denying single-day sale (every price found was a 3-day
//   package); genuinely unconfirmed rather than assumed false.
// - linkedExperienceId: NULL for every seat — zero experiences exist yet
//   for this event (pack not yet built as of this research pass).
//
// PRESTIGE/STAR-OVERRIDE COLLISION CHECK (skill §6, run 28 Sep 2026):
// "Paddock Club" already exists as a global key in both PRESTIGE_SEAT_NAMES
// (scoreSeats.ts) and STAR_OVERRIDE_BY_SEAT_NAME (FullResult.tsx, 5-star),
// inherited from a prior event. This is a BENEFICIAL collision for Miami —
// Miami's own Paddock Club (folded, $13,500-$16,500) is also intended to be
// its own 5-star outlier per founder direction, so no code change is
// needed; it will correctly inherit the existing global entry. No other
// Miami seat name collides with either map.

const EVENT_ID = "048d7693-b616-4747-ab3c-49b3de61a025"; // Miami GP 2027

// tier1-4 planner_ticket_tier_cost row IDs for this event, looked up by tier.
const tierRows = await sql`
  SELECT id, tier FROM planner_ticket_tier_cost WHERE sporting_event_id = ${EVENT_ID}
`;
const tierIdByKey = Object.fromEntries(tierRows.map((r) => [r.tier, r.id]));
for (const t of ["tier1", "tier2", "tier3", "tier4"]) {
  if (!tierIdByKey[t]) throw new Error(`Missing expected ${t} row for event ${EVENT_ID} — aborting.`);
}

const SEATS = [
  // ─── tier1 ($650 seeded) ─────────────────────────────────────────
  {
    seatName: "Campus Pass (GA)",
    seatType: "festival_lawn",
    // zoneLabel updated 28 Sep 2026 — original version named no specific
    // turns (too vague for "what it shows" on the result page). Turn
    // numbers sourced to oversteer48.com, an independent confirmed-
    // reliable source; official promoter pages name no specific turns.
    zoneLabel: "Multiple fan-zone viewing decks, including Turns 5, 8-11, 11-12, and Hard Rock Stadium 300-level views of Turns 4-5 and 17-18",
    actionTags: [],
    covered: false,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: false,
    sourceNote:
      "HIGH confidence — matches seeded tier1 ($650) directly. General admission, no assigned seat, 8 campus zones with 360-degree viewing decks. Official sources (f1miamigp.com/tickets/campus-pass, f1miamiusa.com/en/ticket-info/general-admission-campus-pass) confirm Team Village views, Fan Zone, 100+ F&B, but name no specific turns. Turn-specific detail sourced to oversteer48.com/campus-pass-f1-miami-general-admission (independent, confirmed-reliable source): GA viewing platforms run the flat-out straight between Turns 8-11, plus individual spots at Turn 5, Turn 10, and Turns 11-12 (described as probably one of the best general admission viewing points at the circuit) — and Hard Rock Stadium 300 level offers views of the Start/Finish straight, Turns 4-5, and Turns 17-18. Uncovered/standing by definition (28 Sep 2026).",
    ticketTierId: tierIdByKey.tier1,
  },
  // ─── tier2 ($700-$845 seeded) ─────────────────────────────────────────
  {
    seatName: "Marina Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turns 6-8, Marina (presented by MSC Cruises)",
    actionTags: ["technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — matches seeded tier2 range directly ($730). Roof directly covers the back ~13 rows (rows 14+ shaded); lower rows and stand sides are exposed. Reserved seat, assigned automatically. Views drivers navigating Turns 6-8 onto the South straightaway. Sources: f1miamigp.com/tickets/grandstands, f1miamiusa.com/en/ticket-info/grandstand-marina-1, oversteer48.com/marina-grandstand-miami-f1 (28 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "North Beach Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turns 11-12, Beach",
    actionTags: ["overtaking", "high_speed"],
    covered: true,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — matches seeded tier2 range directly ($695). Roof covers roughly the top 12 rows (rows 18+); bleacher-style bench seating, no cupholders/backrests except top row. Reserved seat, assigned automatically. Views cars entering the braking zone at Turn 11 and accelerating through Turn 12. Sources: f1miamigp.com/tickets/grandstands, f1miamiusa.com/en/ticket-info/grandstand-north-beach, oversteer48.com/beach-grandstand-miami-f1 (28 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "South Beach Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turns 11-12, Beach (presented by Verizon)",
    actionTags: ["overtaking", "high_speed"],
    covered: true,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — matches seeded tier2 range directly ($700). Roof covers roughly the top 15 rows; bleacher-style bench seating, no cupholders/backrests except top row. Reserved seat, assigned automatically. Same view zone as North Beach — Turn 11 braking zone into Turn 12. Sources: f1miamigp.com/tickets/grandstands, f1miamiusa.com/en/ticket-info/grandstand-south-beach + grandstand-south-beach-covered, oversteer48.com/beach-grandstand-miami-f1 (28 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Grandstand Pass",
    seatType: "grandstand",
    zoneLabel: "Rotates across Turns 1-3, 6-8, and 17-19 (three separate venues)",
    actionTags: ["overtaking", "technical_corner", "high_speed"],
    covered: null,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — matches seeded tier2 range directly ($845). Grants access to three different grandstand areas across the weekend (Turn 1, Marina, Turn 18 zones). Coverage left NULL — spans 3 physically different venues with different coverage each, no single honest value applies. Reserved seat within each visited section. Source: f1miamigp.com/tickets/grandstands (28 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  // ─── tier3 ($935-$1,125 seeded) ─────────────────────────────────────────
  {
    seatName: "Start/Finish Grandstand",
    seatType: "grandstand",
    zoneLabel: "Pit lane and starting grid, North Campus (presented by Gainbridge)",
    actionTags: ["start_grid", "pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — matches seeded tier3 range directly ($1,125). Top rows covered. Reserved seat, assigned automatically (group orders seated together). Prime view of pit lane, starting grid, Start/Finish straight, standing-start lights-out moment; TV screen, fan zone, F&B, fan shop included. Sources: f1miamigp.com/tickets/grandstands, f1miamiusa.com/en/ticket-info/grandstand-start-and-finish (28 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Turn 1 North Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turns 1-3, North Campus (presented by Cadillac)",
    actionTags: ["overtaking", "high_speed", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — matches seeded tier3 range directly ($945). Top rows covered. Reserved seat, assigned automatically. Views cars accelerating into Turn 1 off the main straight, then through Turns 2-3; TV screen, fan zone, F&B, fan shop included. Sources: f1miamigp.com/tickets/grandstands, f1miamiusa.com/en/ticket-info/grandstand-turn-1-2 (28 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Turn 18 Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turns 17-19, West Campus",
    actionTags: ["overtaking", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — matches seeded tier3 range directly ($935). Roof covers roughly the back 12 rows; rows below are exposed. Reserved seat, assigned automatically. Second-to-last corner, second fastest straightaway in F1; sightlines to the final track section and pit lane entry. Sources: f1miamigp.com/tickets/grandstands, f1miamiusa.com/en/ticket-info/grandstand-turn-18, oversteer48.com/miami-f1-turn-18 (28 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  // ─── tier4 ($4,250-$16,500 seeded) ─────────────────────────────────────
  {
    seatName: "MSC Yacht Club",
    seatType: "hospitality",
    // zoneLabel updated 28 Sep 2026 — original version omitted the fact
    // that this is literally a yacht-inspired structure (founder-flagged
    // live), which is the single most distinctive, real fact about this
    // seat and belongs in "what it shows," not folded into "why this fits
    // you" (that field is a scoring-tiebreaker mechanism — see
    // scoreSeats.ts — and this seat has no genuine action-tag tie with
    // another hospitality seat to break).
    zoneLabel: "A 5-level yacht-inspired structure in the Marina, overlooking Turns 5-9",
    actionTags: ["technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — matches seeded tier4 range directly ($4,250). Covered — founder-confirmed 28 Sep 2026, independently corroborated by oversteer48.com describing the flagship Deck 2/3 tickets as 'Reserved, covered seating.' Multi-level (5-deck) superyacht-inspired structure, panoramic views of Turns 5-9, on-board dining and all-inclusive beer/wine/sparkling. Sources: f1miamigp.com/tickets/hospitality, oversteer48.com/miami-f1-hospitality-yacht-club-paddock-club (28 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "72 Club",
    seatType: "hospitality",
    zoneLabel: "Stadium, Turns 3-4 and Podium",
    actionTags: ["podium_atmosphere", "start_grid"],
    covered: true,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence on price — matches seeded tier4 range directly ($8,000). Founder-confirmed 28 Sep 2026: partially covered. Podium-adjacent location, gourmet dining, views of Turns 3-4 and the podium celebrations. Sources: f1miamigp.com/tickets/hospitality (28 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Turn 18 Club",
    seatType: "hospitality",
    zoneLabel: "Turns 17-19, West Campus (presented by Ticketmaster)",
    actionTags: ["overtaking", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — matches seeded tier4 range directly ($3,800). Private sub-areas under the grandstand's canopy roof (climate/weather protection), each with seating and a TV; small waist-height fencing between areas rather than full walls. Expansive track views of Turns 17-19. Sources: f1miamigp.com/tickets/hospitality, oversteer48.com/miami-f1-hospitality-yacht-club-paddock-club (28 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Hard Rock Beach Club Deck",
    seatType: "hospitality",
    zoneLabel: "Beach, Turns 11-14",
    actionTags: ["overtaking", "podium_atmosphere"],
    covered: false,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: false,
    sourceNote:
      "HIGH confidence on price/location — real seeded value ($1,500) sits below tier4's founder-confirmed $4,250-$16,500 band by design (see planner_ticket_tier_cost seed script header). Open-air trackside day club — pools, huge videoboard, daybeds (individually reservable, but general venue access is not assigned seating), live music/concerts. Views Turns 11-14. Sources: f1miamigp.com/tickets/hospitality, oversteer48.com/miami-f1-hospitality-yacht-club-paddock-club (28 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Paddock Club",
    seatType: "hospitality",
    zoneLabel: "Above the pits, Start/Finish through Turn 1",
    actionTags: ["start_grid", "pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — matches seeded tier4 range directly ($13,500-$16,500 across its 4 internal venues, folded into one seat per founder direction 28 Sep 2026: Casa Tua Trackside Club $16,500, The Rooftop Club $15,750, MIA Club $15,750, Private Suites $13,500). Climate-controlled indoor spaces plus shared open-air viewing balconies; MIA Club and Private Suites offer reserved individual seating, Casa Tua/Rooftop Club are access-controlled shared communal areas. Premium trackside views from the starting grid through Turn 1, all-inclusive F&B, pit lane walks, track tours. New for 2027: expanded to over 9,000 guests / 305,000 sq ft. Star-override note: 'Paddock Club' is an existing global PRESTIGE_SEAT_NAMES/STAR_OVERRIDE_BY_SEAT_NAME key (5-star) inherited from a prior event — confirmed beneficial collision, no code change needed (see header). Sources: f1miamigp.com/tickets/luxury/paddock-club, f1miamigp.com/general/2027-paddock, motorsport.com/f1/news/f1-miami-gp-announces-major-paddock-club-expansion-for-2027 (28 Sep 2026).",
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

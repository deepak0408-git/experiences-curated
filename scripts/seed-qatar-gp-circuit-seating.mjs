import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

// Note: DIRECT_URL times out from this machine (see feedback_db_migration.md)
// — use DATABASE_URL (transaction pooler, port 6543) instead.
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

// circuit_seating_profile seed for Lusail International Circuit (Qatar GP
// 2026) — built for the Ticket Intelligence app ($10 standalone, "which
// seat fits your preferences" decision tool). Built via the
// ticket-intelligence-researcher skill (see
// C:\Users\HP\.claude\skills\ticket-intelligence-researcher\SKILL.md).
// Researched 27 Sep 2026.
//
// UNUSUALLY WELL-DOCUMENTED START POINT: this event already had a
// curator-reviewed TicketsSpoke.tsx, MapSpoke.tsx, and 5 dedicated
// ticket/grandstand experience write-ups (General Admission — Lusail Hill,
// Lusail Hill Lounge, Main Grandstand, North Grandstand, Paddock Club &
// Champions Club) plus a general "Where to Sit — Grandstand & Ticket Guide"
// experience. Those sources supplied most of this seed directly.
//
// GAP FOUND (same class as the Brazilian GP pilot incident, skill §1): the
// existing planner_ticket_tier_cost (4 rows) and TicketsSpoke.tsx's
// TIER_META list only reflected 7 of the real 10 seats. T2 Grandstand and
// T3 Grandstand exist as genuinely separate stands (MapSpoke.tsx's own copy
// names them — "T2 and T3 Grandstands cover the tight middle-sector
// chicane" — but neither ever made it into the tier table or TicketsSpoke).
// The event's own "Where to Sit" experience DOES correctly name all three
// (T2, T3, T16) as one shared QAR 1,000 (~US$274) mid-tier band — that's
// the pricing basis used here. Also found: "Premiere Hospitality" is a
// genuinely separate, lower-priced hospitality product from Champions Club
// (same building, per official lusail.gp/hospitality.lcsc.qa pages and
// grandprixgrandtours.com/marhaba.qa/thepeninsulaqatar.com coverage), not
// merely the building Champions Club sits inside as MapSpoke.tsx's own copy
// implies — confirmed via 2+ independent sources it is its own bookable
// package (~US$4,300 / £3,449, 3-day).
//
// Real inventory — 10 seats total (vs. 7 previously reflected):
// GA Lusail Hill, North Grandstand, T2 Grandstand, T3 Grandstand, T16
// Grandstand, Main Grandstand, Lusail Hill Lounge, Champions Club, Premiere
// Hospitality, Paddock Club. No seats excluded — this circuit's structure
// doesn't have an access-gated/bank-branded product like Interlagos's Porto
// Bank Grandstand.
//
// ORDINAL TIER MAPPING (§3 — never a new planner_ticket_tier_cost row just
// for this, ordinal placement only): T2/T3/T16 slot into tier2 alongside
// North Grandstand's QAR 1,500/US$411 (tier2's existing event_tier_label is
// "T16 Grandstand, 3-day" already — T2/T3 simply weren't added when that row
// was seeded). Premiere Hospitality slots into tier4 alongside Lusail Hill
// Lounge and Champions Club — its real ~US$4,300 price sits between Lusail
// Hill Lounge (~US$4,300, same ballpark) and Champions Club (US$4,599),
// well inside tier4's existing US$3,896-7,093 band, so no widening needed.
//
// COVERED: Main Grandstand — partial (back half only, per its own
// experience + TicketsSpoke.tsx). North/T2/T3/T16 — all uncovered
// (confirmed independently for each via oversteer48.com's dedicated pages).
// GA Lusail Hill — uncovered (own experience copy: "No reserved seat, no
// shade structure"). Lusail Hill Lounge — partial (shade structures, not
// fully enclosed, per own experience). Champions Club and Paddock Club —
// fully covered (hospitality tier standard, corroborated on
// hospitality.lcsc.qa). Premiere Hospitality — fully covered/climate-
// controlled indoor seating (own official page: "Lower Level... climate-
// controlled indoor seating").
//
// RESERVED SEATING: Main Grandstand is the ONLY reserved/assigned seat at
// this circuit (zone A-F, row 1-14 system) — every other grandstand
// (North, T2, T3, T16) and GA is explicitly first-come/unreserved per its
// own sourced copy. All 4 hospitality products are reserved (suite/table
// seating, standard for F1 hospitality).
//
// SINGLE-DAY AVAILABILITY: every source (Ticket Guide experience,
// TicketsSpoke.tsx, official hospitality pages) prices every tier only in
// 3-day terms — no single-day option surfaced anywhere despite explicit
// checking. singleDayAvailable: false across all 10 seats (a genuine "no"
// from consistent omission, not a guess).
//
// MIN AGE: no published age restriction found for any seat despite
// searching (the only age-related fact found — children under 12 free,
// up to 6 per adult — is a family-inclusion policy, not a minimum-age
// restriction on a specific seat, so it isn't recorded here). Left null
// throughout.
//
// linkedExperienceId populated for GA Lusail Hill, Lusail Hill Lounge,
// Main Grandstand, North Grandstand, and Paddock Club (folded together with
// Champions Club's write-up, since that experience genuinely covers both
// by name) — this event has an unusually complete set of dedicated
// write-ups (skill §2.5). T2, T3, T16, and Premiere Hospitality have no
// dedicated write-up and fall back automatically to the general "Where to
// Sit — Grandstand & Ticket Guide" experience via
// getFallbackTicketExperienceSlug's title-pattern match.
//
// PRESTIGE-TIEBREAKER CHECK (§6): Champions Club and Paddock Club share
// near-identical actionTags (pit_lane, podium_atmosphere) within tier4 and
// could tie on every quiz question. Paddock Club is the real, sourced price
// outlier (US$7,599 vs. Champions Club's US$4,599, and the only one of the
// 4 hospitality seats confirmed sold out as of Sep 2026) — it already
// inherits the GLOBAL "Paddock Club" 5-star override in
// PRESTIGE_SEAT_NAMES/STAR_OVERRIDE_BY_SEAT_NAME from the Brazilian GP
// build (same known (seatName)-only-keying gap flagged on every event
// since Mexico City GP, 27 Sep 2026 — see project_las_vegas_gp_ticket_
// intelligence.md and project_mexico_city_gp_ticket_intelligence.md for
// prior instances of this same collision). Directionally correct here too
// — Paddock Club really is Qatar's real top-price outlier — so no map
// changes made, consistent with the founder's prior "accept as-is"
// decisions on Mexico City and Las Vegas.

const EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899"; // Qatar Grand Prix 2026

// Real experience IDs for the seats with their own dedicated write-up
// (queried 27 Sep 2026).
const EXP = {
  gaLusailHill: "d08d93fc-b017-42dc-8106-efca573f69c1", // qatar-gp-lusail-hill-general-admission-mtzc059v
  lusailHillLounge: "c84fa5f9-4e60-4eb4-ab42-b8f03ceddae5", // qatar-gp-lusail-hill-lounge-mtymm3gw
  mainGrandstand: "0c54551a-a1e8-4f9a-aa13-df95ed86fbb7", // qatar-gp-main-grandstand-mtymn305
  northGrandstand: "921d9090-6e37-475d-8f37-1417062d52fa", // qatar-gp-north-grandstand-mtymo0an
  paddockChampions: "a825c4f5-87d4-4674-b683-f035fdc654fc", // qatar-gp-paddock-champions-club-mtymkynt
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
  // ─── tier1 (QAR 600 / ~US$165, 3-day) ───────────────────────────────
  {
    seatName: "General Admission — Lusail Hill",
    seatType: "festival_lawn",
    zoneLabel: "Turn 1 — elevated grass banking above the gravel trap",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: false,
    linkedExperienceId: EXP.gaLusailHill,
    sourceNote:
      "HIGH confidence — this event's own dedicated \"General Admission — Lusail Hill\" experience write-up. Elevated grass banking above the Turn 1 gravel trap, sightline running almost the length of the front straight, no reserved seat, no shade, first-come. Cheapest ticket at the event (QAR 600 / ~US$165 per the event's own Ticket Guide experience) and, per the same source, sold out for 2026. Also includes Fan Zone, food court, and post-race concert access. Sources: qatar-gp-lusail-hill-general-admission experience, qatar-gp-ticket-guide experience (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier1,
  },
  // ─── tier2 (QAR 1,000-1,500 / ~US$274-411, 3-day) ───────────────────
  {
    seatName: "North Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turn 1 braking zone, opposite the pit lane exit",
    actionTags: ["overtaking", "start_grid"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: false,
    linkedExperienceId: EXP.northGrandstand,
    sourceNote:
      "HIGH confidence — this event's own dedicated \"North Grandstand\" experience write-up. Turn 1 braking-zone view (partially obstructed past the apex by an inside building), 8 sections, unreserved/first-come, uncovered. QAR 1,500 (~US$411 per the event's own Ticket Guide experience). Every ticket also includes Lusail Hill GA access. Sources: qatar-gp-north-grandstand experience, qatar-gp-ticket-guide experience (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "T2 Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turn 2 — entry and exit, partial view of Turns 1 and 3",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: false,
    sourceNote:
      "HIGH confidence, 2 independent sources — oversteer48.com's dedicated T2 Grandstand page confirms unreserved/open seating (\"no reserved seat selection available\"), individual plastic chairs, uncovered stand, partial Turns 1/3 visibility depending on seat position. Priced with T3/T16 as a shared mid-tier band (QAR 1,000 / ~US$274, 3-day) per the event's own Ticket Guide experience — this stand was NOT previously reflected in planner_ticket_tier_cost or TicketsSpoke.tsx despite being real and currently sold (skill §1 gap). No dedicated experience write-up — falls back to the general Ticket Guide. Sources: oversteer48.com/t2-grandstand-qatar-review-guide, qatar-gp-ticket-guide experience, app/event-pack/[slug]/_hub-and-spoke/spokes/qatar-grand-prix/MapSpoke.tsx (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "T3 Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turn 3 — right-hander, view back to Turn 2",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: false,
    sourceNote:
      "HIGH confidence, 2 independent sources — oversteer48.com's dedicated T3 Grandstand page confirms unreserved seating, individual plastic chairs, uncovered stand, a flat-out right-hander view with a glimpse of Turn 1 from the top row. Priced with T2/T16 as a shared mid-tier band (QAR 1,000 / ~US$274, 3-day) per the event's own Ticket Guide experience — same skill §1 gap as T2 (not previously in planner_ticket_tier_cost or TicketsSpoke.tsx despite being real and currently sold). No dedicated experience write-up — falls back to the general Ticket Guide. Sources: oversteer48.com/t3-grandstand-qatar, qatar-gp-ticket-guide experience, app/event-pack/[slug]/_hub-and-spoke/spokes/qatar-grand-prix/MapSpoke.tsx (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "T16 Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turn 16 — final corner onto the main straight",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: false,
    sourceNote:
      "HIGH confidence, 2 independent sources — oversteer48.com's dedicated T16 Grandstand page confirms unreserved/first-come seating, individual plastic chairs, uncovered stand, and explicitly notes little overtaking actually happens at this corner (a genuine limitation, not omitted). Left-side seats see down the main straight toward Turn 1/pit lane. QAR 1,000 (~US$274, 3-day) per the event's own Ticket Guide experience and TicketsSpoke.tsx's existing TIER_META. No dedicated experience write-up — falls back to the general Ticket Guide. Sources: oversteer48.com/t16-grandstand-qatar-lusail, qatar-gp-ticket-guide experience, app/event-pack/[slug]/_hub-and-spoke/spokes/qatar-grand-prix/TicketsSpoke.tsx (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  // ─── tier3 (QAR 2,000 / ~US$548-659, 3-day) ─────────────────────────
  {
    seatName: "Main Grandstand",
    seatType: "grandstand",
    zoneLabel: "Front straight, opposite the pits — zones A-F, rows 1-14",
    actionTags: ["start_grid", "pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.mainGrandstand,
    sourceNote:
      "HIGH confidence — this event's own dedicated \"Main Grandstand\" experience write-up. The ONLY assigned-seating stand at Lusail (zone/row/seat named on the ticket) — 6 zones (A-F, 4 sections each), rows 1-14. Zone A closest to finish line/podium; Zones D/E angle toward Turn 1 braking; higher rows (10+) see into the pit boxes. Partial cover (back half of stand only). Individual plastic chairs, renovated 2023. QAR 2,000 (~US$548-659, the most expensive standard grandstand ticket) per the event's own Ticket Guide experience. Sources: qatar-gp-main-grandstand experience, qatar-gp-ticket-guide experience, app/event-pack/[slug]/_hub-and-spoke/spokes/qatar-grand-prix/TicketsSpoke.tsx (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  // ─── tier4 (US$3,896-7,093, 3-day — hospitality) ────────────────────
  {
    seatName: "Lusail Hill Lounge",
    seatType: "hospitality",
    zoneLabel: "Turn 1 — same elevated ground as GA Lusail Hill",
    actionTags: ["overtaking", "podium_atmosphere"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.lusailHillLounge,
    sourceNote:
      "HIGH confidence — this event's own dedicated \"Lusail Hill Lounge\" experience write-up. Fenced tiered open-air terrace on the same elevated Turn 1 ground as the free GA area — day lounges, tables/chairs, cabana seating, gourmet street-food bar, free-flowing premium open bar, curated local cultural activations. Partial cover only (shade structures, not fully enclosed) — the least-covered of the 4 hospitality products. Three-day packages ~US$4,300 (£3,449) per the event's own experience write-up. Sources: qatar-gp-lusail-hill-lounge experience (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Champions Club",
    seatType: "hospitality",
    zoneLabel: "Turn 1 exterior — Premiere Hospitality building",
    actionTags: ["pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.paddockChampions,
    sourceNote:
      "HIGH confidence — this event's own \"Paddock Club & Champions Club\" experience write-up plus official lusail.gp/hospitality.lcsc.qa listing. Located inside the Premiere Hospitality building, outside Turn 1 — guided F1 paddock tour, championship trophy photo opportunity on the starting grid, rotating driver/executive/media-personality appearances, canapés/light bites stepping up to fuller dinner service, open bar. Fully covered. Three-day packages US$4,599 (official hospitality.lcsc.qa listing, corroborated via marhaba.qa and thepeninsulaqatar.com announcement coverage). Sources: qatar-gp-paddock-champions-club experience, hospitality.lcsc.qa/2026-f1-qatar-grand-prix/f1-experiences-champions-club-3-days, marhaba.qa Lusail hospitality launch announcement (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Premiere Hospitality",
    seatType: "hospitality",
    zoneLabel: "Main straight, Turn 1 end — Premiere Hospitality building, lower level",
    actionTags: ["start_grid", "overtaking"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 2 independent sources (official lusail.gp page redirect content corroborated by grandprixgrandtours.com's dedicated coverage) — a genuinely SEPARATE, lower-priced hospitality product from Champions Club, not merely \"the building Champions Club sits in\" as this event's own MapSpoke.tsx copy implies (flagged as a content-accuracy gap, out of scope to fix in this pass). Lower Level of the Premiere Hospitality building at the Turn 1 end of the main straight — climate-controlled indoor seating plus an outdoor terrace with attached trackside grandstand seating, curated interactive food stations, open bar, live DJ entertainment, post-race concert access. Three-day packages ~US$4,300 (£3,449). No dedicated experience write-up — falls back to the general Ticket Guide. Sources: grandprixgrandtours.com Lusail hospitality coverage, lusail.gp/en/ticket-info/premiere-hospitality (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Paddock Club",
    seatType: "hospitality",
    zoneLabel: "Directly above the team garages, facing the start/finish line",
    actionTags: ["pit_lane", "start_grid"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.paddockChampions,
    sourceNote:
      "HIGH confidence — this event's own \"Paddock Club & Champions Club\" experience write-up. Brand-new building directly above the team garages, looking down pit lane to the start-finish line. Guided pit lane walkabouts, gourmet chef-designed lunch with live cooking stations, all-day open bar. Three-day packages from US$7,599 — the most expensive product at this event — and, per the same source, sold out as of Sep 2026. The real, sourced price outlier within tier4 (US$7,599 vs. Champions Club's US$4,599 and Premiere Hospitality/Lusail Hill Lounge's ~US$4,300) — see prestige-tiebreaker note in script header; already inherits the global PRESTIGE_SEAT_NAMES/STAR_OVERRIDE_BY_SEAT_NAME 5-star treatment from prior events, directionally correct here too. Sources: qatar-gp-paddock-champions-club experience, app/event-pack/[slug]/_hub-and-spoke/spokes/qatar-grand-prix/TicketsSpoke.tsx (27 Sep 2026).",
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
console.log(`\nTotal seats seeded: ${rows.length}`);

await sql.end();

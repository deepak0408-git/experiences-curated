import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

// circuit_seating_profile seed for Circuit de Monaco (Monaco Grand Prix
// 2027) — built for the Ticket Intelligence app ($10 standalone, "which
// seat fits you" decision tool). Full inventory: 4 GA/budget stands
// (Secteur Rocher, Zone Z1, Grandstand X1, Grandstand X2), 9 standard/mid
// grandstands (N, O, P, L, T, V, K base+K3-K6), 4 premium grandstands
// (K1/K2 Gold, E, A, B), 4 hospitality products (Bronze/Silver/Gold VIP
// Terraces, Caravelles Grand Terrace, VIP Yacht Experience, F1 Paddock
// Club/Champions Club). Researched 30 Sep 2026.
//
// PRICING/TIER-LINK STATUS: planner_ticket_tier_cost was seeded with 4
// PLACEHOLDER rows (0.00-0.00 cost, see seed-monaco-gp-ticket-tiers.mjs) so
// ticketTierCostId can link to real row IDs now, ahead of real pricing.
// 2027 official Monaco ticketing is genuinely unpublished anywhere as of
// this seed (confirmed directly against ticketing.formula1.com/monaco/,
// gpticketshop.com/en/f1/monaco-f1-grand-prix/tickets.html, and a
// freshly-generated 30 Sep 2026 gpticketshop.com PDF price list that shows
// every stand on the circuit map but no prices at all). Per founder
// instruction (30 Sep 2026): the 4 tier rows are 0.00-0.00 placeholders
// only — never real pricing, never displayed to a fan — and must be
// overwritten with real, sourced cost_low/cost_high figures (via the same
// ON CONFLICT upsert in seed-monaco-gp-ticket-tiers.mjs) before this
// event's Ticket Intelligence page is launch-ready. The founder-approved
// qualitative tier (1-5 star, collapsed to tier1-tier4: 1*=tier1, 2*=tier2,
// 3*=tier3, 4*+5*=tier4) is what actually decided each seat's
// ticketTierCostId below, and is also recorded in each row's sourceNote.
//
// SOURCING: cross-checked across F1's official Monaco ticketing site
// (tickets.formula1.com/monaco, f1monaco.com/en/tickets — the actual local
// promoter/official ticketing operator), monaco-tribune.com (2026-edition
// per-stand pricing, local Monaco publication), oversteer48.com (per-stand
// physical detail: coverage, seating type, corner — HIGH confidence,
// dedicated page per stand), fanamp.com, and grandprixgrandtours.com
// (LOWER confidence, generic corner-name descriptions only, not used for
// stand-specific facts). motorsporttickets.com appeared in search results
// and was NOT used, per the permanent CLAUDE.md exclusion.
//
// Covered status for Bronze/Silver/Gold VIP Terraces (partially covered),
// Caravelles Grand Terrace (uncovered/open-air), VIP Yacht Experience
// (partially covered), and Zone Z1 (uncovered) — all four founder-confirmed
// directly, 30 Sep 2026, no independent web source found for hospitality
// coverage detail.
//
// KNOWN GAPS, not guessed: minAge is NULL across every seat (no age
// restriction found anywhere in research, including for hospitality
// products — Monaco's Paddock Club/Champions Club pages did not state one).
// singleDayAvailable is NULL for Grandstand X1, X2, E, and all 4 hospitality
// products (no source confirmed either way) — every other grandstand is
// confirmed 3-day-only per f1monaco.com, GA (Rocher/Z1) confirmed to sell
// single days per monaco-tribune.com's per-day pricing.
//
// PRESTIGE/TIEBREAKER CHECK (skill §6): F1 Paddock Club and Champions Club
// share tier4/5-star and near-identical actionTags with the 3 VIP terrace
// products — flagging as a case to revisit once real pricing exists and a
// genuine sourced outlier (if any) can be identified. Not added to
// PRESTIGE_SEAT_NAMES yet since no real price differentiation is sourced.

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const EVENT_ID = "14a2fa08-14f4-406d-a6df-5d00ad7998a6"; // Monaco Grand Prix 2027
const EDITION_YEAR = 2027;

const tierRows = await sql`
  SELECT id, tier FROM planner_ticket_tier_cost
  WHERE sporting_event_id = ${EVENT_ID} AND edition_year = ${EDITION_YEAR}
`;
const tierIdByKey = Object.fromEntries(tierRows.map((r) => [r.tier, r.id]));
for (const key of ["tier1", "tier2", "tier3", "tier4"]) {
  if (!tierIdByKey[key]) {
    console.error(`FATAL: missing planner_ticket_tier_cost row for ${key} — run seed-monaco-gp-ticket-tiers.mjs first.`);
    process.exit(1);
  }
}

const SEATS = [
  // ---- Tier 1 (1-star): GA / budget ----
  {
    seatName: "Secteur Rocher",
    seatType: "festival_lawn",
    zoneLabel: "Le Rocher hill, overlooking harbour / La Rascasse / pit entry",
    actionTags: ["podium_atmosphere", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: false,
    tier: "tier1",
    sourceNote:
      "TIER: tier1 (1-star, GA). Standing/GA hillside viewing area, unreserved. Priced separately by day (€45 Fri / €75 Sat / €130 Sun, 2026 edition) per monaco-tribune.com — cheapest confirmed option on the circuit. Source: monaco-tribune.com/en/2026/02/monaco-grand-prix-2026-best-viewing-spots-ticket-prices-and-insider-tips/",
  },
  {
    seatName: "Zone Z",
    seatType: "festival_lawn",
    zoneLabel: "Standing zone between Nouvelle Chicane and Tabac corner",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: false,
    tier: "tier1",
    sourceNote:
      "TIER: tier1 (1-star, GA). Renamed from 'Zone Z1' to 'Zone Z' per founder correction 30 Sep 2026, confirmed against the official 2027 ACM circuit map (acm.mc), which lists it as 'Z' under Zones debout/Standing areas, Avenue J-F. Kennedy. Standing/GA trackside zone, unreserved. Priced separately by day (€65 Fri / €110 Sat, 2026 edition) per monaco-tribune.com — note monaco-tribune.com's own naming ('Zone Z1') is now superseded by the official map. Covered status (uncovered) founder-confirmed 30 Sep 2026 — no independent web source found stating this explicitly. Sources: monaco-tribune.com/en/2026/02/monaco-grand-prix-2026-best-viewing-spots-ticket-prices-and-insider-tips/, official 2027 ACM circuit map (acm.mc).",
  },
  {
    seatName: "Grandstand X1",
    seatType: "grandstand",
    zoneLabel: "Start/finish straight, between Turn 19 (Anthony Noghès) exit and the line",
    actionTags: ["start_grid", "podium_atmosphere"],
    covered: false,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: true,
    tier: "tier1",
    sourceNote:
      "TIER: tier1 (1-star). Sourced as 'the cheapest stand at the circuit' (~100 seats, no TV screen) — small, budget-tier reserved bench seating. Uncovered, reserved (bench-space only, no individual seats). Source: oversteer48.com/grandstand-x1-monaco-grand-prix/",
  },
  {
    seatName: "Grandstand X2",
    seatType: "grandstand",
    zoneLabel: "Start/finish straight",
    actionTags: ["start_grid"],
    covered: false,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: true,
    tier: "tier1",
    sourceNote:
      "TIER: tier1 (1-star). Sourced as 'one of the cheapest Monaco grandstands.' Uncovered (some afternoon shade from an adjacent building), reserved bench-space seating. View of the straight only, no pit lane or Turn 19 exit visibility. Source: oversteer48.com/grandstand-x2-monaco-grand-prix/",
  },

  // ---- Tier 2 (2-star): standard/mid grandstands ----
  {
    seatName: "Grandstand N",
    seatType: "grandstand",
    zoneLabel: "Piscine section, harbour pier, exit of Turns 13/14",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    tier: "tier2",
    sourceNote:
      "TIER: tier2 (2-star). Built on a pier over the harbour, accessible via walkways/boat. Uncovered, reserved bench-space seating. 3-day ticket only (f1monaco.com feature list). No individually-verified 2027 or reliable 2026 price found — grouped with O/P on both ticketgrandprix.com and gpticketshop.com listings, used for ordinal placement only. Source: oversteer48.com/grandstand-n-monaco-grand-prix/, f1monaco.com/en/ticket-info/grandstand-n-3",
  },
  {
    seatName: "Grandstand O",
    seatType: "grandstand",
    zoneLabel: "Piscine section, centre of Port Hercule",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    tier: "tier2",
    sourceNote:
      "TIER: tier2 (2-star). Piscine chicane view, harbour-central position. Uncovered, reserved bench-space seating. 3-day ticket only. No individually-verified price — grouped with N/P on multiple listings, used for ordinal placement only. Source: oversteer48.com/grandstand-o-monaco-grand-prix/",
  },
  {
    seatName: "Grandstand P",
    seatType: "grandstand",
    zoneLabel: "Piscine section, Tabac exit through Turn 15/16 chicane",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    tier: "tier2",
    sourceNote:
      "TIER: tier2 (2-star). Views Turn 13/14 chicane exit, short straight, and Turn 15/16 chicane. Uncovered, reserved bench-space seating (west-facing, direct afternoon sun). 3-day ticket only. Source: oversteer48.com/grandstand-p-monaco-grand-prix/",
  },
  {
    seatName: "Grandstand L",
    seatType: "grandstand",
    zoneLabel: "Piscine chicane, near Turns 15/16",
    actionTags: ["technical_corner", "pit_lane"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    tier: "tier2",
    sourceNote:
      "TIER: tier2 (2-star). Backs onto the Piscine section with a view of the adjacent pit lane. Uncovered for standard rows (bench, no backrest); only the Gold top row (individual seats) and VIP terrace area are covered. Priced £150 Fri / £300-550 Sat / £700-1,050 Sun (2026 edition). Sources: oversteer48.com/grandstand-l-monaco-grand-prix-guide/, monaco-tribune.com/en/2026/02/monaco-grand-prix-2026-best-viewing-spots-ticket-prices-and-insider-tips/",
  },
  {
    seatName: "Grandstand T",
    seatType: "grandstand",
    zoneLabel: "Opposite the pits, between Piscine and La Rascasse",
    actionTags: ["pit_lane", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    tier: "tier2",
    sourceNote:
      "TIER: tier2 (2-star). Direct view of pit lane and Swimming Pool complex. The ONLY Monaco grandstand with real roof coverage — top 4-5 rows of each section are sheltered, lower rows uncovered. Reserved seating. Priced £150 Fri / £300-550 Sat / £700-1,050 Sun (2026 edition, same band as L). Sources: oversteer48.com/grandstand-t-monaco-grand-prix/, monaco-tribune.com/en/2026/02/monaco-grand-prix-2026-best-viewing-spots-ticket-prices-and-insider-tips/",
  },
  {
    seatName: "Grandstand V",
    seatType: "grandstand",
    zoneLabel: "La Rascasse / Anthony Noghès, final corner before start-finish",
    actionTags: ["technical_corner", "overtaking"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    tier: "tier2",
    sourceNote:
      "TIER: tier2 (2-star). Last corner before the pit straight. Uncovered — offers both Gold (individual seat base) and standard bench reserved seating. Priced £150 Fri / £400-550 Sat / £950-1,050 Sun (2026 edition) — slightly ahead of L/T on race day. Sources: oversteer48.com/grandstand-v-monaco-grand-prix-guide/, monaco-tribune.com/en/2026/02/monaco-grand-prix-2026-best-viewing-spots-ticket-prices-and-insider-tips/",
  },
  {
    seatName: "Grandstand K (K3-K6)",
    seatType: "grandstand",
    zoneLabel: "Tabac corner / Port Hercule, Nouvelle Chicane exit",
    actionTags: ["technical_corner", "high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    tier: "tier2",
    sourceNote:
      "TIER: tier2 (2-star). The largest seating block at the circuit, running along the harbour past the Swimming Pool complex with Port Hercule's yachts as backdrop. Uncovered throughout K3-K6 (K1-K3 get some late-afternoon building shade, per oversteer48 — K1/K2 broken out separately below as premium). Priced £175+ Fri / £400-550 Sat / £900-1,050 Sun (2026 edition, base K price band). Sources: oversteer48.com/grandstand-k-monaco-grand-prix/, monaco-tribune.com/en/2026/02/monaco-grand-prix-2026-best-viewing-spots-ticket-prices-and-insider-tips/",
  },

  // ---- Tier 3 (3-star): premium grandstands ----
  {
    seatName: "Grandstand K1/K2 (Gold)",
    seatType: "grandstand",
    zoneLabel: "Tabac corner, closest sections to the corner apex",
    actionTags: ["technical_corner", "high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    tier: "tier3",
    sourceNote:
      "TIER: tier3 (3-star, MEDIUM confidence). Closest K sections to the corner apex, marketed as Gold-tier within the K grandstand family (tickets.formula1.com/monaco lists 'Grandstand K - Gold' as a distinct product). Uncovered, reserved. Placed above base K3-K6 on price-tier grouping from the official ticketing site rather than an individually confirmed 2026/2027 figure. Source: ticketing.formula1.com/monaco/, f1monaco.com/en/tickets",
  },
  {
    seatName: "Grandstand E",
    seatType: "grandstand",
    zoneLabel: "Piscine section, Turns 12/13, viewing Turn 12 exit into the chicane",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: false,
    tier: "tier3",
    sourceNote:
      "TIER: tier3 (3-star, LOWER confidence — single source, no price found at all). Small stand with limited capacity, described as 'not many seats.' Uncovered — 'no roof, open to the weather all day,' some midday shade from a nearby structure. Bench-style seating with no backrest (not individually reserved). Tier placement is a judgment call based on scarcity/limited-capacity framing, not a sourced price point — flagged for re-verification once real pricing exists. Source: oversteer48.com/grandstand-e-monaco-grand-prix/",
  },
  {
    seatName: "Grandstand A",
    seatType: "grandstand",
    zoneLabel: "Sainte-Dévote, Turn 1 — first-lap braking zone",
    actionTags: ["start_grid", "overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    tier: "tier3",
    sourceNote:
      "TIER: tier3 (3-star). First corner off the start — late-braking and first-lap incidents. No giant screen (per monaco-tribune.com). Uncovered, reserved. Priced €175 Fri / €450 Sat / €950 Sun (2026 edition). Sources: monaco-tribune.com/en/2026/02/monaco-grand-prix-2026-best-viewing-spots-ticket-prices-and-insider-tips/, oversteer48.com/grandstand-a-a1-monaco-grand-prix/",
  },
  {
    seatName: "Grandstand B",
    seatType: "grandstand",
    zoneLabel: "Casino Square — Monte-Carlo Casino / Hôtel de Paris corner",
    actionTags: ["technical_corner", "podium_atmosphere"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    tier: "tier3",
    sourceNote:
      "TIER: tier3 (3-star — revised down from an initial 4-star grouping per founder direction 30 Sep 2026, keeping 4-star reserved exclusively for hospitality). Monaco's most photographed corner — Casino de Monte-Carlo on one side, Café de Paris on the other. Has a giant screen (unlike Grandstand A). Uncovered, reserved. Priced £155 Fri / £550-650 Sat / £1,050-1,150 Sun (2026 edition) — highest of all named grandstands. Sources: monaco-tribune.com/en/2026/02/monaco-grand-prix-2026-best-viewing-spots-ticket-prices-and-insider-tips/, oversteer48.com/grandstand-b-monaco-grand-prix/",
  },

  // ---- Tier 4 (4-star and 5-star, collapsed): hospitality ----
  {
    seatName: "Bronze/Silver/Gold VIP Terraces",
    seatType: "hospitality",
    zoneLabel: "Various premium terrace locations around the circuit",
    actionTags: ["podium_atmosphere", "pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: true,
    tier: "tier4",
    sourceNote:
      "TIER: tier4 (4-star). Three-tier branded VIP terrace product family named on f1monaco.com's tickets page, offering 1-3 day combo options. PARTIALLY covered (founder-confirmed 30 Sep 2026, no independent source found stating this) — stored as covered:true per founder direction 30 Sep 2026, since the boolean schema field can't represent 'partial' as its own state and partial shelter is closer to covered than open-air for scoring purposes. No individual per-tier location/price detail found — genuine research gap, not guessed. Source: f1monaco.com/en/tickets",
  },
  {
    seatName: "Caravelles Grand Terrace",
    seatType: "hospitality",
    zoneLabel: "Harbourside, Caravelles building",
    actionTags: ["podium_atmosphere"],
    covered: false,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: true,
    tier: "tier4",
    sourceNote:
      "TIER: tier4 (4-star). Harbourside terrace hospitality package, priced ~£6,000 (2026 edition) per monaco-tribune.com. Uncovered/open-air — founder-confirmed 30 Sep 2026. Source: monaco-tribune.com/en/2026/02/monaco-grand-prix-2026-best-viewing-spots-ticket-prices-and-insider-tips/",
  },
  {
    seatName: "VIP Yacht Experience",
    seatType: "hospitality",
    zoneLabel: "Port Hercule harbour, superyacht viewing",
    actionTags: ["podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: true,
    tier: "tier4",
    sourceNote:
      "TIER: tier4 (4-star). Superyacht-based hospitality, priced in the same £4,500-8,000 (2026 edition) band as Caravelles per monaco-tribune.com's 'terraces, yachts, boxes' pricing note. PARTIALLY covered (founder-confirmed 30 Sep 2026) — stored as covered:true per founder direction 30 Sep 2026, since the boolean schema field can't represent 'partial' as its own state and partial shelter is closer to covered than open-air for scoring purposes. Source: monaco-tribune.com/en/2026/02/monaco-grand-prix-2026-best-viewing-spots-ticket-prices-and-insider-tips/",
  },
  {
    seatName: "F1 Paddock Club / Champions Club",
    seatType: "hospitality",
    zoneLabel: "Paddock-adjacent, above the garages",
    actionTags: ["pit_lane", "podium_atmosphere", "start_grid"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    tier: "tier4",
    sourceNote:
      "TIER: tier4 (4-star — see PRESTIGE/TIEBREAKER note at top of file; not yet split to a real 5-star outlier since no sourced price differentiates it from the 3 VIP terrace products above). Universal top F1 hospitality product; Monaco's 2027 offering listed as 'Champions Club | Ermanno Penthouse' (Saturday-Sunday combo) on f1experiences.com, with covered seating and TV screen access confirmed. Price not disclosed. Source: f1experiences.com/2027-monaco-grand-prix",
  },
];

for (const seat of SEATS) {
  const result = await sql`
    INSERT INTO circuit_seating_profile
      (sporting_event_id, ticket_tier_cost_id, seat_name, seat_type, zone_label, action_tags, covered, min_age, single_day_available, reserved_seating, source_note)
    VALUES
      (${EVENT_ID}, ${tierIdByKey[seat.tier]}, ${seat.seatName}, ${seat.seatType}, ${seat.zoneLabel}, ${seat.actionTags}, ${seat.covered}, ${seat.minAge}, ${seat.singleDayAvailable}, ${seat.reservedSeating}, ${seat.sourceNote})
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
    RETURNING seat_name, seat_type
  `;
  console.log(`✓ ${result[0].seat_name} (${result[0].seat_type})`);
}

const rows = await sql`
  SELECT seat_name, seat_type, zone_label, covered, reserved_seating, single_day_available
  FROM circuit_seating_profile
  WHERE sporting_event_id = ${EVENT_ID}
  ORDER BY seat_type, seat_name
`;
console.log("\nConfirmed state:");
console.table(rows);

await sql.end();

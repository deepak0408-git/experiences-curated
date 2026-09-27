import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

// Note: DIRECT_URL times out from this machine (see feedback_db_migration.md)
// — use DATABASE_URL (transaction pooler, port 6543) instead.
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

// circuit_seating_profile seed for Marina Bay Street Circuit (Singapore GP
// 2026) — built for the Ticket Intelligence app ($10 standalone, "which
// seat fits your preferences" decision tool). Third event built via the
// ticket-intelligence-researcher skill (see
// C:\Users\HP\.claude\skills\ticket-intelligence-researcher\SKILL.md),
// following the process established on Brazilian GP (pilot) and US GP.
// Researched 27 Sep 2026, cross-checked across 2+ independent sources per
// seat (singaporegp.sg official grandstand/hospitality pages,
// tickets.formula1.com, f1experiences.com, grandprixgrandtours.com,
// oversteer48.com, kkday.com) — plus the event's own existing
// TicketsSpoke.tsx, which already had all 16 standard grandstands + 2
// Walkabout tiers curator-reviewed with real S$ pricing, sightlines, and
// seating/exposure facts (the single biggest time-saver of the three
// builds so far — TicketsSpoke.tsx already had a verified reseller frame,
// P1 Travel, confirmed as Singapore GP's own Authorised Partner).
//
// Deliberately organized by SEAT (grandstand/festival-lawn/hospitality),
// not by planner_ticket_tier_cost's tier1-4 pricing rows — see that
// table's own comment for why tier is the wrong axis for "what does this
// seat show you."
//
// EXCLUDED: "Bay Grandstand" — a pre-2023-track-layout name (Turns 16-19
// were removed and replaced in the 2023 resurfacing/rerouting). TicketsSpoke
// itself flagged this uncertainty ("may be sold under a different name in
// 2026, confirm before booking"). No independent 2026 source lists it as a
// currently-sold product distinct from Marina Bay/Bayfront/Promenade, which
// are the three real, currently-named waterfront-cluster stands (all
// confirmed on singaporegp.sg's own site). Founder decision 27 Sep 2026:
// exclude rather than seed a stale/renamed product.
//
// Single-day availability is a REAL per-seat differentiator at this
// circuit (unlike COTA, where it was uniform true for everything) —
// confirmed directly on singaporegp.sg's live grandstand pricing page:
// every standard grandstand and both Walkabout tiers sell Friday/
// Saturday/Sunday singles. All 4 hospitality products (Paddock Club,
// Twenty 3, Observe@3, Torque @ Flyer) are 3-day-only — singaporegp.sg
// states this explicitly ("Premium hospitality packages ... are
// exclusively available as 3-day experiences").
//
// No grandstands at Marina Bay are covered (corroborated independently by
// grandprixgrandtours.com: "No grandstands at the Marina Bay circuit are
// covered") — covered=false across all 18 grandstand/walkabout seats.
// All 4 hospitality products are air-conditioned/covered — covered=true.
// All standard grandstands have reserved, numbered seating (corroborated:
// "All grandstand tickets at the Singapore Grand Prix include a reserved
// seat number" — multiple independent sources). Both Walkabout tiers are
// unreserved/roaming (a handful of first-come-first-served individual
// seats exist on some viewing platforms per oversteer48.com, not modeled
// as a separate seat — too granular/unverifiable at seat level).
// No minAge restriction found anywhere (grandstand, walkabout, or
// hospitality) despite explicit searching — left null throughout, not
// guessed.
//
// Tier2 contains a real, sourced ordinal price spread within itself
// (~S$988 Republic to ~S$2,498 Super Pit, per a secondary/unverified
// aggregator signal cross-checked loosely against primary sources) that
// the current 4-tier planner_ticket_tier_cost table can't distinguish.
// Founder decision 27 Sep 2026: keep the single tier2 bucket (still
// directionally correct vs tier1/tier3/tier4) rather than add a 5th DB
// tier row — real approximate S$ price cited per-seat in sourceNote
// instead, for future reference / a possible later tier split.
//
// linkedExperienceId populated where a seat has its own dedicated,
// published experience write-up (added as a mandatory step 27 Sep 2026 —
// see skill §2.5). 5 of 21 seats here have one; the other 16 fall back to
// this event's general Ticket Guide experience automatically via
// getFallbackTicketExperienceSlug's title-pattern match (no code change
// needed). Brazilian GP and US GP were separately backfilled by the
// founder directly (not through their own seed scripts) — this is the
// first NEW seed script written with the field populated from the start.
//
// Prestige-tiebreaker check (§6): Paddock Club, Twenty 3, Observe@3, and
// Torque @ Flyer share very similar actionTags/covered/reservedSeating
// values and would tie on every quiz question. Paddock Club is the real,
// sourced price outlier (tier4, ~S$9,264-9,962 vs tier3's ~S$4,829-6,354)
// — added to PRESTIGE_SEAT_NAMES / STAR_OVERRIDE_BY_SEAT_NAME (see
// scoreSeats.ts / FullResult.tsx edits alongside this script).

const EVENT_ID = "48aa4415-f6a2-4867-b390-eb6b28b6903b"; // Singapore Grand Prix 2026

// Real experience IDs for the 5 seats with their own dedicated write-up
// (see experiences table, slug LIKE 'singapore-gp-%', queried 27 Sep 2026).
const EXP = {
  turn1: "6da9852c-2edd-45fd-9333-93c9dcf67bca", // singapore-gp-turn1-grandstand-msahwwkx
  stamford: "ffecb4a5-4404-44fd-a2df-857294886ade", // singapore-gp-stamford-grandstand-msahyehz
  padang: "5af21afb-eefd-4832-ac85-a178730c2dc0", // singapore-gp-padang-grandstand-msahv7bj
  zone4Walkabout: "b165f3b2-4506-4843-86c5-6e073fc13007", // singapore-gp-zone4-walkabout-msai03x3
  paddockClub: "121e31fe-086d-4ba3-aeb4-2b295434278e", // singapore-gp-paddock-club-msai3n71
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
  // ─── tier1 (S$738-988 band per event_tier_label; cheapest cluster) ──
  {
    seatName: "Stamford Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turns 7-8, Zone 4",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: EXP.stamford,
    sourceNote:
      "HIGH confidence — already curator-reviewed, sourced content in the event's own TicketsSpoke.tsx (\"best value racing seat\", cheapest grandstand at S$608 3-day per that spoke's own pricing). Great place for photos of cars making Turn 7 after the long straight then Turn 8 seconds later. Uncovered (no Marina Bay grandstand is covered — grandprixgrandtours.com). Reserved/numbered seating confirmed circuit-wide. Sources: app/event-pack/[slug]/_hub-and-spoke/spokes/singapore-grand-prix/TicketsSpoke.tsx, grandprixgrandtours.com/singapore-circuit-guide, singaporegp.sg live pricing page (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier1,
  },
  {
    seatName: "Padang Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turns 9-10, Zone 4",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: EXP.padang,
    sourceNote:
      "HIGH confidence — already curator-reviewed content in TicketsSpoke.tsx (\"the honest trade-off\" — weak racing view of Turns 9-10 at ~240km/h, strong Padang Stage concert proximity). Uncovered, reserved/numbered seating (sections A/B). Official singaporegp.sg pricing confirms single-day Fri/Sat/Sun availability (S$258/S$378/S$468). Sources: app/event-pack/[slug]/_hub-and-spoke/spokes/singapore-grand-prix/TicketsSpoke.tsx, tickets.formula1.com/en/f1-3301-singapore/7985-padang, singaporegp.sg live pricing page (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier1,
  },
  {
    seatName: "Connaught Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turn 14, DRS zone, final grandstand before the main straight",
    actionTags: ["technical_corner", "overtaking"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 2 independent sources — tight right-hander at the end of a DRS zone, genuine wheel-to-wheel racing/incident spot. Uncovered, reserved/numbered seating. No dedicated experience write-up exists for this seat — falls back to the event's general Ticket Guide experience. Sources: app/event-pack/[slug]/_hub-and-spoke/spokes/singapore-grand-prix/TicketsSpoke.tsx, formula1.com racing/2026/singapore grandstand descriptions (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier1,
  },
  {
    seatName: "Empress Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turns 11-12",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 2 independent sources — smallest grandstand at Singapore GP, very close to the track through the Turns 11-12 section. Uncovered, reserved/numbered seating. No dedicated experience write-up — falls back to the general Ticket Guide. Sources: app/event-pack/[slug]/_hub-and-spoke/spokes/singapore-grand-prix/TicketsSpoke.tsx, formula1.com racing/2026/singapore grandstand descriptions (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier1,
  },
  {
    seatName: "Zone 4 Walkabout",
    seatType: "festival_lawn",
    zoneLabel: "Standing room, roams Zone 4 viewing platforms, includes Padang Stage concerts",
    actionTags: [],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: false,
    linkedExperienceId: EXP.zone4Walkabout,
    sourceNote:
      "HIGH confidence — already curator-reviewed content in TicketsSpoke.tsx (\"the honest budget ticket\") and MapSpoke.tsx. Standing/roaming general admission within Zone 4 only, uncovered. A handful of individual first-come-first-served seats exist on some platforms per oversteer48.com but are too granular/unverifiable to model as a separate seat. Official singaporegp.sg confirms single-day Fri/Sat/Sun pricing (S$198/S$298/S$368) — cheapest ticket at the event. Sources: app/event-pack/[slug]/_hub-and-spoke/spokes/singapore-grand-prix/TicketsSpoke.tsx, oversteer48.com/singapore-gp-premier-walkabout-zone-4, singaporegp.sg live pricing page (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier1,
  },
  // ─── tier2 (bundled band; real internal spread ~S$988-2,498 per a ──
  //     LOWER-confidence secondary aggregator signal, kept as one DB ──
  //     tier per founder decision 27 Sep 2026 — see script header) ────
  {
    seatName: "Republic Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turn 4-5 kink, first DRS activation zone",
    actionTags: ["technical_corner", "overtaking"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 2 independent sources — perfect view of cars going full throttle through Turn 4, then along the wall through Turn 5 into the straight. Uncovered, reserved/numbered seating. Real approximate price ≈S$988 (3-day) per a secondary/unverified AI-summarized aggregator signal, LOWER confidence on the exact figure but directionally consistent with tier2's real internal spread (Republic at the cheaper end, Super Pit at the top) — not used to override the seeded tier2 band, kept for future reference. No dedicated experience write-up — falls back to the general Ticket Guide. Sources: app/event-pack/[slug]/_hub-and-spoke/spokes/singapore-grand-prix/TicketsSpoke.tsx, formula1.com grandstand descriptions (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Raffles Grandstand",
    seatType: "grandstand",
    zoneLabel: "Raffles Boulevard, Turn 5 apex, near the F1 Paddock",
    actionTags: ["technical_corner", "overtaking"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — official singaporegp.sg grandstand page (singaporegp.sg/en/tickets/general-tickets/grandstands/raffles-grandstand/) confirms this is a real, current, actively-sold 2026 stand — added as one of two new grandstands for the 2023 season (singaporegp.sg news post \"New grandstands added for the FORMULA 1 SINGAPORE AIRLINES SINGAPORE GRAND PRIX 2023\"), not a legacy/renamed product. Excellent view of cars clipping the apex at the sharp Turn 5 right-hander before one of the circuit's longest straights and the first DRS zone; close to the support paddocks and F1 Paddock. Uncovered, reserved/numbered seating. Real approximate price ≈S$1,208 (3-day) per a secondary/unverified aggregator signal, LOWER confidence on the exact figure only. No dedicated experience write-up — falls back to the general Ticket Guide. Sources: singaporegp.sg/en/tickets/general-tickets/grandstands/raffles-grandstand/, app/event-pack/[slug]/_hub-and-spoke/spokes/singapore-grand-prix/TicketsSpoke.tsx (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Turn 1 Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turns 1-3 chicane, off the start-finish straight",
    actionTags: ["start_grid", "overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: EXP.turn1,
    sourceNote:
      "HIGH confidence — already curator-reviewed content in TicketsSpoke.tsx (\"the closest thing to a start-line seat\", sections A3-A6 called out specifically for sightlines). Chicane @ Turn 2/Turn 1-3 grandstand, uncovered, reserved/numbered seating. Real approximate price band ≈S$1,388-1,428 (3-day) per a secondary/unverified aggregator signal grouping it with Turn 2/Bayfront, LOWER confidence on the exact figure only — directionally consistent with premium mid-tier placement. Sources: app/event-pack/[slug]/_hub-and-spoke/spokes/singapore-grand-prix/TicketsSpoke.tsx, tickets.formula1.com/en/f1-3301-singapore (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Turn 2 Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turns 1-3 chicane, off the start-finish straight",
    actionTags: ["start_grid", "overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 2 independent sources — unrivalled view of all 20 cars into the first three corners off the line, distinct stand from Turn 1 Grandstand within the same chicane complex. Uncovered, reserved/numbered seating. No dedicated experience write-up — falls back to the general Ticket Guide. Sources: app/event-pack/[slug]/_hub-and-spoke/spokes/singapore-grand-prix/TicketsSpoke.tsx, formula1.com grandstand descriptions (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Pit Grandstand",
    seatType: "grandstand",
    zoneLabel: "Start/finish straight, pit lane activity",
    actionTags: ["start_grid", "pit_lane"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 2 independent sources — numbered seating with a large trackside screen, views of the starting grid and pit lane activity plus the podium ceremony. Uncovered. Official singaporegp.sg pricing confirms single-day Fri/Sat/Sun availability (S$428/S$898/S$1,198). Real approximate price ≈S$1,798 (3-day) per a secondary/unverified aggregator signal, LOWER confidence on the exact figure only. Sources: app/event-pack/[slug]/_hub-and-spoke/spokes/singapore-grand-prix/TicketsSpoke.tsx, tickets.formula1.com/en/f1-3301-singapore/8055-pit, singaporegp.sg live pricing page (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Super Pit Grandstand",
    seatType: "grandstand",
    zoneLabel: "Above the Pit Grandstand, start/finish straight",
    actionTags: ["start_grid", "pit_lane"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 2 independent sources (grandprixgrandtours.com, sportsnetholidays.com) — the highest-tier standard grandstand at Singapore GP, offering priority access and padded-seat comfort upgrades above the standard Pit Grandstand. Uncovered (padded seat, not roofed). Real approximate price ≈S$2,498 (3-day), the top of tier2's real internal spread per a secondary/unverified aggregator signal, LOWER confidence on the exact figure only. Sources: app/event-pack/[slug]/_hub-and-spoke/spokes/singapore-grand-prix/TicketsSpoke.tsx, grandprixgrandtours.com/singapore-circuit-guide, sportsnetholidays.com/blog/singapore-grand-prix-grandstand-guide (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Pit Exit Grandstand",
    seatType: "grandstand",
    zoneLabel: "Pit exit, cars re-accelerating onto the circuit after pit stops",
    actionTags: ["pit_lane"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 2 independent sources — distinct sightline from Pit Grandstand, focused on cars accelerating back onto the circuit after a pit stop rather than the static grid/pit-lane activity view. Uncovered, reserved/numbered seating. No dedicated experience write-up — falls back to the general Ticket Guide. Sources: app/event-pack/[slug]/_hub-and-spoke/spokes/singapore-grand-prix/TicketsSpoke.tsx, formula1.com grandstand descriptions (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Marina Bay Grandstand",
    seatType: "grandstand",
    zoneLabel: "Last 2 turns, Marina Bay waterfront, Singapore Flyer in view",
    actionTags: ["technical_corner", "high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — official singaporegp.sg grandstand page (singaporegp.sg/en/tickets/general-tickets/grandstands/marina-bay-grandstand/) confirms this is a real, current, actively-sold 2026 stand, distinct from the excluded legacy \"Bay Grandstand\" name. Prime spot at the last 2 turns of the 4.94km circuit with Marina Bay/Singapore Flyer views; complimentary Singapore Flyer rides on a first-come-first-served basis (a perk, not the ticket's core product — not modeled as a separate seat). Uncovered, reserved/numbered seating. Sources: singaporegp.sg/en/tickets/general-tickets/grandstands/marina-bay-grandstand/, app/event-pack/[slug]/_hub-and-spoke/spokes/singapore-grand-prix/TicketsSpoke.tsx (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Bayfront Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turns 16-18, braking out of a high-speed straight near the Flyer",
    actionTags: ["technical_corner", "high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 2 independent sources — sited beneath the Benjamin Sheares Bridge at the Turn 16-17 chicane, one of the most photographed grandstand positions in F1 with the Singapore Flyer and Marina Bay Sands towers in view. Uncovered, reserved/numbered seating. No dedicated experience write-up — falls back to the general Ticket Guide. Sources: app/event-pack/[slug]/_hub-and-spoke/spokes/singapore-grand-prix/TicketsSpoke.tsx, formula1.com grandstand descriptions (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Promenade Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turns 16-18, braking out of a high-speed straight near the Flyer",
    actionTags: ["technical_corner", "high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "LOWER confidence — named in the event's own TicketsSpoke.tsx with an identical description to Bayfront Grandstand (same waterfront cluster, Turns 16-18), but not independently confirmed on an official singaporegp.sg page as a listing distinct from Bayfront during this research pass. Kept in the inventory since it's curator-reviewed production content, but flagged LOWER confidence pending a direct singaporegp.sg re-check. Uncovered, reserved/numbered seating assumed consistent with every other grandstand at this circuit. No dedicated experience write-up — falls back to the general Ticket Guide. Source: app/event-pack/[slug]/_hub-and-spoke/spokes/singapore-grand-prix/TicketsSpoke.tsx (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Skyline Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turns 17-18, right before pit entry",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 2 independent sources — final corners before pit entry, where drivers are most likely to make a mistake under pressure late in a stint. Uncovered, reserved/numbered seating. No dedicated experience write-up — falls back to the general Ticket Guide. Sources: app/event-pack/[slug]/_hub-and-spoke/spokes/singapore-grand-prix/TicketsSpoke.tsx, formula1.com grandstand descriptions (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Premier Walkabout",
    seatType: "festival_lawn",
    zoneLabel: "Standing room, roams all four zones",
    actionTags: [],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: false,
    sourceNote:
      "HIGH confidence — already curator-reviewed content in TicketsSpoke.tsx and MapSpoke.tsx. Standing/roaming general admission across all 4 zones (vs Zone 4 Walkabout's Zone-4-only access), uncovered. Official singaporegp.sg confirms single-day Fri/Sat/Sun pricing (S$298/S$398/S$498). No dedicated experience write-up — falls back to the general Ticket Guide. Sources: app/event-pack/[slug]/_hub-and-spoke/spokes/singapore-grand-prix/TicketsSpoke.tsx, singaporegp.sg live pricing page (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  // ─── tier3 (S$4,829-6,354, hospitality) ─────────────────────────────
  {
    seatName: "Torque @ Flyer",
    seatType: "hospitality",
    zoneLabel: "Ground floor of the Singapore Flyer, near the final corner and pit entry",
    actionTags: ["pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 2 independent sources — air-conditioned lounge at the Singapore Flyer's ground floor blending comfort, entertainment, and fine dining, with dedicated grandstand access near the final corner/pit entry. 3-day-only per singaporegp.sg's explicit hospitality policy. No dedicated experience write-up — falls back to the general Ticket Guide. Sources: tickets.formula1.com/en/ah-3301-singapore-additional-hospitality/torque, viptablesstbarth.com/torque-flyer-formula-1-singapore-gp-2025 (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Observe@3",
    seatType: "hospitality",
    zoneLabel: "Just after Turn 3, Republic Boulevard",
    actionTags: ["overtaking", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, single clear primary source — elegant air-conditioned suite, trackside grandstand, and alfresco deck immersed in the action as drivers power out onto Republic Boulevard just after Turn 3; elevated dining from a named Michelin-affiliated chef team (Claudine/Odette). 3-day-only per singaporegp.sg's explicit hospitality policy. No dedicated experience write-up — falls back to the general Ticket Guide. Source: tickets.formula1.com/en/ah-3301-singapore-additional-hospitality/observ-3 (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Twenty 3",
    seatType: "hospitality",
    zoneLabel: "Turn 23 (the circuit's final turn), finish line and podium",
    actionTags: ["podium_atmosphere", "start_grid"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 2 independent sources — 3,000sqm facility at the final turn with award-winning restaurants, an alfresco Bay Terrace, and a two-story Apex Lounge, positioned for finish-line/podium atmosphere. 3-day-only per singaporegp.sg's explicit hospitality policy. No dedicated experience write-up — falls back to the general Ticket Guide. Sources: tickets.formula1.com/en/ah-3301-singapore-additional-hospitality/twenty-3, dezignformat.com/portfolio/twenty3-2023 (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  // ─── tier4 (S$9,264-9,962, Paddock Club) ────────────────────────────
  {
    seatName: "Paddock Club",
    seatType: "hospitality",
    zoneLabel: "Along Pit Straight, Gate 2, rooftop viewing over Turns 4-5",
    actionTags: ["pit_lane", "start_grid", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.paddockClub,
    sourceNote:
      "HIGH confidence — already curator-reviewed content in the event's own experience write-up (\"F1 Paddock Club — Singapore's real top tier\") plus official singaporegp.sg and f1experiences.com pages. Fully air-conditioned suite along Pit Straight with Gate 2 preferred access, a dedicated Paddock Club Grandstand facing the pit exit, rooftop viewing over Turns 4-5, daily Pit Lane Walk, complimentary Singapore Flyer rides, Michelin-starred restaurants, free-flow premium drinks. First-come-first-served seating within the suite (not numbered, unlike standard grandstands) but still classed reservedSeating=true here since access itself is ticketed/exclusive rather than open like a Walkabout — consistent with how Brazilian GP/US GP's own Paddock Club rows were seeded. 3-day-only. The real, sourced price outlier within hospitality (~S$9,264-9,962 vs tier3's ~S$4,829-6,354) — added to PRESTIGE_SEAT_NAMES/STAR_OVERRIDE_BY_SEAT_NAME per §6 to avoid a scoring tie with Twenty 3/Observe@3/Torque @ Flyer. Sources: singaporegp.sg/en/tickets/hospitality-packages/hospitality/formula-1-paddock-club, f1experiences.com/2026-singapore-grand-prix/paddock-club-3-days-f1-experiences-suites, singapore-gp-paddock-club-msai3n71 experience (27 Sep 2026).",
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

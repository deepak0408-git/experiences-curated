import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

// Note: DIRECT_URL times out from this machine (see feedback_db_migration.md)
// — use DATABASE_URL (transaction pooler, port 6543) instead.
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

// circuit_seating_profile seed for Yas Marina Circuit (Abu Dhabi GP 2026) —
// built for the Ticket Intelligence app ($10 standalone, "which seat fits
// your preferences" decision tool). Built via the
// ticket-intelligence-researcher skill (see
// C:\Users\HP\.claude\skills\ticket-intelligence-researcher\SKILL.md).
// Researched 27 Sep 2026.
//
// GAP FOUND (same class as the Brazilian GP pilot incident, skill §1): the
// existing planner_ticket_tier_cost tier2 label already NAMED 5 grandstands
// (Marina, West Straight, South, North Straight, North) as one shared price
// band, but TicketsSpoke.tsx's own STANDS list only ever described "West
// Grandstand" and "Main Grandstand" individually — the other 5 named-in-
// the-tier-label grandstands were never broken out as their own seats
// anywhere. MapSpoke.tsx's own copy does describe zones for Main/North/
// West/Marina/South (but not North Straight or West Straight specifically,
// which independent sources confirm are genuinely separate, smaller
// grandstands next to North/West respectively, not the same stand).
//
// Real inventory — 13 seats (after folding, see below), from 9 previously
// visible: Abu Dhabi Hill, North Straight, West Straight, Marina, South,
// North, West, Main Grandstands, plus 5 tier4 hospitality products (North
// Yas Suite, West Yas Suite, F1 Experiences Lounge at Yas Premium Suites,
// Paddock Club, House 44 at F1 Paddock Club).
//
// FOLDING DECISION (founder instruction, 27 Sep 2026): "Hero | Main" and
// "Hero | West" — F1 Experiences' own premium hospitality add-on packages
// layered onto Main Grandstand and West Grandstand tickets respectively
// (Thursday "Inside F1" event, pit lane walk, guided track tour, trophy
// photo, on top of the same grandstand seat) — are folded into their
// underlying grandstand seat rather than seeded as their own rows, since
// they're an upgrade tier on an existing seat, not a physically distinct
// seat. This mirrors the reasoning Mexico City GP used to fold 3
// team-suite Paddock Club variants into one seat. Consistent with founder
// direction to keep them out of the standalone inventory here.
//
// ORDINAL TIER MAPPING (§3): North Straight, West Straight, Marina, South
// slot into the existing tier2 row (already labelled with all 5 names
// including North) alongside North Grandstand. West/Main Grandstand keep
// their existing tier3 row (the Hero add-on doesn't change the base
// grandstand's ordinal tier). North Yas Suite, West Yas Suite, F1
// Experiences Lounge, Paddock Club, House 44 all slot into the existing
// tier4 row (US$2,539-18,385.50) — House 44's own sourced $15,719 sits at
// the top of that band, consistent with it being the real outlier (see §6
// below); no widening needed.
//
// COVERED: Main and West Grandstand — fully covered (existing experience
// write-ups + oversteer48.com). North, North Straight — fully covered
// (oversteer48.com's dedicated North Grandstand page explicitly notes
// "North Straight grandstand features full coverage with a lower roof").
// Marina — fully covered (oversteer48.com: "large roof over the whole
// grandstand"). South — fully covered (oversteer48.com: "whole grandstand
// has a roof over the top"). West Straight — fully covered (Formula1.com
// ticket listing + oversteer48.com reference, corroborated). Abu Dhabi
// Hill — uncovered (existing experience write-up: "not a covered ticket").
// All 5 hospitality products — fully covered (F1 Experiences/hospitality
// standard, corroborated per-product on official pages).
//
// RESERVED SEATING: every named grandstand (Main, West, North, North
// Straight, West Straight, Marina, South) has assigned sections/rows —
// corroborated across oversteer48.com's dedicated per-stand pages and
// tickets.formula1.com listings. Abu Dhabi Hill is the only unreserved
// product (existing experience write-up: "unreserved and flexible"). All 5
// hospitality products are reserved (suite/table seating).
//
// MIN AGE: North Yas Suite and West Yas Suite are both explicitly
// documented as 16+ suites on the official abudhabigp.com listing pages —
// a genuine, sourced age restriction, seeded as such. No age restriction
// found for any other seat despite searching — left null.
//
// SINGLE-DAY AVAILABILITY: every grandstand and GA ticket is sold as one
// 4-day (Thu-Sun) package only, per TicketsSpoke.tsx's own copy ("Every
// ticket covers the standard 4-day... weekend"). Hospitality products are
// sold as 3-day (Fri-Sun) per their own official pages (House 44, F1
// Experiences Lounge, Paddock Club all state "3-day" explicitly).
// singleDayAvailable: false across all 13 seats — no single-day option
// surfaced anywhere.
//
// linkedExperienceId populated for Abu Dhabi Hill, Main Grandstand, West
// Grandstand, and Paddock Club (this event's own "F1 Paddock Club —
// Pit-Lane Hospitality" experience) — this event has 4 dedicated
// grandstand/ticket write-ups already. The remaining 9 seats (North,
// North Straight, West Straight, Marina, South Grandstands; North/West Yas
// Suites; F1 Experiences Lounge; House 44) have no dedicated write-up and
// fall back automatically to the general Ticket Guide-equivalent via
// getFallbackTicketExperienceSlug (no code change needed).
//
// PRESTIGE-TIEBREAKER CHECK (§6): Paddock Club, North/West Yas Suite, and
// F1 Experiences Lounge share broadly similar actionTags (pit_lane,
// podium_atmosphere) and could tie within tier4. House 44 is the real,
// sourced price outlier (US$15,719, the top of tier4's band, vs.
// unsourced/lower-positioned Yas Suites and a sold-out F1 Experiences
// Lounge with no confirmed price) — it already inherits the GLOBAL
// "House 44 at F1 Paddock Club" 5-star override in
// PRESTIGE_SEAT_NAMES/STAR_OVERRIDE_BY_SEAT_NAME from the Mexico City GP
// build (same (seatName)-only-keying gap flagged on every event since —
// see project_mexico_city_gp_ticket_intelligence.md,
// project_las_vegas_gp_ticket_intelligence.md,
// project_qatar_gp_ticket_intelligence.md). Directionally correct here too
// — Abu Dhabi's own House 44 really is the sourced top-price outlier — so
// no map changes made, consistent with the founder's prior "accept as-is"
// decisions.

const EVENT_ID = "8f45cb75-f205-458b-8f31-48551e6d7cb8"; // Abu Dhabi Grand Prix 2026

// Real experience IDs for the seats with their own dedicated write-up
// (queried 27 Sep 2026).
const EXP = {
  abuDhabiHill: "c4d479d3-87eb-4853-b6e9-737a32014ba3", // abu-dhabi-hill-general-admission
  mainGrandstand: "e03380d5-0bf5-49b2-8156-5885624e280d", // main-grandstand-yas-marina
  westGrandstand: "5b07dbc2-c364-4784-905f-411229f34b5f", // west-grandstand-yas-marina
  paddockClub: "0eae6b82-020a-4d14-862e-67baccc728ef", // f1-paddock-club-yas-marina
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
  // ─── tier1 (AED 1,695 / ~US$545, 4-day) ─────────────────────────────
  {
    seatName: "Abu Dhabi Hill (General Admission)",
    seatType: "festival_lawn",
    zoneLabel: "Open zones scattered around the circuit",
    actionTags: [],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: false,
    linkedExperienceId: EXP.abuDhabiHill,
    sourceNote:
      "HIGH confidence — this event's own dedicated \"Abu Dhabi Hill\" experience write-up. Grassy, open viewing zones around the circuit, unreserved and mobile between vantage points, big screen with live timing. Uncovered — a real trade at a twilight race given hot daytime practice/qualifying sessions. Cheapest ticket at the event (~AED 1,695 / US$545, per the event's own Ticket Guide/TicketsSpoke tier1 pricing). Includes the same Yasalam after-race concert access as every other tier. Source: abu-dhabi-hill-general-admission experience (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier1,
  },
  // ─── tier2 (US$783-1,052, 4-day) ────────────────────────────────────
  {
    seatName: "North Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turn 5 — the circuit's hairpin, full entry/apex/exit",
    actionTags: ["technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 2 independent sources — this event's own MapSpoke.tsx copy (\"wraps the outside of Turn 5... covering the full entry, apex, and exit\") corroborated by oversteer48.com's dedicated North Grandstand page (site of Verstappen's title-deciding 2021 overtake on Hamilton; covered, reserved seating, sections N-06 through N-13). No dedicated experience write-up — falls back to the general Ticket Guide. Sources: app/event-pack/[slug]/_hub-and-spoke/spokes/abu-dhabi-grand-prix/MapSpoke.tsx, oversteer48.com/north-grandstand-abu-dhabi-yas-marina (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "North Straight Grandstand",
    seatType: "grandstand",
    zoneLabel: "Outside the circuit, first part of the straight after Turn 5 exit",
    actionTags: ["high_speed"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "MODERATE confidence, single independent source (oversteer48.com, referencing its own North Grandstand page) — a genuinely separate, smaller single-level stand next to North Grandstand, not the same seat. Fully covered with a lower roof than North Grandstand itself. Was previously named only inside planner_ticket_tier_cost's tier2 event_tier_label, never broken out as its own seat anywhere else (skill §1 gap). No dedicated experience write-up — falls back to the general Ticket Guide. Source: oversteer48.com/north-grandstand-abu-dhabi-yas-marina (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "West Straight Grandstand",
    seatType: "grandstand",
    zoneLabel: "Back straight, before Turn 6, adjacent to West Grandstand",
    actionTags: ["high_speed"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "MODERATE confidence, 2 independent sources — a smaller structure built for 2022 to add capacity, positioned slightly further along the straight before Turn 6 from West Grandstand itself. Covered, reserved seating, per Formula1.com's own ticket listing and independent search corroboration. Was previously named only inside planner_ticket_tier_cost's tier2 event_tier_label, never broken out as its own seat anywhere else (same skill §1 gap as North Straight). No dedicated experience write-up — falls back to the general Ticket Guide. Sources: tickets.formula1.com/en/f1-3312-abu-dhabi/21548-west-straight-grandstand, independent search corroboration (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Marina Grandstand",
    seatType: "grandstand",
    zoneLabel: "Back straight (Turns 8-9) facing the marina infield (Turns 10-13)",
    actionTags: ["high_speed", "overtaking"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 2 independent sources — this event's own MapSpoke.tsx copy (\"runs along the outside of the back straight between Turns 8 and 9, facing across the water to the infield section\") corroborated by oversteer48.com's dedicated Marina Grandstand page (large roof over the whole stand, 7 sections/15 rows each, sees the DRS overtaking zone). No dedicated experience write-up — falls back to the general Ticket Guide. Sources: app/event-pack/[slug]/_hub-and-spoke/spokes/abu-dhabi-grand-prix/MapSpoke.tsx, oversteer48.com/marina-grandstand-abu-dhabi (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "South Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turn 9 — Marsa Corner braking zone",
    actionTags: ["overtaking", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 2 independent sources — this event's own MapSpoke.tsx copy (\"South Grandstand sits at Turn 9 — known as Marsa Corner — covering the braking zone into it\") corroborated by oversteer48.com's dedicated South Grandstand page (roof over the whole stand, north-east facing so sun stays out of spectators' eyes). No dedicated experience write-up — falls back to the general Ticket Guide. Sources: app/event-pack/[slug]/_hub-and-spoke/spokes/abu-dhabi-grand-prix/MapSpoke.tsx, oversteer48.com/south-grandstand-abu-dhabi-yas-marina (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  // ─── tier3 (US$1,466-2,349, 4-day) — includes folded-in Hero add-ons ─
  {
    seatName: "West Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turns 6-7 — end of the back straight, the circuit's main braking/overtaking zone",
    actionTags: ["overtaking", "high_speed"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.westGrandstand,
    sourceNote:
      "HIGH confidence — this event's own dedicated \"West Grandstand\" experience write-up. Wraps Turns 6-7, the circuit's heaviest braking zone and main overtaking spot, two distinct viewing angles depending on stand position, fully covered, reserved seating. Folds in F1 Experiences' \"Hero | West\" package (Friday-Sunday grandstand access plus a Thursday hospitality add-on: Inside F1 event, Pit Lane Walk, guided track tour, trophy photo) per founder instruction, 27 Sep 2026 — Hero is an upgrade tier on this same seat, not a physically distinct one. Sources: west-grandstand-yas-marina experience, f1experiences.com/2026-abu-dhabi-grand-prix/hero-west (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Main Grandstand",
    seatType: "grandstand",
    zoneLabel: "Start/finish straight, opposite the pits — grid, pit stops, and podium",
    actionTags: ["start_grid", "pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.mainGrandstand,
    sourceNote:
      "HIGH confidence — this event's own dedicated \"Main Grandstand\" experience write-up. The only stand with grid, every pit stop, and the podium all from one seat; four internal tiers (Main Premium/Premium Plus highest, Premium Plus facing the podium directly); covered, reserved. Folds in F1 Experiences' \"Hero | Main\" package (3-day ticket plus Paddock Club reception with a former F1 driver, insider access, pit lane walk) per founder instruction, 27 Sep 2026 — same upgrade-tier-not-distinct-seat reasoning as Hero | West. Sources: main-grandstand-yas-marina experience, f1experiences.com/2026-abu-dhabi-grand-prix (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  // ─── tier4 (US$2,539-18,385.50, 3-day hospitality unless noted) ─────
  {
    seatName: "North Yas Suite",
    seatType: "hospitality",
    zoneLabel: "Inside North Grandstand, overlooking the Turn 5 hairpin",
    actionTags: ["technical_corner"],
    covered: true,
    minAge: 16,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — official abudhabigp.com listing page: a contemporary 16+ suite inside North Grandstand, luxury hospitality, breathtaking Turn 5 hairpin views, 1-day access to a partner Yas Island theme park (Ferrari World, SeaWorld, Warner Bros. World, Yas Waterworld, or teamLab Phenomena). Explicit, sourced 16+ age restriction — a genuine minAge fact, not guessed. No price found despite searching. No dedicated experience write-up — falls back to the general Ticket Guide. Source: abudhabigp.com/en/formula1/tickets-2026/north-yas-suite-4day (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "West Yas Suite",
    seatType: "hospitality",
    zoneLabel: "Inside West Grandstand, overlooking the back straight",
    actionTags: ["high_speed", "overtaking"],
    covered: true,
    minAge: 16,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — official abudhabigp.com listing page: an exclusive 16+ suite inside West Grandstand, unparalleled views of the circuit's longest straight (300+ km/h) into the braking zone, gourmet dining, unlimited non-alcoholic drinks (alcohol via cash bar), air-conditioned with balcony seating, flat-screen TVs, Fanzone/Oasis access. Explicit, sourced 16+ age restriction. No price found despite searching. No dedicated experience write-up — falls back to the general Ticket Guide. Source: abudhabigp.com/en/formula1/tickets-2026/west-yas-suite-4day (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "F1 Experiences Lounge at Yas Premium Suites",
    seatType: "hospitality",
    zoneLabel: "Above Main Grandstand — starting grid and podium view",
    actionTags: ["start_grid", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — official f1experiences.com listing page: covered venue with outdoor balcony above Main Grandstand, views of the starting grid and podium, premium open bar and dinner/canapes (Fri-Sun), one guided F1 Paddock tour. Confirmed SOLD OUT as of this research (Sep 2026) — no live price available for that reason, not a sourcing gap. No dedicated experience write-up — falls back to the general Ticket Guide. Source: f1experiences.com/2026-abu-dhabi-grand-prix/f1-experiences-lounge-at-yas-premium-suites-3-days (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Paddock Club",
    seatType: "hospitality",
    zoneLabel: "Directly above the pit lane, full view into team garages",
    actionTags: ["pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.paddockClub,
    sourceNote:
      "HIGH confidence — this event's own dedicated \"F1 Paddock Club\" experience write-up. F1's own official hospitality product, directly above the pit lane, daily guided Pit Lane Walk, premium open bar, live cooking stations, Paddock Club Parade Truck Tour, F1 simulators, Pit Stop Challenge, F1 Ambassador appearances, one dedicated car pass per 3 guests, Yasalam concert access from a hospitality position. 3-day (Fri-Sun) package. Source: f1-paddock-club-yas-marina experience (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "House 44 at F1 Paddock Club",
    seatType: "hospitality",
    zoneLabel: "Inside Paddock Club, overlooking pit lane and the start/finish straight",
    actionTags: ["pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 2 independent sources — Soho House x Lewis Hamilton pop-up suite inside F1 Paddock Club, overlooking pit lane and the start/finish straight. Bespoke Soho House cocktail menu, exclusive Lewis Hamilton appearance, photo safari, guided Paddock tour, priority post-race podium celebration access, curated Hamilton career-memorabilia display (helmets, Plus 44 streetwear). US$15,719 per person (Buro 24/7, corroborated by tickets.formula1.com/f1experiences.com listing pages) — the real, sourced price outlier within tier4, at the top of its US$2,539-18,385.50 band. See prestige-tiebreaker note in script header; already inherits the global PRESTIGE_SEAT_NAMES/STAR_OVERRIDE_BY_SEAT_NAME 5-star treatment from prior events, directionally correct here too. No dedicated experience write-up — falls back to the general Ticket Guide. Sources: buro247.me House 44 Abu Dhabi feature, tickets.formula1.com/en/se-3312-f1-special-edition-abu-dhabi/house-44-abu-dhabi (27 Sep 2026).",
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
  SELECT seat_name, seat_type, covered, reserved_seating, min_age, single_day_available, linked_experience_id, ticket_tier_cost_id
  FROM circuit_seating_profile
  WHERE sporting_event_id = ${EVENT_ID}
  ORDER BY seat_type, seat_name
`;
console.log("\nConfirmed state:");
console.table(rows);
console.log(`\nTotal seats seeded: ${rows.length}`);

await sql.end();

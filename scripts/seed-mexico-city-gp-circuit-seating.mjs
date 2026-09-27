import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

// Note: DIRECT_URL times out from this machine (see feedback_db_migration.md)
// — use DATABASE_URL (transaction pooler, port 6543) instead.
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

// circuit_seating_profile seed for Autódromo Hermanos Rodríguez (Mexico
// City GP 2026) — built for the Ticket Intelligence app ($10 standalone,
// "which seat fits your preferences" decision tool). Fourth event built via
// the ticket-intelligence-researcher skill (see
// C:\Users\HP\.claude\skills\ticket-intelligence-researcher\SKILL.md).
// Researched 27 Sep 2026.
//
// SOURCING NOTE — TWO OFFICIAL CHANNELS EXIST FOR THIS CIRCUIT, ONE
// DELIBERATELY EXCLUDED: mexicogp.mx is the local promoter's own official
// site and does sell real grandstands/hospitality (Boxes Oro, Boxes
// Diamante, Platino Plus, Terraza Club, etc. — Spanish-branded). Per
// founder instruction (27 Sep 2026), mexicogp.mx is excluded entirely from
// this build — every seat here comes from tickets.formula1.com/
// f1experiences.com (F1's own global sale channel) plus mexico.gp (used
// ONLY for grandstand geometry/zone-color/turn descriptions, not pricing or
// hospitality) and independent grandstand-guide sites (oversteer48.com,
// fanamp.com, grandprixgrandtours.com). motorsporttickets.com is also
// permanently excluded (founder instruction, 27 Sep 2026 — "NEVER GO
// THERE"; its blog has also gone defunct/liquidation as of this research
// pass, so it was never actually cited here regardless).
//
// Hospitality is F1 Experiences' own line-up only, per founder direction:
// Champions Club, Gordon Ramsay's La Terraza, Paddock Club (folds together
// f1experiences.com's 3 separately-named suite variants — Audi Revolut
// Suite, TGR Haas Suite, Estadio Level 2 — into one seat, per founder
// instruction, since they're the same underlying Paddock Club product sold
// team-by-team/zone-by-zone rather than genuinely distinct experiences),
// House 44 at F1 Paddock Club (Soho House/Lewis Hamilton-branded, distinct
// enough from the folded-in Paddock Club product to keep separate — same
// reasoning Brazilian/Singapore GP used to keep their own House
// 44/Paddock-Club-equivalent split), Speed Lounge, Platinum Plus, and
// Skybox (all three Green/Yellow-zone add-on products, LOWER confidence —
// no price found for any of the three despite searching, existence/zone
// only).
//
// TicketsSpoke.tsx (already curator-reviewed) supplied the 8 core
// grandstands already present in planner_ticket_tier_cost, real USD
// pricing for those 8, and the House 44 price (~US$16,338, 3-day) — reused
// directly rather than re-verified. The remaining 11 grandstands (Main 1,
// Main 2, 3A, 5, 6, 6B, 7, 8, 9, 12, plus 2A's corrected seating type) were
// not in that tier table — confirming, same as Singapore/Brazilian/US GP,
// that planner_ticket_tier_cost's 4 rows are a representative price-band
// sample, never the full seat inventory.
//
// GRANDSTAND 2A CORRECTION: TicketsSpoke.tsx's existing copy calls this
// "General Admission... unreserved, standing/lawn." Two independent
// sources (oversteer48.com's dedicated Grandstand 2A seat-plan page:
// "reserved seating with assigned sections 101-110 and rows 1-31"; and
// fanamp.com's zone breakdown: "Uncovered, Numbered") both state this is
// actually reserved/numbered seating, just in the cheapest zone — not true
// GA. circuit_seating_profile seeds the corrected reservedSeating=true here
// since this table should hold the best-sourced fact, not inherit a
// possibly-dated spoke description; TicketsSpoke.tsx copy itself is
// untouched (out of scope for this pass — flagged to founder separately).
//
// GRANDSTAND 12: appears in 2 independent secondary sources
// (grandprixgrandtours.com, fanamp.com) but not on mexico.gp's own
// grandstand-map page (which is non-exhaustive elsewhere too, omitting 3A
// and 9 despite both being real). Treated as real or already
// reserved/uncovered, since both sourcing bars are met the same way as
// every other Yellow Zone stand.
//
// COVERED: only Main Grandstand 1/2 (mostly covered, per existing spoke)
// and Grandstand 14/15 (partially covered, Foro Sol) have any roof, per
// the existing spoke + mexico.gp's own map page. Every hospitality product
// is fully covered/air-conditioned, standard for F1 hospitality
// tiers — corroborated per-product on f1experiences.com.
//
// RESERVED SEATING: every named grandstand has assigned sections/rows —
// corroborated across all sources checked (oversteer48, fanamp,
// grandprixgrandtours, mexico.gp) — Mexico City has no true unreserved
// grandstand or festival-lawn product, unlike Singapore's Walkabout tiers.
//
// SINGLE-DAY AVAILABILITY: every ticket at this event — grandstand and
// hospitality alike — is sold as one 3-day (Fri-Sun) pass only, per the
// existing TicketsSpoke.tsx ("Every ticket covers the standard 3-day
// (Friday-Sunday) weekend... no single-day option exists for this event").
// singleDayAvailable: false across all 26 seats.
//
// MIN AGE: no published age restriction found for any seat (grandstand or
// hospitality) despite explicit searching — left null throughout, not
// guessed.
//
// linkedExperienceId populated where a seat has its own dedicated,
// published experience write-up (skill §2.5) — this event already has an
// unusually complete set: a dedicated Foro Sol write-up AND a dedicated
// "F1 Paddock Club & Champions Club" write-up covering both of those
// hospitality products by name. The remaining 22 seats fall back to this
// event's general "Mexico City GP Ticket Guide" experience automatically
// via getFallbackTicketExperienceSlug's title-pattern match (no code
// change needed).
//
// PRESTIGE-TIEBREAKER CHECK (§6): Champions Club, Paddock Club, House 44,
// Gordon Ramsay's La Terraza, Speed Lounge, Platinum Plus, and Skybox share
// near-identical actionTags/covered/reservedSeating values within tier4 and
// would tie on every quiz question. House 44 is the real, sourced outlier
// (~US$16,338, existing spoke figure, vs. Champions Club/Paddock Club's
// unsourced-but-clearly-lower positioning) — added to
// PRESTIGE_SEAT_NAMES/STAR_OVERRIDE_BY_SEAT_NAME alongside this script.

const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a"; // Mexico City Grand Prix 2026

// Real experience IDs for the 2 seats/groups with their own dedicated
// write-up (see experiences table, joined via sporting_event_experiences,
// queried 27 Sep 2026).
const EXP = {
  foroSol: "d5a0bdfc-7b0c-4734-9e0b-872e0afac1f7", // foro-sol-mexico-city-gp-mtpdg1hx
  paddockClub: "41cf34c3-c937-4e8b-8ab9-029224f3f6d1", // mexico-city-gp-paddock-club-mtpdkh8d ("F1 Paddock Club & Champions Club — Mexico City")
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
  // ─── tier1 (US$220-240 per event_tier_label — cheapest cluster) ────
  {
    seatName: "Grandstand 2A",
    seatType: "grandstand",
    zoneLabel: "Orange Zone — start/finish straight, distant section",
    actionTags: ["start_grid"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 2 independent sources — CORRECTS the existing TicketsSpoke.tsx description of this seat as \"General Admission... unreserved.\" oversteer48.com's dedicated Grandstand 2A page confirms assigned sections 101-110, rows 1-31; fanamp.com's zone breakdown independently confirms \"Numbered\" seating in the Orange Zone. View is limited to a small section of the start/finish straight only — no sightline to the start line or Turn 1 braking zone. Cheapest ticket at the event (~US$220-240 per planner_ticket_tier_cost / existing spoke). 3-day only, uncovered. Sources: oversteer48.com/grandstand-2a-f1-mexico, fanamp.com/tr/best-mexico-grand-prix-grandstands, app/event-pack/[slug]/_hub-and-spoke/spokes/mexico-city-grand-prix/TicketsSpoke.tsx (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier1,
  },
  // ─── tier2 (US$785-1,270 per event_tier_label) ─────────────────────
  {
    seatName: "Grandstand 3A",
    seatType: "grandstand",
    zoneLabel: "Blue Zone — pre-Turn 1 braking zone / Esses",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 2 independent sources — braking zone before the first corner, a genuine overtaking spot as cars decelerate from 300km/h. Uncovered, reserved seating, Blue Zone. No dedicated experience write-up — falls back to the general Ticket Guide. Sources: mexico.gp map-of-the-grandstands page, oversteer48.com zone guide (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Grandstand 4",
    seatType: "grandstand",
    zoneLabel: "Blue Zone — Turns 1-3, Moisés Solana complex",
    actionTags: ["overtaking", "high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 3 independent sources — premium view of the initial turns section, high-speed action on the run into the Esses. Uncovered, reserved seating, Blue Zone. No dedicated experience write-up — falls back to the general Ticket Guide. Sources: mexico.gp map-of-the-grandstands page, thef1spectator.com Mexican GP travel guide, oversteer48.com zone guide (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Grandstand 5",
    seatType: "grandstand",
    zoneLabel: "Blue Zone — Esses, head-on approach to Turn 1",
    actionTags: ["overtaking", "high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 3 independent sources — head-on view of the approach and hard braking into Turn 1, then cars sliding through Turns 2-3 (\"one of the best at the track\" per fanamp.com). Uncovered, reserved seating, Blue Zone. No dedicated experience write-up — falls back to the general Ticket Guide. Sources: mexico.gp map-of-the-grandstands page, fanamp.com, oversteer48.com zone guide (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Grandstand 5A",
    seatType: "grandstand",
    zoneLabel: "Blue Zone — heart of the Moisés Solana complex, Turns 1-3",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 2 independent sources — sits inside the Moisés Solana S-curve complex, same corridor as Grandstands 4/5/6/6A. Uncovered, reserved seating, Blue Zone. No dedicated experience write-up — falls back to the general Ticket Guide. Sources: mexico.gp map-of-the-grandstands page, grandprixgrandtours.com track guide (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Grandstand 6",
    seatType: "grandstand",
    zoneLabel: "Blue Zone — back straight, distant from Turn 1",
    actionTags: ["high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "MODERATE confidence, single primary source (mexico.gp) corroborated on zone/general area only by grandprixgrandtours.com's \"Grandstands 3-6\" grouping — no independently-sourced detail beyond \"back straight acceleration views, distant from Turn 1.\" Uncovered, reserved seating, Blue Zone. No dedicated experience write-up — falls back to the general Ticket Guide. Sources: mexico.gp map-of-the-grandstands page, grandprixgrandtours.com track guide (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Grandstand 6A",
    seatType: "grandstand",
    zoneLabel: "Blue Zone — straight between Turns 3-4",
    actionTags: ["high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 3 independent sources incl. a dedicated oversteer48.com seat-plan page — plastic-pad-on-bench seating, sections 101-107, sun in spectators' faces most of the day, side-on/partially obstructed view as cars flash past on the straight (thef1spectator.com flags this explicitly as a lower-visibility stand vs. its Blue Zone neighbours). Uncovered, reserved seating. No dedicated experience write-up — falls back to the general Ticket Guide. Sources: oversteer48.com/grandstand-6a-f1-mexico, mexico.gp map-of-the-grandstands page, thef1spectator.com (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Grandstand 6B",
    seatType: "grandstand",
    zoneLabel: "Blue Zone — back straight, 300+ km/h section",
    actionTags: ["high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "MODERATE confidence, single primary source (mexico.gp) — back straight, cars at 300+ km/h heading toward the Stadium section. Uncovered, reserved seating, Blue Zone. No dedicated experience write-up — falls back to the general Ticket Guide. Source: mexico.gp map-of-the-grandstands page (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Grandstand 7",
    seatType: "grandstand",
    zoneLabel: "Yellow Zone — Turn 4 entry, Rebaque hairpin",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 2 independent sources — Turn 4 entry into the technical Rebaque hairpin section (El Estadio approach). Uncovered, reserved seating, Yellow Zone. No dedicated experience write-up — falls back to the general Ticket Guide. Sources: mexico.gp map-of-the-grandstands page, grandprixgrandtours.com track guide (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Grandstand 8",
    seatType: "grandstand",
    zoneLabel: "Pink Zone — Turns 4-8",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 2 independent sources — braking and acceleration maneuvers through the Turns 4-8 technical complex. Uncovered, reserved seating, Pink Zone (smallest zone at the circuit). No dedicated experience write-up — falls back to the general Ticket Guide. Sources: mexico.gp map-of-the-grandstands page, oversteer48.com/grandstand-8-f1-mexico (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Grandstand 9",
    seatType: "grandstand",
    zoneLabel: "Pink Zone — inside the circuit, between Turns 6-7",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 2 independent sources incl. a dedicated oversteer48.com seat-plan page — angled toward Turn 6, slow-speed technical section, good photo opportunities of cars at low speed. Access via Gate 9 or 12; Gate 9 sits directly by the Puebla Metro station. Uncovered, reserved seating, Pink Zone (also grants access to Blue Zone). No dedicated experience write-up — falls back to the general Ticket Guide. Sources: oversteer48.com/grandstand-9-f1-mexico, mexico.gp map-of-the-grandstands page (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Grandstand 12",
    seatType: "grandstand",
    zoneLabel: "Yellow Zone — Turns 4-8 technical complex",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "MODERATE confidence, 2 independent secondary sources (grandprixgrandtours.com, fanamp.com) — does not appear on mexico.gp's own grandstand-map page, but that page is independently confirmed non-exhaustive elsewhere too (it also omits Grandstands 3A and 9, both real and independently sourced). Treated as a real, currently-sold stand rather than dropped, on the same reserved/uncovered/Yellow-Zone pattern as its neighbours. No dedicated experience write-up — falls back to the general Ticket Guide. Sources: grandprixgrandtours.com track guide, fanamp.com zone breakdown (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Grandstand 14 Sur",
    seatType: "grandstand",
    zoneLabel: "Grey Zone — Foro Sol stadium, Turns 12-14",
    actionTags: ["podium_atmosphere", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.foroSol,
    sourceNote:
      "HIGH confidence — already curator-reviewed content in the event's own \"Foro Sol — The Loudest Corner in F1\" experience write-up, plus existing TicketsSpoke/MapSpoke content. Elevated grandstand inside the former baseball stadium, partially covered (upper rows), slower technical corners traded for the loudest, most atmospheric section of the circuit; hosts the podium ceremony. Reserved seating, Grey Zone. Sources: mexico-city-gp foro-sol experience, app/event-pack/[slug]/_hub-and-spoke/spokes/mexico-city-grand-prix/TicketsSpoke.tsx + MapSpoke.tsx, oversteer48.com (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Grandstand 15 Norte",
    seatType: "grandstand",
    zoneLabel: "Brown Zone — Foro Sol stadium (GNP Seguros Stadium North), Turns 12-14",
    actionTags: ["podium_atmosphere", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.foroSol,
    sourceNote:
      "HIGH confidence — same sourcing as Grandstand 14 Sur; the two stands form Foro Sol's two halves, split by the current track layout running through the middle of the former baseball stadium. Grandstand 15 sits slightly better positioned for podium-ceremony sightlines per fanamp.com. Partially covered, reserved seating, Brown Zone. Sources: mexico-city-gp foro-sol experience, app/event-pack/[slug]/_hub-and-spoke/spokes/mexico-city-grand-prix/TicketsSpoke.tsx + MapSpoke.tsx, fanamp.com (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  // ─── tier3 (US$1,640-2,166 per event_tier_label) ───────────────────
  {
    seatName: "Main Grandstand 1",
    seatType: "grandstand",
    zoneLabel: "Green Zone — overlooking the start/finish straight and pits",
    actionTags: ["start_grid", "pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — already curator-reviewed content in the event's own TicketsSpoke.tsx (grouped as \"Main Grandstand & Premium Grandstands,\" noted as \"partially covered\"). Individual assigned seats (not benches, per oversteer48.com's Green Zone breakdown), best sightlines of the grid and pit lane on the calendar. Green Zone. No dedicated experience write-up — falls back to the general Ticket Guide. Sources: app/event-pack/[slug]/_hub-and-spoke/spokes/mexico-city-grand-prix/TicketsSpoke.tsx, oversteer48.com Green Zone breakdown, fanamp.com (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Main Grandstand 2",
    seatType: "grandstand",
    zoneLabel: "Green Zone — overlooking the start/finish straight and pits",
    actionTags: ["start_grid", "pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — same sourcing and seating type as Main Grandstand 1; the two stands sit side by side on the main straight. Champions Club (see below) is sold as a hospitality upgrade specifically attached to Main Grandstand 2. Sources: app/event-pack/[slug]/_hub-and-spoke/spokes/mexico-city-grand-prix/TicketsSpoke.tsx, oversteer48.com Green Zone breakdown, f1experiences.com (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Grandstand 10",
    seatType: "grandstand",
    zoneLabel: "Yellow Zone — end of the Presidential (Lake S) curve section, Turns 4-8",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — already curator-reviewed content in TicketsSpoke.tsx (grouped with the \"Premium Grandstands\" tier). Front-facing technical-section view; the most expensive standard grandstand at the circuit (~US$1,126-1,266 per event_tier_label). Uncovered, reserved seating, Yellow Zone. No dedicated experience write-up — falls back to the general Ticket Guide. Sources: app/event-pack/[slug]/_hub-and-spoke/spokes/mexico-city-grand-prix/TicketsSpoke.tsx, mexico.gp map-of-the-grandstands page (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Grandstand 11",
    seatType: "grandstand",
    zoneLabel: "Yellow Zone — near the conclusion of the enclosed Presidential corner, Turns 4-8",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — already curator-reviewed content in TicketsSpoke.tsx (grouped with the \"Premium Grandstands\" tier alongside Grandstand 10 and Main Grandstand). Uncovered, reserved seating, Yellow Zone. No dedicated experience write-up — falls back to the general Ticket Guide. Sources: app/event-pack/[slug]/_hub-and-spoke/spokes/mexico-city-grand-prix/TicketsSpoke.tsx, mexico.gp map-of-the-grandstands page (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  // ─── tier4 (US$8,502-16,338 per event_tier_label — hospitality) ────
  {
    seatName: "Champions Club",
    seatType: "hospitality",
    zoneLabel: "Green Zone — attached to Main Grandstand 2",
    actionTags: ["pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.paddockClub,
    sourceNote:
      "HIGH confidence — official f1experiences.com listing (\"Champions Club | Main 2\"): seat-back seating, TV screen, F1 Insider guest appearances, grid walk, championship trophy photo opportunity, guided paddock tour. Covered seating, Green Zone. Also covered by this event's own \"F1 Paddock Club & Champions Club — Mexico City\" experience write-up. F1 Experiences-branded product only — mexicogp.mx's own local-channel Green Zone hospitality (Main Grandstand Club/Lounge, Platino Plus B) deliberately excluded per founder instruction, 27 Sep 2026. Sources: f1experiences.com/2026-mexico-city-grand-prix, mexico-city-gp-paddock-club experience (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Gordon Ramsay's La Terraza",
    seatType: "hospitality",
    zoneLabel: "Estadio/stadium section",
    actionTags: ["pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — official f1experiences.com listing (\"Gordon Ramsay at F1® La Terraza\"): covered seating, TV screen, panoramic race views, 3-day paddock access, pit lane walk, guided track tour, podium celebration access, exclusive tasting experiences, \"The Club Lounge Presented by American Express.\" F1 Experiences-branded product only — mexicogp.mx's own similarly-positioned \"Terraza Club\" (Spanish name, Yellow Zone, non-assigned tables) deliberately excluded per founder instruction, 27 Sep 2026, since it could not be confirmed to be the identical product. No dedicated experience write-up — falls back to the general Ticket Guide. Source: f1experiences.com/2026-mexico-city-grand-prix (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Paddock Club",
    seatType: "hospitality",
    zoneLabel: "Green Zone / Estadio — pit-lane hospitality",
    actionTags: ["pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.paddockClub,
    sourceNote:
      "HIGH confidence — folds together f1experiences.com's three separately-listed 2026 Paddock Club suite variants (Audi Revolut F1 Team Suite, TGR Haas F1 Team Suite, Estadio Level 2) into one seat, per founder instruction (27 Sep 2026) — these are the same underlying Paddock Club product sold team-by-team/zone-by-zone, not genuinely distinct experiences the way House 44 is. All three variants share: covered and seat-back seating, TV screen, pit lane walk, team appearances, garage tour with exclusive gift (team suites) or covered seat-back seating with pit lane walk (Estadio Level 2). Also covered by this event's own \"F1 Paddock Club & Champions Club\" experience write-up and the existing TicketsSpoke.tsx pricing (US$8,502 from, per event_tier_label). Sources: f1experiences.com/2026-mexico-city-grand-prix, mexico-city-gp-paddock-club experience, app/event-pack/[slug]/_hub-and-spoke/spokes/mexico-city-grand-prix/TicketsSpoke.tsx (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "House 44 at F1 Paddock Club",
    seatType: "hospitality",
    zoneLabel: "Estadio — stadium section",
    actionTags: ["pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — already curator-reviewed pricing in TicketsSpoke.tsx (\"House 44 at F1 Paddock Club™\", from US$16,338, 3-day — the most expensive product at the event). Soho House x Lewis Hamilton-branded suite set in Estadio, custom Soho House cocktail menu, curated display of Hamilton career memorabilia (helmets, Plus 44 merch), live DJ sets/acoustic sessions, guided F1 Paddock tour, priority access to the post-race podium celebration (subject to availability). Distinct enough from the folded-in Paddock Club product to keep as its own seat — same reasoning Brazilian/Singapore GP used for their own top hospitality outlier. The real, sourced price outlier within tier4 — see prestige-tiebreaker note in script header. Sources: sohohouse.com/en-us/house-notes House 44 Mexico City feature, house44atf1paddockclub.com/2026-mexico-city-grand-prix, app/event-pack/[slug]/_hub-and-spoke/spokes/mexico-city-grand-prix/TicketsSpoke.tsx (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Speed Lounge",
    seatType: "hospitality",
    zoneLabel: "Green Zone (Main Grandstand) or Yellow Zone — add-on package",
    actionTags: ["pit_lane", "start_grid"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "LOWER confidence — confirmed real, currently-sold via 2 independent official-channel listing pages (tickets.formula1.com's own \"Main Grandstand + Speed Lounge Package\" and a koobit.com ticket listing referencing the same tickets.formula1.com product), sold as an add-on layered onto a Main Grandstand ticket rather than a standalone seat — gourmet meals and bar service alongside the grandstand ticket. No price found for either Green or Yellow Zone Speed Lounge despite searching; existence, zone, and add-on structure only. No dedicated experience write-up — falls back to the general Ticket Guide. Sources: tickets.formula1.com/en/ah-4861-mexico-additional-hospitality/mx-main-grandstand-speed-lounge-package, koobit.com Mexico City GP ticket listing (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Platinum Plus",
    seatType: "hospitality",
    zoneLabel: "Green Zone — start of the main straight",
    actionTags: ["pit_lane", "start_grid"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "LOWER confidence — confirmed real via 2 independent official-channel listing pages (koobit.com's \"VIP Platinum Plus\" ticket listing, cross-referenced against a tickets.formula1.com-sourced description), private-suite-style hospitality at the start of the main straight with views of the start/finish line and pits. No price found despite searching; existence, zone, and general feature set only. No dedicated experience write-up — falls back to the general Ticket Guide. Sources: koobit.com Mexico City GP ticket listing, tickets.formula1.com hospitality search results (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Skybox",
    seatType: "hospitality",
    zoneLabel: "Green Zone",
    actionTags: ["pit_lane", "start_grid"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "LOWER confidence — existence and Green Zone location confirmed via search results referencing tickets.formula1.com's own hospitality listings, but no dedicated page could be directly fetched and no price or further descriptive detail was found. Genuinely the weakest-sourced seat in this build — kept rather than dropped since it is a real, named, officially-sold product (not access-gated or discontinued, as far as could be determined), but flagged here as the one seat where the sourcing bar is thinnest. No dedicated experience write-up — falls back to the general Ticket Guide. Source: tickets.formula1.com hospitality search results (27 Sep 2026).",
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

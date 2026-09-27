import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

// Note: DIRECT_URL times out from this machine (see feedback_db_migration.md)
// — use DATABASE_URL (transaction pooler, port 6543) instead.
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

// circuit_seating_profile seed for Albert Park Grand Prix Circuit
// (Australian GP 2027) — built for the Ticket Intelligence app ($10
// standalone, "which seat fits your preferences" decision tool). Built via
// the ticket-intelligence-researcher skill (see
// C:\Users\HP\.claude\skills\ticket-intelligence-researcher\SKILL.md).
// Researched 27 Sep 2026. By far the deepest inventory seeded to date — 28
// seats, vs. ~9 previously described anywhere in this event's own content.
//
// GAP FOUND (same class as the Brazilian GP pilot incident, skill §1): the
// existing planner_ticket_tier_cost tier2 label already named 12 distinct
// grandstands (Button, Clarke, Turn 12, Vettel, Waite, Webber, Stewart,
// Senna, Schumaker, Ricciardo, Lauda, Hill, American Express — "Turn 12" and
// "Lauda" are confirmed the SAME seat, Lauda sits at Turn 12, so this is 12
// not 13 distinct names) and tier4 named 9 hospitality products
// collectively, but TicketsSpoke.tsx's own TIER_META only ever described 4
// grandstands individually (Vettel, Brabham, Fangio, Piastri) and one
// hospitality group. The event's own "F1 Paddock Club & Trackside
// Hospitality" experience write-up turned out to independently name and
// describe 8 further AGPC-branded suites (Lakeside Studio, The Apex, Race
// Cube, Slipstream, T8 Lakeside, The Albert, American Express Lounge, Red
// Bull Racing Suite) plus Champions Club, none of which existed as their
// own row anywhere else.
//
// Real inventory — 28 seats: Park Pass (GA), 12 tier2 grandstands, 5 tier3
// grandstands (Fangio, Piastri, Prost, Jones, plus Brabham — see below),
// 10 hospitality products (Paddock Club, Champions Club, 8 AGPC
// single-day suites).
//
// BRABHAM SPECIAL CASE (2027 structural change, per this event's own
// Ticket Guide + Brabham experience write-ups): starting 2027, Brabham
// Grandstand seating is reserved exclusively for Albert Park Circuit Club
// Premium Members — a new membership tier (A$1,275 adult) sold SEPARATELY
// from the grandstand ticket itself (A$910-1,090 adult), a genuine
// structural change from previous years when Brabham was an ordinary
// tier2 stand with no such gate. Founder correction, 27 Sep 2026: linked
// to tier3, not tier2 — the real COMBINED cost a fan actually pays
// (grandstand ticket + mandatory membership, ~A$2,185-2,365 adult) sits
// well above tier2's ordinary US$330-400 band and in line with tier3's
// premium grandstands, so tier3 is the ordinally-correct placement even
// though the grandstand ticket alone would otherwise look like a tier2
// price. Not excluded outright (unlike a bank-branded stand) since any fan
// CAN buy the membership, it's just an extra real cost layered on top —
// flagged via sourceNote rather than silently treated as an ordinary
// open-sale seat.
//
// ORDINAL TIER MAPPING (§3): all 12 named tier2 grandstands slot into the
// existing tier2 row (US$330-400) — the label already named all of them.
// Fangio/Piastri/Prost/Jones slot into the existing tier3 row (US$485-625)
// — also already named. Brabham ALSO slots into tier3, not tier2 (founder
// correction, 27 Sep 2026) — see the Brabham special-case note below for
// why its real combined cost belongs there. Paddock Club, Champions Club,
// and the 8 AGPC suites all slot into the existing tier4 row
// (US$1,450-4,040) — Paddock Club's real price (well past US$15,000 per
// the event's own experience write-up) exceeds tier4's seeded ceiling,
// which is fine per skill §3 — ordinal rank is what matters, not a
// fabricated wider band.
//
// COVERED: per AGPC's own official rule (corroborated across multiple
// oversteer48.com per-stand pages), only 6 stands offer ANY covered
// premium seating: Fangio, Piastri, Prost, Ricciardo, Schumacher, Senna —
// each seeded with covered=true (their premium upper tier), reflecting
// that they DO have a covered option, unlike stands with none at all.
// Every other named grandstand (Button, Clark, Vettel, Waite, Webber,
// Stewart, Hill, American Express, Lauda, Jones, Brabham) is fully
// uncovered per its own dedicated oversteer48.com page — Jones's covered
// area is VIP-suite-only, not part of the standard grandstand ticket, so
// seeded as covered=false consistent with the other standard-ticket-only
// stands. Park Pass — uncovered (existing GA experience write-up). All 10
// hospitality products — fully covered (F1 Experiences/AGPC hospitality
// standard, corroborated per-product in the event's own Paddock Club
// experience write-up).
//
// RESERVED SEATING: every named grandstand has assigned sections/rows —
// corroborated across every oversteer48.com per-stand page checked. Park
// Pass is the only unreserved product (existing GA experience: "No
// reserved seat"). All 10 hospitality products are reserved.
//
// SINGLE-DAY AVAILABILITY: per the event's own Ticket Guide experience,
// Park Pass and all grandstands are genuinely sold as EITHER single-day OR
// multi-day passes (Park Pass "from around US$160 for a single day";
// grandstands "run roughly US$330-400 for a single day") — a real
// difference from most other seeded F1 events, where every ticket is
// multi-day only. singleDayAvailable: true for Park Pass and all 17
// grandstands. The 8 AGPC hospitality suites are explicitly "sold as
// single-day Sunday passes" per the Paddock Club experience — also true.
// Paddock Club and Champions Club are explicitly "multi-day, pit-lane-
// adjacent packages" only — singleDayAvailable: false for those two.
//
// MIN AGE: no published age restriction found for any seat despite
// searching — left null throughout.
//
// linkedExperienceId populated for Park Pass, Vettel, Brabham, Fangio,
// Piastri, and Paddock Club (this event's own 6 dedicated write-ups). The
// remaining 22 seats have no dedicated write-up and fall back automatically
// to the general "AusGP Ticket Guide" experience via
// getFallbackTicketExperienceSlug's title-pattern match.
//
// PRESTIGE-TIEBREAKER CHECK (§6): Paddock Club and Champions Club share
// near-identical actionTags (pit_lane, podium_atmosphere) within tier4 and
// could tie against each other and the 8 AGPC suites. Paddock Club is the
// real, sourced price outlier (well past US$15,000 per the event's own
// experience write-up, vs. Champions Club's "meaningfully lower price" and
// the AGPC suites' US$1,735-5,655 range) — it already inherits the GLOBAL
// "Paddock Club" 5-star override in
// PRESTIGE_SEAT_NAMES/STAR_OVERRIDE_BY_SEAT_NAME from the Brazilian GP
// build (same (seatName)-only-keying gap flagged on every event since —
// see project_qatar_gp_ticket_intelligence.md,
// project_abu_dhabi_gp_ticket_intelligence.md for prior instances).
// Directionally correct here too — no map changes made.

const EVENT_ID = "64792f75-c009-4070-a12b-23d7bd0a3a7f"; // Australian Grand Prix 2027

// Real experience IDs for the seats with their own dedicated write-up
// (queried 27 Sep 2026).
const EXP = {
  parkPass: "63e53bac-532b-4f3f-bebd-c6423c411acb", // general-admission-park-pass-hills
  vettel: "2fd7cd6c-5cbd-4f99-8ab4-20672e851c16", // vettel-stand-turns-11-12
  brabham: "b94fb0b2-01f5-4000-a7c4-2fa036054e59", // brabham-grandstand-turns-1-2
  fangio: "e091addf-34d9-4978-8b06-6735f9155e3d", // fangio-grandstand-albert-park
  piastri: "7d040d4b-46d9-4747-a789-352ab09d8f20", // piastri-grandstand-albert-park
  paddockClub: "3bf2bfd2-33dd-4845-8dd4-25b5d9877a91", // f1-paddock-club-trackside-hospitality
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
  // ─── tier1 (US$160, single-day) ─────────────────────────────────────
  {
    seatName: "Park Pass (General Admission)",
    seatType: "festival_lawn",
    zoneLabel: "Walk the whole 5.3km lakeside circuit — 14 numbered zones (D-N) plus elevated mounds at Turns 2, 8, 9",
    actionTags: [],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: false,
    linkedExperienceId: EXP.parkPass,
    sourceNote:
      "HIGH confidence — this event's own dedicated \"General Admission — The Park Pass & Hill Spots\" experience write-up. Full circuit mobility, 14 numbered track-level zones (D-N), 3 elevated grass mounds with guaranteed sightlines (Turn 2 inside, Turn 8 outside, Turn 9 outside/\"Brocky's Hill\"). No reserved seat, no cover. Genuinely available as a single-day ticket (~US$160) or multi-day, per the event's own Ticket Guide experience. Source: general-admission-park-pass-hills experience (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier1,
  },
  // ─── tier2 (US$330-400, single-day available) ───────────────────────
  {
    seatName: "Vettel Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turn 11 — DRS-fed slow corner, one of the circuit's real overtaking spots",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: EXP.vettel,
    sourceNote:
      "HIGH confidence — this event's own dedicated \"Vettel Stand\" experience write-up. Turn 11's braking battle off a DRS zone, small stand (12 rows, no row I), watching through safety fencing rather than over it. Uncovered, reserved. Source: vettel-stand-turns-11-12 experience (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Button Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turn 8 — acceleration zone exiting Turn 7",
    actionTags: ["high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — oversteer48.com's dedicated Button Grandstand page: overlooks Turn 8 acceleration zone, narrow direct sightline (relies on the big screen for most of the race), folding plastic chairs, sections A-D/rows A-Q, uncovered, reserved. One of the cheapest stands at the circuit. No dedicated experience write-up — falls back to the general Ticket Guide. Source: oversteer48.com/button-grandstand (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Clark Grandstand",
    seatType: "grandstand",
    zoneLabel: "Between Turns 8-9 — high-speed kinks, lake and skyline backdrop",
    actionTags: ["high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — oversteer48.com's dedicated Clark Grandstand page: high-speed kinks between Turns 8-9, Albert Park Lake and Melbourne skyline view, sections A-C/rows A-N, plastic folding chairs, uncovered, reserved. One of the cheapest grandstands, sells out quickly. No dedicated experience write-up — falls back to the general Ticket Guide. Source: oversteer48.com/clark-grandstand (27 Sep 2026). Note: planner_ticket_tier_cost's event_tier_label spells this \"Clarke\" — oversteer48.com, grandprix.com.au, and every independent source confirm the real name is \"Clark\" (after Jim Clark), so seeded under the correct spelling.",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Waite Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turns 9-10 — high-speed chicane beside Brocky's Hill",
    actionTags: ["high_speed", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — oversteer48.com's dedicated Waite Grandstand page: cars passing close by at the high-speed Turns 9-10 chicane, sections A-D/rows A-T, fixed-back chairs, uncovered, reserved. One of the cheapest grandstands. No dedicated experience write-up — falls back to the general Ticket Guide. Source: oversteer48.com/waite-grandstand (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Webber Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turn 11 — inside, late-braking zone at the end of the longest straight",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 2 independent sources — inside Turn 11 at the end of Albert Park's longest straight, a late-braking hotspot. Explicitly confirmed NOT among the circuit's 6 covered-premium stands (Fangio/Piastri/Prost/Ricciardo/Schumacher/Senna only). Uncovered, reserved on Friday-Sunday (Thursday unreserved circuit-wide). One of the cheapest grandstands. No dedicated experience write-up — falls back to the general Ticket Guide. Sources: oversteer48.com/webber-grandstand, grandprix.com.au product listing (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Stewart Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turn 5 — corner and following straight",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — oversteer48.com's dedicated Stewart Grandstand page: Turn 5 and the exit straight, seat selection available, plastic chairs, uncovered, reserved. One of the cheaper stands. No dedicated experience write-up — falls back to the general Ticket Guide. Source: oversteer48.com/stewart-grandstand (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Senna Grandstand",
    seatType: "grandstand",
    zoneLabel: "Outside the pit straight, near the final corner",
    actionTags: ["podium_atmosphere", "pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — oversteer48.com's dedicated Senna Grandstand page: outside the pit straight, best seats (sections A-C, row M+) closest to the final corner. One of the circuit's 6 stands with a genuine covered premium tier (back half, grown for 2026) — seeded covered=true reflecting that option exists, standard rows remain uncovered. Reserved Friday-Sunday. No dedicated experience write-up — falls back to the general Ticket Guide. Source: oversteer48.com/senna-grandstand (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Schumacher Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turn 13 braking/entry through Turn 14 apex",
    actionTags: ["technical_corner", "overtaking"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — oversteer48.com's dedicated Schumacher Grandstand page: braking and entry at Turn 13 through the Turn 14 apex, sections A-G, standard rows A-N uncovered plus a genuine covered premium tier (rows AA-NN, grown for 2026) — one of the circuit's 6 covered-premium stands, seeded covered=true. Reserved. Source: oversteer48.com/schumacher-grandstand (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Ricciardo Grandstand",
    seatType: "grandstand",
    zoneLabel: "Inside Turn 3, extending to Turn 4",
    actionTags: ["technical_corner", "overtaking"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — oversteer48.com's dedicated Ricciardo Grandstand page: inside Turn 3 through Turn 4, sections A-G, sections A-D have a genuine covered premium tier (rows K-T, one of the circuit's 6 covered-premium stands) — seeded covered=true. Popular stand, sells out fast. Reserved. No dedicated experience write-up — falls back to the general Ticket Guide. Source: oversteer48.com/ricciardo-grandstand (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Lauda Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turn 12 — fast right-hander, ~220km/h",
    actionTags: ["high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 2 independent sources — this event's own Vettel experience write-up (\"Lauda — facing back toward the city skyline — is the stand built for [Turn 12's high-speed apex]\") corroborated by oversteer48.com's dedicated Lauda Grandstand page (Turn 12, best seats rows M-R in Section A). Not among the circuit's 6 covered-premium stands — uncovered, reserved. Confirmed the same seat as planner_ticket_tier_cost's separately-listed \"Turn 12\" label entry, not a distinct stand (both name the same Turn 12 grandstand). No dedicated experience write-up — falls back to the general Ticket Guide. Sources: vettel-stand-turns-11-12 experience, oversteer48.com/lauda-grandstand (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Hill Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turn 3 — approach and overtaking action",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — oversteer48.com's dedicated Hill Grandstand page: Turn 3 approach with overtaking visibility, sections A-D, plastic seats, uncovered, reserved. Notably higher-priced than most other tier2 stands per the same source (\"pretty high,\" comparable to Ricciardo). No dedicated experience write-up — falls back to the general Ticket Guide. Source: oversteer48.com/hill-grandstand-australia (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "American Express Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turn 4 left-hander, with Section C extending toward Turn 5",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — oversteer48.com's dedicated AmEx Grandstand page: Turn 4 left-hander, 3 sections with different sub-views (A: Turns 3-4, B: Turn 4 apex, C: Turn 4 through 5), plastic chairs, uncovered, reserved. Expected to sell out quickly. Distinct from the American Express Lounge hospitality suite (see tier4). No dedicated experience write-up — falls back to the general Ticket Guide. Source: oversteer48.com/amex-grandstand-australian-grand-prix-melbourne (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  // ─── tier3 (US$485-625, single-day available) ───────────────────────
  {
    seatName: "Brabham Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turns 1-2 — first-lap chaos zone, opposite Jones",
    actionTags: ["overtaking", "start_grid"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: EXP.brabham,
    sourceNote:
      "HIGH confidence — this event's own dedicated \"Brabham Grandstand\" experience write-up. Inside Turns 1-2, tracks cars longer through the apex than Jones opposite it, genuine first-lap-chaos seat. STRUCTURAL CHANGE FOR 2027 (flagged, not excluded): seating is now reserved exclusively for Albert Park Circuit Club Premium Members, a new membership tier (A$1,275 adult) sold separately from the grandstand ticket (A$910-1,090 adult) — criticized in Australian motorsport press as a price hike dressed as a loyalty tier. Linked to tier3, not tier2 (founder correction, 27 Sep 2026): the real combined cost a fan actually pays (grandstand ticket + mandatory membership, ~A$2,185-2,365 adult) sits well above tier2's ordinary band and in line with tier3's premium grandstands — the membership gate is a real access condition worth surfacing, not grounds for exclusion (unlike a genuinely non-purchasable bank-branded seat). Uncovered, reserved. Source: brabham-grandstand-turns-1-2 experience (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Fangio Grandstand",
    seatType: "grandstand",
    zoneLabel: "Main straight, opposite the pits — grid, pit stops, podium",
    actionTags: ["start_grid", "pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: EXP.fangio,
    sourceNote:
      "HIGH confidence — this event's own dedicated \"Fangio Grandstand\" experience write-up. Opposite the pit lane, podium in eyeline, grid walk visible. 2026 rebuild added a genuine covered premium tier (sections AA-NN) to roughly half the seats — one of the circuit's 6 covered-premium stands. Turn 1 and the final corner blocked by safety fencing. Reserved Friday-Sunday, unreserved Thursday. Source: fangio-grandstand-albert-park experience (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Piastri Grandstand",
    seatType: "grandstand",
    zoneLabel: "Main straight, opposite the McLaren garage — Albert Park's newest stand (2026)",
    actionTags: ["start_grid", "pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: EXP.piastri,
    sourceNote:
      "HIGH confidence — this event's own dedicated \"Piastri Grandstand\" experience write-up. Opened 2026, carved from the end of the former full-length Fangio Grandstand, opposite the McLaren garage. Same start-finish/pit-lane/podium view and Turn-1/final-corner fencing trade-off as Fangio; covered premium tier (rows AA-NN) — one of the circuit's 6 covered-premium stands. The most in-demand stand at the circuit given the home-crowd connection to Oscar Piastri. Reserved. Source: piastri-grandstand-albert-park experience (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Prost Grandstand",
    seatType: "grandstand",
    zoneLabel: "Turn 14 (final corner), looking down the pit straight",
    actionTags: ["technical_corner", "pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — oversteer48.com's dedicated Prost Grandstand page: Turns 13-14 plus a view straight down the pit straight, standard rows uncovered, genuine covered premium tier (grown for 2026, now the back half) — one of the circuit's 6 covered-premium stands. Reserved. No dedicated experience write-up — falls back to the general Ticket Guide. Source: oversteer48.com/prost-grandstand (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Jones Grandstand",
    seatType: "grandstand",
    zoneLabel: "End of the start/finish straight through Turn 1 and most of Turn 2",
    actionTags: ["start_grid", "overtaking"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence, 2 independent sources — this event's own MapSpoke.tsx/Brabham experience copy (opposite Brabham, watching first-lap Turns 1-2 action) corroborated by oversteer48.com's dedicated Jones Grandstand page (end of start/finish straight, all of Turn 1, most of Turn 2, sections A-F). Standard ticket is uncovered — only a separate VIP suite at the top of the stand is covered, seeded covered=false consistent with the standard grandstand product (same treatment as the Jones-adjacent VIP note). One of the most expensive tier3 stands. Reserved. No dedicated experience write-up — falls back to the general Ticket Guide. Sources: oversteer48.com/jones-grandstand, brabham-grandstand-turns-1-2 experience (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  // ─── tier4 (US$1,450-4,040 seeded band; real prices vary, some exceed
  // it — ordinal only, see script header) ──────────────────────────────
  {
    seatName: "Paddock Club",
    seatType: "hospitality",
    zoneLabel: "Above the pit lane, overlooking the start/finish straight",
    actionTags: ["pit_lane", "start_grid"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.paddockClub,
    sourceNote:
      "HIGH confidence — this event's own dedicated \"F1 Paddock Club & Trackside Hospitality\" experience write-up. Above the pit lane, guided pit lane walk, all-day grazing plus formal buffet lunch (seasonal Australian produce), free-flowing champagne/wine, rooftop tiered deck over the Walker Straight and city skyline. Multi-day (full race weekend) package, running well past US$15,000 — the real, sourced price outlier within tier4 (see prestige-tiebreaker note in script header); already inherits the global PRESTIGE_SEAT_NAMES/STAR_OVERRIDE_BY_SEAT_NAME 5-star treatment, directionally correct here too. Source: f1-paddock-club-trackside-hospitality experience (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Champions Club",
    seatType: "hospitality",
    zoneLabel: "Main Straight, below Paddock Club",
    actionTags: ["podium_atmosphere", "start_grid"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — this event's own Paddock Club experience write-up: sits just below Paddock Club on the Main Straight, trades the pit lane walk for a still-premium trackside seat with open bar and full catering, at a meaningfully lower price than Paddock Club. Multi-day package. Fully covered. No dedicated experience write-up of its own — falls back to the general Ticket Guide. Source: f1-paddock-club-trackside-hospitality experience (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Lakeside Studio",
    seatType: "hospitality",
    zoneLabel: "Carousel section, overlooking Albert Park Lake",
    actionTags: [],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — this event's own Paddock Club experience write-up. AGPC's own (not third-party) suite — intimate, indoor gourmet-dining retreat overlooking Albert Park Lake at the Carousel section. Single-day (Sunday) pass, from A$1,735 — the AGPC suites' entry-level option. Fully covered/indoor. No dedicated experience write-up — falls back to the general Ticket Guide. Source: f1-paddock-club-trackside-hospitality experience (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "The Apex",
    seatType: "hospitality",
    zoneLabel: "Near Gate 10, overlooking the Turn 12 battle",
    actionTags: ["technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — this event's own Paddock Club experience write-up. AGPC's own suite — undercover, beer-garden-style, centralised bar, views over the Turn 12 battle for the final corners, short walk from Gate 10. Single-day (Sunday) pass, from A$2,020. Fully covered. No dedicated experience write-up — falls back to the general Ticket Guide. Source: f1-paddock-club-trackside-hospitality experience (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Race Cube",
    seatType: "hospitality",
    zoneLabel: "Infield at Turn 11",
    actionTags: ["technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — this event's own Paddock Club experience write-up. AGPC's own suite — modern three-level structure on the Turn 11 infield, panoramic lower deck, rooftop bar over the Melbourne skyline. Single-day (Sunday) pass, from A$2,520. Fully covered. No dedicated experience write-up — falls back to the general Ticket Guide. Source: f1-paddock-club-trackside-hospitality experience (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Slipstream",
    seatType: "hospitality",
    zoneLabel: "Turn 10, end of the circuit's fastest straight",
    actionTags: ["high_speed"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — this event's own Paddock Club experience write-up. AGPC's own suite — 530-square-metre structure right at Turn 10, end of the circuit's fastest straight. Single-day (Sunday) pass, from A$3,845. Fully covered. No dedicated experience write-up — falls back to the general Ticket Guide. Source: f1-paddock-club-trackside-hospitality experience (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "T8 Lakeside",
    seatType: "hospitality",
    zoneLabel: "Infield at Turn 8, overlooking the Turn 8-9 sweeper and the lake",
    actionTags: ["high_speed", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — this event's own Paddock Club experience write-up. AGPC's own suite — open-fronted, three-level building on the Turn 8 infield, rooftop viewing balcony over both the lake and the fast Turn 8-9 sweeper. Single-day (Sunday) pass, from A$3,845 (tied with Slipstream as the mid-tier AGPC suite price point). Fully covered. No dedicated experience write-up — falls back to the general Ticket Guide. Source: f1-paddock-club-trackside-hospitality experience (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "The Albert",
    seatType: "hospitality",
    zoneLabel: "Main Straight, start of the lap",
    actionTags: ["start_grid"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — this event's own Paddock Club experience write-up. AGPC's own suite — Main Straight, built around race-day atmosphere right at the start of the lap. Single-day (Sunday) pass, from A$4,405. Fully covered. No dedicated experience write-up — falls back to the general Ticket Guide. Source: f1-paddock-club-trackside-hospitality experience (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "American Express Lounge",
    seatType: "hospitality",
    zoneLabel: "Beside the Paddock entrance, overlooking Melbourne Walk and driver arrivals",
    actionTags: ["pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — this event's own Paddock Club experience write-up. AGPC's own suite — three-level venue beside the Paddock entrance, views over Melbourne Walk and driver arrivals, dining from Grill Americano and the Ritz-Carlton Bar. Single-day (Sunday) pass, from A$5,495 — the second-most expensive AGPC suite. Fully covered. Distinct from the standalone American Express Grandstand (tier2). No dedicated experience write-up — falls back to the general Ticket Guide. Source: f1-paddock-club-trackside-hospitality experience (27 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Red Bull Racing Suite",
    seatType: "hospitality",
    zoneLabel: "Above the team garages",
    actionTags: ["pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — this event's own Paddock Club experience write-up. AGPC's own suite — Red Bull Racing's own hospitality suite above the team garages, includes a pit lane walk and driver appearances. Single-day (Sunday) pass, from A$5,655 — the single most expensive AGPC suite, though still below Champions Club/Paddock Club's multi-day pricing. Fully covered. No dedicated experience write-up — falls back to the general Ticket Guide. Source: f1-paddock-club-trackside-hospitality experience (27 Sep 2026).",
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

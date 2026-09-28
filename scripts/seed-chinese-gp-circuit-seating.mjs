import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// Chinese GP (Shanghai) Ticket Intelligence seat seeding — 27 Sep 2026, via
// ticket-intelligence-researcher skill.
//
// §1 full-inventory check: this event's own planner_ticket_tier_cost labels
// name 4 tiers (GA Zones C/F/J/L; Grandstand E/H/K; Grandstand A/B; F1
// Paddock Club). This pack's own seeded "Chinese GP Ticket Guide" and
// TicketsSpoke.tsx cover A/B/H/K/GA/Paddock Club, but not Grandstand E or
// any hospitality product beyond Paddock Club. Full research (WebSearch +
// WebFetch, official + independent sources) found 15 real, currently-named
// seats: 4 GA zones, 6 grandstands (incl. Grandstand E and an A-Platinum
// sub-tier), 5 hospitality products.
//
// PRIMARY SOURCES:
// - formula1shanghai.com/en/tickets and /en/map-of-the-grandstands-28 —
//   circuit's own official 2027 ticket product list. Confirms A (Platinum/
//   High Gold/Low Silver sub-tiers), B, H, K as the only 2027 grandstand
//   pages live as of this writing. Grandstand E not yet listed for 2027
//   specifically (2027 page hasn't been published for it), but see below.
// - formula1.com's own article "tickets-on-sale-for-2026-chinese-grand-prix"
//   — confirms Grandstand E is real, "newly configured," Turn 11-13 view,
//   shuttle service, 3-day-only. This corrects and supersedes the earlier
//   Turn 11-13 claim this pack's build-status memory had flagged and
//   dropped (that one was sourced only from formula1shanghai.com via an
//   unreliable WebSearch AI-summary; THIS claim is sourced directly to
//   formula1.com's own official article, a materially stronger source).
//   Also confirms GA "C/F/J Grass Bank areas" — resolves a naming-collision
//   risk against the Shanghai gov page's looser "Grandstand C/F/J" phrasing
//   (that phrasing is NOT followed here — GA zones are seeded as
//   festival_lawn, not grandstand, matching formula1.com's own wording and
//   this pack's existing GA tier label).
// - english.shanghai.gov.cn (Shanghai municipal government's official
//   English sports-events page, describing 2026, the most recently held
//   edition) — confirms Grandstand E's capacity (4,000+), shuttle access,
//   3-day-only status, and 4 new-for-2026 hospitality products: T16 Club,
//   T1 Club, Grandstand Club (围场俱乐部/主看台会所), Paddock Club.
// - shanghai.gov.cn Chinese-language sports pages + a circuit-guide blog
//   (blog.boxboxd.fun) — cross-referenced to source T1 Club (attached to
//   Grandstand B at Turn 1, dining service) and Grandstand Club (VIP seats
//   at the Main Grandstand/A, pit-lane-adjacent, driver photo/autograph
//   priority — a real, distinct product from Paddock Club despite one
//   source's loose framing).
// - Independent guides: sitwhere.com, koobit.com, grandprixgrandtours.com —
//   corroborate GA zone locations (2+ sources each) and grandstand
//   locations. motorsporttickets.com excluded throughout per standing
//   founder instruction (skill §0.5) — appeared in search results but
//   never cited.
//
// COVERED STATUS — founder-confirmed directly, 27 Sep 2026: H, K, and T16
// Club are covered; Grandstand B and Grandstand E are NOT covered (founder
// verified B specifically against 2 independent sources). All other
// covered values either match official per-stand sourcing or are left NULL
// where genuinely unconfirmed (never guessed).
//
// CONFIDENCE — two tiers, both honestly labeled in each seat's sourceNote:
// 1. HIGH: GA C/F/J/L, Grandstand A (High Gold)/B/H/K/E — official circuit/
//    F1 source plus independent corroboration, or founder-confirmed fact
//    (covered status).
// 2. LOWER, ordinal-only tier placement: Grandstand A Platinum (real
//    sub-tier, no independent 2027 price), Gordon Ramsay at the F1 Paddock,
//    T16 Club, T1 Club, Grandstand Club — all real, named 2026 products
//    with confirmed existence but single-source-cluster sourcing (English:
//    ticketing.formula1.com hospitality waitlist page; Chinese: Shanghai
//    gov + one circuit blog) and no confirmed 2027 continuation/pricing.
//
// TIER STRUCTURE (§3, ordinal only): GA -> tier1 (matches existing "General
// Admission" label). Grandstand H/K/E -> tier2 (matches existing
// "Grandstand E, H, K" label — E's real single-day restriction differs from
// H/K's, but this is captured per-seat via singleDayAvailable, not by
// changing the shared tier; per founder direction 27 Sep 2026, the
// existing tier2 DB label is left as-is in this session, scoped to
// circuit_seating_profile only). Grandstand A (High Gold)/A Platinum/B ->
// tier3 (matches "Grandstand A, B" label; Platinum ordinal-only within the
// same band, real price likely higher but unconfirmed). T1 Club -> tier3
// too (founder direction 27 Sep 2026: it's fundamentally a Grandstand B
// seat with added dining, not a separate premium product — ordinal rank
// should reflect its base seat, not be inflated to hospitality pricing).
// F1 Paddock Club, Gordon Ramsay at the Paddock, T16 Club, Grandstand Club
// -> tier4 (matches "F1 Paddock Club" label; the latter three ordinal-only,
// real prices unconfirmed).
//
// EXCLUDED, not seeded: none on access-gating grounds. Deliberately
// excluded from the inventory entirely (not even a placeholder row) after
// failing even the LOWER-confidence bar: none remaining — T1 Club and
// Grandstand Club were initially excluded for thin sourcing, then
// re-researched per founder instruction and found to clear LOWER
// confidence with a real location + description (see above).
//
// PRESTIGE_SEAT_NAMES collision (§6) — "Paddock Club" is a GLOBAL,
// name-only key in scoreSeats.ts (already set from Japanese GP/others).
// Chinese GP's F1 Paddock Club is priced at US$17,145/person (3-day,
// TicketsSpoke.tsx's own real 2026-proxy figure) — the highest tier4 figure
// of any event seeded so far and, by a wide margin, this event's own real
// price outlier too. Founder-confirmed 27 Sep 2026: the inherited global
// tiebreaker is directionally correct here, not a false inherit — no code
// change needed.
//
// linkedExperienceId set for every seat with a real dedicated write-up (6
// grandstand/GA/hospitality experiences already seeded for this pack) —
// null for Grandstand E, Gordon Ramsay at the Paddock, T16 Club, T1 Club,
// Grandstand Club, and Grandstand A Platinum, none of which have their own
// dedicated experience; the result page falls back to the general Ticket
// Guide experience for these per §2.5.
//
// INSERT ONLY — per CLAUDE.md's standing rule, no delete script exists or
// will be written for these rows.

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d"; // Chinese Grand Prix 2027

const tierRows = await sql`
  SELECT id, tier FROM planner_ticket_tier_cost WHERE sporting_event_id = ${EVENT_ID}
`;
const TIER = Object.fromEntries(tierRows.map((r) => [r.tier, r.id]));
for (const t of ["tier1", "tier2", "tier3", "tier4"]) {
  if (!TIER[t]) throw new Error(`Missing expected ${t} row for event ${EVENT_ID} — aborting.`);
}

const EXP = {
  generalAdmission: "54cba15e-b6b8-4467-931b-a671cfe3a711", // "General Admission — Shanghai's Roaming Ticket"
  grandstandA: "48b26461-4934-4fe2-9626-c5d1e2ab0e47", // "Grandstand A — Shanghai's Main Straight, Start to Podium"
  grandstandB: "08dc8873-a685-4b21-add8-3f413f0205c7", // "Grandstand B — Shanghai's Opening-Corner Seat"
  grandstandH: "85855d49-6c9f-42bc-9afe-080ce53bf864", // "Grandstand H — Shanghai's Braking-Zone Seat"
  grandstandK: "123a6a2f-76dc-4d43-9cf5-6f92e5b0e73a", // "Grandstand K — Shanghai's Real Overtaking Seat"
  paddockClub: "6402bcdf-a90e-4ef7-a678-d007b0c1ac24", // "F1 Paddock Club & Hospitality Tiers — China 2027"
  ticketGuide: "0a51c549-8a3c-4efe-b0bd-d78711bac7de", // "Chinese GP Ticket Guide — Tiers, Grandstands & Strategy" (fallback only, unused directly below)
};

const NOW = new Date();

const SEATS = [
  // ---------- GENERAL ADMISSION — tier1 ----------
  {
    seatName: "GA Zone C",
    seatType: "festival_lawn",
    zoneLabel: "Grass bank between Turns 4-6, the 'mini straight' between Turns 5-6",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: false,
    linkedExperienceId: EXP.generalAdmission,
    sourceNote:
      "HIGH confidence. GA zone (not a grandstand — resolves a naming-collision risk with the Shanghai gov page's looser 'Grandstand C' phrasing, which formula1.com's own article corrects by calling these 'Grass Bank areas'). Runs between Turns 4-6, full views of Turns 5-8 and cars climbing the hill of Turns 3-4. 3-day ticket only, per koobit.com. Sources: sitwhere.com, koobit.com/chinese-grand-prix-e13605/tickets/general-admission-zones-c-f-j-l-245513 (27 Sep 2026).",
    ticketTierId: TIER.tier1,
  },
  {
    seatName: "GA Zone F",
    seatType: "festival_lawn",
    zoneLabel: "Grass bank on the back straight, past Grandstand H",
    actionTags: ["high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: false,
    linkedExperienceId: EXP.generalAdmission,
    sourceNote:
      "HIGH confidence. GA zone, further along the back straight past Grandstand H. Sources: sitwhere.com, koobit.com (27 Sep 2026). Single-day availability not separately confirmed for this specific zone (Zone C's 3-day-only status doesn't necessarily generalize) — left NULL rather than guessed.",
    ticketTierId: TIER.tier1,
  },
  {
    seatName: "GA Zone J",
    seatType: "festival_lawn",
    zoneLabel: "Grass bank outside the Turn 14 hairpin, between Grandstands H and K",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: false,
    linkedExperienceId: EXP.generalAdmission,
    sourceNote:
      "HIGH confidence. GA zone on the outside of the Turn 14 hairpin, between Grandstands H and K — one of the circuit's best overtaking spots. Sources: sitwhere.com, koobit.com (27 Sep 2026).",
    ticketTierId: TIER.tier1,
  },
  {
    seatName: "GA Zone L",
    seatType: "festival_lawn",
    zoneLabel: "Grass bank between the final corner and the start of the main straight",
    actionTags: ["start_grid", "podium_atmosphere"],
    covered: false,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: false,
    linkedExperienceId: EXP.generalAdmission,
    sourceNote:
      "HIGH confidence. GA zone between Turn 16 and the start of the main straight — view of pit lane, start/finish, and podium alongside Turn 16. Sources: sitwhere.com, koobit.com (27 Sep 2026).",
    ticketTierId: TIER.tier1,
  },

  // ---------- GRANDSTAND H/K/E — tier2 ----------
  {
    seatName: "Grandstand H",
    seatType: "grandstand",
    zoneLabel: "Turn 14 hairpin, end of the circuit's 1.1km back straight — the braking zone",
    actionTags: ["overtaking", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: null,
    linkedExperienceId: EXP.grandstandH,
    sourceNote:
      "HIGH confidence. Covered per direct founder confirmation, 27 Sep 2026. Sees the braking attempt into Turn 14; also has a distant view of the pit lane entrance and final corner. Sources: formula1shanghai.com/en/ticket-info/grandstand-h-4 (official 2027 product page), grandprixgrandtours.com, sitwhere.com (27 Sep 2026).",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand K",
    seatType: "grandstand",
    zoneLabel: "Turn 14 hairpin, exit side — directly across from Grandstand H",
    actionTags: ["overtaking", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: null,
    linkedExperienceId: EXP.grandstandK,
    sourceNote:
      "HIGH confidence. Covered per direct founder confirmation, 27 Sep 2026. Formula 1's own race guide names this the best seat for overtaking at this circuit — sees the exit/resolution of the hairpin move H sees the entry of. Sources: formula1shanghai.com/en/ticket-info/grandstand-k-2 (official 2027 product page), grandprixgrandtours.com (27 Sep 2026).",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand E",
    seatType: "grandstand",
    zoneLabel: "Corner leading into the circuit's 1.1km full-throttle back straight — Turn 11-13 complex",
    actionTags: ["high_speed", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: null,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence for existence, general location, 3-day-only status, and capacity (4,000+) — 2 independent official sources: formula1.com's own article 'tickets-on-sale-for-2026-chinese-grand-prix' (Turn 11-13 view, 'newly configured' for 2026, shuttle service) and english.shanghai.gov.cn's official 2026 event guide (capacity, shuttle, 3-day-only). NOT covered, per direct founder confirmation 27 Sep 2026. Supersedes an earlier, dropped version of this Turn 11-13 claim (this pack's own build-status memory flagged it as sourced only from formula1shanghai.com via an unverified WebSearch AI-summary) — this seeding uses the SAME factual claim but now sourced directly to formula1.com's own official article, a materially stronger provenance chain. Not yet listed on formula1shanghai.com's live 2027 product page (only A/B/H/K published there as of this writing) — 2027 continuation is reasonably expected (real, recently-built stand) but not itself independently confirmed; flagged honestly. No dedicated experience write-up exists for this seat in the pack (27 Sep 2026 session confirmed only A/B/H/K have one) — linkedExperienceId left null, falls back to the general Ticket Guide.",
    ticketTierId: TIER.tier2,
  },

  // ---------- GRANDSTAND A/A-PLATINUM/B — tier3 ----------
  {
    seatName: "Grandstand A (High Gold)",
    seatType: "grandstand",
    zoneLabel: "Main straight — starting grid, pit lane, start/finish line, podium",
    actionTags: ["start_grid", "podium_atmosphere", "pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: EXP.grandstandA,
    sourceNote:
      "HIGH confidence. Circuit's largest stand (~29,000 seats), covered, two levels. Real 2027 tier name confirmed as 'High Gold,' not 'Platinum' (Platinum is a separate, pricier sub-tier — see next row). Source: formula1shanghai.com/en/ticket-info/grandstand-a-high-gold (official 2027 product page, 27 Sep 2026).",
    ticketTierId: TIER.tier3,
  },
  {
    seatName: "Grandstand A (Platinum)",
    seatType: "grandstand",
    zoneLabel: "Main straight, same location as High Gold — premium sub-tier",
    actionTags: ["start_grid", "podium_atmosphere", "pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence for existence/location (formula1shanghai.com/en/ticket-info/grandstand-a-platinum, official 2027 product page). 3-day-ticket-only status confirmed via english.shanghai.gov.cn's 2026 event guide, which lists Grandstand A Platinum among the small set of 3-day-only products. LOWER confidence on price — no independent 2027 figure published; shares tier3's band with High Gold/B as the correct ordinal bucket (real price is likely a step above both, but unconfirmed, so the shared band is not widened per §3). No dedicated experience write-up distinct from the general Grandstand A one — linkedExperienceId left null.",
    ticketTierId: TIER.tier3,
  },
  {
    seatName: "Grandstand B",
    seatType: "grandstand",
    zoneLabel: "End of the main straight into the opening Turns 1-3",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: null,
    linkedExperienceId: EXP.grandstandB,
    sourceNote:
      "HIGH confidence. Uncovered — founder-verified directly against 2 independent sources, 27 Sep 2026, consistent with this pack's own existing TicketsSpoke.tsx copy. First-lap incidents and overtaking attempts through the opening corner sequence. Sources: formula1shanghai.com/en/ticket-info/grandstand-b-3 (official 2027 product page), grandprixgrandtours.com, sitwhere.com (27 Sep 2026).",
    ticketTierId: TIER.tier3,
  },
  {
    seatName: "T1 Club",
    seatType: "hospitality",
    zoneLabel: "Attached to Grandstand B at Turn 1, with dining service",
    actionTags: ["overtaking", "technical_corner"],
    covered: null,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: null,
    linkedExperienceId: null,
    sourceNote:
      "LOWER confidence — real named product, new for 2026, but sourced only to a single-language cluster (english.shanghai.gov.cn's 2026 event guide names it; shanghai.gov.cn Chinese-language coverage + blog.boxboxd.fun's Shanghai seating guide both independently describe it as attached to Grandstand B at Turn 1 ('1号弯俱乐部' / Turn 1 Club) with dining service). No English-language corroboration found beyond the naming, no 2027 continuation or pricing confirmed. Founder direction 27 Sep 2026: tier set to tier3 (matching base seat Grandstand B), not tier4 — it's fundamentally a Grandstand B seat with added dining, not a separate premium hospitality product, so its ordinal rank should reflect that base rather than being inflated. Covered/reservedSeating/minAge left NULL — genuinely unconfirmed.",
    ticketTierId: TIER.tier3,
  },

  // ---------- HOSPITALITY — tier4 ----------
  {
    seatName: "F1 Paddock Club",
    seatType: "hospitality",
    zoneLabel: "Above the pit building, overlooking the start-finish straight and pit lane",
    actionTags: ["start_grid", "pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.paddockClub,
    sourceNote:
      "HIGH confidence. F1's signature hospitality product — 'the panoramic vantage point,' per ticketing.formula1.com's own China hospitality page. Real 2026 price (this pack's own seeded proxy figure, TicketsSpoke.tsx): US$17,145/person, 3-day. Name matches the GLOBAL PRESTIGE_SEAT_NAMES entry in scoreSeats.ts — inherits that tiebreaker automatically. Founder-confirmed 27 Sep 2026: directionally correct here too, since this is by a wide margin the highest confirmed price of any seat at this circuit.",
    ticketTierId: TIER.tier4,
  },
  {
    seatName: "Gordon Ramsay at the F1 Paddock",
    seatType: "hospitality",
    // Fixed 28 Sep 2026 — this field was previously a relative-product
    // comparison ("Same building as F1 Paddock Club — a dining-led
    // hospitality product") instead of a real zone/view description, so it
    // rendered as the result page's "What it shows" answering the wrong
    // question. zoneLabel must describe what the seat actually overlooks;
    // the "same building as Paddock Club" fact belongs in sourceNote.
    zoneLabel: "Above the pit building, overlooking the start-finish straight and pit lane",
    actionTags: ["pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "LOWER confidence — real, named product ('refined, immersive dining'), sourced to ticketing.formula1.com's official China hospitality waitlist page, but no independent second source, no 2027 pricing published. Same building as F1 Paddock Club (pit building, start-finish straight and pit lane view), a dining-led hospitality product within it. Placed in tier4 alongside Paddock Club as the correct broad ordinal bucket (both genuinely premium hospitality), though its real price relative to Paddock Club itself is unconfirmed — not assumed equal or superior.",
    ticketTierId: TIER.tier4,
  },
  {
    seatName: "T16 Club",
    seatType: "hospitality",
    zoneLabel: "Near the starting grid / final turn, indoor and outdoor viewing",
    actionTags: ["start_grid", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: null,
    linkedExperienceId: null,
    sourceNote:
      "LOWER confidence — real, named product, new for 2026, corroborated across 2 sources (english.shanghai.gov.cn's event guide + tickets.formula1.com/en/ah-3182-china-additional-hospitality product listing), but 2027 continuation and pricing unconfirmed. Covered per direct founder confirmation, 27 Sep 2026. Indoor dining/viewing lounge with large screens, switchable to an outdoor trackside relaxation area near the final turn and start of the main straight.",
    ticketTierId: TIER.tier4,
  },
  {
    seatName: "Grandstand Club",
    seatType: "hospitality",
    zoneLabel: "Main Grandstand (A) — pit-lane-adjacent VIP seating",
    actionTags: ["pit_lane", "start_grid", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: null,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "LOWER confidence — real, named product ('主看台会所' / Main Grandstand Club/House), new for 2026, sourced to a Chinese-language circuit-guide search result cross-referencing Shanghai gov coverage: VIP seats at the Main Grandstand with pit-lane access and driver photo/autograph priority — a genuinely distinct product from F1 Paddock Club despite one source's loose framing alongside it. No English-language corroboration, no 2027 continuation or pricing confirmed.",
    ticketTierId: TIER.tier4,
  },
];

for (const seat of SEATS) {
  const { ticketTierId, ...row } = seat;
  await sql`
    INSERT INTO circuit_seating_profile
      (sporting_event_id, ticket_tier_cost_id, seat_name, seat_type, zone_label, action_tags, covered, min_age, single_day_available, reserved_seating, linked_experience_id, source_note, last_verified_date)
    VALUES
      (${EVENT_ID}, ${ticketTierId}, ${row.seatName}, ${row.seatType}, ${row.zoneLabel}, ${"{" + row.actionTags.join(",") + "}"}::action_tag[], ${row.covered}, ${row.minAge}, ${row.singleDayAvailable}, ${row.reservedSeating}, ${row.linkedExperienceId}, ${row.sourceNote}, ${NOW})
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
      last_verified_date = EXCLUDED.last_verified_date
  `;
}

console.log(`Seeded ${SEATS.length} Chinese GP (Shanghai) circuit seating rows.`);

const check = await sql`
  SELECT seat_name, seat_type, ticket_tier_cost_id, covered, reserved_seating, linked_experience_id IS NOT NULL AS has_experience
  FROM circuit_seating_profile
  WHERE sporting_event_id = ${EVENT_ID}
  ORDER BY seat_type, seat_name
`;
console.table(check);

await sql.end();

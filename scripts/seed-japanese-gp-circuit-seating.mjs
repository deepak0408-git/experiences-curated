import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// Japanese GP (Suzuka) Ticket Intelligence seat seeding — 27 Sep 2026, via
// ticket-intelligence-researcher skill. §1 full-inventory gap: this event's
// own planner_ticket_tier_cost labels name only 4 grandstands (Q1/Q2/G,
// V1/V2), but Suzuka's own official ticketing site (japan.gp) confirms
// ~19 individually-sold, individually-named grandstands (A1, A2, B1, B2, C,
// D, E, G, H, I, J, M, O, P, Q1, Q2, R, S, V1, V2) plus a real General
// Admission tier and 4 hospitality products. This pack's own seeded "Ticket
// Guide: Suzuka's Tiers, Explained" experience independently confirms this
// gap in its own copy: "the circuit prices roughly a dozen named
// grandstands individually" — the real count is closer to 19.
//
// Sources: suzukacircuit.jp (official circuit site — primary for V1, V2, E,
// C, B2, D, which have real static course-guide pages with photos/video);
// japan.gp (official F1 ticketing promoter for this race — secondary
// primary source for the remaining ~13 stands, per founder direction 27
// Sep 2026, since suzukacircuit.jp's own course guide is otherwise only an
// interactive image map with no fetchable per-stand text for those);
// founder-supplied Google AI Mode summary (27 Sep 2026, sourced from
// grandprixgrandtours.com + japan.gp) used to resolve B1/V1's covered
// status and confirm C/D/E/G/O/R as uncovered where WebSearch results had
// been thin or conflicting. motorsporttickets.com excluded throughout per
// standing founder instruction (see skill §0.5) — appeared in search
// results but never cited.
//
// COVERED STATUS — real, sourced discrepancy worth flagging: this pack's
// own "Ticket Guide" experience describes Grandstand G as having "partial
// cover in most G sections," but japan.gp's own Grandstand G ticket page
// and the founder-supplied source both independently confirm G is
// uncovered. Seeded as uncovered (the more specific, more recently
// confirmed sourcing) with both claims noted in sourceNote rather than
// silently picking one.
//
// TIER STRUCTURE (§3, ordinal only): GA -> tier1. All ordinary grandstands
// (A1/A2 through S, excluding Q2/V1/V2) -> tier2, matching the
// "Grandstand Q1, Q2, G; 3-day" tier label's own band even though Q2 is
// pulled out separately below. Q2, V1, and V2 -> tier3 (the 3 stands this
// pack's own Ticket Guide names as using individual bucket seats with
// headrests, i.e. Suzuka's real premium-grandstand tier) — V1/V2 moved
// here from tier4 per founder direction 27 Sep 2026, so tier4 is reserved
// exclusively for genuine hospitality products, not any grandstand
// regardless of price. All 4 hospitality products (Paddock Club, Champions
// Club, Hero x2) -> tier4.
//
// House 44, S-curve premium suites, and team-branded hospitality
// (Ferrari/Red Bull/McLaren/Mercedes) are explicitly named as real,
// confirmed-to-exist 2027 tiers in this pack's own "Hospitality Tiers"
// experience, but with NO published 2027 package details as of writing —
// deliberately excluded from this seed entirely (not even a placeholder
// row) rather than guessing at their structure, per the never-fabricate
// standing rule.
//
// linkedExperienceId set for every seat with a real dedicated write-up (5
// grandstand/GA/hospitality experiences already seeded for this pack) —
// null elsewhere, honest per skill §2.5.
//
// INSERT ONLY — per CLAUDE.md's standing rule, no delete script exists or
// will be written for these rows.

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const EVENT_ID = "9fe13c2e-37d1-49f0-8a48-d3ea40186fe4"; // Japanese Grand Prix 2027

const TIER = {
  tier1: "9debd494-b09d-46a8-8359-b3f233e419a4",
  tier2: "72881944-8384-41bb-9970-8a6ea00ddd8b",
  tier3: "33beca43-e1ed-4b9e-9f72-ee06ba31d020",
  tier4: "18c72105-5c4f-4e8f-8838-81b0d62fc6c6",
};

const EXP = {
  generalAdmission: "de508ff5-6a48-4ea0-9202-e6baf4ee0d95",
  grandstandG: "5d2f0aae-dcde-4e72-a0b8-523539dc0db9",
  q2Grandstand: "c308b20c-d1c1-4c94-9fa3-f3ccaf93fd65",
  v1v2Grandstand: "7d893827-3e56-48d2-8a62-27a003a96214",
  hospitalityTiers: "9d6dc0a6-e19e-49bf-964a-8ca71439d856", // covers Paddock Club, Champions Club, Hero x2
};

const NOW = new Date();

const SEATS = [
  // ---------- GENERAL ADMISSION — tier1 ----------
  {
    seatName: "General Admission (West Area)",
    seatType: "festival_lawn",
    zoneLabel: "Open, unreserved viewing areas around the circuit — roams freely, not a fixed seat",
    actionTags: [],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: false,
    linkedExperienceId: EXP.generalAdmission,
    sourceNote: "HIGH confidence — sourced from this pack's own seeded 'General Admission — Suzuka's Roaming Ticket' experience: officially the West Area ticket, a 4-day pass. Genuine perk: Friday-only entry into every named grandstand except V1 and V2, making it a real 'free trial' of grandstand seating. Bundled with a 4-day Amusement Park Passport for Suzuka Circuit Park/Motopia.",
    ticketTierId: TIER.tier1,
  },

  // ---------- GRANDSTANDS — tier2 ----------
  {
    seatName: "Grandstand A1",
    seatType: "grandstand",
    zoneLabel: "Main straight, pit lane exit, race start/finish, approach to Turn 1",
    actionTags: ["start_grid", "pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — japan.gp's official Grandstand A1 page + WebSearch aggregation: along the main straight with a direct view of the pit lane exit, race start/finish, and cars accelerating toward Turn 1. Covered, though some sourcing describes it as 'partially covered' rather than fully — noted honestly rather than asserting full coverage.",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand A2",
    seatType: "grandstand",
    zoneLabel: "Main straight, slightly further along and higher than A1 — pit lane exit, Turn 1 approach",
    actionTags: ["start_grid", "pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — japan.gp's official Grandstand A2 page + WebSearch aggregation: same main-straight/pit-lane-exit view as A1 but further along and elevated higher. This pack's own 'Ticket Guide' experience separately names A2 (alongside Q2, V1, V2) as using individual bucket seats with headrests — Suzuka's premium seating style — though A2 itself is still ordinally priced in tier2's band per the official tier label.",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand B1",
    seatType: "grandstand",
    zoneLabel: "Turn 1-2 exterior, lower section — up-close view of cars through the opening corners",
    actionTags: ["overtaking", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — founder-supplied source (27 Sep 2026, via grandprixgrandtours.com/japan.gp): 'B1: Covered by a roof. Located at Turn 2, offers a roof to shield fans from the weather.' Resolves an earlier WebSearch conflict where some aggregators claimed B1 uncovered. Lower section of the B Grandstand, close to the first-corner action, frequent overtaking zone.",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand B2",
    seatType: "grandstand",
    zoneLabel: "Turn 1-2 exterior, upper section — clearer view above the safety fencing than B1",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — suzukacircuit.jp's own dedicated Course Guide B2 page: 'B2 seat type bench seat,' uncovered outdoor viewing area, sightlines toward Turn 1. Sits above B1 and clear of the fencing obstruction B1 has.",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand C",
    seatType: "grandstand",
    zoneLabel: "Turn 2 exit through the S-Curve entrance",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — suzukacircuit.jp's own dedicated Course Guide C page ('bench seat type C seat,' views toward Turn 2 and the S Curve entrance, facilities include toilets/shop/concessions) plus founder-supplied confirmation (27 Sep 2026) that C is uncovered.",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand D",
    seatType: "grandstand",
    zoneLabel: "S-Curve to Degner (Reverse Bank) — wooden bleacher seating deep in the technical section",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — suzukacircuit.jp's own dedicated Course Guide D page ('D1 seat in bench seat style,' views of 'S Curve ~ Reverse Bank') plus founder-supplied confirmation (27 Sep 2026): 'D & E: Uncovered. These stands wrap around the iconic Esses and feature wooden bleacher-style seating with no overhead shelter' — supersedes an earlier draft's 'many D4 seats are shaded' claim from the same suzukacircuit.jp page, which the founder-supplied source directly contradicts as fully uncovered.",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand E",
    seatType: "grandstand",
    zoneLabel: "NIPPO Corner, S-Curve section — wooden bleacher seating",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — suzukacircuit.jp's own dedicated Course Guide E page ('bench seat type E seat,' views of NIPPO Corner, underground passage link to GP Square) plus founder-supplied confirmation (27 Sep 2026) that E is uncovered wooden bleacher seating, same as neighbouring Grandstand D.",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand G — 130R",
    seatType: "grandstand",
    zoneLabel: "130R (Turn 15) — the high-speed corner that defines Suzuka's reputation",
    actionTags: ["high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: EXP.grandstandG,
    sourceNote: "HIGH confidence, with a real sourcing discrepancy flagged: this pack's own seeded 'Grandstand G' experience describes two sub-sections — a reserved, numbered permanent section with a big screen, and a first-come-first-served temporary G-1 section (bring your own cushion/chair) — and separately, this pack's Ticket Guide experience states 'partial cover in most G sections.' However, japan.gp's own Grandstand G ticket page and a founder-supplied source (27 Sep 2026, 'G: Uncovered. Located on the inside of the fast 130R corner') both independently confirm G is uncovered. Seeded as uncovered per the more specific, directly-confirmed sourcing — reservedSeating reflects the permanent section (the temporary G-1 section is genuinely first-come, a real internal split not captured by a single boolean).",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand H",
    seatType: "grandstand",
    zoneLabel: "Before the Turn 11 hairpin — slow-speed corner, frequent overtaking",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — japan.gp's official Grandstand H page + WebSearch aggregation: uncovered, TV screen in sight, loudspeaker race commentary (in Japanese). Sits right before the Turn 11 hairpin, known for frequent overtaking.",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand I",
    seatType: "grandstand",
    zoneLabel: "Hairpin exit, back of the circuit — low-speed, good for photography",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — japan.gp's official Grandstand I page: explicitly states 'Grandstand I is uncovered' with 'no view of any giant TV screen.' Hairpin exit at the back of the circuit; cars pass at relatively low speed, noted as good for photography.",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand J",
    seatType: "grandstand",
    zoneLabel: "Inside of Turn 12, toward the Spoon Curve",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — japan.gp's official Grandstand J page + WebSearch aggregation: uncovered, on the inside of the track at Turn 12, viewing cars moving toward the Spoon Curve. Same source explicitly lists only V1, V2, and B1 as Suzuka's covered grandstands.",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand M — Spoon Curve",
    seatType: "grandstand",
    zoneLabel: "Spoon Curve (Turns 13-14) — double-apex technical corner onto the back straight",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — WebSearch aggregation of japan.gp's official Grandstand M listing: overlooks the Spoon Curve's double-apex corner, big screen opposite, partially open/no roof over all seats, speakers broadcast commentary but no big screen visible from some sections.",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand O",
    seatType: "grandstand",
    zoneLabel: "Turn 14 exit toward 130R, with brief Turn 12 views",
    actionTags: ["high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — japan.gp's official Grandstand O page + founder-supplied confirmation (27 Sep 2026, uncovered). Views cars accelerating out of Turn 14 and charging flat-out toward 130R, with brief glimpses of Turn 12 action.",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand P — Astemo Chicane",
    seatType: "grandstand",
    zoneLabel: "Hitachi Astemo Chicane (Turns 16-17) — last major braking zone before the pit straight",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — japan.gp's official Grandstand P page + WebSearch aggregation: uncovered, numbered seating, big screen opposite. Direct view of the Astemo Chicane, the last major braking zone before cars rejoin the pit straight.",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand Q1",
    seatType: "grandstand",
    zoneLabel: "Final chicane, lower section — closer to fencing than Q2, partially obstructed",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — japan.gp's official Grandstand Q1 page + WebSearch aggregation: uncovered, no big screen. Same general view as Q2 but lower and closer to fencing/barricades, partially obstructing the main straight and pit lane entry views that Q2's elevation clears.",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand R",
    seatType: "grandstand",
    zoneLabel: "Final corner — key overtaking spot as cars navigate the last curves",
    actionTags: ["overtaking", "podium_atmosphere"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — japan.gp's official Grandstand R page + founder-supplied confirmation (27 Sep 2026, uncovered). Located directly across from the final corner, a key overtaking spot as cars navigate the last curves.",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand S",
    seatType: "grandstand",
    zoneLabel: "Final corner exit, cars lining up onto the main straight — finish line and podium view",
    actionTags: ["podium_atmosphere", "overtaking"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — japan.gp's official Grandstand S page + WebSearch aggregation: uncovered despite the final-corner location. Along the exit of the final corner as cars line up for the main straight; sees the chequered flag moment and podium celebrations in the pit building.",
    ticketTierId: TIER.tier2,
  },

  // ---------- PREMIUM GRANDSTANDS — tier3 ----------
  {
    seatName: "Grandstand Q2",
    seatType: "grandstand",
    zoneLabel: "Final chicane, elevated section — the sequence that decides more Suzuka races than any other",
    actionTags: ["overtaking", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.q2Grandstand,
    sourceNote: "HIGH confidence — sourced from this pack's own seeded 'Q2 Grandstand' experience: sits higher than Q1, clearing the fence obstruction entirely, with a clear view of the Hitachi Astemo Chicane and pit lane entry. Watches cars coming out of 130R (still carrying speed) into the tight right-left chicane — where late-braking overtakes and contact happen most often on the lap. Numbered seat, screen in view. One of the 4 stands (A2, Q2, V1, V2) this pack's Ticket Guide names as using individual bucket seats with headrests.",
    ticketTierId: TIER.tier3,
  },
  {
    seatName: "Grandstand V1 — Main Straight Lower",
    seatType: "grandstand",
    zoneLabel: "Main straight, lower tier — start/finish line, grid, podium, pit lane",
    actionTags: ["start_grid", "pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.v1v2Grandstand,
    sourceNote: "HIGH confidence — sourced from this pack's own seeded 'Grandstand V1/V2' experience (lower section, closer to fencing, partially obstructed view vs V2) plus japan.gp's official V1 page (reserved seating for all 3 days including Friday, unlike most other grandstands) and founder-supplied confirmation (27 Sep 2026): 'V1: Partially covered. V1 is the lower tier of the Main Grandstand. While it has a roof structure, coverage primarily protects the higher rows of the section; lower seats closer to the track remain exposed.' Linked to tier3 (founder direction, 27 Sep 2026) rather than tier4, so tier4 stays exclusively hospitality.",
    ticketTierId: TIER.tier3,
  },
  {
    seatName: "Grandstand V2 — Main Straight Upper",
    seatType: "grandstand",
    zoneLabel: "Main straight, upper tier — Suzuka's top grandstand, unrestricted sightlines, driver interviews",
    actionTags: ["start_grid", "pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.v1v2Grandstand,
    sourceNote: "HIGH confidence — sourced from this pack's own seeded 'Grandstand V1/V2' experience: higher and clear of the fencing obstruction V1 has, genuinely unrestricted sightlines across the whole straight, 3 large screens, clear podium view, and exclusive access to Saturday's driver interviews held on the straight. Real 2026 price ~US$709+ (confirmed, top of the grandstand range). Fully covered upper rows get weather protection unlike almost every other Suzuka grandstand. Linked to tier3 (founder direction, 27 Sep 2026) rather than tier4, so tier4 stays exclusively hospitality — V2's real price sits at the top of tier3's US$540-750 band, an honest ordinal fit.",
    ticketTierId: TIER.tier3,
  },

  // ---------- HOSPITALITY — tier4 ----------
  {
    seatName: "Champions Club",
    seatType: "hospitality",
    zoneLabel: "Main pit structure, above the team garages — main straight, pit lane, grid preparations",
    actionTags: ["start_grid", "pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.hospitalityTiers,
    sourceNote: "HIGH confidence — sourced from this pack's own seeded 'Suzuka's Hospitality Tiers' experience: sits in the same pit building as Paddock Club, directly above the team garages, same view of main straight/pit lane/grid. All-day food and drink with curated lunch and open bar, F1 insider appearances, grid walk with championship trophy photo, one assigned day of guided paddock tour access. Confirmed 2027 price direct from F1 Experiences: US$4,949/person plus processing fee.",
    ticketTierId: TIER.tier4,
  },
  {
    seatName: "Hero — Main Grandstand V2",
    seatType: "hospitality",
    zoneLabel: "Main Grandstand V2 seat, bundled with F1 Experiences walk-on extras",
    actionTags: ["start_grid", "pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.hospitalityTiers,
    sourceNote: "HIGH confidence — sourced from this pack's own seeded 'Suzuka's Hospitality Tiers' experience: F1 Experiences' most accessible Suzuka package, NOT a lounge — a named grandstand seat (Main Grandstand V2, seat-back style seating, giant screen, panoramic main-straight views) bundled with an Aramco F1 pit lane walk, guided track tour, championship trophy photo, and F1 Authentics gift. Confirmed 2027 price: US$2,969/person plus processing fee.",
    ticketTierId: TIER.tier4,
  },
  {
    seatName: "Hero — Grandstand B2",
    seatType: "hospitality",
    zoneLabel: "Grandstand B2 seat (outside of Turns 1-2), bundled with F1 Experiences walk-on extras",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.hospitalityTiers,
    sourceNote: "HIGH confidence — sourced from this pack's own seeded 'Suzuka's Hospitality Tiers' experience: the Hero package's second grandstand option, Grandstand B2 (bleacher-style seating, roving access Friday, reserved seating Saturday/Sunday at the outside of the first two corners), same walk-on extras bundle as the V2 Hero package. Confirmed 2027 price: US$2,199/person plus processing fee. reservedSeating true reflects the Saturday/Sunday reserved status (Friday is genuinely roving, a real mixed structure not captured by a single boolean).",
    ticketTierId: TIER.tier4,
  },
  {
    seatName: "Paddock Club",
    seatType: "hospitality",
    zoneLabel: "Above the pit building, overlooking the start-finish straight and pit lane",
    actionTags: ["start_grid", "pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.hospitalityTiers,
    sourceNote: "HIGH confidence — sourced from this pack's own seeded 'Suzuka's Hospitality Tiers' experience: premium open bars, curated local food menus, daily pit lane walks Friday-Sunday, and a lap of the circuit on a flatbed truck with expert hosts (unique among all Suzuka hospitality/grandstand products). Depending on package, driver meet-and-greets included. Name matches the GLOBAL PRESTIGE_SEAT_NAMES entry exactly in scoreSeats.ts — inherits that tiebreaker automatically; directionally correct here too, as Suzuka's real top-tier product (hospitality starts 'from roughly ¥1,100,000' per this pack's own Ticket Guide, well above Champions Club's confirmed US$4,949).",
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
  `;
}

console.log(`Seeded ${SEATS.length} Japanese GP (Suzuka) circuit seating rows.`);

const check = await sql`
  SELECT seat_name, seat_type, ticket_tier_cost_id, covered, reserved_seating, linked_experience_id IS NOT NULL AS has_experience
  FROM circuit_seating_profile
  WHERE sporting_event_id = ${EVENT_ID}
  ORDER BY seat_type, seat_name
`;
console.table(check);

await sql.end();

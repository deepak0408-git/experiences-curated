import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

// circuit_seating_profile seed for Silverstone Circuit (British Grand Prix
// 2027) — built for the Ticket Intelligence app. Researched 30 Sep 2026
// directly against silverstone.co.uk's live ticket pages (screenshots
// supplied by founder, 3-day Friday-Sunday prices throughout), plus
// f1experiences.com (F1 Experiences Lounge, direct) and a Google AI Mode
// summary (F1 Paddock Club pricing — LOWER confidence, not publicly listed
// on tickets.formula1.com).
//
// COLLAPSED-PARENT STRUCTURE (founder direction, 30 Sep 2026): Silverstone
// sells many grandstands as lettered/Prime-View sub-variants of one named
// corner (e.g. Abbey A, Abbey A Prime View, Abbey B, Abbey B Prime View).
// These are seeded as ONE parent seat per corner, not one row per variant —
// General Admission Plus is the one exception, kept as 6 separate seats
// since each GA+ location is a genuinely different part of the circuit
// (affects actionTags scoring), unlike Prime View which is just a seat
// -selection upgrade within the same stand.
//
// "Enclosures" (Boxpark, Club Silverstone, Garage, T1, Wellington, Inside
// Nine) are food/entertainment bundles layered on top of an EXISTING
// grandstand seat, not a distinct seat of their own — excluded entirely
// per founder direction.
//
// COVERED FIELD ON COLLAPSED PARENTS: several parents have children with
// different covered status (e.g. Abbey A uncovered, Abbey B covered).
// Founder decision (30 Sep 2026): set covered = true if ANY child section
// is covered (inclusive/optimistic — matches how fans describe "Abbey has
// covered seating available"), with the true per-child split documented in
// sourceNote for curator/"Why this fits you" surfacing.
//
// PRICING: 3-day (Fri-Sun) prices only, per founder direction — GBP
// converted to USD at ~1.34 (approx market rate, 30 Sep 2026). Octane
// Terrace and Heritage Club's 3-day options were sold out at research time
// — founder-provided assumed 3-day prices (£3,069 / £3,499) used per
// explicit instruction, flagged LOWER confidence.
//
// PRESTIGE TIEBREAKER (§6 of the ticket-intelligence-researcher skill): F1
// Paddock Club is the genuine real-price outlier in tier4 (up to $15,000
// for Team Suites vs. next-highest Red Bull Pole Position at $8,695) —
// flagged for PRESTIGE_SEAT_NAMES / STAR_OVERRIDE_BY_SEAT_NAME (5-star
// override) in scoreSeats.ts / FullResult.tsx. Grep both maps first for a
// name collision before adding (per §6's known cross-event name-collision
// gap) — "F1 Paddock Club" not currently used by any other seeded event.

const EVENT_ID = "3a943a09-92dd-47dd-b675-884ec4729b4f"; // British Grand Prix 2027

const tierRows = await sql`
  SELECT id, tier FROM planner_ticket_tier_cost WHERE sporting_event_id = ${EVENT_ID}
`;
const tierIdByKey = Object.fromEntries(tierRows.map((r) => [r.tier, r.id]));
for (const t of ["tier1", "tier2", "tier3", "tier4"]) {
  if (!tierIdByKey[t]) throw new Error(`Missing expected ${t} row for event ${EVENT_ID} — aborting.`);
}

const SEATS = [
  // ─── tier1 ($468 flat, seeded) ───────────────────────────────────────
  {
    seatName: "General Admission",
    seatType: "festival_lawn",
    zoneLabel: "Roaming trackside access — Chapel, Hangar Straight, Luffield, Becketts, or Village viewing areas",
    actionTags: ["high_speed", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: false,
    sourceNote:
      "HIGH confidence — direct read from silverstone.co.uk/events/formula-1-british-grand-prix/tickets/general-admission, 3-day price £349 ($468 @ ~1.34). Standing, unreserved, roam-anywhere access to giant screens and named trackside viewing areas (Chapel, Hangar Straight, Luffield, Becketts, Village) — not tied to one fixed stand. Single-day tickets also sold (Thu £80, Fri £109, Sat £179, Sun £289), so singleDayAvailable = true. Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier1,
  },
  // ─── tier2 — Grandstand (collapsed parents) + GA+ ($173-615 seeded) ──
  {
    seatName: "Abbey",
    seatType: "grandstand",
    zoneLabel: "Turn 1 (Abbey), first braking zone off the start/finish straight",
    actionTags: ["start_grid", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — silverstone.co.uk/events/formula-1-british-grand-prix/tickets/grandstands, 3-day prices. Collapsed parent of 2 sub-stands with different coverage: Abbey A (£189/$253, UNCOVERED — oversteer48.com/silverstone confirms open to elements) and Abbey B + Prime View (£199-209/$267-280, COVERED — help.silverstone.co.uk official covered-grandstands list). Parent covered=true per founder rule (any child covered = true); Abbey A remains the uncovered option within this stand. All Silverstone grandstands fully reserved seating for 2026/27 (silverstone.co.uk/news/silverstone-grandstands-faqs). Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Becketts",
    seatType: "grandstand",
    zoneLabel: "Maggotts–Becketts–Chapel esses, the fast S-bend sequence",
    actionTags: ["high_speed", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — silverstone.co.uk grandstands page, 3-day price £189/$253. Covered per official help.silverstone.co.uk covered-grandstands list. One of the circuit's defining high-speed corner sequences. Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Chapel",
    seatType: "grandstand",
    zoneLabel: "Chapel corner, exit of the Maggotts–Becketts complex",
    actionTags: ["high_speed", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — silverstone.co.uk grandstands page, 3-day price £139/$186. Uncovered, confirmed by 2 independent sources: oversteer48.com/silverstone-chapel (\"completely open to the elements\") and absence from help.silverstone.co.uk's official covered list. Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Club",
    seatType: "grandstand",
    zoneLabel: "Club Corner, tight infield chicane after Luffield",
    actionTags: ["technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — silverstone.co.uk grandstands page, 3-day prices. Collapsed parent of Club A (£149/$200, uncovered) and Club Corner + Prime View (£199-209/$267-280, COVERED per official covered-grandstands list). Parent covered=true per founder rule; Club A is the uncovered option within this stand. Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Copse",
    seatType: "grandstand",
    zoneLabel: "Copse (Turn 9), flat-out first corner after the pit straight",
    actionTags: ["high_speed", "overtaking"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — silverstone.co.uk grandstands page, 3-day prices. Collapsed parent of Copse A (£149/$200), Copse B (£139/$186), Copse C (£139/$186) — all 3 COVERED per official list and cross-confirmed grandprixgrandtours.com (\"Copse A, B and C, all covered\") — and Copse D (£139/$186, UNCOVERED, not on official covered list). Parent covered=true per founder rule; Copse D is the uncovered option. One of the fastest corners on the calendar. Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Hamilton Straight",
    seatType: "grandstand",
    zoneLabel: "Start/finish straight, grid and pit-lane view",
    actionTags: ["start_grid", "podium_atmosphere", "pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — silverstone.co.uk grandstands page, 3-day prices. Collapsed parent of Hamilton Straight A + Prime View (£239-249/$320-334, COVERED per official list) and Hamilton Straight B + Prime View (£189-199/$253-267, UNCOVERED, not on official covered list). Parent covered=true per founder rule; Hamilton Straight B is the uncovered option. Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Luffield",
    seatType: "grandstand",
    zoneLabel: "Luffield, slow hairpin leading onto the Wellington Straight",
    actionTags: ["technical_corner", "overtaking"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — silverstone.co.uk grandstands page, 3-day prices. Collapsed parent of Luffield (£279/$374) and Luffield Corner (£159/$213) — both COVERED per official help.silverstone.co.uk list. Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "National Pit Straight",
    seatType: "grandstand",
    zoneLabel: "National Pits Straight, opposite the pit lane and start/finish line",
    actionTags: ["pit_lane", "start_grid"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — silverstone.co.uk grandstands page, 3-day price £139/$186. Covered per official help.silverstone.co.uk covered-grandstands list. Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Stirling",
    seatType: "grandstand",
    zoneLabel: "Stirling, infield section near Woodcote",
    actionTags: ["technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — silverstone.co.uk grandstands page, 3-day prices. Collapsed parent of Stirling A (£139/$186, UNCOVERED, not on official covered list) and Stirling B (£149/$200, COVERED per official list). Parent covered=true per founder rule; Stirling A is the uncovered option. Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Vale",
    seatType: "grandstand",
    zoneLabel: "Vale, braking zone into the Club chicane after Stowe",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — silverstone.co.uk grandstands page, 3-day price £129/$173. Uncovered, confirmed by 2 independent sources (oversteer48.com/vale-grandstand-silverstone + absence from official covered list). Numbered seating, giant screen on site, one of the best overtaking spots at the circuit (braking into Club after Stowe exit). Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Village",
    seatType: "grandstand",
    zoneLabel: "Village, infield Arena-section corner",
    actionTags: ["technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — silverstone.co.uk grandstands page, 3-day prices. Collapsed parent of Village A (£129/$173, UNCOVERED — oversteer48.com confirms \"completely exposed to the weather\") and Village B (£159/$213, COVERED — oversteer48.com confirms roof + front visor, sides open). Parent covered=true per founder rule; Village A is the uncovered option. Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Woodcote",
    seatType: "grandstand",
    zoneLabel: "Woodcote, final corner onto the start/finish straight",
    actionTags: ["technical_corner", "overtaking"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — silverstone.co.uk grandstands page, 3-day prices. Collapsed parent of Woodcote A (£149/$200) and Woodcote B (£159/$213) — both COVERED per official list, cross-confirmed oversteer48.com/woodcote-silverstone — and Woodcote C (£129/$173, UNCOVERED, confirmed \"no roof\" via search). Parent covered=true per founder rule; Woodcote C is the uncovered option. Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Vale GA+",
    seatType: "festival_lawn",
    zoneLabel: "Vale, trackside standing viewing area",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — silverstone.co.uk/events/formula-1-british-grand-prix/tickets/general-admission-plus, 3-day price £419/$562. General Admission Plus = reserved standing spot (guaranteed position within the zone) per founder direction, 30 Sep 2026 — not first-come-first-served like plain GA. No source claims cover for GA+ zones. Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Copse A GA+",
    seatType: "festival_lawn",
    zoneLabel: "Copse (Turn 9), trackside standing viewing area",
    actionTags: ["high_speed", "overtaking"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — silverstone.co.uk GA+ page, 3-day price £449/$602. Reserved standing (guaranteed spot). No source claims cover. Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Copse C GA+",
    seatType: "festival_lawn",
    zoneLabel: "Copse (Turn 9), trackside standing viewing area",
    actionTags: ["high_speed", "overtaking"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — silverstone.co.uk GA+ page, 3-day price £419/$562. Reserved standing (guaranteed spot). No source claims cover. Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Abbey GA+",
    seatType: "festival_lawn",
    zoneLabel: "Turn 1 (Abbey), trackside standing viewing area",
    actionTags: ["start_grid", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — silverstone.co.uk GA+ page, 3-day price £439/$588. Reserved standing (guaranteed spot). No source claims cover. Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Luffield Complex GA+",
    seatType: "festival_lawn",
    zoneLabel: "Luffield, trackside standing viewing area",
    actionTags: ["technical_corner", "overtaking"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — silverstone.co.uk GA+ page, 3-day price £439/$588. Reserved standing (guaranteed spot). No source claims cover. Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Luffield Terrace GA+",
    seatType: "festival_lawn",
    zoneLabel: "Luffield, elevated trackside standing terrace",
    actionTags: ["technical_corner", "overtaking"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — silverstone.co.uk GA+ page, 3-day price £459/$615. Reserved standing (guaranteed spot), elevated terrace variant. No source claims cover. Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier2,
  },
  // ─── tier3 — Premium Grandstand ($655-762 seeded) ────────────────────
  {
    seatName: "George Russell Grandstand",
    seatType: "grandstand",
    zoneLabel: "Farm Curve, fast left-hander linking Abbey to Village",
    actionTags: ["high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — 3-day price £489/$655, founder-confirmed 30 Sep 2026. New for 2027, dedicated stand at Farm Curve honoring George Russell's home race. Uncovered, founder-confirmed 30 Sep 2026 (predecessor Farm Curve grandstand was also uncovered). Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Landostand",
    seatType: "grandstand",
    zoneLabel: "Stowe Corner, braking zone after the Hangar Straight",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — silverstone.co.uk/events/formula-1-british-grand-prix/tickets/landostand, 3-day price £569/$762 (reserved variant; GA+ standing variant £449 not seeded separately per founder direction, 30 Sep 2026 — one product only). Purpose-built wraparound grandstand dedicated to Lando Norris fans, 18,000+ capacity in 2026. Uncovered — no source claims cover, standing/fan-zone atmosphere. Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier3,
  },
  // ─── tier4 — Hospitality ($2,826-15,000 seeded) ──────────────────────
  {
    seatName: "Racing Green",
    seatType: "hospitality",
    zoneLabel: "Trackside hospitality zone, general circuit access",
    actionTags: [],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — silverstone.co.uk/events/formula-1-british-grand-prix/hospitality/racing-green, 3-day price £2,109/$2,826 (per-guest, inc. VAT). Festival-style hospitality: racing sims, live bands, street food village, grandstand views over Wellington Straight/Aintree/The Loop/Village. Covered assumed true (enclosed hospitality product) — not independently itemized per zone. Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Legends Club",
    seatType: "hospitality",
    zoneLabel: "Wellington Straight, view toward Brooklands",
    actionTags: [],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — silverstone.co.uk hospitality page, 3-day price £3,069/$4,112 (per-guest, inc. VAT). Private-club atmosphere, Wellington Straight through Brooklands in full view, one of the most thrilling overtaking spots on the circuit. Covered assumed true (enclosed hospitality product). Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Octane Terrace",
    seatType: "hospitality",
    zoneLabel: "Hangar Straight, front-row view of top-speed section",
    actionTags: ["high_speed"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "LOWER confidence — 3-day option was SOLD OUT at research time (30 Sep 2026); price £3,069/$4,112 is a founder-provided assumed figure, not directly observed at checkout. All-day live bands, exclusive after-party with headline DJs Saturday night, front-row seat on Hangar Straight where cars hit full throttle. Covered assumed true (enclosed hospitality product).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Heritage Club",
    seatType: "hospitality",
    zoneLabel: "National Pits Straight, original start/finish line",
    actionTags: ["pit_lane", "start_grid"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "LOWER confidence — 3-day option was SOLD OUT at research time (30 Sep 2026); price £3,499/$4,689 is a founder-provided assumed figure, not directly observed at checkout. One of the oldest corners at the circuit, National Pits Straight in full view, where Silverstone's story began. Covered assumed true (enclosed hospitality product).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Torque Club",
    seatType: "hospitality",
    zoneLabel: "Views across six high-speed corners",
    actionTags: ["high_speed", "overtaking"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — silverstone.co.uk hospitality page, 3-day price £3,799/$5,091 (per-guest, inc. VAT). Live inside the race as cars tear around six high-speed corners, race-strategy talks with engineers/data experts, simulators. Covered assumed true (enclosed hospitality product). Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Fusion Lounge",
    seatType: "hospitality",
    zoneLabel: "Stowe to Vale, overtaking zone after the Hangar Straight",
    actionTags: ["overtaking", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — silverstone.co.uk hospitality page, 3-day price £4,299/$5,761 (per-guest, inc. VAT). Six kitchens, garden terrace, F1-icon talks, uninterrupted views from Stowe to Vale, a prime spot for bold overtakes. Covered assumed true (enclosed hospitality product). Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Moët & Chandon Club",
    seatType: "hospitality",
    zoneLabel: "Trackside hospitality near Fusion Lounge, Stowe–Vale section",
    actionTags: ["overtaking"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — silverstone.co.uk/events/formula-1-british-grand-prix/hospitality/moet-and-chandon-club, 3-day price £4,749/$6,364 (per-guest, inc. VAT). Exclusive Moët & Chandon champagne range (Impérial Brut through Grand Vintage), refined dining, private space within Fusion Lounge's footprint. Covered assumed true (enclosed hospitality product). Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Starting Grid",
    seatType: "hospitality",
    zoneLabel: "Start/finish line, front-row grid view",
    actionTags: ["start_grid", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — silverstone.co.uk hospitality page, 3-day price £5,039/$6,752 (per-guest, inc. VAT). Front-row seat overlooking the start/finish line, buzz of the grid right below, premium social spaces, seasonal British dining. Covered assumed true (enclosed hospitality product). Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Red Bull Pole Position",
    seatType: "hospitality",
    zoneLabel: "Start/finish line, elevated view of the grid",
    actionTags: ["start_grid", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — silverstone.co.uk hospitality page, 3-day price £6,489/$8,695 (per-guest, inc. VAT). Live stunts, famous faces, adrenaline-fuelled views of the start/finish line, World of Red Bull immersion, complimentary premium beverages. Covered assumed true (enclosed hospitality product). Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "F1 Experiences Lounge 3-Day",
    seatType: "hospitality",
    zoneLabel: "Woodcote B Grandstand seat, with access to an adjacent hospitality marquee",
    actionTags: ["technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — f1experiences.com/2027-british-grand-prix/f1-experiences-lounge, direct read, 3-day price $4,599 (USD, official F1 Experiences global channel, separate from Silverstone's own-branded hospitality). Zone/layout corrected 30 Sep 2026 per founder direction — this product is a split layout combining a reserved seat in the Woodcote B Grandstand with access to an adjacent hospitality marquee, generally EXCLUDING the one-day guided paddock tour. (Earlier version of this seed wrongly described it as the UTC Building/National Pits Straight location — that description actually belongs to the separate Champions Club product, now seeded as its own seat below.) Covered assumed true (marquee component). Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Champions Club",
    seatType: "hospitality",
    zoneLabel: "UTC Building, National Pits Straight, after Turn 8",
    actionTags: ["pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — 3-day price $4,600 (USD), founder-confirmed 30 Sep 2026. Hosted inside the permanent UTC Building on the National Pits Straight, after Turn 8 — all-inclusive indoor suite, outdoor viewing balcony, gourmet dining, and a guided F1 Paddock tour. Distinct product from F1 Experiences Lounge (see that seat's corrected sourceNote) — the two were originally conflated during initial research, corrected 30 Sep 2026 after founder review. Covered (indoor suite + balcony). Verified 30 Sep 2026.",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "F1 Paddock Club",
    seatType: "hospitality",
    zoneLabel: "Turn 1 (Abbey Corner), first-floor terrace above the pit lane",
    actionTags: ["pit_lane", "start_grid"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "LOWER confidence — tickets.formula1.com/en/pc-3226-great-britain-paddock-club has no public pricing (gated behind a \"select a pass\" flow, 2027 packages not yet on public sale with visible pricing per WebSearch, 30 Sep 2026). Price range $10,000-15,000 (Team Suites) sourced from a Google AI Mode summary only, not a primary official page — used per founder direction as the genuine real-price outlier for this tier. Zone description (first-floor covered terrace directly above the pit lane at Turn 1/Abbey Corner) from the same secondary summary. Daily pit lane walks, ultra-premium catering, free-flowing bars, driver/garage access extensions per the summary. Flagged as PRESTIGE_SEAT_NAMES / STAR_OVERRIDE_BY_SEAT_NAME outlier per founder confirmation, 30 Sep 2026 (\"Paddock F1 is the priciest as always\").",
    ticketTierId: tierIdByKey.tier4,
  },
];

for (const seat of SEATS) {
  const result = await sql`
    INSERT INTO circuit_seating_profile (
      sporting_event_id, ticket_tier_cost_id, seat_name, seat_type, zone_label,
      action_tags, covered, min_age, single_day_available, reserved_seating, source_note
    )
    VALUES (
      ${EVENT_ID}, ${seat.ticketTierId}, ${seat.seatName}, ${seat.seatType}, ${seat.zoneLabel},
      ${seat.actionTags}, ${seat.covered}, ${seat.minAge}, ${seat.singleDayAvailable}, ${seat.reservedSeating}, ${seat.sourceNote}
    )
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
  SELECT seat_name, seat_type, covered, reserved_seating
  FROM circuit_seating_profile
  WHERE sporting_event_id = ${EVENT_ID}
  ORDER BY seat_type, seat_name
`;
console.log(`\nConfirmed state (${rows.length} seats):`);
console.table(rows);

await sql.end();

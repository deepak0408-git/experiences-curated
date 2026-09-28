import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

// circuit_seating_profile seed for Circuit Gilles Villeneuve (Canadian GP
// 2027) — built for the Ticket Intelligence app ($10 standalone, "which
// seat fits your preferences" decision tool). Full inventory: 13
// grandstands, 1 General Admission (festival_lawn), 2 hospitality products
// (Champions Club, F1 Paddock Club). Researched 28 Sep 2026.
//
// SCOPE DECISION (founder, 28 Sep 2026): gpcanada.ca's own 12 local
// hospitality products (Podium Suite, Elite Suite, Chalet Platine, Podium
// Club, Elite Club, Club de l'Île, Club Cosmos, Privilège 12, Privilège 17,
// 4 Terraces, TOUNDRA, LA JAMAÏQUE) are DELIBERATELY EXCLUDED from this
// seed — two genuine official hospitality channels exist (F1's global
// channel vs. gpcanada.ca's own local line) and the founder chose to seed
// only F1's global channel (Paddock Club, Champions Club) rather than risk
// seeding unconfirmed near-duplicates across two sellers, same reasoning as
// the Mexico City GP precedent (see feedback_f1_tickets_reseller_verification
// / mexicogp.mx exclusion in the skill).
//
// "Grandstand 10" (listed on gpcanada.ca's own grandstand category page,
// 27 Sep 2026 crawl) and "Grandstand 12" (missing from that same category
// page but confirmed real and NEW for 2026 via direct search) — GS10 could
// not be re-confirmed as a current product via search and does not appear
// in the founder's 2026 pricing reference; excluded rather than guessed.
// GS12 is included, confirmed via independent search (Senna corner, new
// 2026, own VIP sub-tier "Privilège 12" — sub-tier itself excluded per the
// scope decision above).
//
// PRICING SOURCING NOTE — 2027 official ticketing is WAITLIST-ONLY, no
// real 2027 prices published anywhere (confirmed directly on
// ticketing.formula1.com/hospitality/canada/, 28 Sep 2026). All USD price
// signals below come from a single unverified secondary source (a Google
// AI Mode search summary screenshotted by the founder, no primary
// URL/citation visible) showing 2026-edition figures — used PURELY for
// ordinal tier placement (cheap → expensive), never displayed to a fan as
// a real number. Two grandstands (1, 16) also have independently-sourced
// real figures from gpcanada.ca's own pages/press coverage, noted per-seat
// below as the higher-confidence anchor.
//
// Known gaps, left honest rather than guessed:
// - Grandstand 16: `covered` left NULL — not stated on its own official
//   page or any secondary source checked.
// - All 13 grandstands: RESERVED per gpcanada.ca's own grandstand category
//   page (every grandstand explicitly listed as reserved seating) — this
//   circuit differs from Interlagos/Brazilian GP, where most stands are
//   unreserved. Only Platine additionally has backrest seating called out.
// - Only Platine confirmed COVERED among the 13 grandstands (gpcanada.ca +
//   2 independent guides agree); all others open-air, confirmed by
//   sitwhere.com and fanamp.com cross-check.
// - singleDayAvailable = false for every seat — every grandstand/
//   hospitality/GA product found sells 3-day (Fri-Sun) only, no single-day
//   option located anywhere in research (confirmed directly for Tribune 1,
//   Grandstand 16, Platine, General Admission, Champions Club).
// - F1 Paddock Club: 2027 product details not yet published (waitlist-only
//   page). Location/inclusions description is the STANDARD Paddock Club
//   format used across F1 circuits (confirmed via f1experiences.com's
//   general Paddock Club copy for this circuit), not confirmed 2027-specific.

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const EVENT_ID = "f054e849-849e-44a2-85c2-d150d973e1bf"; // Canadian GP 2027

const tierRows = await sql`
  SELECT id, tier FROM planner_ticket_tier_cost WHERE sporting_event_id = ${EVENT_ID}
`;
const tierIdByKey = Object.fromEntries(tierRows.map((r) => [r.tier, r.id]));
for (const t of ["tier1", "tier2", "tier3", "tier4"]) {
  if (!tierIdByKey[t]) throw new Error(`Missing expected ${t} row for event ${EVENT_ID} — aborting.`);
}

const SEATS = [
  // ─── tier1 (GA, $300 seeded) ─────────────────────────────────────────
  {
    seatName: "General Admission",
    seatType: "festival_lawn",
    zoneLabel:
      "Best pockets: Turn 10 Hairpin (Lance Stroll side), Turns 1-2 (near GS11/12), Turns 8-9 (behind GS31)",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: false,
    sourceNote:
      "HIGH confidence (product terms) — 3-day ticket confirmed directly on gpcanada.ca's own GA page. Standing/lawn access to multiple viewing zones, first-come-first-served, explicitly 'visibility may be limited.' Named spots per 2 independent GA-specific guides: the hairpin-side pocket beside the Lance Stroll (Turn 10) grandstand is the best-regarded GA view (overtaking + big-screen sightline) but very crowded, requiring an early arrival; the area between/in front of Grandstands 11 & 12 (Turns 1-2) catches cars entering the first corner combination; the straight behind Grandstand 31 (Turns 8-9) offers shaded standing with no big-screen view. Circuit is flat with double-fencing throughout, so every GA view is genuinely limited regardless of spot — stated plainly rather than oversold. Children 11-and-under free with a paying adult (1 per adult, wristband required). USD price signal (~$300, LOWER confidence — unverified 2026 secondary aggregate, ordinal use only) places it as the cheapest product. Sources: oversteer48.com/montreal-grand-prix-general-admission (named spots, crowding, Lance Stroll pocket), manas96.github.io/blog/f1guide (Turns 1-2 pocket, Grandstand 31 shade), gpcanada.ca/en/tickets/general-admission (product terms), unverified 2026 secondary price summary (28 Sep 2026).",
    ticketTierId: tierIdByKey.tier1,
  },
  // ─── tier2 ($375-750 seeded) ────────────────────────────────────────
  {
    seatName: "Grandstand 47",
    seatType: "grandstand",
    zoneLabel: "Casino Straight, inside Hairpin (Turns 10-11)",
    actionTags: ["overtaking", "high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence (location/reserved status) — gpcanada.ca's own grandstand category page. Cars exiting the Hairpin and accelerating up the back straight. USD price signal (~$375, LOWER confidence — unverified 2026 secondary aggregate) places it as the cheapest numbered grandstand. Sources: gpcanada.ca/en/type-de-billet/grandstands, sitwhere.com/canadian-formula-1-grand-prix, grandprixgrandtours.com/canada-circuit-guide, unverified 2026 secondary price summary (28 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Grandstand 46",
    seatType: "grandstand",
    zoneLabel: "Casino Straight, Hairpin exit",
    actionTags: ["overtaking", "high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence (location/reserved status) — gpcanada.ca's own grandstand category page, cross-checked sitwhere.com/grandprixgrandtours.com. Hairpin entry/exit view, cars at full power down the straight, Expo Biosphere backdrop. USD price signal (~$390, LOWER confidence, ordinal only). Sources: gpcanada.ca/en/type-de-billet/grandstands, grandprixgrandtours.com/canada-circuit-guide, unverified 2026 secondary price summary (28 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Grandstand 33 (Family Grandstand)",
    seatType: "grandstand",
    zoneLabel: "Turns 6-7",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — confirmed by name 'Grandstand 33 (Family Grandstand)' directly on canada.gp's own ticket-info page. Left-right corner sequence at ~100kph. Discounted child entry (11 and under) when accompanied by an adult. USD price signal (~$495, LOWER confidence, ordinal only). Sources: canada.gp/en/ticket-info/grandstand-33-family-grandstand, gpcanada.ca/en/type-de-billet/grandstands, fanamp.com/tr/canadian-grand-prix-seating-guide, unverified 2026 secondary price summary (28 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Grandstand 31",
    seatType: "grandstand",
    zoneLabel: "Turns 8-9, DRS zone / Bridge Straight chicane entry",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence (location/reserved status) — gpcanada.ca's own grandstand category page, cross-checked grandprixgrandtours.com (DRS zone, hard braking, cars passing under the bridge). USD price signal (~$515, LOWER confidence, ordinal only). Sources: gpcanada.ca/en/type-de-billet/grandstands, grandprixgrandtours.com/canada-circuit-guide, unverified 2026 secondary price summary (28 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Grandstand 34",
    seatType: "grandstand",
    zoneLabel: "Hairpin (Turn 10), inside/apex, entry braking zone",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence (location/reserved status) — gpcanada.ca's own grandstand category page ('spectacular view'), cross-checked grandprixgrandtours.com ('right on top of the action, looking directly at the apex'). USD price signal (~$530, LOWER confidence, ordinal only). Sources: gpcanada.ca/en/type-de-billet/grandstands, grandprixgrandtours.com/canada-circuit-guide, unverified 2026 secondary price summary (28 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Grandstand 16",
    seatType: "grandstand",
    zoneLabel: "Turns 13-14, Wall of Champions, final chicane",
    actionTags: ["technical_corner", "overtaking"],
    covered: null,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — confirmed directly on gpcanada.ca's own Grandstand 16 page: opposite pit lane/team garages, views of Turns 13-14 and the Wall of Champions, new fold-down bucket-style seats for 2027, 3-day ticket only. `covered` left NULL — not stated by any source checked. Two independently-sourced USD/CAD price points found: (a) founder-supplied 2026 figure ~$615 USD / $840 CAD, used for tier placement here; (b) a separate ~$1,518 CAD figure found directly on gpcanada.ca's own page — likely a different fare class or bundle, not reconciled, both noted rather than one silently discarded. Sources: gpcanada.ca/en/grandstands/grandstand-16 (location/product/price (b)), Sportskeeda (Wall of Champions history), founder-supplied 2026 price reference (price (a), 28 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Grandstand 21",
    seatType: "grandstand",
    zoneLabel: "Hairpin (Turn 10) entry, heavy braking zone",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence (location/reserved status) — gpcanada.ca's own grandstand category page: 'braking & overtaking views,' one of the circuit's primary overtaking points. Cross-checked grandprixgrandtours.com, sitwhere.com. USD price signal (~$650, LOWER confidence, ordinal only). Sources: gpcanada.ca/en/type-de-billet/grandstands, grandprixgrandtours.com/canada-circuit-guide, unverified 2026 secondary price summary (28 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Grandstand 15",
    seatType: "grandstand",
    zoneLabel: "Turn 10 Hairpin, short straight leading into the braking zone (outside perimeter)",
    actionTags: ["overtaking", "high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence (location/reserved status) — gpcanada.ca's own grandstand category page ('one of the circuit's top overtaking opportunities'), cross-checked grandprixgrandtours.com, sitwhere.com. USD price signal (~$680, LOWER confidence, ordinal only). Sources: gpcanada.ca/en/type-de-billet/grandstands, grandprixgrandtours.com/canada-circuit-guide, sitwhere.com/canadian-formula-1-grand-prix, unverified 2026 secondary price summary (28 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Grandstand 24 (Lance Stroll)",
    seatType: "grandstand",
    zoneLabel: "Hairpin, opposite Grandstand 21, main straightaway",
    actionTags: ["overtaking", "podium_atmosphere"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence (location/reserved status) — official 'Lance Stroll' naming confirmed via gpcanada.ca/grandprixgrandtours.com, formerly Grandstand 24. Described as fan-favourite with 'party-like atmosphere,' near-unobstructed Hairpin views, Montreal skyline + Expo Biosphere backdrop. USD price signal (~$750, LOWER confidence, ordinal only). Sources: gpcanada.ca/en/type-de-billet/grandstands, grandprixgrandtours.com/canada-circuit-guide, sitwhere.com/canadian-formula-1-grand-prix, unverified 2026 secondary price summary (28 Sep 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  // ─── tier3 ($777-1345 seeded) ───────────────────────────────────────
  {
    seatName: "Grandstand 11",
    seatType: "grandstand",
    zoneLabel: "Senna Curve (Turns 1-2), pit exit",
    actionTags: ["technical_corner", "pit_lane"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence (location/reserved status) — gpcanada.ca's own grandstand category page, cross-checked grandprixgrandtours.com (apex of Turn 2, entry into first two corners, overtaking into Turn 1, pit exit at full speed). USD price signal (~$780, LOWER confidence, ordinal only). Sources: gpcanada.ca/en/type-de-billet/grandstands, grandprixgrandtours.com/canada-circuit-guide, unverified 2026 secondary price summary (28 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Grandstand 12",
    seatType: "grandstand",
    zoneLabel: "Senna Curve (Turns 1-3), pit exit",
    actionTags: ["technical_corner", "pit_lane"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence (product real, new for 2026) — confirmed via direct search: brand new grandstand for 2026, prime view of Turns 1-3 and the pit lane, one of the most popular/fastest-selling stands. NOT found on gpcanada.ca's own grandstand category page as crawled 27-28 Sep 2026 (possible stale/incomplete page crawl) — real product confirmed independently via canada.gp's own ticket-info page for it. Has its own VIP sub-tier 'Privilège 12' (deliberately excluded from this seed per the scope decision above). USD price signal (~$780, same band as GS11, LOWER confidence, ordinal only). Sources: canada.gp/en/ticket-info (Grandstand 12 page), gpcanada.ca/en/tickets/privilege-12 (VIP sub-tier, not seeded), unverified 2026 secondary price summary (28 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Grandstand 1",
    seatType: "grandstand",
    zoneLabel: "Opposite pit lane and team garages, main straight",
    actionTags: ["start_grid", "pit_lane", "podium_atmosphere"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — confirmed directly on gpcanada.ca's own Tribune 1 page: pit stops, grid formation, race start, official ceremonies, backrest reserved seating, 3-day ticket only, up to 3 people over 3 days. Real ~$1,065 CAD (3-day) price found directly on that page, roughly consistent with founder-supplied USD signal (~$777-906). Sources: gpcanada.ca/billets/tribune-1 (product detail + CAD price), unverified 2026 secondary price summary (USD ordinal, 28 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Grandstand Platine",
    seatType: "grandstand",
    zoneLabel: "Straight from starting grid to Senna Curve",
    actionTags: ["start_grid", "high_speed"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence — confirmed directly on gpcanada.ca's own Platine Grandstand page: covered structure, reserved seating with backrest, giant screen, access to support-race paddock and fan zone, described as 'maximum comfort, rain or shine.' Only covered grandstand at the circuit (confirmed by 2 independent sources — sitwhere.com, grandprixgrandtours.com). USD price signal (~$1,345, LOWER confidence — highest of all grandstands, ordinal only). Sources: gpcanada.ca/en/tickets/platine-grandstand, sitwhere.com/canadian-formula-1-grand-prix, unverified 2026 secondary price summary (28 Sep 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  // ─── tier4 ($4800-9800 seeded) ──────────────────────────────────────
  {
    seatName: "Champions Club (3-Day Blanc)",
    seatType: "hospitality",
    zoneLabel: "Final chicane, Wall of Champions",
    actionTags: ["technical_corner", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "HIGH confidence (product real, confirmed already SOLD OUT for 2027) — confirmed directly on f1experiences.com's own product page: covered two-level venue (table seating + lounge level), canapes/lunch/open bar, F1 Insider Appearances, Grid Walk + Championship Trophy Photo, guided Paddock Tour, F1 Authentics gift. 3-day only. USD price signal (~$4,800-5,500, LOWER confidence, ordinal only — no real 2027 price published, product already sold out). Sources: f1experiences.com/2027-canadian-grand-prix-amex/champions-club-3-days-blanc, unverified 2026 secondary price summary (28 Sep 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "F1 Paddock Club",
    seatType: "hospitality",
    zoneLabel: "Above the F1 team garages, start/finish straight",
    actionTags: ["start_grid", "pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    sourceNote:
      "LOWER confidence — F1's official Canadian GP 2027 hospitality page (ticketing.formula1.com/hospitality/canada) is confirmed WAITLIST-ONLY as of 28 Sep 2026, with 'full details on available packages... announced soon' — no 2027 product specifics or pricing published anywhere. Location/inclusions description (pit-stop strategy views, Pit Lane Walk, world-class cuisine, F1 appearances) reflects the STANDARD Paddock Club format used across F1 circuits generally, not confirmed 2027-Canada-specific content. USD price signal (~$8,000-9,800, highest of all seats, LOWER confidence, ordinal only). Sources: ticketing.formula1.com/hospitality/canada (waitlist status), f1experiences.com/2027-canadian-grand-prix (general Paddock Club description), unverified 2026 secondary price summary (28 Sep 2026).",
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

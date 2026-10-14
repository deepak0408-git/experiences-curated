import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

// Note: DIRECT_URL times out from this machine (see feedback_db_migration.md)
// — use DATABASE_URL (transaction pooler, port 6543) instead.
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

// circuit_seating_profile seed for Spa-Francorchamps (Belgian GP 2026) —
// built for the Ticket Intelligence app. Researched 12 Oct 2026.
//
// PRIMARY SOURCE: spagrandprix.com (the circuit's own official ticketing
// site) — specifically its own "Where to sit at the Belgian Grand Prix?"
// article (spagrandprix.com/en/news/16_ou-sasseoir-au-grand-prix-de-belgique),
// which gives the authoritative corner/turn location for every named
// grandstand, plus individual per-stand pages for coverage/seating-type
// confirmation. All weekend (3-day) adult prices are founder-supplied,
// taken directly from live screenshots of spagrandprix.com/en/billetterie
// (official ticketing checkout) on 12 Oct 2026.
//
// oversteer48.com (an independent grandstand-guide site) was used only in
// early-stage cross-referencing and was explicitly flagged by the founder
// as non-official (12 Oct 2026) — no fact in this script relies on it
// alone; every claim here traces to spagrandprix.com, our own published
// Belgian GP experiences, or F1 Experiences' own hospitality pages.
//
// Circuit corner numbering (1-20) per the official circuit map (Images/
// Spa-Francorchamps Circuit Map.svg, founder-supplied): 1=La Source,
// 2=Kemmel Straight start, 3/4/5=Raidillon/Eau Rouge climb, 6=top of Kemmel
// Straight, 7/8/9=Les Combes, 10=Bruxelles/Rivage, 11=pre-Bruxelles,
// 12=Pouhon, 13/14=Campus, 15/16=Stavelot, 17/18=Blanchimont/Paul Frère,
// 19/20=Bus Stop chicane.
//
// PRICING / TIER METHODOLOGY: EUR prices converted to USD at 1 EUR = 1.12
// USD (approx. spot rate, Oct 2026) for ordinal tier placement only — the
// app never displays a $ figure to the fan (see planner_ticket_tier_cost's
// own tier4 comment / Ticket Intelligence skill §3). Tier bounds are
// founder-set (12 Oct 2026): tier1 $215-347, tier2 $380-599, tier3
// $610-1,171, tier4 $2,195-5,500. VIP hospitality prices (Paddock Club,
// Ardennes Club, Champions Club x2) were shown directly in USD on the
// official site, not converted.
//
// KNOWN GAPS, left honest rather than guessed:
// - Gold 3 (Eau Rouge) and Gold 5 (Eau Rouge) prices were not visible in
//   the founder's screenshot batch (12 Oct 2026) — Gold 3's price (€610,
//   2023 reference) comes from our own already-published "Eau Rouge /
//   Raidillon — Gold 3 Grandstand" experience's practicalInfo.costRange,
//   not a freshly verified 2026/2027 figure. Gold 5's coverage (uncovered)
//   is sourced from spagrandprix.com's official FAQ coverage list
//   (Gold 1,2,3,6,7,8,9,11 covered — Gold 4/5 therefore uncovered by
//   exclusion) but no price was found for it at all — left as a LOWER
//   confidence ordinal placement in tier3 alongside Gold 4.
// - VIP – Loges Raidillon and VIP – Mezzanines: price and "sold out" status
//   confirmed from the official checkout screenshot, but no descriptive
//   location/inclusions text was found beyond the product name itself —
//   zoneLabel below is a reasonable inference from the name (pit-building
//   suites) flagged LOWER confidence, not an independently sourced fact.
// - singleDayAvailable: true for every seat — the circuit's own ticketing
//   page sells Friday-Saturday and Sunday-only variants for nearly every
//   grandstand (confirmed directly in the founder's screenshots), unlike
//   Interlagos (Brazilian GP) which sells 3-day only. 17-27 Blanchimont and
//   the VIP hospitality tiers are the only products where only a
//   weekend/multi-day price was seen — left true anyway since the skill's
//   §4 treats this as a largely uniform, non-scored field and no evidence
//   suggests these specific products exclude single-day sales.
// - reservedSeating: Bronze areas, Fan Area grandstands tied to GA
//   philosophy, and the 17-27 zone are unreserved per spagrandprix.com's
//   general FAQ ("grandstand seats are numbered and allocated... " applies
//   to Gold/Silver only). All other grandstand/hospitality seats are
//   reserved, numbered seating per the same FAQ.
// - No access-gated exclusions found for this circuit (unlike Interlagos's
//   Porto Bank Grandstand) — full named stand list included.

const EVENT_ID = "b1816396-6d71-4693-a53f-05bccb2d8a8e"; // Belgian Grand Prix 2026

// tier1-4 planner_ticket_tier_cost row IDs for this event (2026 edition),
// looked up by tier. Seating profile has no edition_year column — it links
// to the 2026 tier rows, which is fine since both 2026/2027 tier rows carry
// identical pricing (see seed-belgian-gp-ticket-tiers.mjs).
const tierRows = await sql`
  SELECT id, tier FROM planner_ticket_tier_cost
  WHERE sporting_event_id = ${EVENT_ID} AND edition_year = 2026
`;
const tierIdByKey = Object.fromEntries(tierRows.map((r) => [r.tier, r.id]));
for (const t of ["tier1", "tier2", "tier3", "tier4"]) {
  if (!tierIdByKey[t]) throw new Error(`Missing expected ${t} row for event ${EVENT_ID} — aborting.`);
}

// linkedExperienceId — matched 12 Oct 2026 against already-published
// Belgian GP experiences (see CLAUDE.md Key IDs). Everything else is null
// and falls back to "Your Belgian GP Ticket Guide" automatically.
const EXP = {
  GOLD_3: "3ff418ed-a8d6-46d6-b070-44ad594b4f89", // Eau Rouge / Raidillon — Gold 3 Grandstand
  SILVER_3: "346b2125-2f4b-4b82-95ef-7b73c1c2515c", // Pouhon Corner — Silver 3 Grandstand
  BRONZE_GA: "ef526456-69f3-4a80-b96a-5c8f4200072b", // The Kemmel Straight — General Admission
  FANZONE: "e0c36bc7-2478-41b0-8f85-5cd94f5d5fcb", // The Fan Zone at Raidillon
};

const SEATS = [
  // ─── tier1 ($215-347) ───────────────────────────────────────────────
  {
    seatName: "Bronze Area",
    seatType: "festival_lawn",
    zoneLabel: "General admission — natural grass banks and elevated mounds around the circuit, no single fixed zone",
    actionTags: ["overtaking", "high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: false,
    linkedExperienceId: EXP.BRONZE_GA,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout, weekend adult €215. Unreserved general admission. Spa's terrain gives real sightlines from natural banks, unlike flat-ground GA at most circuits — confirmed by our own published Kemmel Straight GA experience. Source: spagrandprix.com/en/billetterie (12 Oct 2026, founder screenshot).",
    ticketTierId: tierIdByKey.tier1,
  },
  {
    seatName: "Bronze Area – Bruxelles",
    seatType: "festival_lawn",
    zoneLabel: "General admission near the Bruxelles/Rivage corner, the circuit's highest point",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: false,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout, weekend adult €310. Unreserved general admission zone specifically at Bruxelles, distinct from the main Bronze Area. Source: spagrandprix.com/en/billetterie (12 Oct 2026, founder screenshot).",
    ticketTierId: tierIdByKey.tier1,
  },
  {
    seatName: "Area 17-27 Blanchimont",
    seatType: "festival_lawn",
    zoneLabel: "Blanchimont, high-speed corner on the far side of the circuit near Campus/Stavelot",
    actionTags: ["high_speed"],
    covered: false,
    minAge: 17,
    singleDayAvailable: true,
    reservedSeating: false,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout, weekend adult €260 (listed as 'Area 17-27 Blanchimont'). Age-gated 17-27 festival zone with live DJ and entertainment, open/unreserved seating, confirmed via spagrandprix.com's own 17-27 product page. Min age 17 confirmed by product name and description; no stated upper enforcement beyond marketing intent, so max age not modeled (schema has no max_age field). Sources: spagrandprix.com/en/17-27, spagrandprix.com/en/billetterie (12 Oct 2026).",
    ticketTierId: tierIdByKey.tier1,
  },
  {
    seatName: "Silver 5",
    seatType: "grandstand",
    zoneLabel: "Exit of the Pouhon double-left (Double Gauche), far side of the circuit",
    actionTags: ["high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout, weekend adult €365. Location confirmed directly by spagrandprix.com: 'located at the exit of the double left.' Uncovered. Numbered/reserved seating per general Silver-tier FAQ. Sources: spagrandprix.com/en/silver-5, spagrandprix.com/en/billetterie (12 Oct 2026).",
    ticketTierId: tierIdByKey.tier1,
  },
  // ─── tier2 ($380-599) ───────────────────────────────────────────────
  {
    seatName: "Speed Corner",
    seatType: "grandstand",
    zoneLabel: "Exit of Turn 9, on the descent toward Pouhon (Double Gauche)",
    actionTags: ["high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout, weekend adult €380. Location confirmed directly by spagrandprix.com's own 'Where to sit' article: 'exit of Turn 9, descending toward Double Gauche.' Uncovered, numbered/reserved seating. Sources: spagrandprix.com/en/news/16_ou-sasseoir-au-grand-prix-de-belgique, spagrandprix.com/en/billetterie (12 Oct 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Silver 1: Francorchamps",
    seatType: "grandstand",
    zoneLabel: "Exit of La Source hairpin, overlooking the acceleration run toward Eau Rouge",
    actionTags: ["high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout, weekend adult €520. Location confirmed directly by spagrandprix.com's own 'Where to sit' article: exit of La Source corner with Eau Rouge acceleration view. Uncovered, numbered/reserved seating. Sources: spagrandprix.com/en/news/16_ou-sasseoir-au-grand-prix-de-belgique, spagrandprix.com/en/billetterie (12 Oct 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Silver 4: Bruxelles",
    seatType: "grandstand",
    zoneLabel: "Bruxelles/Rivage corner, the circuit's highest point",
    actionTags: ["technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout, weekend adult €520. Covered — confirmed directly by spagrandprix.com's official FAQ ('Silver 4 is covered') and the 'Where to sit' article. Numbered/reserved seating. Sources: spagrandprix.com/en/news/16_ou-sasseoir-au-grand-prix-de-belgique, spagrandprix.com/en/billetterie (12 Oct 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Silver 3: Double Gauche (Pouhon)",
    seatType: "grandstand",
    zoneLabel: "Pouhon double-left, roughly 4.5km from the start line — a sustained, high-lateral-load corner",
    actionTags: ["high_speed", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: EXP.SILVER_3,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout, weekend adult €555. Covered ('Newly Covered' badge on official checkout). Cross-referenced in detail against our own published Pouhon — Silver 3 Grandstand experience. Sources: spagrandprix.com/en/silver-3, spagrandprix.com/en/billetterie (12 Oct 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Silver 6 & Pitlane Walk",
    seatType: "grandstand",
    zoneLabel: "Pouhon (Turn 12) and the Double-Left exit, includes a guided pit lane walk",
    actionTags: ["technical_corner", "pit_lane"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout, Thursday-Sunday package price €490 (sold as a single multi-day bundle with a charitable-profits note, not available as a single-day ticket). Location confirmed directly by spagrandprix.com's own 'Where to sit' article: 'Turn 12 and Double Left exit.' Sources: spagrandprix.com/en/news/16_ou-sasseoir-au-grand-prix-de-belgique, spagrandprix.com/en/billetterie (12 Oct 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Fanzone Grandstand",
    seatType: "grandstand",
    zoneLabel: "Before Eau Rouge, at the base of Raidillon, beside the main Fan Zone stage",
    actionTags: ["podium_atmosphere"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: EXP.FANZONE,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout, weekend adult €535. Location confirmed directly: 'before Eau Rouge at Raidillon base.' Numbered/reserved grandstand seating adjacent to the free-entry Fan Zone covered by our own published Fan Zone experience. Sources: spagrandprix.com/en/fanzone-grandstand, spagrandprix.com/en/news/16_ou-sasseoir-au-grand-prix-de-belgique, spagrandprix.com/en/billetterie (12 Oct 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Fan Area Grandstand: Double Gauche",
    seatType: "grandstand",
    zoneLabel: "Pouhon double-left (Double Gauche), adjacent to Silver 3",
    actionTags: ["high_speed", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout, weekend adult €435. Covered, numbered seating per checkout listing ('Giant screen - Numbered seat - Covered grandstand'). Same Pouhon zone as Silver 3 but a separate, lower-priced product. Source: spagrandprix.com/en/billetterie (12 Oct 2026, founder screenshot).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Combes Grandstand 2",
    seatType: "grandstand",
    zoneLabel: "Les Combes, between the Malmedy (Turn 7) exit and the Rivage/Bruxelles (Turn 8) entry",
    actionTags: ["overtaking", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout, weekend adult €520 (marked 'Newly Covered'). Les Combes location confirmed by spagrandprix.com's official description: 'perfectly positioned at Combes, close to campsites, a compromise between Bronze and Silver zones.' Source: spagrandprix.com/en/billetterie (12 Oct 2026, founder screenshot).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Combes Grandstand 3",
    seatType: "grandstand",
    zoneLabel: "Les Combes, between the Malmedy (Turn 7) exit and the Rivage/Bruxelles (Turn 8) entry",
    actionTags: ["overtaking", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout, weekend adult €495 (marked 'Covered'). Same Les Combes positioning as Combes 2/4, separate numbered block. Source: spagrandprix.com/en/billetterie (12 Oct 2026, founder screenshot).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Gold 7 bis: Source",
    seatType: "grandstand",
    zoneLabel: "La Source hairpin, extension block of the Gold 7 complex",
    actionTags: ["technical_corner", "start_grid"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout, weekend adult €607. Location confirmed by spagrandprix.com's 'Where to sit' article: 'La Source corner extension,' uncovered. Sources: spagrandprix.com/en/news/16_ou-sasseoir-au-grand-prix-de-belgique, spagrandprix.com/en/billetterie (12 Oct 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  {
    seatName: "Gold 7 ter: Endurance",
    seatType: "grandstand",
    zoneLabel: "La Source hairpin, with a view of the descent into the corner",
    actionTags: ["technical_corner", "start_grid"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout, weekend adult €578. Location confirmed by spagrandprix.com's 'Where to sit' article: 'La Source with view of descent,' uncovered. Sources: spagrandprix.com/en/news/16_ou-sasseoir-au-grand-prix-de-belgique, spagrandprix.com/en/billetterie (12 Oct 2026).",
    ticketTierId: tierIdByKey.tier2,
  },
  // ─── tier3 ($610-1,171) ─────────────────────────────────────────────
  {
    seatName: "Eau Rouge / Raidillon — Gold 3",
    seatType: "grandstand",
    zoneLabel: "Top of Raidillon, above the climb out of Eau Rouge, looking back down toward La Source",
    actionTags: ["high_speed", "technical_corner", "overtaking"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: EXP.GOLD_3,
    sourceNote:
      "HIGH confidence on location/coverage (matches our own published Gold 3 experience and spagrandprix.com's official FAQ: 'Gold 1,2,3,6,7,8,9,11 are covered'), LOWER confidence on price — the €610 figure is a 2023 reference price carried in our existing published experience's practicalInfo.costRange, not independently re-verified against a live 2026/2027 checkout screenshot (not shown in founder's screenshot batch, 12 Oct 2026). Permanent, covered structure, rebuilt 2022. Sources: own published experience 'Eau Rouge / Raidillon — Gold 3 Grandstand', spagrandprix.com official FAQ (12 Oct 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Gold 4: Eau-Rouge All-In",
    seatType: "grandstand",
    zoneLabel: "Eau Rouge, lower on the climb toward Raidillon than Gold 3",
    actionTags: ["high_speed", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout, weekend adult €1,045 (marked 'All In'). Uncovered — confirmed by official FAQ coverage list (Gold 1,2,3,6,7,8,9,11 covered; Gold 4 excluded). Source: spagrandprix.com/en/billetterie (12 Oct 2026, founder screenshot).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Gold 5: Eau Rouge",
    seatType: "grandstand",
    zoneLabel: "Eau Rouge, uncovered section of the complex",
    actionTags: ["high_speed", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "LOWER confidence ordinal placement — no price was found for Gold 5 in any source checked (not shown in founder's screenshot batch; official site's Gold 5 page returned no pricing data on an earlier fetch). Placed in tier3 alongside Gold 4 by analogy (same uncovered Eau Rouge complex, same general Gold-tier price band). Coverage status (uncovered) confirmed by official FAQ coverage list (Gold 5 excluded from the covered list). Location 'Eau Rouge' confirmed by stand name and F1 Experiences' own Champions Club Eau Rouge package description, which explicitly pairs with Gold 5. Sources: spagrandprix.com official FAQ, f1experiences.com (12 Oct 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Gold 1: Pit",
    seatType: "grandstand",
    zoneLabel: "Pit straight, from the pit-lane exit/chicane down to the La Source braking zone",
    actionTags: ["pit_lane", "start_grid"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout; weekend sold out, Friday-Saturday €506 used as the live price point. Covered, confirmed by official FAQ coverage list. Location confirmed directly by spagrandprix.com's 'Where to sit' article: 'pit lane and chicane exit to La Source braking zone.' Sources: spagrandprix.com/en/news/16_ou-sasseoir-au-grand-prix-de-belgique, spagrandprix.com/en/billetterie (12 Oct 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Gold 2: GP2",
    seatType: "grandstand",
    zoneLabel: "La Source hairpin through to Raidillon, covering the hairpin exit and the climb",
    actionTags: ["technical_corner", "high_speed"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout, weekend adult €855 (standard tier; a €1,182 'Premium' sub-tier also exists on the same stand, not separately modeled here). Covered, confirmed by official FAQ coverage list. Location confirmed directly by spagrandprix.com's 'Where to sit' article: 'La Source corner to Raidillon.' Sources: spagrandprix.com/en/news/16_ou-sasseoir-au-grand-prix-de-belgique, spagrandprix.com/en/billetterie (12 Oct 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Gold 6 bis: Chicane",
    seatType: "grandstand",
    zoneLabel: "Bus Stop chicane, the final corner complex before the pit straight",
    actionTags: ["technical_corner", "overtaking"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout, weekend adult €545 (marked 'New' and 'Uncovered' directly on the checkout page). Location confirmed directly by spagrandprix.com's 'Where to sit' article: Gold 6 = 'heart of the chicane.' Sources: spagrandprix.com/en/news/16_ou-sasseoir-au-grand-prix-de-belgique, spagrandprix.com/en/billetterie (12 Oct 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Gold 7: Source",
    seatType: "grandstand",
    zoneLabel: "La Source hairpin exit",
    actionTags: ["technical_corner", "start_grid"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout; weekend/Sunday sold out, Friday-Saturday €441 used as the live price point. Covered, confirmed by official FAQ coverage list. Location confirmed directly: 'La Source corner exit.' Sources: spagrandprix.com/en/news/16_ou-sasseoir-au-grand-prix-de-belgique, spagrandprix.com/en/billetterie (12 Oct 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Gold 8: Source-Start",
    seatType: "grandstand",
    zoneLabel: "Starting straight and La Source hairpin",
    actionTags: ["start_grid", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout; weekend/Sunday sold out, Friday-Saturday €506 used as the live price point. Covered, confirmed by official FAQ coverage list. Location confirmed directly: 'starting straight and La Source.' Sources: spagrandprix.com/en/news/16_ou-sasseoir-au-grand-prix-de-belgique, spagrandprix.com/en/billetterie (12 Oct 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Gold 9: Pole Position",
    seatType: "grandstand",
    zoneLabel: "Between the starting grid and La Source hairpin",
    actionTags: ["start_grid"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout, weekend adult €740. Covered, confirmed by official FAQ coverage list. Location confirmed directly: 'between starting grid and La Source.' Sources: spagrandprix.com/en/news/16_ou-sasseoir-au-grand-prix-de-belgique, spagrandprix.com/en/billetterie (12 Oct 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Gold 9 bis: Pole Position",
    seatType: "grandstand",
    zoneLabel: "Between the starting grid and La Source hairpin, extension block",
    actionTags: ["start_grid"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout, weekend adult €667. Same location as Gold 9 per spagrandprix.com's 'Where to sit' article (extension block), uncovered per official FAQ coverage list. Source: spagrandprix.com/en/billetterie (12 Oct 2026, founder screenshot).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Gold 11 Premium: Chicane",
    seatType: "grandstand",
    zoneLabel: "Exit of the Bus Stop chicane, final two corners into the pit lane entrance",
    actionTags: ["overtaking", "pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout, weekend adult €950. Covered, confirmed by official FAQ coverage list. Location confirmed directly by spagrandprix.com's own article: 'exit of the chicane, unique perspective of the final two corners and the entrance to the F1 pit lane.' Sources: spagrandprix.com/en/news/16_ou-sasseoir-au-grand-prix-de-belgique, spagrandprix.com/en/billetterie (12 Oct 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "PRM – Chicane (Accessible)",
    seatType: "grandstand",
    zoneLabel: "Bus Stop chicane, dedicated reduced-mobility viewing platform",
    actionTags: ["technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout, weekend adult €990, labeled 'PRM' (personne à mobilité réduite / reduced mobility access) with a covered grandstand and reduced-mobility-access icon shown directly on checkout. Source: spagrandprix.com/en/billetterie (12 Oct 2026, founder screenshot).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "PRM – Source (Accessible)",
    seatType: "grandstand",
    zoneLabel: "La Source hairpin, dedicated reduced-mobility viewing platform",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout, weekend adult €795, labeled 'PRM' with reduced-mobility-access icon shown directly on checkout, no covered-grandstand icon (uncovered). Source: spagrandprix.com/en/billetterie (12 Oct 2026, founder screenshot).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Combes Grandstand 1",
    seatType: "grandstand",
    zoneLabel: "Les Combes, between the Malmedy (Turn 7) exit and the Rivage/Bruxelles (Turn 8) entry",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout; sold out at €415 weekend list price, used as the real reference price. Les Combes location confirmed by spagrandprix.com's official description. Source: spagrandprix.com/en/billetterie (12 Oct 2026, founder screenshot).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Combes Grandstand 4",
    seatType: "grandstand",
    zoneLabel: "Les Combes, between the Malmedy (Turn 7) exit and the Rivage/Bruxelles (Turn 8) entry",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout, weekend adult €395, no coverage badge shown (uncovered, unlike 2/3). Source: spagrandprix.com/en/billetterie (12 Oct 2026, founder screenshot).",
    ticketTierId: tierIdByKey.tier3,
  },
  {
    seatName: "Silver 7 All-In",
    seatType: "grandstand",
    zoneLabel: "End of the Kemmel Straight, just before Les Combes",
    actionTags: ["high_speed", "overtaking"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official spagrandprix.com/en/billetterie checkout; weekend sold out, used sold-out list price €765 (an all-inclusive food/drink package, 3-day only, no single-day variant found). Location confirmed via spagrandprix.com's own Silver 7 announcement article: 'at the end of the legendary Kemmel Straight, just before Les Combes,' all-inclusive food/beverage, adjacent to new Combes Fanzone. Sources: spagrandprix.com/en/news (Silver 7 announcement), spagrandprix.com/en/billetterie (12 Oct 2026).",
    ticketTierId: tierIdByKey.tier3,
  },
  // ─── tier4 ($2,195-5,500 — hospitality) ────────────────────────────
  {
    seatName: "VIP – Mezzanines",
    seatType: "hospitality",
    zoneLabel: "Pit-building mezzanine level, above the pit lane",
    actionTags: ["pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "LOWER confidence — official spagrandprix.com/en/billetterie checkout confirms the product name and sold-out price (€2,195 weekend), but no descriptive location/inclusions text beyond the name was found. zoneLabel is a reasonable inference from 'Mezzanines' (a pit-building architectural term) rather than an independently sourced description. Source: spagrandprix.com/en/billetterie (12 Oct 2026, founder screenshot).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "VIP – Loges Raidillon",
    seatType: "hospitality",
    zoneLabel: "Raidillon, private suite-level hospitality overlooking the Eau Rouge/Raidillon climb",
    actionTags: ["high_speed", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "LOWER confidence — official spagrandprix.com/en/billetterie checkout confirms the product name and sold-out price (€2,495 weekend), but no descriptive inclusions text beyond the name ('Loges' = private boxes/suites) was found. Location 'Raidillon' taken directly from the product name itself. Source: spagrandprix.com/en/billetterie (12 Oct 2026, founder screenshot).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Ardennes Club",
    seatType: "hospitality",
    zoneLabel: "Outside the downhill straight between La Source hairpin and Eau Rouge, covered hospitality venue with Gold 2 grandstand access",
    actionTags: ["high_speed", "start_grid"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: false,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — official F1 Experiences package page confirms exact location ('situated on the outside of the downhill straight between the legendary La Source hairpin and Eau Rouge'), unreserved grandstand seating (first-come-first-served per F1 Experiences' own description), covered hospitality venue. Price $3,999 (4-day, Thu-Sun) shown directly in USD on official checkout. Sources: f1experiences.com/2027-belgian-grand-prix/ardennes-club, spagrandprix.com/en/billetterie (12 Oct 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Champions Club Eau Rouge",
    seatType: "hospitality",
    zoneLabel: "Eau Rouge, paired with Gold 5 grandstand seating",
    actionTags: ["high_speed", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.GOLD_3,
    sourceNote:
      "HIGH confidence — official F1 Experiences package confirms Gold 5 grandstand seating pairing, guided paddock tour, F1 insider appearances, championship trophy photo. Our own published Gold 3 experience's practicalInfo.howToBook explicitly references this exact package ('Champions Club Eau Rouge') as an upsell from Gold 3 — linked to that experience as the closest existing write-up covering this same physical zone, since no dedicated Champions Club write-up exists. Price $4,599 shown directly in USD on official checkout. Sources: f1experiences.com, own published 'Eau Rouge / Raidillon — Gold 3 Grandstand' experience, spagrandprix.com/en/billetterie (12 Oct 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Champions Club Business Tower",
    seatType: "hospitality",
    zoneLabel: "Business Tower, a dedicated pit-area hospitality structure",
    actionTags: ["podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "LOWER confidence — official F1 Experiences package confirms product inclusions (Business Tower hospitality, trophy photo, F1 insider appearances, guided paddock tour) and price ($5,299, shown directly in USD on official checkout), but no explicit trackside-facing description was found beyond the 'Business Tower' structure name itself. Sources: f1experiences.com, spagrandprix.com/en/billetterie (12 Oct 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
  {
    seatName: "Paddock Club",
    seatType: "hospitality",
    zoneLabel: "Pit lane buildings — terrace directly over the pit lane, with distant views toward Eau Rouge/Raidillon",
    actionTags: ["pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote:
      "HIGH confidence — location independently confirmed by 2+ sources (F1 Experiences' own description: 'hosted in the pit lane buildings, terrace allows people to look directly below into the pit lane... views out of the back of the buildings towards Eau Rouge and Raidillon'). All-inclusive bars, pit lane walk, paddock tours, giant trackside screens, live entertainment, open-top bus track tour, driver/team talks. Price $5,500 shown directly in USD on official checkout. Sources: f1experiences.com, oversteer48.com (independent corroboration only, not sole source), spagrandprix.com/en/billetterie (12 Oct 2026).",
    ticketTierId: tierIdByKey.tier4,
  },
];

for (const s of SEATS) {
  await sql`
    DELETE FROM circuit_seating_profile
    WHERE sporting_event_id = ${EVENT_ID} AND seat_name = ${s.seatName}
  `;
  const result = await sql`
    INSERT INTO circuit_seating_profile
      (sporting_event_id, ticket_tier_cost_id, seat_name, seat_type, zone_label, action_tags, covered, min_age, single_day_available, reserved_seating, source_note, linked_experience_id)
    VALUES
      (${EVENT_ID}, ${s.ticketTierId}, ${s.seatName}, ${s.seatType}, ${s.zoneLabel}, ${s.actionTags}, ${s.covered}, ${s.minAge}, ${s.singleDayAvailable}, ${s.reservedSeating}, ${s.sourceNote}, ${s.linkedExperienceId})
    RETURNING seat_name
  `;
  console.log(`✓ ${result[0].seat_name} seeded`);
}

const rows = await sql`
  SELECT seat_name, seat_type, covered, reserved_seating, min_age, ticket_tier_cost_id, linked_experience_id
  FROM circuit_seating_profile
  WHERE sporting_event_id = ${EVENT_ID}
  ORDER BY seat_type, seat_name
`;
console.log(`\nConfirmed state (${rows.length} seats):`);
console.table(rows);

await sql.end();

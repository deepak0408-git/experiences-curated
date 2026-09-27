import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// Italian GP (Monza) Ticket Intelligence seat seeding — 27 Sep 2026, via
// ticket-intelligence-researcher skill. §1 full-inventory gap: this event's
// own TicketsSpoke.tsx individually describes only 6 seats (2 GA zones,
// Grandstand 1/5/22/26), but Monza actually runs ~13 named grandstand
// zones (many split across 20+ numbered stands sharing the same view/
// covered/reserved facts within a zone — seeded here at zone granularity,
// per founder direction 27 Sep 2026, since most individual numbers within
// a zone have no independently distinguishing sourced fact) plus 9 real,
// separately-named hospitality products (only 1 — "Paddock Club & Champions
// Club" — had its own experience write-up before this build; that write-up
// and "Trackside Corner Lounges & Villas" between them describe all 9).
//
// Sources: monzanet.it (official ticketing), oversteer48.com (grandstand
// guide, dedicated stand-specific pages for nearly every numbered stand —
// the primary source for every covered/reserved fact below),
// grandprixgrandtours.com (zone/overtaking breakdown), enterf1.com
// (overtaking-potential ratings), tickets.formula1.com / f1italy.com
// (Schumacher Lounge, Race Club), shop.gpt-worldwide.com + WebSearch
// (Ferrari GP Club — new for 2026, Ascari Grandstand T18).
// motorsporttickets.com excluded per standing founder instruction (see
// skill §0.5) — never cited here despite appearing in search results.
//
// covered/reservedSeating corrected against oversteer48.com's dedicated
// per-stand pages after an initial pass wrongly left 7 grandstands (GS4,
// 6/7, 12/13/14, 17, 21, 24, Gradinate Traguardo) as NULL/assumed-reserved
// — founder flagged this gap 27 Sep 2026 and asked to find out rather than
// leave it unsourced. All 7 are now HIGH confidence (GS13/14 and GS17's
// covered status both confirmed directly via founder-supplied source, 27
// Sep 2026, resolving what oversteer48.com's own dedicated pages left
// unstated for those two). Two corrections worth flagging: GS4 (Laterale
// Sinistra) and the entire GS12/13/14 Ascari inner cluster are
// BLEACHER-STYLE, NOT reserved seating (both had been wrongly assumed
// reserved in the first draft) — genuinely different from most of Monza's
// numbered grandstands. GS17 (Ascari Esterna) is one of Monza's newest
// stands (2026); despite that, its covered status is now confirmed
// (uncovered/open) rather than left NULL.
//
// PRICING (§3, ordinal only — never shown as a $ figure to the fan):
// - GA (Lesmo & Ascari, Curva Grande) -> tier1.
// - All zone grandstands except Centrale/Piscina -> tier2 (matches the
//   tier label "Ascari, Parabolica, Laterale Destra, Lesmo").
// - Centrale (Grandstand 1, real US$2,103/3-day) and Piscina (Grandstand 5,
//   priced on official site, not in any tier band) -> linked ordinally to
//   tier2 (nearest real grandstand band; founder decision 27 Sep 2026,
//   consistent with "ordinal only, real price can exceed the seeded
//   ceiling" pattern) but given a STAR OVERRIDE to 3 in FullResult.tsx
//   (see that file's STAR_OVERRIDE_BY_SEAT_NAME) since they are genuinely
//   priced above ordinary tier2 grandstands.
// - Champions Club, Race Club, Dolce Vita Lounge, Garden Lounge, Ultimate
//   Lounge, Green House -> tier3 (US$4,313-6,199), star override to 4.
//   Champions Club's real sourced price (~EUR2,600/2-day) sits BELOW
//   tier3's floor — founder-confirmed 27 Sep 2026 this is fine, no special
//   case needed, same "ordinal only" pattern as every prior event's
//   hospitality outliers.
// - Paddock Club, House 44, Schumacher Lounge, Ferrari GP Club -> tier4
//   (US$7,729-11,252), star override to 5. Paddock Club already inherits
//   the GLOBAL PRESTIGE_SEAT_NAMES 5-star tiebreaker (name matches exactly)
//   — confirmed directionally correct here too (this event's real sourced
//   ceiling, EUR4,500-6,500/3-day). House 44 is named just "House 44" here
//   (not "House 44 at F1 Paddock Club" like the existing global-set entry)
//   — founder decision 27 Sep 2026: do NOT add a new prestige-tiebreaker
//   entry for it, since its real price isn't confirmed higher than Paddock
//   Club's (only a sell-out signal is sourced) — it still gets the tier4
//   default 5-star override via STAR_OVERRIDE_BY_SEAT_NAME, just not the
//   scoreSeats.ts tiebreaker bonus.
//
// linkedExperienceId set for every seat with a real dedicated write-up
// (7 grandstand/GA experiences + 2 hospitality write-ups covering all 9
// hospitality products between them) — null elsewhere, which is honest
// per skill §2.5, not a gap.
//
// INSERT ONLY — per CLAUDE.md's standing rule, no delete script exists or
// will be written for these rows.

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const EVENT_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e"; // Italian Grand Prix 2027

const TIER = {
  tier1: "a262439a-ba31-4687-a712-6e3fedb91ee8",
  tier2: "8dfef4e8-7825-448c-ae72-1b24d84c2093",
  tier3: "bfffde54-5b86-41ff-9fa8-5f63fa8463f2",
  tier4: "438d50e0-5710-473a-8bf6-548e8bd42cd9",
};

const EXP = {
  gaLesmoAscari: "fe5196be-cd64-415b-ad22-4ed6af43f2f3",
  curvaGrande: "3b290e97-4c0d-4440-8579-34856b0b8168",
  centrale: "6d3c5952-331b-42ca-a74c-f16f80c1b617",
  piscina: "50e258cd-b43a-4fb6-beea-808d47e42c02",
  parabolica: "99540487-ee1b-47a2-a527-67d0857a2502",
  lateraleDestra: "d69d0936-8008-42f0-b200-2b2114e79a77",
  paddockChampions: "f059b7d6-c6c1-4bb6-81a7-cb5a72e67643", // covers Champions Club, Paddock Club, House 44
  cornerLounges: "dd3e6eea-a13c-4d54-9fd4-5c69e18a4dd9", // covers Dolce Vita, Garden, Ultimate, Green House
};

const NOW = new Date();

const SEATS = [
  // ---------- GENERAL ADMISSION — tier1 ----------
  {
    seatName: "General Admission — Lesmo & Ascari",
    seatType: "festival_lawn",
    zoneLabel: "Lesmo curves through the Ascari chicane — technical middle third of the lap",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: false,
    linkedExperienceId: EXP.gaLesmoAscari,
    sourceNote: "HIGH confidence — sourced from this pack's own seeded 'General Admission — Lesmo & Ascari' experience: Lesmo 2 has tiered bleachers and a screen, Lesmo 1 is fence-only Prato (park) ground. Uncovered, limited shade, unreserved GA.",
    ticketTierId: TIER.tier1,
  },
  {
    seatName: "General Admission — Curva Grande",
    seatType: "festival_lawn",
    zoneLabel: "Curva Grande — high-speed sweep, ~290-340 km/h",
    actionTags: ["high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: true,
    reservedSeating: false,
    linkedExperienceId: EXP.curvaGrande,
    sourceNote: "HIGH confidence — sourced from this pack's own seeded 'Curva Grande — General Admission' experience and grandprixgrandtours.com (long right-hander ~290km/h in 6th gear). Uncovered grass bank, no reserved spot, the default first-timer GA pick.",
    ticketTierId: TIER.tier1,
  },

  // ---------- GRANDSTANDS — tier2 (zone-level) ----------
  {
    seatName: "Grandstand 4 — Laterale Sinistra",
    seatType: "grandstand",
    zoneLabel: "Start line, pit lane exit, and the run toward Turn 1 — opposite Centrale",
    actionTags: ["start_grid", "pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: false,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — oversteer48.com's dedicated Grandstand 4 page: covered with a high roof (east-facing, affords afternoon shade), bleacher-style seating (NOT individual reserved seats — corrected from an earlier MEDIUM-confidence draft that had assumed reserved). Views the start line, pit lane exit, and run toward Turn 1, but not the corner itself, pit garages, or podium; only one TV screen visible.",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand 6/7 — Alta Velocità",
    seatType: "grandstand",
    zoneLabel: "Turn 1 braking zone through Turn 2 exit — Tribuna Alta Velocità (6A/6B/6C)",
    actionTags: ["high_speed", "overtaking"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — oversteer48.com's dedicated Grandstand 6A/6B/6C Alta Velocità page: uncovered ('hot sun all day'), split into three sections (6A best for the braking zone at the end of the main straight, 6C angled at the first chicane for wheel-to-wheel action). Reserved individual seating per the standard oversteer48.com Monza numbering convention for this stand.",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand 8 — Prima Variante",
    seatType: "grandstand",
    zoneLabel: "Turn 1 braking zone — hardest braking on the F1 calendar (350→80 km/h)",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — oversteer48.com's full grandstand table lists GS8 (Prima Variante A/B) as uncovered; grandprixgrandtours.com independently confirms this is Monza's top-rated overtaking zone.",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand 9/10 — Roggia",
    seatType: "grandstand",
    zoneLabel: "Variante della Roggia (2nd chicane) — aggressive kerbs, second-lap-chaos zone",
    actionTags: ["overtaking", "technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — oversteer48.com's table lists GS9/10 (Roggia) as uncovered; grandprixgrandtours.com rates this zone's overtaking potential 4/5, describing the chicane's kerbs as 'notoriously aggressive.'",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand 12/13/14 — Ascari (inner cluster)",
    seatType: "grandstand",
    zoneLabel: "Ascari chicane, inner stands (Ascari 3, Ascari 4, Ascari 2 bis)",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: false,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence for all three — GS12 (Ascari 3) per oversteer48.com's dedicated page: uncovered ('hot Italian sun all day'), bleacher-style bench seats, not individually reserved. GS13 (Ascari 4) and GS14 (Ascari 2 bis), on the inner side of the Variante Ascari chicane, independently confirmed completely open and uncovered — same treatment applied here (founder-supplied confirmation, 27 Sep 2026).",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand 16 — Ascari",
    seatType: "grandstand",
    zoneLabel: "Ascari chicane exit — braking zone before the chicane, view toward Parabolica",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — oversteer48.com's dedicated Grandstand 16 Ascari page: individual plastic chairs, entirely uncovered/full sun, sightlines along the braking zone before Turn 8 and toward Turn 11 (Parabolica), though trees block the full corner view. Named for Alberto Ascari, killed testing at this exact corner in 1955 (corroborated by this pack's own Trackside Corner Lounges & Villas experience).",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand 17 — Ascari Esterna",
    seatType: "grandstand",
    zoneLabel: "Outside the circuit, just after the Ascari chicane exit (Turn 10)",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — oversteer48.com's dedicated Grandstand 17 page: split into 17A/17B, on the outside of the circuit just after Turn 10 (17A closer to the corner, 17B further along the straight); one of Monza's newest stands (2026). Covered status independently confirmed completely uncovered/open (founder-supplied confirmation, 27 Sep 2026) — resolves what the dedicated page itself left unstated.",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand 18 — Uscita Ascari",
    seatType: "grandstand",
    zoneLabel: "Ascari chicane exit, adjacent to Grandstand 16 across a pedestrian walkway",
    actionTags: ["technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — oversteer48.com's Grandstand 16 page explicitly names GS18 'Uscita Ascari' as 'the adjacent covered stand offering shade,' recommended for spectators prioritizing weather protection. Also the home grandstand of the 2026-new Ferrari GP Club hospitality package (T18) per shop.gpt-worldwide.com.",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand 21 — Laterale Parabolica",
    seatType: "grandstand",
    zoneLabel: "Parabolica approach, five angled sections (21A-21E), alongside covered Grandstand 22",
    actionTags: ["technical_corner", "high_speed"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — oversteer48.com's dedicated Grandstand 21 page: split into five sections (21A-21E), with 21A adjacent to the covered Grandstand 22 but the 21 sections themselves uncovered (21A closest to the Turn 11 apex, 21E furthest).",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand 23 — Parabolica Interna",
    seatType: "grandstand",
    zoneLabel: "Parabolica corner entry, inside line",
    actionTags: ["technical_corner"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "MEDIUM confidence — grandprixgrandtours.com's zone table lists GS23 'Parabolica Interna' (corner entry) as uncovered.",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand 24 — Vedano",
    seatType: "grandstand",
    zoneLabel: "Outside of the circuit at the Parabolica exit, start of the main straight — partial podium view",
    actionTags: ["high_speed", "start_grid", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — oversteer48.com's dedicated Grandstand 24 Vedano page: covered with a high roof (front rows still get some sun), located outside the circuit at the Parabolica exit/start of the main straight, with a partial angled view of the podium after the race.",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand 2/3/27-30 — Gradinate Traguardo",
    seatType: "grandstand",
    zoneLabel: "Ground-level bleachers along the main straight, close to the safety fence",
    actionTags: ["start_grid"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — oversteer48.com's dedicated Gradinate Traguardo page: none of the six stands are covered (though the larger grandstands behind them have roofs providing some afternoon shade), reserved bleacher-style bench seating by row (A-G) and numbered position. Limited sightlines — the section of track directly in front plus a little either side; the pit wall blocks clear pit-lane visibility.",
    ticketTierId: TIER.tier2,
  },

  // ---------- GRANDSTANDS — priced above tiers, star-overridden to 3 ----------
  {
    seatName: "Grandstand 1 — Centrale",
    seatType: "grandstand",
    zoneLabel: "Opposite the start line, halfway down the pit straight — Monza's oldest, most expensive grandstand",
    actionTags: ["start_grid", "pit_lane", "podium_atmosphere"],
    covered: null,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.centrale,
    sourceNote: "HIGH confidence — sourced from this pack's own seeded 'Grandstand 1 — Centrale' experience and TicketsSpoke.tsx: reserved plastic bleacher chairs, rows A-M, cover varies by row per conflicting sources (left NULL rather than picking one). Real 2027 price US$2,103 for the 3-day weekend, above tier2's US$1,024-1,160 band — linked ordinally to tier2 (nearest real grandstand band) but star-overridden to 3 in FullResult.tsx since it's genuinely priced above ordinary tier2 grandstands (founder decision 27 Sep 2026).",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand 5 — Piscina",
    seatType: "grandstand",
    zoneLabel: "Full-throttle acceleration off the grid, before the Prima Variante braking zone",
    actionTags: ["start_grid", "high_speed"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.piscina,
    sourceNote: "HIGH confidence — sourced from this pack's own seeded 'Grandstand 5 — Piscina' experience and TicketsSpoke.tsx: covered, reserved, 3-day package only. Not part of any planner_ticket_tier_cost band (priced separately on monzanet.it's official price list) — linked ordinally to tier2 (nearest real grandstand band) but star-overridden to 3 in FullResult.tsx, same reasoning as Centrale.",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand 22 — Parabolica",
    seatType: "grandstand",
    zoneLabel: "Final corner — cars braking from 335km/h into the right-hander feeding the main straight",
    actionTags: ["overtaking", "technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.parabolica,
    sourceNote: "HIGH confidence — sourced from this pack's own seeded 'Grandstand 22 — The Parabolica Corner' experience and TicketsSpoke.tsx: covered, reserved. Officially Curva Alboreto, renamed for Michele Alboreto, killed racing.",
    ticketTierId: TIER.tier2,
  },
  {
    seatName: "Grandstand 26 — Laterale Destra",
    seatType: "grandstand",
    zoneLabel: "Turn 11 exit through the pit straight — pit lane, grid, and the best podium view at the circuit",
    actionTags: ["pit_lane", "start_grid", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.lateraleDestra,
    sourceNote: "HIGH confidence — sourced from this pack's own seeded 'Grandstand 26 — Pit Lane, Grid & Podium Views' experience and oversteer48.com's dedicated GS26 page: officially 'Laterale Destra,' covered (front rows can be exposed under the high roof), reserved individual plastic chairs rows A-O. GS26C has 'the best view of any grandstand at the circuit of the podium celebration.'",
    ticketTierId: TIER.tier2,
  },

  // ---------- HOSPITALITY — tier3, star-overridden to 4 ----------
  {
    seatName: "Champions Club",
    seatType: "hospitality",
    zoneLabel: "Centrale grandstand — directly opposite the start-finish straight",
    actionTags: ["start_grid", "pit_lane", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.paddockChampions,
    sourceNote: "HIGH confidence — sourced from this pack's own seeded 'Paddock Club & Champions Club' experience: hospitality seating in the Centrale grandstand, grid walk with championship trophy photo, F1 insider appearances, guided paddock tour. Real 2026 price ~EUR2,600 for the 2-day version — below tier3's US$4,313 floor, linked ordinally to tier3 anyway (founder-confirmed 27 Sep 2026, no special case needed, same 'ordinal only' pattern as prior events).",
    ticketTierId: TIER.tier3,
  },
  {
    seatName: "Race Club",
    seatType: "hospitality",
    zoneLabel: "1st/2nd floor hospitality building overlooking the grid and pit lane",
    actionTags: ["start_grid", "pit_lane"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — f1italy.com's official Race Club ticket-info page: covered reserved grandstand lounge seating, access to the first and second floors, views overlooking the Grid and Pit Lane. 3-day only, breakfast/buffet lunch/live screens, 1 parking pass per 4 guests. This is the 'HOSPITALITY FANS CLUB' named in the tier3/tier4 planner labels. No dedicated experience write-up exists yet.",
    ticketTierId: TIER.tier3,
  },
  {
    seatName: "Dolce Vita Lounge",
    seatType: "hospitality",
    zoneLabel: "Parabolica exit — the final corner before the pit straight",
    actionTags: ["overtaking", "technical_corner"],
    covered: null,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: false,
    linkedExperienceId: EXP.cornerLounges,
    sourceNote: "HIGH confidence — sourced from this pack's own seeded 'Trackside Corner Lounges & Villas' experience: private trackside terrace near the Parabolica exit, open-bar/buffet-lunch/simulator setup, 9am-6pm across the weekend, 1 parking pass per 10 tickets. Covered status not specified for this lounge specifically — left NULL. Not individually reserved-seat ticketed (open terrace format) — reservedSeating false per the sourced description.",
    ticketTierId: TIER.tier3,
  },
  {
    seatName: "Garden Lounge",
    seatType: "hospitality",
    zoneLabel: "Starting grid to the First Chicane — field still bunched up seconds after lights out",
    actionTags: ["start_grid", "overtaking"],
    covered: false,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: false,
    linkedExperienceId: EXP.cornerLounges,
    sourceNote: "HIGH confidence — sourced from this pack's own seeded 'Trackside Corner Lounges & Villas' experience: open-air setup with covered SEATING but not an enclosed structure, live feed screens, notably better parking ratio (1 pass per 4 guests, vs 1-per-10 for most other lounges).",
    ticketTierId: TIER.tier3,
  },
  {
    seatName: "Ultimate Lounge",
    seatType: "hospitality",
    zoneLabel: "Between the Ascari chicane and Curva Alboreto (Parabolica) — dedicated grandstand built in",
    actionTags: ["technical_corner", "overtaking"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.cornerLounges,
    sourceNote: "HIGH confidence — sourced from this pack's own seeded 'Trackside Corner Lounges & Villas' experience: newest and most specific of Monza's four corner lounges, purpose-built structure with a dedicated grandstand built directly into the facility (not shared with general ticket holders) — hence covered/reserved true, unlike the open-terrace Dolce Vita/Garden lounges.",
    ticketTierId: TIER.tier3,
  },
  {
    seatName: "Green House",
    seatType: "hospitality",
    zoneLabel: "Curva Lesmo 2 — fast, technical right-hander deep in the trees, away from grandstand crowds",
    actionTags: ["technical_corner"],
    covered: null,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: false,
    linkedExperienceId: EXP.cornerLounges,
    sourceNote: "HIGH confidence — sourced from this pack's own seeded 'Trackside Corner Lounges & Villas' experience: the outlier of the four corner lounges, a garden setting overlooking Lesmo 2, pitched as the relaxed/quieter alternative. Covered status not specified — left NULL.",
    ticketTierId: TIER.tier3,
  },

  // ---------- HOSPITALITY — tier4, star-overridden to 5 ----------
  {
    seatName: "Paddock Club",
    seatType: "hospitality",
    zoneLabel: "Above the team garages, overlooking the start-finish straight",
    actionTags: ["pit_lane", "start_grid", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.paddockChampions,
    sourceNote: "HIGH confidence — sourced from this pack's own seeded 'Paddock Club & Champions Club' experience: covered seating with an outdoor balcony overlooking the team garages, open bar (sparkling wine through spirits), sit-down lunch, guided paddock tour. 3-day only, no single-day option. Real price EUR4,500-6,500/person — this event's genuine sourced ceiling. Name matches the GLOBAL PRESTIGE_SEAT_NAMES entry exactly, so it inherits that 5-star tiebreaker automatically — confirmed directionally correct here (real outlier, not a guess).",
    ticketTierId: TIER.tier4,
  },
  {
    seatName: "House 44",
    seatType: "hospitality",
    zoneLabel: "Inside the Paddock Club footprint, above the start-finish straight",
    actionTags: ["pit_lane", "start_grid", "podium_atmosphere"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: EXP.paddockChampions,
    sourceNote: "HIGH confidence — sourced from this pack's own seeded 'Paddock Club & Champions Club' experience: Lewis Hamilton x Soho House collaboration, built inside the Paddock Club footprint, styled like an actual Soho House with its own cocktail menu and semi-regular Hamilton appearances. Sold out before 2026 race weekend (real demand signal) but its price isn't confirmed higher than Paddock Club's own EUR4,500-6,500 — founder decision 27 Sep 2026: NOT added to the scoreSeats.ts prestige tiebreaker (name deliberately kept distinct from the existing global 'House 44 at F1 Paddock Club' key), gets only the tier4-default 5-star override.",
    ticketTierId: TIER.tier4,
  },
  {
    seatName: "Schumacher Lounge",
    seatType: "hospitality",
    zoneLabel: "Start-finish straight — terrace and balcony overlooking the main straight, elevated view toward Turn 1",
    actionTags: ["start_grid", "high_speed"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — tickets.formula1.com/f1italy.com's official Schumacher Lounge page: direct trackside viewing from terrace/balcony overlooking the main straight, reserved grandstand seat included for all guests (elevated views toward Turn 1), fully air-conditioned with shaded outdoor spaces. 3-day only, no single-day option. No dedicated experience write-up exists yet.",
    ticketTierId: TIER.tier4,
  },
  {
    seatName: "Ferrari GP Club",
    seatType: "hospitality",
    zoneLabel: "Ascari Grandstand T18 — dedicated seat inside the Scuderia-branded hospitality package",
    actionTags: ["technical_corner"],
    covered: true,
    minAge: null,
    singleDayAvailable: false,
    reservedSeating: true,
    linkedExperienceId: null,
    sourceNote: "HIGH confidence — shop.gpt-worldwide.com's official Ferrari GP Club Monza 2026 listing: dedicated seat in Ascari Grandstand T18, all-inclusive food and beverage, Scuderia Ferrari HP driver/team appearances, simulators/DJ sets, live commentary, exclusive gifts. New for 2026 ('the new Scuderia Ferrari HP Hospitality'), runs Fri-Sun. No dedicated experience write-up exists yet.",
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

console.log(`Seeded ${SEATS.length} Italian GP (Monza) circuit seating rows.`);

const check = await sql`
  SELECT seat_name, seat_type, ticket_tier_cost_id, covered, reserved_seating, linked_experience_id IS NOT NULL AS has_experience
  FROM circuit_seating_profile
  WHERE sporting_event_id = ${EVENT_ID}
  ORDER BY seat_type, seat_name
`;
console.table(check);

await sql.end();

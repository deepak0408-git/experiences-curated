import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Identity rows only for the 6 unbuilt V1 planner-scope events — no pack
// content, no experiences, purely name/dates/destination so planner cost
// tables (planner_flight_cost, planner_hotel_tier_cost, etc.) have something
// to key against. isHidden: true, packStatus: 'planned', isTestEvent: false
// throughout (real future events, not test data) — approved by user 20 Jul
// 2026 after a full audit confirmed no email/cron path can be triggered by
// this insert (see feedback_sporting_events_activation_guard_trigger.md and
// the same day's chat for the full trace). The new DB activation-guard
// trigger additionally makes it structurally impossible for these rows to
// go live (isHidden: false) without activatedAt being set in the same
// statement — see that same memory file.

const EVENTS = [
  {
    name: "Formula 1 Singapore Grand Prix 2026",
    slug: "singapore-gp-2026",
    sport: "formula_one",
    tournamentSeries: "Formula 1",
    editionYear: 2026,
    destinationSlug: "singapore",
    venueName: "Marina Bay Street Circuit",
    startDate: "2026-10-09",
    endDate: "2026-10-11",
  },
  {
    name: "Alfred Dunhill Links Championship 2026",
    slug: "alfred-dunhill-links-2026",
    sport: "golf",
    tournamentSeries: "DP World Tour",
    editionYear: 2026,
    destinationSlug: "st-andrews",
    venueName: "St Andrews / Carnoustie / Kingsbarns",
    startDate: "2026-10-01",
    endDate: "2026-10-04",
  },
  {
    name: "Nitto ATP Finals 2026",
    slug: "atp-finals-2026",
    sport: "tennis",
    tournamentSeries: "ATP Tour",
    editionYear: 2026,
    destinationSlug: "turin",
    venueName: "Inalpi Arena",
    startDate: "2026-11-15",
    endDate: "2026-11-22",
  },
  {
    name: "Formula 1 Las Vegas Grand Prix 2026",
    slug: "las-vegas-gp-2026",
    sport: "formula_one",
    tournamentSeries: "Formula 1",
    editionYear: 2026,
    destinationSlug: "las-vegas",
    venueName: "Las Vegas Strip Circuit",
    startDate: "2026-11-19",
    endDate: "2026-11-21",
  },
  {
    name: "New Zealand tour of Australia 2026-27",
    slug: "new-zealand-in-australia-cricket-2026-27",
    sport: "cricket",
    tournamentSeries: "International Test Cricket",
    editionYear: 2026,
    destinationSlug: "melbourne-au",
    venueName: "Melbourne Cricket Ground (Boxing Day Test)",
    editorialOverview: "4-Test series: Perth Stadium (1st Test, 9-13 Dec), Adelaide Oval (2nd Test, 17-21 Dec), MCG Melbourne — Boxing Day Test (3rd Test, 26-30 Dec), SCG Sydney (4th Test, 4-8 Jan 2027).",
    startDate: "2026-12-09",
    endDate: "2027-01-08",
  },
  {
    name: "England tour of South Africa 2026-27",
    slug: "england-in-south-africa-cricket-2026-27",
    sport: "cricket",
    tournamentSeries: "International Test & ODI Cricket",
    editionYear: 2026,
    destinationSlug: "johannesburg",
    venueName: "The Wanderers (1st Test)",
    editorialOverview: "3 Tests + 3 ODIs: Wanderers/Johannesburg (1st Test, 17-21 Dec), SuperSport Park/Centurion (2nd Test, 26-30 Dec), Newlands/Cape Town (3rd Test, 3-7 Jan), Boland Park/Paarl (ODI, 10 Jan), Mangaung Oval/Bloemfontein (ODIs, 13 & 15 Jan).",
    startDate: "2026-12-17",
    endDate: "2027-01-15",
  },
];

const destRows = await sql`SELECT id, slug FROM destinations`;
const destIdBySlug = new Map(destRows.map((d) => [d.slug, d.id]));

for (const e of EVENTS) {
  const destinationId = destIdBySlug.get(e.destinationSlug);
  if (!destinationId) {
    console.log(`✗ SKIPPED ${e.name} — destination slug "${e.destinationSlug}" not found`);
    continue;
  }

  const result = await sql`
    INSERT INTO sporting_events (
      name, slug, sport, tournament_series, edition_year, destination_id,
      venue_name, editorial_overview, start_date, end_date, is_hidden, is_test_event, pack_status
    )
    VALUES (
      ${e.name}, ${e.slug}, ${e.sport}, ${e.tournamentSeries}, ${e.editionYear}, ${destinationId},
      ${e.venueName}, ${e.editorialOverview ?? null}, ${e.startDate}, ${e.endDate}, true, false, 'planned'
    )
    ON CONFLICT (slug) DO NOTHING
    RETURNING id, name
  `;
  if (result.length > 0) {
    console.log(`✓ created: ${e.name}`);
  } else {
    console.log(`- skipped (already exists): ${e.name}`);
  }
}

const slugs = EVENTS.map((e) => e.slug);
const rows = await sql`
  SELECT e.name, e.slug, e.sport, e.start_date, e.end_date, e.is_hidden, e.is_test_event, e.pack_status, d.name as destination
  FROM sporting_events e JOIN destinations d ON d.id = e.destination_id
  WHERE e.slug = ANY(${slugs})
  ORDER BY e.start_date
`;
console.log("\nConfirmed state:");
console.table(rows);

await sql.end();

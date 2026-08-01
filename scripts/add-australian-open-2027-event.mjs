import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

// Australian Open 2027 -- added to Planner V1 scope 22 Jul 2026 as event
// #12, a logically-correct scope addition (not a DB-query mistake). Same
// Melbourne destination as the NZ tour's Boxing Day Test leg, but a
// genuinely separate season/window.

const MELBOURNE_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50";

const result = await sql`
  INSERT INTO sporting_events (
    name, slug, sport, tournament_series, edition_year, destination_id,
    venue_name, start_date, end_date, ticketing_url, editorial_overview,
    is_hidden, pack_status, is_test_event
  )
  VALUES (
    'Australian Open 2027',
    'australian-open-2027',
    'tennis',
    'Grand Slam',
    2027,
    ${MELBOURNE_ID},
    'Melbourne Park',
    '2027-01-17',
    '2027-01-31',
    'https://ausopen.com/tickets',
    'The first Grand Slam of the tennis season, played on hard courts at Melbourne Park -- qualifying and exhibitions run 11-16 Jan, with the 15-day main draw from 17-31 Jan.',
    true,
    'planned',
    false
  )
  RETURNING id, name, slug, start_date, end_date, pack_status, is_hidden
`;
console.log("Created:", JSON.stringify(result, null, 2));

await sql.end();

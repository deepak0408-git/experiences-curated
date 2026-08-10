import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

// Border-Gavaskar Trophy 2027 and The Ashes 2027 -- added to Content
// Calendar 7 Aug 2026 per user request. Both seeded as planned/hidden,
// no build started. Fields approved field-by-field with the user before
// this script was written (Chennai as BGT anchor, London/Lord's as Ashes
// anchor, ticketing URLs left blank).
//
// Chennai destination already created in a prior run of this script
// (id 04682cdc-cc39-4f6a-8dc4-98fc4ac478f9) -- re-running that insert
// would violate the unique slug constraint, so it's referenced directly
// below instead. venue_name is varchar(200); the first attempt at this
// script overflowed that on both events, fixed here with shorter strings.

const CHENNAI_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const LONDON_ID = "75758888-28b9-4e09-82ba-f05681ecc904";

const [bgt] = await sql`
  INSERT INTO sporting_events (
    name, slug, sport, tournament_series, edition_year, destination_id,
    venue_name, tour_cities, start_date, end_date, editorial_overview,
    is_hidden, pack_status, pack_format, is_test_event
  )
  VALUES (
    'Border-Gavaskar Trophy 2027',
    'border-gavaskar-trophy-2027',
    'cricket',
    'Border-Gavaskar Trophy',
    2027,
    ${CHENNAI_ID},
    'MA Chidambaram Stadium (2nd Test) -- series: Nagpur, Chennai, Guwahati, Ranchi, Ahmedabad (21 Jan-3 Mar)',
    ARRAY['Chennai', 'Nagpur', 'Guwahati', 'Ranchi', 'Ahmedabad'],
    '2027-01-21',
    '2027-03-03',
    'First-ever five-Test Border-Gavaskar series hosted by India, including Guwahati''s first-ever BGT Test -- five cities, six weeks.',
    true,
    'planned',
    'classic',
    false
  )
  RETURNING id, name, slug, start_date, end_date, pack_status, is_hidden
`;
console.log("Created event:", bgt);

const [ashes] = await sql`
  INSERT INTO sporting_events (
    name, slug, sport, tournament_series, edition_year, destination_id,
    venue_name, tour_cities, start_date, end_date, editorial_overview,
    is_hidden, pack_status, pack_format, is_test_event
  )
  VALUES (
    'The Ashes 2027',
    'the-ashes-2027',
    'cricket',
    'The Ashes',
    2027,
    ${LONDON_ID},
    'Lord''s (2nd Test) -- series: Nottingham, London, Birmingham, Southampton, London (18 Jun-2 Aug)',
    ARRAY['London', 'Nottingham', 'Birmingham', 'Southampton'],
    '2027-06-18',
    '2027-08-02',
    'Five-Test Ashes series in England, including the Rose Bowl''s first-ever men''s Ashes Test -- the 10th UK venue in history to host one.',
    true,
    'planned',
    'classic',
    false
  )
  RETURNING id, name, slug, start_date, end_date, pack_status, is_hidden
`;
console.log("Created event:", ashes);

await sql.end();

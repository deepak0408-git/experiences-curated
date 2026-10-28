import { config } from "dotenv";
config({ path: ".env.local" });
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

// READ-ONLY. Exports database verification evidence for the Phase 5
// validation package §C: event association, option counts, ID uniqueness,
// C1/C5 data presence, eligibility/cost field completeness, image/map
// mapping verification, and idempotency (re-running the seed script a
// second time must not change row counts or create duplicates).

const US_OPEN_EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9";
const OUT = process.argv[2] || "./scripts/_uso27-source/db-verification";
fs.mkdirSync(OUT, { recursive: true });

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const out = {};

out.event = await sql`
  SELECT id, slug, name, sport, edition_year, pack_status, is_hidden, start_date, end_date
  FROM sporting_events WHERE id = ${US_OPEN_EVENT_ID}
`;

out.optionCount = await sql`
  SELECT count(*)::int AS count FROM tennis_ticket_intelligence_options WHERE sporting_event_id = ${US_OPEN_EVENT_ID}
`;

out.optionNumberUniqueness = await sql`
  SELECT option_number, count(*)::int AS count FROM tennis_ticket_intelligence_options
  WHERE sporting_event_id = ${US_OPEN_EVENT_ID} GROUP BY option_number HAVING count(*) > 1
`;

out.optionNumberRange = await sql`
  SELECT min(option_number)::int AS min, max(option_number)::int AS max, count(DISTINCT option_number)::int AS distinct_count
  FROM tennis_ticket_intelligence_options WHERE sporting_event_id = ${US_OPEN_EVENT_ID}
`;

out.c1c5Completeness = await sql`
  SELECT
    count(*) FILTER (WHERE c1_lots_of_tennis IS NULL OR c1_big_stadium IS NULL OR c1_close_up_courts IS NULL OR c1_balanced_experience IS NULL)::int AS missing_c1,
    count(*) FILTER (WHERE c5_close_to_action IS NULL OR c5_balanced_view IS NULL OR c5_no_preference IS NULL OR c5_flexible_explore IS NULL)::int AS missing_c5,
    count(*) FILTER (WHERE eligible_from IS NULL OR eligible_to IS NULL)::int AS missing_eligibility,
    count(*) FILTER (WHERE cost_index IS NULL)::int AS missing_cost_index,
    count(*) FILTER (WHERE cost_stars IS NULL)::int AS missing_cost_stars,
    count(*) FILTER (WHERE hero_image IS NULL)::int AS missing_hero_image
  FROM tennis_ticket_intelligence_options WHERE sporting_event_id = ${US_OPEN_EVENT_ID}
`;

out.arenaCodeDistribution = await sql`
  SELECT arena_code, count(*)::int AS count FROM tennis_ticket_intelligence_options
  WHERE sporting_event_id = ${US_OPEN_EVENT_ID} GROUP BY arena_code ORDER BY arena_code
`;

out.heroImageDistinctUrls = await sql`
  SELECT count(DISTINCT hero_image)::int AS distinct_urls FROM tennis_ticket_intelligence_options
  WHERE sporting_event_id = ${US_OPEN_EVENT_ID} AND hero_image IS NOT NULL
`;

out.heroImagesAreR2NotLocalPath = await sql`
  SELECT count(*)::int AS count FROM tennis_ticket_intelligence_options
  WHERE sporting_event_id = ${US_OPEN_EVENT_ID}
    AND hero_image IS NOT NULL
    AND hero_image NOT LIKE 'https://pub-%.r2.dev/%'
`;

out.editionStatusRow = await sql`
  SELECT * FROM tennis_ticket_intelligence_edition_status WHERE sporting_event_id = ${US_OPEN_EVENT_ID}
`;

out.otherEventsUntouched = await sql`
  SELECT se.slug, count(t.*)::int AS option_count
  FROM sporting_events se
  LEFT JOIN tennis_ticket_intelligence_options t ON t.sporting_event_id = se.id
  WHERE se.slug IN ('australian-open', 'french-open', 'wimbledon')
  GROUP BY se.slug ORDER BY se.slug
`;

out.arenaCodeEnumValues = await sql`SELECT unnest(enum_range(NULL::tennis_arena_code))::text AS v`;

// Idempotency check: count before and after a second dry pass is not run
// here (the real seed script's own ON CONFLICT...DO UPDATE idempotency was
// already demonstrated live when it was run a second time with 0 inserted/
// 31 updated during development -- see Section D's technical test log for
// the actual seed script console output).
out.idempotencyNote = "Seed script uses ON CONFLICT (sporting_event_id, option_number) DO UPDATE -- re-running never creates duplicate rows. See Section D's seed_script_output.txt for the actual 'Inserted: 31, Updated: 0' then re-run 'Inserted: 0, Updated: 31' sequence.";

fs.writeFileSync(path.join(OUT, "db_verification.json"), JSON.stringify(out, null, 2, (k, v) => typeof v === "bigint" ? v.toString() : v));
console.log(JSON.stringify(out, null, 2));

await sql.end();

import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// Phase A completion for Italian GP's classic->hub-and-spoke evergreen-slug
// migration (migrate-from-classic-to-hub-spoke skill §1 step 5, bundled with
// §1a edition rollover per the founder's explicit call — the 2026 edition
// already ended, 4-6 Sep 2026, so this migration rolls the row forward to
// the real, FIA-confirmed 2027 dates rather than doing slug/format alone).
//
// ONLY RUN THIS after confirming the next.config.ts redirect (Deploy A) is
// live on production — see the hard gate in the skill's §1. This script
// renames the slug, which makes the OLD "/event-pack/italian-gp-2026" URL
// 404 immediately unless the redirect is already deployed and serving.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const ITALIAN_GP_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e";
const OLD_SLUG = "italian-gp-2026";
const NEW_SLUG = "italian-grand-prix";
const NEW_SEASON_YEAR = 2027;
const NEW_EDITION_YEAR = 2027;
const NEW_NAME = "Italian Grand Prix 2027";
const NEW_START_DATE = "2027-09-03";
const NEW_END_DATE = "2027-09-05";

// Real externalCalendarEvents rows, confirmed by direct query before writing
// this script — the 2026 row is currently matched to this sportingEvents
// row; the 2027 row (official FIA calendar, confirmed 16 Sep 2026) is
// unmatched. Skill §1a requires both halves of the swap, not just matching
// the new row — an unmatched-but-stale old row would otherwise keep linking
// to a guide that's since rolled over to describe the new edition.
const OLD_CALENDAR_EVENT_ID = "f000c4ff-66bb-48ed-9c18-4a8938410e12"; // 2026, currently matched
const NEW_CALENDAR_EVENT_ID = "72104169-062f-449f-952f-3e0681a7af31"; // 2027, currently unmatched

// Honest placeholder per the skill's §1a exact wording pattern — replaces
// real 2026 brief content (which was live, preTripBriefLiveAt already
// stamped) rather than leaving last year's weather/transport info sitting
// as if current. preTripBriefLiveAt is cleared so the cron re-activates it
// fresh, closer to the real 2027 event.
const PLACEHOLDER_BRIEF_LINE = `Information around Weather, Transport and Innovations related to the ${NEW_EDITION_YEAR} event will be updated closer to the event start.`;

const [before] = await client`SELECT slug, season_year, edition_year, name, start_date, end_date, is_hidden FROM sporting_events WHERE id = ${ITALIAN_GP_ID}`;
console.log("Before:", before);

if (before.slug !== OLD_SLUG) {
  console.warn(`⚠ Current slug is "${before.slug}", not the expected "${OLD_SLUG}" — aborting to avoid an unintended double-run.`);
  await client.end();
  process.exit(1);
}

const [after] = await client`
  UPDATE sporting_events
  SET
    slug = ${NEW_SLUG},
    season_year = ${NEW_SEASON_YEAR},
    edition_year = ${NEW_EDITION_YEAR},
    name = ${NEW_NAME},
    start_date = ${NEW_START_DATE},
    end_date = ${NEW_END_DATE},
    is_hidden = true,
    homepage_slot = NULL,
    pre_trip_brief_lines = ARRAY[${PLACEHOLDER_BRIEF_LINE}]::text[],
    pre_trip_brief_live_at = NULL,
    early_bird_display = NULL,
    standard_display = NULL,
    early_bird_cutoff = NULL,
    updated_at = now()
  WHERE id = ${ITALIAN_GP_ID}
  RETURNING slug, season_year, edition_year, name, start_date, end_date, is_hidden, pre_trip_brief_lines
`;

console.log("After:", after);

// --- Calendar rematch (skill §1a) ---
const [oldCal] = await client`
  UPDATE external_calendar_events SET matched_sporting_event_id = NULL, updated_at = now()
  WHERE id = ${OLD_CALENDAR_EVENT_ID}
  RETURNING id, name, start_date, matched_sporting_event_id
`;
console.log("Old (2026) calendar row unmatched:", oldCal);

const [newCal] = await client`
  UPDATE external_calendar_events SET matched_sporting_event_id = ${ITALIAN_GP_ID}, updated_at = now()
  WHERE id = ${NEW_CALENDAR_EVENT_ID}
  RETURNING id, name, start_date, matched_sporting_event_id
`;
console.log("New (2027) calendar row matched:", newCal);

await client.end();

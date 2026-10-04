import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// Shares the existing "China Visas, Maps, and Payments" experience
// (china-visa-apps-payments-guide-mskq7nml, originally seeded for Shanghai
// Masters/tennis) into Chinese GP 2027 via sporting_event_experiences.
// Genuinely venue-agnostic content — visa rules, Amap, Alipay/WeChat Pay,
// metro apps all apply identically regardless of which Shanghai venue a
// visitor is attending. Per experience-researcher skill §2b reuse workflow:
// 1) join-table insert, 2) append (never replace) `sport`, 3) separately
// requires an EXPERIENCE_TO_SPOKE_BY_EVENT["chinese-grand-prix"] entry
// (added directly in app/experience/[slug]/page.tsx, not this script).
//
// INSERT ONLY (join row) + one additive array update — per CLAUDE.md's
// standing rule, no delete script exists or will be written for this.

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const EXPERIENCE_ID = "6731f538-b419-4fc3-871c-714788c57313";
const CHINESE_GP_EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";

await sql`
  INSERT INTO sporting_event_experiences (experience_id, sporting_event_id)
  VALUES (${EXPERIENCE_ID}, ${CHINESE_GP_EVENT_ID})
  ON CONFLICT DO NOTHING
`;

// Append "formula_one" to the existing sport array (currently ["tennis"]) —
// never replace. array_append with a dedup guard via NOT (sport @> ARRAY[...]).
await sql`
  UPDATE experiences
  SET sport = array_append(sport, 'formula_one')
  WHERE id = ${EXPERIENCE_ID} AND NOT (sport @> ARRAY['formula_one'])
`;

const [row] = await sql`SELECT sport FROM experiences WHERE id = ${EXPERIENCE_ID}`;
console.log("Updated sport array:", row.sport);

const links = await sql`
  SELECT se.slug, se.name FROM sporting_event_experiences see
  JOIN sporting_events se ON se.id = see.sporting_event_id
  WHERE see.experience_id = ${EXPERIENCE_ID}
`;
console.log("Linked events:", links);

await sql.end();

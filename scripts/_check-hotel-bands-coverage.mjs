import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);
const events = await sql`
  SELECT e.id, e.slug, e.start_date, e.edition_year, e.destination_id
  FROM sporting_events e
  WHERE e.destination_id IS NOT NULL
  ORDER BY e.start_date
`;

const MONTHS = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];

for (const e of events) {
  const startMonth = MONTHS[new Date(e.start_date).getUTCMonth()];
  const bands = await sql`
    SELECT DISTINCT seasonal_band FROM planner_hotel_tier_cost
    WHERE destination_id = ${e.destination_id} AND edition_year = ${e.edition_year}
  `;
  const bandList = bands.map((b) => b.seasonal_band);
  if (bandList.length > 1) {
    console.log(`${e.slug.padEnd(40)} start=${startMonth} seeded=[${bandList.join(",")}] MIXED`);
  }
}
await sql.end();

import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);
const events = await sql`
  SELECT e.id, e.slug, e.name, e.start_date, e.end_date, e.edition_year, e.destination_id, d.name as dest_name
  FROM sporting_events e
  LEFT JOIN destinations d ON d.id = e.destination_id
  WHERE e.destination_id IS NOT NULL
  ORDER BY e.start_date
`;

const MONTHS = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];

for (const e of events) {
  const startMonth = MONTHS[new Date(e.start_date).getUTCMonth()];
  const endMonth = MONTHS[new Date(e.end_date).getUTCMonth()];
  const bands = await sql`
    SELECT DISTINCT seasonal_band FROM planner_flight_cost
    WHERE destination_id = ${e.destination_id} AND edition_year = ${e.edition_year}
  `;
  const bandList = bands.map((b) => b.seasonal_band);
  const flag = bandList.length === 0 ? " NO FLIGHT DATA" : (!bandList.includes(startMonth) ? " START MONTH MISSING FROM SEEDED BANDS" : "");
  console.log(`${e.slug.padEnd(40)} start=${startMonth} end=${endMonth} seeded=[${bandList.join(",")}]${flag}`);
}
await sql.end();

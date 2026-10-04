import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const EVENT_ID = "09254d18-a22f-4032-ac05-b7c26a9c3057"; // Shanghai Masters 2026

const lines = [
  "Expect mild, golden-autumn weather: highs of 25-28°C early in the tournament, dropping to the low 20s by the final, nights around 16-18°C. About a third of October days get some rain, usually a short shower rather than a washout. Bring a light jacket for evening sessions and a compact umbrella just in case.",
  "Take Metro Line 1 to Xinzhuang Station, then the official shuttle (¥2) from the South Square. It runs via Zhuanqiao on Line 5 and drops you between Gates 1 and 2 at Qizhong Tennis Center, about 45 minutes door to door. Outbound shuttles run 11:00-19:00 on most tournament days, with return service continuing until after the last match finishes. Check en.rolexshanghaimasters.com/en/tournament/transportation-information for the exact daily window before you go.",
  "On the evening of 16 October, once the day's matches finish, Roger Federer teams up with Li Na to play Marat Safin and Dinara Safina in a celebrity doubles exhibition on Centre Court. If you're only in town for a few days, that's the night to build your trip around.",
];

const result = await sql`
  UPDATE sporting_events
  SET pre_trip_brief_lines = ${sql.array(lines, 1009)},
      pre_trip_brief_live_at = now()
  WHERE id = ${EVENT_ID}
  RETURNING id, name, pre_trip_brief_lines, pre_trip_brief_live_at
`;

console.log(JSON.stringify(result, null, 2));
process.exit(0);

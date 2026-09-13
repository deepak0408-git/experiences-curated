import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);
const exps = await sql`
  SELECT e.id, e.slug, e.title, e.experience_type, e.google_maps_rating, e.booking_links, e.address
  FROM sporting_event_experiences see
  JOIN experiences e ON e.id = see.experience_id
  WHERE see.sporting_event_id = '8ab4460a-122e-4c1b-bcfe-81f93359c899'
  ORDER BY e.title
`;
console.log("Total experiences:", exps.length);
exps.forEach(e => {
  console.log(`${e.slug.padEnd(50)} rating=${e.google_maps_rating ?? "null"} bookingLinks=${e.booking_links ? "yes" : "no"} address=${e.address ? "yes" : "no"}`);
});
await sql.end();

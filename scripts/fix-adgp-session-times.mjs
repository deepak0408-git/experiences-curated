// Corrects Abu Dhabi Hill's practical_info.hours — was seeded with
// Qualifying 19:30-20:30 / Race 18:30 start, which conflicted with both
// the rest of the pack's "16:00" claim and F1's own official 2026
// start-times announcement (Qualifying 18:00 local, Race 17:00 local).
// Verified 4 Sep 2026 via formula1.com's official start-times article.
import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const [r] = await sql`SELECT practical_info FROM experiences WHERE id = 'c4d479d3-87eb-4853-b6e9-737a32014ba3'`;
const updated = {
  ...r.practical_info,
  hours: "Gates open ahead of first session each day; Fri 4 Dec: FP1 and FP2 (times per official schedule). Sat 5 Dec: FP3, Qualifying 18:00 start. Sun 6 Dec: Race, 17:00 start. All times Yas Marina local (track time).",
};
await sql`UPDATE experiences SET practical_info = ${sql.json(updated)} WHERE id = 'c4d479d3-87eb-4853-b6e9-737a32014ba3'`;
console.log("Updated:", JSON.stringify(updated, null, 2));
await sql.end();

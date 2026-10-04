import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const EVENT_ID = "9fe13c2e-37d1-49f0-8a48-d3ea40186fe4"; // Japanese GP 2027

const rows = await sql`
  SELECT title, slug, status,
    practical_info->>'howToBook' AS how_to_book,
    practical_info->>'bookingMethod' AS booking_method
  FROM experiences
  WHERE sporting_event_id = ${EVENT_ID}
  ORDER BY title
`;

console.log(`Total Japanese GP experiences: ${rows.length}`);
const withHowToBook = rows.filter(r => r.how_to_book && r.how_to_book.trim() !== "");
console.log(`With howToBook filled in: ${withHowToBook.length}`);
console.log("---");
for (const r of rows) {
  console.log(`${r.status.padEnd(10)} | howToBook: ${r.how_to_book ? "YES" : "no "} | bookingMethod: ${r.booking_method ? "YES" : "no "} | ${r.title}`);
}

await sql.end();

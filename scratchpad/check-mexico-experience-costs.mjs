import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const rows = await sql`
  SELECT e.title, e.slug, e.practical_info, e.body_content
  FROM experiences e
  JOIN sporting_event_experiences see ON see.experience_id = e.id
  WHERE see.sporting_event_id = '538fdb6f-0e39-49a6-ba77-32dec65d640a'
  ORDER BY e.title
`;

console.log("Total experiences:", rows.length);
for (const r of rows) {
  const pi = r.practical_info || {};
  const costRange = pi.costRange || "";
  const bookingMethod = pi.bookingMethod || "";
  const howToBook = pi.howToBook || "";
  const body = r.body_content || "";

  const flagTerms = /US\$|MXN|\$\d|price|pricing|cost|budget|unavailable|not.{0,20}available|recent.season|recent-season|estimate/i;
  const hasCostRange = costRange.length > 0;
  const bodyMatches = flagTerms.test(body);
  const bookingMatches = flagTerms.test(bookingMethod) || flagTerms.test(howToBook);

  console.log("\n===", r.title, "===");
  console.log("costRange:", JSON.stringify(costRange));
  if (bookingMatches) console.log("bookingMethod/howToBook mentions cost terms:", JSON.stringify(bookingMethod), JSON.stringify(howToBook).slice(0,200));
  if (bodyMatches) {
    const matches = body.match(/[^.]*?(US\$|MXN|\$\d|unavailable|not.{0,20}available|recent.season|recent-season)[^.]*\./gi) || [];
    matches.forEach(m => console.log("BODY HIT:", m.trim()));
  }
}
await sql.end();

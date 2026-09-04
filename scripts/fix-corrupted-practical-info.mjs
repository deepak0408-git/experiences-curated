// One-off repair for practical_info fields that got double-JSON-stringified
// into character-indexed objects ({"0":"{","1":"\"",...}) instead of real
// JSON — found 4 Sep 2026 while building Abu Dhabi GP's DayTrips spoke
// content. Ran once against the full experiences table; fixed 20 rows.
// Two more (West Grandstand, Main Grandstand) were missed by this run and
// had to be re-fixed manually afterward — same corruption pattern, cause
// of the miss not fully diagnosed. Kept as the audit trail; do not re-run
// against already-fixed rows (the `looksCorrupt` guard makes it a no-op
// on clean data, but there's no reason to run it again).
import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const rows = await sql`SELECT id, title, practical_info FROM experiences WHERE practical_info IS NOT NULL`;

let fixed = 0, failed = [];
for (const r of rows) {
  const keys = Object.keys(r.practical_info);
  const looksCorrupt = keys.length > 10 && keys.every(k => /^\d+$/.test(k));
  if (!looksCorrupt) continue;

  // Reassemble the original JSON string from indexed characters, in order.
  const sortedKeys = keys.map(Number).sort((a, b) => a - b);
  const jsonString = sortedKeys.map(k => r.practical_info[String(k)]).join("");

  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    failed.push({ title: r.title, error: e.message, snippet: jsonString.slice(0, 100) });
    continue;
  }

  // Sanity check: expect the normal practicalInfo shape.
  const expectedKeys = ["hours", "website", "costRange", "bookingMethod"];
  const hasExpectedShape = expectedKeys.some(k => k in parsed);
  if (!hasExpectedShape) {
    failed.push({ title: r.title, error: "parsed but unexpected shape", parsed });
    continue;
  }

  await sql`UPDATE experiences SET practical_info = ${sql.json(parsed)} WHERE id = ${r.id}`;
  fixed++;
  console.log("Fixed:", r.title);
}

console.log(`\nFixed ${fixed} rows.`);
if (failed.length) {
  console.log(`Failed ${failed.length} rows:`);
  failed.forEach(f => console.log(" -", f.title, f.error));
}
await sql.end();

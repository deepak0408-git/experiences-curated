import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const EXPERIENCE_ID = "ad53475e-d932-44af-803f-608cc6d51263"; // Preparing for Your US Open Visit

// User instruction 24 Jul 2026: change wording from "run from around $65
// upward, rising with demand and later rounds" to "run from around $65
// typically, rising with demand" -- the unverified $121 "typical" figure
// (traced to a 2024 resale report, not an official USTA face-value figure)
// was explicitly dropped after I couldn't confirm it against usopen.org.

const OLD_TEXT = "In the first week of the tournament, grounds passes run from around $65 upward, rising with demand and later rounds.";
const NEW_TEXT = "In the first week of the tournament, grounds passes run from around $65 typically, rising with demand.";

const [row] = await sql`SELECT body_content FROM experiences WHERE id = ${EXPERIENCE_ID}`;
if (!row.body_content.includes(OLD_TEXT)) {
  throw new Error("Old text not found verbatim -- aborting to avoid a bad replace.");
}
const updatedBody = row.body_content.replace(OLD_TEXT, NEW_TEXT);

await sql`
  UPDATE experiences
  SET body_content = ${updatedBody}, updated_at = NOW()
  WHERE id = ${EXPERIENCE_ID}
`;

console.log("✓ Updated. New sentence:");
const [confirm] = await sql`SELECT body_content FROM experiences WHERE id = ${EXPERIENCE_ID}`;
console.log(confirm.body_content.match(/In the first week[^.]+\./)[0]);

await sql.end();

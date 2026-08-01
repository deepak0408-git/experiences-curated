import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const EXPERIENCE_ID = "ad53475e-d932-44af-803f-608cc6d51263"; // Preparing for Your US Open Visit

const [row] = await sql`SELECT practical_info FROM experiences WHERE id = ${EXPERIENCE_ID}`;
const info = row.practical_info;

const OLD_COST = "Grounds passes ~$40–60 (first week); reserved session tickets from ~$80 (day) to $500+ (night, late rounds)";
const NEW_COST = "Grounds passes ~$65 average (first week); reserved session tickets from ~$80 (day) to $500+ (night, late rounds)";

if (info.costRange !== OLD_COST) {
  throw new Error("costRange doesn't match expected old text -- aborting to avoid a bad overwrite.\nActual: " + info.costRange);
}
info.costRange = NEW_COST;

await sql`
  UPDATE experiences
  SET practical_info = ${JSON.stringify(info)}, updated_at = NOW()
  WHERE id = ${EXPERIENCE_ID}
`;

console.log("✓ Updated costRange:");
const [confirm] = await sql`SELECT practical_info FROM experiences WHERE id = ${EXPERIENCE_ID}`;
console.log(confirm.practical_info.costRange);

await sql.end();

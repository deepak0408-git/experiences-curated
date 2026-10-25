import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// Verifies every real Wimbledon seating_code/arena_code combination now
// in the DB has a presentationMappings.ts SEATING_MAP entry and an
// experiencePresentation() case — i.e. seatingPresentation()/
// experiencePresentation() will never throw for a real Wimbledon option.
// This re-derives the same keys presentationMappings.ts computes
// (`${arenaCode}_${seatingCode}`) and checks them against the exact set
// added to SEATING_MAP for Wimbledon, rather than importing the .ts file
// directly (not resolvable from a plain .mjs script without a bundler).

const WIMBLEDON_EVENT_ID = "8bb7090e-1ec7-4c3f-b4e2-7fd6bf9942cf";
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const rows = await sql`
  SELECT arena_code, seating_code FROM tennis_ticket_intelligence_options WHERE sporting_event_id = ${WIMBLEDON_EVENT_ID}
`;
await sql.end();

// Exact copy of the Wimbledon keys added to presentationMappings.ts's SEATING_MAP.
const SEATING_MAP_KEYS = new Set(["CC_A_T", "CC_U_Z", "CC_ZA_ZF", "C1_A_Q", "C1_R_W", "C1_X_ZC", "C2_RESERVED", "C3_RESERVED"]);
// Exact copy of the arenaCode cases added to experiencePresentation().
const EXPERIENCE_CASES = new Set(["CC", "C1", "C2", "C3", "GP"]);

let failures = 0;
for (const row of rows) {
  if (row.arena_code === "GP") {
    // seatingPresentation() special-cases GP globally before touching
    // SEATING_MAP — no key needed.
    continue;
  }
  const key = `${row.arena_code}_${row.seating_code}`;
  if (!SEATING_MAP_KEYS.has(key)) {
    console.log(`[FAIL] No SEATING_MAP entry for real DB combination "${key}"`);
    failures++;
  }
}
for (const row of rows) {
  if (!EXPERIENCE_CASES.has(row.arena_code)) {
    console.log(`[FAIL] No experiencePresentation() case for real DB arena_code "${row.arena_code}"`);
    failures++;
  }
}

const distinctKeys = new Set(rows.filter((r) => r.arena_code !== "GP").map((r) => `${r.arena_code}_${r.seating_code}`));
console.log(`Distinct non-GP arena_code/seating_code combinations in DB: ${distinctKeys.size}`);
console.log([...distinctKeys].sort().join(", "));

console.log(failures === 0 ? "\nALL PRESENTATION-MAPPING COVERAGE CHECKS PASS" : `\n${failures} COVERAGE GAP(S) FOUND`);
process.exit(failures === 0 ? 0 : 1);

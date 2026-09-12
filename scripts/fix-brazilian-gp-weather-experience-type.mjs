import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Fix wrong experienceType on Brazilian GP's Weather & What to Pack, caught
// during the 12 Sep 2026 pre-deployment audit — seeded as "cultural_site"
// instead of "activity", the established convention for this experience
// type across every other event (US GP, Mexico City GP both use "activity").
// Same failure class as the Belgian/Hungarian GP ticket guides being seeded
// as "transit" instead of "fan_experience" — a leftover/wrong default at
// seed time, not a deliberate choice.
const SLUG = "brazilian-gp-weather-packing-mtx7ms1q";

const [before] = await sql`SELECT title, experience_type FROM experiences WHERE slug = ${SLUG}`;
console.log(`Before: ${before.title} — ${before.experience_type}`);

await sql`UPDATE experiences SET experience_type = 'activity' WHERE slug = ${SLUG}`;

const [after] = await sql`SELECT title, experience_type FROM experiences WHERE slug = ${SLUG}`;
console.log(`After: ${after.title} — ${after.experience_type}`);

await sql.end();

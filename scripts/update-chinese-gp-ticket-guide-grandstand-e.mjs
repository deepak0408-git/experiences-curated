import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// Adds Grandstand E into the "named stands" lineup in paragraph 2 of the
// Chinese GP Ticket Guide experience (chinese-gp-ticket-guide-mud1pntb),
// now that Grandstand E has its own dedicated experience (seeded 2 Oct 2026,
// chinese-gp-grandstand-e-). Narrow fix, scoped to this one paragraph only —
// no other field touched.

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const OLD_PARA2 = `Three real tiers exist once sales open. General admission is the roaming, no-assigned-seat ticket — cheapest, most flexible, and the only tier that lets you walk the circuit's perimeter across the weekend rather than committing to one grandstand. Reserved grandstand seating covers four named stands with genuinely different views: Grandstand A, the circuit's largest, on the main straight facing the start, finish, and podium; Grandstand B, just past A, looking into the tight opening corners where first-lap incidents cluster; and Grandstand H and Grandstand K, facing each other across the hairpin at the end of the circuit's longest straight — H watches the braking-zone attempt, K watches whether it actually worked. Formula 1's own race guide singles out Grandstand K by name as the best seat for overtaking, and separately flags Turn 6 as the circuit's other genuine passing zone worth knowing about if K isn't available.`;

const NEW_PARA2 = `Three real tiers exist once sales open. General admission is the roaming, no-assigned-seat ticket — cheapest, most flexible, and the only tier that lets you walk the circuit's perimeter across the weekend rather than committing to one grandstand. Reserved grandstand seating covers five named stands with genuinely different views: Grandstand A, the circuit's largest, on the main straight facing the start, finish, and podium; Grandstand B, just past A, looking into the tight opening corners where first-lap incidents cluster; Grandstand E, the newest stand, overlooking the Turn 11-13 complex on the run toward the back straight; and Grandstand H and Grandstand K, facing each other across the hairpin at the end of the circuit's longest straight — H watches the braking-zone attempt, K watches whether it actually worked. Formula 1's own race guide singles out Grandstand K by name as the best seat for overtaking, and separately flags Turn 6 as the circuit's other genuine passing zone worth knowing about if K isn't available.`;

const [row] = await sql`SELECT body_content FROM experiences WHERE slug = 'chinese-gp-ticket-guide-mud1pntb'`;
if (!row.body_content.includes(OLD_PARA2)) {
  console.error("OLD_PARA2 not found verbatim in current body_content — aborting without writing.");
  await sql.end();
  process.exit(1);
}

const newBody = row.body_content.replace(OLD_PARA2, NEW_PARA2);

await sql`
  UPDATE experiences
  SET body_content = ${newBody}, last_verified_date = ${new Date()}
  WHERE slug = 'chinese-gp-ticket-guide-mud1pntb'
`;

console.log("✓ Ticket guide paragraph 2 updated to include Grandstand E.");
await sql.end();

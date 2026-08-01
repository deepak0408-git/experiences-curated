import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

// Sets destinations.nearest_major_city -- explicit user-approved
// substitutes, 23 Jul 2026. Geographic proxies (destination lacks its own
// Budget Your Trip coverage) vs. data-quality proxies (destination has BYT
// coverage but the sample looked thin/unreliable) -- both use the same
// field, reasoning differs per row (see comments).
const UPDATES = [
  // Geographic proxies -- destination not covered on Budget Your Trip
  { name: "Belgian Ardennes", city: "Brussels", reason: "rural region, not a real city -- capital is the obvious substitute" },
  { name: "Centurion", city: "Johannesburg", reason: "same metro area as Johannesburg, already a covered destination" },
  { name: "Dundee", city: "Edinburgh", reason: "small city -- Edinburgh is the representative major Scottish city" },
  { name: "St Andrews", city: "Edinburgh", reason: "small town -- same logic as Dundee" },
  { name: "Turin", city: "Milan", reason: "Turin not covered by Budget Your Trip; Milan chosen over Rome (capital) -- geographically closer, already a covered destination, user's explicit choice" },
  { name: "Adelaide", city: "Sydney", reason: "not capital (Canberra is a poor cost proxy); Sydney is the best-covered nearby major city" },
  { name: "Perth", city: "Sydney", reason: "same logic as Adelaide" },
  { name: "Virginia Water", city: "London", reason: "same precedent as flights/hotels methodology" },
  // Data-quality proxies -- destination HAS Budget Your Trip coverage, but
  // the reported food figures looked implausibly high (exceeding London's
  // own cost), likely thin/skewed traveler-sample data. User's explicit
  // decision 23 Jul 2026: substitute London's figures rather than use the
  // as-published (but suspect) numbers for these two.
  { name: "Liverpool", city: "London", reason: "BYT's own Liverpool food figure ($136-138/day) exceeded London's ($80/day) -- implausible, thin-data artifact, user chose London as substitute" },
  { name: "Manchester", city: "London", reason: "same issue as Liverpool ($127-129/day food, exceeding London) -- user chose London as substitute" },
];

for (const u of UPDATES) {
  const result = await sql`
    UPDATE destinations
    SET nearest_major_city = ${u.city}
    WHERE name = ${u.name}
    RETURNING id, name, nearest_major_city
  `;
  console.log(`✓ ${u.name} -> ${u.city}`, result[0] ? `(row ${result[0].id})` : "NOT FOUND");
}

const rows = await sql`
  SELECT name, nearest_major_city FROM destinations WHERE nearest_major_city IS NOT NULL ORDER BY name
`;
console.log("\nAll destinations with nearest_major_city set:");
console.table(rows);

await sql.end();

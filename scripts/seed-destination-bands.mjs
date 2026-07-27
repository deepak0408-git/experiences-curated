import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

// Real Local Travel + Food daily USD cost data for all 25 destinations --
// planner_destination_bands. Researched 23 Jul 2026 per the
// planner-data-researcher skill's Local Travel & Food methodology.
//
// SOURCE: Budget Your Trip (budgetyourtrip.com) only, per explicit user
// decision -- the only evaluated site giving a ready, pre-computed daily
// USD figure for both categories separately (not component prices like
// Numbeo, not bot-walled like Expatistan). "All travelers" blended figure
// used (not budget/mid/luxury tier-specific), since BYT only breaks the
// OVERALL daily total into tiers -- Food and Local Transportation
// sub-figures are only published as one blended "All" number. Per BYT's
// own text: "the Food daily average is for all meals for an entire day...
// the overall daily average cost is not a summation of the individual
// categories" -- i.e. these are real aggregated traveler-reported spend,
// not a fixed "N meals/day" or "N rides/day" formula.
//
// nearestMajorCity substitutes (destinations.nearest_major_city) used for
// 10 rows -- either the destination lacks its own BYT coverage (geographic
// proxy) or had a BYT figure that looked implausibly high on inspection
// (data-quality proxy, user's explicit call): Liverpool and Manchester
// both showed food figures exceeding London's, likely thin/skewed sample
// data -- user chose to substitute London's numbers for both rather than
// use the as-published (but suspect) figures.
//
// Mumbai transport corrected from an earlier mis-extraction ($11 -> real
// figure $6.44/day) -- caught by user's own local knowledge of Mumbai.
//
// currency column: explicitly tagging currency: "USD" on every row.

const ROWS = [
  { name: "Abu Dhabi", foodLow: "78.00", foodHigh: "78.00", travelLow: "20.00", travelHigh: "20.00", note: "BYT own data." },
  { name: "Adelaide", foodLow: "82.00", foodHigh: "82.00", travelLow: "16.00", travelHigh: "16.00", note: "Substitute: Sydney (nearestMajorCity) -- Adelaide not a capital, Canberra is a poor cost proxy." },
  { name: "Belgian Ardennes", foodLow: "75.00", foodHigh: "75.00", travelLow: "19.00", travelHigh: "19.00", note: "Substitute: Brussels (nearestMajorCity) -- rural region, not a real city." },
  { name: "Birmingham", foodLow: "89.00", foodHigh: "89.00", travelLow: "34.00", travelHigh: "34.00", note: "BYT own data." },
  { name: "Budapest", foodLow: "47.00", foodHigh: "47.00", travelLow: "12.00", travelHigh: "12.00", note: "BYT own data." },
  { name: "Cape Town", foodLow: "82.00", foodHigh: "82.00", travelLow: "19.00", travelHigh: "19.00", note: "BYT own data." },
  { name: "Centurion", foodLow: "33.00", foodHigh: "33.00", travelLow: "18.00", travelHigh: "18.00", note: "Substitute: Johannesburg (nearestMajorCity) -- same metro area." },
  { name: "Dundee", foodLow: "91.00", foodHigh: "91.00", travelLow: "23.00", travelHigh: "23.00", note: "Substitute: Edinburgh (nearestMajorCity) -- small city, Edinburgh is the representative major Scottish city." },
  { name: "Durban", foodLow: "32.00", foodHigh: "32.00", travelLow: "15.00", travelHigh: "15.00", note: "BYT own data." },
  { name: "Johannesburg", foodLow: "33.00", foodHigh: "33.00", travelLow: "18.00", travelHigh: "18.00", note: "BYT own data." },
  { name: "Las Vegas", foodLow: "139.00", foodHigh: "139.00", travelLow: "53.00", travelHigh: "53.00", note: "BYT own data -- kept as published despite looking high vs other US cities; user's explicit call (plausible real-world driver: Strip restaurant pricing)." },
  { name: "Liverpool", foodLow: "80.00", foodHigh: "80.00", travelLow: "35.00", travelHigh: "35.00", note: "Substitute: London (nearestMajorCity, data-quality override) -- BYT's own Liverpool figure ($136-138/day food) exceeded London's, implausible/thin-sample; user's explicit call." },
  { name: "London", foodLow: "80.00", foodHigh: "80.00", travelLow: "35.00", travelHigh: "35.00", note: "BYT own data." },
  { name: "Manchester", foodLow: "80.00", foodHigh: "80.00", travelLow: "35.00", travelHigh: "35.00", note: "Substitute: London (nearestMajorCity, data-quality override) -- BYT's own Manchester figure ($127-129/day food) exceeded London's, implausible/thin-sample; user's explicit call." },
  { name: "Melbourne", foodLow: "56.00", foodHigh: "56.00", travelLow: "21.00", travelHigh: "21.00", note: "BYT own data." },
  { name: "Milan", foodLow: "77.00", foodHigh: "77.00", travelLow: "40.00", travelHigh: "40.00", note: "BYT own data." },
  { name: "Mumbai", foodLow: "38.00", foodHigh: "38.00", travelLow: "6.44", travelHigh: "6.44", note: "BYT own data -- transport corrected from an earlier mis-extraction ($11) to the real live figure ($6.44/day), caught by user's own local knowledge of Mumbai." },
  { name: "New York", foodLow: "87.00", foodHigh: "87.00", travelLow: "49.00", travelHigh: "49.00", note: "BYT own data (slug: united-states-of-america/new-york-city)." },
  { name: "Paris", foodLow: "83.00", foodHigh: "83.00", travelLow: "25.00", travelHigh: "25.00", note: "BYT own data." },
  { name: "Perth", foodLow: "82.00", foodHigh: "82.00", travelLow: "16.00", travelHigh: "16.00", note: "Substitute: Sydney (nearestMajorCity) -- same logic as Adelaide." },
  { name: "Singapore", foodLow: "47.00", foodHigh: "47.00", travelLow: "11.00", travelHigh: "11.00", note: "BYT own data (slug: singapore, not singapore/singapore)." },
  { name: "St Andrews", foodLow: "91.00", foodHigh: "91.00", travelLow: "23.00", travelHigh: "23.00", note: "Substitute: Edinburgh (nearestMajorCity) -- same logic as Dundee." },
  { name: "Sydney", foodLow: "82.00", foodHigh: "82.00", travelLow: "16.00", travelHigh: "16.00", note: "BYT own data." },
  { name: "Turin", foodLow: "77.00", foodHigh: "77.00", travelLow: "40.00", travelHigh: "40.00", note: "Substitute: Milan (nearestMajorCity) -- Turin not covered by BYT (real 404); Milan chosen over Rome (capital) per user's explicit decision -- geographically closer, already a covered destination." },
  { name: "Virginia Water", foodLow: "80.00", foodHigh: "80.00", travelLow: "35.00", travelHigh: "35.00", note: "Substitute: London (nearestMajorCity) -- same precedent as flights/hotels methodology." },
];

for (const r of ROWS) {
  const dest = await sql`SELECT id FROM destinations WHERE name = ${r.name}`;
  if (dest.length === 0) {
    console.log(`✗ ${r.name} -- destination not found, skipped`);
    continue;
  }
  const destinationId = dest[0].id;
  const result = await sql`
    INSERT INTO planner_destination_bands (destination_id, local_travel_low, local_travel_high, food_per_day_low, food_per_day_high, currency)
    VALUES (${destinationId}, ${r.travelLow}, ${r.travelHigh}, ${r.foodLow}, ${r.foodHigh}, 'USD')
    ON CONFLICT (destination_id) DO UPDATE SET
      local_travel_low = EXCLUDED.local_travel_low,
      local_travel_high = EXCLUDED.local_travel_high,
      food_per_day_low = EXCLUDED.food_per_day_low,
      food_per_day_high = EXCLUDED.food_per_day_high,
      currency = EXCLUDED.currency,
      last_updated = NOW()
    RETURNING id
  `;
  console.log(`✓ ${r.name} seeded, row id ${result[0].id}`);
}

const rows = await sql`
  SELECT d.name, b.food_per_day_low, b.food_per_day_high, b.local_travel_low, b.local_travel_high, b.currency
  FROM planner_destination_bands b
  JOIN destinations d ON d.id = b.destination_id
  ORDER BY d.name
`;
console.log(`\nAll planner_destination_bands rows (${rows.length} total, should be 25):`);
console.table(rows);

await sql.end();

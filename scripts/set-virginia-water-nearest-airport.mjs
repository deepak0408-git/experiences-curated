import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

// Virginia Water has no airport of its own -- Wentworth Club (BMW PGA
// Championship venue) is genuinely close to London/Heathrow. Setting
// nearestAirportIata = LHR per explicit user instruction, 22 Jul 2026,
// so flight searches have a real, resolvable airport to target instead
// of searching the town name literally (which Google Flights/Kayak can't
// resolve to a route).

const result = await sql`
  UPDATE destinations
  SET nearest_airport_iata = 'LHR'
  WHERE name = 'Virginia Water'
  RETURNING id, name, nearest_airport_iata
`;
console.log(result);
await sql.end();

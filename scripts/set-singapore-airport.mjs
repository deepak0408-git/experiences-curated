import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

// Singapore is a genuine standalone destination with its own major airport
// (Changi) -- unlike Virginia Water/St Andrews, no airport-scope decision
// needed. Setting nearestAirportIata = SIN, unambiguous.
const result = await sql`
  UPDATE destinations
  SET nearest_airport_iata = 'SIN'
  WHERE name = 'Singapore'
  RETURNING id, name, nearest_airport_iata
`;
console.table(result);
await sql.end();

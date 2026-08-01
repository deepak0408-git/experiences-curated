import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

// St Andrews has no airport of its own. Per explicit user decision 23 Jul 2026,
// nearestAirportIata set to EDI (Edinburgh, ~1h10 drive, real flight inventory)
// over DND (Dundee, ~15 min but very limited routes) -- same reasoning pattern
// as Virginia Water -> LHR (nearest major hub with real flight inventory, not
// the closest speck of tarmac). Flight searches will target "Edinburgh"
// broadly, same as Virginia Water's "London" broad-search approach.
const result = await sql`
  UPDATE destinations
  SET nearest_airport_iata = 'EDI'
  WHERE name = 'St Andrews'
  RETURNING id, name, nearest_airport_iata
`;
console.table(result);
await sql.end();

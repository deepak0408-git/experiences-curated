import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

// Turin is a genuine standalone destination with its own major airport
// (Torino-Caselle, TRN) -- no airport-scope decision needed.
const result = await sql`
  UPDATE destinations
  SET nearest_airport_iata = 'TRN'
  WHERE name = 'Turin'
  RETURNING id, name, nearest_airport_iata
`;
console.table(result);
await sql.end();

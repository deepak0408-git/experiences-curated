import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const rows = await client`
  select id, name, slug, pack_format, pack_status, is_hidden
  from sporting_events
  where slug in ('wimbledon', 'us-open')
`;
console.log(rows);
await client.end();

import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const target = process.argv[2];
if (target !== "hub_and_spoke" && target !== "classic") {
  console.error('Usage: node flip-wimbledon-format.mjs <hub_and_spoke|classic>');
  process.exit(1);
}

const [before] = await client`SELECT pack_format FROM sporting_events WHERE id = '8bb7090e-1ec7-4c3f-b4e2-7fd6bf9942cf'`;
console.log("Before:", before.pack_format);

const [after] = await client`
  UPDATE sporting_events SET pack_format = ${target}
  WHERE id = '8bb7090e-1ec7-4c3f-b4e2-7fd6bf9942cf'
  RETURNING pack_format
`;
console.log("After:", after.pack_format);

await client.end();

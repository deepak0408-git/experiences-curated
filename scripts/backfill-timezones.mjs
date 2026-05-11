import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { destinations } from "../schema/database.ts";
import { isNull } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Maps destination name (lowercase) to IANA timezone ID
const NAME_TO_TIMEZONE = {
  // Australia
  "melbourne": "Australia/Melbourne",
  "sydney": "Australia/Sydney",
  "brisbane": "Australia/Brisbane",
  "perth": "Australia/Perth",
  "adelaide": "Australia/Adelaide",
  "darwin": "Australia/Darwin",
  "hobart": "Australia/Hobart",
  "canberra": "Australia/Sydney",
  // New Zealand
  "auckland": "Pacific/Auckland",
  "wellington": "Pacific/Auckland",
  "christchurch": "Pacific/Auckland",
  "queenstown": "Pacific/Auckland",
  // UK & Ireland
  "london": "Europe/London",
  "edinburgh": "Europe/London",
  "manchester": "Europe/London",
  "dublin": "Europe/Dublin",
  // Europe
  "paris": "Europe/Paris",
  "amsterdam": "Europe/Amsterdam",
  "berlin": "Europe/Berlin",
  "munich": "Europe/Berlin",
  "rome": "Europe/Rome",
  "milan": "Europe/Rome",
  "venice": "Europe/Rome",
  "florence": "Europe/Rome",
  "madrid": "Europe/Madrid",
  "barcelona": "Europe/Madrid",
  "lisbon": "Europe/Lisbon",
  "porto": "Europe/Lisbon",
  "vienna": "Europe/Vienna",
  "zurich": "Europe/Zurich",
  "geneva": "Europe/Zurich",
  "brussels": "Europe/Brussels",
  "prague": "Europe/Prague",
  "budapest": "Europe/Budapest",
  "warsaw": "Europe/Warsaw",
  "stockholm": "Europe/Stockholm",
  "oslo": "Europe/Oslo",
  "copenhagen": "Europe/Copenhagen",
  "helsinki": "Europe/Helsinki",
  "athens": "Europe/Athens",
  "istanbul": "Europe/Istanbul",
  "reykjavik": "Atlantic/Reykjavik",
  // USA & Canada
  "new york": "America/New_York",
  "boston": "America/New_York",
  "miami": "America/New_York",
  "chicago": "America/Chicago",
  "new orleans": "America/Chicago",
  "denver": "America/Denver",
  "phoenix": "America/Phoenix",
  "los angeles": "America/Los_Angeles",
  "san francisco": "America/Los_Angeles",
  "seattle": "America/Los_Angeles",
  "las vegas": "America/Los_Angeles",
  "toronto": "America/Toronto",
  "montreal": "America/Toronto",
  "vancouver": "America/Vancouver",
  // Asia
  "tokyo": "Asia/Tokyo",
  "osaka": "Asia/Tokyo",
  "kyoto": "Asia/Tokyo",
  "beijing": "Asia/Shanghai",
  "shanghai": "Asia/Shanghai",
  "hong kong": "Asia/Hong_Kong",
  "singapore": "Asia/Singapore",
  "bangkok": "Asia/Bangkok",
  "chiang mai": "Asia/Bangkok",
  "bali": "Asia/Makassar",
  "jakarta": "Asia/Jakarta",
  "kuala lumpur": "Asia/Kuala_Lumpur",
  "seoul": "Asia/Seoul",
  "taipei": "Asia/Taipei",
  "mumbai": "Asia/Kolkata",
  "delhi": "Asia/Kolkata",
  "bangalore": "Asia/Kolkata",
  "colombo": "Asia/Colombo",
  "kathmandu": "Asia/Kathmandu",
  "dubai": "Asia/Dubai",
  "abu dhabi": "Asia/Dubai",
  "doha": "Asia/Qatar",
  "riyadh": "Asia/Riyadh",
  "tel aviv": "Asia/Jerusalem",
  "beirut": "Asia/Beirut",
  // Africa
  "cairo": "Africa/Cairo",
  "cape town": "Africa/Johannesburg",
  "johannesburg": "Africa/Johannesburg",
  "nairobi": "Africa/Nairobi",
  "marrakech": "Africa/Casablanca",
  "casablanca": "Africa/Casablanca",
  "zanzibar": "Africa/Dar_es_Salaam",
  // Americas
  "mexico city": "America/Mexico_City",
  "cancun": "America/Cancun",
  "havana": "America/Havana",
  "san jose": "America/Costa_Rica",
  "bogota": "America/Bogota",
  "lima": "America/Lima",
  "rio de janeiro": "America/Sao_Paulo",
  "sao paulo": "America/Sao_Paulo",
  "buenos aires": "America/Argentina/Buenos_Aires",
  "santiago": "America/Santiago",
  // Pacific
  "honolulu": "Pacific/Honolulu",
  "fiji": "Pacific/Fiji",
  "maldives": "Indian/Maldives",
  "mauritius": "Indian/Mauritius",
};

const rows = await db
  .select({ id: destinations.id, name: destinations.name, timezone: destinations.timezone })
  .from(destinations)
  .where(isNull(destinations.timezone));

if (rows.length === 0) {
  console.log("All destinations already have a timezone set.");
  await client.end();
  process.exit(0);
}

console.log(`Found ${rows.length} destination(s) without a timezone:\n`);

let updated = 0;
let skipped = 0;

for (const row of rows) {
  const key = row.name.toLowerCase().trim();
  const tz = NAME_TO_TIMEZONE[key];

  if (tz) {
    await db.update(destinations).set({ timezone: tz }).where(
      (await import("drizzle-orm")).eq(destinations.id, row.id)
    );
    console.log(`  ✓ "${row.name}" → ${tz}`);
    updated++;
  } else {
    console.log(`  ✗ "${row.name}" — no match found, set manually`);
    skipped++;
  }
}

console.log(`\nDone: ${updated} updated, ${skipped} skipped.`);
await client.end();

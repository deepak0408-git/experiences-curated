import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { destinations } from "../schema/database.ts";

// Nagpur + Ahmedabad destinations rows — created 9 Oct 2026 to fix a real
// data bug surfaced while verifying the EXPERIENCE_TO_SPOKE_BY_EVENT
// back-link addition for Border-Gavaskar Trophy 2027: 16 of the pack's 27
// experiences (every Nagpur/Ahmedabad one) had destinationId pointing at
// Chennai's row as a placeholder, since no Nagpur/Ahmedabad row existed —
// wrong in the visible city badge/breadcrumb, JSON-LD addressLocality, and
// Algolia's destinationName facet.
//
// Matches Chennai's own existing bare-bones row (name/slug/country/region/
// currency/airport only, no editorial overview/hero image) for consistency
// — founder-approved 9 Oct 2026.
//
// nearestAirportIata research (skill §0 blocker):
//   Nagpur -> NAG (Dr. Babasaheb Ambedkar International Airport) — genuine
//     international routes (confirmed real international service to
//     Singapore, Bangkok, Doha etc.), serves Nagpur directly, no proxy-city
//     logic needed.
//   Ahmedabad -> AMD (Sardar Vallabhbhai Patel International Airport) —
//     India's 7th-busiest airport, serves Ahmedabad directly, unambiguous.

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const rows = await db.insert(destinations).values([
  {
    name: "Nagpur",
    slug: "nagpur",
    countryCode: "IN",
    region: "Maharashtra",
    destinationType: "city",
    currency: "INR",
    nearestAirportIata: "NAG",
  },
  {
    name: "Ahmedabad",
    slug: "ahmedabad",
    countryCode: "IN",
    region: "Gujarat",
    destinationType: "city",
    currency: "INR",
    nearestAirportIata: "AMD",
  },
]).returning({ id: destinations.id, name: destinations.name });

console.log(JSON.stringify(rows, null, 2));
await client.end();

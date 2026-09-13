import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { inArray } from "drizzle-orm";
import { businessPartners } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const emails = [
  "helpme@batravel.com",
  "info@roadtrips.com",
  "info@goindiaholiday.net",
  "smile@vishwaviharholidays.com",
  "travel@sportsnetholidays.com",
  "mehul@worldsportstravels.in",
  "enquiries@elegantresorts.co.uk",
  "info@discoveryholidays.in",
  "info@beyondthecastletravel.com",
  "sports@cassidytravel.ie",
  "info@celtichorizontours.com",
];

await db.update(businessPartners)
  .set({ lastContactedAt: new Date() })
  .where(inArray(businessPartners.contactEmail, emails));

console.log("Updated lastContactedAt for", emails.length, "orgs");
await client.end();

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { inArray } from "drizzle-orm";
import { businessPartners } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const emails = [
  "info@gulliversportstravel.co.uk",
  "hello@bacsport.co.uk",
  "hello@globalsports.travel",
  "premium@sporttours.com.au",
  "info@sasportstours.co.za",
  "hello@followontours.com",
  "sales@champions-travel.com",
  "sales@cuttingedgein.com",
  "info@dreamteamsportstours.com",
  "info@travelosports.com",
  "info@gosporttravel.com",
];

const result = await db.update(businessPartners)
  .set({ lastContactedAt: new Date() })
  .where(inArray(businessPartners.contactEmail, emails));

console.log("Updated lastContactedAt for", emails.length, "orgs");
await client.end();

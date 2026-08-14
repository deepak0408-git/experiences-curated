import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { businessPartners } from "../schema/database.ts";
import { inArray } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// APPROXIMATE ONLY — derived from a Resend dashboard screenshot showing
// "12d ago" relative timestamps on 13 Aug 2026 for the Batch 4 follow-up
// wave. Not exact send times. lastContactedAt only — firstContactedAt for
// these orgs, and all dates for Batches 1-3, remain unknown/NULL.
const approxLastContactedAt = new Date("2026-08-01");

const batch4FollowUpEmails = [
  "hello@globalsports.travel",
  "premium@sporttours.com.au",
  "info@sasportstours.co.za",
  "info@travelosports.com",
  "hello@followontours.com",
  "sales@champions-travel.com",
  "sales@cuttingedgein.com",
  "info@gosporttravel.com",
  "info@dreamteamsportstours.com",
  "gsan.bookings@f1experiences.com",
  "info@sydneyuniversitycricket.com.au",
  "cricket.club@imperial.ac.uk",
];

const result = await db
  .update(businessPartners)
  .set({ lastContactedAt: approxLastContactedAt })
  .where(inArray(businessPartners.contactEmail, batch4FollowUpEmails));

console.log(`✓ Backfilled approximate lastContactedAt for ${batch4FollowUpEmails.length} orgs`);
await client.end();

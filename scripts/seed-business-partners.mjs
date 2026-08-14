import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { businessPartners } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const partners = [
  // Batch 1 — tour operator partnership outreach (content licensing/co-branding pitch)
  { organizationName: "Dream Sports", contactEmail: "contactus@dreamsetgo.com", partnerType: "tour_operator", notes: "Batch 1: tour operator content licensing/co-branding pitch." },
  { organizationName: "Bharat Army", contactEmail: "helpme@batravel.com", partnerType: "tour_operator", notes: "Batch 1: tour operator content licensing/co-branding pitch." },
  { organizationName: "Roadtrips", contactEmail: "info@roadtrips.com", partnerType: "tour_operator", notes: "Batch 1: tour operator content licensing/co-branding pitch." },
  { organizationName: "GoIndiaHoliday", contactEmail: "info@goindiaholiday.net", partnerType: "tour_operator", notes: "Batch 1: tour operator content licensing/co-branding pitch." },
  { organizationName: "Vishwa Vihar Holidays", contactEmail: "smile@vishwaviharholidays.com", partnerType: "tour_operator", notes: "Batch 1: tour operator content licensing/co-branding pitch." },
  { organizationName: "Sports Net Holidays", contactEmail: "travel@sportsnetholidays.com", partnerType: "tour_operator", notes: "Batch 1: tour operator content licensing/co-branding pitch." },
  { organizationName: "World Sports Travels", contactEmail: "mehul@worldsportstravels.in", partnerType: "tour_operator", notes: "Batch 1: tour operator content licensing/co-branding pitch." },
  { organizationName: "Elegant Resorts", contactEmail: "enquiries@elegantresorts.co.uk", partnerType: "tour_operator", notes: "Batch 1: tour operator content licensing/co-branding pitch." },
  { organizationName: "Discovery Holidays", contactEmail: "info@discoveryholidays.in", partnerType: "tour_operator", notes: "Batch 1: tour operator content licensing/co-branding pitch." },
  { organizationName: "Beyond the Castle Travel", contactEmail: "info@beyondthecastletravel.com", partnerType: "tour_operator", notes: "Batch 1: tour operator content licensing/co-branding pitch." },
  { organizationName: "Cassidy Travel", contactEmail: "sports@cassidytravel.ie", partnerType: "tour_operator", notes: "Batch 1: tour operator content licensing/co-branding pitch." },
  { organizationName: "Celtic Horizon Tours", contactEmail: "info@celtichorizontours.com", partnerType: "tour_operator", notes: "Batch 1: tour operator content licensing/co-branding pitch." },

  // Batch 1 + Batch 4 — dual pitch, deduplicated to one row each
  { organizationName: "TraveloSports", contactEmail: "info@travelosports.com", partnerType: "tour_operator", notes: "Batch 1: tour operator content licensing/co-branding pitch. Also Batch 4: destination-research follow-up sent separately." },
  { organizationName: "GoSportTravel", contactEmail: "info@gosporttravel.com", partnerType: "tour_operator", notes: "Batch 1: tour operator content licensing/co-branding pitch. Also Batch 4: destination-research follow-up sent separately." },

  // Batch 2 — influencer / content collab
  { organizationName: "Behind The Racquet", contactEmail: "zach@behindtheracquet.com", contactName: "Zach", partnerType: "influencer", notes: "Batch 2: content collab pitch, US Open. Prior relationship — outreach references an earlier conversation during Wimbledon." },
  { organizationName: "The Tennis Guy", contactEmail: "tennisguyofficial@gmail.com", partnerType: "influencer", notes: "Batch 2: content collab / influencer outreach." },

  // Batch 3 — one-off referral inquiry, premium hospitality (not general tour logistics)
  { organizationName: "F1 Experiences", contactEmail: "gsan.bookings@f1experiences.com", partnerType: "luxury_experience_operator", notes: "Batch 3 (one-off): referral/affiliate partnership inquiry for F1 hospitality bookings (Paddock Club tier). Follow-up also sent as part of Batch 4's send wave." },

  // Batch 4 — G5 travel agent outreach (destination-research / genuine-question pitch)
  { organizationName: "Gulliver's Sports Travel", contactEmail: "info@gulliversportstravel.co.uk", partnerType: "tour_operator", notes: "Batch 4: destination-research gap-finding pitch." },
  { organizationName: "BAC Sport", contactEmail: "hello@bacsport.co.uk", partnerType: "tour_operator", notes: "Batch 4: destination-research gap-finding pitch." },
  { organizationName: "Global Sports Travel", contactEmail: "hello@globalsports.travel", partnerType: "tour_operator", notes: "Batch 4: destination-research gap-finding pitch (follow-up)." },
  { organizationName: "Sport Tours Australia", contactEmail: "premium@sporttours.com.au", partnerType: "tour_operator", notes: "Batch 4: destination-research gap-finding pitch (follow-up)." },
  { organizationName: "SA Sports Tours", contactEmail: "info@sasportstours.co.za", partnerType: "tour_operator", notes: "Batch 4: destination-research gap-finding pitch (follow-up)." },
  { organizationName: "Follow On Tours", contactEmail: "hello@followontours.com", partnerType: "tour_operator", notes: "Batch 4: destination-research gap-finding pitch (follow-up)." },
  { organizationName: "Champions Travel", contactEmail: "sales@champions-travel.com", partnerType: "tour_operator", notes: "Batch 4: destination-research gap-finding pitch (follow-up)." },
  { organizationName: "Cutting Edge", contactEmail: "sales@cuttingedgein.com", partnerType: "tour_operator", notes: "Batch 4: destination-research gap-finding pitch (follow-up)." },
  { organizationName: "Dream Team Sports Tours", contactEmail: "info@dreamteamsportstours.com", partnerType: "tour_operator", notes: "Batch 4: destination-research gap-finding pitch (follow-up)." },

  // Batch 4 — sporting clubs, different pitch (group discount)
  { organizationName: "Sydney University Cricket", contactEmail: "info@sydneyuniversitycricket.com.au", partnerType: "sporting_club", notes: "Batch 4: group discount for cricket tours pitch (follow-up)." },
  { organizationName: "Imperial College Cricket Club", contactEmail: "cricket.club@imperial.ac.uk", partnerType: "sporting_club", notes: "Batch 4: group discount for cricket tours pitch (follow-up)." },
];

let inserted = 0;
for (const p of partners) {
  await db.insert(businessPartners).values(p).onConflictDoNothing({ target: businessPartners.contactEmail });
  inserted++;
}

console.log(`✓ Seeded ${inserted} business partners`);
await client.end();

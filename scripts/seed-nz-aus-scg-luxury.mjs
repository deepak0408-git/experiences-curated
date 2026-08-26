import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "55f26c1e-adb3-46ba-aaf7-997585ed25a5"; // Sydney
const EVENT_ID = "ff13692a-c1b3-415a-8264-42b3d8535afd";
const slug = "scg-luxury-invincibles-lounge-members-pavilion-" + Date.now().toString(36);

const imageKey = "experiences/hero/SCG Luxury Invincibles Lounge Members Pavilion.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
const file = readFileSync("Images/New Zealand in Australia - SCG Luxury Invincibles Lounge Members Pavilion.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("Hero image uploaded:", heroImageUrl);

const bodyContent = `The SCG's official hospitality for this Test — confirmed live on the Venues NSW booking page for the January 2027 New Year's Test against New Zealand, 4-6 January 2027 — runs four tiers, each a genuinely different size and setting rather than the same room sold at different price points.

The Invincibles Lounge, on Level 2 of the Victor Trumper Stand, caps at 40 guests and includes an enhanced beverage menu (beer, wine, spirits, and non-alcoholic options) alongside a dedicated hospitality host. The Curators Suite, one level up on Level 3 of the Brewongle-Churchill Stand, is the larger of the two shared lounges at up to 60 guests, again with a dedicated host and premium food and beverage service. Both sit above Private Suites (glass-fronted, air-conditioned, sold at 14, 20, or 30 guests, catered by Merivale — the well-known Sydney hospitality group behind Totti's, Fred's, and Mr Wong's, whose menus are built specifically for this hospitality) and Outdoor Boxes (open-air, 8 guests, undercover cushioned seating with a dedicated box steward).

The genuine standout, though, is Inside the Inner Sanctum — an experience for a maximum of 12 guests, hosted inside the SCG Members Pavilion's actual player changerooms, the same 1878 heritage building international teams use on match day. It includes reserved match seating on the players' balcony and bespoke Merivale catering. This product runs on a small number of confirmed dates through the year rather than being available for every fixture, so its availability for this specific January Test needs confirming directly rather than assumed.

No pricing is published anywhere for any of these five products — not on the official Venues NSW hospitality site, not through resellers. Every listing, without exception, says "Enquire Now." That's consistent across SCG hospitality generally, not specific to this series, so treat any number quoted elsewhere online as unconfirmed.`;

const whyItsSpecial = `Most stadium hospitality sells you a good seat and a buffet with a premium label attached. Inside the Inner Sanctum sells something genuinely different: access to the actual room where Australia's Test team changes, prepares, and sits between overs — the same heritage 1878 pavilion, not a replica or a themed space built to evoke it. For a New Zealand supporter on this tour, watching the fourth Test from inside the ground's most historically loaded building, on the players' own balcony, is as close as hospitality gets to being inside the contest rather than just watching it well-fed. The four larger tiers are good, straightforward premium hospitality — real Merivale-catered food, real dedicated hosts, real private space — but the Inner Sanctum is the one product on this whole tour that can't be replicated anywhere else in Australian cricket, because there's only one 1878 pavilion.`;

const insiderTips = [
  "Inside the Inner Sanctum only runs on a limited number of confirmed dates through the year, not every Test — call SCG Hospitality directly to confirm it's actually being offered for the January 2027 New Zealand Test before building plans around it.",
  "If the Inner Sanctum isn't available for your dates, the Invincibles Lounge (40 guests, Victor Trumper Stand Level 2) is the next best value for a smaller group wanting a dedicated host and enhanced beverage service without the 60-guest scale of the Curators Suite.",
];

const whatToAvoid = "Don't expect to find pricing anywhere online before you enquire — every tier, from Outdoor Boxes up to the Inner Sanctum, is quoted as \"Enquire Now\" with no published figures, so budget conversations with your group need to happen after you've actually contacted SCG Hospitality, not before. Avoid assuming the Curators Suite and Invincibles Lounge are interchangeable because both are described as \"shared lounges\" — they're on different levels, different stands (Brewongle-Churchill vs. Victor Trumper), and different capacities (60 vs. 40), which changes both the atmosphere and the view.";

const practicalInfo = {
  hours: "Gates open 9:00am, play starts 10:30am for the January 2027 New Year's Test — hospitality access typically opens ahead of general gates, confirm exact timing when booking",
  costRange: "No pricing published for any tier — Outdoor Boxes (8 guests) through Private Suites (14-30), Invincibles Lounge (40), Curators Suite (60), and Inside the Inner Sanctum (12) are all quoted as Enquire Now only",
  bookingMethod: "Book through officialhospitality.com.au (Venues NSW Official Hospitality for the SCG) — every product requires a direct enquiry, no online pricing or self-service checkout for any tier.",
  howToBook: "Call SCG Hospitality directly on +61 2 9929 0933 or email enquiries@scghospitality.com.au — every one of the five hospitality tiers here, including Inside the Inner Sanctum, is Enquire Now only, so a direct call is the only way to get a real quote or confirm which products are actually running for the January 2027 New Zealand Test specifically. Ask by name for Inside the Inner Sanctum if the changerooms experience is what you want — it isn't offered for every fixture, so confirm it's live for this Test before you commit a group to it. These contact details are corroborated across two independent sources rather than confirmed directly on SCG's own site (an SSL certificate issue blocked a direct verification pass, 16 Aug 2026) — worth a quick double-check against officialhospitality.com.au's own Contact Us page before relying on them for a large booking.",
  website: "https://www.officialhospitality.com.au/sydney_cricket_ground",
  reservationsRequired: true,
};

const gettingThere = "See the separate SCG venue experience for full transport directions — Moore Park light rail stop from Central Station.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "SCG Luxury — The Invincibles Lounge & Members Pavilion",
      subtitle: "One hospitality tier here puts you inside the actual 1878 player changerooms — for 12 guests only",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Moore Park",
      address: null,
      heroImageUrl,
      heroImageAlt: "The heritage Members Pavilion at the Sydney Cricket Ground",
      heroImageCredit: "Rajiv Bhuttan, CC BY 2.0 (Wikimedia Commons)",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: officialhospitality.com.au live January 2027 New Year's Test (Australia v New Zealand) hospitality listing — Outdoor Boxes, Private Suites, Invincibles Lounge, Curators Suite all confirmed live for this exact fixture, captured 16 Aug 2026. officialhospitality.com.au general SCG hospitality page for Inside the Inner Sanctum product details (12-guest cap, Members Pavilion changerooms, confirmed sample dates elsewhere in the year — 2027 New Zealand Test availability not separately confirmed, flagged in copy). Contact phone/email (SCG Hospitality, +61 2 9929 0933, enquiries@scghospitality.com.au) corroborated via Lusha business listing and independent web search — a direct fetch to scghospitality.com.au failed on an SSL certificate mismatch, so this contact is not independently confirmed on SCG's own site; flagged explicitly in howToBook. No pricing published for any tier as of this date.",
      googleMapsRating: null,
      googleMapsReviewCount: null,
      googleMapsUrl: null,
      sport: ["cricket"],
      moodTags: ["luxury", "hospitality", "heritage"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "luxury",
      budgetCurrency: "USD",
      bestSeasons: ["jan"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-16",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID, packRank: 10 })
    .onConflictDoNothing();

  console.log("\nExperience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

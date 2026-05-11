import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences, sportingEvents } from "../schema/database.ts";

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

const LONDON_ID = "75758888-28b9-4e09-82ba-f05681ecc904";
const slug = "wimbledon-eating-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const imageKey = "experiences/hero/wimbledon-strawberries-cream.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/wimbledon-strawberries-cream.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// ─── 2. Get Wimbledon 2026 sporting event ─────────────────────────────────────

const [event] = await db
  .insert(sportingEvents)
  .values({
    name: "The Championships, Wimbledon 2026",
    slug: "wimbledon-2026",
    sport: "tennis",
    tournamentSeries: "Wimbledon",
    editionYear: 2026,
    destinationId: LONDON_ID,
    venueName: "All England Lawn Tennis and Croquet Club",
    venueAddress: "Church Road, Wimbledon, London SW19 5AE",
    startDate: "2026-06-29",
    endDate: "2026-07-12",
    recurrence: "annual",
    ticketingUrl: "https://www.wimbledon.com/tickets",
  })
  .onConflictDoNothing()
  .returning({ id: sportingEvents.id, name: sportingEvents.name });

let wimbledonEventId;
if (event) {
  wimbledonEventId = event.id;
  console.log("✓ Sporting event created:", event.name, "→", wimbledonEventId);
} else {
  const [existing] = await db
    .select({ id: sportingEvents.id })
    .from(sportingEvents)
    .where(eq(sportingEvents.slug, "wimbledon-2026"));
  wimbledonEventId = existing?.id;
  console.log("✓ Sporting event already exists, ID:", wimbledonEventId);
}

// ─── 3. Content ───────────────────────────────────────────────────────────────

const bodyContent = `The strawberries and cream figure everyone quotes — 140,000 portions sold over the fortnight — makes more sense when you see the Tea Lawn. There's a dedicated counter. There's always a queue. For two weeks in July it functions as the de facto meeting point and social centrepiece of the grounds. The portion (£2.70 in 2025, the first increase since 2010) is small. You will want two.

The food operation across the grounds is larger and more varied than coverage suggests. The AELTC runs multiple named venues and they're genuinely different in character rather than the same offer under different signs.

The Tea Lawn sits between Centre Court and Court 1 and is where most of the ritual Wimbledon food happens: champagne, Pimm's (£12.25 a cup in 2025), the Long Bar, the strawberry counter, people watching. It doesn't have a full menu. It has the things people picture when they picture Wimbledon.

The Walled Garden Food Market is where you go for actual meals: hot food stalls, more seating, shorter queues. The Cavendish, new in 2025 and near Court 1, does full-day dining from breakfast through evening at table service, mains in the £19–22 range. The Wingfield Restaurant — on the first floor of the Centre Court building — is the only venue requiring a reservation: fixed-price three-course lunch, wine included. It books out months ahead and is worth knowing about if you plan far enough forward.

For something between grazing and a full meal, The Larder on the Tea Lawn has sandwiches from £4.95, salads from £7.50, Cornish pasties at £6.80. There's also a Bakery, a Conservatory Kitchen (self-service hot and cold lunches), and a Café Pergola serving assisted lunch and afternoon tea.

Drinks pricing is what generates most of the coverage. Beer runs £7.80–£8.45 for a 330ml can. Lanson is the official champagne — £96 a bottle, available by the glass. None of this is cheap. The bring-your-own policy softens it: you can bring one bottle of wine or champagne, or two beers per person, in soft containers. No glass, no hard-sided boxes, no spirits, no picnic hampers.

The debenture tier operates separately. The Renshaw Restaurant, the Rooftop Bar, and the Champions' Room (the last by internal ballot even among debenture holders) don't appear on any public food map.

The AELTC has consistently positioned the food as part of the experience rather than a concession operation. The quality across venues is higher than what you'd typically find at a comparable sports event. The prices reflect that, and also the captive audience.`;

const whyItsSpecial = `The 140,000-portions figure isn't the interesting one. The interesting one is that Wimbledon has run the same food rituals long enough that they've become part of what the tournament means. The queue at the Tea Lawn strawberry counter isn't about the strawberries. It's about doing the thing that everyone at Wimbledon does. That sounds like a small observation. It isn't — there are sporting events where the crowd is purely incidental, and this isn't one of them.

The actual food quality, across the board, is better than it needs to be. The AELTC has no competitive pressure on what it charges or serves — every seat sells regardless — but the catering standards are high, and the range is wider than most people realise before they're inside the grounds. The Wingfield is a proper restaurant. The Cavendish is a proper restaurant. The Walled Garden is better than most festival food.

The bring-your-own policy is an anomaly for an event of this scale, and a deliberate one. The organisation wants people to bring wine from home, eat on the hill, watch tennis on the screens outside. It's part of the Wimbledon character — the sense that the experience extends beyond the ticketed courts, into the grounds, into the grass, into the picnic someone's set out next to Henman Hill.

On a budget, BYOB plus the Larder makes a full day manageable well under £30. For the whole picture — Pimm's on the Tea Lawn, strawberries twice, a proper lunch at the Wingfield — plan for £80–100 per person, more with champagne.`;

const insiderTips = [
  "The Tea Lawn strawberry counter is busiest 1–3pm; go before noon or after 4pm for a shorter queue.",
  "The Walled Garden Food Market has shorter queues than the Tea Lawn with equivalent food quality — better for a proper sit-down meal.",
  "BYOB: one bottle of wine or champagne, or two beers per person, in soft containers only. No glass, no spirits — check the AELTC website for the current year's rules before packing.",
  "The Wingfield Restaurant on Centre Court Level 1 requires advance booking via wimbledon.com — reserve months out for peak days.",
  "The Cavendish near Court 1 (opened 2025) does breakfast through dinner with table service and is far less crowded than the Tea Lawn.",
  "The Larder meal deal (sandwich, snack, and drink) was £15.25 in 2025 — the best value sit-down option in the grounds.",
];

const whatToAvoid = `Don't bring glass containers — they're confiscated at the gate. Don't bring spirits or hard-sided cool boxes. Don't expect to walk up to the Wingfield: it requires a reservation and fills months out. Don't concentrate all food stops around the Tea Lawn at peak time — the Walled Garden and Conservatory Kitchen have equivalent quality with shorter waits. And don't exit the grounds expecting to return with outside food; re-entry isn't guaranteed once you've left.`;

const practicalInfo = {
  hours: "Food service from grounds opening (~10:30am) until shortly after last match; Tea Lawn closes earlier than enclosed venues",
  costRange: "Strawberries £2.70, Pimm's £12.25, sandwiches from £4.95, table-service mains £19–22, champagne £96/bottle. Budget day from £15 (BYOB + Larder); full experience £80–100pp.",
  bookingMethod: "Wingfield Restaurant only — advance booking via wimbledon.com. All other venues walk-in.",
  reservationsRequired: false,
  website: "https://www.wimbledon.com/en_GB/atoz/food_and_drink_faq.html",
};

const gettingThere = `Same entry as the AELTC grounds generally — District Line to Southfields (Zone 3) or Wimbledon station. Once inside: the Tea Lawn is visible from the main gate; the Walled Garden Food Market is toward the north of the grounds past Court 18; the Cavendish sits near Court 1 on the north side. The Wingfield Restaurant is on Level 1 of the Centre Court building, above the Tea Lawn.`;

// ─── 4. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Eating at Wimbledon",
      subtitle: "The full food picture inside the AELTC grounds — what's worth the price, where to eat well, and what you can bring in",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: LONDON_ID,
      sportingEventId: wimbledonEventId ?? null,
      neighborhood: "Wimbledon, SW19",
      address: "All England Lawn Tennis and Croquet Club, Church Road, Wimbledon, London SW19 5AE",
      heroImageUrl,
      heroImageAlt: "Wimbledon strawberries and cream served in the traditional pot at the All England Club, 2014",
      heroImageCredit: "Photo by Micolo J, CC BY 2.0",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Pricing from Wimbledon official food guide PDF (2025) and The Mirror food prices article (2025). Strawberries portion history from Popcorn Shed/Sport Bible. Venue list and descriptions from fmccatering.co.uk and Green & Purple food guide. BYOB policy from wimbledon.com FAQ. Cavendish opening year confirmed via official site. Verified April 2026.",
      moodTags: ["iconic", "social", "authentic"],
      interestCategories: ["food", "sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "GBP",
      budgetMinCost: "15",
      budgetMaxCost: "100",
      bestSeasons: ["jun", "jul"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-04-25",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
  console.log("\n→ Ready to review at: http://localhost:3000/curator/review");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

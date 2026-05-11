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
const slug = "wimbledon-cannizaro-house-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const imageKey = "experiences/hero/wimbledon-cannizaro-house.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/wimbledon-cannizaro-house.jpg");
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

const bodyContent = `Cannizaro House has been here longer than the Championships. The building dates to 1705 — a minor country estate on the edge of what's now Wimbledon Common, used variously as a private residence and an officers' convalescent home before becoming a hotel. Hotel du Vin took it over and added their format: wine-focused restaurant, boutique rooms, reliable service. The bones were already there.

The grounds are the main feature. Cannizaro Park covers 34 acres of formal and woodland garden adjacent to the Common. The hotel has access through the grounds, and guests use it. On a summer morning before Championships traffic arrives, it's quiet in a way that's unusual for London — rhododendrons, a walled section, mature trees, a park that looks like it hasn't changed much in a century.

The walk to the AELTC takes about 20 minutes. You leave the hotel, cross into the Common, walk through birch and oak past dog walkers and joggers, and arrive at the All England Club from the Common side — opposite the direction most crowds come from. It's the kind of commute that explains why people who could stay anywhere near SW19 choose this over somewhere technically closer.

The hotel has rooms in the main house and a converted stable block. Room quality is consistent: well-fitted, good beds, the Hotel du Vin wine-notes styling. The restaurant holds 2 AA Rosettes and has a serious wine list — a proper dinner, not hotel dining. The building is 1.2 miles from Wimbledon station, which takes about 25 minutes on foot or a short cab.

During the Championships, standard double rates typically start around £200–£280 per night, higher in Finals week. Minimum stays apply across the fortnight.`;

const whyItsSpecial = `There's a version of Wimbledon that's about the tennis, which you get from any seat in the grounds. There's another version that's about the particular quality of the place — SW19 in July, the Common, the village, the ritual of the whole fortnight — which most accommodation doesn't access.

Cannizaro House is unusually well-positioned for the second version. The 20-minute walk through Wimbledon Common isn't incidental: it's part of why you'd stay here. You walk through a park that looks like it belongs to the 18th century, arrive at the most famous tennis tournament in the world, watch several hours of tennis, then walk back through the same park in the evening. That's a specific experience that requires staying in a specific location.

The building also has something newer boutique hotels don't manufacture: actual age. The Georgian facade, the proportions of the public rooms, the library — these weren't designed for the purpose they now serve. They pre-date the Championships by two centuries. That shows in the way the building sits in its grounds, the scale of the main rooms, the ceiling heights.

You can stay in a more comfortable hotel in central London for the same money. You can stay in a more convenient hotel for less. Neither will have Wimbledon Common outside the window.`;

const insiderTips = [
  "The Cannizaro Park entrance from the hotel grounds gives a walking route to the AELTC across the Common — 20 minutes, and the right way to arrive on match day.",
  "Book the restaurant for dinner before or after your main match day — it fills during Championship weeks.",
  "Rates are significantly lower in the week before Wimbledon starts; worth considering if attending early-round play.",
  "The stable block rooms are quieter than main house rooms on busy Championship evenings.",
  "On-site parking is available — practical if arriving by car with luggage for a multi-night stay.",
];

const whatToAvoid = `Don't mistake the hotel's location for proximity to Wimbledon station — it's 1.2 miles, a 25-minute walk in the wrong direction from the AELTC. The Common walk gets you there in 20 minutes, but you need to know to take it. Don't book without checking minimum stay requirements — 2–3 nights is standard during peak weeks. Don't expect a pool or spa: Cannizaro House doesn't have one.`;

const practicalInfo = {
  hours: "Restaurant 12pm–3pm, 6pm–10pm; check-in from 3pm, check-out by noon",
  costRange: "£200–£280 per night standard double during Championships (from ~£154 off-season). Restaurant mains £22–£35.",
  bookingMethod: "Direct at hotelduvin.com/locations/wimbledon or major booking platforms. Book 4–6 months ahead for Championship dates.",
  reservationsRequired: true,
  website: "https://www.hotelduvin.com/locations/wimbledon/",
};

const gettingThere = `West Wimbledon tube station (District Line, Zone 4) is the nearest underground stop, a 12-minute walk through residential streets. Wimbledon station (Zone 3) is 1.2 miles — 25 minutes on foot or a short cab. From the hotel, the AELTC is a 20-minute walk across Wimbledon Common: exit onto the Common from the hotel grounds, follow the path toward Church Road and the AELTC main entrance. Hotel address: West Side Common, Wimbledon, London SW19 4UF.`;

// ─── 4. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Hotel du Vin Cannizaro House",
      subtitle: "A Georgian manor on Wimbledon Common — twenty minutes' walk across the park to the All England Club",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: LONDON_ID,
      sportingEventId: wimbledonEventId ?? null,
      neighborhood: "Wimbledon Village, SW19",
      address: "West Side Common, Wimbledon, London SW19 4UF",
      heroImageUrl,
      heroImageAlt: "The facade of Cannizaro House, a Georgian manor hotel set in 34 acres of Cannizaro Park adjacent to Wimbledon Common",
      heroImageCredit: "Photo by Lipatden, CC BY 3.0",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Building date (1705), park acreage (34 acres), and distance from Wimbledon station (1.2 miles) from hotelduvin.com and TripAdvisor listing. 2 AA Rosette restaurant from Hotel du Vin official site. Walk time to AELTC from Booking.com description ('20 minute walk across Wimbledon Common'). Championship pricing estimates from TripAdvisor ($154 base rate) and Booking.com. Verified April 2026.",
      moodTags: ["romantic", "iconic", "serene"],
      interestCategories: ["accommodation", "sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "GBP",
      budgetMinCost: "200",
      budgetMaxCost: "280",
      bestSeasons: ["jun", "jul"],
      advanceBookingRequired: true,
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

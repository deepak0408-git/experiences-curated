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
const slug = "wimbledon-rose-crown-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const imageKey = "experiences/hero/wimbledon-rose-crown.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/wimbledon-rose-crown.jpg");
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

const bodyContent = `Wimbledon Village sits on the hill above the town centre. It's quieter up here — residential, proper pubs, Georgian facades, a pace that doesn't feel like London. The Rose & Crown has been on this corner of the High Street since the 1650s. It now has 13 rooms above a pub that still functions as a local.

The walk to the AELTC takes about ten minutes. You leave the pub, head south on Church Road, and arrive at the main gates having passed through some of Wimbledon's nicest streets. During the Championships you'll share the walk with people who have done it for decades. That's a different arrival than a shuttle bus from Southfields.

The rooms are not large — Victorian pub building, the footprint is what it is — but they're well-fitted: Nespresso, decent bed, functional bathroom, an honesty basket with snacks. Breakfast is included and comes from the pub kitchen, not a continental trolley. Parking is free, which matters during the Championships when everything nearby charges event rates.

The pub itself is the main reason to stay here rather than anywhere else. During the fortnight it shows matches on multiple screens, but it's not a sports-bar setup. The real ales are kept well. The food is proper pub food. The regulars know each other and the bar staff by name.

Capacity is 13 rooms, which means it books out early. Standard advice is six months ahead; for peak dates — first Tuesday, Ladies' Final week, Men's Final weekend — earlier than that.

During the Championships, rates typically run £150–£200 per night. That's mid-range money for what's technically a budget property, but the location and the building command a premium, and there's nothing comparable at this distance from the grounds.`;

const whyItsSpecial = `Most accommodation near Wimbledon falls into one of two categories: generic chain hotels a tube stop away, or expensive boutique properties treating the Championships as a revenue fortnight. The Rose & Crown is neither.

It's a pub that has 13 rooms, on the street that leads to the grounds, in a village that's been here longer than the tournament. The guests during Championship weeks are a mix — tennis fans, London visitors, people who found it on a map and wondered if the reviews were real. They are.

The specific thing the Rose & Crown offers that nothing else does is the morning walk. You leave the pub on a summer morning in July, turn south on Church Road, and walk through Wimbledon Village — Georgian houses, dog walkers, someone's front garden full of strawberry plants — ten minutes to the All England Club. That walk is part of the experience. It's not a shuttle, not a tube, not a hotel lobby. You arrive having already seen a piece of how this part of London works.

There are cheaper options within reasonable distance. There are options with more amenities. None of them are in Wimbledon Village. None of them have a pub downstairs that's been on the same corner since the 1650s. Whether that matters depends on why you're coming to Wimbledon. For anyone who thinks the tournament is partly about the place, not just the tennis, it does.`;

const insiderTips = [
  "Book 6+ months ahead for Championship dates — 13 rooms disappears fast, and minimum stays of 2–3 nights are standard during peak weeks.",
  "The pub shows all Wimbledon matches on multiple screens — good for following courts you're not ticketed for while back at the hotel.",
  "Free parking on-site, included in the rate — uncommon in this area during the Championships.",
  "The walk to the AELTC is straightforward: south on Church Road from the pub, about 10 minutes. Ask at reception for landmarks the first time.",
  "Breakfast is cooked from the pub kitchen, not continental — worth actually eating before you leave for the grounds.",
];

const whatToAvoid = `Don't expect hotel-standard room sizes — this is a Victorian pub building, not a purpose-built hotel, and the rooms reflect that. Don't arrive without a booking assuming availability: 13 rooms, ten minutes from the All England Club, during Wimbledon. Don't book a single night expecting others to follow — minimum stays are standard across Championship weeks.`;

const practicalInfo = {
  hours: "Pub 11am–11pm; check-in from 3pm, check-out 11am",
  costRange: "£150–£200+ per night during the Championships (from ~£80 off-season). Breakfast included.",
  bookingMethod: "Direct at roseandcrownwimbledon.co.uk or major booking platforms. Book 6+ months ahead for Championship dates.",
  reservationsRequired: true,
  website: "https://www.roseandcrownwimbledon.co.uk/",
};

const gettingThere = `District Line to Wimbledon (Zone 3), then a 15-minute uphill walk through the town centre to the Village High Street. Bus 93 from Wimbledon station stops on the High Street — two stops. By car, free parking at the hotel. Walk to AELTC: south on Church Road, approximately 10 minutes.`;

// ─── 4. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Rose & Crown",
      subtitle: "A 17th-century pub hotel on Wimbledon Village High Street — ten minutes' walk from the All England Club",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: LONDON_ID,
      sportingEventId: wimbledonEventId ?? null,
      neighborhood: "Wimbledon Village, SW19",
      address: "55 High Street, Wimbledon Village, London SW19 5BA",
      heroImageUrl,
      heroImageAlt: "The Rose & Crown pub hotel on Wimbledon Village High Street, a 17th-century building with hanging flower baskets",
      heroImageCredit: "Photo by Dr Neil Clifton, CC BY-SA 2.0",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "13-room capacity, rating, and amenity details from Booking.com (rated 9.1) and TripAdvisor listing. Walk time to AELTC from Google Maps. Parking and breakfast details from roseandcrownwimbledon.co.uk. Championship pricing estimate from KAYAK (from $171/night). Pub founding date from TripAdvisor listing description. Verified April 2026.",
      moodTags: ["authentic", "social", "local"],
      interestCategories: ["accommodation", "sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "GBP",
      budgetMinCost: "150",
      budgetMaxCost: "200",
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

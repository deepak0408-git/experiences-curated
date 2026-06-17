import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEvents, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "263faaad-ceed-4355-acb7-9f2073cb1028";
const EVENT_SLUG = "open-championship-2026";
const EVENT_ID = "ccb585a6-3cdb-40ce-999e-a1d455854301";
const slug = "open-vincent-hotel-" + Date.now().toString(36);

// ─── 1. Resolve sporting event ────────────────────────────────────────────────

const [existing] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

const eventId = existing?.id ?? EVENT_ID;
console.log("✓ Sporting event ID:", eventId);

// ─── 2. Content ───────────────────────────────────────────────────────────────

const bodyContent = `The Vincent opened in 2008 on Lord Street — Southport's kilometre-long Victorian boulevard, glass canopies and proper architecture. It is the most design-forward hotel in town: 59 rooms, a penthouse with a private rooftop hot tub, and a spa.

Rooms run from standard doubles up through deluxe and superior rooms with Japanese-style drop baths, to the four Corner Studio Suites. The Corner Studios draw the highest guest ratings (9.8/10 on Booking.com) — city views, option to interconnect. The Penthouse occupies the sixth floor: hot tub, steam room, rainforest shower, views over the boulevard. It's suited to a specific occasion rather than a typical tournament stay, and priced accordingly. Rates on request.

The V Café & Restaurant is on the ground floor — British and European, known for handmade sushi, formerly 2 AA Rosettes. The quality is real, but the pricing is premium relative to portion size. There are 169 restaurants within walking distance on Lord Street if you want to distribute meals across the week. The bar is on the first floor.

Royal Birkdale is 2 miles away. Taxi is 5–6 minutes and costs £10–12. Line 47 bus from Eastbank Street (30 metres from the hotel) takes 13 minutes for £2–3. The hotel can arrange a shuttle after booking. Southport Railway Station is 100 yards from the front door — Merseyrail to Liverpool Central in 38 minutes.

Open Championship week compresses demand fast. Standard rates start at £103 per night out of season; expect a meaningful premium for 16–19 July 2026. Contact the hotel directly — they don't release event-week pricing publicly in advance. Valet parking at £20 per night removes one complication for drivers.`;

const whyItsSpecial = `Most accommodation options near Royal Birkdale weren't built for this. The Vincent was. Not for golf specifically, but to a standard that holds: proper spa, Japanese-style baths in the deluxe rooms, a working rooftop hot tub in the penthouse rather than a decorative one.

The Lord Street location is also worth something that doesn't show up in booking searches. This is a listed Victorian boulevard, and Southport Station is 90 seconds from the front door — Merseyrail puts Liverpool 38 minutes away if you want a non-golf evening. Proximity to the course is table stakes; that combination of rail access and a genuinely walkable town centre is rarer.

At 59 rooms, it doesn't fill with coach parties. The service stays consistent. For Open week, that's the quiet differentiator.`;

const insiderTips = [
  "Request a Corner Studio Suite on a higher floor — rated 9.8/10 on Booking.com and the elevation reduces noise from the Lord Street taxi rank.",
  "Line 47 bus from Eastbank Street (30 metres from the hotel) runs direct to Royal Birkdale in 13 minutes for £2–3 — useful on days when taxis are slow around the course.",
];

const whatToAvoid = `Lord Street-facing rooms on lower floors are noisy at night, particularly on weekends — reviews cite the taxi rank outside running until 6am. Request a rear-facing or higher-floor room when booking, not at check-in. And don't default to the V Café for every meal: it's good but expensive relative to portion size; Lord Street has 169 restaurants within walking distance at every price point.`;

const gettingThere = `Southport Railway Station is 100 yards from the hotel (Merseyrail Southport Line from Liverpool Central, 38 minutes). Line 47 bus from Eastbank Street (30m from hotel door) to Royal Birkdale: 13 minutes, £2–3. Taxi to course: 5–6 minutes, £10–12. By road: PR8 1JR — valet parking £20/night, available 07:00–23:00.`;

const practicalInfo = {
  hours: "Check-in 2:00 PM / Check-out 11:00 AM. 24-hour reception.",
  costRange: "From £103/night standard; Open Championship week on request. Penthouse priced on request. Valet parking £20/night.",
  bookingMethod: "Book directly at thevincenthotel.com or call 01704 883 800. For Open Championship week, contact the hotel as soon as tickets are confirmed — Penthouse and Corner Studios go first. Golf packages bundling accommodation with ticket management are available through Your Golf Travel (yourgolftravel.com/the-open), Golf Breaks (golfbreaks.com), and Perry Golf. For standard rooms, Booking.com has live availability but direct booking gives more flexibility on late checkout. Request a Corner Studio on a higher floor to reduce Lord Street street noise.",
  howToBook: null,
  website: "https://thevincenthotel.com/",
  reservationsRequired: true,
};

// ─── 3. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Vincent Hotel, Lord Street",
      subtitle: "Southport's sharpest boutique hotel — 59 rooms, a rooftop penthouse with a hot tub, 2 miles from the first tee.",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: eventId,
      neighborhood: "Lord Street, Southport",
      address: "98 Lord Street, Southport, PR8 1JR, England",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: thevincenthotel.com (official, Jun 2026), TripAdvisor (4.2/5, 1,728 reviews), GOV.UK Companies House (active Oct 2025), Booking.com (active listing), Rome2Rio (transport data), visitsouthport.com. Booking.com affiliate link to add once affiliate programme approved — hotel listed at booking.com/hotel/gb/the-vincent.html. Hero image outstanding — request press image from enquiries@thevincenthotel.com. Verified Jun 2026.",
      sport: ["golf"],
      moodTags: ["luxury", "local", "practical"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "GBP",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-06-17",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: eventId })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
  console.log("\n→ Experience at: http://localhost:3000/experience/" + result.slug);
  console.log("→ Review at:     http://localhost:3000/curator/review");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

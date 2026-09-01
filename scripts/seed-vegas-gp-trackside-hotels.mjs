import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f0388505-a1ca-4929-b14d-f33ae8075409";
const EVENT_ID = "cd5785a7-d37c-4d4b-a545-a8b8e28eac57";
const slug = "las-vegas-gp-trackside-hotels-" + Date.now().toString(36);

const bodyContent = `No other Grand Prix on the calendar lets you watch the race from your own hotel room. The Las Vegas Strip Circuit runs directly past a stretch of the Strip's biggest resorts, and three of them are the genuine trackside picks: close enough that a track-view room puts you level with the cars, not just "nearby."

Bellagio sits right on the circuit between Turns 13 and 14, the stretch where the track runs past its famous fountains. Fountain View King and Fountain View Two Queen rooms have real track sightlines, though a track view isn't guaranteed on every booking in that category — confirm the exact room before assuming you'll see cars from your window. Beyond the room itself, Bellagio's Fountain Club is F1's own luxury hospitality product here, a separate ticketed experience with front-row views of both the track and the fountains. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=9435823821871451524)

Aria sits right next to Turns 14 through 16, a genuinely different stretch of the lap than Bellagio's fountain straight, with its own track-facing rooms in that zone. It's the more modern of the three properties architecturally, and its location puts it closest to where the circuit bends back toward the Strip's center. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=3383197481682797935)

Paris Las Vegas offers Versailles Balcony Rooms in its Versailles Tower with genuine views over the Strip section near Turns 13-14, close to Bellagio's stretch of track. F1's own Club Paris hospitality package runs from this property too, with a trackside terrace, rooftop lounge, live entertainment, and food and drink included — a genuine alternative to Bellagio's Fountain Club at a different price point. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=4991312229159558145)

All three sell out their track-view room categories well ahead of race weekend, often months out, and command a real premium over a standard room in the same building during the same dates.`;

const whyItsSpecial = `Every other Grand Prix on the calendar treats your hotel and the racing as two separate things you travel between. Las Vegas collapses that distance entirely — book the right room at Bellagio, Aria, or Paris Las Vegas, and the balcony you're having coffee on is the same balcony you can watch qualifying from that night. That's not a marketing line, it's genuinely how these three properties are positioned relative to the circuit. I'd treat booking one of these track-view rooms as its own decision, separate from grandstand tickets entirely — for some travelers, a track-view room replaces the need for a ticket altogether, which says something about how directly the Strip circuit was built into the city it runs through.`;

const insiderTips = [
  "A track-view room category (Bellagio's Fountain View rooms, Paris's Versailles Balcony Rooms) doesn't always guarantee an actual track sightline within that category — confirm the specific room number or request written confirmation of a track view before paying the premium for it.",
  "Fountain Club (Bellagio) and Club Paris (Paris Las Vegas) are separate, ticketed hospitality products from the hotel room itself — booking a track-view room doesn't include access to either, and they need to be purchased independently through F1's own hospitality channels.",
];

const whatToAvoid = `Don't assume any room at these three hotels has a track view just because the property itself sits on the circuit — only specific room categories (Fountain View at Bellagio, Versailles Balcony at Paris) are positioned for it, and a standard room in the same tower can face entirely away from the track. Don't wait until close to race weekend to book if a track-view room matters to you — these specific room categories at all three properties have a documented history of selling out months ahead of the race, well before general Strip hotel demand typically peaks.`;

const practicalInfo = {
  hours: "Standard hotel check-in 3-4pm, check-out 11am-12pm at all three properties — confirm exact times with your specific booking",
  costRange: "Track-view rooms command a significant premium over standard rooms during race weekend at all three properties — pricing varies widely by exact dates and room category",
  bookingMethod: "Book directly through each hotel's own site (bellagio.com, aria.com, parislasvegas.com) or via Booking.com, and explicitly request or confirm track-view room categories rather than assuming a generic room booking includes one.",
  howToBook: "",
  website: "https://bellagio.mgmresorts.com, https://aria.mgmresorts.com, https://www.caesars.com/paris-las-vegas",
  reservationsRequired: true,
};

const gettingThere = "All three sit directly on the Strip between roughly Turns 13-16 of the circuit — Bellagio and Paris Las Vegas face each other across Las Vegas Boulevard near the fountains, Aria sits just south. Walking distance to East Harmon and Koval zone grandstand entrances from any of the three.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Staying Trackside — the Hotels the Circuit Runs Past",
      subtitle: "Bellagio, Aria, and Paris Las Vegas — where a hotel room can double as a grandstand seat",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "The Strip",
      address: "3600 S Las Vegas Blvd (Bellagio), 3730 S Las Vegas Blvd (Aria), 3655 S Las Vegas Blvd (Paris Las Vegas), Las Vegas, NV",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from gpdestinations.com and las-motorsport.com 'where to stay' guides (room categories, track-facing zones), f1lasvegasgp.com Fountain Club and Club Paris hospitality pages. Google ratings via Places API (New) direct lookup 29 Aug 2026: Bellagio Hotel & Casino 4.7/143,470 reviews, ARIA Resort & Casino 4.5/47,512 reviews, Paris Las Vegas 4.3/83,259 reviews — all high-volume, well-attested ratings. Multi-venue experience, see MULTI_VENUE_RATINGS registry entry (venueCount: 3).",
      sport: ["formula_one"],
      moodTags: ["premium"],
      interestCategories: ["accommodation"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "luxury",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-29",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓ Created:", result.title, "→", result.id, result.slug, result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

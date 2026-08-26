import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "55f26c1e-adb3-46ba-aaf7-997585ed25a5"; // Sydney
const EVENT_ID = "ff13692a-c1b3-415a-8264-42b3d8535afd";
const slug = "sydney-harbour-beaches-city-day-" + Date.now().toString(36);

const bodyContent = `The SCG sits in Moore Park, outside the harbour and beaches that define Sydney everywhere else in the world's imagination — so unlike the other three Test cities on this tour, Sydney's "city beyond the ground" isn't a short walk away, it's a genuinely separate half of the trip that needs its own day.

Circular Quay is the obvious starting point, and it earns that reputation: the Opera House and Harbour Bridge sit across the water from each other, with the Royal Botanic Garden and The Rocks' sandstone lanes filling the space between. The Opera House itself is worth more than a photo stop from the water — guided tours run regularly through its interior, and even without one, walking the sails' base up close changes how the building reads compared to every postcard shot of it. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=3545450935484072529&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

From Circular Quay, the ferry to Manly is the best-value thing Sydney sells — about 30 minutes each way on a standard Opal fare, gliding past the Opera House, the Harbour Bridge, Fort Denison, and the headlands of North Harbour for the price of a normal public transport trip, not a tourist-priced cruise. Manly itself has its own proper beach, distinct in character from the eastern suburbs' beaches, backed by a pedestrian mall of cafés and shops rather than a straight strip of sand. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=12213523315072464976&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

The other real anchor is the Bondi to Coogee Coastal Walk — a six-kilometre cliff-edge path taking two to three hours at an easy pace, passing five beaches in sequence: Bondi, Tamarama, Bronte, Clovelly, and Coogee. It's graded easy to moderate, genuinely doable in beach clothes and sandals rather than hiking gear, and it delivers a version of the Sydney coastline that a single beach visit doesn't — the cliffs, the ocean pools cut into the rock, the way the character of each beach shifts within a few hundred metres of the last. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=16364501489639823029&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Both the harbour side and the beaches side are full days on their own — trying to do the Opera House, Manly, and the full coastal walk in one go is a genuine overreach. If the Fourth Test window only gives you one rest day for Sydney beyond the ground, pick harbour or beaches rather than a rushed half-version of both.`;

const whyItsSpecial = `Every other city on this tour puts its cricket ground close enough to the centre that "beyond the stadium" barely needs its own day. Sydney is the exception, and that's not a downside, it's the reason this city rewards fans who build in real time for it. The harbour side gives you the version of Sydney that's been photographed a billion times and still holds up in person; the beaches side gives you something the postcards undersell entirely, a six-kilometre cliff walk that keeps changing character every few hundred metres. What ties both together is scale: this isn't a quick add-on to a match day, it's Sydney's actual argument for itself, delivered across two very different kinds of coastline within the same city limits.`;

const insiderTips = [
  "The Manly ferry runs on a standard Opal fare (roughly A$8.39 weekday adult) — no separate tourist cruise ticket needed, and it's genuinely the same boat and route locals use to commute.",
  "Start the Bondi to Coogee walk at Bondi, not Coogee — the path is slightly better signposted in that direction and Bondi has far better transport links to start from, making the logistics easier even though the walk itself works either way.",
];

const whatToAvoid = "Don't attempt the full Opera House-to-Manly-to-coastal-walk combination in a single day — each is genuinely a half-day or more on its own, and rushing all three turns a good day into an exhausting one with nothing properly enjoyed. Don't do the Bondi to Coogee walk at the hottest part of a January afternoon without water and sun protection — there's very little shade along most of the cliff-top sections, and Sydney's January heat combined with sea-level humidity is more draining than the distance alone suggests.";

const practicalInfo = {
  hours: "Sydney Opera House: exterior/precinct always accessible; guided tours run at set times through the day, check sydneyoperahouse.com. Manly ferry: runs roughly every 30 minutes from Circular Quay, check current timetable. Bondi to Coogee walk: always accessible, best attempted in daylight.",
  costRange: "Manly ferry roughly A$8.39 each way (Opal/contactless); Opera House guided tour roughly A$45-55/adult if booked; Bondi to Coogee walk free",
  bookingMethod: "No booking needed for the ferry or the coastal walk — both are walk-up. Opera House guided tours can be booked ahead at sydneyoperahouse.com for a specific time slot.",
  howToBook: "",
  website: "https://www.sydneyoperahouse.com, https://www.sydney.com/things-to-do/nature-and-parks/walks/bondi-to-coogee-coastal-walk",
  reservationsRequired: false,
};

const gettingThere = "Circular Quay is served directly by train, bus, and ferry, a short walk from the CBD. Manly ferries depart from Wharf 3, Circular Quay, roughly every 30 minutes. Bondi Beach (start of the coastal walk) is reachable by bus from Bondi Junction station, itself on the Eastern Suburbs train line.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "A Day in Sydney — Harbour, Beaches & Beyond the SCG",
      subtitle: "The Opera House up close, the Manly ferry, and a five-beach cliff walk to Coogee",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Circular Quay / Eastern Suburbs",
      address: null,
      heroImageUrl: null,
      heroImageAlt: null,
      heroImageCredit: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Scope note: focuses on harbour/Opera House and beaches/coastal walk (things to do/see) — deliberately excludes restaurant/dining recommendations to avoid overlap with experience #22 (city-by-city dining guide, not yet written), and deliberately distinct from experience #18 (Blue Mountains, the outward day trip). Sources: sydney.com/things-to-do (Bondi to Coogee walk distance/time/beaches, Manly ferry fare/route), oranatravel.com and citybyday.com (Circular Quay/Opera House/Rocks framing), curiousgoosetravel.com and jourvida.com (3-day itinerary cross-check for what belongs in a single city day vs a longer stay), alltrails.com and sydneyexpert.com (Bondi to Coogee difficulty grading). Google Places API lookups: Sydney Opera House (4.8/92,191), Manly Beach (4.7/3,674), Bondi to Coogee Walk (4.8/3,458), all captured 16 Aug 2026 — real, well-attested ratings. Multi-venue experience — no single googleMapsRating on this row, live per-venue rating links written inline in bodyContent per skill §2c.",
      googleMapsRating: null,
      googleMapsReviewCount: null,
      googleMapsUrl: null,
      sport: ["cricket"],
      moodTags: ["scenic", "active", "coastal"],
      interestCategories: ["nature", "sightseeing", "adventure"],
      pace: "active",
      physicalIntensity: 3,
      budgetTier: "budget",
      budgetCurrency: "USD",
      bestSeasons: ["jan"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-16",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID, packRank: 20 })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
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

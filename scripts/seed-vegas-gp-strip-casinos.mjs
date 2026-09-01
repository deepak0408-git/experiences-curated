import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f0388505-a1ca-4929-b14d-f33ae8075409";
const EVENT_ID = "cd5785a7-d37c-4d4b-a545-a8b8e28eac57";
const slug = "las-vegas-gp-strip-casinos-" + Date.now().toString(36);

const bodyContent = `The circuit runs directly past three of the Strip's biggest casino resorts, and all three are free to walk into and worth the detour beyond watching a session or picking a hotel — this is about what's actually worth seeing inside them, separate from race weekend entirely.

Bellagio's casino floor sits behind the fountains everyone photographs from outside, but its own conservatory — a seasonally-rotating botanical garden built fresh several times a year — is free, changes completely with the seasons, and is genuinely worth a few minutes even for someone who never gambles. In November, expect a fall or early-winter display; check what's currently installed before visiting since the exact theme changes on its own schedule. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=9435823821871451524)

The Venetian recreates Venice's canals indoors and out, and its Grand Canal gondola rides are the single most distinctive thing to do here — an indoor ride departing from the Grand Canal Shoppes (Sun-Thu 10am-11pm, Fri-Sat 10am-midnight) or an outdoor ride facing the Strip (daily 10am-11pm), both genuinely worth doing once. Walking around costs nothing, and the property's Streetmosphere program — singers, stilt walkers, and living statues recreating a street scene from real Venice — runs through the Grand Canal Shoppes for free. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=11652001351180211013)

Caesars Palace built its identity around Roman-empire theming at genuine scale, and the Forum Shops — roughly 160 specialty stores ranging from high-end jewelry to everyday apparel — are worth walking through even without buying anything, purely for the architecture and scale of the mall itself. Where the Venetian wins on unique atmosphere, Caesars wins on sheer variety of what's inside. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=8631651105269301239)

None of this requires a hotel stay or a casino bet — all three are open to anyone walking in off the Strip.`;

const whyItsSpecial = `A Grand Prix weekend in Las Vegas puts you inside three of the most recognizable buildings on the planet, and it would be a genuine waste to walk past all three purely en route to a grandstand without stopping. Bellagio's conservatory, the Venetian's canals, and Caesars' Forum Shops each represent a completely different version of what a casino resort can be built around — nature, recreation, and retail spectacle, respectively — and seeing all three in the same trip says more about what Las Vegas actually is than any single one on its own. I'd build in one unhurried hour, split across two or three of these, specifically because they're free and because most race visitors never make time for them at all.`;

const insiderTips = [
  "Bellagio's conservatory display changes on its own seasonal schedule, not tied to race dates — check what's currently installed before visiting, since a November trip could catch either a fall display or an early transition into winter/holiday theming depending on exact timing.",
  "The Venetian's indoor gondola ride runs later on weekends (until midnight Fri-Sat versus 11pm Sun-Thu) — if your schedule only allows a late-evening visit after a race session, confirm which day's hours apply before heading over.",
];

const whatToAvoid = `Don't assume walking through any of these three casino floors themselves is the main draw — the genuinely worthwhile free attractions (Bellagio's conservatory, the Venetian's canals and Streetmosphere, Caesars' Forum Shops architecture) sit adjacent to the gaming floors, not on them, so don't skip a visit assuming it's only interesting to people who gamble. Don't try to fit all three into one evening around a race session — each genuinely rewards 20-30 unhurried minutes, and rushing through all three back to back on a tight schedule undercuts what makes any one of them worth the stop.`;

const practicalInfo = {
  hours: "All three casino floors and free attractions open 24/7 (standard Strip hours); Venetian gondola rides Sun-Thu 10am-11pm, Fri-Sat 10am-midnight (indoor), daily 10am-11pm (outdoor)",
  costRange: "Free to walk through all three; Venetian gondola rides separately ticketed, roughly US$29-119 depending on ride type and group size",
  bookingMethod: "No booking needed to walk through any of the three. Venetian gondola tickets bookable via venetianlasvegas.com or on-site at the ticket booth.",
  howToBook: "",
  website: "https://bellagio.mgmresorts.com/en/amenities/conservatory-botanical-garden.html, https://www.venetianlasvegas.com/resort/attractions/gondola-rides.html, https://www.simon.com/mall/the-forum-shops-at-caesars-palace",
  reservationsRequired: false,
};

const gettingThere = "All three sit directly on the Strip along the circuit's Turns 12-16 stretch — Bellagio and Caesars Palace face each other across Las Vegas Boulevard, the Venetian sits further north near the Sphere. Walking distance between all three.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Strip's Casinos — What's Actually Worth Seeing",
      subtitle: "Bellagio's conservatory, the Venetian's canals, Caesars' Forum Shops — all free to walk into",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "The Strip",
      address: "3600 S Las Vegas Blvd (Bellagio), 3355 S Las Vegas Blvd (The Venetian), 3570 S Las Vegas Blvd (Caesars Palace), Las Vegas, NV",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from venetianlasvegas.com official gondola/attractions pages, visitlasvegas.com gondola guide, en.wikipedia.org Forum Shops overview, feelingvegas.com Caesars-vs-Venetian comparison. Google ratings via Places API (New) direct lookup 29 Aug 2026: The Venetian Las Vegas 4.6/121,788 reviews, Caesars Palace 4.5/137,895 reviews; Bellagio rating (4.7/143,470) reused from same-session lookup for the trackside hotels experience. All exceptionally well-attested. Multi-venue experience, see MULTI_VENUE_RATINGS registry entry (venueCount: 3).",
      sport: ["formula_one"],
      moodTags: ["iconic", "free"],
      interestCategories: ["sightseeing"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: false,
      availability: "perennial",
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

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne
const EVENT_ID = "ff13692a-c1b3-415a-8264-42b3d8535afd";
const slug = "melbourne-laneways-coffee-city-day-" + Date.now().toString(36);

const bodyContent = `The MCG sells itself. What doesn't automatically make it onto a Boxing Day Test itinerary is the fact that Melbourne's actual identity, the thing locals will argue about for an hour if you let them, is built into a grid of service alleys most visitors walk straight past.

Melbourne's laneways started as exactly that: back alleys behind the main Victorian-era streets, built for deliveries and rubbish carts, not people. That changed in the 1990s when CBD rents pushed café operators into the cheap, narrow, unglamorous spaces nobody else wanted, and the espresso culture that grew out of those first laneway cafés is the direct reason Melbourne, not Sydney, calls itself Australia's coffee capital. Degraves Street, dating back to the 1850s and named after two of the city's early settlers, is where that transformation is most visible today — a genuinely pedestrian lane lined with alfresco tables, still doing the job it started doing thirty years ago rather than a rebuilt tourist version of it.

Patricia Coffee Brewers, tucked into a laneway off Little Bourke Street, is worth naming specifically rather than just pointing at "the laneways" in general — a standing-room-only espresso bar that rotates guest roasters through its own house blends, regularly cited among the best flat whites in the city, and a genuine example of what the laneway café model looks like when it's done exceptionally rather than just adequately. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=14702440401848209537&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

The other laneway story is street art, and it has its own real route: Hosier Lane, the laneway most credited with establishing Melbourne's street art reputation in the first place, then AC/DC Lane (named for the band, with a mural of Bon Scott and Malcolm Young), Centre Place, Croft Alley, and Union Lane. Artists work these walls constantly and pieces last weeks rather than years, so what you see on a Boxing Day walk-through won't be there for the Fourth Test in Sydney, let alone next year's tour. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=12188597685268332047&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Queen Victoria Market, a short walk from the CBD's laneway cluster, is the other anchor for a city day — a working market since the 1870s, not a preserved relic, with fresh produce, a deli hall, and the Night Market running Wednesday evenings in summer. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=1082084875369108560&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

A loop that works on a rest day: coffee at Patricia or along Degraves Street mid-morning, the street art walk (Hosier → AC/DC Lane → Centre Place → Croft Alley → Union Lane, about 90 minutes at an easy pace), Queen Victoria Market for lunch, then back toward the CBD before the evening.`;

const whyItsSpecial = `The Boxing Day Test is the single most famous fixture on this whole tour, and it would be easy to let the MCG absorb the entire Melbourne leg. That would miss the actual argument for visiting this city specifically: Melbourne's identity isn't really about any one landmark, it's about a network of alleys that turned into the country's best coffee scene and one of its most current street art scenes, both because of the same accident of cheap rent in narrow spaces thirty-odd years ago. A visitor who only sees the 'G' sees a great cricket ground in a city that happens to surround it. A visitor who spends a few hours in the laneways sees why Melburnians talk about their city the way they do — proprietary, a little competitive with Sydney, genuinely proud of something that isn't a stadium.`;

const insiderTips = [
  "Street art in Hosier Lane and its connected laneways turns over constantly — a mural you photograph on Boxing Day may already be gone by New Year's, so don't wait to take the photo if something specific catches your eye.",
  "Patricia Coffee Brewers is standing-room only with no seating inside — factor that in if you're after a sit-down coffee rather than a quick, excellent one to walk with.",
];

const whatToAvoid = "Don't treat Degraves Street as the only laneway worth seeing — it's the most famous and the most crowded, especially mid-morning, and several quieter laneways one block over (Centre Place, Block Place) offer the same café culture with noticeably shorter queues. Don't plan this walk for a Monday if Queen Victoria Market is part of your day — the market's main trading days are Tuesday, Thursday, Friday, Saturday and Sunday, and it's closed Monday and Wednesday (Wednesday evening in summer is the separate Night Market, not the day market).";

const practicalInfo = {
  hours: "Laneway cafés generally open early morning through mid-afternoon, some later for bars. Queen Victoria Market: Tue/Thu/Fri/Sat/Sun daytime (closed Mon/Wed daytime; Wed evening Night Market runs in summer only) — check current days before visiting.",
  costRange: "Coffee roughly A$4.50-6; market produce and lunch stalls vary widely, budget A$15-25 for a casual lunch",
  bookingMethod: "No booking needed — laneways, street art, and the market are all free to walk through; cafés are walk-in.",
  howToBook: "",
  website: "https://whatson.melbourne.vic.gov.au/things-to-do/street-art, https://qvm.com.au",
  reservationsRequired: false,
};

const gettingThere = "The laneway cluster (Degraves Street, Hosier Lane, Centre Place) sits in the CBD, walkable from Flinders Street or Southern Cross stations. Queen Victoria Market is a 10-15 minute walk north of the laneways, or a short tram ride up Elizabeth Street.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "A Day in Melbourne — Laneways, Coffee & Beyond the 'G'",
      subtitle: "Why Melbourne calls itself the coffee capital, and where the street art actually is",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Melbourne CBD",
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
      editorialNote: "Scope note: focuses on laneway coffee culture (curator-directed emphasis), street art, and market — deliberately excludes restaurant/dining recommendations to avoid overlap with experience #22 (city-by-city dining guide, not yet written). Sources: alphacarhire.com.au, citybyday.com, en.wikipedia.org/Degraves_Street (laneway history, 1990s café migration, Degraves Street 1850s origin), onlymelbourne.com.au and streetartcities.com (Hosier Lane → AC/DC Lane → Centre Place → Croft Alley → Union Lane self-guided route, ~90min), broadsheet.com.au and doubleskinnymacchiato.com (Patricia Coffee Brewers standing-room format, reputation), qvm.com.au (Queen Victoria Market trading days). Google Places API lookups: Patricia Coffee Brewers (4.8/4,399), Hosier Lane (4.2/944), Queen Victoria Market (4.5/60,345), all captured 16 Aug 2026 — real, well-attested ratings. Degraves Street itself returned no rating (a street, not a rateable venue) — expected, not a gap. Multi-venue experience — no single googleMapsRating on this row, live per-venue rating links written inline in bodyContent per skill §2c.",
      googleMapsRating: null,
      googleMapsReviewCount: null,
      googleMapsUrl: null,
      sport: ["cricket"],
      moodTags: ["urban", "coffee", "culture"],
      interestCategories: ["food_drink", "art_culture", "sightseeing"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "budget",
      budgetCurrency: "USD",
      bestSeasons: ["dec"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-16",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID, packRank: 19 })
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

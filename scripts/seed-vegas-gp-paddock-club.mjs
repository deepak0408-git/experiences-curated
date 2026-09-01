import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f0388505-a1ca-4929-b14d-f33ae8075409";
const EVENT_ID = "cd5785a7-d37c-4d4b-a545-a8b8e28eac57";
const slug = "las-vegas-gp-paddock-club-" + Date.now().toString(36);

const bodyContent = `Paddock Club is Las Vegas's real top hospitality tier, and it earns that position with a location no grandstand ticket can match: covered seating on an outdoor balcony in the center of Grand Prix Plaza, directly above the F1 Team Garages. You're not watching the pits from across the track, you're looking down into them.

A 3-day pass starts around $9,500 per person. Single-day pricing runs from roughly $1,636 for Thursday practice to about $8,722 for Saturday's race day alone, which tells you most of the value here is weighted toward race day itself rather than spread evenly across the weekend. What's included at every tier: an open bar running champagne, sparkling wine, spirits, beer, and fine wines, expertly crafted menus running throughout the day rather than a single scheduled meal, and a one-time guided tour of the restricted F1 Paddock led by an Expert Host — a genuine behind-the-scenes look at the area only hospitality guests and credentialed team staff can access.

Above standard Paddock Club sits House 44, a Lewis Hamilton-branded hospitality collaboration starting around $13,500 for 3 days — a distinct, higher tier within the same Paddock Club structure rather than a separate product, aimed at guests who want the Paddock Club location and access with a more curated, branded experience layered on top.

This is genuinely different from a grandstand ticket in kind, not just in price. A grandstand buys you a seat and a view; Paddock Club buys you a full day of hospitality, food, drink, and access built around watching the sport from inside its own infrastructure.`;

const whyItsSpecial = `What makes Paddock Club worth its price isn't the food and the open bar, even though both are genuinely well done — it's the paddock tour. Walking through the restricted area where the actual teams work, led by someone who can explain what you're looking at, is an access point no amount of grandstand money buys. Add House 44's Lewis Hamilton-branded tier sitting above the standard package, and Las Vegas has a real, multi-layered hospitality structure most Grands Prix don't offer at this depth. I'd point a Pro subscriber planning a genuine splurge trip toward this over any grandstand, purely because the garage-level view and the paddock access turn a race into something closer to a full day inside the sport rather than a day watching it from outside.`;

const insiderTips = [
  "House 44's Lewis Hamilton-branded tier sits above standard Paddock Club at roughly $4,000 more per 3-day pass — worth deciding early whether the branded, more curated version is worth the premium over standard Paddock Club's already-full open bar and paddock tour.",
  "Single-day race pricing (around $8,722) is nearly the entire 3-day pass price on its own — if budget is a real constraint, a single Saturday race-day ticket captures most of the value most guests actually come for, rather than committing to the full weekend.",
];

const whatToAvoid = `Don't assume every Paddock Club tier includes the same paddock tour and access level — House 44 and standard Paddock Club are genuinely different products within the same hospitality structure, and conflating them when comparing prices will misread what you're actually paying for. Don't leave booking to the last minute assuming hospitality inventory behaves like grandstand seating — premium hospitality packages at past Las Vegas races have sold out well ahead of race weekend, and a late decision can mean the difference between standard Paddock Club and no hospitality access at all.`;

const practicalInfo = {
  hours: "Practice Thu 19 Nov, Qualifying Fri 20 Nov, Race Sat 21 Nov 2026 — all sessions run evening into night, Pacific time; Paddock Club access runs throughout each race day",
  costRange: "3-day Paddock Club from US$9,500 per person; House 44 (Lewis Hamilton collaboration) 3-day from US$13,500; single-day Saturday race from US$8,722 (2026 pricing)",
  bookingMethod: "Book via f1lasvegasgp.com's Paddock Club Suites page or lasvegas.gp's official ticketing.",
  howToBook: "If you want the paddock tour and garage-level view without the House 44 branding premium, standard Paddock Club gets you the same open bar, menus, and one-time guided paddock tour for around $4,000 less per 3-day pass than House 44 — book directly through F1 Experiences (f1experiences.com/2026-las-vegas-grand-prix) rather than a reseller, since hospitality packages here have historically sold out ahead of race weekend and F1 Experiences is F1's own official hospitality partner. If House 44's Lewis Hamilton branding and more curated format genuinely matter to you, book that specific package early — it's priced and marketed as a distinct, higher tier, not an add-on you can upgrade into later.",
  website: "https://www.f1lasvegasgp.com/tickets/hospitality/paddock-club-suites/, https://f1experiences.com/2026-las-vegas-grand-prix/house-44-at-f1-paddock-club",
  reservationsRequired: true,
};

const gettingThere = "Grand Prix Plaza, center of the circuit off Las Vegas Boulevard. Dedicated hospitality entrances separate Paddock Club guests from general admission and grandstand lines — check your confirmation for the specific entrance assigned to your package.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "F1 Paddock Club — Las Vegas's top hospitality tier",
      subtitle: "Garage-level views, a restricted paddock tour, and an open bar running all day",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Grand Prix Plaza",
      address: "Paddock Club, Grand Prix Plaza, Las Vegas Strip Circuit, Las Vegas, NV",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from f1lasvegasgp.com official Paddock Club Suites page, paddockintel.com 2026 pricing analysis, and f1experiences.com House 44 package page. Verified 29 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["premium", "high-energy"],
      interestCategories: ["sport"],
      pace: "moderate",
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

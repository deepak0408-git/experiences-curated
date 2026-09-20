import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne
const EVENT_ID = "64792f75-c009-4070-a12b-23d7bd0a3a7f"; // Australian GP 2027
const slug = "f1-paddock-club-trackside-hospitality-" + Date.now().toString(36);

const bodyContent = `F1 Paddock Club sits directly above the pit lane at Albert Park, overlooking the start/finish straight — the most complete way to experience an Australian Grand Prix weekend, sold across the full race weekend rather than a single day. It includes a guided pit lane walk to see the cars and mechanics up close, all-day grazing menus and a formal buffet lunch built around seasonal Australian produce, free-flowing champagne and wine, and a rooftop tiered viewing deck looking out over the Walker Straight and the city skyline behind it. Superscreens and internal TV feeds run continuously through the suite so nothing is missed between trackside moments. Champions Club sits just below it on the Main Straight, trading the pit lane walk for a still-premium trackside seat with open bar and full catering at a meaningfully lower price.

Below that top tier, Albert Park itself — not a third-party hospitality reseller — runs its own roster of eight race-day suites, sold as single-day Sunday passes rather than a full-weekend package. Lakeside Studio is an intimate, indoor gourmet-dining retreat overlooking Albert Park Lake at the Carousel section, from A$1,735. The Apex is an undercover, beer-garden-style suite a short walk from Gate 10, with a centralised bar and views over the Turn 12 battle for the final corners, from A$2,020. Race Cube is a modern three-level suite on the infield at Turn 11, with a panoramic lower deck and a rooftop bar looking out over the Melbourne skyline, from A$2,520. Slipstream is a 530-square-metre suite right at Turn 10, at the end of the circuit's fastest straight, from A$3,845. T8 Lakeside sits on the infield at Turn 8, an open-fronted, three-level building with a rooftop viewing balcony over both the lake and the fast Turn 8-9 sweeper, also from A$3,845. The Albert is a Main Straight suite built around race-day atmosphere right at the start of the lap, from A$4,405. The American Express Lounge is a three-level venue beside the Paddock entrance with views over Melbourne Walk and driver arrivals, and dining from Grill Americano and the Ritz-Carlton Bar, from A$5,495. And Red Bull Racing's own suite sits above the team garages, with a pit lane walk and driver appearances built into the day, from A$5,655.

What separates these tiers isn't just price — it's what's actually included and how long you're buying. Paddock Club and Champions Club are multi-day, pit-lane-adjacent packages built around access; the eight AGPC suites can be purchased as 3-day or single-day passes built around a good trackside seat with catering and open bar, no pit lane walk attached. Knowing which of those two very different products you actually want — a full weekend of top-tier access, or one really good race day — is the real decision here, not just picking the biggest number you can afford.

Every hospitality tier at Albert Park sells out in advance, some considerably ahead of the April race weekend given Melbourne's status as a season-opener with strong local corporate demand. The AGPC's own suites are the more accessible entry point into hospitality at Albert Park — Lakeside Studio and The Apex both sit well under half the price of the cheapest multi-day Champions Club option.`;

const whyItsSpecial = `Most Grands Prix offer a hospitality suite or two. Albert Park offers a genuine ladder — Paddock Club and Champions Club as full-weekend, pit-lane-adjacent packages, and then eight of its own single-day Sunday suites underneath, each with a real trade-off between position, price, and what's actually included. That depth, especially the single-day roster sold directly by the circuit itself, is unusual and means hospitality here isn't an all-or-nothing, full-weekend-only decision the way it is at some circuits.

The real value in F1 Paddock Club itself isn't the champagne — every tier pours well — it's the pit lane walk and the vantage point directly above the pits, both genuinely unique to that top tier and to Champions Club's proximity to it. For a fan who's never stood in an F1 pit lane before a session, that access can justify the gap over the AGPC's own suites. For everyone else — especially anyone only attending Sunday — the eight race-day suites deliver real trackside hospitality at a fraction of the multi-day price, which is worth being honest about before assuming the top tier is automatically the right call.`;

const insiderTips = [
  "Confirm exactly what's bundled before booking — the pit lane walk is exclusive to Paddock Club and isn't included in Champions Club or any of the eight AGPC race-day suites, so don't assume it's part of a 'premium' hospitality booking without checking.",
  "If you're only attending Sunday, the AGPC's own suites are worth comparing against Paddock Club and Champions Club before defaulting to the multi-day option — Lakeside Studio and The Apex both come in well under a quarter of Champions Club's 2026 three-day price for a genuine trackside hospitality seat on race day itself.",
];

const whatToAvoid = "Don't assume the most expensive tier is automatically the right pick — if what you actually want is a great trackside seat with open bar and premium catering on race day rather than the pit lane walk itself, one of the AGPC's own Sunday suites delivers that for a fraction of Champions Club or full Paddock Club. And don't leave a hospitality booking to the weeks before the race — Melbourne's season-opener status and strong local corporate demand mean suites at every tier sell through faster than at many other Grands Prix on the calendar.";

const practicalInfo = {
  hours: "Hospitality suites typically open ahead of first practice each day, 2–4 Apr 2027, and run through the close of racing.",
  costRange: "Eight AGPC race-day suites, confirmed 2027 Sunday pricing: Lakeside Studio (indoor lakeside dining, Carousel) from A$1,735; The Apex (beer-garden atmosphere, Turn 12 views) from A$2,020; Race Cube (modern rooftop suite, Turn 11) from A$2,520; Slipstream (Turn 10, end of the fastest straight) and T8 Lakeside (rooftop balcony, Turn 8) both from A$3,845; The Albert (Main Straight) from A$4,405; American Express Lounge (Paddock-entrance dining) from A$5,495; Red Bull Racing (team suite, pit lane walk) from A$5,655. F1 Paddock Club and Champions Club are separate, multi-day packages sold across the full weekend, not single-day: Paddock Club ran A$8,500–11,250 and Champions Club around A$9,200 for three days in 2026 — 2027 figures for these two not yet published.",
  bookingMethod: "Compare tiers and book through an authorised F1 hospitality F1 Experiences' own official Paddock Club channel or grandprix.com.au/en/tickets - all sell Albert Park hospitality.",
  howToBook: "For the AGPC's own eight Sunday suites, book directly at grandprix.com.au/en/tickets (filter to Hospitality, Sunday) — these sell as single-day passes and don't require a hospitality reseller. If Paddock Club's pit lane walk and rooftop deck, or Champions Club's multi-day trackside access, are what you're after, go through F1 Experiences' official Paddock Club channel or an authorised F1 hospitality reseller instead. Melbourne sells through its hospitality allocation faster than most rounds because it's the season opener with strong local corporate demand, so booking well ahead of April is worth it across every tier.",
  website: "https://www.grandprix.com.au/en/tickets?type=hospitality&day=Sunday, https://ticketing.formula1.com/hospitality/",
  reservationsRequired: true,
};

const gettingThere = "Albert Park is a 5-10 minute walk from Melbourne's tram network (routes 1, 3, 5, 6, 16, 64, 67, 72 serve the precinct) — a free AGPC shuttle also runs from the city on event days. Hospitality suite entry gates are separate from grandstand and Park Pass gates; your ticket confirmation will specify the correct entrance.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "F1 Paddock Club & Trackside Hospitality",
      subtitle: "A$1,735 Sunday suites through to multi-day Paddock Club and Champions Club — Albert Park's hospitality ladder.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Albert Park Grand Prix Circuit",
      address: "Albert Park Grand Prix Circuit, 12 Aughtie Dr, Albert Park VIC 3206, Australia",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "UPDATED 20 Sep 2026 — replaces prior version, which mixed up which suites are single-day vs multi-day and used stale/incorrect pricing. Confirmed 2027 Sunday (race-day) pricing for the eight AGPC-run suites sourced directly from grandprix.com.au/en/tickets?type=hospitality&day=Sunday (founder-supplied screenshot, verified 20 Sep 2026). Suite descriptions: grandprix.com.au/shop/products/t8-lakeside (T8 Lakeside — Turn 8 infield, rooftop balcony), search summaries of grandprix.com.au/shop/products/the-apex and f1experiences.com (The Apex — Turn 12, beer-garden style), Koobit/viptablesmarbella listings (Lakeside Studio — Carousel, indoor gourmet dining), spacecube.com project page + manofmany.com (Slipstream — Turn 10, 530sqm), search summary referencing Race Cube's own product page (Turn 11 infield, rooftop bar), f1-australia.com ticket-info pages (The Albert — Main Straight), grandprix.com.au news release + mediaweek.com.au (American Express Lounge — beside Paddock entrance, Grill Americano/Ritz-Carlton dining), experiences.redbullracing.com + f1experiences.com (Red Bull Racing — team suite, pit lane walk). Paddock Club (A$8,500-11,250) and Champions Club (approx. A$9,200) are 2026 three-day reference figures, founder-supplied — 2027 figures for these two not yet published, flagged as such. AUD kept as real local pricing, not converted to USD, per currency-migration rule.",
      sport: ["formula_one"],
      moodTags: ["premium", "immersive"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "luxury",
      budgetCurrency: "AUD",
      bestSeasons: ["apr"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-20",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created:", result.title, "|", result.id, "|", result.slug, "|", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

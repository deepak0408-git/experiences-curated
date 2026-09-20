import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne
const EVENT_ID = "64792f75-c009-4070-a12b-23d7bd0a3a7f"; // Australian GP 2027
const slug = "melbourne-april-weather-what-to-pack-" + Date.now().toString(36);

const bodyContent = `The Australian Grand Prix runs the first weekend of April, which puts it right at the start of Melbourne's autumn — genuinely one of the more comfortable stretches of the local calendar, and part of why the race sits here rather than in the city's harsher summer or winter months. Daytime highs typically sit around 20°C, overnight lows around 12°C, with only about three to four rainy days across the entire month and roughly 51-63mm of rain total. Compared to January's Australian Open (regularly into the mid-30s°C) or a Melbourne winter, an April grand prix weekend is genuinely mild.

Mild doesn't mean predictable, though, and Melbourne earned its "four seasons in one day" reputation honestly. Morning fog is common early in autumn and usually burns off into a clear, sunny day, but the same afternoon can bring a sharp wind change or a short, sudden shower with very little warning. A day at Albert Park that starts at 12°C under fog and finishes at 22°C in full sun, with a 20-minute squall somewhere in the middle, is a completely normal April Saturday, not a weather anomaly.

That variability is really the whole planning problem. A single-weight outfit — even a good one — will be wrong for part of most days at this circuit. Layers work better than any one "right" jacket: a t-shirt or light top as the base, a packable rain layer for the chance of a shower, and something warmer for the evening sessions and the walk home, when temperatures can drop into single digits well before the last shuttle leaves. Grandstand seating with cover (Fangio and Piastri's upper AA-NN rows, for instance) removes some of this planning burden; uncovered rows and most of the Park Pass general admission spots don't.

Sun protection still matters even on a mild day — Melbourne's UV index in early April remains significant during midday hours, and a full day trackside with no shade is enough to burn skin that hasn't been protected, regardless of the air temperature feeling comfortable.`;

const whyItsSpecial = `Most Grand Prix host cities pick a date around their most reliable weather. Melbourne picked early April specifically because it sits in the gap between summer's extremes and winter's cold — genuinely one of the more thoughtful scheduling decisions on the F1 calendar, and it shows in how comfortable most race weekends actually are compared to some other rounds.

What makes this worth writing up rather than assuming is that "comfortable on average" and "predictable on any given day" are different claims, and Melbourne's weather reputation is built on the gap between them. A visitor who packs for the average forecast and ignores the real chance of a fog-to-sun-to-shower day within a single session is the person caught out — not because the city's weather is bad, but because it's genuinely variable in a way a lot of first-time visitors don't expect from what looks, on paper, like a mild autumn city.`;

const insiderTips = [
  "Pack a compact, packable rain layer even if the multi-day forecast looks clear — Melbourne's short, sudden afternoon showers often aren't visible on a standard 5-day forecast until the day itself.",
  "If choosing between a covered and uncovered grandstand section at a similar price, the covered option removes a real variable at Albert Park in a way it might not at a more climate-stable circuit — worth the trade-off if the price difference is small.",
];

const whatToAvoid = "Don't assume April's mild average temperatures mean you can skip sun protection — Melbourne's UV index stays meaningful through early autumn, and a full day trackside with no shade can still burn skin even when the air feels comfortable. And don't dress for the temperature at gates-open time and stop there — the gap between a foggy 12°C morning and a sunny 22°C early afternoon, then back down for an evening session, is common enough that a single-layer outfit will be wrong for part of most days.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Melbourne in April — Weather & What to Pack",
      subtitle: "Autumn's mildest stretch, and why 'four seasons in one day' is still the honest forecast for race weekend.",
      slug,
      experienceType: "activity",
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
      editorialNote: "Sources: australia.com/en/facts-and-planning/weather-in-australia/melbourne-weather.html and virginaustralia.com Melbourne climate guide (April averages: 20°C high/12°C low, 51-63mm rain over 3-4 days), holiday-weather.com and weather-atlas.com April averages (cross-checked), general knowledge of Melbourne's 'four seasons in one day' reputation, widely and consistently reported across sources. Verified 20 Sep 2026.",
      sport: ["formula_one"],
      moodTags: ["practical"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: false,
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

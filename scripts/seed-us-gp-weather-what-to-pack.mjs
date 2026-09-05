import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEvents, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "6c920919-1d28-420a-a711-2a58fc8ba9e1"; // Austin
const EVENT_SLUG = "united-states-grand-prix";
const slug = "us-gp-weather-what-to-pack-" + Date.now().toString(36);

const [existingEvent] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

if (!existingEvent) {
  throw new Error(`Sporting event not found for slug ${EVENT_SLUG}`);
}
const eventId = existingEvent.id;

const bodyContent = `Late October in Austin sits at an awkward point in the calendar — genuinely autumn by most of the country's standards, but Texas doesn't fully get the memo. Average highs for the month run from the mid-80s°F early on down to around 77°F by late October, with lows dipping to the high 50s-low 60s°F overnight. That's the average. The actual F1 weekends have run hotter: 2023's race weekend broke a daily heat record with a forecast high of 98°F on the Friday, three degrees above the previous record set in 2019, and 2024's weekend still ran low-to-mid-80s throughout. Neither of the past two race weekends has been what most visitors picture when they hear "October."

Rain is the other real variable. Austin can see anywhere from about 1.4 to 5.9 inches of rain across the whole month in a typical year, and 2023's forecast specifically flagged a 30-50% chance of rain and thunderstorms in the days around race weekend, even though the race itself ended up sunny both years running. The pattern worth planning around: mornings often start clear, afternoons can turn cloudy or bring a scattered shower, and it can shift quickly enough that a forecast checked the night before isn't a guarantee for race day itself.

What that means practically: dress for heat first, rain second. Lightweight, breathable clothing, a hat, and real sun protection matter more than anything resembling a jacket for most of the weekend — you're on your feet outdoors for hours at a stretch, often with limited shade depending on which grandstand you're in (Trackside sections at Turn 1 and Turn 15 are fully uncovered, for instance). A compact rain poncho is worth having in a bag rather than left at the hotel, given how quickly Texas weather can turn, but it's a contingency, not the main event. Evenings do cool down meaningfully once the sun's gone, so something light for after dark — especially if you're staying for the Super Stage concerts — is worth packing alongside the daytime heat gear.`;

const whyItsSpecial = `This isn't really a destination or an activity — it's the single planning decision most likely to affect how much you actually enjoy a full day at COTA. A visitor who arrives dressed for a mild autumn afternoon and hits a genuine 95°F day with zero shade in their grandstand section is going to have a rough time regardless of how good the racing is. Austin's weather in October isn't dangerous or extreme by Texas summer standards, but it's consistently hotter than the season and the location suggest to a first-time visitor, and the gap between expectation and reality is exactly where preventable discomfort comes from. Getting this right is boring, unglamorous preparation — and it's also the difference between a great race weekend and one spent uncomfortably distracted by the heat.`;

const insiderTips = [
  "Check which grandstand tier you've booked and whether it's covered before deciding how much sun protection to pack — Club Level at the Main Grandstand is the only fully covered tier at COTA; every trackside and general admission area is fully exposed all day.",
  "Pack a compact rain poncho even if the forecast looks clear when you check it — Texas weather can shift from a sunny morning to an afternoon shower quickly enough that a forecast checked the night before isn't reliable for race day itself.",
];

const whatToAvoid = `Don't assume "late October" means mild weather just because that's true where you're traveling from — 2023's race weekend hit a record 98°F, and both of the last two race weekends ran hotter than the season's own average, not cooler. Don't leave sun protection as an afterthought because you're "only there for a few hours" — a full day at COTA typically means being outdoors from mid-morning gates opening through late-afternoon sessions, genuinely hours of continuous sun exposure in an uncovered stand.`;

const practicalInfo = {
  website: "https://www.austin.gp/en/f1-usa",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Weather & What to Pack — a Hot, Unpredictable October",
      subtitle: "2023 hit a record 98°F on race weekend — plan for real heat, not a mild autumn afternoon",
      slug,
      experienceType: "activity",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: eventId,
      neighborhood: "Circuit of the Americas",
      address: "9201 Circuit of the Americas Blvd, Austin, TX 78617",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      editorialNote:
        "Sources: statesman.com (Austin American-Statesman, confirmed 2023 race weekend forecast high of 98°F citing National Weather Service Camp Mabry — real, dated, primary-adjacent fact, not a vague seasonal generalization), weatherspark.com (October average highs/lows, precipitation range), kvue.com + scuderiafans.com (2024 weekend forecast, low-to-mid 80s, dry). No Concierge trigger, no affiliate opportunity — planning guidance, correctly public and free. Google Places rating reused from Circuit of the Americas' own venue listing. Verified 5 Sep 2026.",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 17782,
      googleMapsUrl: "https://maps.google.com/?cid=10009294002508390637&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
      sport: ["formula_one"],
      moodTags: ["practical", "planning"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["oct"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-05",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db
    .insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: eventId })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

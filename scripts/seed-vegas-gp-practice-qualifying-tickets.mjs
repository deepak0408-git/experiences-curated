import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f0388505-a1ca-4929-b14d-f33ae8075409";
const EVENT_ID = "cd5785a7-d37c-4d4b-a545-a8b8e28eac57";
const slug = "las-vegas-gp-practice-qualifying-tickets-" + Date.now().toString(36);

const bodyContent = `Race day gets all the attention, and the price tag reflects it: for 2026, Saturday's Grand Prix single-day ticket starts at $393, roughly 8 times Thursday practice's $50 starting price and about 4 times Friday qualifying's $99. That gap is worth pausing on before defaulting straight to a race-day-only trip.

Thursday brings two one-hour free practice sessions, FP1 and FP2, where teams are genuinely working through setup changes rather than pushing for outright pace — less spectacle, but a real, unfiltered look at how a Formula 1 weekend actually functions, without the ceremony built around race day. Friday's qualifying is where the real intensity starts: it's a genuine competitive session determining Saturday's grid, run at night under the same lights and atmosphere as the race itself, for a quarter of the price.

There's a practical crowd-management angle too. The Strip's official F1 merchandise stores get genuinely packed on Saturday, and buying team gear on Thursday or Friday morning instead means not hauling shopping bags through race-night crowds later. That same logic extends to grandstand and general admission zones — Thursday and Friday sessions draw noticeably fewer people than Saturday's peak crowd, based on both ticket pricing signals and general fan reporting, which means shorter lines, easier movement between zones, and a more relaxed way to learn the layout of wherever you're planning to watch race day from.

None of this replaces actually being there for the race if that's the goal — but a Thursday or Friday single-day ticket, paired with watching Saturday's race from a bar, a hotel viewing party, or simply the Strip itself, is a real, underused way to be part of official race weekend at a fraction of race day's cost.`;

const whyItsSpecial = `Most first-time visitors assume the only real ticket is a race-day ticket, and that assumption is exactly what keeps this specific move underrated. Qualifying, at a quarter of race day's price, delivers genuine competitive intensity under the same night lights as the race — it's not a lesser experience, it's a different, cheaper way into the same atmosphere. I'd tell a budget-conscious first-timer to seriously consider a Friday qualifying ticket over stretching for race day, especially paired with one of the free or low-cost ways to watch Saturday's race elsewhere in the city — you get real on-track access to the weekend's genuine tension without race day's premium.`;

const insiderTips = [
  "Buy official F1 merchandise on Thursday or Friday rather than Saturday — Strip merchandise stores get significantly more crowded on race day, and shopping earlier avoids carrying bags through peak race-night foot traffic.",
  "If budget forces a choice between Thursday practice and Friday qualifying alone, qualifying is the stronger single-day pick — it's a genuine competitive session under full race-weekend atmosphere, not a setup-focused practice run, for roughly double practice's price but a fraction of race day's.",
];

const whatToAvoid = `Don't assume Thursday practice delivers race-day-level intensity just because it's the same circuit and the same cars — teams are genuinely working through setup during FP1 and FP2, and expecting wheel-to-wheel drama on a practice-only ticket will leave you disappointed if that's specifically what you came for. Don't wait until Saturday to buy team merchandise if avoiding crowds matters to you — the same stores that are manageable Thursday and Friday become genuinely difficult to navigate once race-day crowds peak.`;

const practicalInfo = {
  hours: "Thursday 19 Nov: FP1 & FP2, evening. Friday 20 Nov: FP3 & Qualifying, evening into night. Saturday 21 Nov: Race, night. All times Pacific",
  costRange: "Thursday practice single-day from US$50; Friday qualifying single-day from US$99; Saturday race single-day from US$393 (2026 pricing, General Admission tier)",
  bookingMethod: "Book via f1lasvegasgp.com or tickets.formula1.com — single-day tickets for each session sold separately from 3-day passes.",
  howToBook: "",
  website: "https://www.f1lasvegasgp.com/tickets/, https://sports.yahoo.com/articles/f1-las-vegas-grand-prix-220314672.html",
  reservationsRequired: true,
};

const gettingThere = "Applies circuit-wide — ticket tier and zone determine specific entrance, same access rules as any grandstand or general admission ticket regardless of which day it covers.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Practice & Qualifying — the Underrated Cheap-Ticket Move",
      subtitle: "Qualifying's night atmosphere for a quarter of race day's price, and lighter crowds all around",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Las Vegas Strip",
      address: "Las Vegas Strip Circuit, Las Vegas, NV",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from 8newsnow.com/sports.yahoo.com 2026 single-day pricing breakdown and reviewjournal.com fan/crowd reporting (merchandise store crowding pattern). Verified 29 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["value", "high-energy"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "budget",
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

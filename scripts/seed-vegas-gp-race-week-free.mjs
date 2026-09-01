import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f0388505-a1ca-4929-b14d-f33ae8075409";
const EVENT_ID = "cd5785a7-d37c-4d4b-a545-a8b8e28eac57";
const slug = "las-vegas-gp-race-week-free-" + Date.now().toString(36);

const bodyContent = `Race weekend isn't the only part of the Las Vegas Grand Prix worth showing up for without a ticket. F1 runs a genuinely free daytime Fan Experience along Las Vegas Boulevard, historically staged across Wynn Las Vegas, open 10am-6pm, first-come first-served, with F1 and F1 Academy team appearances, live entertainment, food trucks, and interactive activations like a pit stop simulator challenge. In past years this has run on the days immediately following the race itself, so it's worth checking the current year's exact dates rather than assuming it lines up with race weekend proper.

Team activations spread across the city throughout race week, not just at the circuit. The Williams Racing Fan Zone at New York-New York has featured real F1 cars on display, simulators, and driver appearances including Carlos Sainz and team principal James Vowles in past years. MoneyGram Haas F1 Team has run a display at The Cosmopolitan with official race cars, memorabilia, and meet-and-greets with their drivers, historically spanning nearly the full race week. Resorts World has hosted Garage 28, a vintage car, art, and memorabilia showcase tied to driver Romain Grosjean, and Downtown Summerlin has run free family-friendly play zones built around racing themes.

None of this requires a circuit ticket. Team fan zones, driver Q&As, and the Boulevard's daytime Fan Experience are open to anyone in the city that week, and they're a genuinely different way to experience the Grand Prix than watching from a grandstand — closer to the drivers, the cars, and the paddock culture than most ticketed seating gets you, just without the actual racing.

Exact dates, locations, and participating teams shift year to year, so checking F1's official Las Vegas Grand Prix site and the individual team's own social channels in the weeks before your trip is the reliable way to build a real schedule rather than relying on a previous year's exact lineup.`;

const whyItsSpecial = `A lot of what makes Las Vegas GP week distinct from other Grands Prix isn't happening on track at all — it's spread across hotel lobbies and outdoor plazas up and down the Strip, free, and largely unticketed. I'd tell anyone building a budget-conscious trip that skipping this entire layer of the week to save money on a ticket misses half of what makes this specific race weekend unusual. Standing close enough to touch an actual F1 car at a team fan zone, or catching a driver Q&A without paying for hospitality, is a genuinely different kind of access than any grandstand offers — it's just not the racing itself.`;

const insiderTips = [
  "Team fan zone dates and driver appearance schedules are typically announced only a few weeks before race week — follow F1 Las Vegas GP's official channels and the specific teams you care about directly rather than relying on a general guide, since lineups and dates change year to year.",
  "The Boulevard's free daytime Fan Experience issues tickets first-come, first-served starting at a set time — arriving right when ticket release opens gives a real edge over showing up later in the day and finding capacity already reached.",
];

const whatToAvoid = `Don't assume a previous year's exact dates, locations, or team lineup will repeat identically — team fan zones and the Boulevard Fan Experience have moved venues and shifted dates between past race years, so treat any specific date found in an older article as a starting point to verify, not a confirmed fact for this year. Don't expect free team activations to include unlimited access to drivers — appearances are typically scheduled, time-limited windows rather than an open meet-and-greet all day, and missing the specific slot can mean missing the driver entirely even if you're at the right venue.`;

const practicalInfo = {
  hours: "Varies by activation — historically the Boulevard Fan Experience runs 10am-6pm; team fan zones and driver appearances run scheduled windows across race week, confirmed closer to the date",
  costRange: "Free",
  bookingMethod: "No purchase needed. Check f1lasvegasgp.com and individual team social channels in the weeks before race week for confirmed dates, locations, and any first-come ticket release times.",
  howToBook: "",
  website: "https://www.f1lasvegasgp.com",
  reservationsRequired: false,
};

const gettingThere = "Spread across the Strip — historically Las Vegas Boulevard near Wynn (Fan Experience), New York-New York (Williams), The Cosmopolitan (Haas), Resorts World (Garage 28), Downtown Summerlin (family zones). Confirm current-year locations before planning a route between venues.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Race Week on the Strip — Free Parties and Activations",
      subtitle: "Team fan zones, driver Q&As, and a free Boulevard fan event — no circuit ticket required",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Las Vegas Strip",
      address: "Various locations, Las Vegas Strip, Las Vegas, NV",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from reviewjournal.com and formula1.com official Fan Experience coverage, visitlasvegas.com '22 things to do' guide, ktnv.com free/low-cost events roundup. Note: exact Fan Experience dates found in research (Nov 22-23) reflect a prior race year and fall after this event's confirmed 19-21 Nov 2026 window — written honestly as a historical pattern rather than asserted as confirmed 2026 dates, since F1 has not published 2026-specific Fan Experience dates as of this writing. Verified 29 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["social", "free"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: false,
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

// Seed: "Osaka in a Day — Sights, Food, and the Real Commute Cost" —
// experience #16/20 for Japanese Grand Prix 2027 (Suzuka).
//
// Sources (verified 21 Sep 2026):
// - gltjp.com, rome2rio.com, hyperlocalnagoya.com (Nagoya-Osaka Shinkansen
//   ~50min / Kintetsu HINOTORI ~2h10min route detail)
// - tripadvisor.com Osaka Forum, rome2rio.com, suzukacircuit.jp/eng/access_s/
//   (direct Suzuka-to-Osaka Kintetsu route: ~2h20min one-way via Tsu/Shiroko,
//   no direct train — confirmed genuinely slower than Nagoya-Osaka alone)

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9a26a4f4-2d3b-4e68-9bc3-ce2b55bb15e9";
const EVENT_ID = "9fe13c2e-37d1-49f0-8a48-d3ea40186fe4";
const slug = "japanese-gp-osaka-day-trip";

const bodyContent = `Osaka comes up in almost every Suzuka planning guide, and it's worth being honest about what that actually means before building a day around it: this is a real day trip from your Nagoya base, not a second base for the weekend. The commute is genuinely longer than most guides let on, and knowing the real numbers changes how you'd plan the day.

There's no direct train from Suzuka Circuit to Osaka. The most common route runs Kintetsu Limited Express from Osaka-Namba via Tsu to Suzuka Circuit Ino Station, taking around two hours and twenty minutes one way. From Nagoya specifically — your actual base for race weekend — the Shinkansen to Osaka runs closer to fifty minutes, considerably faster, with the Kintetsu HINOTORI limited express as a slower but cheaper alternative at around two hours ten minutes. Either way, treat a Nagoya-based Osaka day trip as a genuine four-to-five-hour round trip once you include both legs, not a quick hop — this is why Osaka works as a day trip from Nagoya, and doesn't work as a second base you'd commute from to the circuit itself.

Once you're there, Osaka rewards the trip. Dotonbori is the obvious start — the canal-side entertainment district with its illuminated signage and a genuine street food culture built around takoyaki and okonomiyaki, both Osaka specialties worth trying here specifically rather than settling for a version elsewhere in Japan. Osaka Castle is the other major anchor, a genuinely striking reconstructed castle set in a large park, worth an hour or two if castles interest you at all.

For food beyond the Dotonbori street stalls, Osaka's reputation as Japan's kitchen is earned — the city takes casual, unpretentious food seriously in a way that's distinct from Tokyo's more formal dining culture, and a day spent eating your way through a few different spots is a legitimate way to experience the city, not a lesser alternative to sightseeing.

If your time is genuinely limited, Dotonbori alone — walked slowly, with real time for the food — gives a strong sense of Osaka in a few hours. Add Osaka Castle only if you have the better part of a full day to spend, given the real travel time already spent getting there and back.`;

const whyItsSpecial = `Osaka gets recommended constantly in Suzuka planning content, but rarely with an honest account of how long it actually takes to get there and back from where you're actually staying. Once that's clear, Osaka becomes what it actually is — a genuinely worthwhile day trip if you build the travel time into your plan honestly, not a second base you can commute to the circuit from, and not a casual half-day add-on either.

Treated the right way, one full day gets you Dotonbori's food and energy and, if time allows, Osaka Castle — a real taste of one of Japan's most distinctive cities, worth the real travel cost when it's planned for rather than underestimated.`;

const insiderTips = [
  "Take the Shinkansen from Nagoya to Osaka (around 50 minutes) rather than the Kintetsu HINOTORI (around 2 hours 10 minutes) if a day trip is genuinely all the time you have — the time saved matters more than the fare difference on a single-day round trip.",
  "Eat your way through Dotonbori's street stalls rather than sitting down at one restaurant — takoyaki and okonomiyaki are built for exactly this kind of grazing, and it's the most efficient way to sample Osaka's food culture in a limited window.",
];

const whatToAvoid = `Don't treat Osaka as a viable second base for commuting to the circuit — there's no direct train from Osaka to Suzuka, and the real one-way journey runs over two hours via Tsu, making a daily circuit commute from Osaka a genuinely bad plan compared to staying in Nagoya. Don't try to fit both Dotonbori and Osaka Castle into a rushed half-day — given the real round-trip travel time from Nagoya, cramming both in leaves too little actual time in either, and picking one properly beats rushing both.`;

const practicalInfo = {
  hours: "Dotonbori: open throughout the day and evening, best experienced after dark for the lit signage; Osaka Castle grounds: typically 9am-5pm",
  costRange: "Shinkansen from Nagoya: ¥5,000-7,500 one way; Kintetsu HINOTORI: ¥4,540-5,240 one way; food and sightseeing budget-to-moderate for the day",
  bookingMethod: "No advance booking required for either Dotonbori or Osaka Castle. Shinkansen tickets can be bought same-day at Nagoya Station.",
  website: "https://www.osakacastle.net/",
};

const gettingThere = "From Nagoya: Shinkansen to Shin-Osaka (~50 min) or Kintetsu HINOTORI limited express (~2h10min). Direct from Suzuka Circuit: Kintetsu Limited Express via Tsu, roughly 2h20min one way, no direct train available — Nagoya is the more practical departure point for an Osaka day trip.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Osaka in a Day — Sights, Food, and the Real Commute",
      subtitle: "A genuine day trip from Nagoya, honestly timed — not a second base for race weekend.",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Osaka",
      address: "Dotonbori, Chuo-ku, Osaka, Japan",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sources: gltjp.com, rome2rio.com, hyperlocalnagoya.com (Nagoya-Osaka route detail, verified 21 Sep 2026); tripadvisor.com Osaka Forum, suzukacircuit.jp access page (direct Suzuka-Osaka Kintetsu route, confirmed no direct train, ~2h20min via Tsu). Founder-directed reframe from 'secondary base' to honest day-trip framing with real commute cost stated explicitly.",
      sport: ["formula_one"],
      moodTags: ["day-trip", "food", "culture"],
      interestCategories: ["food", "culture"],
      pace: "active",
      physicalIntensity: 3,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-21",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db
    .insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓ Experience created:", result.title, "|", result.id, "|", result.slug, "|", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

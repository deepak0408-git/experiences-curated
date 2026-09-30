// Seed: "Nagoya in a Day — the City Before or After Race Weekend" —
// experience #13/20 for Japanese Grand Prix 2027 (Suzuka). Satisfies
// CLAUDE.md's day-trip rule (Nagoya is ~1hr from Suzuka).
//
// Sources (verified 21 Sep 2026):
// - agoda.com "10 Must-Do Things in Nagoya", travel2next.com Nagoya
//   itinerary, japanesefestival.net 3-Day Nagoya Itinerary — all gathered
//   earlier this session (Nagoya Castle, Osu, Kinshachi Yokocho detail)

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9a26a4f4-2d3b-4e68-9bc3-ce2b55bb15e9";
const EVENT_ID = "9fe13c2e-37d1-49f0-8a48-d3ea40186fe4";
const slug = "japanese-gp-nagoya-day-trip";

const bodyContent = `Most Suzuka visitors already pass through Nagoya without ever really seeing it — it's the base for the race, not the destination. That's worth correcting with one full day, either before the circuit takes over your schedule or after the race, while you're still in the region anyway.

Nagoya Castle is the obvious anchor, and it earns the visit. The main keep is a postwar reconstruction, but the Honmaru Palace within the castle grounds is the real draw — a genuinely faithful reconstruction of the original Edo-period structure, with gold-leaf paintings and interior detail rebuilt to match historical records rather than a generic castle-museum treatment. Budget a couple of hours here if the palace interior interests you, less if you're mainly there for the grounds and the photo.

From the castle, Kinshachi Yokocho sits right at the entrance — a food street built specifically around Nagoya's own dishes, not a generic tourist food court. It's the easiest single stop for trying the city's signature food in one place, and a natural lunch stop straight off a castle visit.

Osu is the other essential stop, and it's a genuinely different kind of neighbourhood from the castle grounds — a dense, slightly chaotic shopping street mixing electronics, vintage clothing, temples, and street food, closer to Tokyo's Akihabara in energy than anything else in Nagoya. Osu Kannon, the Buddhist temple the area is named for, sits right in the middle of it, worth a stop even if temples aren't usually your priority — the contrast between the temple grounds and the shopping street around it is part of what makes Osu interesting.

If you have time beyond the castle and Osu, Sakae is Nagoya's modern commercial core — a place to end the day with dinner and a look at the city's contemporary side after a day spent mostly in its historical and food-focused areas.

One realistic day covers the castle, Kinshachi Yokocho, and Osu comfortably, with Sakae as an evening add-on if you're not racing back for an early Suzuka start the next morning.`;

const whyItsSpecial = `Nagoya gets treated as a transit hub by most Suzuka visitors, and that's a real missed opportunity — it's a genuine city with its own castle, its own food identity, and a neighbourhood in Osu that doesn't resemble anywhere else on a typical Japan itinerary.

Building one full day around Nagoya itself, rather than treating it purely as where you sleep before the circuit, turns a logistics stopover into an actual part of the trip.`;

const insiderTips = [
  "Visit Kinshachi Yokocho right after Nagoya Castle, not as a separate outing — it sits at the castle's entrance, and going straight from the grounds to lunch there is the natural order most locals follow.",
  "If you only have half a day rather than a full one, prioritize Osu over the castle interior — Osu Kannon plus the surrounding shopping street gives a more immediately distinctive sense of Nagoya than the castle's reconstructed keep does.",
];

const whatToAvoid = `Don't budget only an hour for Nagoya Castle if the Honmaru Palace interests you — the reconstructed interior is detailed enough to genuinely reward a longer visit, and rushing it undercuts the reason to go. Don't assume Osu is just another shopping street to skip if you're not interested in electronics or fashion — Osu Kannon and the temple grounds within the district are worth the stop on their own, independent of the shopping around them.`;

const practicalInfo = {
  hours: "Nagoya Castle: typically 9am-4:30pm (Honmaru Palace closes earlier); Osu Kannon and the surrounding street: open throughout the day",
  costRange: "Nagoya Castle entry: budget-friendly, under ¥1,000; Osu and Kinshachi Yokocho: free to explore, food/shopping priced individually",
  bookingMethod: "No advance booking required for the castle, Kinshachi Yokocho, or Osu — all walk-in.",
  website: "https://www.nagoyajo.city.nagoya.jp/en/",
};

const gettingThere = "Nagoya Castle and Osu are both accessible via Nagoya's subway network from Nagoya Station — Nagoya Castle via the Meijo Line to Shiyakusho Station, Osu via the Tsurumai or Meijo Line to Osu Kannon Station. Both roughly 15-20 minutes from Nagoya Station.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Nagoya in a Day — the City Before or After the Race",
      subtitle: "Nagoya Castle, Osu's street chaos, and the food street most visitors walk straight past.",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Nagoya",
      address: "Nagoya Castle, 1-1 Honmaru, Naka-ku, Nagoya, Aichi 460-0031, Japan",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sources: agoda.com '10 Must-Do Things in Nagoya', travel2next.com Nagoya itinerary, japanesefestival.net 3-Day Nagoya Itinerary (all gathered earlier this session, verified 21 Sep 2026).",
      sport: ["formula_one"],
      moodTags: ["day-trip", "culture", "food"],
      interestCategories: ["culture", "food"],
      pace: "active",
      physicalIntensity: 3,
      budgetTier: "budget",
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

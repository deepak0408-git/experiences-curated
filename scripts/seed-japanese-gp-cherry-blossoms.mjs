// Seed: "Cherry Blossoms in Early April — What You'll Actually See" —
// experience #18/20 for Japanese Grand Prix 2027 (Suzuka).
//
// Sources (verified 21 Sep 2026):
// - jrailpass.com, livejapan.com, triptojapan.com cherry blossom forecast
//   pages (2026 confirmed peak bloom dates: Nagoya ~28 Mar, Kyoto/Osaka
//   ~31 Mar; typical central-Honshu window ~29 Mar-7 Apr)
// Honest framing: 2027 race weekend (9-11 Apr) sits at/just past this
// typical window — no guaranteed-bloom claim, per skill §2a-3.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9a26a4f4-2d3b-4e68-9bc3-ce2b55bb15e9";
const EVENT_ID = "9fe13c2e-37d1-49f0-8a48-d3ea40186fe4";
const slug = "japanese-gp-cherry-blossoms";

const bodyContent = `A Japanese Grand Prix in early April naturally raises the question of cherry blossoms, and the honest answer is more nuanced than most travel content lets on: it's genuinely possible, but not guaranteed, and worth understanding the real timing before building expectations around it.

Peak bloom — mankai, when the trees look their absolute best — typically lasts only five to seven days, and can be shortened further by wind, rain, or a sudden temperature swing. Based on 2026's confirmed dates, Nagoya reached full bloom around 28 March, with Kyoto and Osaka following around 31 March. The broader window most forecasters point to for central Honshu — Tokyo, Kyoto, Osaka, Nagoya, and the surrounding region — runs roughly 29 March to 7 April in a typical year.

Suzuka's 2027 race weekend runs 9-11 April. That places it right at the tail end of, or just past, the typical peak-bloom window based on recent years' patterns — not squarely inside it. Some years run later than average and would put the race weekend in genuinely excellent bloom; other years run on the early side, and by race weekend the peak would already have passed in Nagoya and Osaka specifically, with only later-blooming spots or higher-elevation locations still holding good color. Bloom timing depends on the specific winter and early-spring weather that year, which isn't predictable this far out — treat any early forecast for April 2027 specifically as unreliable until closer to the date.

If you do get bloom, or catch the tail end of it, Nagoya has real options close to your base: Yamazaki River and Tsuruma Park are both well-known local spots. In Kyoto, the Philosopher's Path and Maruyama Park are the classic choices if you extend your trip that far. In Osaka, Osaka Castle Park's grounds are a genuine cherry blossom destination in their own right, worth combining with an Osaka day trip if timing cooperates.

The realistic plan: treat cherry blossoms as a genuine possible bonus of an early April trip, not a guaranteed feature of it. Check a closer-to-date forecast once you're within a few weeks of travel, and build a loose, checkable viewing stop into your Nagoya or Osaka day rather than planning an entire day around blossoms that may or may not still be there by the time you arrive.`;

const whyItsSpecial = `Most travel content built around "cherry blossoms plus a spring trip" either promises guaranteed bloom or ignores the timing question entirely. Neither is honest. The real forecast data shows Suzuka's 2027 race weekend sitting right at the edge of a typical bloom window — genuinely possible, genuinely not guaranteed, and worth knowing that distinction before you build a whole day around it.

Setting the right expectation here means a bonus if the timing works out, rather than disappointment if it doesn't — the difference between an honest trip-planning fact and an oversold promise.`;

const insiderTips = [
  "Check a real short-range forecast (not a seasonal average) once you're within two to three weeks of your trip — bloom timing shifts year to year based on that specific winter and early spring, and an early general forecast for April 2027 isn't reliable this far out.",
  "If Nagoya and Osaka's bloom has already passed by race weekend, don't assume it's over everywhere — later-blooming spots and higher-elevation locations sometimes hold color longer, so a local check on arrival can still turn up something worth seeing.",
];

const whatToAvoid = `Don't plan a dedicated cherry-blossom day around the race weekend assuming peak bloom will definitely be there — based on recent years' typical timing, race weekend sits at or just past the usual peak window, and building a whole day around a guarantee that doesn't exist risks real disappointment. Don't trust an early, long-range cherry blossom forecast for 2027 published months ahead — these forecasts get genuinely more accurate only a few weeks out, and an early prediction is closer to a rough seasonal guess than a real forecast.`;

const practicalInfo = {
  hours: "Viewing is unrestricted at public parks and riversides — no set hours",
  costRange: "Free at most viewing spots (Yamazaki River, Tsuruma Park, Osaka Castle Park grounds); some formal garden viewing spots may charge modest entry",
  bookingMethod: "No booking required — check a short-range bloom forecast within a few weeks of travel and plan a flexible viewing stop.",
  website: "https://www.jma.go.jp/",
};

const gettingThere = "Tsuruma Park and Yamazaki River are both accessible via Nagoya's subway network from Nagoya Station. Osaka Castle Park is reachable via the same route as an Osaka day trip.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Cherry Blossoms in Early April — What to Expect",
      subtitle: "Race weekend sits right at the edge of peak bloom — genuinely possible, not guaranteed.",
      slug,
      experienceType: "natural_wonder",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Nagoya",
      address: "Tsuruma Park, Showa-ku, Nagoya, Aichi, Japan",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sources: jrailpass.com, livejapan.com, triptojapan.com cherry blossom forecast pages (2026 confirmed peak bloom dates and typical central-Honshu window, verified 21 Sep 2026). Honestly framed per skill §2a-3 — no guaranteed-bloom claim made for an unpredictable future date.",
      sport: ["formula_one"],
      moodTags: ["seasonal", "nature"],
      interestCategories: ["nature"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: false,
      availability: "event_only",
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

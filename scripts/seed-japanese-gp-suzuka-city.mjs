// Seed: "Suzuka City — What's Actually Around the Track" — experience
// #19/20 for Japanese Grand Prix 2027 (Suzuka).
//
// Sources (verified 21 Sep 2026):
// - tripadvisor.com "15 Best Things to Do in Suzuka" (Nabana no Sato,
//   Tsubaki Ogamiyashiro Shrine, Suzuka Satsuki Onsen)
// - triplyzer.com "13 Awesome Things to do in Suzuka"

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9a26a4f4-2d3b-4e68-9bc3-ce2b55bb15e9";
const EVENT_ID = "9fe13c2e-37d1-49f0-8a48-d3ea40186fe4";
const slug = "japanese-gp-suzuka-city";

const bodyContent = `Most Suzuka visitors see the circuit, the train station, and not much else — which is a reasonable outcome for a weekend built around the race, but it does mean skipping a small city with a couple of genuinely distinctive spots worth knowing about, particularly if you're building in any rest time around race weekend.

Nabana no Sato is the standout. It's a botanical garden that functions as a genuine daytime destination — landscaped grounds worth a walk — but its real reputation comes after dark, when its winter and seasonal illumination displays, including a "Tunnel of Light" walkway, turn it into one of the more striking light installations in the region. Whether the illuminations are running during your specific visit depends on the season, so check the current display calendar before planning a trip around it specifically — but even without the lights running, the gardens themselves are a legitimate stop.

Tsubaki Ōgamiyashiro Shrine is Suzuka's significant Shinto shrine, and it's worth the visit for anyone interested in a genuine, non-touristy shrine experience rather than one of Japan's more crowded, famous sites. It's a real, active place of worship rather than a stop built primarily around visitor traffic.

If you want to properly unwind after a long day at the circuit, Suzuka Satsuki Onsen sits a few kilometres from the track — a genuine hot spring option for anyone who wants the classic Japanese onsen experience without a special trip elsewhere in the region. Akame Onsen, a bit further out, is another real option if you're willing to travel a little for it.

None of this is essential to a Suzuka trip built purely around the Grand Prix. But if you've got a rest day, or you're the type who'd rather see something of the place you're visiting beyond the track itself, Suzuka has more to offer than its reputation as "the town near the circuit" suggests.`;

const whyItsSpecial = `Suzuka's identity, for most F1 fans, begins and ends at the circuit gates — a reasonable assumption for a race-focused weekend, but one that misses a real botanical garden with a genuinely striking light display, an active shrine worth visiting on its own terms, and a legitimate onsen a few minutes from the track.

None of this requires reshuffling your race weekend priorities. It's simply worth knowing these places exist if you have even half a day beyond the sessions themselves.`;

const insiderTips = [
  "Check Nabana no Sato's current illumination calendar before visiting specifically for the light displays — they run seasonally, not year-round, so a daytime garden visit is the reliable option outside those windows.",
  "Suzuka Satsuki Onsen's proximity to the circuit (a few kilometres) makes it a genuinely practical unwind option after a long race-weekend day, rather than something requiring a separate trip.",
];

const whatToAvoid = `Don't plan a trip to Nabana no Sato assuming the illumination displays will be running without checking the current seasonal calendar first — the light show is a seasonal feature, not a permanent one. Don't treat Tsubaki Ōgamiyashiro Shrine as a quick photo stop — it's a genuine, active place of worship, and visiting with the same respect you'd give any working shrine matters here, not just at Japan's larger, more famous sites.`;

const practicalInfo = {
  hours: "Nabana no Sato: typically 9am-9pm, illumination hours vary seasonally; Tsubaki Ōgamiyashiro Shrine: dawn to dusk, unrestricted; Suzuka Satsuki Onsen: check current hours directly",
  costRange: "Nabana no Sato entry: moderate, roughly ¥2,300 (varies with illumination season); shrine visit: free; onsen entry: budget to moderate",
  bookingMethod: "No advance booking required for any of these — all are walk-in.",
  website: "https://www.nagashima-onsen.co.jp/nabana/",
};

const gettingThere = "Nabana no Sato and the onsen options require a short taxi or local bus ride from Suzuka Circuit or Suzuka Station — check current transit options given routes can change; none are within comfortable walking distance of the circuit itself.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Suzuka City — What's Actually Around the Track",
      subtitle: "A striking light garden, an active shrine, and a real onsen — beyond the circuit gates.",
      slug,
      experienceType: "neighborhood",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Suzuka",
      address: "Nabana no Sato, 270 Urushibata, Nagashima-cho, Kuwana, Mie 511-1144, Japan",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sources: tripadvisor.com '15 Best Things to Do in Suzuka', triplyzer.com '13 Awesome Things to do in Suzuka' (both verified 21 Sep 2026).",
      sport: ["formula_one"],
      moodTags: ["relaxation", "culture"],
      interestCategories: ["culture", "nature"],
      pace: "slow",
      physicalIntensity: 1,
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

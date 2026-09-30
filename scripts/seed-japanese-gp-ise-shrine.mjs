// Seed: "Ise Grand Shrine — a Half-Day from Suzuka" — experience #15/20 for
// Japanese Grand Prix 2027 (Suzuka).
//
// Sources (verified 21 Sep 2026):
// - en.ise-kanko.jp (Ise City Tourism Association access guide)
// - japan-guide.com "Nagoya to Ise Shima" transit guide
// - trip.com Kintetsu Nagoya to Ise Jingu route detail (~80 min Kintetsu
//   Limited Express, Geku/Naiku walk and bus connection times)

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9a26a4f4-2d3b-4e68-9bc3-ce2b55bb15e9";
const EVENT_ID = "9fe13c2e-37d1-49f0-8a48-d3ea40186fe4";
const slug = "japanese-gp-ise-grand-shrine";

const bodyContent = `Mie Prefecture is home to two very different kinds of pilgrimage site — Suzuka Circuit, and Ise Grand Shrine, Japan's most venerated shrine complex. Given you're already in the region for the race, a half-day at Ise is a genuinely rare opportunity, not just a generic day-trip suggestion tacked onto a motorsport itinerary.

Ise Jingu isn't one shrine — it's two main complexes, Geku (the Outer Shrine) and Naiku (the Inner Shrine), roughly five kilometres apart, and both are worth visiting if you have the time. Geku is dedicated to Toyouke, the deity of agriculture and industry, and sits a five-to-ten-minute walk from Iseshi or Ujiyamada Station, making it the easier of the two to reach. Naiku, the more sacred of the two and dedicated to the sun goddess Amaterasu, sits further out — about a 15-20 minute bus ride from Geku, or a 30-minute walk from Isuzugawa Station if you'd rather not wait for a bus.

What makes Ise genuinely different from most shrine visits in Japan is the rebuilding tradition: the shrine buildings themselves are torn down and rebuilt from scratch every 20 years, using traditional techniques with no modern shortcuts, a practice that's continued for over a millennium. What you're looking at isn't an ancient structure — it's a living tradition of craftsmanship being renewed on a fixed cycle, which is arguably more remarkable than an old building would be.

Getting there from Nagoya is straightforward: the Kintetsu Limited Express runs the route in around 80 minutes, and on weekdays the Kintetsu Shimakaze — a premium limited express — makes the same trip in comparable time with a more comfortable ride, departing Nagoya Station around mid-morning. Either way, this is a real half-day-to-full-day commitment once you factor in both shrines and the bus connection between them, not a quick stop.

If your schedule only allows for one of the two shrines, Naiku is the one most guides point to as the more essential visit — it's the more sacred site and the one most associated with Ise's reputation nationally. But if you have the full half-day, seeing both, with the walk or bus ride between them, gives a genuinely more complete sense of the complex than either alone.`;

const whyItsSpecial = `Ise Jingu's rebuilding tradition — tearing the shrine down and reconstructing it from scratch every 20 years, using techniques passed down for over a thousand years — is the kind of detail that changes how you look at a religious site. This isn't a static monument; it's an active, ongoing craft tradition that happens to also be one of Japan's most sacred places.

For most visitors to Japan, a trip to Ise requires a deliberate, dedicated journey. Being in Mie Prefecture already for the Grand Prix removes that barrier entirely — this is a rare case where a motorsport trip puts you within genuine, practical reach of one of the country's most significant cultural sites.`;

const insiderTips = [
  "If you're short on time, prioritize Naiku over Geku — it's the more sacred of the two shrines and the one most associated with Ise's reputation, so it's the better single choice if you can't fit both.",
  "Check the Kintetsu Shimakaze's weekday schedule before planning around it — it's a genuinely more comfortable limited express than the standard Kintetsu Limited Express, but it doesn't run every day or at every hour.",
];

const whatToAvoid = `Don't assume Geku and Naiku are close enough to walk between comfortably — they're roughly five kilometres apart, and the bus connection (15-20 minutes) or a proper walk from Isuzugawa Station (30 minutes) both need to be planned for, not treated as an afterthought. Don't try to fit Ise into a half-day if you're also planning other activities that same day — between the ~80-minute train each way and time at both shrines, this is realistically most of a full day once travel is included.`;

const practicalInfo = {
  hours: "Ise Jingu grounds typically open 5am-6pm, varying by season — check current hours before visiting",
  costRange: "Free to enter both Geku and Naiku — transit and any food purchases are the only real cost",
  bookingMethod: "No advance booking required for the shrine visit itself. Kintetsu Limited Express tickets can be booked in advance or purchased same-day at Nagoya Station.",
  website: "https://www.isejingu.or.jp/en/",
};

const gettingThere = "Kintetsu Limited Express from Nagoya Station to Iseshi or Ujiyamada Station, roughly 80 minutes. Geku is a 5-10 minute walk from either station; Naiku requires a further 15-20 minute bus ride from Geku, or a 30-minute walk from Isuzugawa Station.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Ise Grand Shrine — a Half-Day from Suzuka",
      subtitle: "Japan's most sacred shrine complex, rebuilt from scratch every 20 years, within real reach of race weekend.",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Ise",
      address: "Ise Jingu, Ise, Mie, Japan",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sources: en.ise-kanko.jp Ise City Tourism Association access guide, japan-guide.com Nagoya-to-Ise-Shima transit guide, trip.com Kintetsu route detail (all verified 21 Sep 2026).",
      sport: ["formula_one"],
      moodTags: ["culture", "day-trip"],
      interestCategories: ["culture"],
      pace: "moderate",
      physicalIntensity: 3,
      budgetTier: "free",
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

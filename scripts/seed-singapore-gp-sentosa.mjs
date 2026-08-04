import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "bc5bb5bd-8b52-4225-94ea-66451f57af10";
const EVENT_ID = "48aa4415-f6a2-4867-b390-eb6b28b6903b";
const slug = "singapore-gp-sentosa-" + Date.now().toString(36);

const bodyContent = `Sentosa is genuinely close, roughly 3 miles from Marina Bay and about 10 minutes by MRT via HarbourFront station, which makes it a realistic full-day addition to a race trip rather than a separate excursion that eats into your schedule.

Three real ways to arrive: the free Sentosa Boardwalk, a 10-15 minute walk from VivoCity mall; the Sentosa Express train for S$4; or the Singapore Cable Car from Mount Faber or HarbourFront Tower 2, landing at Imbiah Lookout, running daily 8:45am-10pm with final boarding at 9:30pm and costing roughly S$35 return, worth doing at least one direction purely for the views over the harbour and city.

Universal Studios Singapore anchors the island for theme park visitors, tickets from around S$83-88, and it's a genuinely full day on its own if that's the plan. Beyond the park, Sentosa has real beaches, Palawan and Siloso among them, and enough green space and coastal walking to make a lower-key half-day work too, not every visit here needs to be theme-park paced.

Given Singapore's night race format, sessions typically run into the evening, which means Sentosa genuinely works as a daytime activity before heading back for racing, rather than competing with it. The cable car's 10pm close does mean planning your return by early evening if that's part of your day.`;

const whyItsSpecial = `Most Grand Prix cities require a real trade-off between racing and sightseeing, a beach day and a race day rarely fit in the same 24 hours. Singapore's night race format changes that math entirely: with sessions starting well into the afternoon or evening, Sentosa's beaches, cable car, and theme park are all genuinely doable before heading to the circuit, not a competing claim on your time. I think that's worth spelling out explicitly, because a visitor used to a normal daytime Grand Prix might not realise how much daytime is actually available here.`;

const insiderTips = [
  "Take the cable car one direction and the boardwalk or Sentosa Express the other, you get the harbour views without paying twice for the return trip.",
  "Plan your Sentosa visit to wrap by early evening if you have a race session that day, the cable car's last boarding is 9:30pm and getting back to the circuit needs buffer time.",
];

const whatToAvoid = `Don't treat Universal Studios and a relaxed beach day as compatible in one visit, the park alone is a genuinely full day. Pick one focus for Sentosa rather than trying to fit both into a single trip if you also have a race session that evening.`;

const practicalInfo = {
  hours: "Cable car: daily 8:45am-10pm, last boarding 9:30pm. Sentosa Boardwalk and Express: check current Sentosa Development Corporation hours.",
  costRange: "Boardwalk: free. Sentosa Express: S$4. Cable car: approx S$35 return. Universal Studios: from S$83-88.",
  bookingMethod: "Book Universal Studios and cable car tickets online in advance, especially around race weekend when visitor numbers spike across Singapore.",
  howToBook: "",
  website: "https://www.sentosa.com.sg/en/things-to-do/attractions/universal-studios-singapore/, https://www.headout.com/blog/singapore-cable-car/",
  reservationsRequired: false,
};

const gettingThere = "HarbourFront MRT station, then Sentosa Boardwalk (free, 10-15 min walk), Sentosa Express (S$4), or Singapore Cable Car from Mount Faber/HarbourFront Tower 2.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Sentosa Island — a real day trip before race night",
      subtitle: "Beaches, cable cars, and Universal Studios, genuinely doable before an evening session thanks to the night race format",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Sentosa",
      address: "Sentosa Island, Singapore",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Travel time (10 min via HarbourFront MRT) and cable car hours confirmed via rome2rio.com and headout.com. Universal Studios pricing via thrillark.com and sentosa.com.sg. Verified 1 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["scenic", "family-friendly"],
      interestCategories: ["sightseeing", "leisure"],
      pace: "active",
      physicalIntensity: 3,
      budgetTier: "moderate",
      budgetCurrency: "SGD",
      bestSeasons: ["oct"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-01",
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

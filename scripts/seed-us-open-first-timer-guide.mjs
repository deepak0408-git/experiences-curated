import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "fb782de2-bbe6-410f-b466-2a4e628cda10"; // New York
const EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9"; // US Open 2026
const slug = "us-open-first-timer-guide-" + Date.now().toString(36);

const bodyContent = `The US Open doesn't ask you to behave like you're at Wimbledon, and that's deliberate, not an oversight. There's no formal spectator dress code — the tournament's own guidance is closer to "dress up if you want to," and the only real rules are that shirts and shoes stay on and nothing offensive gets worn. What you'll actually see ranges from tennis-core polish to shorts and a t-shirt, and neither reads as wrong.

The bigger difference is how the tournament sounds. Most Grand Slams, French Open included, expect real quiet during points — stewards who actively enforce it, not just a polite convention. The US Open runs the opposite philosophy on purpose: music plays between points on the show courts, crowds are openly encouraged to be loud, and the atmosphere on a packed Ashe night session reads closer to a soccer match than a traditional tennis crowd. It's genuinely divisive even among players — some love the energy, others have said outright that it's a different, louder environment than anywhere else they play. Know this going in rather than being thrown by it: cheering mid-rally, between-point music, and a crowd that doesn't go silent on command are all part of the intended experience here, not a breach of etiquette.

That said, real rules do exist and get enforced. Bags are capped at 12"x12"x16", one per guest, with no on-site storage for anything bigger — backpacks specifically are not allowed with very limited exceptions. Umbrellas can't be held open during play, which matters on a showery day since you'll need to close it or step under cover rather than watching from your seat with it up. And once a point is actually in progress, the "anything goes" atmosphere has a real limit: moving around the stands, talking loudly enough to distract players, or recording video for long stretches has gotten matches genuinely paused by the chair umpire in recent years, so the looseness has a ceiling even if it's a higher one than other majors.

The honest first-timer mistakes here are about logistics more than etiquette. Showing up without checking the Schedule of Play on the official app and missing a specific player's practice session. Treating the grounds as a one-stadium visit and never walking the outer courts, where some of the tournament's best, closest-up tennis actually happens. Wearing shoes that aren't built for a full day of walking real distances between courts. And underestimating New York's late-summer humidity on a day session with no roof overhead — see the Weather guide for the real numbers.`;

const whyItsSpecial = `Every other Grand Slam first-timer's guide spends its energy explaining what to wear and how to behave, because most majors genuinely do expect a certain decorum. The US Open is the one major that built its whole identity around rejecting that decorum on purpose, and a first-timer's guide that doesn't say so upfront is setting someone up to feel like they're doing it wrong when they're actually doing it exactly right. There's something almost refreshing about a Grand Slam that put a cocktail named after a scoring term into the hands of tens of thousands of fans and leaned all the way into the noise rather than fighting it. This isn't a lesser, less serious version of tennis — Ashe at night with 23,000 people loud about it is one of the genuinely great atmospheres in American sport. Knowing that before you walk in changes the whole trip from "am I allowed to do this" to "oh, this is the point."`;

const insiderTips = [
  "The US Open deliberately plays music between points on its show courts and tolerates a louder, more active crowd than any other Grand Slam — don't mistake this for bad behavior or hold back from joining in; it's the house style, not a breach of it.",
  "Download the official app before you fly, not after you arrive — the Schedule of Play updates daily and is the only reliable way to know which practice courts have which players at which times.",
];

const whatToAvoid = `Don't bring a backpack expecting to check it somewhere — backpacks are barred from the grounds with very limited exceptions, and there's no on-site storage for one that doesn't comply, meaning a wasted trip back to wherever you're staying. Don't assume the loose, loud atmosphere means every behavior is tolerated mid-point — moving around the stands, sustained loud talking, or extended filming during play has led to real match stoppages by the chair umpire; the looseness has a ceiling even on the loudest Slam.`;

const gettingThere = `7 train to Mets-Willets Point, roughly a 10-minute walk to the gates. See the Getting There guide for the full route.`;

const practicalInfo = {
  bookingMethod: "No booking required. Download the official US Open app before you travel for the Schedule of Play, live scores, and grounds navigation — it's the single most useful free tool for planning each day on-site.",
  website: "https://www.usopen.org",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "No Dress Code, No Silence — What Makes This Slam Different",
      subtitle: "Loud music between points and Honey Deuces by the thousand — the least formal Grand Slam",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Flushing Meadows-Corona Park, Queens",
      address: "USTA Billie Jean King National Tennis Center, Flushing Meadows-Corona Park, Queens, NY 11368",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from CNN (Ashe atmosphere), ESPN (loudest major coverage), SI (fan rules), Beaumont Etiquette (dress code). Verified 5 Oct 2026.",
      googleMapsReviewCount: null,
      sport: ["tennis"],
      moodTags: ["orientation", "culture"],
      interestCategories: ["event-logistics"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["aug", "sep"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-10-05",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

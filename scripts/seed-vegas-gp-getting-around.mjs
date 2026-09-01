import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f0388505-a1ca-4929-b14d-f33ae8075409";
const EVENT_ID = "cd5785a7-d37c-4d4b-a545-a8b8e28eac57";
const slug = "las-vegas-gp-getting-around-" + Date.now().toString(36);

const bodyContent = `The Las Vegas Grand Prix runs through the middle of the Strip, which means the roads you'd normally take to get around Las Vegas Boulevard are the same roads that shut down to build the circuit. Soft closures begin at 3pm each day of race weekend — Thursday through Saturday — with full closures following at 5pm, and they stay in place until well into the early hours the next morning. Driving is actively discouraged during this window, and it's not just advice: once full closures are in effect, a car genuinely cannot get you where you need to go on the Strip itself.

Walking, the Las Vegas Monorail, and rideshare are the three real options, in that order of reliability. The monorail runs 24 hours during race weekend, and the Flamingo/Caesars Palace and Horseshoe/Paris stations both drop you within a short walk of major circuit entry zones. If you're staying anywhere on the Strip itself, walking is often the most predictable choice — you already know your route, and it avoids the crowd bottlenecks that build up around monorail platforms and rideshare zones right after sessions end.

Rideshare and taxis do operate, but from designated pickup and drop-off points only, not curbside wherever you happen to be. The two official points are Virgin Hotels Las Vegas — closest to the start/finish straight and East Harmon Zone — and the Hughes Center, closest to the T-Mobile Zone at Sphere. Both get genuinely busy and slow immediately after a session finishes, when thousands of people are trying to leave at once.

The official Las Vegas Grand Prix app is worth downloading before you arrive, not once you're already lost. It shows real-time road openings and closures and can build a custom walking route from wherever you are to your specific ticketed zone — genuinely useful on a street circuit where "the road you walked in on" might be closed by the time you're heading back.`;

const whyItsSpecial = `Most Grand Prix cities ask you to travel to a circuit outside town. Las Vegas closes the town around the circuit instead, and that inversion is what makes transit planning here a real part of the experience rather than a footnote. Get it right and you're stepping out of your hotel lobby onto the same street the cars are racing down an hour later. Get it wrong and you're stuck outside a closure line watching qualifying start without you. I'd tell anyone new to this race that the app and a walking-first mindset matter more here than at almost any other Grand Prix on the calendar — this isn't a circuit you drive to, it's one you're already standing inside the moment you leave your hotel.`;

const insiderTips = [
  "Download the official Las Vegas Grand Prix app before you land — its real-time closure map and custom walking routes are the single most useful tool for navigating a circuit that reroutes on the fly, and it's far more current than any third-party map or blog post.",
  "If you're staying between Virgin Hotels Las Vegas and the Hughes Center, note which one aligns with your ticketed zone before booking a rideshare — picking the wrong pickup point can mean a longer walk than just heading to your zone directly.",
];

const whatToAvoid = `Don't plan to drive anywhere near the Strip during soft-closure hours (from 3pm) expecting to "beat" the full 5pm closure — soft closures already restrict access meaningfully, and cutting it close risks getting stuck on the wrong side of a barrier with no way through. Don't assume rideshare will be faster than walking just because it feels less effort — immediately after a session ends, designated pickup points see genuine surges that can leave you waiting far longer than a 15-20 minute walk would have taken.`;

const practicalInfo = {
  hours: "Soft closures from 3pm, full closures from 5pm, Thursday 19 Nov through Saturday 21 Nov 2026, lifting into the early hours each following morning",
  costRange: "Las Vegas Monorail single ride from roughly US$6; rideshare fares surge significantly around session start/end times",
  bookingMethod: "No booking needed for walking or the monorail. For rideshare, use the Virgin Hotels Las Vegas or Hughes Center designated pickup points only — curbside pickup elsewhere on the Strip is not available during closures.",
  howToBook: "",
  website: "https://www.f1lasvegasgp.com/a-z-guide/, https://www.formula1.com/en/latest/article/how-to-get-to-and-from-the-las-vegas-grand-prix.cC4fJHHhvB6sFzwGqPtBr",
  reservationsRequired: false,
};

const gettingThere = "Applies circuit-wide. From any Strip hotel, walking or the Las Vegas Monorail (Flamingo/Caesars Palace or Horseshoe/Paris stations) is the most reliable route once soft closures begin at 3pm.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Getting Around Race Weekend — Closures & Monorail",
      subtitle: "The Strip shuts down to build the circuit — know the closure hours before you plan your route",
      slug,
      experienceType: "transit",
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
      editorialNote: "Sourced from formula1.com official 'How to get to and from the Las Vegas Grand Prix' article (soft/full closure timing, monorail, rideshare pickup points) and f1lasvegasgp.com A-Z Guide. A separate search surfaced conflicting exact closure dates/hours (implying a Nov 22 race day) that contradict the DB-confirmed 21 Nov 2026 race date — that conflicting figure was discarded in favor of the officially-sourced daily pattern (soft closures 3pm, full 5pm, Thu-Sat) rather than guessing at exact hour-by-hour times. Verified 29 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["practical"],
      interestCategories: ["sport"],
      pace: "moderate",
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

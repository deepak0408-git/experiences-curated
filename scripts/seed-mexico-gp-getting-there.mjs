import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "883ac422-5318-460f-819a-6ae784ac4b8c";
const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a";
const slug = "mexico-city-gp-getting-there-" + Date.now().toString(36);

const bodyContent = `Metro is the real answer here, and it's worth understanding the gate-to-station matching before you leave your hotel, because getting this wrong means a longer walk than necessary in a crowd.

Three Metro Line 9 stations serve the circuit, each lining up with different gates: Velódromo gets you to Gate 1, Ciudad Deportiva serves Gates 4, 5, 6, and 7, and Puebla covers Gates 8, 9, and 12. Check your ticket for your assigned gate before you travel, then pick the matching station rather than defaulting to whichever one you've heard mentioned most — Ciudad Deportiva tends to get named as "the" circuit station, but it's only the right choice for about half the gates.

There's a real wrinkle specific to race day itself: on the Sunday of the Grand Prix, several Line 9 and Metrobús stations actually close, including Ciudad Deportiva, Puebla, and Pantitlán — a genuine, planned closure to manage crowd flow, not a malfunction. If you're travelling to the circuit from within the city specifically on race day, Velódromo becomes the reliable fallback regardless of which gate you're aiming for, since it stays open. Practice and qualifying days (Friday and Saturday) don't carry the same closures, so the direct gate-matched station works fine on those days.

Rideshare apps are a real trap here. Uber and DiDi cannot get anywhere near the actual circuit gates on race weekend — road closures around the venue block them out entirely. If you book one anyway, expect the driver to drop you several blocks short and the final approach to be a slow walk through heavy foot traffic and street vendors rather than the quick door-to-door trip the app implies. If you're using rideshare at all, plan the drop-off point in advance and budget real extra time for the walk-in, rather than assuming the app will get you to the gate.

Driving yourself isn't a realistic option on race weekend — road closures around the Magdalena Mixhuca sports complex are extensive, and there's no meaningful visitor parking near the circuit itself. Metro, walking, or a combination of the two is genuinely the standard approach for the vast majority of attendees, locals and visitors alike.`;

const whyItsSpecial = `Most circuit transit guides are a formality — take the train, here's the stop, done. This one actually has a trap in it that catches first-timers every year: assuming the app-based rideshare that works everywhere else in the city will also work on race day, and discovering only once you're in the car that the driver can't get within several blocks of your gate. Knowing the Metro station-to-gate mapping in advance, and knowing specifically that race day itself closes different stations than practice and qualifying days, is the difference between arriving relaxed and arriving flustered after an unplanned 20-minute walk you didn't budget for.`;

const insiderTips = [
  "Race day (Sunday) closes Ciudad Deportiva, Puebla, and Pantitlán stations specifically — Velódromo is the one Line 9 station that stays open regardless of your gate, so know it as your fallback even if it's not your normal station on practice/qualifying days.",
  "If you do use rideshare, set your drop-off point several blocks from your actual gate rather than trying to get the app to route you closer — drivers genuinely cannot get through the road closures, and repeatedly trying just burns time and frustrates the driver.",
];

const whatToAvoid = `Don't keep your phone in a back pocket or wear a backpack on your back during rush-hour-level crowding on Line 9 — pickpocketing on Mexico City's Metro happens almost exclusively in exactly this kind of packed, shoving-match crowd, and race weekend trains run at that density for hours around each session. Keep bags on your chest, phone somewhere zipped and in front of you, and use the women-only carriages (Vagones Exclusivos) where available if that applies to you — they're genuinely safer in a crush like this. And don't assume you can leave right after the chequered flag and get straight home — post-race buses from the circuit don't start running until an hour after the race ends, with the last one around 18:30, so budget for a real wait if you're relying on circuit-organized transport rather than walking straight to the Metro yourself.`;

const practicalInfo = {
  hours: "Metro Line 9 runs its normal service hours on non-race days; on race day, check current Metro/Metrobús closure notices for Ciudad Deportiva, Puebla, and Pantitlán specifically",
  costRange: "Mexico City Metro fare is a flat 5 pesos (roughly US$0.30) per ride, regardless of distance or transfers",
  bookingMethod: "No booking needed — Metro Line 9 (Velódromo, Ciudad Deportiva, or Puebla depending on your gate) is the standard, recommended route to the circuit for both locals and visitors.",
  website: "https://www.thef1spectator.com/mexican-grand-prix-travel-guide/transport/",
};

const gettingThere = null;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Getting to the Autódromo Hermanos Rodríguez",
      subtitle: "Metro Line 9 is the answer — but race day closes different stations than practice days",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Granjas México, Iztacalco",
      address: null,
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Metro station-to-gate mapping, race-day station closures (Ciudad Deportiva, Puebla, Pantitlán), and rideshare access limitations sourced from TheF1Spectator.com's official transport guide for the Mexican Grand Prix and oversteer48.com's travel/transport guide, Sep 2026. Metro fare corrected to the real flat rate (5 pesos, ~US$0.30) via CDMX government's official Metro FAQ page, 6 Sep 2026 — previously a vague 'a few pesos' placeholder, flagged by founder. What to Avoid rebuilt 6 Sep 2026 after both original avoids were found to restate facts already in bodyContent — replaced with 2 genuinely new avoids: Metro pickpocketing risk during high-density crowding (sourced from multiple Tripadvisor CDMX Metro reviews and themexicohandbook.com's street-safety guide, describing an established, ongoing pattern, not race-specific but directly relevant given race-weekend crowd density) and post-race circuit bus timing (buses start 1 hour after the race ends, last departure ~18:30, sourced from TheF1Spectator.com's transport guide).",
      sport: ["formula_one"],
      moodTags: ["practical", "first-timer-friendly"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "budget",
      budgetCurrency: "USD",
      bestSeasons: ["oct", "nov"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-06",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #7 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

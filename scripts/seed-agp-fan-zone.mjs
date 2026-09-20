import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne
const EVENT_ID = "64792f75-c009-4070-a12b-23d7bd0a3a7f"; // Australian GP 2027
const slug = "fan-zone-melbourne-walk-fan-forum-" + Date.now().toString(36);

const bodyContent = `Every Park Pass and grandstand ticket at Albert Park includes access to the on-circuit Fan Zone, and it's genuinely worth building time into your day for rather than treating as an afterthought between track sessions. The centrepiece is the Melbourne Walk — the pathway near the Pits and Podium Club where drivers and team personnel pass on their way in and out of the paddock each morning. It's one of the few places at a Grand Prix where you can realistically see a current F1 driver at close range without a hospitality ticket, and it runs every day of the event.

The Fan Forum stage is where most of the organised driver content happens — Q&A sessions, interviews, appearances scheduled across the weekend. Worth knowing before you plan your day around it: it draws real crowds, and being at the Fan Forum stage isn't necessarily the best way to actually meet a driver up close, since you're one of a genuinely large audience rather than in a small-group setting. A smaller 'Tech Talk' stage runs alongside it with lower-key technical content and appearances, usually with thinner crowds — worth checking if you'd rather hear detail than just see a driver from a distance.

Beyond the two stages, the Fan Zone area is where the supercar displays, racing simulators, and team merchandise booths cluster — a genuine activity hub for the periods between track sessions when there's a natural lull. It sits close to several of the grandstands (Brabham and Jones especially), making it easy to duck into for twenty minutes without missing much on-track action.

Because appearance times and stage schedules are announced closer to race week and can shift, checking the official Grand Prix app or website once you're on-site (or the day before) for the actual day-by-day timetable is the only reliable way to know exactly who's appearing when — don't plan your whole day around a driver appearance time seen weeks in advance without reconfirming it.`;

const whyItsSpecial = `A lot of Grand Prix weekends treat the space between sessions as dead time — somewhere to kill twenty minutes before the next thing on-track happens. Albert Park's Fan Zone is built specifically to fill that gap with something real: an actual chance to see drivers walking past at close range, not just on a screen, plus content and activities that don't require a track session to be interesting.

The honest caveat is crowd size at the marquee moments — Melbourne Walk and Fan Forum both draw big numbers, and 'access' doesn't always mean an intimate encounter. The Tech Talk stage's smaller crowds are the trade worth knowing about if what you actually want is to hear something detailed rather than just be in the vicinity of a driver for a photo. Either way, this is the part of an Albert Park ticket that a lot of first-time visitors don't fully use, and it's included in every ticket type without extra cost.`;

const insiderTips = [
  "The Tech Talk stage runs alongside the bigger Fan Forum stage with noticeably smaller crowds — a better option if you actually want to hear detailed content rather than just be present near a driver appearance.",
  "Melbourne Walk access is subject to capacity even with a valid ticket — arriving in the morning before the crowd builds gives you a meaningfully better chance of a close view than showing up mid-morning once word spreads that a driver is due through.",
];

const whatToAvoid = "Don't plan your whole day around a driver appearance time you saw announced weeks in advance — Fan Forum and Melbourne Walk schedules are confirmed closer to race week and can shift, so reconfirm via the official app or website once you're on-site. And don't expect the Fan Forum stage to be an intimate meet-and-greet — it draws large crowds, and a driver appearance there means visibility from a distance more often than a close encounter.";

const practicalInfo = {
  hours: "Runs across all four event days, 1–4 Apr 2027, alongside the main track schedule — specific stage and Melbourne Walk timings confirmed closer to race week.",
  costRange: "Included with any Park Pass or grandstand ticket — no separate cost.",
  bookingMethod: "No separate booking required — access is included in any valid Albert Park ticket. Check the official Grand Prix app or website on-site for the day's confirmed Fan Forum, Tech Talk, and Melbourne Walk schedule.",
  website: "https://www.f1-australia.com/en/fan-zones-43",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Fan Zone — Melbourne Walk & Fan Forum",
      subtitle: "Driver appearances, the Melbourne Walk, and where to actually stand — included with every ticket.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Albert Park Grand Prix Circuit",
      address: "Albert Park Grand Prix Circuit, 12 Aughtie Dr, Albert Park VIC 3206, Australia",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      editorialNote: "Sources: search summary of manofmany.com Melbourne GP guide (Melbourne Walk location near Pits and Podium Club, Fan Forum crowd size caveat, Tech Talk stage), f1-australia.com/en/fan-zones-43 (official Fan Zone page), grandprix.com.au (Park Pass inclusions confirming Melbourne Walk/Fan Forum/Lakeside Festival access, subject to capacity). Verified 20 Sep 2026.",
      sport: ["formula_one"],
      moodTags: ["high-energy", "authentic"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-20",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created:", result.title, "|", result.id, "|", result.slug, "|", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne
const EVENT_ID = "64792f75-c009-4070-a12b-23d7bd0a3a7f"; // Australian GP 2027
const slug = "arrival-queue-guide-gates-bag-policy-" + Date.now().toString(36);

const bodyContent = `Albert Park has seven entry gates, numbered 1, 2, 3, 5, 8, 9 and 10 — not sequential, which trips up a lot of first-timers looking for a "Gate 4" or "Gate 6" that doesn't exist. Grandstand ticket holders have their gate printed on the ticket itself; Park Pass general admission holders can use Gates 2 through 10, though Gate 1 is best avoided as it tends to be the most congested. Gates typically open at 8:30am Friday through Sunday, with Thursday's practice day opening slightly later at 9:30am.

Every gate runs a security check and bag search, and this is where queue length is decided more than anything else. Coming without a bag — or having one member of your group carry everyone's bags — gets you through noticeably faster via the no-bag line, which matters most on Park Pass days when a fast entry means first access to the best general admission spots. Prohibited items include glass bottles and containers, alcohol, hard-cased Eskies or coolers (soft coolers and polystyrene eskies are fine), drones (flying one at the circuit is a criminal offence, not just a confiscation), laser pointers, and umbrellas, since they block other spectators' views.

Race day queuing is a different scale of problem to practice or qualifying days. Serious regulars chasing the best Park Pass spots — Brocky's Hill, the Turn 2 mound — are known to queue at Gates 8 or 9 up to 90 minutes before the gates actually open on Sunday. If claiming a specific general admission spot is the priority, that's genuinely the benchmark to plan against, not a rough guess. If you don't need a specific spot, Thursday and Friday are meaningfully quieter days to arrive later and still get a reasonable position.

Knowing which gate to head for before you leave your accommodation, rather than following the crowd once you're near the circuit, is the single biggest time-saver here. Albert Park's gates are spread around a 5km perimeter, and walking from the wrong side of the lake to correct your mistake can cost 20-30 minutes you'd rather spend inside.`;

const whyItsSpecial = `A lot of the friction people hit on Grand Prix morning has nothing to do with the race itself — it's the mechanics of getting through a gate with 20,000 other people in the least amount of time. Albert Park's system is genuinely well designed once you understand it (numbered gates matched to ticket type, a fast no-bag lane, clear prohibited-items rules) but it rewards knowing the system in advance far more than it rewards showing up and figuring it out on the day.

The 90-minutes-before-gates-open benchmark for Sunday's best Park Pass spots is a specific, useful piece of local knowledge that most first-timers don't have until someone tells them — the alternative is discovering it the hard way, arriving at a "reasonable" hour and finding every good general admission position already taken. Getting arrival timing right is one of the few things about race day entirely within a visitor's own control.`;

const insiderTips = [
  "Travel without a bag, or consolidate your group's bags into one person's, to use the faster no-bag security lane — this matters most on Park Pass days when speed through the gate translates directly into a better general admission spot.",
  "If you're chasing a specific Park Pass spot like Brocky's Hill on race day, plan to be in the queue at Gates 8 or 9 up to 90 minutes before opening — that's the real benchmark serious regulars use, not a rough guess.",
];

const whatToAvoid = "Don't assume Albert Park's gates are numbered sequentially — they run 1, 2, 3, 5, 8, 9, 10 with genuine gaps, and looking for a nonexistent 'Gate 4' or 'Gate 6' wastes time you don't have on a busy morning. And don't pack a hard-cased Esky or cooler expecting to bring it in — only soft coolers and polystyrene eskies are permitted, and a hard cooler will be turned away at the gate, a completely avoidable delay.";

const practicalInfo = {
  hours: "Gates open 8:30am Friday–Sunday, 9:30am Thursday, for the 2–4 Apr 2027 event weekend (Thursday typically covers support-category track activity ahead of the main weekend).",
  costRange: "No cost — entry timing and gate information only.",
  bookingMethod: "No booking required — your grandstand ticket specifies your assigned gate; Park Pass holders may use Gates 2-10.",
  website: "https://www.f1-australia.com/en/entering-the-circuit-24, https://www.f1-australia.com/en/rules-for-visitors-24",
  reservationsRequired: false,
};

const gettingThere = "Albert Park's seven gates (1, 2, 3, 5, 8, 9, 10) are spread around the circuit's 5km perimeter — check your ticket for your assigned gate before you leave your accommodation, since walking between gates on the wrong side of the lake can cost 20-30 minutes.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Arrival & Queue Guide — Gates, Bags & Timing",
      subtitle: "Seven gates, one fast lane, and the real 90-minute benchmark for the best Park Pass spots on race day.",
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
      gettingThere,
      editorialNote: "Sources: search summary of grandprix.com.au fan-zone tips articles, oversteer48.com/albert-park-gates-entrances-f1/ (gate numbering 1,2,3,5,8,9,10; Park Pass Gates 2-10, avoid Gate 1), fanamp.com and official F1 prohibited-items lists (glass, alcohol, hard eskies, drones, laser pointers, umbrellas), fanvoyageinsider.substack.com first-timer guide (90-min Gate 8/9 queue benchmark, Thursday/Friday lighter crowds), 2025 gate-opening times as most recently confirmed reference (8:30am Fri-Sun, 9:30am Thu) — 2027 times not yet officially published. Verified 20 Sep 2026.",
      sport: ["formula_one"],
      moodTags: ["practical", "authentic"],
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

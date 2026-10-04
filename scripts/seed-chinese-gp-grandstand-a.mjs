// Grandstand A — Chinese GP 2027. Sources: formula1.com/en/racing/2027/china
// (official — circuit length, Turn 13-14 straight, Metro Line 11/60min),
// ticketing.formula1.com/china (official — passport registration, 200,000
// capacity, large screens all grandstands), f1experiences.com/2027-chinese-
// grand-prix (F1's own licensed hospitality partner — confirms Grandstand A
// exists, paired with Hero/Podium packages). No third-party/unofficial site
// (e.g. formula1shanghai.com) used as a citation per founder instruction,
// 23 Sep 2026. Exact 2027 pricing/tier name not yet published by F1 itself —
// stated honestly as TBC rather than carrying over an unconfirmed 2026 name.
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "998a8774-05ac-4482-ba7a-4ca2a556b963"; // Shanghai
const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d"; // Chinese Grand Prix 2027
const slug = "chinese-gp-grandstand-a-" + Date.now().toString(36);

const bodyContent = `Grandstand A sits on Shanghai International Circuit's main straight, directly across from the pit lane — the largest single grandstand at a track built to host close to 200,000 spectators across the full weekend. It's built around one idea: from here you watch the start, the pit stops, and the finish without turning your head.

The circuit itself is 5.451km, in continuous use since 2004, and its signature feature is the 1.2km straight linking Turns 13 and 14 — the longest run on the current F1 calendar. Grandstand A doesn't face that straight directly, but it gives you the other half of the story: the green light, the sprint into Turn 1, and everything the pit wall does across the race, ending with the finish line and the podium celebration in the same sightline.

F1 Experiences, the sport's own official hospitality partner, sells three package tiers built around this grandstand for 2027: Starter and Hero packages (Thursday–Sunday) that pair a Grandstand A or B seat with a guided track tour, the Aramco Pit Lane Walk, and a championship trophy photo; and a dedicated Podium package (Friday–Sunday) that adds F1 Podium access, Paddock Insider entry, and an FIA Safety Car inspection on top of the Grandstand A seat itself. None of these show 2027 pricing yet — deposits are being taken for priority access ahead of a full on-sale.

Every attendee needs a passport registered against their ticket weeks before the event — this is stated directly on F1's own ticketing site, applies to all grandstands, and isn't unique to Grandstand A, but it's easy to miss if you're used to buying F1 tickets in Europe, where it isn't required. All grandstands at the circuit, including A, come fitted with large screens, so even a seat facing away from a given corner keeps you following the whole race.

Getting there is straightforward from central Shanghai: Line 11 of the Metro runs directly to the Shanghai Circuit stop, roughly an hour from the city centre according to F1's own event page — plan around that travel time on session days rather than the shorter journeys typical of a more central circuit.`;

const whyItsSpecial = `A main-straight grandstand at most circuits gives you one good moment and a lot of waiting. Grandstand A gives you the full shape of a Grand Prix weekend from a single seat — the start, the pit strategy playing out lap after lap, and the finish with the podium right there. That's the argument F1's own hospitality arm is making too: every serious package it sells for this race, from the entry-level Starter tier up to the dedicated Podium package, is built around exactly this grandstand. For a circuit whose signature feature is a straight you can't actually see from here — the 1.2km run into Turn 14 — Grandstand A trades one spectacle for a more complete one. You give up the corner everyone talks about in exchange for never losing the thread of the race itself.`;

const practicalInfo = {
  hours: "Gate times TBC for 2027 — check formula1.com closer to the event",
  costRange: "2027 pricing not yet published by Formula 1 or F1 Experiences as of Sep 2026",
  bookingMethod: "Tickets at ticketing.formula1.com/china. Hospitality packages (Starter, Hero, Podium | A): reserve a priority-access deposit at f1experiences.com/2027-chinese-grand-prix.",
  website: "https://www.formula1.com/en/racing/2027/china, https://ticketing.formula1.com/china/, https://f1experiences.com/2027-chinese-grand-prix",
};

const gettingThere = "Shanghai Metro Line 11 to Shanghai Circuit station — roughly 60 minutes from central Shanghai, per Formula 1's own event page — then follow circuit signage to the Grandstand A entrance on the main straight side.";

const insiderTips = [
  "Register your passport details against your ticket as soon as you book, not on race weekend — this is a real requirement on F1's own ticketing site, applies circuit-wide, and is easy to overlook if you've bought F1 tickets in Europe before, where it isn't asked for.",
  "If you want more than a grandstand seat, F1 Experiences' own Podium | A package is the only official route to actual podium and paddock access for this grandstand — check it before assuming a resold hospitality ticket gets you the same access.",
];

const whatToAvoid = "Don't skip the passport registration step until race week — it's a genuine requirement for every attendee at this circuit, not a formality, and leaving it late adds real friction right before the event. Don't plan on a quick hour-long Metro ride on race day itself — Line 11 gets heavily congested with race traffic heading to the circuit, so leave earlier than the normal journey time would suggest.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Grandstand A — Shanghai's Main Straight, Start to Podium",
      subtitle: "The circuit's biggest grandstand, on the start/finish straight — F1's top packages are built around this exact seat.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Anting, Jiading District",
      address: "Shanghai International Circuit, No. 2000 Yining Road, Anting Town, Jiading District, Shanghai, China",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from formula1.com/en/racing/2027/china, ticketing.formula1.com/china, f1experiences.com/2027-chinese-grand-prix — official sources only, per founder instruction 23 Sep 2026 (no formula1shanghai.com citation). 2027 grandstand tier naming/pricing not yet published — stated as TBC rather than carrying over unconfirmed prior-year figures.",
      sport: ["formula_one"],
      moodTags: ["thrilling", "iconic", "social"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "splurge",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: new Date().toISOString().slice(0, 10),
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓", result.title, "→", result.id, `(${result.slug})`, result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

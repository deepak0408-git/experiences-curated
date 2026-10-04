// Grandstand B — Chinese GP 2027. Ticket/schedule facts from
// formula1.com/en/racing/2027/china (official — circuit layout, opening
// "snail" corner sequence per Wikipedia's neutral description),
// ticketing.formula1.com (passport requirement), f1experiences.com
// (Starter/Hero package B option). Seat-specific detail (uncovered, lower
// vantage, opening-lap incident potential, 5-minute walk to Fan Zone)
// confirmed directly by founder against circuit reference material, 23 Sep
// 2026 — not attributed to a specific URL.
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "998a8774-05ac-4482-ba7a-4ca2a556b963";
const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";
const slug = "chinese-gp-grandstand-b-" + Date.now().toString(36);

const bodyContent = `Grandstand B sits just past Grandstand A, looking into the circuit's opening sequence of corners — the tight, looping run through Turns 1 to 3 that Shanghai International Circuit was actually designed around. The layout is inspired by the Chinese character "shang" (上), and this opening complex is one of the two "snail"-shaped sections that give the track its distinctive shape.

Being lower down and further from the pit straight than Grandstand A, B doesn't give you the pit-lane and midfield views that A's upper tier offers. What it gives you instead is a genuinely different kind of racing: the opening corners are where first-lap contact and overtaking attempts cluster, as twenty cars funnel into a tightening sequence at speed for the first time. A start-line grandstand shows you the launch; Grandstand B shows you what actually happens to that field a few seconds later, when the positions from the grid start being contested for real.

Grandstand B is uncovered, unlike A, H, and K — worth planning for if you're booking around Shanghai's April weather, which can swing from clear to wet with little warning. A large screen is visible from the stand regardless, so you won't lose track of the wider race even during the corners you can't directly see.

One practical advantage worth knowing: B is a short, roughly five-minute walk from the circuit's Fan Zone and from the main cluster of food and refreshment stalls — closer than several of the grandstands further round the lap. If you're planning to use the fan zone activities between sessions, or don't want a long walk for food during a break, that proximity is a real factor, not just a footnote.

As with every grandstand at this circuit, all attendees need passport details registered against their ticket ahead of the event.`;

const whyItsSpecial = `Most grandstand write-ups sell you on the moment a race is won. Grandstand B sells you on the moment it's actually shaped — the opening corners, seconds after lights out, where twenty cars funnel into a tightening sequence and the grid order from qualifying starts getting rewritten for real. That's a different kind of drama from a main-straight seat's clean view of the start and finish: less composed, more chaotic, and often more consequential to how the whole afternoon unfolds. Being lower and uncovered than the circuit's premium stands is the honest trade-off — you give up comfort and the widest sightline for a genuinely closer look at the part of the race most likely to produce an actual overtake or a first-lap incident. Paired with easy walking access to the Fan Zone and food stalls, it's a grandstand built for a fan who wants to be near the action between sessions as much as during them.`;

const practicalInfo = {
  hours: "Gate times TBC for 2027 — check formula1.com closer to the event",
  costRange: "2027 pricing not yet published by Formula 1 or F1 Experiences as of Sep 2026",
  bookingMethod: "Tickets at ticketing.formula1.com/china. F1 Experiences Starter and Hero packages both offer a Grandstand B option: reserve a priority-access deposit at f1experiences.com/2027-chinese-grand-prix.",
  website: "https://www.formula1.com/en/racing/2027/china, https://ticketing.formula1.com/china/, https://f1experiences.com/2027-chinese-grand-prix",
};

const gettingThere = "Shanghai Metro Line 11 to Shanghai Circuit station — roughly 60 minutes from central Shanghai, per Formula 1's own event page — then follow circuit signage past Grandstand A toward the opening corners.";

const insiderTips = [
  "Grandstand B is uncovered — check the forecast and pack for both sun and rain, since Shanghai's April weather can swing within the same race weekend and this is one of the few main grandstands with no roof.",
  "If you want to use the Fan Zone between sessions or don't want a long walk for food, Grandstand B's roughly five-minute proximity to both is a genuine practical edge over grandstands further round the circuit.",
];

const whatToAvoid = "Don't book Grandstand B expecting pit-lane or midfield views — its lower position past the opening corners trades that sightline for a close look at Turns 1-3 specifically, a genuinely different viewing experience from Grandstand A's straight-on vantage. Don't skip the passport registration requirement until race week — it applies to every attendee at this circuit and is easy to leave too late if you're used to buying F1 tickets with less paperwork elsewhere.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Grandstand B — Shanghai's Opening-Corner Seat",
      subtitle: "Uncovered, close to the Fan Zone, and looking straight into the tight opening corners where first-lap incidents cluster.",
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
      editorialNote: "Ticket/schedule facts from formula1.com/en/racing/2027/china, ticketing.formula1.com, f1experiences.com. Circuit shape/opening-corner sequence from en.wikipedia.org/wiki/Shanghai_International_Circuit (neutral source). Seat-specific detail (uncovered, lower vantage, Fan Zone proximity) confirmed directly by founder against circuit reference material, 23 Sep 2026.",
      sport: ["formula_one"],
      moodTags: ["thrilling", "social"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "budget",
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

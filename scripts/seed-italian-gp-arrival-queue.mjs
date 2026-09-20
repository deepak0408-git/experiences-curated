import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b0d8f9a-911d-4cc7-8049-50e4685958ca"; // Milan
const EVENT_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e"; // Italian Grand Prix
const slug = "italian-gp-arrival-queue-guide-" + Date.now().toString(36);

const bodyContent = `Gates open at 7am on Friday, Saturday, and Sunday — earlier than most fans expect for a circuit this size, and worth building your morning around if you're aiming for a specific grandstand seat before the crowds settle in. Monza runs six spectator entrances, lettered A through G, and which one you use actually matters: Gate A/B serves the start line area, Grandstand 1, and the Traguardo stands; Gate B covers the Ascari and Piscina sections plus Grandstands 2, 3, and 27-30; Gate D handles Lesmo and the Seconda Variante; Gate G is your route into the Parabolica end, including Grandstand 17. Walk up to the wrong gate on a full house day and you're looking at a long walk around the perimeter instead of a five-minute stroll in.

Bag policy is simple by F1 standards: 15 litres, any colour, no clear-bag requirement. Suitcases and oversized luggage are out entirely — this isn't a venue that tolerates day-trip packing. Water is capped at 500ml per bottle, plastic or metal, and alcohol doesn't get past the gate at all. What might surprise you if you've been to a British or American race: Monza actually welcomes cameras and lenses for personal use, tripods included with security approval. Most modern F1 venues have gone the opposite direction. If serious photography is part of why you're going, Monza is one of the more forgiving circuits left.

The standard weapons-and-explosives list applies, plus the less obvious bans: drones, tents, bicycles, laser pointers, oversized umbrellas (a small rain umbrella without a metal tip is fine), and — worth flagging specifically — musical instruments and political or religious display items. Folding chairs are allowed as long as they're not wooden. Power banks are capped at 300 grams.

Re-entry is genuinely allowed here, unlike some circuits that lock you in for the day once you're through security. The tradeoff is time: leaving mid-session means queuing again to get back in, and that queue can run long during breaks between sessions when everyone else has the same idea. If your plan is grandstand in the morning, Fan Zone at lunch, grandstand again for the race, budget real time for the second security pass rather than assuming a quick walk back through.`;

const whyItsSpecial = `Every circuit has some version of a bag-and-gate rulebook, and most of them read the same: don't bring weapons, don't bring drones, here's your bottle limit. What actually separates Monza is what it chooses not to restrict. A track that lets spectators bring real cameras and tripods, at a sport where most paddocks treat a serious camera like a security risk, is telling you something about who it expects to show up.

The re-entry policy matters more, though, and it's genuinely rare at this scale of event. It changes how you can actually plan the day. You're not locked to one grandstand from 7am to the chequered flag. You can move, eat properly, come back. That flexibility is worth knowing about before you build a schedule around the assumption that you can't.`;

const insiderTips = [
  "Match your gate to your grandstand before you leave the hotel — Gate A/B for Grandstand 1 and the start line, Gate G for the Parabolica end. Walking to the wrong entrance on a packed race day means circling most of the perimeter to get to the right one.",
  "Monza's camera policy is unusually relaxed — personal cameras, lenses, and tripods (with security approval) are allowed, which isn't true at most modern F1 venues. If you're planning to shoot properly, this is one of the better circuits left for it.",
];

const whatToAvoid = `Don't bring a bag over 15 litres or any kind of suitcase or trolley case assuming it'll get waved through — it won't, and there's no storage option mentioned at the gates themselves. And don't treat re-entry as a quick five-minute round trip: it's genuinely allowed, but you'll queue again on the way back in, and that line gets long fast during the gaps between sessions when everyone else has had the same idea to step out.`;

const practicalInfo = {
  hours: "Gates open 07:00 on Friday, Saturday, and Sunday of race weekend (3-5 Sep 2027, subject to confirmation)",
  costRange: "No separate entry cost beyond your ticket — this covers what you can bring in, not what you pay",
  bookingMethod: "No booking required — arrive at any circuit gate with your valid ticket.",
  website: "https://www.f1italy.com/en/rules-for-visitors-8",
};

const gettingThere = "See the Getting to the Circuit experience elsewhere in this pack for the full route from Milan — this covers what happens once you arrive at the gates themselves.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Arrival & Queue Guide",
      subtitle: "Six gates, a 15-litre bag limit, and one of the few F1 circuits that still lets you leave and come back",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Monza",
      address: "Autodromo Nazionale Monza, Parco di Monza, 20900 Monza MB, Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Gate letters/areas, bag policy (15L limit, 500ml water cap, camera/tripod allowance), and re-entry policy sourced from f1italy.com's official 'Rules for Visitors' page and oversteer48.com's gate guide, both cross-checked, 18 Sep 2026. 2027 gate-opening time carried forward from the confirmed 2026 pattern (07:00) pending official 2027 visitor guidance, which f1italy.com itself notes may still be updated before the event.",
      sport: ["formula_one"],
      moodTags: ["practical"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["sep"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-18",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

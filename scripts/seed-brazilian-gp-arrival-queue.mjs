import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb";
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const slug = "brazilian-gp-arrival-queue-guide-" + Date.now().toString(36);

const bodyContent = `Gates at Interlagos open at 08:00 on Friday, Saturday, and Sunday, across multiple entrances positioned around the circuit. Every entrance runs a bag check, and F1's own visitor guidance is blunt about it: pack light, because refusing a search can get you turned away without a refund. There's no getting around this line, and there's no reason to try — showing up with less means clearing security faster and getting to your seat before the crowd bottleneck builds near session start.

The prohibited-items list is longer than most first-timers expect. Beyond the obvious (weapons, explosives, sharp objects, glass containers), it also bans professional cameras, drones, bicycles, tents, folding chairs, chains or poles, and any single item larger than 2m x 1.5m. Confiscated items are disposed of on the spot, not held for pickup — so don't bring anything you'd want back. Food is allowed but capped: up to three items per person, each sealed in its original packaging, or cut fruit in a clear, flexible bag. Whole fruit isn't permitted at all. Some areas inside the circuit run on a pre-paid Cashless Card system for purchases, worth knowing before you assume you can pay cash everywhere.

The single most consequential rule: there is no re-entry. Once you leave through a gate, you're not getting back in that day. This matters more here than it sounds — Interlagos is a big site with a lot to see, and the instinct to step out for something outside the grounds (better food, a bathroom break somewhere quieter, meeting someone at a different gate) needs to be resisted entirely once you're through security for the day.

None of this is designed to be unfriendly — it's the standard security posture for a stadium-scale crowd at a major international event, and once you're through the gate the rules stop mattering and the day is genuinely relaxed. The friction is all at the front door.`;

const whyItsSpecial = `Every major sporting event has a version of this list, and most fans skim it without really absorbing the parts that would actually change what they pack. Interlagos' no-re-entry policy is the one rule here that changes behavior, not just your bag contents — it forces a decision most first-timers don't think to make in advance: are you staying for the whole day, and have you actually brought what you need to do that comfortably? Knowing this before you leave your hotel, rather than discovering it at the gate, is the difference between a smooth first session and losing an hour of racing to a rule you didn't see coming.`;

const insiderTips = [
  "Because bag checks happen at every entrance and there's no fast-track for light packing beyond the search itself moving quicker, arrive with your gates-open target in mind rather than session-start time — a 08:00 gate opening with security lines building fast means getting there right at open is genuinely worth the early start on a big grandstand day.",
  "The three-food-item cap and sealed-packaging requirement catches people who bring a packed lunch assuming outdoor-event norms apply — repack anything homemade into commercially sealed containers or plan to buy food inside instead, since a homemade sandwich in foil doesn't meet the 'original packaging' bar.",
];

const whatToAvoid = `Don't bring a professional camera or a drone assuming you'll just be asked to leave it in a bag check locker — both are outright banned and confiscated on the spot, with no storage or return option mentioned anywhere in the official guidance. And don't plan on stepping out mid-day for any reason — no re-entry means a lunch run outside the grounds, a forgotten item in the car, or meeting someone who arrives late at a different gate are all one-way decisions that end your day at the circuit the moment you walk out.`;

const practicalInfo = {
  hours: "Gates open 08:00 on Friday, Saturday, and Sunday of race weekend (6-8 Nov 2026), subject to change",
  costRange: "No separate entry cost beyond your ticket — this covers what you can bring in, not what you pay",
  bookingMethod: "No booking required — arrive at any circuit gate with your valid ticket.",
  website: "https://www.formula1.com/en/racing/2026/brazil",
};

const gettingThere = "See the Getting to Interlagos experience elsewhere in this pack for the full route from central São Paulo — this covers what happens once you arrive at the gates themselves.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Arrival & Queue Guide",
      subtitle: "Gates open at 08:00, bag checks at every entrance, and there's no re-entry once you're in",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Interlagos",
      address: "Autódromo José Carlos Pace, Av. Senador Teotônio Vilela, 261, Interlagos, 04329-030 São Paulo, SP, Brazil",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "All rules (08:00 gate opening, bag checks at every entrance, prohibited items list including professional cameras/drones/tents/chairs, three-food-item cap with sealed-packaging requirement, Cashless Card system, no re-entry policy) sourced directly from Formula1.com's own official visitor-information article for Autódromo José Carlos Pace, 11 Sep 2026 — the single highest-confidence source for this fact set, cross-checked against brasilf1.com's 'Rules for Visitors' page for consistency.",
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
      lastVerifiedDate: "2026-09-11",
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

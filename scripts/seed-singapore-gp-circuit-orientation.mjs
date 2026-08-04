import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "bc5bb5bd-8b52-4225-94ea-66451f57af10";
const EVENT_ID = "48aa4415-f6a2-4867-b390-eb6b28b6903b";
const slug = "singapore-gp-first-timer-orientation-" + Date.now().toString(36);

const bodyContent = `Marina Bay Street Circuit splits into four zones, and which ones you can access depends entirely on your ticket, some grant entry to all four, others just one. Zone 1 holds the pits, the Paddock, the Singapore Flyer, the Wharf Stage, and several of the best-known grandstands, so it's worth knowing early whether your ticket covers it or not.

Nine to ten entrances ring the circuit, each linked to specific nearby landmarks, Gate 8 near Marina Bay Sands, Gate 1 near The Concourse and PARKROYAL on Beach Road, Gate 2 near Conrad Centennial and Suntec via Temasek Boulevard. Your specific recommended gate is printed on the back of your ticket, check it rather than guessing based on which entrance looks closest on a map. Most gates have an express lane for anyone entering without a bag, bags get searched, so travelling light genuinely speeds up entry. Arriving 60-90 minutes before track sessions start gives you time to explore the Fan Zone, grab merchandise, and clear security before the real rush.

The single most important first-timer fact about this specific race: Singapore was declared F1's first official "heat hazard" race, real, current recognition of how demanding the heat and humidity genuinely are, not exaggerated race-weekend colour. Drink water constantly, refill stations are placed throughout the circuit, wear light clothing, and don't underestimate how much walking is actually involved between gates, stands, and stages. A neck fan is a small thing that makes a real difference here. Rain arrives fast and heavy when it comes, a poncho is more useful than an umbrella in a packed crowd. Most vendors take cards, but carry some cash too, not every stall does.`;

const whyItsSpecial = `Singapore isn't a race you can wing on generic Grand Prix knowledge, the zone system, the heat, and the sheer amount of walking are all specific enough to catch out a first-timer who's only been to a European daytime race before. F1 declaring this an official heat hazard race isn't hype, it's a real classification, and I think that single fact does more to prepare someone honestly than any amount of "bring water" advice on its own. Knowing your zone, your gate, and what this heat actually does to a full day on your feet is the difference between a genuinely great first Singapore GP and a rough one.`;

const insiderTips = [
  "Check your ticket's zone access before planning your day, not after arriving, Zone 1 specifically holds the Paddock, Flyer, and Wharf Stage, and not every ticket includes it.",
  "Arrive 60-90 minutes before your session to clear security and explore the Fan Zone unrushed, gate queues build fast closer to session start.",
];

const whatToAvoid = `Don't underestimate the heat and humidity as ordinary race-weekend discomfort, this is F1's first-ever official heat hazard race, treat hydration and pacing as genuinely necessary, not optional. And don't assume any nearby gate works for your ticket, your specific recommended entrance is printed on the ticket itself.`;

const practicalInfo = {
  hours: "Gates typically open 60-90+ minutes before each day's first session, Friday–Sunday 9–11 Oct 2026",
  costRange: "Included with any valid ticket — no separate entry fee",
  bookingMethod: "No separate booking needed — orientation applies to any ticket type. Check your specific ticket for recommended gate and zone access.",
  howToBook: "",
  website: "https://www.formula1.com/en/latest/article/singapore-grand-prix-helpful-tips-and-information-when-visiting-the-marina.61d1w4TykVZRomD0ox72Vk",
  reservationsRequired: false,
};

const gettingThere = "Nine to ten gates ring the circuit, each linked to nearby landmarks (Gate 8: Marina Bay Sands; Gate 1: The Concourse/PARKROYAL; Gate 2: Conrad Centennial/Suntec). Your recommended gate is printed on your ticket.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "First-timer orientation — zones, gates, and the heat",
      subtitle: "F1's first official heat hazard race — what to actually know before your first Singapore GP",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Marina Bay",
      address: "Marina Bay Street Circuit, Singapore",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Zone/gate info sourced from oversteer48.com and formula1.com official visitor guide. Heat hazard designation confirmed via BBC Sport and malaymail.com reporting. Verified 1 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["practical", "first-timer"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 3,
      budgetTier: "free",
      budgetCurrency: "SGD",
      bestSeasons: ["oct"],
      advanceBookingRequired: false,
      availability: "event_only",
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

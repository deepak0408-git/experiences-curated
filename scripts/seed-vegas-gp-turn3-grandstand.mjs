import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f0388505-a1ca-4929-b14d-f33ae8075409";
const EVENT_ID = "cd5785a7-d37c-4d4b-a545-a8b8e28eac57";
const slug = "las-vegas-gp-turn3-grandstand-" + Date.now().toString(36);

const bodyContent = `Turn 3 Grandstand sits in the Koval Zone, and its real selling point isn't Turns 3 and 4 themselves — cars go through that section largely single-file, with limited overtaking. What you're actually booking a seat for is the run that follows: the Koval Straight, a genuine DRS zone between Turns 4 and 5, where the DRS detection point sits just after Turn 2 and activates 20 metres past Turn 4. From this stand you watch cars build speed down that straight and then brake hard into Turn 5G, a second-gear 65mph right-hander that's a real passing opportunity most race weekends.

The grandstand connects directly into the Heineken Silver Stage, where F1 runs live entertainment and driver interviews throughout the weekend — something the Main Grandstand doesn't offer in the same way. As of 2026, the East Harmon, West Harmon, and Koval zones all connect to each other, so a Turn 3 ticket also gets you movement across a wider stretch of fan activations than a single isolated grandstand ticket would.

Pricing sits in the genuine mid-tier: a single-day ticket starts around $147, and a 3-day pass starts around $1,329 including taxes and fees — well below the Main Grandstand's four-figure single-day race price, but with real racing content rather than just proximity to the pits. It's the stand for someone who wants to watch actual overtaking attempts rather than pay a premium purely for the start/finish ceremony.

There's a genuine premium tier here too: the Turn 3 Club sits above the general grandstand, with hospitality-style dining and a better vantage over the same braking zone, for anyone who wants the Koval action with table service attached.`;

const whyItsSpecial = `The honest case for Turn 3 Grandstand isn't its own corner — it's what happens right after it. The Koval Straight is one of only two real DRS zones on the entire Strip circuit, and Turn 5G's braking zone is where a lot of the race weekend's actual passing happens. Paying Main Grandstand money buys you ceremony; this stand buys you racing, at roughly a third of the single-day race price. I'd steer anyone who cares more about watching cars actually fight for position than about being level with the start line toward this one, especially if the Heineken Stage's live entertainment and driver interviews matter to how they want to spend the rest of race weekend beyond the on-track laps.`;

const insiderTips = [
  "The DRS detection point sits just after Turn 2 and activates 20 metres past Turn 4 — watch for cars visibly closing the gap through the Koval Straight itself, not just at Turn 5, since that's where the overtaking move actually gets set up.",
  "If watching wheel-to-wheel racing matters more than being trackside for driver interviews, the Turn 3 Club's elevated hospitality tier gets a materially better sightline over the same braking zone than the general grandstand seats below it.",
];

const whatToAvoid = `Don't book this stand expecting heavy action directly in front of you at Turns 3 and 4 — cars run largely single-file through that specific section, and the real overtaking happens slightly downstream at Turn 5, which is visible but not immediately in front of the lower-numbered seating blocks. Don't assume "Koval Zone" access means you're free to wander into West Harmon or East Harmon zone activations without checking your specific ticket tier first — zone connectivity applies to fan walkways and general activations, not necessarily to every grandstand's exact seating access.`;

const practicalInfo = {
  hours: "Practice Thu 19 Nov, Qualifying Fri 20 Nov, Race Sat 21 Nov 2026 — all sessions run evening into night, Pacific time",
  costRange: "From US$147 single-day; from US$1,329 for a 3-day pass including taxes and fees (2026 pricing)",
  bookingMethod: "Book via f1lasvegasgp.com or tickets.formula1.com under Koval Zone grandstands. Mid-tier pricing sells reliably through the season but isn't typically the first stand to sell out — a safer late-booking option than Main Grandstand or West Harmon.",
  howToBook: "",
  website: "https://www.f1lasvegasgp.com/tickets/grandstands/turn-3-grandstand/, https://tickets.formula1.com/en/f1-59007-las-vegas/26449-turn-3",
  reservationsRequired: true,
};

const gettingThere = "Koval Zone entrance, accessible from Koval Lane and connected on foot to the East and West Harmon zones. Strip road closures begin early afternoon on race days — walk or use the monorail rather than driving.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Turn 3 Grandstand — the Koval Straight's real DRS view",
      subtitle: "Mid-tier price, genuine overtaking — watch the braking zone into Turn 5, not just the ceremony",
      slug,
      experienceType: "sports_venue",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Koval Zone",
      address: "Turn 3 Grandstand, Koval Zone, Las Vegas Strip Circuit, Las Vegas, NV",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from f1lasvegasgp.com official Turn 3 Grandstand page, oversteer48.com track layout/DRS zone breakdown, and fanamp.com seating guide. Verified 29 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["high-energy", "value"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: true,
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

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "bc5bb5bd-8b52-4225-94ea-66451f57af10";
const EVENT_ID = "48aa4415-f6a2-4867-b390-eb6b28b6903b";
const slug = "singapore-gp-stamford-grandstand-" + Date.now().toString(36);

const bodyContent = `Stamford is the cheapest grandstand at the Singapore GP, roughly a third of what Turn 1 or Turn 2 cost, and it's genuinely one of the better racing seats on the circuit rather than a budget compromise. It sits between Turns 7 and 8, at the end of the longest DRS zone on the lap, where cars arrive fast and brake hard to around 127km/h. That braking zone is bumpy and unforgiving: in 2022, Hamilton, Albon, and Verstappen all struggled through it in the same race weekend, which tells you this corner produces real mistakes, not just clean overtakes.

Seating is individual folding chairs across seven blocks, A1 through A7, 43 rows deep, fully uncovered. Blocks A1-A2 give the clearest look at Turn 7 itself; higher rows from about 15 up trade some closeness for a wider view of the whole braking zone. Sit low if you can, trackside trees partially block sightlines to Turn 8 from the back rows.

Stamford's ticket only covers Zone 4, the same zone as Padang, so you're a short walk from the Padang Stage and its headline acts without paying Padang's price for the privilege. One trade-off: only one big screen is visible from most seats, so if you're relying on it to follow the wider race, sit somewhere with a clean sightline to it before settling in.`;

const whyItsSpecial = `Stamford is the stand I'd point a budget-conscious first-timer toward without hesitation. It costs a third of the premium pit-straight stands and delivers a corner with real history: a long DRS zone feeding into a bumpy, high-pressure braking point that has caught out multiple world champions in the same race. That's not manufactured drama, it's a genuinely difficult piece of track. Combined with Zone 4 access to the Padang Stage concerts at a fraction of Padang's own price, this is the stand that makes the strongest case for itself on value rather than prestige.`;

const insiderTips = [
  "Book blocks A1-A2 specifically for the clearest Turn 7 view — rows 15 and higher trade proximity for a wider, more forgiving sightline of the whole braking zone.",
  "Sit in the lower rows if a clear view of Turn 8 (not just Turn 7) matters to you — trackside trees partially obstruct the upper rows' sightline to that corner.",
];

const whatToAvoid = `Don't expect full-race screen coverage — only one big screen is visible from most Stamford seats, worse than some pricier stands with multiple screens. If following the whole lap on-screen matters as much as the live corner action, factor that into which block you book.`;

const practicalInfo = {
  hours: "Race weekend sessions Friday–Sunday, 9–11 Oct 2026, into the evening",
  costRange: "S$608 adult / S$438 junior for 3-day (2026); single-day Friday/Saturday/Sunday priced separately",
  bookingMethod: "Book via singaporegp.sg or tickets.formula1.com under Zone 4 grandstands — historically the first stand to sell out given its value.",
  howToBook: "",
  website: "https://singaporegp.sg/en/tickets/general-tickets/grandstands/stamford-grandstand/, https://tickets.formula1.com/en/f1-3301-singapore",
  reservationsRequired: true,
};

const gettingThere = "Gates 3B, 4, 5, or 6 provide the most direct access. Nearest MRT: Esplanade or Promenade.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Stamford Grandstand — best value racing seat",
      subtitle: "A third of the premium price, a corner that's caught out world champions — Singapore's real budget pick",
      slug,
      experienceType: "sports_venue",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Marina Bay",
      address: "Stamford Grandstand, Zone 4, Marina Bay Street Circuit, Singapore",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from singaporegp.sg official Stamford page and oversteer48.com detailed section review, including 2022 race incident history at Turn 7. Verified 1 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["high-energy", "value"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "budget",
      budgetCurrency: "SGD",
      bestSeasons: ["oct"],
      advanceBookingRequired: true,
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

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "bc5bb5bd-8b52-4225-94ea-66451f57af10";
const EVENT_ID = "48aa4415-f6a2-4867-b390-eb6b28b6903b";
const slug = "singapore-gp-lau-pa-sat-" + Date.now().toString(36);

const bodyContent = `Lau Pa Sat, "old market" in Hokkien, started life in 1824 as Singapore's first fish market on timber pilings over the sea. It landed in its current spot on Raffles Quay in 1894, inside an octagonal cast-iron structure shipped over piece by piece from Glasgow and designed by Scottish engineer James MacRitchie. It's Singapore's only hawker centre inside a gazetted national monument, and that history is genuinely visible, not a plaque bolted onto a food court.

More than 80 stalls run inside, serving everything from Michelin-recognised char kway teow and nasi lemak to pao fan and fishball noodles, most meals landing between S$5-12. The real draw at night is Satay Street, the closed-off stretch of Boon Tat Street outside, where around a dozen stalls grill chicken, beef, lamb, and prawn skewers over charcoal from 7pm on weekdays and 3pm on weekends, running until 3am.

It's a five to ten minute walk from Marina Bay Street Circuit, making it a genuinely realistic pre-race or post-session stop rather than a detour. It's worth being straight about the trade-off: Tripadvisor puts it at 4.2 out of 5 from over 2,500 reviews, solid but not spotless, and a recurring criticism is that it leans tourist-facing, with some reviewers flagging inflated prices and less warmth from vendors than at a genuinely local hawker centre. That doesn't make it a bad stop, the setting and the satay are real, but it's not the place to go looking for the cheapest or most authentic hawker experience in the city.`;

const whyItsSpecial = `A 200-year-old fish market turned Victorian cast-iron hawker hall, five minutes from a Formula 1 circuit, is a genuinely unusual pairing, and it's the kind of thing that makes Singapore's race weekend different from most others on the calendar. I'd send a first-timer here specifically for Satay Street after a session, not because it's the most authentic hawker food in Singapore, it isn't, but because eating charcoal-grilled satay on a closed street outside a national monument, minutes from a floodlit circuit, is a genuinely memorable version of a race night that doesn't exist anywhere else on the calendar.`;

const insiderTips = [
  "Head for stalls 7 and 8 on Satay Street specifically, they're the ones reviewers consistently single out for quality and service.",
  "Go for the setting and the satay, not for bargain prices, several reviewers flag this as a tourist-facing spot with inflated pricing versus a genuinely local hawker centre.",
];

const whatToAvoid = `Don't expect the cheapest or most authentic hawker experience in Singapore here, it's a real, historic, and good spot, but multiple reviewers note it's priced and run for tourists more than locals. If budget hawker food specifically is the goal, Maxwell Food Centre is the better comparison point.`;

const practicalInfo = {
  hours: "Lau Pa Sat itself technically operates 24 hours, though stall availability varies; Satay Street runs 7pm-3am weekdays, 3pm-3am weekends",
  costRange: "Most meals S$5-12; satay priced per skewer, typically S$0.60-1 each",
  bookingMethod: "Walk-in only, no reservations — arrive before peak dinner hours (around 7-8pm) on race nights to avoid the worst of the queue.",
  howToBook: "",
  website: "https://www.laupasat.sg/sataystreet/",
  reservationsRequired: false,
};

const gettingThere = "5-10 minute walk from Marina Bay Street Circuit. Nearest MRT: Raffles Place or Downtown.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Lau Pa Sat — a national monument near the circuit",
      subtitle: "1894 Victorian cast-iron hawker hall, charcoal satay till 3am, honest about who it's really built for",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Raffles Quay",
      address: "18 Raffles Quay, Singapore 048582",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "History sourced from backpackerswanderlust.com, travjoy.us, laupasat.sg official site. Rating (4.2/5, 2555 reviews) confirmed via Tripadvisor. Verified 1 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["local-food", "late-night"],
      interestCategories: ["dining"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "SGD",
      bestSeasons: ["oct"],
      advanceBookingRequired: false,
      availability: "perennial",
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

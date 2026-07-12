import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const slug = "hungarian-gp-ticket-guide-" + Date.now().toString(36);

const bodyContent = `The Hungarian Grand Prix has a reputation as one of the cheapest weekends on the F1 calendar, and the numbers back it up. A 3-day General Admission ticket runs around €72, a fraction of what the same tier costs at Spa or Monza. Grandstand seats start from around €200 for the weekend. That combination of low prices and guaranteed good weather (Budapest in late July rarely disappoints) means Hungary sells out most years, even with modest attendance compared to the calendar's marquee rounds.

General Admission gets you the open hillside that rings the circuit's natural bowl, no fixed seat, but real elevation and real sightlines across multiple corners, plus Fan Zone access. It's genuinely good here in a way GA isn't everywhere, the terrain does the work that a grandstand does elsewhere. If you want a seat, T1 (formerly Gold 4) and the Apex grandstands at the final corner are the two most requested for actual overtaking and race-deciding moments. The Hungaroring Grandstand, the only covered stand at the circuit, opposite the pit garages, commands a premium for exactly that reason, shelter matters in a Hungarian July, where afternoon storms are common even on an otherwise 30°C day.

Above grandstand level, F1's own hospitality tiers stack up clearly: the F1 Fan Lounge (around €2,035 for 3 days) gets you an air-conditioned indoor space and a covered grandstand seat; Champions Club (around €3,670 for 3 days) steps up further; Paddock Club sits above both, with pit lane walks and a suite directly over the team garages.

Because Hungary is comparatively affordable, buyers sometimes assume availability will hold longer than it does. It doesn't. Popular grandstands and the covered Hungaroring Grandstand routinely sell out weeks before race weekend even though GA tickets remain available right up to the gates.`;

const whyItsSpecial = `Most ticket guides for F1 races are really about triage, which sold-out tier do you settle for. Hungary flips that. The starting price is low enough that the real decision isn't "can I afford to go" but "how much comfort do I want to add on top of a genuinely solid base experience." That's a rare position to be in on this calendar, and it's worth knowing before assuming Hungary needs the same urgent, months-ahead booking discipline that Spa or Monza does, some of it does, but the entry point itself is forgiving in a way most Grands Prix aren't.`;

const insiderTips = [
  "Book the Hungaroring Grandstand (the only covered stand) as early as you can if weather cover matters to you, it sells out faster than its price tier would suggest precisely because it's the sole roofed option at the circuit.",
  "If budget is the main constraint, General Admission here is a genuinely strong choice rather than a fallback, the natural bowl terrain gives real sightlines that GA doesn't offer at flatter circuits.",
];

const whatToAvoid = `Don't assume Hungary's reputation for affordability means you can wait to book, popular grandstands and the covered stand sell out weeks ahead even though overall demand is lower than at Spa or Monza. Don't buy from unofficial resellers without checking face value first, official channels (tickets.formula1.com, f1hungary.com) are the safest and usually cheapest route.`;

const practicalInfo = {
  hours: "Race weekend 24-26 Jul 2026. Gates typically open around 8am each day.",
  costRange: "GA 3-day approx. €72; grandstand seats from approx. €200/weekend; Hungaroring Grandstand (covered) at a premium; F1 Fan Lounge approx. €2,035/3 days; Champions Club approx. €3,670/3 days; Paddock Club priced above both",
  bookingMethod: "Buy direct via tickets.formula1.com/en/f1-3277-hungary or f1hungary.com/en/tickets. Both are official channels carrying the full range from GA through grandstands. Hospitality tiers (Fan Lounge, Champions Club, Paddock Club) are sold via f1experiences.com.",
  howToBook: "If you're weighing tiers for Hungary specifically, the honest strategy is: book GA or a mid-tier grandstand as soon as you've decided you're going, since Hungary's low price point means people underestimate how fast the popular stands move, but don't feel pressured into a hospitality tier just because the base price feels cheap. The value gap between a good GA spot and full Paddock Club is larger here than at almost any other round, because the entry price is so low relative to what hospitality still costs. If you do want hospitality, book Paddock Club or a named-team suite by early spring, those sell out well ahead of the general public ticket rush that Hungary's affordability triggers closer to race weekend.",
  website: "https://tickets.formula1.com/en/f1-3277-hungary",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Your Hungarian GP Ticket Guide",
      subtitle: "GA, grandstands, or hospitality — what to buy on the calendar's most affordable weekend.",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Hungaroring, Mogyoród",
      address: "Hungaroring, 2146 Mogyoród, Hungary",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere: "See the Getting to the Hungaroring experience for the full metro/HÉV/shuttle route from Budapest.",
      editorialNote: "Sources: gpdestinations.com/budget-planner-hungarian-f1-grand-prix, gpdestinations.com/tickets-hungarian-f1-grand-prix, f1hungary.com/en/ticket-info/general-admission-6, f1experiences.com/2026-hungarian-grand-prix (Fan Lounge/Champions Club pricing). Verified 11 Jul 2026.",
      sport: ["formula_one"],
      moodTags: ["practical", "value", "planning"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "EUR",
      budgetMinCost: "72",
      budgetMaxCost: "3670",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-07-11",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

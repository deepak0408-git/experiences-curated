// Qatar GP 2026 — Experience 21/21: Doha Fan City Tour
// NOTE: research did not turn up a single dedicated, uniquely-branded
// "F1 & MotoGP Fan City Tour" product distinct from Doha's standard 4-hour
// city highlights tours (Corniche, Souq Waqif, Katara, The Pearl, National
// Museum) offered by multiple operators (GetYourGuide, Viator, tourHQ) —
// framed honestly as the general city-highlights tour format race weekend
// visitors use, rather than asserting a specific branded product that
// couldn't be independently verified.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DOHA_ID = "4e53af71-7526-4d55-bf81-5d57d6f22136";
const QATAR_GP_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";
const slug = "qatar-gp-doha-fan-city-tour-" + Date.now().toString(36);

const bodyContent = `For anyone flying in purely for the race and worried about missing the city entirely, Doha's standard highlights tour solves the problem in a single afternoon. Multiple operators (GetYourGuide, Viator, tourHQ among them) run essentially the same 4-hour format, with hotel pickup included, covering the Corniche waterfront, Souq Waqif, Katara Cultural Village, and The Pearl in one guided loop — the same four places this pack covers individually, but stitched into a single half-day with a guide who fills in the context between them.

The Corniche section walks a stretch of Doha Bay's curved waterfront promenade as the city wakes up or winds down, depending on the tour's timing. From there, most itineraries move through Souq Waqif's alleys, then Katara's arts district, then finish at The Pearl's marina — a genuine cross-section of the city's old and new sides in one trip. Some operators extend the format to include the National Museum of Qatar or the Old Dhow Harbour, and a few add interactive elements like a pottery or henna session with local artisans.

Pricing starts around $29 per person for shared group tours, with private options running higher — genuinely affordable for what amounts to a full orientation to the city. Reviews consistently praise knowledgeable, punctual guides, which matters most for visitors with limited time who don't want a rushed or disorganized afternoon eating into race-weekend hours.`;

const whyItsSpecial = `A single guided afternoon covering four districts solves a real problem for anyone on a tight race-weekend schedule: seeing Doha properly usually means picking two or three of its highlights and skipping the rest, or trying to self-navigate a city you don't know well in whatever spare hours the race schedule leaves. A guided tour compresses that decision into one afternoon with someone who already knows the city, which is worth the modest cost purely as time saved.

It's also the honest entry point for anyone unsure where to start — rather than choosing blind between this pack's individual Souq Waqif, Katara, Pearl, and museum entries, a first-timer can do the guided overview first, then come back independently to whichever district actually caught their interest.`;

const insiderTips = [
  "Book the tour for your arrival day or a rest day between sessions rather than race day itself — 4 hours is a real commitment against a schedule already built around practice, qualifying, and race timing.",
  "Compare a few operators' exact itineraries before booking — some include the National Museum of Qatar or Old Dhow Harbour and some don't, and that difference is worth knowing if one of those sites specifically interests you.",
];

const whatToAvoid = "Don't expect a race-specific or F1-branded tour product — research did not turn up a genuinely distinct, branded 'F1 fan tour' separate from Doha's standard city highlights tours; what's actually available is the general format, run by the same operators year-round. Don't book the shortest, cheapest option if you want the National Museum included — several of the standard 4-hour tours cover only Corniche, Souq Waqif, Katara, and The Pearl, with the museum as a separate add-on or a different, longer itinerary.";

const practicalInfo = {
  hours: "Typically 4-hour tours, morning or afternoon departures, hotel pickup included",
  costRange: "From approx. $29 per person (shared); private tours cost more",
  bookingMethod: "Book via GetYourGuide, Viator, or tourHQ — compare exact itineraries before booking, as inclusions vary by operator.",
  website: "https://www.viator.com/Doha-tours/City-Tours/d4453-g12-c5330",
  howToBook: "",
};

const gettingThere = "Hotel pickup included with most bookings — no independent transport required.";

const [inserted] = await db.insert(experiences).values({
  title: "Doha City Highlights Tour",
  subtitle: "Corniche, Souq Waqif, Katara, and The Pearl in one guided afternoon",
  slug,
  experienceType: "multi_day",
  status: "in_review",
  destinationId: DOHA_ID,
  bodyContent,
  whyItsSpecial,
  practicalInfo,
  gettingThere,
  insiderTips,
  whatToAvoid,
  sport: ["formula_one"],
  budgetTier: "budget",
  curationTier: "editorial",
  lastVerifiedDate: new Date().toISOString().slice(0, 10),
  editorialNote: "Sources: getyourguide.com, viator.com, tourhq.com (tour format, pricing, itinerary comparison). Research did not confirm a distinct, uniquely-branded 'F1 & MotoGP Fan City Tour' product separate from Doha's standard city highlights tour format — framed honestly as the general format rather than asserting an unverified branded product, per skill's sourcing standard. No single Google Maps rating — this is a tour product category across multiple operators, not one rateable venue.",
}).returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

await db.insert(sportingEventExperiences)
  .values({ experienceId: inserted.id, sportingEventId: QATAR_GP_EVENT_ID })
  .onConflictDoNothing();

console.log("Seeded:", inserted);

await client.end();

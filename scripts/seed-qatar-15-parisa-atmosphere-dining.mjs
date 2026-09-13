// Qatar GP 2026 — Experience 15/21: Parisa — Souq Waqif Atmosphere Dining
// NOTE: locked list named "La Boca" as the atmosphere-dining pick, but La
// Boca's real Google rating is 3.6/430 (weak, matches mixed review findings
// — long waits, average food per multiple reviewers). Per experience-
// researcher skill's rating rigor rule (never ship a weak recommendation
// when a better-attested alternative exists), swapped to Parisa Souq Waqif:
// 4.3/2,358 reviews, genuinely exceptional decor (hand-painted Persian
// murals, mosaics, chandeliers, 3.5-year build) — matches the "atmosphere"
// brief far better than La Boca ever did.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DOHA_ID = "4e53af71-7526-4d55-bf81-5d57d6f22136";
const QATAR_GP_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";
const slug = "qatar-gp-parisa-atmosphere-dining-" + Date.now().toString(36);

const bodyContent = `Parisa sits on Al Souq Street in the heart of Souq Waqif, and its interior alone is worth the trip regardless of what you order. The two-floor dining room is covered almost entirely in intricate mosaic work, hung with ornate chandeliers, and dotted with alcove tables framed by hand-painted murals depicting ancient Persian legends. Thousands of tiny mirrors, hand-selected from Iran, were assembled into the space over three and a half years of construction — this isn't themed decor bought off a catalog, it's a genuine, deliberate build.

The kitchen serves traditional Persian food: kebabs, fragrant rice dishes, and slow-cooked stews built around the same regional flavors the decor evokes. It's not fusion or a modernized reinterpretation — the food plays it straight, letting the room carry the spectacle.

Reviews back the atmosphere claim decisively: 4.3 on Google from 2,358 reviews, a large and consistently strong sample. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=15438691681693687908&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) Reservations are genuinely recommended, especially on weekends and during peak evening hours — this is one of Souq Waqif's most in-demand tables, not a walk-in backup option.`;

const whyItsSpecial = `Souq Waqif has no shortage of restaurants selling "atmosphere" as a marketing line, but few actually deliver on it the way Parisa does — this is a room built specifically to be photographed and remembered, not a functional dining space with some rugs added. The three-and-a-half-year construction timeline and hand-selected Iranian mirrors are the kind of detail that separates a genuinely committed design from a themed restaurant chasing the same idea cheaply.

It also solves a real problem for a race-weekend trip: an evening here works as an actual event, not just a meal, which matters when you're trying to give a group of traveling fans one dinner that feels like part of the trip rather than fuel between sessions.`;

const insiderTips = [
  "Book ahead specifically for a table in one of the mural-framed alcoves rather than open floor seating — the room's signature visual details are concentrated there, and a standard table misses much of what makes the space worth visiting.",
  "Weekend and peak-hour reservations fill genuinely fast given the restaurant's popularity — book at least a few days ahead if your race-weekend dates land on a Thursday or Friday night.",
];

const whatToAvoid = "Don't walk in expecting a table without a reservation on a weekend evening — this is one of Souq Waqif's most sought-after rooms, and walk-in waits can be long during peak hours. Don't come expecting a modernized or fusion take on Persian food — the kitchen serves it straight and traditional, so if you're looking for a contemporary reinterpretation, this isn't the room for that.";

const practicalInfo = {
  hours: "Lunch and dinner daily — confirm current hours via direct booking, reservations essential on weekends",
  costRange: "QAR 100–200 per person for a full Persian dinner",
  bookingMethod: "Reservations recommended via the restaurant directly or major booking platforms, especially weekends and peak evening hours.",
  website: "",
  howToBook: "",
};

const gettingThere = "Al Souq Street, Souq Waqif, central Doha — roughly 25-30 minutes by car or taxi from Lusail International Circuit.";

const [inserted] = await db.insert(experiences).values({
  title: "Parisa — Souq Waqif Atmosphere Dining",
  subtitle: "Hand-painted Persian murals, mosaics, and thousands of mirrors from Iran",
  slug,
  experienceType: "dining",
  status: "in_review",
  destinationId: DOHA_ID,
  bodyContent,
  whyItsSpecial,
  practicalInfo,
  gettingThere,
  insiderTips,
  whatToAvoid,
  sport: ["formula_one"],
  budgetTier: "moderate",
  curationTier: "editorial",
  lastVerifiedDate: new Date().toISOString().slice(0, 10),
  googleMapsRating: "4.3",
  googleMapsReviewCount: 2358,
  googleMapsUrl: "https://maps.google.com/?cid=15438691681693687908&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  editorialNote: "Sources: liveandletsfly.com, wareontheglobe.com (decor/build detail), tripadvisor.com. Google Places API lookup 12 Sep 2026: 4.3/2,358. Swapped from locked list's 'La Boca' pick — La Boca's real Google rating is 3.6/430 (weak, matches mixed reviews found: long waits, average food, service focused on turnover over quality). Parisa is a far stronger, better-attested atmosphere pick for the same slot — flagged to founder as a substitution, not silent.",
}).returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

await db.insert(sportingEventExperiences)
  .values({ experienceId: inserted.id, sportingEventId: QATAR_GP_EVENT_ID })
  .onConflictDoNothing();

console.log("Seeded:", inserted);

await client.end();

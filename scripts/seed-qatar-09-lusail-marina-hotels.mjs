// Qatar GP 2026 — Experience 9/21: Raffles Doha / Fairmont Doha (Lusail marina)

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DOHA_ID = "4e53af71-7526-4d55-bf81-5d57d6f22136";
const QATAR_GP_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";
const slug = "qatar-gp-lusail-marina-hotels-" + Date.now().toString(36);

const bodyContent = `Raffles Doha and Fairmont Doha share one striking tower complex on Lusail Marina, two hotel brands split across a single building roughly 150 metres from the water — and both sit closer to the circuit than almost anywhere else you could stay.

Raffles occupies the upper floors as an all-suite property: 132 suites, no standard rooms, each with a personal butler and floor-to-ceiling windows looking out over either the sea or the city skyline. It's ranked #2 of 12 hotels in Lusail on TripAdvisor — guests consistently single out the suite layouts and the views as the standout. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=15484831753459197357&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Fairmont Doha shares the same building and marina address but runs as its own distinct property beneath Raffles, with its own entrance, service, and room stock — a more conventional five-star hotel experience rather than the all-suite format above it. Reviews consistently mention immaculate housekeeping and the same striking Arabian Gulf views the location affords. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=17948980481003576429&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Both properties put you a short taxi ride from Lusail International Circuit rather than the 30-minute haul from West Bay or The Pearl — genuinely meaningful on race days when traffic backs up around the venue. The tradeoff is price: this is the most expensive base in Doha for race weekend, and rooms at both properties sell out early once the calendar date is confirmed.`;

const whyItsSpecial = `Staying in Lusail rather than central Doha isn't just convenience, it changes the shape of your race weekend. A 10-15 minute ride to the circuit instead of 30 means you can go back to your room between sessions, avoid the worst of the post-race exodus by waiting it out from a hotel bar instead of a shuttle queue, and generally spend less of the weekend in transit.

Choosing between the two properties in the same building comes down to format as much as budget: Raffles' all-suite structure suits a group or a longer stay where the extra space earns its keep, while Fairmont's more conventional room stock is the pick if you just need a genuinely excellent base for a few race-focused nights without paying for square footage you won't use.`;

const insiderTips = [
  "Both hotels share one physical building on Lusail Marina but operate as fully separate properties — check which brand you're actually booking, since search results for one sometimes surface the other by proximity.",
  "Rooms at both properties sell out well ahead of race weekend once the calendar date is confirmed each year — this is the closest, most convenient base to the circuit, and demand reflects that.",
];

const whatToAvoid = "Don't assume being in the same building means shared amenities or easy transfers between the two hotels — Raffles and Fairmont run independent front desks, restaurants, and pool/spa facilities despite the shared address. Don't book here expecting Doha city-center nightlife or the souq scene within walking distance — Lusail Marina is a purpose-built modern district, and Souq Waqif or The Pearl are both a taxi ride away, not a stroll.";

const practicalInfo = {
  hours: "Standard hotel check-in 3:00pm, check-out 12:00pm (Raffles); check-in 3:00pm, check-out 12:00pm (Fairmont)",
  costRange: "Premium tier — expect Doha's highest race-weekend rates at both properties; book early",
  bookingMethod: "Direct via raffles.com/doha or fairmont.com/doha, or major booking platforms — race-weekend availability tightens months ahead.",
  website: "https://www.raffles.com/doha, https://www.fairmont.com/doha",
  howToBook: "",
};

const gettingThere = "On Lusail Marina, roughly a 10-15 minute taxi ride to Lusail International Circuit — the closest hotel base to the venue of any option in Doha.";

const [inserted] = await db.insert(experiences).values({
  title: "Raffles Doha & Fairmont Doha",
  subtitle: "One marina tower, two five-star hotels, the closest base to the circuit",
  slug,
  experienceType: "accommodation",
  status: "in_review",
  destinationId: DOHA_ID,
  bodyContent,
  whyItsSpecial,
  practicalInfo,
  gettingThere,
  insiderTips,
  whatToAvoid,
  sport: ["formula_one"],
  budgetTier: "luxury",
  curationTier: "editorial",
  lastVerifiedDate: new Date().toISOString().slice(0, 10),
  editorialNote: "Sources: tripadvisor.com (Raffles #2/12 Lusail, 4/5, 779 reviews — cited as context only), Google Places API lookup 12 Sep 2026 (Raffles 4.6/1,848, Fairmont 4.5/3,238 — both used as the authoritative ratings per skill §2c). Multi-venue experience — 2 named, individually addressable properties, each with own inline Google Maps link.",
}).returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

await db.insert(sportingEventExperiences)
  .values({ experienceId: inserted.id, sportingEventId: QATAR_GP_EVENT_ID })
  .onConflictDoNothing();

console.log("Seeded:", inserted);

await client.end();

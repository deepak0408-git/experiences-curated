// Qatar GP 2026 — Experience 11/21: Marsa Malaz Kempinski, The Pearl

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DOHA_ID = "4e53af71-7526-4d55-bf81-5d57d6f22136";
const QATAR_GP_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";
const slug = "qatar-gp-pearl-hotel-" + Date.now().toString(36);

const bodyContent = `Marsa Malaz Kempinski sits on its own private island within The Pearl-Qatar, the man-made archipelago that's become Doha's most polished address for waterfront living and shopping. This is the genuine resort choice for a Qatar GP trip — a real alternative to basing yourself in Lusail for proximity or West Bay for the skyline.

The hotel's private beach runs nearly 500 feet, unusually long for a city-based property, and the resort leans into it: watersports, a real sense of separation from Doha's urban density despite being minutes from it by car. It sits steps from Qanat Quartier, Porto Arabia, and Medina Centrale — The Pearl's own dining and entertainment districts, so evenings don't require leaving the island at all if you don't want to.

The rating backs up the resort pitch decisively: 4.7 from 9,903 reviews on Google, one of the largest and strongest review samples of any hotel considered for this pack. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=6432638156363281648&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) Hamad International Airport is about 30 minutes away, and Lusail Circuit is a similar order of distance by car in the other direction — this is not the closest base to the track, but it trades that proximity for a genuinely resort-grade stay.`;

const whyItsSpecial = `Most F1 trips treat accommodation purely as circuit logistics — how close, how fast the commute. The Pearl flips that calculation: you're choosing a resort experience first, and accepting a longer transfer to the track as the cost of it. For a fan combining the race with an actual holiday, rather than a pure in-and-out race weekend, that tradeoff makes real sense — a private beach and island-district dining beat a marina tower's convenience if you're staying multiple extra days either side of the race.

The review count itself is worth noting: 9,903 reviews at a 4.7 average is a genuinely large, hard-to-fake sample, giving real confidence in the rating rather than the thinner samples some of Doha's newer properties carry.`;

const insiderTips = [
  "The Pearl's own dining and entertainment districts (Qanat Quartier, Porto Arabia, Medina Centrale) are walkable from the hotel — plan at least one non-race evening around them rather than heading back into central Doha.",
  "Factor a genuinely longer circuit transfer into your race-day planning than a Lusail marina stay would require — this is a resort-first choice, and the tradeoff is worth knowing before you're timing a Sunday departure.",
];

const whatToAvoid = "Don't book here expecting the shortest possible commute to the circuit — Lusail's marina hotels are meaningfully closer, and The Pearl is a deliberate tradeoff of proximity for resort quality. Don't assume every Pearl-area property shares this hotel's private island setting — several nearby options sit on the main Pearl development itself rather than a separated private-island footprint, which changes the actual beach access and sense of seclusion.";

const practicalInfo = {
  hours: "Standard check-in 3:00pm, check-out 12:00pm",
  costRange: "Luxury tier — resort pricing, comparable to or above Lusail's marina towers depending on season",
  bookingMethod: "Direct via kempinski.com or major booking platforms.",
  website: "https://www.kempinski.com/en/marsa-malaz-kempinski-the-pearl-doha",
  howToBook: "",
};

const gettingThere = "On a private island within The Pearl-Qatar, roughly 30 minutes from Hamad International Airport and a similar drive to Lusail International Circuit.";

const [inserted] = await db.insert(experiences).values({
  title: "Marsa Malaz Kempinski, The Pearl",
  subtitle: "A private island beach resort, trading circuit proximity for a real holiday base",
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
  googleMapsRating: "4.7",
  googleMapsReviewCount: 9903,
  googleMapsUrl: "https://maps.google.com/?cid=6432638156363281648&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  editorialNote: "Sources: kempinski.com (official location/amenities), destination2.co.uk, forbestravelguide.com. Google Places API lookup 12 Sep 2026: 4.7/9,903 reviews. Chose Marsa Malaz Kempinski over The Ritz-Carlton Doha (locked list named both as options) because the Ritz-Carlton sits on its own private island near West Bay, not on The Pearl-Qatar itself — Marsa Malaz Kempinski is the accurately-located Pearl property.",
}).returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

await db.insert(sportingEventExperiences)
  .values({ experienceId: inserted.id, sportingEventId: QATAR_GP_EVENT_ID })
  .onConflictDoNothing();

console.log("Seeded:", inserted);

await client.end();

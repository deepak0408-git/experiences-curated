// Qatar GP 2026 — Experience 14/21: Sawa by Sanad

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DOHA_ID = "4e53af71-7526-4d55-bf81-5d57d6f22136";
const QATAR_GP_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";
const slug = "qatar-gp-sawa-by-sanad-" + Date.now().toString(36);

const bodyContent = `Sawa by Sanad sits on the first floor of a private members' club on Mohammed Bin Jassim Street in Msheireb Downtown, Doha's rejuvenated city center — and despite the members' club setting, it's open to anyone, no membership required to eat there.

Executive Chef Anas Tabbara runs a modern Levantine menu built around sharing: Palestinian lamb maqlouba, chicken za'atar, and more experimental dishes like madrouba balls sit alongside classics, all designed to land in the middle of the table rather than as individual plates. The kitchen steps up its theatre at dinner — several dishes arrive tableside via trolley service, a deliberate flourish that separates the evening menu from a standard lunch sitting. Tabbara's Lebanese heritage runs through the cooking, filtered through techniques that push the dishes past straightforward tradition without losing what makes them recognizably Levantine.

The restaurant earned a place in the Michelin Guide – Doha 2025, real external validation in a city whose fine-dining scene is still relatively young. Guest ratings back that up: 4.6 on Google from 299 reviews — a smaller sample than some of Doha's longer-established spots, but a consistently strong score. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=13287209959574773534&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)`;

const whyItsSpecial = `A Michelin Guide listing in Doha carries real weight precisely because there aren't many of them yet — this is a city building its fine-dining credibility in real time, and Sawa by Sanad is one of the restaurants doing the actual work of that, not coasting on hotel-brand recognition the way much of Doha's upscale dining does.

The sharing-format menu and trolley theatre also make it a genuinely good choice for a group trip built around a race weekend — this is food meant to be eaten together, argued over, and lingered on, which suits a table of fans decompressing after a day at the circuit better than a formal tasting menu would.`;

const insiderTips = [
  "The trolley-service dishes only run at dinner — if you're eating lunch here, expect a simpler, faster service style than the full evening experience the restaurant is known for.",
  "No membership is required despite the private-club setting, but the location inside the club means it's easy to miss on a first pass — confirm the Mohammed Bin Jassim Street entrance before you arrive rather than expecting obvious street-level restaurant signage.",
];

const whatToAvoid = "Don't order as if this were a single-plate-per-person restaurant — the menu is built for sharing, and ordering individually will both cost more and miss the point of dishes like the maqlouba, meant to be split across the table. Don't assume walk-in availability on a Friday or Saturday night during race weekend — with a genuinely limited review count for a Michelin-listed room, tables likely turn over less and book out faster than a larger, more established restaurant.";

const practicalInfo = {
  hours: "Lunch and dinner service, evening trolley theatre — confirm current hours via OpenTable or direct booking",
  costRange: "QAR 150–300 per person for a full sharing-style dinner",
  bookingMethod: "Reservations via OpenTable (opentable.com) recommended, particularly for dinner during race weekend.",
  website: "https://www.opentable.com/r/sawa-by-sanad-doha",
  howToBook: "",
};

const gettingThere = "Mohammed Bin Jassim Street, Msheireb Downtown, central Doha — roughly 25-30 minutes by car or taxi from Lusail International Circuit.";

const [inserted] = await db.insert(experiences).values({
  title: "Sawa by Sanad",
  subtitle: "Modern Levantine sharing plates and trolley theatre, Michelin-listed in Msheireb",
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
  budgetTier: "splurge",
  curationTier: "editorial",
  lastVerifiedDate: new Date().toISOString().slice(0, 10),
  googleMapsRating: "4.6",
  googleMapsReviewCount: 299,
  googleMapsUrl: "https://maps.google.com/?cid=13287209959574773534&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  editorialNote: "Sources: guide.michelin.com (Michelin Guide Doha 2025 listing, chef/menu detail), opentable.com, joinpearl.co. Google Places API lookup 12 Sep 2026: 4.6/299 reviews.",
}).returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

await db.insert(sportingEventExperiences)
  .values({ experienceId: inserted.id, sportingEventId: QATAR_GP_EVENT_ID })
  .onConflictDoNothing();

console.log("Seeded:", inserted);

await client.end();

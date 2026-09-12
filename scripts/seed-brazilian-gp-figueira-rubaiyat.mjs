import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb";
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const slug = "brazilian-gp-figueira-rubaiyat-" + Date.now().toString(36);

const bodyContent = `A Figueira Rubaiyat is built, quite literally, around a tree. A Bengal fig, well over a century old, grows through the middle of the dining room with a glass roof built around its crown so the branches spread out overhead while you eat underneath them — it's the kind of detail that sounds gimmicky described in a sentence and isn't at all in person. This is the flagship of the Rubaiyat Group, which raises its own cattle on family-owned farms and runs a genuine farm-to-table operation rather than just claiming one.

The menu runs on Mediterranean-inflected Brazilian steakhouse cooking rather than the all-you-can-eat rodízio format some visitors expect from a São Paulo steakhouse — you order specific cuts rather than working through a parade of skewers. Baby beef, Denver steak, filet mignon, and the restaurant's own "master beef" are the names to know, alongside tirita de picanha, a thin-sliced picanha preparation that's become one of the house signatures. Portions and preparation lean toward precision rather than volume, which is a deliberate departure from the everything-included churrascaria model.

It's a genuinely full production — white tablecloths, formal service, the kind of restaurant Michelin's own guide includes in its São Paulo coverage — and prices track that positioning. This isn't a casual weeknight steak dinner; it's a destination meal, and reservations matter more here than at most restaurants in the city given how much of the draw is the room itself, not just the food.`;

const whyItsSpecial = `Most restaurants built around a striking physical feature let the feature do the work and coast on it. Figueira Rubaiyat doesn't — the tree gets you in the door, but the reason it holds a genuinely strong, large-sample rating [(see live rating and reviews on Google Maps)](https://maps.google.com/?cid=14705861141891347893&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) is that the meat program underneath it is genuinely serious — a group that raises its own cattle and builds a Mediterranean-inflected menu around specific, named cuts rather than a rodízio free-for-all. It's the rare case where the Instagram-worthy setting and the actual quality of the cooking both hold up under scrutiny, instead of one covering for the other.`;

const insiderTips = [
  "This isn't a rodízio (all-you-can-eat) format — you order individual cuts à la carte, so pace your ordering and ask your server for portion guidance if you're used to the endless-skewer style of Brazilian steakhouse.",
  "Reservations matter more here than the price point alone would suggest, precisely because of the tree — request a table with a clear view up into the canopy when booking, since not every table in the room gets the same sightline.",
];

const whatToAvoid = `Don't come expecting a rodízio-style, all-you-can-eat parade of skewers — this is à la carte fine dining, and ordering strategy (and the bill) work completely differently from that format. And don't treat this as a quick pre-race-day dinner if you're on a tight schedule — full-production table service and a room this considered move at a proper dinner pace, not a fast-turnaround one, so build in real time rather than squeezing it between other plans.`;

const practicalInfo = {
  hours: "Daily from 12:00pm — Mon-Thu to 12:30am, Fri-Sat to 1:00am, Sun to midnight",
  costRange: "Fine-dining steakhouse pricing — expect roughly US$60-100+ per person for a full meal with wine",
  bookingMethod: "Reservations strongly recommended, especially for dinner — book via the Rubaiyat Group's website or by phone.",
  website: "https://gruporubaiyat.com/en/restaurantes/sao-paulo/a-figueira-rubaiyat",
};

const gettingThere = "Rua Haddock Lobo, 1738, Jardins-adjacent (Pinheiros side), São Paulo. Reachable by taxi/rideshare from Jardins, Itaim Bibi, or Vila Nova Conceição in 10-15 minutes; the nearest metro station is Consolação or Oscar Freire on Line 4 (Yellow), followed by a short walk or ride.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "A Figueira Rubaiyat — Under the Fig Tree",
      subtitle: "Michelin-listed steakhouse from the group that raises its own cattle",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Jardins / Pinheiros",
      address: "Rua Haddock Lobo, 1738, Jardim Paulista, 01414-002 São Paulo, SP, Brazil",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Restaurant description (century-old Bengal fig tree with glass roof, farm-to-table/own-farm cattle, à la carte not rodízio format, named cuts including tirita de picanha) sourced from Michelin Guide's own São Paulo listing and Grupo Rubaiyat's official site, 11 Sep 2026. Hours sourced from Frommer's and aggregator listings, cross-checked, 11 Sep 2026. Real Google Maps rating confirmed via Places API, 11 Sep 2026: 4.6/10,946 reviews — a large, well-attested sample. Currently trading confirmed via Michelin Guide's active listing.",
      sport: ["formula_one"],
      moodTags: ["upscale", "romantic", "distinctive"],
      interestCategories: ["food"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-11",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 10946,
      googleMapsUrl: "https://maps.google.com/?cid=14705861141891347893&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #11 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

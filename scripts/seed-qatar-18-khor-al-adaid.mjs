// Qatar GP 2026 — Experience 18/21: Khor Al Adaid (Inland Sea) Desert Safari

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DOHA_ID = "4e53af71-7526-4d55-bf81-5d57d6f22136";
const QATAR_GP_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";
const slug = "qatar-gp-khor-al-adaid-" + Date.now().toString(36);

const bodyContent = `Khor Al Adaid, the Inland Sea, sits roughly 80km southeast of Doha, at the point where the Arabian Gulf pushes directly into the desert — one of very few places on the planet where open sea and sand dunes meet with no coastline between them. It's a UNESCO-recognized natural reserve with a genuine ecosystem of its own, not just a scenic sand-and-water photo stop.

Getting there is most of the experience. Guided tours run 4-8 hours door-to-door with hotel pickup from Doha, covering dune bashing in a 4x4 across the rolling desert terrain before reaching the Inland Sea itself, where operators typically add camel rides, sandboarding, or ATV/quad biking, then a stop at a desert camp for tea, coffee, or a full meal depending on the tour length. Shared group tours run roughly $40-80 per person; private tours land higher, generally $150-300.

365 Adventures is one of the better-reviewed operators running these trips, rated 4.9 on Google from 475 reviews — a genuinely strong score on a solid sample size. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=8962723100588617245&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) November through March is the best window to visit, both for milder temperatures during the drive and dune activities, and for late-afternoon light at the Inland Sea itself, which regularly produces the best photography of the trip — timing that lines up well with a late-November race weekend.`;

const whyItsSpecial = `Nothing else on this list gets you out of Doha entirely, and that's exactly the point. A race weekend built purely around the circuit and the city misses the fact that most of Qatar is genuine, undeveloped desert — Khor Al Adaid is the one experience on this list that shows you that side of the country directly, rather than through a museum exhibit about it.

The geography itself is the real draw: sea meeting sand with no buffer between them is unusual anywhere in the world, and doing it as a half-day trip from Doha means it fits realistically into a multi-day race weekend without requiring you to sacrifice a full day you'd rather spend at the circuit or in the city.`;

const insiderTips = [
  "Book a late-afternoon or sunset-timed tour specifically — the light at that hour is what consistently produces the best photos at the Inland Sea, and several operators offer that exact time slot deliberately.",
  "If dune bashing makes you carsick, say so when booking — operators can moderate driving intensity on request, and it's easier to flag before the tour starts than to ask mid-drive.",
];

const whatToAvoid = "Don't book the shortest 4-hour option if you specifically want the sunset timing and a full camp meal — those usually require the longer 6-8 hour tours, so check exactly what's included before assuming a shorter, cheaper tour covers everything. Don't underestimate the desert heat even in late November — Doha's daytime temperatures can still run warm midday, so bring water and sun protection regardless of the season.";

const practicalInfo = {
  hours: "Tours typically run afternoon into evening, 4-8 hours door-to-door — best season November-March",
  costRange: "$40-80 per person shared tour; $150-300+ private tour",
  bookingMethod: "Book via GetYourGuide, Viator, or directly with operators like 365 Adventures — hotel pickup typically included.",
  website: "https://365adventures.me/",
  howToBook: "",
};

const gettingThere = "Roughly 80km southeast of Doha — accessed via guided tour with hotel pickup, not practical to reach independently without an experienced desert driver.";

const [inserted] = await db.insert(experiences).values({
  title: "Khor Al Adaid (Inland Sea) Desert Safari",
  subtitle: "Where the Arabian Gulf meets the dunes, no coastline in between",
  slug,
  experienceType: "natural_wonder",
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
  googleMapsRating: "4.9",
  googleMapsReviewCount: 475,
  googleMapsUrl: "https://maps.google.com/?cid=8962723100588617245&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  editorialNote: "Sources: tripadvisor.com, getyourguide.com, triplinkhub.com, experience.qa (tour structure, pricing, best season). Google Places API lookup 12 Sep 2026: Inland Sea itself has no rating (natural site, not a rateable business — left blank per skill §2c); 365 Adventures operator 4.9/475 used as the representative operator rating.",
}).returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

await db.insert(sportingEventExperiences)
  .values({ experienceId: inserted.id, sportingEventId: QATAR_GP_EVENT_ID })
  .onConflictDoNothing();

console.log("Seeded:", inserted);

await client.end();

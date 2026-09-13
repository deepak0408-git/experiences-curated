// Qatar GP 2026 — Experience 12/21: Four Seasons Hotel Doha, West Bay

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DOHA_ID = "4e53af71-7526-4d55-bf81-5d57d6f22136";
const QATAR_GP_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";
const slug = "qatar-gp-west-bay-hotel-" + Date.now().toString(36);

const bodyContent = `Four Seasons Hotel Doha sits directly on the Corniche in West Bay, Doha's central business and residential waterfront — the pick for anyone who wants the actual city, not a marina district or an island resort, as their race-weekend base.

The property runs 237 rooms and suites, ten separate dining venues, five outdoor pools (including a palm-fringed grotto and a family pool with slides), a 250m private beach, and its own 110-berth marina. Every room looks out over either the Arabian Gulf or Doha's skyline — the white stone, latticework-domed building is itself a genuine city landmark on the Corniche waterfront, not just a hotel with a view of one.

The location is the real draw: West Bay puts you within reach of the Museum of Islamic Art, the Corniche promenade itself, and central Doha's business district, all without needing a taxi first. The tradeoff against Lusail's marina hotels is distance to the circuit — West Bay runs about 30 minutes to Lusail International Circuit by car, roughly double the transfer from Raffles or Fairmont, though still entirely manageable for race day.

Guest ratings back the pitch: 4.6 on Google from 4,968 reviews, a strong score on a large, credible sample. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=14528869250272066171&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)`;

const whyItsSpecial = `West Bay is the choice for anyone treating this as a Doha trip with a race attached, rather than a race trip that happens to be in Doha. Four Seasons puts the city's genuine landmarks — the Corniche, the Museum of Islamic Art, central Doha's skyline — at your doorstep in a way no Lusail or Pearl property can match, because those districts are deliberately separate from the city center.

The extra 15-20 minutes to the circuit is a real cost, but it's a small one against what you gain: a base that works just as well for the days before and after the race as it does for the race itself, which matters more the longer your actual trip runs.`;

const insiderTips = [
  "West Bay's Corniche location puts the Museum of Islamic Art and central Doha's business district walkable or a short taxi away — genuinely useful on rest days, unlike Lusail or Pearl bases which require a longer trip into the city center.",
  "Budget roughly 30 minutes to the circuit from here versus 10-15 from Lusail's marina hotels — factor that into race-day timing, especially for the earlier practice sessions.",
];

const whatToAvoid = "Don't choose West Bay purely for circuit proximity — it's the furthest of this pack's hotel picks from Lusail International Circuit, and the case for staying here is really about the city itself, not the shortest commute. Don't assume all West Bay hotels share this property's private beach and marina — several nearby high-rises are business-hotel format without beachfront access, so confirm the specific amenities before assuming they carry over from one address to a similarly-located one.";

const practicalInfo = {
  hours: "Standard check-in 3:00pm, check-out 12:00pm",
  costRange: "Luxury tier — comparable to Doha's other five-star properties",
  bookingMethod: "Direct via fourseasons.com/doha or major booking platforms.",
  website: "https://www.fourseasons.com/doha/",
  howToBook: "",
};

const gettingThere = "On the Corniche in West Bay, roughly 30 minutes by car to Lusail International Circuit and close to Hamad International Airport by comparison to Lusail-based properties.";

const [inserted] = await db.insert(experiences).values({
  title: "Four Seasons Hotel Doha, West Bay",
  subtitle: "A Corniche landmark base for the city, with a real drive to the circuit",
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
  googleMapsRating: "4.6",
  googleMapsReviewCount: 4968,
  googleMapsUrl: "https://maps.google.com/?cid=14528869250272066171&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  editorialNote: "Sources: fourseasons.com, forbestravelguide.com, visitqatar.com (location, amenities). Google Places API lookup 12 Sep 2026: 4.6/4,968 reviews. Chose Four Seasons over W Doha (locked list named both) as the more distinctly landmark/Corniche-located option.",
}).returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

await db.insert(sportingEventExperiences)
  .values({ experienceId: inserted.id, sportingEventId: QATAR_GP_EVENT_ID })
  .onConflictDoNothing();

console.log("Seeded:", inserted);

await client.end();

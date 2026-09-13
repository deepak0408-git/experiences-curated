// Qatar GP 2026 — Experience 19/21: The Pearl-Qatar & Katara Cultural Village

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DOHA_ID = "4e53af71-7526-4d55-bf81-5d57d6f22136";
const QATAR_GP_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";
const slug = "qatar-gp-pearl-katara-" + Date.now().toString(36);

const bodyContent = `The Pearl-Qatar and Katara Cultural Village sit close enough together, both near West Bay, to make a natural evening pairing — one built for waterfront strolling and dining, the other for art and culture.

The Pearl is a man-made island, and Porto Arabia is its premium marina district: a 2.5km perimeter promenade lined with shops, restaurants, and cafés, with a covered, air-conditioned section for the hottest stretches of the year. It's genuinely at its best in the evening — lights come on along the marina, white yachts reflect in the water, and the whole promenade shifts from a daytime shopping walk into something closer to a proper waterfront night out. Google rates it 4.7 from 3,716 reviews. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=1994642396813798790&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Katara Cultural Village is a dedicated arts and culture district nearby, built around an open-air amphitheater, galleries, mosques architecturally significant in their own right, and a genuine restaurant scene. It's less about shopping and more about atmosphere and programming — exhibitions, performances, and public art fill the district in a way The Pearl's marina doesn't attempt. Its Google rating is equally strong, 4.7 from a remarkable 35,387 reviews — one of the largest review samples of any attraction covered in this pack. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=1269242859052149405&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Both sit near West Bay and Lusail, making a single evening covering both entirely realistic without a long drive between them.`;

const whyItsSpecial = `These two districts give you Doha's evening life from two different angles in one trip: The Pearl for the polish and spectacle of a purpose-built luxury marina, Katara for the substance of a genuine arts district with public programming that changes what's on offer depending on when you visit. Neither is a single sight to check off — both reward simply walking and being there as the sun goes down.

Katara's review count in particular is worth noting — 35,387 reviews is an extraordinary sample size, reflecting just how central this district has become to how both residents and visitors actually spend their evenings in Doha, not just a tourist-facing attraction built for visitors passing through.`;

const insiderTips = [
  "Time your visit to Porto Arabia specifically for early evening — the promenade's lighting and marina reflections are consistently cited as the best version of the experience, and it's a different atmosphere entirely from a daytime walk.",
  "Check Katara's amphitheater and gallery programming ahead of your visit — what's on varies by date, and a night with a scheduled performance or exhibition opening is a meaningfully different visit than an evening with nothing programmed.",
];

const whatToAvoid = "Don't plan a midday visit to either district expecting the same atmosphere as evening — both are genuinely built around and best experienced after sunset, and a hot Doha afternoon walk misses most of what makes them worth visiting. Don't assume Katara is primarily a shopping district — unlike The Pearl's Porto Arabia, its focus is arts and culture programming, and visitors expecting retail will find a different kind of district than they anticipated.";

const practicalInfo = {
  hours: "Open-air districts, generally accessible day and night — restaurants and galleries keep their own hours, evenings recommended",
  costRange: "Free to walk both districts — cost depends entirely on dining/shopping choices",
  bookingMethod: "No booking required for the districts themselves — check individual venue/gallery hours and any ticketed events at Katara's amphitheater separately.",
  website: "https://visitqatar.com/intl-en/things-to-do/romantic-getaway/places/the-pearl",
  howToBook: "",
};

const gettingThere = "Both near West Bay, roughly 30 minutes by car or taxi from Lusail International Circuit — close enough to each other for a single evening covering both.";

const [inserted] = await db.insert(experiences).values({
  title: "The Pearl-Qatar & Katara Cultural Village",
  subtitle: "A luxury marina promenade and a genuine arts district, both best after sunset",
  slug,
  experienceType: "neighborhood",
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
  editorialNote: "Sources: visitqatar.com, qatartourism.com, artandthensome.com (Pearl/Porto Arabia detail), general Katara district research. Google Places API lookup 12 Sep 2026: The Pearl Island 4.7/3,716, Katara Cultural Village 4.7/35,387. Multi-venue experience — MULTI_VENUE_RATINGS entry required before considered done.",
}).returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

await db.insert(sportingEventExperiences)
  .values({ experienceId: inserted.id, sportingEventId: QATAR_GP_EVENT_ID })
  .onConflictDoNothing();

console.log("Seeded:", inserted);

await client.end();

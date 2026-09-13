// Qatar GP 2026 — Experience 13/21: Qatari Cuisine in Souq Waqif

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DOHA_ID = "4e53af71-7526-4d55-bf81-5d57d6f22136";
const QATAR_GP_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";
const slug = "qatar-gp-qatari-cuisine-souq-" + Date.now().toString(36);

const bodyContent = `Souq Waqif holds two genuinely distinct food stops worth seeking out beyond the general dining crawl — one built around a real story, the other a decades-old institution.

Shay Al Shomous sits in one corner of the souq, owned and actively run by Shams Al Qassabi, a Qatari mother of five who built the restaurant around traditional home cooking. The menu runs authentic Qatari breakfast and daytime dishes: baid shakshoka (scrambled eggs), aseeda (a local wheat or corn porridge), khobiz regag (thin crepe-style bread, best ordered with honey and cheese per repeat reviewer praise), macboush (rice with chicken, lamb, or goat, marinated in tomato paste and crisped in a hot oven), and balaleet, a sweet vermicelli-and-egg breakfast dish flavored with turmeric and sugar. It's also a genuine symbol of women's financial independence in Qatar — Sheikha Moza herself visited the restaurant and its owner in 2014, a real stamp of national recognition. Google rates it 4.2 from 919 reviews. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=2672075516113976573&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Al Aker Sweets, in the heart of the souq, is the city's benchmark for Arabic sweets — over 10 branches across Qatar, but this is the original, high-energy flagship location. The signature is cheese kunafa: crisp, thin pastry over a rich, stretchy cheese filling, alongside Umm Ali (a Middle Eastern bread pudding) and a range of Turkish sweets. Prices are genuinely modest and portions large enough to split. Google rates it 4.4 from 1,316 reviews, and it ranks in the top third of over 1,500 restaurants across Doha on TripAdvisor. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=14867311994093836247&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)`;

const whyItsSpecial = `These two stops give you Qatari food culture from opposite ends: Shay Al Shomous is home cooking made public, run by the woman who cooks it, with a real national story attached — not a tourist reproduction of Qatari cuisine but the real thing, served by the person who owns the recipes. Al Aker Sweets is the opposite kind of authenticity, an institution scaled up to ten-plus branches without losing the thing that made the original worth visiting.

Together they cover what most fan itineraries miss entirely at Souq Waqif — actual Qatari cooking, not just the souq's broader pan-Arab and international dining options that happen to be easier to find.`;

const insiderTips = [
  "Order the honey and cheese regag at Shay Al Shomous specifically — it's the dish reviewers single out most consistently, and it's not always obvious on a menu otherwise full of unfamiliar names.",
  "Al Aker Sweets' cheese kunafa is best eaten fresh and warm — if you're taking a box to go, know it loses the crisp-edge texture that makes it worth visiting for in the first place.",
];

const whatToAvoid = "Don't visit Shay Al Shomous expecting dinner service — its menu and reputation are built around breakfast and daytime Qatari dishes, and it may not run a full evening menu. Don't mistake Al Aker Sweets' other Doha branches for interchangeable with the Souq Waqif flagship — reviews consistently point to this specific central-souq location as the standout, and quality/atmosphere at other branches isn't guaranteed to match.";

const practicalInfo = {
  hours: "Souq Waqif generally open daily, individual restaurant hours vary — Shay Al Shomous leans breakfast/daytime, Al Aker Sweets runs later into the evening",
  costRange: "QAR 20–60 per person at both — genuinely inexpensive by Doha standards",
  bookingMethod: "Walk-in, no reservations typically required at either.",
  website: "",
  howToBook: "",
};

const gettingThere = "Both sit within Souq Waqif, central Doha — accessible via taxi or the Doha Metro (Souq Waqif station on the Green Line), roughly 30 minutes from Lusail International Circuit.";

const [inserted] = await db.insert(experiences).values({
  title: "Qatari Cuisine in Souq Waqif",
  subtitle: "A woman-owned home-cooking institution and the city's kunafa benchmark",
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
  budgetTier: "budget",
  curationTier: "editorial",
  lastVerifiedDate: new Date().toISOString().slice(0, 10),
  editorialNote: "Sources: afar.com, evendo.com, postcard.inc (Shay Al Shomous story/menu), tripadvisor.com + foodiejemdiaries.com (Al Aker Sweets). Google Places API lookup 12 Sep 2026: Shay Al Shomous 4.2/919, Al Aker Sweets 4.4/1,316. Multi-venue experience — MULTI_VENUE_RATINGS entry required before considered done.",
}).returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

await db.insert(sportingEventExperiences)
  .values({ experienceId: inserted.id, sportingEventId: QATAR_GP_EVENT_ID })
  .onConflictDoNothing();

console.log("Seeded:", inserted);

await client.end();

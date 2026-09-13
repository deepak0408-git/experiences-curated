// Qatar GP 2026 — Experience 20/21: Souq Waqif (the souq itself)
// Distinct from experience 13 (Qatari cuisine dining picks within the souq)
// and experience 15 (Parisa, atmosphere dining within the souq) — this
// experience covers the souq as a place/walk, not specific restaurants.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DOHA_ID = "4e53af71-7526-4d55-bf81-5d57d6f22136";
const QATAR_GP_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";
const slug = "qatar-gp-souq-waqif-" + Date.now().toString(36);

const bodyContent = `Souq Waqif began as a riverbank trading spot, where Doha's early residents gathered along a wadi to buy and sell goods long before the city existed in any modern form — the market's name literally means "the standing market." A fire in 2003 destroyed what remained of the original structure, and rather than replace it with something modern, Qatar rebuilt it deliberately in 19th-century style: whitewashed mud-rendered walls, roofs of wood and bamboo bound with clay and straw, thick mason construction throughout. It's a modern building with heritage as its actual design brief, not a preserved original — worth knowing before assuming everything here is centuries old.

The market runs a genuine maze of alleys given over to spices, textiles, traditional clothing, souvenirs, and shisha cafés, but its most distinctive section is the Falcon Souq, tucked between Al Asmakh and Al Ahmed streets, where falconry equipment and the birds themselves are bought, sold, and traded. Falconry runs deep in Gulf culture, treated here as genuine heritage sport rather than a tourist novelty, and the Falcon Hospital on site — open since 2008, reportedly the world's only dedicated falcon hospital — treats up to 150 birds a day during its September-to-January peak season, which lines up almost exactly with race weekend.

The souq comes alive specifically at night: cooler temperatures, lit alleyways, and a genuinely different energy than the same streets carry during the day. Google rates it 4.7 from 34,013 reviews — one of the largest, most decisively positive review samples of any attraction in Doha. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=15414791335277025032&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)`;

const whyItsSpecial = `Most fans treat Souq Waqif purely as a dinner destination — somewhere to eat before or after the race — and miss that the souq itself is worth a dedicated, unhurried walk on its own terms. The Falcon Souq specifically is something few visitors from outside the Gulf have any real context for, and seeing live falconry trade and a working falcon hospital operating at genuine volume gives a window into a heritage practice that's easy to read about but rarely encountered directly.

The rebuild's own story matters too — this isn't an ancient site that happened to survive, it's a deliberate act of cultural reconstruction after a fire nearly erased it, built specifically to keep Qatari heritage visible and walkable rather than confined to a museum case. Walking it with that context changes what you're actually looking at.`;

const insiderTips = [
  "Visit the Falcon Souq and Falcon Hospital specifically during the September-January peak season, which overlaps directly with race weekend — this is when the district is busiest and most active, not a quiet off-season stretch.",
  "Come back after dark even if you've already walked the souq in daylight — the lit alleys and cooler temperatures genuinely change the character of the place, and many visitors only ever see the daytime version.",
];

const whatToAvoid = "Don't assume the buildings are original historic structures — the entire souq was rebuilt in 2006 after a 2003 fire, deliberately styled after 19th-century Qatari architecture rather than preserved from that era, worth knowing before treating every wall as centuries-old. Don't treat the Falcon Souq as a casual photo-op without checking etiquette first — live birds and working falconers are present, and this is a genuine trade district, not a staged display built for tourists.";

const practicalInfo = {
  hours: "Generally open daily, most shops and cafés active late afternoon into late evening",
  costRange: "Free to walk — cost depends entirely on shopping and dining choices",
  bookingMethod: "No booking required — open, walkable market district.",
  website: "",
  howToBook: "",
};

const gettingThere = "Central Doha, accessible via taxi or the Doha Metro (Souq Waqif station on the Green Line) — roughly 30 minutes by car from Lusail International Circuit.";

const [inserted] = await db.insert(experiences).values({
  title: "Souq Waqif",
  subtitle: "A 19th-century-style market rebuilt after fire, home to a working falcon hospital",
  slug,
  experienceType: "cultural_site",
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
  googleMapsRating: "4.7",
  googleMapsReviewCount: 34013,
  googleMapsUrl: "https://maps.google.com/?cid=15414791335277025032&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  editorialNote: "Sources: en.wikipedia.org/wiki/Souq_Waqif, visitdoha.com (Falcon Souq/hospital detail), wanderlustmagazine.com, akdn (2003 fire, 2006 rebuild history). Google Places API lookup 12 Sep 2026: 4.7/34,013 reviews. Distinct from experience 13 (dining picks within the souq) and experience 15 (Parisa) — this covers the souq as a place, restored after being dropped from an earlier draft per founder's correction.",
}).returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

await db.insert(sportingEventExperiences)
  .values({ experienceId: inserted.id, sportingEventId: QATAR_GP_EVENT_ID })
  .onConflictDoNothing();

console.log("Seeded:", inserted);

await client.end();

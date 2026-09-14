// Qatar GP 2026 — Experience 3/21: Lusail Hill Lounge

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DOHA_ID = "4e53af71-7526-4d55-bf81-5d57d6f22136";
const QATAR_GP_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";
const slug = "qatar-gp-lusail-hill-lounge-" + Date.now().toString(36);

const bodyContent = `Lusail Hill Lounge is the middle ground Qatar's ticket structure doesn't otherwise offer — a real step up from General Admission without the full Paddock Club or Champions Club price tag or formality.

The lounge sits at Turn 1, on the same elevated ground as the free Lusail Hill general admission area, but fenced off into its own tiered open-air terrace with day lounges, proper tables and chairs, and cabana seating for anyone who wants shade or privacy. The view covers Turn 1 and Turn 2, plus a long look back down the main straight — genuinely one of the circuit's best natural viewing points, since Lusail Hill itself was purpose-built as an elevated public vantage spot before the lounge product was layered on top of it.

Food runs as a gourmet street-food bar with modern selections served continuously through the day, alongside a free-flowing premium open bar — a different, less formal service style than the seated dining in Paddock Club or Champions Club. The package also folds in curated local cultural activations, giving it a genuinely Qatari flavor the two pit-side hospitality tiers don't really attempt. Dedicated parking and a dedicated hospitality team round out the practical side.

Three-day packages run in the region of £3,449 per person (roughly US$4,300+, converted at current rates) — well below Champions Club, and positioned as the hospitality entry point rather than a discount version of the tiers above it.`;

const whyItsSpecial = `Every other hospitality tier at Lusail sells proximity to the pits or the paddock. Lusail Hill Lounge sells something different: the best natural elevated viewpoint on the circuit, dressed up with real seating and real food instead of asking you to stand on a public hillside for eight hours. That's a genuinely different value proposition, not just a cheaper version of Champions Club.

It also matters that General Admission — the free-standing public version of this same hillside — is already sold out for 2026. For anyone who wanted the Lusail Hill vantage point specifically and didn't secure a GA ticket in time, the Lounge is now the only route to that same view, which changes its calculus from "worth the upgrade" to "the only way in" for a specific slice of fans.`;

const insiderTips = [
  "Lusail Hill Lounge and the free General Admission area occupy the same elevated hillside — if the view is what you're actually paying for, know you're paying for seating, food, and shade, not a fundamentally different sightline.",
  "The open-air terrace has tiered levels — ask which tier your booking includes, since higher tiers see further down the main straight than lower ones on the same hillside.",
];

const whatToAvoid = "Don't book this expecting Champions Club-style formal dining or a paddock tour — the format here is a street-food bar and standing/lounge seating, a genuinely different, more casual hospitality style. Don't assume walk-up availability late in the season — with GA already sold out at the same location, the Lounge is likely to see spillover demand from fans who missed the cheaper ticket.";

const practicalInfo = {
  hours: "Opens ahead of first session each day, through the post-race concert programme. 2026 session times (local/Doha, AST): Practice 1 Fri 4:30-5:30pm, Practice 2 Fri 8-9pm, Practice 3 Sat 5:30-6:30pm, Qualifying Sat 9-10pm, Race Sun 7pm.",
  costRange: "Approx. £3,449 per person (roughly US$4,300+) for the 3-day package",
  bookingMethod: "Book via hospitality.lcsc.qa or by phone (+44 020 8068 5205 / +1.833.233.4624) — pricing and availability aren't published live online, requires direct inquiry.",
  website: "https://hospitality.lcsc.qa/2026-f1-qatar-grand-prix/lusail-hill-lounge-3-days",
  howToBook: "",
};

const gettingThere = "Located at Turn 1 within the circuit grounds, accessible via dedicated parking included in the package, or the Lusail Metro Station shuttle used by standard ticket holders.";

const [inserted] = await db.insert(experiences).values({
  title: "Lusail Hill Lounge",
  subtitle: "The circuit's best natural viewpoint, with real seating and food added",
  slug,
  experienceType: "fan_experience",
  status: "in_review",
  destinationId: DOHA_ID,
  bodyContent,
  whyItsSpecial,
  practicalInfo,
  gettingThere,
  insiderTips,
  whatToAvoid,
  sport: ["formula_one"],
  curationTier: "editorial",
  lastVerifiedDate: new Date().toISOString().slice(0, 10),
  editorialNote: "Sources: hospitality.lcsc.qa (official inclusions), grandstandmotorsports.co.uk (£3,449 pricing, secondary source, exact current price not published live — flag for re-verification). No Google Maps rating — hospitality package, not an independently rateable venue.",
}).returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

await db.insert(sportingEventExperiences)
  .values({ experienceId: inserted.id, sportingEventId: QATAR_GP_EVENT_ID })
  .onConflictDoNothing();

console.log("Seeded:", inserted);

await client.end();

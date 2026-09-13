// Qatar GP 2026 — Experience 2/21: Paddock Club & Champions Club
// Combined per founder's explicit instruction (12 Sep 2026) rather than two
// separate cards. Genuine Concierge pick — real tiered hospitality structure
// with lead-time pressure (Paddock Club already sold out per Marhaba/Qatar
// Tribune, Sep 2026).

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DOHA_ID = "4e53af71-7526-4d55-bf81-5d57d6f22136";
const QATAR_GP_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";
const slug = "qatar-gp-paddock-champions-club-" + Date.now().toString(36);

const bodyContent = `Two hospitality tiers sit above the grandstands at Lusail, and they're built for different priorities, not just different budgets.

Paddock Club is the top of the stack — a brand-new building directly above the team garages, looking straight down pit lane to the start-finish line. The draw is proximity to the actual sport: guided pit lane walkabouts at scheduled times through the weekend put you close enough to see mechanics working on the cars, and the suite runs a gourmet chef-designed lunch with live cooking stations (pizza, tacos, charcuterie) alongside an all-day open bar. Three-day packages run from roughly US$7,599. As of September 2026, Paddock Club has sold out for this race — demand for the 2026 weekend, positioned as the penultimate round of the season, ran ahead of supply.

Champions Club sits inside the Premiere Hospitality building on the outside of Turn 1, a step down in price and a step back from the pits, but it trades that proximity for its own set of extras: a guided F1 paddock tour led by an expert host, a professional photo opportunity with the actual World Championship trophy, and a Saturday grid walk. Guest appearances rotate between current or legendary drivers, team executives, F1 media personalities, and the FIA's safety car driver — who shows up isn't fixed in advance. Food runs canapés and light bites through Friday and Sunday, stepping up to a fuller dinner service, with an open bar throughout. Three-day packages run from roughly US$5,459.

Both tiers include F1's simulator and Pit Stop Challenge activations, TV screens with live timing, and a lounge to retreat to between sessions — the differences are really about where you're physically positioned and which extras (pit lane access vs. trophy photo and paddock tour) matter more to you.`;

const whyItsSpecial = `The real decision between these two isn't Paddock Club versus Champions Club in the abstract — it's proximity to the mechanics versus a guaranteed photo with the trophy and a guided walk through the paddock itself. Paddock Club sells the sport as work: real garages, real pit lane, real mechanics under pressure. Champions Club sells the sport as spectacle: the trophy, the grid walk, a driver or executive in the room with you.

Both have sold enough of their allocation this year that neither is a same-week decision anymore. Paddock Club selling out entirely for a race that used to be one of the calendar's easier hospitality bookings says something about where Qatar sits now relative to its first few editions — this isn't a getting-established race anymore, it's one people are actively competing for space at.`;

const insiderTips = [
  "Paddock Club's guided pit lane walkabout runs at scheduled times across the weekend, not on demand — confirm your slot as soon as you book, since missing it means missing the one thing that separates this tier from a standard grandstand seat.",
  "Champions Club's guest lineup (driver, executive, media personality, or the safety car driver) isn't fixed until closer to the weekend — don't book expecting a specific name.",
  "Both packages offer add-on hotel and transfer bundles (W Doha, JW Marriott among the options) — pricing these separately against booking your own hotel is worth doing before assuming the bundle is the better deal.",
];

const whatToAvoid = "Don't wait to inquire about Paddock Club specifically — it's already sold out for 2026, and F1 Experiences and its resellers will point you toward Champions Club or Lusail Hill Lounge as the remaining hospitality tiers. Don't assume Champions Club's Turn 1 location means worse racing views than Paddock Club's pit-straight position — Turn 1 sees genuine overtaking and braking-zone action that the front straight often doesn't, so the tradeoff is really about extras and food service, not view quality.";

const practicalInfo = {
  hours: "Hospitality suites open ahead of first session each day, close after the race concert programme ends",
  costRange: "Champions Club from approx. US$5,459 (3-day); Paddock Club from approx. US$7,599 (3-day, sold out for 2026)",
  bookingMethod: "Champions Club and remaining hospitality tiers via f1experiences.com or authorized resellers (Edge Global Events, ZK Sports & Entertainment, Race Experiences). Paddock Club sold out as of September 2026 — inquire on the waitlist or check resale.",
  website: "https://f1experiences.com/2026-qatar-grand-prix, https://www.lusail.gp/en/ticket-info/paddock-club-3",
  howToBook: "If Paddock Club is what you actually want, don't rely on the main booking page — it's showing sold out. Call an authorized reseller directly and ask specifically about late-release or cancellation inventory: Race Experiences (+31 50 205 78 01, info@raceexperiences.com) has historically had access to returned Paddock Club allocations closer to race week that never make it back onto the public site. If you're choosing between the two tiers and food quality matters more to you than the trophy photo, ask the reseller for the exact current menu — Champions Club's food service has varied year to year between a canapés-only offering and a fuller sit-down dinner, and that's worth confirming before you commit to a price point.",
};

const gettingThere = "Both hospitality buildings sit within the circuit grounds — access via the dedicated hospitality entrance, signposted separately from general ticket gates. Guests typically arrive via the Lusail Metro Station shuttle same as other ticket holders, though many hospitality packages include private transfer add-ons from central Doha hotels.";

const [inserted] = await db.insert(experiences).values({
  title: "Paddock Club & Champions Club",
  subtitle: "Pit lane proximity vs. the trophy photo — Lusail's top two hospitality tiers",
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
  editorialNote: "Sources: f1experiences.com (Champions Club inclusions), raceexperiences.com, edgeglobalevents.com, gpdestinations.com (pricing: Champions Club ~$5,459, Paddock Club ~$7,599, 3-day), marhaba.qa + qatar-tribune.com (Paddock Club sellout, Sep 2026). Exact current prices not published live on operator pages — figures sourced from a secondary aggregator citing operator pricing; flagged for periodic re-verification. Concierge pick: real tiered structure + genuine lead-time/sellout pressure.",
}).returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

await db.insert(sportingEventExperiences)
  .values({ experienceId: inserted.id, sportingEventId: QATAR_GP_EVENT_ID })
  .onConflictDoNothing();

console.log("Seeded:", inserted);

await client.end();

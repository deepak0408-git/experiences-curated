// Qatar GP 2026 — Experience 8/21: Getting to Lusail Circuit

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DOHA_ID = "4e53af71-7526-4d55-bf81-5d57d6f22136";
const QATAR_GP_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";
const slug = "qatar-gp-getting-there-" + Date.now().toString(36);

const bodyContent = `The Doha Metro's Red Line is the cheapest and most reliable way in. Ride it to Lusail Metro Station — from central Doha or Hamad International Airport, both connect directly — then pick up the free shuttle bus that runs from the station's east side straight to the circuit. Any valid race ticket includes a 3-day metro and shuttle pass, so this route costs nothing beyond the ticket you already bought. The shuttle ride itself runs around 20 minutes normally, up to 40 at peak times when traffic around the venue backs up. Shuttle service runs extended hours on race weekend: roughly 11:45am to 1am Friday, 1:15pm to 1am Saturday, and 11:45am to 2am Sunday, covering both arrival and the post-race crowd exodus.

Taxi and rideshare is the faster door-to-door option if you're willing to pay for it. Karwa's turquoise metered cabs run 24/7 and handle both directions, including pickups from the circuit itself — Uber can get you there but doesn't reliably handle circuit departures, so plan to use Karwa for the return trip regardless of which app you book with going in. Expect roughly QAR 35 (about US$10) from central Doha, with a 50% surcharge after midnight — relevant since the race itself doesn't finish until well after dark. Budget 30 minutes without traffic, more on race weekend.

Driving yourself is possible — parking is free but limited, and car-sharing among your group is worth it given the constraint. Exit the motorway at Exit 29B and follow spectator signage from there; avoid the Al Khor Coastal Road after the Wadi Al Wasah junction, a known bottleneck on race days. Rental cars are available from the major agencies (Europcar, Hertz, Avis) at Hamad International Airport. One practical note worth knowing before you get behind the wheel: driving standards in Doha, particularly in denser traffic, run less predictable than many visitors are used to — factor that into whether self-driving is actually the right call for your trip.`;

const whyItsSpecial = `The metro-and-shuttle route being genuinely free, not just cheap, changes the calculus for this race in a way it doesn't for most European Grands Prix, where getting to the circuit is its own real cost on top of the ticket. Combined with the fact that Qatar's ticket price sits toward the affordable end of the F1 calendar to begin with, transport here is one less thing eating into a trip budget.

The three distinct route options also map cleanly onto three different kinds of traveler: the metro-and-shuttle for anyone comfortable with public transit and happy to save the money, the taxi for anyone prioritizing speed and door-to-door convenience over cost, and self-driving only for those confident navigating Doha's traffic and signage under real race-weekend pressure. Knowing which one you actually are before you arrive saves a frustrating first day.`;

const insiderTips = [
  "Book your return trip with Karwa specifically, even if you arrived via Uber — Uber doesn't reliably handle pickups from the circuit itself, so relying on it for the trip home after a late race can leave you stranded.",
  "The shuttle's peak-time travel window (up to 40 minutes vs. a normal 20) tends to hit hardest right after the race ends, when the whole crowd exits at once — if you can wait 30-45 minutes after the chequered flag before heading to the shuttle stop, you'll likely move faster than joining the immediate rush.",
];

const whatToAvoid = "Don't assume free parking means guaranteed parking — spaces are limited, and arriving without a plan for a full lot means circling or a longer walk than expected on the day everyone else drives too. Don't drive the Al Khor Coastal Road past the Wadi Al Wasah junction on race days — it's a known congestion point specifically flagged by circuit route guidance, and the signed alternative via Exit 29B avoids it entirely.";

const practicalInfo = {
  hours: "Shuttle: Fri 11:45am-1am, Sat 1:15pm-1am, Sun 11:45am-2am",
  costRange: "Metro + shuttle: free with race ticket. Taxi: approx. QAR 35 (~US$10) one-way from central Doha, +50% after midnight.",
  bookingMethod: "Metro/shuttle pass included automatically with any valid race ticket. Taxis via Karwa (metered, 24/7) or Uber (arrival only, not recommended for departure).",
  website: "https://visitqatar.com/intl-en/plan-your-trip/getting-around/doha-metro",
  howToBook: "",
};

const gettingThere = "Doha Metro Red Line to Lusail Metro Station, then the free ticket-holder shuttle from the station's east side — the recommended default route for cost and reliability.";

const [inserted] = await db.insert(experiences).values({
  title: "Getting to Lusail Circuit",
  subtitle: "Free metro and shuttle, a fast taxi option, or self-drive — pick based on priority",
  slug,
  experienceType: "transit",
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
  editorialNote: "Source: gpdestinations.com (metro/shuttle timing, taxi pricing, driving route detail — Exit 29B, Wadi Al Wasah congestion point).",
}).returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

await db.insert(sportingEventExperiences)
  .values({ experienceId: inserted.id, sportingEventId: QATAR_GP_EVENT_ID })
  .onConflictDoNothing();

console.log("Seeded:", inserted);

await client.end();

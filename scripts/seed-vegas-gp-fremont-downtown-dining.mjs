import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f0388505-a1ca-4929-b14d-f33ae8075409";
const EVENT_ID = "cd5785a7-d37c-4d4b-a545-a8b8e28eac57";
const slug = "las-vegas-gp-fremont-downtown-dining-" + Date.now().toString(36);

const bodyContent = `Downtown Las Vegas, centered on the Fremont Street Experience, runs on a completely different food economy than the Strip — locals eat here, and race weekend prices haven't caught up to what a Strip meal costs during the Grand Prix. Two spots earn a genuine trip the roughly 10 minutes from the circuit.

Le Thai, on Fremont Street in the Fremont East District, is the kind of neighborhood restaurant that built its reputation on repeat local customers rather than tourist foot traffic. It's run by chef/owner Dan Coughlin, an established figure in the downtown dining scene, and the food backs up the loyalty — Thai cooking done with real technique, not a tourist-simplified menu. It regularly ranks among the best-reviewed restaurants in the entire city, not just downtown, and the prices are a fraction of anything comparable on the Strip. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=17634881770084158484)

Triple George Grill, inside the Downtown Grand Hotel & Casino, is downtown's answer to a classic American steakhouse — dark wood, a proper bar, and a menu built around steaks and chops done well rather than trying to be inventive. It's a long-established downtown institution, not a recent opening chasing race-weekend visitors, which shows in the consistency of its reviews over years rather than a recent spike.

Both sit within easy reach of the 24/7 Monorail running during race week, making a downtown dinner a genuinely practical plan even if you're staying on the Strip — not just a novelty trip for its own sake.`;

const whyItsSpecial = `Every visitor to a Grand Prix eats at least one Strip restaurant surrounded by other race visitors paying a premium for the location. Fremont Street offers the opposite: a meal among the people who actually live in this city, at prices that haven't been marked up for race weekend. Le Thai's reputation is built entirely on locals coming back, which is a different and in some ways more honest endorsement than any Strip restaurant's Michelin credentials. I'd send anyone genuinely curious about Las Vegas beyond the Grand Prix bubble downtown for one dinner during the weekend — it's a different city ten minutes away, and skipping it means missing half the reason downtown has its own devoted following.`;

const insiderTips = [
  "Le Thai gets genuinely busy on weekend nights even without a race in town — call ahead or expect a wait during race weekend specifically, since it doesn't take reservations for smaller parties the way Triple George Grill does.",
  "Triple George Grill's bar area, separate from the main dining room, is a solid option if you want the same menu without committing to a full sit-down reservation — useful if your schedule around race sessions is tight.",
];

const whatToAvoid = `Don't assume every downtown food option carries the same quality as these two — the area's food hall options (Fremont Food Hall among them) run noticeably more mixed in reviews than these two standalone restaurants, so downtown isn't uniformly a safe bet just by being downtown. Don't skip checking a specific downtown restaurant's current status before making a special trip — the downtown dining scene turns over famous names more than the Strip does, and a name you've read about in an older guide (Eat., a longtime downtown favorite) may no longer be open by the time you visit.`;

const practicalInfo = {
  hours: "Le Thai: dinner nightly, typically 5-10pm — confirm current hours. Triple George Grill: Mon-Fri 11am-10pm, Sat 4-10pm, closed Sun",
  costRange: "Le Thai: roughly US$15-30 per entrée. Triple George Grill: roughly US$40-80 per person for a full steakhouse meal",
  bookingMethod: "Le Thai: walk-in or call ahead, no online reservation system for smaller parties. Triple George Grill: book via OpenTable or directly through downtowngrand.com.",
  howToBook: "",
  website: "https://www.downtowngrand.com/triple-george-grill",
  reservationsRequired: false,
};

const gettingThere = "Fremont Street Experience, downtown, roughly 10 minutes by car or an hour's walk from the Strip circuit. The 24/7 Monorail running during race week connects downtown to Strip stations near the circuit's grandstand zones.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Fremont Street & Downtown — the Local Food Scene",
      subtitle: "Le Thai and Triple George Grill — real local dining, ten minutes from the Strip circuit",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Fremont Street / Downtown",
      address: "523 Fremont St (Le Thai), 201 N 3rd St (Triple George Grill), Las Vegas, NV",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from neonfeast.com and tripadvisor.com downtown dining guides, downtowngrand.com official Triple George Grill page. Confirmed Eat. (a previously well-known downtown restaurant) permanently closed March 2025 per neon.reviewjournal.com and casino.org — correctly excluded rather than recommended. Google ratings via Places API (New) direct lookup 29 Aug 2026: Le Thai 4.7/3,367 reviews, Triple George Grill 4.5/2,427 reviews — both well-attested. Multi-venue experience, see MULTI_VENUE_RATINGS registry entry (venueCount: 2).",
      sport: ["formula_one"],
      moodTags: ["value", "local"],
      interestCategories: ["dining"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-29",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓ Created:", result.title, "→", result.id, result.slug, result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

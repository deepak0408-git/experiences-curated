import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b0d8f9a-911d-4cc7-8049-50e4685958ca"; // Milan
const EVENT_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e"; // Italian GP 2026
const slug = "history-of-monza-walking-old-banking-" + Date.now().toString(36);

// ─── 1. Content ───────────────────────────────────────────────────────────────
const bodyContent = `Monza opened in September 1922, the third purpose-built racing circuit in the world after Brooklands and Indianapolis, and the oldest still running in mainland Europe. Three thousand five hundred workers built it in about ten weeks. What most people picture when they think of "old Monza," though, isn't the road circuit still used for the Grand Prix. It's the banking.

In 1954, the Autodromo built a new high-speed oval alongside the existing road course, with concrete banked curves reaching an 80 percent gradient at the steepest point. It hosted four world championship rounds between 1955 and 1961, and then the 1961 race turned fatal: a crash killed driver Wolfgang von Trips and eleven spectators. Formula 1 stopped using the banking the following year. Sports car racing kept going until 1969, when it too was judged too dangerous. Since then, the oval has sat largely unused, cracking under tree roots and weather until resurfacing work in 2014 stabilised what was left.

You can walk it today, and that's the part worth knowing about. On non-race days, the circuit grounds are free to enter, and the banking itself is open to pedestrians and cyclists, closed to vehicles the rest of the year. Standing at the base of that 80-degree wall of concrete tells you more about why this section got shut down than any statistic does.

The Autodromo also runs a handful of guided options if you want more structure than just wandering. The Tour Experience (around €25) covers the paddock, podium, and race control. The Track Tour (around €20) is a minibus loop through the actual chicanes and corners. There's a Sopraelevata Tour specifically covering the banking (around €10), and a Premium Tour led by motorsport personalities for groups of six or more (around €60). All of it books through ticketone.it or the circuit shop, and you're asked to arrive fifteen minutes early at Gate A or B.

Grounds are open year-round except over Christmas, generally 7am to 7pm outside race weekends, though it's worth checking ahead since hours shift seasonally. There's a café, toilets, and a souvenir shop on site, and the information office closes for lunch between noon and 1pm.`;

const whyItsSpecial = `Most historic racing venues either get fully preserved as museums or quietly demolished. Monza's banking did neither. It just sat there, decaying, half-swallowed by the trees around it, because nobody made a decision to knock it down and nobody had a clear plan to save it either. That accidental in-between state is part of what makes it worth seeing.

There's something genuinely unsettling about standing at the bottom of an 80-degree concrete wall and knowing cars used to take it flat out, and that the decision to stop wasn't caution, it was a body count. Most circuits sanitize their dangerous history into a plaque. Monza just leaves the wall standing, cracked and repaved, walkable by anyone who shows up on a quiet Tuesday. You don't get that kind of unfiltered access to motorsport history very often.`;

const practicalInfo = {
  hours: "Grounds generally open 7:00-19:00 outside race weekends (hours shift seasonally, closed over Christmas); banking accessible on foot/bike year-round when not in vehicle use.",
  costRange: "Free to walk the grounds and banking; guided tours from roughly €10 (Sopraelevata Tour) to €60 (Premium Tour).",
  bookingMethod: "Circuit grounds and the old banking are free to enter on non-race days; guided tours book through ticketone.it or the on-site circuit shop.",
  howToBook: "For a client who wants the banking specifically rather than a general circuit tour, the Sopraelevata Tour at roughly €10 is the direct option and the cheapest of the paid tiers, worth recommending over the pricier general Tour Experience if that's their specific interest. The Premium Tour, led by motorsport personalities, requires a minimum of six participants, so it only makes sense to suggest for a group booking, not an individual or couple. Arrive fifteen minutes ahead of any booked tour at Gate A or B. The info office where tours are booked and bikes are hired closes for lunch between 12:00 and 13:00, so time a walk-in visit around that window rather than during it.",
  website: "https://www.monzanet.it/en/autodromo-monza-circuit-experience/",
  reservationsRequired: false,
};

const gettingThere = "Trenord train from Milano Porta Garibaldi to Biassono-Lesmo station, then a short walk into Parco di Monza; entrance via Vedano al Lambro side.";

// ─── 2. Insert experience ─────────────────────────────────────────────────────
try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The History of Monza — Walking the Old Banking",
      subtitle: "The 1955 oval, abandoned after too many deaths, still stands. You can walk it for free.",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Autodromo Nazionale Monza",
      address: "Autodromo Nazionale Monza, Parco di Monza, 20900 Monza MB, Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "The banking is open to pedestrians and cyclists year-round on non-race days, but closed to vehicles — bring or hire a bike at the on-site info point if you want to cover more ground than walking allows.",
        "Grounds are free to enter, but the info office (where you book tours or hire bikes) closes for lunch 12:00-13:00 — plan around that window.",
      ],
      whatToAvoid: "Don't assume the banking is always accessible during race weekends — it's sometimes used as an operational security base during the Grand Prix itself, so this is genuinely a non-race-day experience. And don't turn up expecting shade or cool conditions in July or August — most of the walk is exposed, and midday heat in summer makes this a better morning or early evening visit.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: en.wikipedia.org Monza Circuit (1922 founding, 1954 oval construction), circuitsofthepast.com Monza Oval history (1955-1961 championship rounds, 1961 von Trips fatality, 1969 sports car retirement, 2014 resurfacing), monzanet.it Circuit Experience (tour pricing/booking), monzanet.it timetables (opening hours), formula1.com brief history of Italian banking. CORRECTION: original title in memory said 'A Circuit Since 1950' — factually wrong, circuit opened 1922, banking built 1954-55. Retitled to avoid the inaccurate date per user decision 8 Jul 2026. GTG: N/A. Booking.com: N/A. No hero image — searched Unsplash/Pexels/Wikimedia/Flickr across two passes; only 2 genuinely on-topic banking photos found (both presented), plus a confirmed-Monza satellite aerial, none approved by user. Seeded without image per user decision 8 Jul 2026. Verified 8 Jul 2026.",
      sport: ["formula_one"],
      moodTags: ["historic", "authentic", "budget-friendly"],
      interestCategories: ["culture", "sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "free",
      budgetCurrency: "EUR",
      bestSeasons: ["apr", "may", "jun", "sep", "oct"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-07-08",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
  console.log("\n→ Review at:    http://localhost:3000/curator/review");
  console.log("→ Experience:   http://localhost:3000/experience/" + result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

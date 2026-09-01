import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f0388505-a1ca-4929-b14d-f33ae8075409";
const EVENT_ID = "cd5785a7-d37c-4d4b-a545-a8b8e28eac57";
const slug = "las-vegas-gp-bellagio-caesars-dining-" + Date.now().toString(36);

const bodyContent = `Race night in Las Vegas doesn't start when the lights go out — it starts hours earlier, and two restaurants a few minutes' walk from the circuit make the wait itself part of the occasion.

Le Cirque, inside Bellagio overlooking the fountains, is the Vegas outpost of the legendary New York original, and it's earned its own reputation rather than coasting on the name. It made La Liste's 2026 top 1,000 restaurants in the world list, carries a perennial AAA Five Diamond Award, and holds a Forbes Travel Guide Five Star rating. The room itself is genuinely part of the draw — striped silk ceiling, views over the fountains that will be running the same water show later that night the cars are racing past. This is French haute cuisine done at a level that justifies booking it specifically for a night you want to remember, not just a convenient meal before walking to a grandstand. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=10743306609308335518)

Restaurant Guy Savoy, at Caesars Palace, sits at an even higher tier on paper: a Michelin two-star restaurant scoring 95 out of 100 on La Liste's 2026 rankings, with the Forbes Five Star Award, TripExpert's Expert's Choice Award, Wine Spectator's Grand Award, and AAA Five Diamond recognition every year since 2008. Chef Guy Savoy built the Vegas menu to genuinely mirror his acclaimed Paris original, not a simplified American version of it. It's a serious tasting-menu commitment, best planned for a night when you're not racing a clock to reach a grandstand afterward. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=5181793167977568363)

Both sit inside walking distance of the East Harmon and Koval zone entrances, making either a genuine "dinner, then walk to the race" plan rather than requiring a separate trip.`;

const whyItsSpecial = `Most race-weekend dining guides point you toward a steakhouse or a sports bar with good screens. These two restaurants make the case that a Formula 1 weekend in a city built entirely around spectacle deserves at least one meal that matches it. Le Cirque and Guy Savoy aren't casino restaurants riding a hotel's name, they're independently credentialed among the best restaurants in the world, sitting inside two of the buildings the circuit itself runs past. I'd book one of these specifically for qualifying night or the night before the race, when there's room to actually enjoy a long dinner rather than racing the clock to a grandstand seat.`;

const insiderTips = [
  "Le Cirque's fountain-view tables are the ones worth requesting specifically when booking — ask for fountain seating at reservation time rather than hoping for it on arrival, since the room's other tables don't carry the same view.",
  "Guy Savoy's tasting menu format runs long by design — book it for a night without a session immediately after, like a rest day or the evening before qualifying, rather than squeezing it in right before you need to be at the track.",
];

const whatToAvoid = `Don't book either restaurant for the same night as your grandstand session unless you've built in real buffer time — both are proper multi-course experiences, not quick pre-race meals, and rushing through either undercuts what makes them worth the price. Don't assume walk-in availability during race weekend — both restaurants see genuine demand spikes from F1 visitors specifically, and reservations that would be easy to get on a normal week can book out during the Grand Prix.`;

const practicalInfo = {
  hours: "Le Cirque: dinner nightly from 5:30pm. Restaurant Guy Savoy: dinner Wed-Sun from 5:30pm, closed Mon-Tue — confirm current hours before booking",
  costRange: "Le Cirque: tasting menus and à la carte, roughly US$150-250 per person before wine. Restaurant Guy Savoy: tasting menu format, roughly US$285-395 per person before wine",
  bookingMethod: "Book directly via OpenTable or each restaurant's own site (bellagio.mgmresorts.com for Le Cirque, caesars.com for Guy Savoy). Book several weeks ahead for race weekend specifically — both see genuine demand spikes during the Grand Prix.",
  howToBook: "",
  website: "https://bellagio.mgmresorts.com/en/restaurants/le-cirque.html, https://www.caesars.com/caesars-palace/restaurants/restaurant-guy-savoy",
  reservationsRequired: true,
};

const gettingThere = "Le Cirque: inside Bellagio, on the Strip near Turns 13-14. Restaurant Guy Savoy: inside Caesars Palace, opposite Bellagio. Both walking distance to East Harmon and Koval zone entrances.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Bellagio & Caesars Palace Fine Dining Before Race Night",
      subtitle: "Le Cirque and Restaurant Guy Savoy — a meal that matches the spectacle, minutes from the circuit",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "The Strip",
      address: "3600 S Las Vegas Blvd (Le Cirque, Bellagio), 3570 S Las Vegas Blvd (Restaurant Guy Savoy, Caesars Palace), Las Vegas, NV",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from opentable.com fine dining guides, investor.caesars.com official Guy Savoy accolades release, neon.reviewjournal.com La Liste 2026 coverage. Google ratings via Places API (New) direct lookup 29 Aug 2026: Le Cirque 4.6/760 reviews, Restaurant Guy Savoy 4.6/429 reviews — both well-attested. Multi-venue experience, see MULTI_VENUE_RATINGS registry entry (venueCount: 2).",
      sport: ["formula_one"],
      moodTags: ["premium", "romantic"],
      interestCategories: ["dining"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: true,
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

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const slug = "stand25-bisztro-" + Date.now().toString(36);

const bodyContent = `Stand25 started life as a market stall, kiosk No.25 at the Downtown Market on the Pest side, before moving to a proper bricks-and-mortar space at Attila út 10 in autumn 2019, on the Buda side near the tunnel by Clark Ádám tér. It's worth knowing that history because it explains the food: this is freestyle Hungarian cooking with a Mediterranean edge, built by people who earned a following one stall customer at a time before they had a dining room.

There's no à la carte. Dinner is a fixed 2 or 3-course menu, three or four dish choices per course, some with a small supplement. Mains run roughly €20-28, with dinner landing around 20,000+ HUF per person all in, a genuine step up from a casual bisztró but well short of Budapest's true fine-dining prices. The kitchen picked up a Michelin Bib Gourmand within a year of the move, recognition for good food at a fair price rather than a full star, and it's an accurate description of what's on the plate.

Note the location carefully: despite the name's echo of the old Pest market stall, Stand25 today is in District I, on the Buda side, not in the Pest districts where most of this trip's other dining and nightlife sits. It's a deliberate crossing of the river, not a stop on the way to somewhere else.`;

const whyItsSpecial = `A lot of "modern Hungarian" cooking in Budapest either plays it safe with tourist-friendly classics or goes so far the other way it loses the point of Hungarian food altogether. Stand25's Bib Gourmand recognition suggests they found the actual middle: real technique, a genuinely composed menu, built on Hungarian ingredients and a Mediterranean sensibility, at a price that rewards a slightly longer taxi or tram ride across the river rather than punishing it. For a trip built mostly around Pest logistics (the metro, the Jewish Quarter, the circuit shuttle), deliberately crossing to Buda for one exceptional meal is worth the detour.`;

const insiderTips = [
  "Confirm the Buda location (Attila út 10) before heading out, if you're used to the restaurant's old Downtown Market stall reputation, it's easy to assume it's still on the Pest side.",
  "Because it's fixed-menu only with no à la carte, check the current course options online before booking if you have dietary restrictions, rather than assuming you can substitute on arrival.",
];

const whatToAvoid = `Don't turn up expecting à la carte flexibility or a walk-in table, this is a fixed-menu, reservation-driven restaurant, plan your visit rather than treating it as a casual stop.`;

const practicalInfo = {
  hours: "Check stand25.hu for current service days and times, fixed-menu dinner service",
  costRange: "Mains €20-28; dinner approx. 20,000+ HUF per person",
  bookingMethod: "Reserve via stand25.hu or by phone ahead of your visit, especially on weekend evenings, the fixed-menu format and Michelin Bib Gourmand recognition mean tables go quickly.",
  website: "https://stand25.hu/?lang=en",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Stand25 Bisztró — A Market Stall That Earned a Bib Gourmand",
      subtitle: "Freestyle Hungarian cooking with a Mediterranean edge, now on the Buda side, fixed menu only.",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "District I, Buda",
      address: "Attila út 10, 1013 Budapest, Hungary",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere: "Buda side, near the Clark Ádám tér tunnel; reachable by tram or a short taxi/rideshare from central Pest.",
      editorialNote: "Sources: stand25.hu, guide.michelin.com/en/central-hungary/budapest/restaurant/stand25-bisztro, willflyforfood.net/stand25-bisztro-refined-traditional-hungarian-fare. Verified 11 Jul 2026, note corrected location to District I (Buda), not District V as originally assumed.",
      sport: ["formula_one"],
      moodTags: ["refined", "modern", "worth-the-detour"],
      interestCategories: ["food"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "EUR",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-07-11",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

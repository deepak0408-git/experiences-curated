import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const slug = "chicane-4-grandstand-hungaroring-" + Date.now().toString(36);

const bodyContent = `Most grandstands at the Hungaroring give you one corner. Chicane 4 gives you a run of them, Turns 4 through 10, the section that includes the tight downhill left-right after Turn 1 and the slow chicane at Turns 6-7. It's the widest window onto the circuit's technical mid-section that any single seat offers.

That width is the whole point. Instead of watching one moment repeat lap after lap, you watch a car's entire rhythm through the section that decides whether its lap is clean or scrappy. You see the line into Turn 4, whether it carries into 5 well, whether that sets up a tidy or messy run through the chicane, whether the car's still settled by the time it's heading toward 8, 9 and 10. It's less a single-shot photograph and more a slow zoom across a whole paragraph of the lap.

The terrain here helps. The Hungaroring sits in a natural bowl outside Mogyoród, and the elevation change through this section means the grandstand looks slightly down onto the track rather than dead level with it, giving a genuine sense of the corners connecting to each other rather than each one feeling isolated.`;

const whyItsSpecial = `Broadcast coverage of a Grand Prix mostly shows you isolated moments, an overtake here, a lock-up there. Watching from Chicane 4 is the closest thing to seeing the actual skill difference between drivers that TV rarely captures well: not one big pass, but four or five corners in a row where a driver's car stays settled and another's doesn't. If you've ever wanted to understand why commentators talk about a driver having "a good rhythm" through a sector, this is the stand where you can actually watch that rhythm happen, corner to corner, rather than take their word for it.`;

const insiderTips = [
  "Bring a race program or the F1 app with live timing, cross-referencing what you see with sector times makes the subtle differences between drivers far easier to spot.",
  "This is a good stand for a first Hungaroring visit if you want to understand the whole circuit rather than commit to one corner's drama, it's the closest thing to a survey view without paying for a raised hospitality position.",
];

const whatToAvoid = `Don't expect the dramatic single-moment payoff of a Turn 1 pass or a final-corner finish, this stand rewards attention to a whole sequence rather than one big spike of action. If a single decisive moment is what you want, book T1 or the Apex Grandstand instead.`;

const practicalInfo = {
  hours: "Gates typically open around 8am on race day; grandstand seating is allocated and holds for the full session",
  costRange: "Mid-tier grandstand pricing, check tickets.formula1.com or f1hungary.com for current-year prices",
  bookingMethod: "Book via tickets.formula1.com/en/f1-3277-hungary or f1hungary.com/en/ticket-info/grandstand-chicane-4. Check the current grandstand map before booking, as numbering (Chicane 1-4) can shift year to year.",
  website: "https://www.f1hungary.com/en/ticket-info/grandstand-chicane-4",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Chicane 4 Grandstand — The Widest Window on the Lap",
      subtitle: "Turns 4 through 10 in one sightline, the closest seat to seeing a driver's whole rhythm rather than a single moment.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Hungaroring, Mogyoród",
      address: "Hungaroring, 2146 Mogyoród, Hungary",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere: "Free F1 shuttle buses run from Kerepes HÉV station (reached via M2 metro to Örs vezér tere, then HÉV suburban rail) directly to Gate 3, timed to match train arrivals.",
      editorialNote: "Sources: f1hungary.com/en/ticket-info/grandstand-chicane-4, driver61.com/circuit-guide/hungaroring. Verified 11 Jul 2026.",
      sport: ["formula_one"],
      moodTags: ["technical", "panoramic", "insider"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "EUR",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "event_only",
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

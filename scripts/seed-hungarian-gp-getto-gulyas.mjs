import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const slug = "getto-gulyas-jewish-quarter-" + Date.now().toString(36);

const bodyContent = `Gettó Gulyás sits at Wesselényi utca 18, right in the middle of the Jewish Quarter's ruin bar sprawl, and it does one thing extremely well: traditional Hungarian goulash, made the way it's meant to be made, tender beef, hearty root vegetables, a broth built on properly toasted paprika rather than a shortcut version.

The menu doesn't try to be everything. Alongside the goulash soup itself, there's farm chicken paprikash with egg noodles, venison stew with dumplings, and a dessert worth planning for, túrógombóc, pillowy cottage cheese dumplings buried in sour cream and dusted with powdered sugar. Dinner runs roughly Ft 6,000-8,000 per person, with individual goulash and stew dishes in the Ft 3,390-5,590 range, solidly mid-range for Budapest and not a tourist-trap markup given the quality on the plate.

It's popular enough, particularly with the evening ruin bar crowd nearby, that a reservation matters more than it might elsewhere. The restaurant is open daily from noon to 11pm, and calling ahead (+36 20 376 4480) is the standard advice from people who've shown up without one and waited.`;

const whyItsSpecial = `Budapest has no shortage of restaurants serving a version of goulash aimed at tourists who won't know the difference. Gettó Gulyás isn't that, it's consistently named among the city's best goulash by people who've eaten a lot of it, precisely because the kitchen didn't cut corners on the paprika or the cooking time. Being in the Jewish Quarter means it's also genuinely convenient after an evening at the neighbourhood's ruin bars, a proper meal bookending a night out rather than a fast-food afterthought.`;

const insiderTips = [
  "Call ahead (+36 20 376 4480) rather than walking in, especially on weekend evenings when the Jewish Quarter crowd is out in force.",
  "Save room for the túrógombóc, it's listed as the house specialty for a reason and easy to skip if you fill up on the (very generous) goulash portions first.",
];

const whatToAvoid = `Don't come expecting a quiet, quick meal, the location in the heart of the ruin bar district means evenings get lively and loud, this is a place to enjoy that energy, not escape it.`;

const practicalInfo = {
  hours: "Daily, 12:00-23:00",
  costRange: "Ft 6,000-8,000 per person for dinner; individual mains Ft 3,390-5,590",
  bookingMethod: "Call +36 20 376 4480 to reserve, especially for weekend evenings, walk-ins risk a wait during peak Jewish Quarter hours.",
  website: "https://getto-gulyas.menu-world.com/",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Gettó Gulyás — Goulash Done Properly, in the Jewish Quarter",
      subtitle: "Traditional Hungarian goulash and paprikash at the heart of District VII's ruin bar sprawl.",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Jewish Quarter, District VII",
      address: "Wesselényi utca 18, 1077 Budapest, Hungary",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere: "Central District VII location, walkable from Astoria or Blaha Lujza tér metro stops.",
      editorialNote: "Sources: getto-gulyas.menu-world.com, offbeatbudapest.com/top10/best-goulash-budapest, restaurantguru.com/Getto-Gulyas-Budapest. Verified 11 Jul 2026.",
      sport: ["formula_one"],
      moodTags: ["authentic", "lively", "traditional"],
      interestCategories: ["food"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "EUR",
      bestSeasons: ["jul"],
      advanceBookingRequired: false,
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

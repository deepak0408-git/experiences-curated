import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b015fab-26a0-48b4-a8ff-ef7c7ed977a7";
const EVENT_ID = "ea035967-b5d7-47e6-ad44-7cf4db07e70b";
const slug = "virginia-water-lake-savill-garden-" + Date.now().toString(36);

const bodyContent = `Virginia Water Lake sits inside Windsor Great Park, a genuine slower-paced counterpart to a full tournament day at Wentworth, just down the road. The lake's edges hold two features worth knowing about specifically: the ornamental Cascade waterfall, built from stones brought from Bagshot Heath and one of the last remnants of the park's Georgian ornamental heyday, and a genuinely striking 100-foot totem pole standing in the Valley Gardens, gifted by the Government of British Columbia in 1958 to mark that province's centenary, carved with ten totem characters.

Savill Garden sits within the same estate, 35 acres of designed gardens and woodland with seasonal displays that change through the year. Entry runs £40 per person, which includes garden access and car parking for the day, open daily 9am to 6pm in summer (9am to 4:30pm in winter), closed only on Christmas Eve and Christmas Day.

This is the pack's deliberate change of pace. Everything else here, the grandstands, the Championship Village, the Celebrity Pro-Am, runs at tournament energy. Virginia Water Lake and Savill Garden are the opposite: a walk, a waterfall, a garden, and space to slow down before or after a day watching golf.`;

const whyItsSpecial = `Every trip built around a tournament benefits from having somewhere to decompress that isn't just another hotel room, and this is exactly that. I like that the totem pole in particular is such an unexpected detail for the Surrey countryside, a genuine piece of Canadian heritage standing in an English royal park, gifted for a reason that has nothing to do with golf or tourism marketing.

Savill Garden's seasonal displays mean this isn't a one-visit attraction either. Whatever the specific week of BMW PGA lands on, there's likely to be something in bloom worth the detour, which isn't true of every "nearby nature spot" a travel pack tends to include out of obligation.`;

const practicalInfo = {
  hours: "Savill Garden: daily 9:00-18:00 (summer), 9:00-16:30 (winter), last entry one hour before closing; closed 24-25 December. Virginia Water Lake and the Cascade/Totem Pole area are open access, no fixed hours.",
  costRange: "Savill Garden: £40 per person, including garden entry and car parking for the day. Virginia Water Lake, the Cascade, and the Totem Pole are free to visit.",
  bookingMethod: "Savill Garden tickets can be booked online via windsorgreatpark.co.uk or purchased on arrival; Virginia Water Lake requires no ticket or booking.",
  website: "https://www.windsorgreatpark.co.uk/explore/the-gardens/the-savill-garden/",
  reservationsRequired: false,
};

const gettingThere = "Virginia Water Lake and Savill Garden sit within Windsor Great Park, a short walk or drive from Wentworth Club and Virginia Water station.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Virginia Water Lake & Savill Garden",
      subtitle: "A Georgian cascade, a 100-foot Canadian totem pole, and 35 acres of gardens — the pack's slower-paced counterpart.",
      slug,
      experienceType: "neighborhood",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Virginia Water / Windsor Great Park",
      address: "The Savill Garden, Wick Ln, Englefield Green, Egham TW20 0UU",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "The Totem Pole and Cascade are both free to visit and require no booking — a good low-commitment addition to a day if you don't have time for the full Savill Garden.",
        "Savill Garden's £40 entry includes car parking for the day — factor that into cost comparisons if you're driving rather than walking from Virginia Water.",
      ],
      whatToAvoid: "Don't try to combine a full Savill Garden visit with a full tournament day at Wentworth — treat this as a rest-day or half-day activity rather than squeezing it in before or after hours of golf.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: windsorgreatpark.co.uk official Savill Garden page (hours, £40 pricing, 35 acres), eghammuseum.org on the Totem Pole (1958, gift from Government of British Columbia, ten totem characters), komoot.com and getsurrey.co.uk on the Cascade and Totem Pole location within Valley Gardens. Verified 10 Jul 2026.",
      sport: ["golf"],
      moodTags: ["scenic", "relaxed", "nature"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "GBP",
      bestSeasons: ["sep"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-07-10",
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

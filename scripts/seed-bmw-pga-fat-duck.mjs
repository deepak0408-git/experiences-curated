import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b015fab-26a0-48b4-a8ff-ef7c7ed977a7";
const EVENT_ID = "ea035967-b5d7-47e6-ad44-7cf4db07e70b";
const slug = "fat-duck-bray-" + Date.now().toString(36);

const bodyContent = `The Fat Duck sits in Bray, a short drive from Wentworth, and it's held three Michelin stars for 21 consecutive years, the kind of run that puts it in a genuinely small category of restaurants worldwide. Heston Blumenthal built his reputation here on food that treats a tasting menu as something closer to a research project: dishes built around smell, memory, and unexpected texture rather than straightforward technique.

Tasting menus run between £285 and £365 per person for food alone, depending on the specific menu and day of booking, with drinks, extras, and service on top. Full payment is required at the time of reservation, not on the night, which is worth knowing before you book so you're not caught off guard by the structure.

This isn't a restaurant you fold into a golf day without planning around it. A meal here runs for hours and the whole experience, the setting, the pacing, the theatre of individual courses, works against treating it as a quick stop between rounds of tournament golf. It's better suited to an evening you've deliberately kept clear, ideally the night before or after your day at Wentworth rather than squeezed in between.`;

const whyItsSpecial = `Twenty-one years of three Michelin stars isn't a fluke, and I think what's genuinely rare about the Fat Duck is that it hasn't coasted on reputation, the food is still built to surprise rather than simply reassure. That's a different proposition than most Michelin-starred restaurants, which tend to perfect a formula and then repeat it.

Including it in a golf pack might look like an odd stretch at first. But BMW PGA's whole identity is built around more than the golf itself, the Festival of Golf framing, the celebrity Pro-Am, the Championship Village concerts, and a meal here fits that same logic: this trip can be about more than watching a tournament if you let it.`;

const practicalInfo = {
  hours: "Lunch and dinner service, days vary — check current availability directly, as booking windows can be tight given demand.",
  costRange: "£285-365 per person for the tasting menu (food only), plus drinks, extras and service charge. Full payment required at time of booking.",
  bookingMethod: "Book directly via thefatduck.co.uk or by calling 01628 580333 — reservations require full advance payment, so confirm your date well before your trip.",
  website: "https://thefatduck.co.uk/",
  reservationsRequired: true,
};

const gettingThere = "Bray is a short drive from Wentworth Club, roughly 20-25 minutes — no direct public transport link, so a taxi or car is the practical option for this one.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Fat Duck, Bray",
      subtitle: "Three Michelin stars for 21 straight years — a genuine detour from the golf, best kept for a clear evening.",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Bray, Berkshire",
      address: "The Fat Duck, High Street, Bray, Berkshire SL6 2AQ",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "Book well ahead — reservations require full payment upfront, and availability for popular dates fills fast, so this isn't a last-minute addition to your trip.",
        "Plan a clear evening around this meal rather than squeezing it between tournament sessions — the tasting menu format runs for hours and rewards an unhurried schedule.",
      ],
      whatToAvoid: "Don't book this for a night you also want to catch late tournament play or a Show Stage concert — the tasting menu experience doesn't suit being rushed, and trying to combine both in one evening will shortchange one or the other.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: thefatduck.co.uk official site and FAQs (booking structure, full payment required), luxuriousmagazine.com and Facebook (chef confirmation) on 21 consecutive years of three Michelin stars, guide.michelin.com official Michelin Guide UK 2026 listing confirming current 3-star status. Verified 10 Jul 2026 — cross-checked star count after an initial conflicting search result suggested a different tier; confirmed 3 stars via Michelin's own guide and independent chef confirmation.",
      sport: ["golf"],
      moodTags: ["culinary", "bucket-list", "special-occasion"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "luxury",
      budgetCurrency: "GBP",
      bestSeasons: ["sep"],
      advanceBookingRequired: true,
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

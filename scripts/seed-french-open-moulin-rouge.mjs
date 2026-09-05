import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const PARIS_ID = "488adb47-5327-43e2-8206-d40480301962";
const FRENCH_OPEN_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";
const slug = "moulin-rouge-show";

const bodyContent = `Moulin Rouge has run cabaret at the same Montmartre address since 1889, and its current production, Féerie, is still recognizably the same idea that made the venue famous: a 100-artist troupe, 60 Doriss Girls, roughly 1,000 costumes of feathers, rhinestones and sequins, built around large ensemble numbers, solo acts, and specialty performers including acrobats and skaters worked into the choreography.

Two shows run nightly, 9pm and 11pm, and the later slot is consistently the cheaper of the two. Show-only tickets with a half-bottle of champagne run roughly €120-140; dinner packages, starting at 7pm with a multi-course French menu plus the same half-bottle of champagne, run considerably higher, from around €245 up past €450 depending on the menu tier chosen. Booking further ahead reliably lowers the price across both formats — this isn't a venue where last-minute bookings find a bargain.

The show itself runs close to two hours and moves fast: ensemble numbers give way to specialty acts and back again, with genuinely impressive production value in the costuming and staging rather than a stripped-down cabaret revue. It's polished, deliberately spectacular, and unapologetically a tourist institution — which is exactly the point. Moulin Rouge isn't trying to be an insider secret; it's trying to be the biggest, most consistent version of Paris cabaret spectacle there is, and on that specific measure it delivers.

For a Roland-Garros trip, this sits naturally as an evening booked around a rest day or a day-session-only match day — the 9pm or 11pm show times leave a full day of tennis or sightseeing before committing the evening to it.`;

const whyItsSpecial = `Most "iconic Paris nightlife" recommendations trade on reputation alone and disappoint on delivery. Moulin Rouge, remarkably, still mostly delivers on a reputation built well over a century ago — the production values, the scale of the troupe, the sheer number of costumes in rotation, none of that reads as a diminished, tourist-trap version of something that used to be better. It's expensive, deliberately spectacular, and it knows exactly what it is.

Booking a Moulin Rouge evening into a Roland-Garros trip is a specific kind of contrast worth having on purpose: an afternoon watching the most technically demanding surface in tennis, followed by an evening watching a different kind of performance discipline entirely, equally rehearsed, equally physical, in a completely different register. Both are, in their own way, about precision under pressure.`;

const insiderTips = [
  "The 11pm show is consistently priced lower than the 9pm show for the same production — if seeing the exact same Féerie performance at a lower price matters more than an earlier night, book the later slot.",
  "Book significantly ahead of the date, not just a few days out — pricing across both show-only and dinner packages rises measurably closer to the date, and early booking is the most reliable way to get the lower end of either price range.",
];

const whatToAvoid = `Don't book the dinner package assuming it's meaningfully better value than show-only plus a separate dinner elsewhere — at €245-450+ against €120-140 for show-only, the dinner package's premium is real, and Montmartre has genuinely good separate dinner options within walking distance for anyone budget-conscious. And don't book last-minute expecting to find a discount — unlike some Paris attractions where late booking occasionally turns up a deal, Moulin Rouge pricing moves in the opposite direction, rising as the date approaches rather than falling.`;

const practicalInfo = {
  address: "82 Boulevard de Clichy, 75018 Paris, France",
  website: "https://www.moulinrouge.fr",
  hours: "Two shows nightly: 21:00 and 23:00; dinner packages begin at 19:00",
  costRange: "Show + champagne from €120-140; dinner packages €245-450+ depending on menu tier",
  bookingMethod: "Book directly via moulinrouge.fr or established ticket platforms (France Tourisme, Civitatis, Viator) well in advance — prices rise as the date approaches.",
  reservationsRequired: true,
};

const gettingThere = `Blanche (Métro Line 2) sits directly outside the venue. A genuine cross-city trip from Roland-Garros — budget 40-50 minutes each way by Métro.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Moulin Rouge — Féerie",
      subtitle: "Cabaret spectacle since 1889 — 100 artists, 1,000 costumes, two shows a night",
      slug,
      experienceType: "activity",
      status: "in_review",
      destinationId: PARIS_ID,
      sportingEventId: FRENCH_OPEN_EVENT_ID,
      neighborhood: "Montmartre / Pigalle",
      address: "82 Boulevard de Clichy, 75018 Paris, France",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Show format (Féerie, 100 artists, 60 Doriss Girls, 1000 costumes) and pricing (€120-140 show, €245-450+ dinner) from francetourisme.fr, viator.com and civitatis.com aggregated search results. Confirmed currently operating (not a defunct venue). Google rating verified via Places API: 4.4/18,392 reviews. Verified 4 Sep 2026. Hero image pending — batch pass to follow.",
      googleMapsRating: "4.4",
      googleMapsReviewCount: 18392,
      googleMapsUrl: "https://maps.google.com/?cid=17604167077001175313",
      moodTags: ["glamorous", "iconic", "spectacular"],
      interestCategories: ["nightlife", "culture_and_history"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "EUR",
      budgetMinCost: "120",
      budgetMaxCost: "450",
      bestSeasons: ["may"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-04",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: FRENCH_OPEN_EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created:", result.title, "→", result.slug, `(${result.status})`);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const PARIS_ID = "488adb47-5327-43e2-8206-d40480301962";
const FRENCH_OPEN_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";
const slug = "ibis-boulogne-billancourt-midrange-stay";

const bodyContent = `Ibis Paris Boulogne-Billancourt sits a genuine 4-minute drive from Stade Roland-Garros, in a district just across the Seine from the 16th arrondissement proper, and it's the mid-range pick that actually holds up across independent review sources rather than looking good on just one platform. Booking.com rates it 8.5 out of 10 across more than a thousand verified reviews; Travelocity puts it at 8.6. Google's own rating sits at 4.2 from nearly 600 reviews. That kind of consistency across four separate platforms is a genuinely rare thing to find in this price bracket this close to a major tournament venue.

The rooms are compact and functional rather than characterful — this is an Ibis, not a boutique property, and it doesn't pretend otherwise. What guests consistently flag as the actual draw is the location: walkable to the Billancourt Métro station on Line 9, close to La Seine Musicale concert venue, with genuine shops and restaurants nearby rather than an isolated business-hotel block. Staff are repeatedly singled out as friendly and efficient in reviews, which matters more than décor for a stay built around getting to and from a tennis tournament rather than lounging in the room.

There is a real, specific complaint worth knowing before booking: several reviews across platforms mention issues with unreturned deposits and slow response to complaints. It's not a dealbreaker at this price point and review volume, but it's the kind of thing worth double-checking your booking confirmation and deposit terms for directly rather than assuming standard chain-hotel practice applies without question.

This is squarely a mid-range functional stay — book it for proximity and reliability, not for an experience in itself.`;

const whyItsSpecial = `The honest case for this hotel over other similarly-priced options near Roland-Garros is boring, in the best way: it's consistently rated well by real guests across enough different platforms that it's not a fluke. A lot of "close to the stadium" hotel recommendations in this price range look fine on one review site and mediocre on the next — this one holds its rating everywhere you check, which for a mid-range chain hotel is worth more than it sounds.

Four minutes from the stadium by car, walkable to a Métro line, near enough to actual restaurants and a concert venue that it doesn't feel like staying in a business park — that's the realistic bar for what a good mid-range Roland-Garros stay should clear, and this is one of the few options in the area that clears it on more than just proximity.`;

const insiderTips = [
  "Confirm deposit terms directly with the hotel or your booking platform before arrival — a recurring, specific complaint across review platforms concerns slow deposit returns, and having your confirmation and terms in writing avoids the most commonly reported issue here.",
  "Billancourt Métro station (Line 9) connects directly toward Porte d'Auteuil, the closest stop to Roland-Garros — a genuinely simple, one-change-free route on tournament match days rather than a multi-transfer trip.",
];

const whatToAvoid = `Don't expect boutique character or spacious rooms — this is a standard Ibis property, chosen for consistency and location rather than atmosphere, and guests expecting a design hotel at this price point will be disappointed. And don't skip reading the specific deposit-related complaints in recent reviews before booking — while the overall rating is strong and consistent, this particular issue is repeated often enough across platforms to be worth a direct confirmation with the hotel rather than assumed away.`;

const practicalInfo = {
  address: "Boulogne-Billancourt, France (exact address via booking platform)",
  website: "https://all.accor.com/hotel/6245/index.en.shtml",
  hours: "24-hour reception",
  costRange: "Mid-range Ibis pricing, typically €120-200/night depending on season and tournament demand",
  bookingMethod: "Book directly via all.accor.com or standard platforms (Booking.com, Expedia). Book early for Roland-Garros dates — rooms this close to the venue sell out well ahead of the tournament.",
  reservationsRequired: true,
};

const gettingThere = `Approx. 4-minute drive or a walkable route to Billancourt Métro station (Line 9), which connects toward Porte d'Auteuil, the closest stop to Stade Roland-Garros.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Ibis Boulogne-Billancourt — Mid-Range Stay",
      subtitle: "A 4-minute drive from Roland-Garros, consistently well-rated across every platform",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: PARIS_ID,
      sportingEventId: FRENCH_OPEN_EVENT_ID,
      neighborhood: "Boulogne-Billancourt",
      address: "Boulogne-Billancourt, France",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Considered Hôtel Poussin first (commonly cited as the 16th-arr. mid-range pick) but rejected after checking independent sources: Google 3.5/235 reviews, Tripadvisor ranked #1,660 of 1,885 Paris hotels (bottom 12%) despite a misleadingly rosy Booking.com 7.6 headline. Ibis Boulogne-Billancourt is better attested across 4 independent sources: Booking 8.5/1026, Travelocity 8.6, Google 4.2/586 (verified via Places API), Tripadvisor #11 of 25 in Boulogne-Billancourt (top 44%). Deposit-related complaint pattern noted honestly per skill §2c rigor. Verified 4 Sep 2026. Hero image pending — batch pass to follow.",
      googleMapsRating: "4.2",
      googleMapsReviewCount: 586,
      googleMapsUrl: "https://maps.google.com/?cid=6946613228810821762",
      moodTags: ["practical", "convenient", "reliable"],
      interestCategories: ["accommodation"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "EUR",
      budgetMinCost: "120",
      budgetMaxCost: "200",
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

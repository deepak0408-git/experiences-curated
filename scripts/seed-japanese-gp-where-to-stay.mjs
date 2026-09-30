// Seed: "Where to Stay — Nagoya vs. the Suzuka Area" — experience #12/20 for
// Japanese Grand Prix 2027 (Suzuka).
//
// Sources (verified 21 Sep 2026):
// - f1destinations.com, gpdestinations.com, rakuten.com Nagoya hotel guides
//   (Nagoya-as-base pattern, gathered earlier this session)
// - Real Google Places API lookups (21 Sep 2026): Nagoya Marriott Associa
//   Hotel — 4.3/5,934 reviews; Hotel LiVEMAX Nagoya-Shinkansenguchi — 3.8/330
//   reviews. Multi-venue experience — no top-level googleMapsRating; live
//   inline links per venue, per skill §2c.
//
// NOTE: multi-venue — after seeding, add a MULTI_VENUE_RATINGS entry in
// app/experience/[slug]/page.tsx with venueCount: 2 (Marriott Associa +
// Livemax) — required per skill §2c rule 6 / §5b gap audit.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9a26a4f4-2d3b-4e68-9bc3-ce2b55bb15e9";
const EVENT_ID = "9fe13c2e-37d1-49f0-8a48-d3ea40186fe4";
const slug = "japanese-gp-suzuka-where-to-stay";

const bodyContent = `The honest answer to "where should I stay for Suzuka" is Nagoya, not Suzuka itself. The circuit sits in a small city with genuinely limited hotel stock, and what exists there — along with nearby Tsu and Yokkaichi — gets taken by F1 teams and media well before general sale. Trying to book a room in Suzuka for race weekend usually means paying a premium for whatever's left, if anything is.

Nagoya solves this cleanly. It's the nearest large city with a real hotel market, well connected to the circuit by direct and connecting rail services, and close enough that the commute — roughly an hour to ninety minutes depending on the route — doesn't eat meaningfully into your race weekend.

At the upscale end, the Nagoya Marriott Associa Hotel is the standout pick, sitting directly above JR Nagoya Station's Takashimaya department store — a few steps from the platforms, not a taxi ride away. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=9839908105339736563&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA). It's a genuine 4.5-star business hotel, and reviewers consistently flag the location, the room quality, and the breakfast as the reasons to pay for it — this isn't a hotel riding on its Marriott name alone.

At the budget end, Hotel LiVEMAX Nagoya-Shinkansenguchi is a real, well-located alternative — about a five-minute walk from Nagoya Station, considerably cheaper than the Marriott, and enough of a functional base for a weekend built around the circuit rather than the hotel. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=17011099253351765635&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA). It's a no-frills business hotel — flat-screen TV, basic amenities — priced for people who'd rather spend the difference on tickets or a hospitality upgrade.

Between the two, most fans land near Nagoya Station specifically, regardless of budget, because the rail connection to Suzuka starts there and every onward route — the standard Meitetsu/JR/Ise Railway connection, the direct Kintetsu-to-Shiroko route, or the race-weekend limited express — begins at the same station. A hotel a few stops away from Nagoya Station saves money but adds a transfer to every single day of the weekend, worth weighing against the price difference.

Osaka is sometimes mentioned as a further alternative, but the commute is genuinely longer — worth its own consideration, covered separately, rather than treated as a like-for-like Nagoya substitute.`;

const whyItsSpecial = `Suzuka's own limited hotel stock isn't a minor inconvenience — it's routinely absorbed by teams and media before public sale even opens, which makes "stay near the circuit" a non-option for most fans regardless of budget. Nagoya isn't a compromise position; it's the genuine, well-established base every serious Suzuka guide converges on, with real hotel choice at every price point and a direct rail line to the circuit that starts at the same station you're already staying near.

Knowing this before booking saves the mistake of chasing a Suzuka-area room that either doesn't exist by the time you look, or costs more than a better Nagoya option for a worse location relative to transit.`;

const insiderTips = [
  "Book a hotel within walking distance of Nagoya Station specifically, not just anywhere in Nagoya — every rail route to Suzuka, including the race-weekend direct express, starts from that one station, and a few stops' distance adds a transfer to every day of the weekend.",
  "If you're weighing Nagoya against Suzuka itself, don't wait to check Suzuka-area availability first — teams and media typically take what little hotel stock the town has well before general booking windows open, so start with Nagoya as the default rather than a fallback.",
];

const whatToAvoid = `Don't assume a cheaper hotel outside the immediate Nagoya Station area is a minor tradeoff — the added transfer applies to every single day of the race weekend, not just once, and the time cost compounds. Don't leave a Suzuka-area room search until close to the event hoping something opens up — the town's genuinely small hotel stock is absorbed by teams and media well ahead of race weekend, and waiting rarely pays off.`;

const practicalInfo = {
  hours: "Standard hotel check-in from 3pm, check-out by 11am at both properties — confirm current policy at booking",
  costRange: "Nagoya Marriott Associa Hotel: upscale, from ~US$140+/night; Hotel LiVEMAX Nagoya-Shinkansenguchi: budget, from ~US$35+/night",
  bookingMethod: "Both hotels bookable directly or via major booking platforms — book well ahead of race weekend, as Nagoya's own hotel stock also fills quickly once the Grand Prix dates are widely known.",
  website: "https://www.marriott.com/en-us/hotels/ngodt-nagoya-marriott-associa-hotel/overview/, https://www.hotel-livemax.com/",
};

const gettingThere = "Both hotels sit within walking distance of JR Nagoya Station — every onward rail route to Suzuka Circuit begins there. See the dedicated Getting to Suzuka experience for the full connection detail.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Where to Stay — Nagoya vs. the Suzuka Area",
      subtitle: "Suzuka's hotel stock goes to teams and media first — Nagoya Station is the real base for race weekend.",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Nagoya Station",
      address: "Nagoya Marriott Associa Hotel, 1-1-4 Meieki, Nakamura-ku, Nagoya, Aichi 450-6002, Japan; Hotel LiVEMAX Nagoya-Shinkansenguchi, Nagoya, Aichi, Japan",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sources: f1destinations.com, gpdestinations.com, rakuten.com Nagoya hotel guides (base pattern, gathered earlier this session). Real Google Places API lookups, 21 Sep 2026: Nagoya Marriott Associa Hotel (4.3/5,934 reviews), Hotel LiVEMAX Nagoya-Shinkansenguchi (3.8/330 reviews). Multi-venue — MULTI_VENUE_RATINGS entry (venueCount: 2) still needed in app/experience/[slug]/page.tsx.",
      sport: ["formula_one"],
      moodTags: ["planning", "first-timer"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-21",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db
    .insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓ Experience created:", result.title, "|", result.id, "|", result.slug, "|", result.status);
  console.log("⚠ REMINDER: multi-venue experience — add MULTI_VENUE_RATINGS entry (venueCount: 2) to app/experience/[slug]/page.tsx");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

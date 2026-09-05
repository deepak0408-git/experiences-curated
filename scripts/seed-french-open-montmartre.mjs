import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const PARIS_ID = "488adb47-5327-43e2-8206-d40480301962";
const FRENCH_OPEN_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";
const slug = "montmartre-neighborhood";

const bodyContent = `Roland-Garros sits in a quiet, wealthy corner of the 16th arrondissement. Montmartre, on the north side of the city entirely, is its deliberate opposite: a steep hilltop village of a neighborhood that spent the Belle Époque as the actual working studio of modern art, and still trades on that history today. Modigliani, Monet, Degas, Toulouse-Lautrec, Picasso and Van Gogh all had studios here; the streets that inspired Renoir and Piaf are largely the same ones you walk today.

Sacré-Cœur Basilica is the hill's obvious anchor: a blinding-white church visible from much of Paris, free to enter, with steps out front offering one of the city's best panoramic views. Climb the dome's 292 steps for a higher, more complete view if the crowds on the front steps don't already satisfy. It's genuinely one of the most-reviewed landmarks in the city — nearly 168,000 Google reviews at a 4.7 average, a level of consistent praise that few attractions anywhere sustain at that volume. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=14970958066519606553)

A few streets away, Place du Tertre keeps the artist-colony identity alive literally: working artists set up easels here daily, offering portraits and caricatures on the spot, a direct descendant of the square's role as the actual meeting point for Montmartre's Belle Époque painters. It's touristy in the way any famous square with this much foot traffic inevitably becomes, but the practice itself, artists working live in a public square, is a genuine continuation rather than a staged recreation.

Beyond the two headline stops, Montmartre rewards wandering: Moulin de la Galette, the historic windmill Renoir painted directly, still stands; the city's only working vineyard sits tucked into the hillside; and the streets themselves, steep, cobbled, lined with ivy and shutters, look almost nothing like the wide Haussmannian boulevards that define most of central Paris.`;

const whyItsSpecial = `The 16th arrondissement, where Roland-Garros sits, is elegant, quiet, residential — genuinely lovely, but not where Paris's creative history actually happened. Montmartre is. Pairing a morning at the tournament with an afternoon on this hill gives a Roland-Garros trip two entirely different registers of Paris in the same day: the tournament's institutional grandeur, then a neighborhood built by painters who mostly couldn't afford institutional anything.

The hill itself does real work here too. Paris is famously flat and horizontal in its most touristed center; Montmartre is the exception, a genuine climb that rewards itself with a view most of the rest of the city can't offer. Combined with the Sacré-Cœur's near-unanimous praise across nearly 170,000 reviews, this isn't an underrated secret so much as a correctly-rated essential that happens to sit far enough from the tennis that visitors focused purely on Roland-Garros sometimes skip it entirely. Don't.`;

const insiderTips = [
  "Climb the Sacré-Cœur's dome (292 steps, separate ticket from the free basilica entry) for a higher, less crowded view than the popular front steps — most visitors never go past the steps, so the dome view is a genuinely quieter payoff for the same hill.",
  "Visit Place du Tertre's working artists earlier in the day if you actually want a portrait done without a long wait — the square gets progressively busier through the afternoon as tour groups arrive.",
];

const whatToAvoid = `Don't expect Place du Tertre to feel like an undiscovered artist's square — it's one of the most touristed spots in Montmartre, and treating it as a hidden gem sets up disappointment; go for the genuine continuation of the practice, not for solitude. And don't plan a Montmartre visit around a Roland-Garros match on the same day without accounting for real cross-city travel time — this is the opposite side of Paris from the stadium, and the trip each way runs a genuine 45 minutes to an hour by Métro, not a quick add-on between sessions.`;

const practicalInfo = {
  address: "Montmartre, 75018 Paris, France",
  website: "https://www.sacre-coeur-montmartre.com",
  hours: "Sacré-Cœur Basilica: daily 06:00-22:30, free entry; dome climb has separate paid hours",
  costRange: "Free to walk and enter the basilica; dome climb approx. €8-10; portraits at Place du Tertre typically €20-50 depending on artist and size",
  bookingMethod: "No booking required for the neighborhood or basilica. Dome tickets and any guided walking tour can be booked online in advance if preferred.",
  reservationsRequired: false,
};

const gettingThere = `Anvers or Abbesses (Métro Line 2 or 12) are the standard entry points, both a walk or funicular ride up the hill to Sacré-Cœur. This is a genuine cross-city trip from Roland-Garros — budget 45 minutes to an hour by Métro each way.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Montmartre",
      subtitle: "The hilltop village where modern art actually happened — Sacré-Cœur, artists, and a view over the whole city",
      slug,
      experienceType: "neighborhood",
      status: "in_review",
      destinationId: PARIS_ID,
      sportingEventId: FRENCH_OPEN_EVENT_ID,
      neighborhood: "Montmartre, 18th arrondissement",
      address: "Montmartre, 75018 Paris, France",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Artist history (Modigliani, Monet, Degas, Toulouse-Lautrec, Picasso, Van Gogh) and Place du Tertre/Moulin de la Galette detail from paristickets.com and parisinsidersguide.com. Sacré-Cœur rating verified via Places API: 4.7/167,590 reviews, cited inline since this experience's primary subject is the neighborhood, not a single venue. Verified 4 Sep 2026. Hero image pending — batch pass to follow.",
      moodTags: ["artistic", "iconic", "romantic"],
      interestCategories: ["culture_and_history"],
      pace: "moderate",
      physicalIntensity: 3,
      budgetTier: "free",
      budgetCurrency: "EUR",
      bestSeasons: ["may"],
      advanceBookingRequired: false,
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

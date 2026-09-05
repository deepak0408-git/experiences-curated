import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const PARIS_ID = "488adb47-5327-43e2-8206-d40480301962";
const FRENCH_OPEN_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";
const slug = "caveau-de-la-huchette-jazz";

const bodyContent = `Le Caveau de la Huchette runs jazz seven nights a week from inside a medieval cellar in the Latin Quarter, and it's been doing it long enough to have genuinely earned the word legendary rather than just claiming it. The venue occupies stone vaults that predate the club itself by centuries; the swing and big-band programming that made the room famous still runs, alongside contemporary jazz and soloist acts that keep the booking current rather than nostalgic.

A single ticket, €34 Sunday through Thursday and €39 on Friday and Saturday, covers the entire night: live sets, the dance floor, the upstairs bar, no cover charges layered on top and no time limit before closing. Doors open at 9:30pm; the room runs until 2:30am on quieter nights and as late as 5:30am Thursday through Saturday. Get there 30-45 minutes before opening, especially on a weekend, because the room fills fast and standing at the back of a sold-out medieval cellar isn't the same experience as being close enough to actually see the band.

What makes this worth a special trip rather than a passing mention is the combination of history and genuine current use. This isn't a themed jazz club built to look old — it's a real medieval cellar that's hosted jazz since well before it became fashionable to seek out "authentic" nightlife, and it still draws a crowd that dances rather than just watches. Swing dancing in particular has a real following here; regulars show up specifically for it, not just tourists passing through the Latin Quarter.

For a Roland-Garros trip, this is the answer to "what do I do after the tennis finishes for the day" that doesn't involve another restaurant or another hotel bar. A late tournament session ends, dinner somewhere in the Latin Quarter, then down into the cellar for whatever's playing that night.`;

const whyItsSpecial = `Most "historic jazz club" recommendations in any city have quietly become tourist theater — the history is real, but the actual music and crowd have drifted toward performance for visitors rather than a functioning nightlife venue. Caveau de la Huchette still has both halves working: the medieval cellar is genuinely centuries old, and the room still fills with people who came specifically to dance, not just to say they'd been.

The all-in ticket structure matters more than it sounds. No separate cover for the dance floor, no upsell for a better spot at the bar, just one price for the whole night regardless of how long you stay or how much you drink. That's an unusually honest structure for a venue this well-known, and it changes the whole feel of the evening — you're not managing a tab against the clock, you're just there until you're not.`;

const insiderTips = [
  "Arrive 30-45 minutes before the 9:30pm doors, especially Friday or Saturday — the room genuinely fills to capacity, and a late arrival means standing at the back with a partial view of the band rather than being close to the stage.",
  "Weeknight tickets (€34, Sun-Thu) are cheaper than weekend tickets (€39, Fri-Sat) for the same all-in access — if your Roland-Garros schedule allows flexibility on which evening to go, a weeknight visit is both cheaper and usually less crowded.",
];

const whatToAvoid = `Don't expect a seated, quiet listening-room jazz experience — this is a genuinely full dance-floor venue, and if you specifically want to sit and listen without a crowd moving around you, a different, more formal jazz venue elsewhere in Paris will suit better. And don't show up right at 9:30pm on a weekend expecting an easy entry — the venue's own advice to arrive 30-45 minutes early exists because the room does fill up fast, and a same-time arrival on a busy night can mean a real wait or a compromised spot inside.`;

const practicalInfo = {
  address: "5 Rue de la Huchette, 75005 Paris, France",
  website: "https://lecaveaudelahuchette.fr/en/tickets",
  hours: "Sun-Wed 21:30-02:30; Thu-Sat 21:30-05:30",
  costRange: "€34 (Sun-Thu) / €39 (Fri-Sat) — all-inclusive, covers full night, no additional charges",
  bookingMethod: "Book online in advance via the official site, or pay at the door — arrive 30-45 minutes before the 9:30pm opening for the best chance at a good spot, especially on weekends.",
  reservationsRequired: false,
};

const gettingThere = `Saint-Michel or Cluny–La Sorbonne (both Métro/RER, Latin Quarter) are the closest stations, both a short walk from Rue de la Huchette. A genuine cross-city trip from Roland-Garros — budget 30-40 minutes each way.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Le Caveau de la Huchette",
      subtitle: "Live jazz and swing dancing in a medieval cellar, seven nights a week",
      slug,
      experienceType: "activity",
      status: "in_review",
      destinationId: PARIS_ID,
      sportingEventId: FRENCH_OPEN_EVENT_ID,
      neighborhood: "Latin Quarter",
      address: "5 Rue de la Huchette, 75005 Paris, France",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Pricing (€34/€39) and hours from official lecaveaudelahuchette.fr tickets page. History/character confirmed via Wikipedia (Le Caveau de la Huchette) and visitparisregion.com. Google rating verified via Places API: 4.3/4,040 reviews. Verified 4 Sep 2026. Hero image pending — batch pass to follow.",
      googleMapsRating: "4.3",
      googleMapsReviewCount: 4040,
      googleMapsUrl: "https://maps.google.com/?cid=6399405877439815158",
      moodTags: ["energetic", "historic", "social"],
      interestCategories: ["nightlife", "culture_and_history"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "EUR",
      budgetMinCost: "34",
      budgetMaxCost: "39",
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

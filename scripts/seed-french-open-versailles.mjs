import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const PARIS_ID = "488adb47-5327-43e2-8206-d40480301962";
const FRENCH_OPEN_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";
const slug = "versailles-day-trip";

const bodyContent = `Roland-Garros is inside Paris, so this pack's usual "day-trip city anchor" rule doesn't map cleanly onto the tournament itself. Versailles is the genuine substitute: not a nearby city, but a full day trip outside Paris proper, and the single most obvious one for anyone with a rest day between match sessions.

Getting there is straightforward. The RER C train runs directly from central Paris, boarding at Saint-Michel–Notre-Dame, Musée d'Orsay, or Invalides, and takes 35-45 minutes depending on where you get on. Alternatives exist — a Transilien service from Gare Saint-Lazare to Versailles Rive Droite, or from Montparnasse to Versailles Chantiers — but RER C is the standard, most direct route, dropping you roughly a 10-minute walk from the palace gates.

Ticketing runs on timed entry, and slots genuinely sell out, especially through summer. The Passport ticket, €32 on Musical Fountains show days or €27 without, is the best value for most visitors: it covers the palace itself, the gardens (including on fountain-show days), the Trianon Estate, and Marie Antoinette's Hamlet. A Palace-only ticket runs €21, covering the main palace and gardens but not the Musical Fountains shows or the Trianon.

Budget 2-3 hours for a shorter visit covering the palace and a portion of the gardens; with travel time both ways factored in, the whole outing runs 4-7 hours depending on how much of the estate you cover. The Trianon Estate and Hamlet in particular reward extra time — a genuinely different, more intimate side of Versailles than the palace's state rooms, built as Marie Antoinette's private retreat from the formality of court life. On select evenings, nighttime fountain shows and a Royal Serenade add an after-dark option worth checking the calendar for.`;

const whyItsSpecial = `Roland-Garros gives you Paris at its most contained and civic — a tournament inside the city, a short Métro ride from wherever you're staying. Versailles is the opposite register entirely: French royal power at its most unrestrained, a palace and garden complex built specifically to overwhelm anyone who walked through it. Seeing both on the same trip is seeing two genuinely different versions of what this country has been at its most confident.

The Trianon and Hamlet are the part most first-time visitors skip, rushing to see the Hall of Mirrors and leaving before covering the rest of the estate — and they're arguably the more interesting half. A palace built to project absolute authority, and a few hundred metres away, a fake rustic village built by the same monarchy specifically to escape that authority for an afternoon. That contradiction, hiding in plain sight across the same grounds, is worth the extra hour it takes to walk there.`;

const insiderTips = [
  "Book timed-entry tickets online well ahead, especially for a May-June visit — Versailles genuinely sells out during peak season, and arriving without a pre-booked slot risks a wait of over an hour or being turned away entirely.",
  "The Passport ticket (€32 on Musical Fountains days, €27 without) covers the Trianon Estate and Hamlet that the cheaper Palace-only ticket (€21) doesn't — if a full day is planned, the Passport's marginal cost is worth it for access to what many visitors consider the estate's best part.",
];

const whatToAvoid = `Don't plan a Versailles day trip on the same day as a Roland-Garros match unless the match is in the evening — between the 35-45 minute RER C journey each way and the genuine 4-7 hours a proper visit takes, combining both in one day means shortchanging one or the other. And don't skip pre-booking assuming a Palace-only ticket can be bought at the gate on a busy day — timed-entry slots are the actual system now, and walking up without one during peak season risks a significant wait or no entry that day at all.`;

const practicalInfo = {
  address: "Place d'Armes, 78000 Versailles, France",
  website: "https://en.chateauversailles.fr",
  hours: "Tue-Sun 09:00-18:30 (palace); gardens typically open later into the evening — check seasonal hours",
  costRange: "Passport ticket €27-32 (palace + gardens + Trianon + Hamlet); Palace-only €21",
  bookingMethod: "Book timed-entry tickets online in advance via en.chateauversailles.fr — essential during May-June, especially on weekends and Musical Fountains days.",
  reservationsRequired: true,
};

const gettingThere = `RER C from Saint-Michel–Notre-Dame, Musée d'Orsay, or Invalides to Versailles Château Rive Gauche, 35-45 minutes, then a 10-minute walk to the palace gates. Alternative: Transilien from Gare Saint-Lazare to Versailles Rive Droite, or from Montparnasse to Versailles Chantiers.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Versailles — Day Trip Outside Paris",
      subtitle: "A palace built to overwhelm, and the private village its own monarchy built to escape it",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: PARIS_ID,
      sportingEventId: FRENCH_OPEN_EVENT_ID,
      neighborhood: "Versailles, Île-de-France",
      address: "Place d'Armes, 78000 Versailles, France",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Transit routes (RER C, Transilien alternatives) and ticket pricing (€21 Palace-only, €27-32 Passport) from earthtrekkers.com and en.chateauversailles.fr official site. Google rating verified via Places API: 4.6/170,677 reviews. This is the pack's day-trip-outside-the-host-city substitute since Roland-Garros sits inside Paris itself, unlike most events with a nearby-city day-trip anchor. Verified 4 Sep 2026. Hero image pending — batch pass to follow.",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 170677,
      googleMapsUrl: "https://maps.google.com/?cid=376328476344045199",
      moodTags: ["grand", "historic", "must-see"],
      interestCategories: ["culture_and_history"],
      pace: "active",
      physicalIntensity: 3,
      budgetTier: "moderate",
      budgetCurrency: "EUR",
      budgetMinCost: "21",
      budgetMaxCost: "32",
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

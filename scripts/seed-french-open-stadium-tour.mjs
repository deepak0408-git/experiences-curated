import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const PARIS_ID = "488adb47-5327-43e2-8206-d40480301962";
const FRENCH_OPEN_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";
const slug = "roland-garros-stadium-tour-tenniseum";

const bodyContent = `Outside the tournament's two weeks, Roland-Garros isn't sealed off — it's open, on a guided tour called "Les coulisses du Stade Roland-Garros," and it goes places match-day tickets never do. The route runs through the press room, the players' tunnel, the locker rooms, and the presidential box, all areas that stay closed to the public the other 50 weeks of the year for the obvious reason that they're working spaces, not attractions, when the tournament is live. Walking the same corridor a nervous 20-year-old walked before a fourth-round match is a different way of understanding the building than watching from a grandstand seat ever is.

The tour runs about 90 minutes and folds directly into a visit to the Tenniseum, the French Tennis Federation's own museum, built into the stadium and reopened in its current form on 23 May 2024. It's compact by museum standards, roughly 1,000 square metres, but it doesn't waste the space: a 358-seat auditorium, an immersive multimedia cinema, and a genuinely deep collection tracing tennis history back through the amateur era, well before Roland-Garros existed in its current form. Between the guided route and a proper look through the museum afterward, most visitors spend 1.5 to 2.5 hours on site.

Guides run the tour in multiple languages — French, English, German, Spanish, Portuguese, Arabic, Japanese, Finnish and Swedish among them — which matters for a stadium that draws a genuinely international visitor base year-round, not just during the tournament. Tickets are online-only; there's no walk-up sales window at the stadium itself, so this is a book-ahead visit rather than a spontaneous one.

At €19, it's the single cheapest way to actually stand inside Roland-Garros outside tournament fortnight, and for anyone whose trip doesn't line up with the two weeks of May-June play, it's the only way at all.`;

const whyItsSpecial = `A tournament ticket gets you the tennis. This gets you the building — the parts built for the people who work here rather than the people watching them. There's a particular value in seeing a locker room or a players' tunnel stripped of the tension that fills it during a match: it's just architecture and function, and somehow that makes the tournament itself more legible afterward, not less interesting.

The Tenniseum earns its place here rather than feeling like an add-on tacked onto the tour to justify the ticket price. Tennis history predates Roland-Garros by decades, and a museum built by the sport's own French governing body has the access and the archive to tell that story properly rather than skimming it. Anyone who only ever sees Roland-Garros during tournament fortnight, jammed with 30,000 other people and focused entirely on whoever's on Chatrier that day, misses this entirely: the building has a history of its own, and for 90 minutes on a quiet weekday, it's yours to actually look at.`;

const insiderTips = [
  "Book online in advance — tours are not sold on-site, so arriving without a pre-booked ticket means no tour that day, regardless of availability.",
  "Multiple language options run throughout the week (French, English, German, Spanish, Portuguese, Arabic, Japanese, Finnish, Swedish) — check the specific tour time's language before booking if a non-French/English tour matters to you, since not every slot runs every language.",
];

const whatToAvoid = `Don't expect to combine this tour with tournament-fortnight access — the backstage areas covered (locker rooms, players' tunnel, press room) are working spaces during the actual event and the tour doesn't run during those two weeks; this is strictly an off-tournament visit. And don't rush straight through the Tenniseum expecting a quick add-on stop — at 1,000 square metres with a dedicated cinema and auditorium, it rewards the same amount of time as the guided tour itself, and visitors who treat it as an afterthought tend to say afterward they wished they'd budgeted longer.`;

const practicalInfo = {
  address: "2 Avenue Gordon Bennett, 75016 Paris, France, entrance via Gate 36",
  website: "https://www.rolandgarros.com/en-us/page/stadium-tour-roland-garros-philippe-chatrier-court-infos-tickets-prices",
  hours: "Runs on scheduled slots outside tournament fortnight — check the official site for the current calendar",
  costRange: "€19 per person, combined stadium tour + Tenniseum museum",
  bookingMethod: "Online only via the official Roland-Garros site — no on-site or walk-up sales. Book ahead, especially for a specific language slot.",
  reservationsRequired: true,
};

const gettingThere = `Enter via Gate 36, Avenue Gordon-Bennett. Porte d'Auteuil (Métro Line 9) is the closest stop, a 10-minute walk. Porte de Saint-Cloud and Michel-Ange–Molitor (both Line 9, the latter also Line 10) are realistic alternatives.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Stadium Backstage Tour + Tenniseum Museum",
      subtitle: "Locker rooms, the players' tunnel, and a museum tracing tennis back before Roland-Garros existed",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: PARIS_ID,
      sportingEventId: FRENCH_OPEN_EVENT_ID,
      neighborhood: "16th arrondissement / Porte d'Auteuil",
      address: "2 Avenue Gordon Bennett, 75016 Paris, France",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Tour details/pricing (€19, 90min, 'Les coulisses du Stade Roland-Garros' route) from official rolandgarros.com stadium tour page and paristickets.com/headout.com corroboration. Tenniseum reopening date (23 May 2024) and specs (1,000m², 358-seat auditorium) from Wikipedia (Tenniseum). Verified 4 Sep 2026. Hero image pending — batch pass to follow.",
      moodTags: ["educational", "immersive", "authentic"],
      interestCategories: ["sport", "culture_and_history"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "budget",
      budgetCurrency: "EUR",
      budgetMinCost: "19",
      budgetMaxCost: "19",
      bestSeasons: ["jan","feb","mar","apr","sep","oct","nov","dec"],
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

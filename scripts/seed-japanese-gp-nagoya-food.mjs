// Seed: "Nagoya's Food Scene — Hitsumabushi, Miso Katsu, and Tebasaki" —
// experience #14/20 for Japanese Grand Prix 2027 (Suzuka).
//
// Sources (verified 21 Sep 2026):
// - tabelog.com "30 Must-Try Local Dishes in Nagoya", agoda.com Nagoya guide
//   (gathered earlier this session — hitsumabushi ritual, miso katsu, tebasaki)
// - Real Google Places API lookups (21 Sep 2026): Atsuta Houraiken Jingu —
//   4.4/6,229 reviews; Misokatsu Yabaton Sakae Matsuzakaya — 3.9/965 reviews.
//   Multi-venue — no top-level rating, live inline links per venue.
//
// NOTE: multi-venue — MULTI_VENUE_RATINGS entry (venueCount: 2) required in
// app/experience/[slug]/page.tsx after seeding.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9a26a4f4-2d3b-4e68-9bc3-ce2b55bb15e9";
const EVENT_ID = "9fe13c2e-37d1-49f0-8a48-d3ea40186fe4";
const slug = "japanese-gp-nagoya-food-scene";

const bodyContent = `Nagoya's food identity doesn't get talked about the way Tokyo's or Osaka's does, but it's genuinely distinct — richer, more specific, and built around a handful of dishes you won't find done the same way anywhere else in Japan.

Hitsumabushi is the dish to build a meal around, and Atsuta Hōraiken is where to eat it. Grilled eel over rice, but eaten in a specific ritual: first as it comes, then with condiments — scallion, wasabi, nori — mixed in, and finally with dashi broth poured over the last portion to turn it into a light ochazuke. Atsuta Hōraiken has been serving this since 1873, and the queue at lunchtime is a genuine indicator of how seriously locals take it, not a tourist-trap symptom. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=199078152656523891&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA).

Miso katsu is Nagoya's other signature, and it's a genuine variation on standard tonkatsu, not a minor twist — the pork cutlet gets topped with a rich, dark, red miso sauce that's noticeably heavier and more savory than the usual tonkatsu sauce. Yabaton is the institution here, running since 1947 with multiple locations across the city, and the Sakae Matsuzakaya branch is a solid, central pick if you're already in that part of town. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=3228807948534630737&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA).

Beyond these two anchor dishes, tebasaki — Nagoya-style fried chicken wings, double-fried and coated in a sweet-savory glaze with sesame and pepper — is the city's genuine izakaya staple, worth seeking out at any of the many spots that specialize in it rather than treating it as a side dish. Kushikatsu (skewered, deep-fried items) and tenmusu (small shrimp tempura rice balls) round out the list of dishes locals actually eat regularly, as opposed to dishes built for tourists.

If you're only eating two Nagoya specialties on a short trip, hitsumabushi and miso katsu are the two that most define the city's food identity — everything else is worth trying if you have the time, but these two are the ones you'd genuinely regret skipping.`;

const whyItsSpecial = `Nagoya's food scene has a real, specific identity that gets overshadowed by Tokyo and Osaka on most Japan itineraries — and that's a mistake, because hitsumabushi's ritual-eating format and miso katsu's genuinely different sauce aren't dishes you can substitute for elsewhere in the country.

Atsuta Hōraiken and Yabaton aren't tourist recommendations dressed up as local ones — they're the actual institutions locals queue for, with the history (1873 and 1947 respectively) and the reviews to back it up.`;

const insiderTips = [
  "Order hitsumabushi and actually follow the three-stage eating ritual — as-is, then with condiments, then as ochazuke with dashi poured over — rather than eating it like a standard rice bowl; the dish is genuinely built around that sequence.",
  "Go to Atsuta Hōraiken outside peak lunch hours if you want to skip the queue — it's a real, long-running wait at midday specifically, not an all-day phenomenon.",
];

const whatToAvoid = `Don't confuse Nagoya's miso katsu sauce with standard tonkatsu sauce and expect a similar flavor — it's a distinctly different, heavier miso-based sauce, and going in expecting the usual brown tonkatsu sauce sets the wrong expectation. Don't treat tebasaki as an afterthought or side dish — it's a genuine Nagoya specialty in its own right, worth ordering as a proper part of the meal rather than skipping in favor of the two headline dishes.`;

const practicalInfo = {
  hours: "Atsuta Hōraiken: typically 11:30am-2pm, 4:30pm-8:30pm (closed Mondays — confirm current schedule); Yabaton Sakae Matsuzakaya: department store restaurant hours, typically 11am-9pm",
  costRange: "Hitsumabushi at Atsuta Hōraiken: moderate to splurge, roughly ¥5,000-6,000 per person; Miso katsu at Yabaton: budget to moderate, roughly ¥1,500-2,500",
  bookingMethod: "Neither requires advance reservation for standard dining, but Atsuta Hōraiken's lunchtime queue is real — arrive early or off-peak.",
  website: "https://www.houraiken.com/, https://www.yabaton.com/",
};

const gettingThere = "Atsuta Hōraiken's main location sits near Atsuta Shrine, accessible via the Meitetsu Nagoya Main Line. Yabaton's Sakae Matsuzakaya branch is inside Matsuzakaya department store, a short walk from Sakae subway station.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Nagoya's Food Scene — Hitsumabushi and Miso Katsu",
      subtitle: "The city's own dishes, done at the institutions locals actually queue for.",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Nagoya",
      address: "Atsuta Hōraiken, 503 Jingu 1-chome, Atsuta-ku, Nagoya, Aichi, Japan; Yabaton Sakae Matsuzakaya, Naka-ku, Nagoya, Aichi, Japan",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sources: tabelog.com '30 Must-Try Local Dishes in Nagoya', agoda.com Nagoya guide (gathered earlier this session). Real Google Places API lookups, 21 Sep 2026: Atsuta Houraiken Jingu (4.4/6,229 reviews), Misokatsu Yabaton Sakae Matsuzakaya (3.9/965 reviews). Multi-venue — MULTI_VENUE_RATINGS entry (venueCount: 2) still needed in app/experience/[slug]/page.tsx.",
      sport: ["formula_one"],
      moodTags: ["food", "local-culture"],
      interestCategories: ["food"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: false,
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

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEvents, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "6c920919-1d28-420a-a711-2a58fc8ba9e1"; // Austin
const EVENT_SLUG = "united-states-grand-prix";
const slug = "us-gp-austin-live-music-" + Date.now().toString(36);

const [existingEvent] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

if (!existingEvent) {
  throw new Error(`Sporting event not found for slug ${EVENT_SLUG}`);
}
const eventId = existingEvent.id;

const bodyContent = `Austin's F1 weekend brings arena headliners to the Germania Insurance Super Stage, but that's a recent layer on top of something the city built its actual reputation on decades earlier. Austin was officially named the "Live Music Capital of the World" in 1991, a title backed by hundreds of nightclubs, bars, and venues across the city presenting live music on a regular basis — not a marketing slogan, a description of genuine, sustained scale.

The scene's real roots go back further. Armadillo World Headquarters, through the 1970s, became the home base for Willie Nelson after he left Nashville specifically to make music the way he wanted, helping establish Austin's identity as a place serious musicians actually chose over the traditional industry centers. Around the same time, Clifford Antone opened the blues club that gave rise to Stevie Ray Vaughan, the Fabulous Thunderbirds, and a generation of blues talent that came out of Austin rather than Chicago or Memphis.

Two venues from that era are still open and still worth a visit today. The Continental Club, opened in 1955 as a private supper club before becoming the dive-bar live-music venue it's known as now, holds a real 4.6 rating from over 2,300 reviews. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=11117455511069744292&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA). The Broken Spoke, opened in 1964 by James and Annetta White, is one of the city's longest-standing country music venues and has hosted genuine legends over the decades — Dolly Parton, George Strait, Willie Nelson himself. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=8478246202833292969&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA).

For something more current, Antone's continues under the same blues-focused identity across its various relocations over the years, and downtown venues like The Parish (a genuinely striking room with gothic chandeliers) and multi-stage spots like Mohawk and Empire Control Room and Garage cover rock, indie, and punk for a younger, more current crowd. None of this requires the arena scale of a Maroon 5 or Post Malone set — these are rooms holding a few hundred people at most, where the performer-audience distance most big shows can't offer is the entire point.`;

const whyItsSpecial = `The Super Stage concerts are a genuine highlight of F1 weekend, but they're also the same kind of arena-scale show you could see in any major city hosting a headline act. Austin's actual musical identity lives in rooms like the Continental Club and the Broken Spoke — spaces with 70 years of continuous history, where the distance between stage and audience is a few feet rather than a stadium's worth of space. Spending even one evening in one of these venues during an F1 trip is the difference between visiting Austin during a big event and actually experiencing what made this city call itself the Live Music Capital of the World in the first place, decades before F1 ever arrived.`;

const insiderTips = [
  "The Broken Spoke runs genuine two-step dance lessons some nights before the music starts — worth checking their schedule specifically if you want the full honky-tonk experience rather than just watching from the side.",
  "Both the Continental Club and Broken Spoke are cash-friendly but not cash-only in the way some historic dive bars can be — bring a card as backup regardless, since Austin venues broadly lean toward card payment now.",
];

const whatToAvoid = `Don't assume a small, historic-looking venue means a quiet, easy-to-get-into night — both the Continental Club and Broken Spoke draw real, loyal local crowds and can fill up on a good night despite their modest size. Don't treat the Super Stage concerts as the full picture of Austin's music scene — they're a genuine highlight, but they're arena-scale shows that could happen in any major city; the small-venue scene is what's actually distinctive to Austin specifically.`;

const gettingThere = `Both sit in South Austin, a short rideshare from Downtown or South Congress hotels.`;

const practicalInfo = {
  hours: "Both typically open evening through late night; specific show schedules vary nightly",
  costRange: "Cover charges typically run $10-25 depending on the act; drinks separate",
  bookingMethod: "No advance booking needed for most shows — pay cover at the door. Check each venue's own site for the current week's lineup before heading over, since schedules shift nightly.",
  website: "https://continentalclub.com, https://www.brokenspokeaustintx.net",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Austin's Live Music Scene — Beyond the Festival Stage",
      subtitle: "Officially named \"Live Music Capital of the World\" in 1991 — and the small clubs that earned it long before that",
      slug,
      experienceType: "activity",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: eventId,
      neighborhood: "South Austin",
      address: "The Continental Club, 1315 S Congress Ave, Austin, TX 78704; The Broken Spoke, 3201 S Lamar Blvd, Austin, TX 78704",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sources: statesman.com History of how Austin became the Live Music Capital of the World (1991 official naming, Armadillo World Headquarters/Willie Nelson, Clifford Antone/Stevie Ray Vaughan history), continentalclub.com (1955 opening, supper-club-to-dive-bar history), Wikipedia Broken Spoke (1964 opening, James and Annetta White, Dolly Parton/George Strait/Willie Nelson bookings history). MULTI-VENUE (The Continental Club, Broken Spoke individually named with live ratings) — requires MULTI_VENUE_RATINGS['us-gp-austin-live-music'] entry with venueCount: 2, added in this same session. Both ratings real, individual Google Places lookups (Continental Club 4.6/2,336, Broken Spoke 4.2/2,323). No Concierge trigger, no affiliate opportunity (walk-in cover charge venues). Verified 5 Sep 2026. This is the 20th and final experience of the locked US GP 2026 list.",
      sport: ["formula_one"],
      moodTags: ["music", "local-institution", "history"],
      interestCategories: ["entertainment", "culture"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "budget",
      budgetCurrency: "USD",
      bestSeasons: ["oct"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-05",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db
    .insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: eventId })
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

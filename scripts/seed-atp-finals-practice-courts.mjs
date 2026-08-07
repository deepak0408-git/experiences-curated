import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "1a968a48-105b-4c30-b092-56e0cdc4a0a2";
const EVENT_ID = "8e4d5aac-f472-48ac-b515-d253487cda50";
const slug = "atp-finals-practice-courts-" + Date.now().toString(36);

const bodyContent = `Circolo della Stampa Sporting is a real, working sports club in Turin's Santa Rita neighbourhood — on Corso Agnelli, close to Inalpi Arena — that became the ATP Finals' official Training Center starting in 2021, the first time a tennis club has been directly involved as a venue in organising the tournament.

A 1960s warehouse on the site was restructured specifically for this purpose: two Greenset courts installed under a semitransparent polycarbonate roof, built to meet international standards for lighting, court dimensions, and internal height. Past ATP Finals champions have specifically praised the facility, and it's remained the tournament's permanent practice venue through multiple editions.

This is where the closest, most unscripted player access at the entire tournament happens. Practice sessions here are genuinely intimate — you can watch top-8 players warm up from just a few feet away, and photos or autographs happen without the chaos of a match-day crowd. A Circolo della Stampa Sporting practice ticket covers access to both the training centre itself and all three Fan Village pavilions, from 15-20 November, and for 2026 there's a new open-view practice court specifically designed to bring fans even closer during pre-match preparation.

Access windows outside the main tournament week matter too: the practice court is accessible until 4pm on 11 November, and until 1pm on 12 and 13 November — the run-up days before the tournament proper begins, when players are still settling into the venue.`;

const whyItsSpecial = `This is the single closest a fan gets to the players at the entire tournament, and it's worth treating as a real, separate destination rather than an afterthought to a match ticket. Watching a top-8 player warm up a few feet away, without the formality and distance of match-day security, is a fundamentally different experience from watching from a grandstand seat — genuinely relaxed, genuinely close, and the kind of access most tournaments don't offer at all. The fact that this venue has been the permanent training centre since 2021, with real infrastructure built specifically for it rather than a temporary setup, signals the tournament takes this seriously as part of the fan experience, not a side note.`;

const insiderTips = [
  "A Circolo della Stampa Sporting practice ticket covers all three Fan Village pavilions too, 15-20 November — it's not just training-centre access, it's the broader fan-experience pass for that window.",
  "The run-up days (11-13 November, before the tournament's opening day) have their own practice access windows — worth checking if you're arriving early, since these are genuinely quieter, more intimate sessions than during the tournament week itself.",
];

const whatToAvoid = `Don't assume practice access is included with a standard match ticket — it's a separate ticket type tied specifically to Circolo della Stampa Sporting, and skipping it means missing the closest player access available at the whole event.`;

const practicalInfo = {
  hours: "Pre-tournament: until 4pm on 11 Nov, until 1pm on 12-13 Nov. Tournament week: 15-20 Nov, covers training centre plus all 3 Fan Village pavilions.",
  costRange: "Circolo della Stampa Sporting practice ticket — check official pricing.",
  bookingMethod: "Via official Nitto ATP Finals ticket site.",
  howToBook: "",
  website: "https://tickets.nittoatpfinals.com/en",
  reservationsRequired: true,
};

const gettingThere = "Corso Agnelli, Santa Rita district, Turin — near Inalpi Arena, same general transit access via tram lines 4/10.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Watch players practice at the Training Center",
      subtitle: "Circolo della Stampa Sporting — the closest, most unscripted player access at the whole tournament",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Santa Rita",
      address: "Corso Agnelli, 10137 Torino, Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Circolo della Stampa Sporting's role as official Training Center, facility details, and access windows confirmed via sporting.to.it and sporteimpianti.it, cross-checked against italianenthusiast.com for the fan-access description. Verified 4 Aug 2026.",
      sport: ["tennis"],
      moodTags: ["player-access", "intimate"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-04",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓ Created:", result.title, "→", result.id, result.slug, result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

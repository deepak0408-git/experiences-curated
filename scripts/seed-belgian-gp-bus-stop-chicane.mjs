import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEvents, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const BELGIAN_ARDENNES_ID = "101b815a-ba64-4484-aad6-63721a44ed85";
const BELGIAN_GP_SLUG = "belgian-gp-2026";
const slug = "bus-stop-chicane-grandstands-" + Date.now().toString(36);

const [existing] = await db.select({ id: sportingEvents.id }).from(sportingEvents).where(eq(sportingEvents.slug, BELGIAN_GP_SLUG));
const belgianGpEventId = existing?.id;

const bodyContent = `The Bus Stop Chicane is the final corner sequence at Spa-Francorchamps before the pit straight — a tight left-right flick named, as the official circuit history records it, after a public bus stop that once stood on this stretch of road when it still doubled as an open public highway between race weekends. It's the last place on the lap where a position can change before the start-finish line, which makes the two grandstands here, Gold 6 and Gold 11, genuine end-of-lap tension points.

Gold 6 sits at the heart of the chicane itself — the direct view of the corner sequence, cars snapping left then right under braking after a long run down from Blanchimont. Gold 11 is positioned at the exit, giving a different angle: the final two corners plus the entrance to the pit lane, so you see not just the chicane but what happens immediately after it — cars peeling into the pits, or continuing on toward the line.

Because this is the last corner of the lap, it carries a specific kind of significance that earlier sections of the circuit don't. A move made here, successful or not, is the one a driver carries across the line. Defensive lines get tighter, braking gets later, and mistakes are costlier because there's no following straight to recover lost time. It's also the corner where fuel-saving strategies and tyre management most visibly run out — a driver nursing a worn set of tyres through 6 kilometres of fast corners can find the chicane is where it finally catches up with them.

Both grandstands are reserved, numbered seating. Gold 11 is a premium variant with a view extending into the pit lane entrance, useful if you want to track strategy calls as cars dive in for a late stop.`;

const whyItsSpecial = `Spa-Francorchamps is built around a handful of corners that each tell a different part of the story — Eau Rouge for commitment, Les Combes for tactics, La Source for proximity to the chaos of a standing start. The Bus Stop Chicane tells the final chapter: what happens when 6 kilometres of racing comes down to the last 200 metres before the line.

Its naming is a small piece of the circuit's own history — a reminder that Spa-Francorchamps began as, and in parts still resembles, a public road circuit threaded through the Ardennes forest, not a purpose-built racetrack. Watching the modern chicane that replaced the old public bus stop is a way of seeing that history made physical.

Positionally, this is also simply a high-tension seat: the last corner means the last chance to make or defend a move, and years of Spa races have been decided here in the closing laps — cars running out of tyre life, fuel-saving strategies reaching their limit, drivers forced into one final defensive line before the chequered flag. For a fan who wants to watch a race's tension resolve in real time, rather than unfold gradually across a long straight or technical sequence, the Bus Stop Chicane is where that resolution happens.`;

const insiderTips = [
  "Gold 11 gives a view into the pit lane entrance as well as the final two corners — useful if you want to track late-race strategy calls, not just the chicane itself.",
  "This is the last corner before the start-finish line — positions decided here are the ones that count on the timing board, making it one of the highest-tension seats for a close finish.",
  "Tyre and fuel strategy most visibly runs out here after 6km of fast corners — watch for cars losing pace or defending unusually hard on the final laps.",
];

const whatToAvoid = `Don't expect the same high-speed drama as Eau Rouge or the overtaking frequency of Les Combes — the Bus Stop Chicane is a slower, more tactical corner, valuable for its end-of-lap tension rather than raw spectacle. Gold 6 is uncovered, so check the forecast before booking if weather protection matters to you.`;

const practicalInfo = {
  hours: "Circuit gates open from 06:00 each race day; Bus Stop Chicane grandstands accessible throughout all sessions.",
  costRange: "3-day weekend adult: Gold 6 bis €545 (uncovered), Gold 11 Premium €950 (covered).",
  bookingMethod: "Tickets sold via the official Belgian Grand Prix site at spagrandprix.com/en/billetterie.",
  website: "https://www.spagrandprix.com/en/billetterie",
  reservationsRequired: true,
};

const gettingThere = `The Bus Stop Chicane sits near the pit straight and main entrance area, making it one of the more accessible grandstand locations relative to Les Combes or Blanchimont. No public transport runs directly to the circuit during race weekend — shuttle buses operate from Spa town, Stavelot, Malmedy, and Liège, bookable via spagrandprix.com.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Bus Stop Chicane — Gold 6 & Gold 11",
      subtitle: "Spa's final corner before the line — where fuel, tyres, and nerve run out together",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: BELGIAN_ARDENNES_ID,
      sportingEventId: belgianGpEventId ?? null,
      neighborhood: "Francorchamps",
      address: "Route du Circuit 55, 4970 Stavelot, Belgium",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Location sourced directly from spagrandprix.com's own 'Where to sit at the Belgian Grand Prix?' article, which describes Gold 6 as 'heart of the chicane' and Gold 11 as 'positioned at the exit of the chicane, giving you a unique perspective of the final two corners and the entrance to the F1 pit lane.' Corner-naming history (public bus stop) sourced from F1's own official 'how every corner at Spa got its name' article. Pricing from spagrandprix.com/en/billetterie live checkout, 12 Oct 2026. Verified 12 Oct 2026.",
      moodTags: ["tense", "tactical", "electric"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      budgetMinCost: "610",
      budgetMaxCost: "1064",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-10-12",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: belgianGpEventId })
    .onConflictDoNothing();

  console.log("✓ Experience created:", result.title, "-", result.id, "-", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

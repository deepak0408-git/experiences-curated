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
const slug = "paddock-club-belgian-gp-" + Date.now().toString(36);

const [existing] = await db.select({ id: sportingEvents.id }).from(sportingEvents).where(eq(sportingEvents.slug, BELGIAN_GP_SLUG));
const belgianGpEventId = existing?.id;

const bodyContent = `Paddock Club is Formula 1's own global hospitality product, run at every race on the calendar, and at Spa-Francorchamps it occupies a genuinely unusual position: hosted in the pit lane buildings themselves, with a terrace that looks directly down into the pit lane on one side and out toward Eau Rouge and Raidillon on the other. It is the only hospitality experience at this circuit that puts you physically inside the working heart of a Grand Prix weekend rather than beside the track watching it happen.

The terrace experience is built around proximity to the sport's machinery, not just a premium seat. You watch mechanics prepare cars, see pit stops unfold directly below, and get sightlines back toward the opening sequence of the lap — Eau Rouge and Raidillon visible in the distance from the rear of the building. It's a different way of experiencing a Grand Prix weekend: less about following a single corner and more about being inside the operational reality of the sport for three days.

Access includes all-inclusive bars with fine wines, beers, and soft drinks served throughout the day; a pit lane walk, typically scheduled for one of the practice days; guided paddock tours past the team garages; giant trackside screens showing live race coverage throughout every session; and live entertainment, including bands and DJ sets, that run through the weekend. Paddock Club also includes access unavailable to any other hospitality tier at Spa: an open-top bus tour of the circuit itself, and scheduled talks from current and former F1 drivers and team personnel — a level of direct access to the sport that no grandstand ticket, however premium, can match.

This is a 3-day experience across the full Grand Prix weekend — Friday practice, Saturday qualifying, Sunday race — and is priced accordingly as the most expensive single ticket product at the circuit. It is sold directly through F1 Experiences, the officially licensed operator of Paddock Club at every round of the championship, rather than through the circuit's own local ticketing platform.`;

const whyItsSpecial = `Every grandstand at Spa-Francorchamps sells a view of one part of the circuit. Paddock Club sells something categorically different: access to the sport's infrastructure itself, during the three days when that infrastructure is at its most active. Watching a pit stop from a grandstand means watching cars disappear and reappear from your sightline. Watching one from the Paddock Club terrace means watching the stop happen directly below you, mechanics working in a blur, the whole operation visible from above in a way no other ticket at this circuit offers.

The inclusions matter here as much as the location. A pit lane walk and paddock tour are the kind of access that, outside Paddock Club, simply isn't available to a general ticket holder at any price — you cannot buy your way into the paddock from a grandstand seat, however expensive. Driver and team-personnel talks add a layer of direct access to the people competing, not just the cars.

For a fan whose interest in Formula 1 extends beyond watching cars go around a track — who wants to understand the operational choreography of a race weekend, see the garages, and spend three days inside the part of the circuit that's normally invisible from any grandstand — Paddock Club at Spa is the only product that delivers that. It is priced as the top tier for exactly that reason.`;

const insiderTips = [
  "Paddock Club's rear-facing terrace gives a distant but genuine sightline toward Eau Rouge and Raidillon — check this specifically if you want both the pit lane proximity and a view of the circuit's signature corner from the same vantage point.",
  "The pit lane walk and paddock tour are typically scheduled on a practice day, not race day — confirm the exact day when booking if these inclusions are your priority.",
  "Book through F1 Experiences, the officially licensed Paddock Club operator — this product is not sold via the circuit's own local ticketing platform (spagrandprix.com).",
];

const whatToAvoid = `Don't book Paddock Club expecting a close-up view of a specific corner — its location is built around pit lane and paddock proximity, not a trackside sightline on fast or technical sections of the lap. If a specific corner view (Eau Rouge, Pouhon, Les Combes) is the priority, a dedicated Gold grandstand will serve that better at a fraction of the price. And don't leave booking late — Paddock Club allocations at marquee circuits like Spa are limited and sell out well ahead of race weekend.`;

const practicalInfo = {
  hours: "Access throughout all three race weekend days; specific session times for pit lane walk and paddock tour confirmed closer to the event.",
  costRange: "3-day weekend, US$5,500 per person (shown directly in USD on official checkout, 12 Oct 2026).",
  bookingMethod: "Booked directly through F1 Experiences, the officially licensed Paddock Club operator for every round of the F1 calendar — not sold via spagrandprix.com.",
  website: "https://f1experiences.com/2027-belgian-grand-prix",
  reservationsRequired: true,
};

const gettingThere = `Paddock Club is located within the pit lane buildings at the main circuit complex near La Source, making it one of the most accessible locations relative to the circuit's main entrance. No public transport runs directly to the circuit during race weekend — shuttle buses operate from Spa town, Stavelot, Malmedy, and Liège.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Paddock Club — Belgian Grand Prix",
      subtitle: "F1's own hospitality product, inside the pit lane buildings with Eau Rouge in the distance",
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
        "Location and inclusions confirmed directly by F1 Experiences' own Paddock Club description ('hosted in the pit lane buildings, terrace allows people to look directly below into the pit lane... views out of the back of the buildings towards Eau Rouge and Raidillon'). Price (US$5,500) shown directly in USD on official spagrandprix.com/en/billetterie checkout, 12 Oct 2026 — same price point independently corroborated via F1 Experiences' own packages page. Verified 12 Oct 2026.",
      moodTags: ["exclusive", "immersive", "premium"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "luxury",
      budgetCurrency: "USD",
      budgetMinCost: "5500",
      budgetMaxCost: "5500",
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

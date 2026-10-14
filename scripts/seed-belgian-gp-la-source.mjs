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
const slug = "la-source-hairpin-grandstands-" + Date.now().toString(36);

const [existing] = await db.select({ id: sportingEvents.id }).from(sportingEvents).where(eq(sportingEvents.slug, BELGIAN_GP_SLUG));
const belgianGpEventId = existing?.id;

const bodyContent = `La Source is the slowest corner on the entire Spa-Francorchamps lap — a tight right-hand hairpin that every car on the grid takes at barely a fraction of the speed they'll reach moments later through Eau Rouge. It's also the corner that opens every lap, sits beside the starting grid, and hosts a dense cluster of Gold grandstands — Gold 7, Gold 7 bis, Gold 7 ter, Gold 8, Gold 9, and Gold 9 bis — each offering a slightly different angle on the same fundamental view: the start of the race, and the tightest, most contested corner on the circuit.

This cluster sits around the starting straight and the hairpin itself. Gold 8 (Source-Start) covers the starting straight directly alongside La Source; Gold 9 and Gold 9 bis sit between the starting grid and the hairpin, with sightlines down the grid formation; Gold 7, 7 bis, and 7 ter wrap around the hairpin exit and the view of cars descending into the corner. Several of these stands are covered (Gold 7, 8, and 9 specifically — confirmed directly by the circuit's own FAQ), while the bis/ter variants are open-air extensions of the same complex.

Because La Source is the slowest corner on the lap, it's also the easiest place to actually watch wheel-to-wheel racing in detail — cars are moving slowly enough here that you can follow a full overtaking attempt from the braking zone through the apex to the exit, in a way that's simply not possible at a 300km/h corner elsewhere on the circuit. It's where Lap 1 chaos most often plays out: cars bunched together after the standing start, inevitably some contact or a wild defensive line as drivers fight for position into the tightest point on the track.

For a first Grand Prix, this cluster has an obvious appeal: you get the start — 20 cars launching off the grid in close formation — plus a corner slow enough to actually process in real time, rather than a blur of speed you only register on a big screen replay.`;

const whyItsSpecial = `Every other grandstand cluster at Spa sells you on speed — Eau Rouge's climb, the Kemmel Straight's velocity, Blanchimont's sustained high-speed curve. La Source sells you on the opposite: the one moment per lap where the cars are slow enough that you can actually see a driver's hands, see the car's weight shift under braking, see exactly how close two cars come to touching as they fight for the apex.

It's also the start-line corner — the first turn every car reaches after the lights go out, meaning the grandstands here get Spa's single most chaotic, unpredictable moment of the entire weekend: 20 cars converging on one tight hairpin at the same time, barely 30 seconds into the race. First-lap incidents happen here more than almost anywhere else on the calendar, not because the corner is dangerous at speed, but because it's the first place the whole field is forced into close proximity at once.

For a fan choosing between the headline corners — Eau Rouge for commitment, Les Combes for tactics, La Source for proximity and chaos — this cluster offers something distinct: the chance to watch racing happen at a pace where you can actually follow the decision-making, not just the aftermath.`;

const insiderTips = [
  "This is Spa's slowest corner — unlike Eau Rouge or Les Combes, you can actually follow a full overtaking move here in real time rather than catching only a flash of it.",
  "Gold 8 (Source-Start) gives the clearest view of the standing start itself — if watching all 20 cars launch together is the priority, choose this stand over the 7/9 variants further round the hairpin.",
  "First-lap incidents cluster here more than almost anywhere else on the Spa lap — arrive in your seat well before lights-out if you want to see the opening sequence unfold.",
];

const whatToAvoid = `Don't expect high-speed drama from this cluster — if raw velocity and commitment corners are what you're after, Eau Rouge/Raidillon is the better choice. And don't assume every stand in this cluster has the same view — Gold 8 faces the starting straight, while Gold 7's variants wrap around the hairpin exit itself; check the specific stand's description before booking if you have a strong preference between "watching the start" and "watching the corner."`;

const practicalInfo = {
  hours: "Circuit gates open from 06:00 each race day; La Source grandstands accessible throughout all sessions.",
  costRange: "3-day weekend adult (where available): Gold 9 €740, Gold 9 bis €667, Gold 7 bis €607, Gold 7 ter €578; Gold 7 and Gold 8 sold out at weekend price, Friday-Saturday from €441-506.",
  bookingMethod: "Tickets sold via the official Belgian Grand Prix site at spagrandprix.com/en/billetterie.",
  website: "https://www.spagrandprix.com/en/billetterie",
  reservationsRequired: true,
};

const gettingThere = `The La Source cluster sits near the circuit's main entrance, making it one of the more accessible grandstand areas relative to Les Combes or Blanchimont. No public transport runs directly to the circuit during race weekend — shuttle buses operate from Spa town, Stavelot, Malmedy, and Liège, bookable via spagrandprix.com.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "La Source Hairpin — Gold 7/8/9 Grandstands",
      subtitle: "Spa's slowest corner and the start-line grandstands — watch a full overtake unfold, not just a blur",
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
        "Location sourced directly from spagrandprix.com's own 'Where to sit at the Belgian Grand Prix?' article, which separately describes Gold 7 ('La Source corner exit'), Gold 8 ('starting straight and La Source'), and Gold 9 ('between starting grid and La Source'). Coverage (7/8/9 covered, bis/ter variants uncovered) confirmed by the same official FAQ. Pricing from spagrandprix.com/en/billetterie live checkout, 12 Oct 2026. Verified 12 Oct 2026.",
      moodTags: ["electric", "chaotic", "immersive"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "splurge",
      budgetCurrency: "USD",
      budgetMinCost: "647",
      budgetMaxCost: "829",
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

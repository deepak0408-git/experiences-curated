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
const slug = "gold1-pit-grandstand-" + Date.now().toString(36);

const [existing] = await db.select({ id: sportingEvents.id }).from(sportingEvents).where(eq(sportingEvents.slug, BELGIAN_GP_SLUG));
const belgianGpEventId = existing?.id;

const bodyContent = `Gold 1 sits directly on the pit straight, running from the pit lane exit and the chicane down to the La Source braking zone — the only grandstand at Spa-Francorchamps that puts you level with the cars as they form up on the grid, launch at the start, and come home at the end of every session.

This is the covered grandstand closest to the paddock and pit wall. From your seat you watch mechanics wheel cars out for qualifying, see the lights go out on Sunday, and catch every pit stop of the race as crews change tyres in under three seconds. The view stretches from the pit exit lane on one side to the braking zone into La Source — the tightest, slowest corner on the lap — on the other, so you get both ends of a straight that most of the field uses to set up overtakes into Turn 1.

Unlike the high-speed corners elsewhere on the circuit, Gold 1 rewards patience over spectacle. The start is the obvious highlight — 20 cars accelerating in close formation directly in front of you, engine noise compounding off the grandstand roof — but the pit stops during the race are what regulars come back for. You can watch a driver's entire pit lane sequence: the call on the radio, the dive into the box, the stop itself, the release back into traffic. It's the one place at Spa where strategy becomes visible rather than something you piece together from a broadcast graphic.

The grandstand is covered and numbered, allocated per day across a 3-day ticket — Friday practice, Saturday qualifying, Sunday race. Because of its proximity to the pit lane and paddock, Gold 1 is also one of the first stands to sell out each season; weekend tickets are typically gone well before Gold 3 at Eau Rouge, which gets more attention in marketing material but sells more slowly because it's further from the entrance and paddock facilities.

Getting to Gold 1 is straightforward relative to the rest of the circuit — it sits close to the main entrance near La Source, without the uphill forest walk that Eau Rouge or Les Combes require. That makes it a practical choice if you're also planning to use the paddock club facilities, pick up merchandise, or want fast access back to parking and shuttle pickup points after the race.`;

const whyItsSpecial = `Most of Spa's famous grandstands sell themselves on a single corner — Eau Rouge's climb, Pouhon's sustained lateral load, Blanchimont's speed. Gold 1 sells on proximity: to the grid, to the pits, to the mechanics working on the cars between sessions. It's the only seat at this circuit where the sport's logistics — not just its driving — are the show.

Watching a standing start from here is different from watching it anywhere else on the lap. You're close enough to feel the engine note change as 20 cars take up the formation lap, close enough to see drivers' hand signals to their pit wall, close enough that the five red lights going out registers as a physical jolt through the crowd before the cars have even moved. Few other grandstands put spectators this close to the exact moment a Grand Prix actually begins.

It's also the practical choice for anyone building their first Spa weekend around convenience as much as spectacle — close to the entrance, close to facilities, with a view that rewards attention to strategy and teamwork as much as outright speed. For a fan who wants to understand how a Grand Prix weekend actually runs, not just how fast the cars go through one corner, Gold 1 is the seat that shows the machinery behind the spectacle.`;

const insiderTips = [
  "Arrive early on Sunday specifically for the grid walk and formation — Gold 1's view of the full 20-car grid assembling is unmatched anywhere else on the circuit.",
  "This is one of the first grandstands to sell out each season, ahead of Gold 3 at Eau Rouge — despite Eau Rouge getting more marketing attention, Gold 1's proximity to the paddock and entrance makes it the quicker sellout.",
  "Watch pit stops specifically during the race, not just the start — Gold 1 is the only grandstand with a clear sightline into the pit lane box sequence itself.",
];

const whatToAvoid = `Don't expect high-speed cornering drama from this seat — Gold 1 is about the start, the pits, and proximity, not a signature corner like Eau Rouge or Pouhon. If high-speed action is the priority, this isn't the right stand. Don't assume weekend availability late in the season either — Gold 1 typically sells out faster than circuit marketing suggests, often before Eau Rouge's more famous grandstands.`;

const practicalInfo = {
  hours: "Circuit gates open from 06:00 each race day; Gold 1 accessible throughout all sessions.",
  costRange: "3-day Gold 1 ticket — official weekend price was sold out at research time (12 Oct 2026); Friday-Saturday price €506. Check spagrandprix.com for current weekend availability.",
  bookingMethod: "Tickets sold via the official Belgian Grand Prix site at spagrandprix.com/en/billetterie.",
  website: "https://www.spagrandprix.com/en/billetterie",
  reservationsRequired: true,
};

const gettingThere = `Gold 1 sits near the circuit's main entrance by La Source, making it one of the more accessible grandstands relative to Les Combes or Blanchimont. No public transport runs directly to the circuit during race weekend — shuttle buses operate from Spa town, Stavelot, Malmedy, and Liège, bookable via spagrandprix.com. Expect 1–2 hour delays leaving by car on Sunday evening.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Gold 1: Pit Grandstand",
      subtitle: "Level with the grid, the pit lane, and every pit stop of the race — Spa's most logistics-focused seat",
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
        "Location and coverage sourced directly from spagrandprix.com's own 'Where to sit at the Belgian Grand Prix?' article ('pit lane and chicane exit to La Source braking zone') and official FAQ coverage list. Pricing from spagrandprix.com/en/billetterie live checkout, 12 Oct 2026 (weekend sold out, Friday-Saturday price used). No independent corroborating source found beyond the official site — flagged as single-source in this note per the skill's sourcing standard. Verified 12 Oct 2026.",
      moodTags: ["electric", "strategic", "immersive"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "splurge",
      budgetCurrency: "USD",
      budgetMinCost: "567",
      budgetMaxCost: "1002",
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

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
const slug = "les-combes-grandstands-" + Date.now().toString(36);

const [existing] = await db.select({ id: sportingEvents.id }).from(sportingEvents).where(eq(sportingEvents.slug, BELGIAN_GP_SLUG));
const belgianGpEventId = existing?.id;

const bodyContent = `Les Combes sits at the top of Spa-Francorchamps' longest and most important straight, where the Kemmel Straight — a kilometre of uphill acceleration after Eau Rouge and Raidillon — finally runs out of road. Cars arrive here at well over 300km/h, DRS open, and have to shed most of that speed in a matter of seconds for the tight left-right sequence that follows. Along with the Eau Rouge/Raidillon complex, this is one of the two places our own Belgian GP Ticket Guide identifies as where the race is genuinely decided.

Four grandstands sit here, numbered Combes 1 through 4, positioned between the exit of Malmedy and the entry to Rivage/Bruxelles. They're priced and specced slightly differently: Combes 2 and 3 are covered (a 2026-onward addition — both stands were previously open to the weather), while Combes 1 and 4 remain uncovered. All four give a close, ground-level view of the braking zone itself — cars arriving flat out, drivers committing to a late brake or backing off, and the overtakes that follow when one car catches another napping on the entry.

This is a genuine overtaking zone, not just a fast corner to watch cars pass through. The DRS zone that starts after Raidillon runs the length of the Kemmel Straight specifically to set up a pass here — so what you're watching from Les Combes is the payoff of a move that's been building since the cars left Eau Rouge. On a good lap, you'll see a driver commit to an overtake under braking, defend, or lock a wheel trying to make the move stick. It's one of the few places on the calendar where braking performance under pressure, not raw straight-line speed, decides the outcome.

Les Combes also sits conveniently between the circuit's Bronze (general admission) and Silver grandstand tiers in both price and experience — close enough to the campsites that regulars treat it as a practical middle-ground choice, not requiring the premium of a Gold grandstand to get a genuinely good view of real racing action.`;

const whyItsSpecial = `Spa-Francorchamps has two corners that define the circuit's reputation: Eau Rouge/Raidillon for its physical demand on drivers, and Les Combes for what it does to a race. Eau Rouge is a spectacle of commitment — watching a car survive a corner. Les Combes is a spectacle of racecraft — watching two drivers decide, in real time, who actually wants the position more.

The run-up matters as much as the corner itself. By the time a car reaches Les Combes, it's carried momentum through La Source, climbed through Eau Rouge and Raidillon, and spent a full kilometre at maximum speed down Kemmel with DRS open. Les Combes is where all of that gets converted into a decision — brake late and risk locking up, or brake early and concede the inside line. From the grandstands here, you watch that decision get made, lap after lap, car after car, sometimes differently each time depending on tyre wear, fuel load, or simple nerve.

It's also a seat that rewards a fan who wants to understand racing, not just watch speed. The data shows Les Combes among the highest-frequency overtaking zones on the 2026 calendar precisely because the preceding straight is so long and the braking zone so demanding. If you want to see a Grand Prix actually being contested rather than processed, this is where it happens.`;

const insiderTips = [
  "Combes 2 and 3 are newly covered as of the 2026 season — if weather matters to you, pick one of these two blocks over Combes 1 or 4.",
  "This is one of the circuit's two headline action zones (with Eau Rouge/Raidillon) — the DRS zone off the Kemmel Straight is built specifically to create overtakes into this corner, so arrive expecting genuine wheel-to-wheel racing, not just a fast corner.",
  "Les Combes sits conveniently close to the campsite areas and between Bronze and Silver pricing — a practical middle-ground choice if Gold grandstand prices feel like overkill for the view you actually want.",
];

const whatToAvoid = `Don't book Combes 1 or 4 expecting cover from rain — only 2 and 3 are covered as of 2026. And don't treat this as a passive viewing spot the way you might a high-speed-only corner — the real value here is watching braking duels and overtakes develop in real time, so pay attention through the full sequence rather than just the moment cars pass directly in front of you.`;

const practicalInfo = {
  hours: "Circuit gates open from 06:00 each race day; Les Combes grandstands accessible throughout all sessions.",
  costRange: "3-day weekend adult: Combes 1 €415 (sold out at research time), Combes 2 €520 (newly covered), Combes 3 €495 (covered), Combes 4 €395.",
  bookingMethod: "Tickets sold via the official Belgian Grand Prix site at spagrandprix.com/en/billetterie.",
  website: "https://www.spagrandprix.com/en/billetterie",
  reservationsRequired: true,
};

const gettingThere = `Les Combes sits on the circuit's northern side, close to several campsite areas and accessible via the Les Combes entrance gate. No public transport runs directly to the circuit during race weekend — shuttle buses operate from Spa town, Stavelot, Malmedy, and Liège, bookable via spagrandprix.com.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Les Combes — Grandstands 1-4",
      subtitle: "Where the Kemmel Straight runs out and the braking duels begin — one of Spa's two defining action zones",
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
        "Location sourced from spagrandprix.com official checkout descriptions and corroborated by our own published Belgian GP Ticket Guide ('the main action concentrates in two places: the Eau Rouge/Raidillon complex... and Les Combes'). Coverage status (2/3 covered, 1/4 uncovered) confirmed directly from official spagrandprix.com/en/billetterie checkout badges, 12 Oct 2026. Pricing from the same live checkout. Verified 12 Oct 2026.",
      moodTags: ["electric", "tactical", "immersive"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      budgetMinCost: "442",
      budgetMaxCost: "582",
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

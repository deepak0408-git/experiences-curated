import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b0d8f9a-911d-4cc7-8049-50e4685958ca"; // Milan
const EVENT_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e"; // Italian Grand Prix
const slug = "italian-gp-ga-lesmo-ascari-" + Date.now().toString(36);

const bodyContent = `General admission at Monza isn't one experience — it's a choice between several genuinely different sections of the park, and the Lesmo-Ascari stretch is a different pick from the high-speed sweep at Curva Grande that most first-timers default to. This is the technical middle of the lap: two tightening right-handers named Lesmo, then the Ascari chicane, a left-right-left combination named for Alberto Ascari, the two-time World Champion killed testing here in 1955.

The two Lesmo corners are not equal. Lesmo 1 offers genuinely limited viewing — you need to be right against the fence to see much at all, and there are no bleachers or screens at this specific spot. Lesmo 2, just after it, is the better pick by a wide margin: proper tiered bleachers, a TV screen for the parts of the track you can't see directly, and it fills up fast precisely because regular visitors already know this. It also sits close to Gate D, which makes the walk in and out easier than most other GA sections.

The Ascari straight, just past the Lesmo curves, gives you a longer look at the cars than either Lesmo corner does — several seconds of visibility as they thread the chicane's three direction changes, rather than a brief flash past a single apex. Between Lesmo 2's screen-and-bleacher setup and Ascari's longer sightline, this stretch of general admission rewards fans who want to actually follow the driving, not just hear the noise as cars go by.

None of this comes free of effort. GA tickets don't reserve you a spot — they get you into the park, and the good bleacher positions at Lesmo 2 specifically fill within the first quarter-hour after gates open. Regulars who know this arrive at the entrance gates a full hour before opening, not right at 07:00, because the walk to a specific corner from the gate takes time and the best spots are gone fast once the gates actually open. Bring what you'd bring to any full day outdoors — the Lesmo-Ascari sequence has limited shade, and once you've claimed a bleacher spot, giving it up to go find food or shade means someone else has it by the time you're back.`;

const whyItsSpecial = `Curva Grande gets recommended to almost every first-time GA visitor at Monza, and it's a reasonable default — fast, dramatic, easy to find. What it doesn't give you is the sense of a driver actually working the car through a sequence of direction changes, which is exactly what the Lesmo-Ascari stretch offers instead. Two tightening corners into a chicane named for a driver who died at this circuit is not a comfortable piece of Monza's history, but it's an honest one, and watching it from ground level, close enough to see the braking points rather than just hear the engines, is a different kind of understanding of what this track actually asks of a driver than the long straights provide.

This is the section for someone who's already done Monza once at Curva Grande and wants to see what the technical middle of the lap actually looks like from the fence, not the marketing version of speed everyone else already knows to expect.`;

const insiderTips = [
  "Skip Lesmo 1 entirely if you're choosing between the two Lesmo corners — it has no bleachers or screen and genuinely limited viewing unless you're pressed right against the fence. Lesmo 2, just after it, has proper tiered bleachers, a TV screen, and easier access via Gate D.",
  "Arrive at the entrance gates a full hour before opening, not right at the 07:00 gate time, if you want a bleacher spot at Lesmo 2 — it's one of the most popular GA sections and fills within about 15 minutes of gates opening.",
];

const whatToAvoid = `Don't default to Lesmo 1 assuming both Lesmo corners offer similar viewing — they don't, and Lesmo 1 specifically lacks the bleachers and screen that make Lesmo 2 worth the earlier arrival. And don't leave your bleacher spot once you've claimed one at Lesmo 2 to go find food or shade — general admission spots aren't held for you, and a good position given up mid-morning is very unlikely to still be free when you come back.`;

const practicalInfo = {
  hours: "Gates open 07:00 on race weekend days; arrive up to an hour earlier for the best GA bleacher spots at Lesmo 2",
  costRange: "General admission (Prato): from roughly €50 Friday, €70 Saturday, €100 Sunday single-day; around €450 for the full weekend (2026 pricing, 2027 not yet confirmed)",
  bookingMethod: "Buy general admission (Prato) tickets via monzanet.it/en/tickets/ — no reserved seat, entry to the park's GA sections only.",
  website: "https://www.monzanet.it/en/tickets/",
};

const gettingThere = "Gate D is the closest entrance to Lesmo 2 and the Lesmo-Ascari general admission sections.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "General Admission — Lesmo & Ascari",
      subtitle: "The technical middle of the lap — two tightening corners into a chicane named for a driver who died here",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Monza",
      address: "Autodromo Nazionale Monza, Parco di Monza, 20900 Monza MB, Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Lesmo 1 vs Lesmo 2 viewing quality, Ascari straight sightline, and gate-timing tactics sourced from oversteer48.com's independent GA guide (first-hand account, includes specific arrival-timing advice); 2026 GA pricing structure sourced from Monzanet's official 2026 price list and secondary aggregator cross-checks, 18 Sep 2026. 2027 pricing not yet published.",
      sport: ["formula_one"],
      moodTags: ["electric", "social"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 3,
      budgetTier: "budget",
      budgetCurrency: "EUR",
      budgetMinCost: "50",
      budgetMaxCost: "450",
      bestSeasons: ["sep"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-18",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

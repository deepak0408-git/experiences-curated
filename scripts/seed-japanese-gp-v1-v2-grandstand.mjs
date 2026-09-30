// Seed: "Grandstand V1/V2 — Main Straight, Podium, and Saturday Driver
// Access" — experience #4/20 for Japanese Grand Prix 2027 (Suzuka).
//
// Sources (verified 21 Sep 2026):
// - https://www.fanamp.com/tr/japanese-grand-prix-seating-guide (V1 vs V2 detail, screens, podium view)
// - total-motorsport.com / paddockintel.com 2026 pricing research (V2 as top grandstand tier, ~¥105,000+)
//
// CORRECTED 22 Sep 2026: japan.gp is an affiliate site, not official. Live DB
// row corrected to ticketing.formula1.com/japan via
// scripts/_fix-japan-gp-official-urls.mjs. This file is left as the
// historical record of what actually ran — do not re-run it, and do not
// treat its japan.gp values below as current truth.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9a26a4f4-2d3b-4e68-9bc3-ce2b55bb15e9";
const EVENT_ID = "9fe13c2e-37d1-49f0-8a48-d3ea40186fe4";
const slug = "japanese-gp-suzuka-v1-v2-grandstand";

const bodyContent = `V1 and V2 sit on the start-finish straight, and between the two Suzuka grandstands, they're the closest thing the circuit has to a headline seat. Both look at the same stretch — the main straight, the starting grid, the finish line, and the pit lane entry — but the difference between them is the same kind of difference as Q1 versus Q2: elevation. V1 sits lower, closer to the fencing, with a partially obstructed view. V2 sits higher, clear of that obstruction, with genuinely unrestricted sightlines across the whole straight.

V2 is Suzuka's top grandstand tier, and the price reflects it — roughly ¥105,000 or more based on 2026's confirmed pricing, well above the mid-tier stands elsewhere on the circuit. What that buys you: three large screens for following action elsewhere on the lap, a clear view of the podium, and — the detail that separates this stand from every other grandstand at Suzuka — access to Saturday's driver interviews, held right there on the straight. Upper-row V2 seats also get weather coverage, a real advantage on a circuit where April weather is genuinely unpredictable and most other grandstands offer no shelter at all.

V1 gets you the same general view at a lower price, but the fencing-obstructed sightline is a real tradeoff, not a minor one — if watching the start, the podium, and the pit lane clearly matters to you, the gap between V1 and V2 is worth the extra cost. If budget is the deciding factor and you're willing to accept a partially blocked view of one of Suzuka's best vantage points, V1 is still a genuine main-straight seat, just not the unrestricted one.

For a first Suzuka visit built around the race itself rather than a specific corner, V2 is the stand most fans end up wanting — it's the one seat at the circuit that shows you the start, the pit lane, and the podium finish all from the same place, with the Saturday driver access as a genuine bonus most other grandstands don't offer at any price.`;

const whyItsSpecial = `Every other grandstand at Suzuka is built around a single corner or a single sequence — 130R, the chicane, a sweeping esses section. V1 and V2 are different: they're built around the race's actual structure, the start, the pit lane, the podium, in one continuous view. That's a genuinely different kind of ticket, closer to what most first-time race-goers picture when they imagine watching an F1 race.

V2 specifically earns its price with the Saturday driver interviews — an access point most grandstand tickets anywhere on the calendar don't include — and the weather coverage on its upper rows, which matters more at Suzuka in early April than it would at a circuit with more predictable weather.`;

const insiderTips = [
  "If the podium view and an unobstructed sightline down the straight matter to you, the jump from V1 to V2 is worth it — V1's lower position and closer fencing genuinely block part of the view that V2 sees clearly.",
  "V2's upper rows come with weather coverage — worth specifically requesting or checking for at booking, since it's not automatic across the whole stand and April at Suzuka can turn wet with little warning.",
];

const whatToAvoid = `Don't buy V1 assuming it's functionally the same seat as V2 at a discount — the fencing obstruction from V1's lower position is real and affects the pit lane and part of the straight, not just a minor aesthetic difference. Don't expect V1/V2 to show you any of the circuit's corner action — these stands are built around the start-finish straight and podium, not the racing through 130R or the chicane, which belong to Grandstand G and Q2 instead.`;

const practicalInfo = {
  hours: "Gate times follow the official race-day schedule — not yet published for 2027",
  costRange: "V2 is Suzuka's top grandstand tier (~¥105,000+ per 2026 confirmed pricing); V1 is priced lower — see the Ticket Guide experience for the full 2026-confirmed price reference and 2027 pricing status",
  bookingMethod: "Official tickets at japan.gp/en/tickets. V2 is Suzuka's most in-demand grandstand and has historically sold out early — book as soon as 2027 sales open if this is the seat you want.",
  website: "https://www.japan.gp/en/tickets",
};

// UPDATED 22 Sep 2026 (live DB, not this const): getting_there now carries the
// full Nagoya Station -> Suzuka Circuit Ino Station route detail directly,
// per founder's instruction to put it on every in-circuit experience rather
// than only cross-referencing the dedicated Getting to Suzuka experience.
const gettingThere = "See the dedicated Getting to Suzuka experience for full transit detail from Nagoya and the circuit's rail/shuttle connections.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Grandstand V1/V2 — Main Straight and Podium",
      subtitle: "Suzuka's top grandstand tier — the start, the pit lane, and the podium in one uninterrupted view.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Suzuka Circuit",
      address: "Suzuka Circuit, 7992 Ino-cho, Suzuka, Mie 510-0295, Japan",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sources: fanamp.com Japanese GP seating guide (V1/V2 elevation, screens, podium/driver-access detail, verified 21 Sep 2026), total-motorsport.com and paddockintel.com (2026 confirmed V2 pricing, cited as prior-year reference).",
      sport: ["formula_one"],
      moodTags: ["trackside", "first-timer"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "luxury",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-21",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db
    .insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓ Experience created:", result.title, "|", result.id, "|", result.slug, "|", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

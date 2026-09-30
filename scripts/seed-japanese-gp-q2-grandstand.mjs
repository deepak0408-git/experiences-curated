// Seed: "Q2 Grandstand — 130R, Casio Triangle, and the Last Corner" —
// experience #2/20 for Japanese Grand Prix 2027 (Suzuka).
//
// Sources (verified 21 Sep 2026):
// - https://www.fanamp.com/tr/japanese-grand-prix-seating-guide (Q1 vs Q2 elevation/sightline detail)
// - https://en.wikipedia.org/wiki/Suzuka_Circuit (circuit layout, Casio Triangle chicane)
// Note: motorsporttickets.com was checked and found to be a defunct/liquidated
// business (insolvency notice on fetch) — not cited as a source.
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
const slug = "japanese-gp-suzuka-q2-grandstand";

const bodyContent = `Suzuka's Q grandstands sit at the final chicane, right where the circuit's defining corner spits cars out toward the line — and Q2, not Q1, is the one worth knowing about. Both stands look at the same stretch of track, but Q2 sits higher. Q1 is lower and closer to the fencing, which sounds like proximity until you realize it also means more of the circuit is blocked from view. Q2's elevation clears that obstruction entirely, and the difference shows up specifically at the Hitachi Astemo Chicane and the pit lane entry, both of which Q1 only partially sees.

What you're actually watching from Q2 is the sequence that decides more Suzuka races than any other stretch of track. Cars come out of 130R — Suzuka's fast, committing left-hander, one of the most demanding corners on the calendar — still carrying serious speed, then have to brake hard into a tight right-left chicane immediately after. That combination is where late-braking overtakes happen, where cars run wide, and where contact happens more often than anywhere else on the lap. From Q2's height, you see the whole sequence unfold: the approach, the chicane itself, and the run toward the final corner and start-finish straight beyond it.

The seat itself is numbered, so you're not fighting for a spot, and there's a screen in view for following the race elsewhere on the circuit during the laps when nothing's happening in front of you. What Q2 doesn't have is any weather protection — it's an open stand, and Suzuka in early April can run anywhere from mild and clear to genuinely cold and wet, so this isn't a seat to show up at underdressed.

Q2 gets recommended more often than almost any other stand at Suzuka, and the reason is straightforward: it's one of the few seats that shows you a real overtaking zone rather than a single straight or a single corner. If you're choosing one grandstand for your only day at the circuit, this is consistently the answer.`;

const whyItsSpecial = `Most grandstands at most circuits show you one thing — a straight, a single corner, a braking zone. Q2 shows you a sequence: the exit of one of Suzuka's fastest corners into the entry of one of its tightest, back to back, with the elevation to actually see all of it rather than catching pieces through fencing.

That combination is why Q2 gets named again and again as the stand to pick if you're only picking one. It isn't the cheapest seat at Suzuka and it isn't the most exclusive — it's just positioned at the one part of the lap where the race is most likely to actually change in front of you, and high enough up that you see it happen rather than half-see it.`;

const insiderTips = [
  "Q1 and Q2 look similar on a seating chart but aren't the same seat — Q2's extra elevation is what clears the view of the Hitachi Astemo Chicane and pit entry that Q1 partially blocks, so don't treat the two as interchangeable if you're choosing between them.",
  "Bring real wet-weather layers even if the forecast looks clear a week out — Q2 has no roof, and early April at Suzuka can turn cold and wet with little warning.",
];

const whatToAvoid = `Don't assume Q1 and Q2 are functionally the same seat just because they're numbered consecutively and look at the same stretch of track — Q1's lower position and closer fencing genuinely block part of the chicane and pit entry that Q2 sees clearly. Don't book Q2 expecting the podium or main straight in view — this stand's whole value is the 130R-to-chicane sequence, not the start-finish area, which is what V1/V2 cover instead.`;

const practicalInfo = {
  hours: "Gate times follow the official race-day schedule — not yet published for 2027",
  costRange: "Premium bucket-seat tier (grouped with A2, V1, V2) — 2026 confirmed grandstand pricing at Suzuka ran ¥22,000–¥105,000+ overall, with premium stands like Q2 sitting toward the upper end of that range; 2027 pricing not yet released as of Sep 2026. See the Ticket Guide experience for the full range and current on-sale status.",
  bookingMethod: "Official tickets at japan.gp/en/tickets. Named grandstands sell individually and have historically sold out ahead of general admission — book once 2027 sales open.",
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
      title: "Q2 Grandstand — 130R, Casio Triangle, and the Last Corner",
      subtitle: "Suzuka's most-recommended single seat — the elevation to see a full overtaking sequence, not just one corner.",
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
        "Sources: fanamp.com Japanese GP seating guide (Q1 vs Q2 elevation/sightline detail, verified 21 Sep 2026), Wikipedia Suzuka Circuit (layout/chicane naming). motorsporttickets.com checked and excluded — confirmed defunct/liquidated business via direct fetch.",
      sport: ["formula_one"],
      moodTags: ["trackside", "first-timer"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "splurge",
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

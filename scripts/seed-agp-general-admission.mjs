import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne
const EVENT_ID = "64792f75-c009-4070-a12b-23d7bd0a3a7f"; // Australian GP 2027
const slug = "general-admission-park-pass-hills-" + Date.now().toString(36);

const bodyContent = `The Park Pass is Albert Park's general admission ticket, and it's arguably the best GA product on the F1 calendar — you're not fenced into one section but free to walk the paths that loop most of the 5.3km lakeside circuit, watching from a different corner each session if you want to. No reserved seat, no fixed sightline, just the whole park and fourteen numbered track-level viewing zones (D through N) plus a handful of elevated grass mounds.

The mounds matter because Albert Park is flat, and a flat park means most fence-side spots put you at car height with a limited view. Three spots buck that: Turn 2 (inside), Turn 8 (outside) and Turn 9 (outside) are sloped viewing mounds with guaranteed sightlines to the big screens, and Turn 9's version is the famous one — Brocky's Hill, named for Peter Brock, sitting beside the Waite Grandstand at the fast Turns 9-10 chicane. It's the closest thing Albert Park has to a genuine grass-bank picnic spot, and it fills up fast. The track-level D-N zones have no guaranteed screen access and some are first-come first-served bleacher space — arrive early if you want one of the popular ones.

Because the whole point of a Park Pass is mobility, use it. Scout the circuit on Thursday or Friday practice, note which corners suit you, then head straight there Saturday and Sunday morning rather than wandering on race day itself. The floating bridge across Albert Park Lake is the single best time-saver on site — it cuts what would otherwise be a long walk around the water down to minutes, and missing it is the single most common GA mistake first-timers make.

Pitstop zones — food, drink, seating, shade, and screens — are scattered around the loop for when you want a break from standing. Bring a folding camping stool (there's no seating guarantee anywhere on a Park Pass), sun protection, and a portable FM radio tuned to 98.5FM for live commentary while you're between screens. Camera lenses over 400mm, glass bottles, and hard coolers aren't allowed through the gates.`;

const whyItsSpecial = `Most circuits' general admission is an afterthought — a strip of grass behind a fence with no real sightline. Albert Park's Park Pass is the opposite: a full lap's worth of genuinely different vantage points, a floating bridge that turns lake-crossing from an obstacle into a shortcut, and at least three spots — Turn 2, Turn 8, Brocky's Hill at Turn 9 — with real elevation and a guaranteed screen view. It rewards a bit of planning far more than most GA products do.

The honest trade is comfort. There's no seat, no shade guarantee outside the pitstop zones, and popularity means the best spots fill before most grandstand holders have even had breakfast. But for a fraction of a grandstand ticket's price, a Park Pass holder who scouts on Thursday and moves fast on Saturday morning can end up with a better, more varied view of the race than someone locked into a single grandstand seat all weekend.`;

const insiderTips = [
  "Use the floating bridge across Albert Park Lake to cross between the circuit's two halves — walking around instead can cost you an hour or more, easily the single biggest time-loss mistake first-time Park Pass holders make.",
  "Scout your preferred spots on Thursday or Friday practice when crowds are thinner, then head straight there at opening on Saturday and Sunday — the popular track-level zones and Brocky's Hill fill within the first hour of gates opening.",
];

const whatToAvoid = "Don't assume every general admission spot has a view of the big screens — only the three sloped mounds (Turn 2, Turn 8, Turn 9/Brocky's Hill) guarantee that; the fourteen track-level D-N zones are fence-height with no screen guarantee. And don't bring a hard-cased cooler, glass bottles, or a camera lens over 400mm expecting to get through the gates — all three are prohibited and confiscated at entry, a common and avoidable first-timer mistake.";

const practicalInfo = {
  hours: "Gates typically open around 08:00 each day, 2–4 Apr 2027. Park Pass access runs across all four days.",
  costRange: "US$160 for a 1-day Park Pass (2027 tier pricing, confirmed in seeded planner data) — multi-day and 3-day bundle pricing not yet officially published as of Sep 2026.",
  bookingMethod: "Buy directly through the Australian Grand Prix Corporation's official ticketing hub at grandprix.com.au — Park Pass tickets are the most flexible and least likely of any Albert Park product to sell out.",
  website: "https://www.grandprix.com.au/en/tickets",
  reservationsRequired: false,
};

const gettingThere = "Albert Park is a 5-10 minute walk from Melbourne's tram network (routes 1, 3, 5, 6, 16, 64, 67, 72 serve the precinct) — a free AGPC shuttle also runs from the city on event days. Park Pass holders can enter through any general admission gate around the perimeter; the floating bridge across the lake is the fastest way to move between the circuit's east and west sides once inside.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "General Admission — The Park Pass & Hill Spots",
      subtitle: "Walk the whole 5.3km lakeside circuit — Brocky's Hill, the floating bridge, and where GA actually works.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Albert Park Grand Prix Circuit",
      address: "Albert Park Grand Prix Circuit, 12 Aughtie Dr, Albert Park VIC 3206, Australia",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: thef1spectator.com/australian-f1-travel-guide/general-admission/ (Brocky's Hill, Turn 2/3/8-9 spots, strategy tips), oversteer48.com/melbourne-f1-general-admission/ (sloped mound list, 14 track-level zones D-N, floating bridge, prohibited items, radio frequency). Seeded planner_ticket_tier_cost (tier1, US$160 1-day, confirmed in DB 19 Sep 2026). Multi-day pricing not yet published — flagged as such. Verified 20 Sep 2026.",
      sport: ["formula_one"],
      moodTags: ["budget-friendly", "authentic", "high-energy"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 3,
      budgetTier: "budget",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-20",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created:", result.title, "|", result.id, "|", result.slug, "|", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

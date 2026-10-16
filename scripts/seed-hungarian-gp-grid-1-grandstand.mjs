import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

// New experience, part of the grandstand-experience restructure following
// the Ticket Intelligence build (16 Oct 2026). Grid 1 had no dedicated
// write-up before this — one of the real coverage gaps surfaced by cross-
// checking the full 18-seat Ticket Intelligence inventory against existing
// experience content. Real sector/row detail sourced from oversteer48.com's
// dedicated review. Pricing grounded in this event's own seeded
// planner_ticket_tier_cost (tier2, standard grandstands, $259-464).
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const slug = "grid-1-grandstand-starting-grid-view-" + Date.now().toString(36);

const bodyContent = `Grid 1 is new since the Hungaroring's 2025 reconstruction, built from what used to be two separate stands, Gold 2 and Silver 2, merged into one six-sector structure directly facing the starting grid. Sectors A through F, 25 rows each, Sector A closest to Turn 1 and the finish line, Sector F closest to Turn 14. The grid itself forms up directly in front of every sector, which is the actual reason to book this stand over most others at the circuit.

What you get here is the pre-race ritual up close, cars rolling into position, mechanics working the grid, drivers doing their walk, the kind of people-watching that doesn't happen anywhere else on the lap. Sector A sits nearest the finish line and the podium sits just across the track to its left, with the pit garages' opening boxes close enough that you'll catch the first few teams' stops, though not the full pit lane. Higher rows matter here more than most stands, since they clear the pit wall and give you an actual look into the start of pit lane rather than a wall of concrete.

The trade-off is Turn 1. The new main grandstand sits to Grid 1's left and blocks the view toward it almost entirely, worse the further left you sit. You'll watch cars cross the start line and then lose them within a few seconds as they disappear behind the stand. Sector E or F, furthest from that blind spot, trades some of the grid-front intimacy for a clean look at cars exiting Turn 14 and accelerating onto the straight instead, arguably the better pick if you want actual racing alongside the grid spectacle rather than just the spectacle itself.

It's uncovered, same as nearly everything at this circuit except the main grandstand, and Grid 3 sits immediately to the right, physically part of the same structure under a different name.`;

const whyItsSpecial = `Most grandstands at the Hungaroring sell you a corner. Grid 1 sells you something most fans never get close to anywhere else on the calendar, the thirty-odd minutes before lights out, when the grid is genuinely a working space, not a photo opportunity behind a rope line. Mechanics making last adjustments, drivers doing their pre-race routine, the occasional celebrity or team principal working the grid before the formation lap, all of it close enough to actually watch rather than catch on a broadcast feed.

That's a specific kind of value that doesn't show up in a sightline comparison. A seat here isn't really competing with T1 or the Chicane on racing drama, it's offering something those stands can't: the one part of a Grand Prix weekend that's genuinely ceremony as much as sport, watched from close enough that it feels like you're part of it rather than watching it happen.`;

const insiderTips = [
  "Book Sector E or F if Turn 14 action matters to you as much as the grid itself — Sectors A through D lose Turn 1 almost entirely behind the new main grandstand, but E and F keep a clean view of cars exiting Turn 14 onto the straight.",
  "Go for the highest row your budget allows rather than the lowest — Grid 1's pit wall sits high enough that low rows lose most of the pit lane view, while upper rows clear it for an actual look at the first few garages.",
  "If celebrity and driver spotting on the grid is the actual point of the trip, Sector A is worth the Turn 1 trade-off — it's the closest sector to both the podium and the finish line, where the pre-race walk concentrates.",
];

const whatToAvoid = `Don't book the left-hand sectors (A, B) expecting any real view of Turn 1 — the new main grandstand blocks it almost completely, and the further left you sit within Grid 1, the less of the start line itself you keep before cars vanish from sight. And don't expect a view of the full pit lane even from the best seats here — you're in line with the first few garages only, not the whole lane, so if watching a specific team's full pit-stop sequence matters, this isn't the stand for it.`;

const practicalInfo = {
  hours: "Gates typically open around 8am on race weekend days; grandstand seating holds for the full day once sessions begin",
  costRange: "Roughly US$464 (3-day), among the higher-priced standard grandstands at this event, just below the premium main-straight tier",
  bookingMethod: "Book via the official reseller gpticketshop.hu or tickets.formula1.com. Grid 1 is a genuinely popular stand given its grid-front position and tends to sell through well ahead of race weekend.",
  website: "https://www.gpticketshop.hu, https://tickets.formula1.com/en/f1-3277-hungary",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Grid 1 — Front Row to the Pre-Race Ritual",
      subtitle: "Six sectors facing the starting grid itself, where the half-hour before lights out is the real draw.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Hungaroring, Mogyoród",
      address: "Hungaroring, 2146 Mogyoród, Hungary",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere: "M2 metro to Örs vezér tere, then HÉV suburban rail toward Kerepes, then the free circuit shuttle to Gate 7 — the grandstand's own nearest entrance.",
      editorialNote: "Sources: oversteer48.com's Grid 1 grandstand review (sector/row layout, former Gold 2/Silver 2 names, sightline detail). Pricing grounded in seeded planner_ticket_tier_cost tier2 row for this event. New experience, 16 Oct 2026 — fills a real coverage gap surfaced by the Ticket Intelligence seat-inventory build (Grid 1 had no dedicated write-up before this).",
      sport: ["formula_one"],
      moodTags: ["atmospheric", "ceremonial", "social"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-10-16",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

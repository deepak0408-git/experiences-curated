import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

// New experience, part of the grandstand-experience restructure following
// the Ticket Intelligence build (16 Oct 2026). Grid 2 had no dedicated
// write-up before this. Real sector/row detail sourced from oversteer48.com's
// dedicated review. Pricing grounded in this event's own seeded
// planner_ticket_tier_cost (tier2, standard grandstands, $259-464).
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const slug = "grid-2-grandstand-final-corner-view-" + Date.now().toString(36);

const bodyContent = `Grid 2 used to be Silver 1 before the 2025 reconstruction renamed it, and it sits at the end of the starting grid on the left side of the straight, physically joined to the Grand Prix 1 grandstand next door with only a barrier between them. Three sectors, A through C, 29 rows each, Sector A closest to Turn 1 and the start-finish line, Sector C closest to the final corner.

That final-corner position is what actually separates this stand from its Grid 1 neighbour. Sector C gives a genuine view of Turn 14 as cars complete the lap, something Grid 1 doesn't really offer, alongside the usual grid-front view, drivers and team principals working the grid before lights out, the pre-race walk, the kind of close-up ceremony that's hard to get anywhere else at the Hungaroring. Looking left from here only gets you about halfway down the start-finish straight before the rebuilt main grandstand cuts off the rest of the view, so don't book this expecting a clean read on the whole pit straight.

The TV screen is the real seat-selection puzzle at Grid 2. An advertising gantry crosses in front of lower rows and genuinely blocks it, which matters more than it sounds since you'll want the screen during qualifying especially, when most of the track action is happening somewhere you can't see directly. Row 20 and above in Sector C, or row 25 and above in Sectors A or B, clears the gantry. Go low and to the left and you can lose the screen almost entirely, with nothing to fall back on for the parts of the lap this stand doesn't cover.

It's uncovered, same as nearly every grandstand here bar the main one, and it sells out most years given the grid-front position — worth treating the on-sale date as a real deadline rather than something to revisit closer to the weekend.`;

const whyItsSpecial = `Grid 2's real case is the combination nobody else quite offers: genuine pre-race grid atmosphere, the same drivers-and-mechanics ceremony Grid 1 sells, paired with an actual look at Turn 14 that Grid 1 doesn't have. It's a seat for someone who wants both halves of a Hungaroring weekend in one place, the ritual before lights out and a real corner once the race is running, rather than choosing one or the other.

It won't win on pure racing drama, the pits are out of sight entirely and the straight disappears behind the main grandstand past the halfway point. But for a fan who cares as much about watching the grid form up as watching the race itself, that trade is a reasonable one, and the final-corner view gives this stand something to offer once the ceremony's over and the cars are actually moving.`;

const insiderTips = [
  "Book row 20 or higher in Sector C, or row 25 or higher in Sectors A/B, if the TV screen matters to you — the advertising gantry genuinely blocks it from lower rows, and you'll want the screen during qualifying when most action is out of direct sight.",
  "Sector C specifically is the one reason to pick Grid 2 over Grid 1 — it's the only sector with a real view of Turn 14, something Grid 1's layout doesn't offer at all.",
  "This stand often sells out before race weekend most years — if the final-corner view and grid-front combination is what you're after, book as soon as tickets open rather than waiting.",
];

const whatToAvoid = `Don't book expecting pit lane action of any kind — the garages sit far across the track to the left, and nothing about Grid 2's angle brings them into view, unlike some other grid-area stands. And don't sit in the lower rows of Sectors A or B if the TV screen matters during the session — the advertising gantry blocks it badly from there, and with the straight already cut off by the main grandstand, a bad TV angle leaves you with very little to actually watch during long stretches of the race.`;

const practicalInfo = {
  hours: "Gates typically open around 8am on race weekend days; grandstand seating holds for the full day once sessions begin",
  costRange: "Roughly US$464 (3-day), among the higher-priced standard grandstands at this event, matching Grid 1's tier",
  bookingMethod: "Book via the official reseller gpticketshop.hu or tickets.formula1.com. Grid 2 sells out most years given its grid-front position — book well ahead of race weekend.",
  website: "https://www.gpticketshop.hu, https://tickets.formula1.com/en/f1-3277-hungary",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Grid 2 — The Grid, Plus the Final Corner",
      subtitle: "Starting-grid ceremony on one side, a real view of Turn 14 on the other, in a single stand.",
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
      gettingThere: "M2 metro to Örs vezér tere, then HÉV suburban rail toward Kerepes, then the free circuit shuttle to Gate 6 — the grandstand's own nearest entrance.",
      editorialNote: "Sources: oversteer48.com's Grid 2 grandstand review (sector/row layout, former Silver 1 name, TV-screen obstruction detail, direct comparison against Grid 1). Pricing grounded in seeded planner_ticket_tier_cost tier2 row for this event. New experience, 16 Oct 2026 — fills a real coverage gap surfaced by the Ticket Intelligence seat-inventory build.",
      sport: ["formula_one"],
      moodTags: ["atmospheric", "ceremonial"],
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

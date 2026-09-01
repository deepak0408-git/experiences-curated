import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f0388505-a1ca-4929-b14d-f33ae8075409";
const EVENT_ID = "cd5785a7-d37c-4d4b-a545-a8b8e28eac57";
const slug = "las-vegas-gp-main-grandstand-" + Date.now().toString(36);

const bodyContent = `The Heineken Silver Main Grandstand is the one stand at the Las Vegas Grand Prix built around the moment everyone actually wants to see: lights out, and the checkered flag twelve laps and however many hours later. It sits in the East Harmon Zone, dead level with the start/finish line, and it looks straight down pit lane into the F1 team garages. You can see the mechanics working from your seat. Nowhere else on the circuit gives you that.

The stand runs across blocks PG1-103 through PG1-116, and the start line itself lines up with blocks 114 and 116 — book there if the actual moment of the start matters more than anything else. Rows in the middle of the stand get the cleanest look at the pit wall and the garages; the higher rows trade some of that closeness for a view of the Sphere lit up over the roofline of the pit building, which on a night race is its own reason to sit high. The front row isn't as low as it looks in photos — it's raised above the ground, so even ringside seats clear the wall.

There's one seating trap worth knowing before you book: blocks 103 and 115, rows 32 to 40, sit in the shadow of the Skybox structure above, and it blocks the view down toward the pits from those specific rows. It's not a small obstruction — multiple race-goers have flagged it as the one regret from an otherwise excellent stand. Every other block and row combination in the Main Grandstand is a genuinely strong seat.

Because this is the marquee grandstand — the one every highlight reel from the race actually gets filmed from — it's also the most expensive single-stand ticket at the event, short of the hospitality suites above it. A single Saturday race-day ticket here runs well into four figures. If that's outside budget, the Turn 3 Grandstand nearby gets you real racing at a fraction of the price; this stand is for the start, the finish, and the pit lane theater in between, and nothing else on the Strip circuit replicates that specific view.`;

const whyItsSpecial = `Most grandstands at a street circuit sell you one corner. The Main Grandstand sells you the entire narrative arc of the race — the grid forming under lights, the start, every pit stop, and the checkered flag, all from one seat. That's rare even among F1's most famous stands, and it's the reason this one costs what it does. I'd point anyone who's only doing Las Vegas once, and wants the single most complete race-day experience the ticket can buy, toward blocks 114 or 116, dead level with the line. It's not the cheapest way to watch the race and it was never trying to be — it's the seat built for people who came for the whole story, not one chapter of it.`;

const insiderTips = [
  "Blocks PG1-103 and PG1-115, rows 32-40 specifically, sit under the Skybox overhang and lose the sightline down to the pits — every other row in those same blocks is clear, so shift a few rows either way rather than assuming the whole block is compromised.",
  "If catching the Sphere lit up above the pit building matters to you as much as the racing, book a higher row deliberately — the upper tiers trade a little closeness to the pit wall for that specific skyline view, which the lower rows don't get at all.",
];

const whatToAvoid = `Don't assume every seat in this grandstand has an unobstructed view of the start-line action — the Skybox overhang genuinely blocks rows 32-40 in blocks 103 and 115, and that's a real, documented complaint from past race-goers, not a minor quibble. Don't book this stand purely out of habit because it's the "main" one, either — if your budget is tighter and you'd rather see wheel-to-wheel racing up close than the start/finish ceremony, Turn 3 Grandstand delivers a genuinely better racing view for a fraction of the price.`;

const practicalInfo = {
  hours: "Practice Thu 19 Nov, Qualifying Fri 20 Nov, Race Sat 21 Nov 2026 — all sessions run evening into night, Pacific time",
  costRange: "From US$206 single-day Thursday practice; US$411 single-day Friday qualifying; US$1,641 single-day Saturday race (2026 pricing)",
  bookingMethod: "Book directly via f1lasvegasgp.com or tickets.formula1.com under East Harmon Zone grandstands. This is consistently the first stand to sell out given the start/finish and pit-lane view — expect it to move fast once single-day and 3-day passes go on sale.",
  howToBook: "",
  website: "https://www.f1lasvegasgp.com/tickets/grandstands/main-grandstand/, https://tickets.formula1.com/en/f1-59007-las-vegas/23378-main-grandstand-start-finish-line",
  reservationsRequired: true,
};

const gettingThere = "East Harmon Zone entrance, off Las Vegas Boulevard near Harmon Avenue. Strip road closures begin early afternoon on race days — walking or the monorail from a nearby Strip hotel is faster and more reliable than any vehicle, including rideshare.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Heineken Silver Main Grandstand — the start/finish seat",
      subtitle: "Lights out to checkered flag, dead level with the line, straight into the pit garages",
      slug,
      experienceType: "sports_venue",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "East Harmon Zone",
      address: "Heineken Silver Main Grandstand, East Harmon Zone, Las Vegas Strip Circuit, Las Vegas, NV",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from f1lasvegasgp.com official Main Grandstand page, oversteer48.com 2026 pricing breakdown, and thef1spectator.com / fanamp.com seating reviews (Skybox obstruction in blocks 103/115 rows 32-40). Verified 29 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["high-energy", "premium"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "splurge",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-29",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓ Created:", result.title, "→", result.id, result.slug, result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

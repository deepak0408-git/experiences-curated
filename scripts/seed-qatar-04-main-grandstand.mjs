// Qatar GP 2026 — Experience 4/21: Main Grandstand

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DOHA_ID = "4e53af71-7526-4d55-bf81-5d57d6f22136";
const QATAR_GP_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";
const slug = "qatar-gp-main-grandstand-" + Date.now().toString(36);

const bodyContent = `Main Grandstand is the only stand at Lusail with assigned seating, which sounds like a small detail until you've stood in North Grandstand's first-come-first-served scrum. Here, your ticket names a zone, a row, a seat — no scrambling required.

The stand runs opposite the pit lane, split into six zones lettered A through F, four sections each, rows 1 through 14. Where you sit inside that grid genuinely changes the experience. Zone A sits closest to the finish line and podium — the pick if the trophy ceremony matters to you as much as the racing. Zones C and D sit in the middle, catching the pre-race grid walk at close range. Zones D and E angle furthest toward Turn 1, picking up braking action that Zone A can't see at all. Row matters too: higher rows (10 and up) see over the pit wall into the pit boxes themselves, useful during pit stops; lower rows sit closer to track level but lose that sightline.

The roof only covers the back half of the stand — a partial shade structure, not full cover, so a front-row seat in a "covered" grandstand can still mean full sun during a hot practice session. Seating is individual plastic chairs, and the stand was renovated ahead of the 2023 race, bringing it up to a modern standard. Four large screens mounted on the opposite pit buildings fill in whatever your seat's sightline misses — useful given how much of the lap happens well outside the front straight.

Race day temperatures cool fast once the sun goes down, and by the time Sunday's 7pm race reaches its closing laps under floodlights, the evening chill is real — pack a layer regardless of how warm the afternoon felt.`;

const whyItsSpecial = `The zone-and-row system here rewards actually thinking about what you want to watch, which most grandstands don't offer — you either get a seat or you don't. Someone who wants the ceremony (grid walk, podium, trophy presentation) should book differently than someone who wants Turn 1 braking duels, and Main Grandstand is specific enough that both of those are real, distinct bookable choices within the same stand rather than a coin flip.

It's also the one seat at the track where "assigned" actually means something. Every other grandstand tier at Lusail runs first-come-first-served within the stand — Main Grandstand is the exception, and for anyone traveling a long way for one weekend, not having to stake out a spot two hours before gates open is worth real money on its own.`;

const insiderTips = [
  "Rows 10 and above see over the pit wall into the pit boxes — a genuine advantage during pit stops that lower rows in the same zone don't get, even though both are technically \"Main Grandstand.\"",
  "Zone A gives the best podium/finish-line view but the weakest Turn 1 sightline — decide which matters more before booking, since the zones genuinely trade one for the other rather than one zone being simply \"better.\"",
];

const whatToAvoid = "Don't assume paying the most for a grandstand ticket means you'll see the whole lap live — Main Grandstand still relies on the venue's big screens to cover corners outside the front straight, the same as every other stand. Don't expect a premium physical seat to match the price — Main Grandstand is the most expensive grandstand ticket at Lusail, but seating throughout is individual plastic chairs, the same seating standard as the cheaper corner stands. Don't book Zone A expecting strong Turn 1 racing views — it's the ceremonial end of the stand, and the corner action is genuinely better from Zones D and E.";

const practicalInfo = {
  hours: "Gates open several hours before first session. 2026 session times (local/Doha, AST): Practice 1 Fri 4:30-5:30pm, Practice 2 Fri 8-9pm, Practice 3 Sat 5:30-6:30pm, Qualifying Sat 9-10pm, Race Sun 7pm.",
  costRange: "QAR 2,000 (approx. US$548) for the 3-day ticket",
  bookingMethod: "Official tickets via tickets.formula1.com or the Lusail International Circuit ticket portal — assigned seating, zone and row selected at purchase.",
  website: "https://www.formula1.com/en/racing/2026/qatar",
  howToBook: "",
};

const gettingThere = "Access via the Doha Metro Red Line to Lusail Metro Station, then the free ticket-holder shuttle from the station's east side — runs from roughly 30 minutes before gates open, 20-40 minutes depending on traffic.";

const [inserted] = await db.insert(experiences).values({
  title: "Main Grandstand",
  subtitle: "The only assigned seating at Lusail — zone and row decide what you actually see",
  slug,
  experienceType: "fan_experience",
  status: "in_review",
  destinationId: DOHA_ID,
  bodyContent,
  whyItsSpecial,
  practicalInfo,
  gettingThere,
  insiderTips,
  whatToAvoid,
  sport: ["formula_one"],
  curationTier: "editorial",
  lastVerifiedDate: new Date().toISOString().slice(0, 10),
  editorialNote: "Sources: oversteer48.com (zone/row detail, roof coverage, renovation history), gpdestinations.com (pricing). No Google Maps rating — venue-section experience within the circuit, not an independently rateable place.",
}).returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

await db.insert(sportingEventExperiences)
  .values({ experienceId: inserted.id, sportingEventId: QATAR_GP_EVENT_ID })
  .onConflictDoNothing();

console.log("Seeded:", inserted);

await client.end();

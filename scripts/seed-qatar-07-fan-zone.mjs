// Qatar GP 2026 — Experience 7/21: Fan Zone

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DOHA_ID = "4e53af71-7526-4d55-bf81-5d57d6f22136";
const QATAR_GP_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";
const slug = "qatar-gp-fan-zone-" + Date.now().toString(36);

const bodyContent = `Every valid Qatar Grand Prix ticket includes the Fan Zone, no upgrade required — it's positioned right behind the Main Grandstand, next to the circuit's main entrance and parking, which makes it an easy stop on the way in or out regardless of which stand you're actually sitting in.

The zone runs both static and interactive F1 exhibits alongside merchandise booths and food and drink stalls, but the bigger draw is the activity programme: F1 driving simulators, a genuine Pit Stop Challenge where fans try changing an actual F1 tyre against the clock, and past editions have added laser games, kart racing aimed at kids and teens, face painting, and AI-driven photo booths. Prizes for the day's fastest simulator lap have included signed driver memorabilia and guided paddock tours — a rare route into paddock access that doesn't require a hospitality-tier ticket.

Driver and personality appearances rotate through the Fan Zone across the weekend, though specific names and times aren't announced far in advance. The standout feature, though, is what happens after the chequered flag: post-race concerts are included with every valid ticket, with international headline acts booked to perform once the on-track action wraps for the day. As of this writing, the 2026 lineup hadn't been announced yet — check closer to the race for confirmed acts and set times.`;

const whyItsSpecial = `Most F1 fan zones are a way to kill time between sessions. Lusail's is a genuine part of the ticket's value — free concerts with international headliners after the flag, a real shot at winning a paddock tour off a simulator leaderboard, and activities pitched at kids as much as adults, which matters for a race that increasingly pulls in family groups rather than just solo enthusiasts.

It's also smart logistics as much as entertainment: sitting right behind the Main Grandstand near the main entrance means it absorbs the natural flow of people arriving and leaving rather than requiring a special trip across the venue. For a circuit this large, that's a real design decision, not an accident.`;

const insiderTips = [
  "The Pit Stop Challenge's fastest-lap prizes have included guided paddock tours in past editions — a genuine way to see the paddock without buying a hospitality-tier ticket, if you're willing to compete for it.",
  "Post-race concerts are included with every ticket tier, not just premium ones — worth factoring into which day you prioritize attending if the lineup announcement favors one night over another.",
];

const whatToAvoid = "Don't expect a quick in-and-out visit right before the race or right after the concert — the Fan Zone sits directly against the circuit's main entrance and parking, exactly where arrival and post-race crowds bottleneck hardest. Don't assume driver appearances happen on a fixed public schedule — they rotate through the weekend without advance notice of exact times, so treat any sighting as a bonus rather than something to plan your day around.";

const practicalInfo = {
  hours: "Opens with circuit gates each race day, runs through the post-race concert programme. 2026 session times (local/Doha, AST): Practice 1 Fri 4:30-5:30pm, Practice 2 Fri 8-9pm, Practice 3 Sat 5:30-6:30pm, Qualifying Sat 9-10pm, Race Sun 7pm.",
  howToBook: "",
};

const gettingThere = "Located behind the Main Grandstand, adjacent to the circuit's main entrance and parking — accessible immediately after entering via the Lusail Metro Station shuttle route.";

const [inserted] = await db.insert(experiences).values({
  title: "Fan Zone",
  subtitle: "Simulators, a real pit stop challenge, and free post-race concerts — included with every ticket",
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
  editorialNote: "Sources: fanamp.com, qna.org.qa, lcsc.qa (Fan Zone location, activities, concert inclusion). 2026 concert lineup not yet announced as of Sep 2026 — stated as such rather than guessed.",
}).returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

await db.insert(sportingEventExperiences)
  .values({ experienceId: inserted.id, sportingEventId: QATAR_GP_EVENT_ID })
  .onConflictDoNothing();

console.log("Seeded:", inserted);

await client.end();

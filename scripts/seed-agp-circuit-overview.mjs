import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne
const EVENT_ID = "64792f75-c009-4070-a12b-23d7bd0a3a7f"; // Australian GP 2027
const slug = "albert-park-circuit-inside-the-track-" + Date.now().toString(36);

const bodyContent = `Albert Park Grand Prix Circuit wraps 5.278km around Albert Park Lake in a Melbourne suburb three kilometres south of the CBD — for 361 days a year it's public roads and parkland, and for one week each April it becomes an FIA Grade 1 circuit with 14 corners and four DRS zones. That dual identity shapes everything about the weekend: because the tarmac is normal road surface rather than a dedicated track laid down once and left, grip actually builds session by session as rubber goes down, which is why first practice on Friday can look scrappy and by qualifying on Saturday the same corners suddenly get taken flat.

The circuit first raced in 1953, returned as Formula 1's Australian home in 1996, and was reprofiled in 2021 to enable faster, closer racing — the current lap record, 1:19.813, was set by Charles Leclerc in 2024. Ayrton Senna's final Grand Prix win came here in 1993, and Ferrari leads all constructors at the venue with ten wins.

Getting in and moving around the precinct is worth planning for. The circuit has multiple public entry gates spaced around the lake perimeter, typically opening from around 08:00 each day — arrive early on Friday and Saturday, since queues build fast once the first support-category session starts. Food and drink stalls run at each main grandstand cluster and near the Fan Zone, covering everything from casual food-truck fare to sit-down options; card only, and prices carry typical event-day markup. Toilets sit at regular intervals around the lake path and at every grandstand block, with larger banks near the main entry gates — expect a wait at session breaks. There's no general public parking at the circuit itself: Albert Park is a residential area with strict event-day restrictions, so the tram network or the free CBD shuttle is the practical way in rather than driving. A limited number of pre-booked commercial car parks operate around South Melbourne, but they sell out well ahead of race weekend.

Because the track is genuinely fast by street-circuit standards — long straights, few genuine hairpins — overtaking tends to cluster at specific points: the Turn 1-3 complex off the main straight, and the DRS-enabled Turn 11 exit. Knowing that shapes where you choose to watch from as much as any grandstand's proximity to the pits does.`;

const whyItsSpecial = `Most street circuits trade racing quality for the spectacle of running through a city. Albert Park is unusual because it does both — a genuinely fast, flowing 14-turn layout that happens to sit on public roads around a lake, rather than a slow procession between concrete walls. The 2021 reprofile leaned into that identity rather than away from it, and the result is a lap record nearly five seconds faster than the old layout produced in over two decades.

What makes standing anywhere on this circuit feel different from a purpose-built track is the history layered into ordinary parkland — Senna's last win, Webber's first point, Brundle cartwheeling through Turn 3, all happened on tarmac that reverts to a running and cycling path the other 361 days of the year. That contrast, a world championship's worth of drama on a public road most Melburnians jog past every other week of the year, is what actually makes Albert Park worth understanding before race weekend, not just watching.`;

const insiderTips = [
  "This is a walk-and-tram venue, not a drive-and-park one — Albert Park's residential streets carry strict event-day parking restrictions, so build your day around the tram network or the free AGPC shuttle rather than trying to drive in.",
  "Every food and drink stall inside the precinct runs card-only, and toilet queues build fastest right at session breaks — the banks near the main entry gates tend to move quicker than the ones at individual grandstand blocks.",
];

const whatToAvoid = "Don't assume Albert Park's street-circuit tag means slow, tight racing — the 2021 reprofile pushed this into one of the faster circuits on the calendar, and several corners once thought of as tricky are now taken flat out. And don't expect the same layout you might remember from before 2021 if you've watched an older race here — several corners were reshaped, meaning older lap-time comparisons and old racing-line advice from pre-2021 broadcasts no longer hold.";

const practicalInfo = {
  hours: "Circuit gates open from approximately 08:00 each day, 2–4 Apr 2027. Practice Friday, Qualifying Saturday, Race Sunday.",
  reservationsRequired: false,
};

const gettingThere = "Albert Park is a 5-10 minute walk from Melbourne's tram network (routes 1, 3, 5, 6, 16, 64, 67, 72 serve the precinct), three kilometres south of the CBD — a free AGPC shuttle also runs from the city on event days.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Albert Park Circuit — Inside the Track",
      subtitle: "A public park 361 days a year, an FIA Grade 1 circuit for one week — the layout, the history, the overtaking spots.",
      slug,
      experienceType: "sports_venue",
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
      editorialNote: "Sources: en.wikipedia.org/wiki/Albert_Park_Circuit (opening/reopening dates, 2021 reprofile, lap record, Schumacher/Ferrari records), total-motorsport.com and f1-fansite.com Albert Park circuit guides (layout facts cross-checked), search summary covering bleacherreport.com/menshealth.com.au/cmcmotorsports.com (Senna 1993 final win, Webber 2002 debut, Brundle 1996 crash, Ralf Schumacher 2002 crash). Verified 20 Sep 2026.",
      sport: ["formula_one"],
      moodTags: ["authentic", "immersive"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "free",
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

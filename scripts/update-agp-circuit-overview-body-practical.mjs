import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "albert-park-circuit-inside-the-track-mu9c6dq0";

const bodyContent = `Albert Park Grand Prix Circuit wraps 5.278km around Albert Park Lake in a Melbourne suburb three kilometres south of the CBD — for 361 days a year it's public roads and parkland, and for one week each April it becomes an FIA Grade 1 circuit with 14 corners and four DRS zones. That dual identity shapes everything about the weekend: because the tarmac is normal road surface rather than a dedicated track laid down once and left, grip actually builds session by session as rubber goes down, which is why first practice on Friday can look scrappy and by qualifying on Saturday the same corners suddenly get taken flat.

The circuit first raced in 1953, returned as Formula 1's Australian home in 1996, and was reprofiled in 2021 to enable faster, closer racing — the current lap record, 1:19.813, was set by Charles Leclerc in 2024. Ayrton Senna's final Grand Prix win came here in 1993, and Ferrari leads all constructors at the venue with ten wins.

Getting in and moving around the precinct is worth planning for. The circuit has multiple public entry gates spaced around the lake perimeter, typically opening from around 08:00 each day — arrive early on Friday and Saturday, since queues build fast once the first support-category session starts. Food and drink stalls run at each main grandstand cluster and near the Fan Zone, covering everything from casual food-truck fare to sit-down options; card only, and prices carry typical event-day markup. Toilets sit at regular intervals around the lake path and at every grandstand block, with larger banks near the main entry gates — expect a wait at session breaks. There's no general public parking at the circuit itself: Albert Park is a residential area with strict event-day restrictions, so the tram network or the free CBD shuttle is the practical way in rather than driving. A limited number of pre-booked commercial car parks operate around South Melbourne, but they sell out well ahead of race weekend.

Because the track is genuinely fast by street-circuit standards — long straights, few genuine hairpins — overtaking tends to cluster at specific points: the Turn 1-3 complex off the main straight, and the DRS-enabled Turn 11 exit. Knowing that shapes where you choose to watch from as much as any grandstand's proximity to the pits does.`;

const practicalInfo = {
  hours: "Circuit gates open from approximately 08:00 each day, 2–4 Apr 2027. Practice Friday, Qualifying Saturday, Race Sunday.",
  reservationsRequired: false,
};

const insiderTips = [
  "This is a walk-and-tram venue, not a drive-and-park one — Albert Park's residential streets carry strict event-day parking restrictions, so build your day around the tram network or the free AGPC shuttle rather than trying to drive in.",
  "Every food and drink stall inside the precinct runs card-only, and toilet queues build fastest right at session breaks — the banks near the main entry gates tend to move quicker than the ones at individual grandstand blocks.",
];

try {
  const [result] = await db
    .update(experiences)
    .set({ bodyContent, practicalInfo, insiderTips, lastVerifiedDate: "2026-09-20" })
    .where(eq(experiences.slug, SLUG))
    .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

  if (!result) {
    console.error("No experience found with slug:", SLUG);
  } else {
    console.log("\n✓ Updated:", result.slug, "|", result.id, "| status:", result.status);
  }
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await client.end();
}

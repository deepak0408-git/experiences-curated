// Qatar GP 2026 — Experience 5/21: North Grandstand

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DOHA_ID = "4e53af71-7526-4d55-bf81-5d57d6f22136";
const QATAR_GP_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";
const slug = "qatar-gp-north-grandstand-" + Date.now().toString(36);

const bodyContent = `North Grandstand sits opposite the pit lane exit, at the end of the main straight where cars brake hard into Turn 1. That's the view — the braking zone and Turn 1 entry — though a building on the inside of the corner blocks sightlines past the apex, so you won't see the full corner unwind. From the higher rows, at the right end of the stand, you can catch a glimpse of Turn 2 as well.

There's no assigned seating here, which is the stand's biggest practical difference from Main Grandstand across the straight. Eight sections, rows increasing toward the back, and you claim whatever's open when you arrive. It's not oversold, but the lack of allocation means real inefficiency in practice — groups leave single gaps scattered through a section rather than seats filling in neat blocks, so a stand that looks full at a glance may still have scattered singles available.

The stand is uncovered, though with Qatar running as a night race, sun exposure barely factors in — Friday's practice sessions run in the late afternoon before the light fades, and everything Saturday and Sunday happens after dark. What does matter is the temperature drop: Doha's late-November evenings cool fast, and an uncovered grandstand after sunset means a real chill by the later sessions. Two TV screens flank the stand for whenever the actual sightline can't cover the lap.

Every North Grandstand ticket also includes the Lusail Hill general admission area outside Turn 1 — effectively a second viewing option within the same ticket, which no other grandstand tier offers.`;

const whyItsSpecial = `This is the honest value pick among Lusail's grandstands: less than the Main Grandstand's assigned-seat premium, a genuine trackside view of real braking-zone racing rather than ceremonial straight-line action, and a built-in second viewing area at Lusail Hill that effectively doubles the ticket's use. The tradeoff — no assigned seat, uncovered stand — is a real cost, but it's a cost you can manage by showing up early, not a fixed limitation like Main Grandstand's zone system.

It's also the stand that rewards knowing the layout before you arrive, rather than guessing on the day. Fans who know to head for the top rows at the left end get a meaningfully better weekend than fans who wander in and take whatever's nearest the gate — that gap between an informed and uninformed ticket holder is bigger here than at almost any other stand at the circuit.`;

const insiderTips = [
  "Arrive at gate-open specifically for the top rows at the left-hand end of the stand — that combination balances Turn 1 braking action, a partial Turn 2 view, and clear sightlines to the TV screens, and it's the spot regulars specifically seek out.",
  "Because seating isn't assigned, groups often leave single-seat gaps scattered through otherwise \"full-looking\" sections — a stand that looks packed from the entrance may still have individual seats free further in.",
];

const whatToAvoid = "Don't expect to see the full Turn 1 corner unwind — a building on the inside of the corner blocks the apex and exit from this stand's sightline, so you're watching the braking and entry only, not the whole corner. Don't skip a jacket assuming an uncovered stand only matters for sun exposure — Qatar's night-race format means the real risk here is the evening temperature drop, not heat.";

const practicalInfo = {
  hours: "Gates open several hours before first session; exact times published closer to race weekend",
  costRange: "QAR 1,500 (approx. US$411) for the 3-day ticket — includes Lusail Hill general admission access",
  bookingMethod: "Official tickets via tickets.formula1.com or the Lusail International Circuit ticket portal. No assigned seating — first-come, first-served within the stand.",
  website: "https://www.formula1.com/en/racing/2026/qatar",
  howToBook: "",
};

const gettingThere = "Access via the Doha Metro Red Line to Lusail Metro Station, then the free ticket-holder shuttle from the station's east side — runs from roughly 30 minutes before gates open, 20-40 minutes depending on traffic.";

const [inserted] = await db.insert(experiences).values({
  title: "North Grandstand",
  subtitle: "Real braking-zone racing, no assigned seat, and a bonus second view at Lusail Hill",
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
  editorialNote: "Sources: oversteer48.com (sightlines, seating structure, seat-selection detail), gpdestinations.com (pricing). No Google Maps rating — venue-section experience within the circuit, not an independently rateable place.",
}).returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

await db.insert(sportingEventExperiences)
  .values({ experienceId: inserted.id, sportingEventId: QATAR_GP_EVENT_ID })
  .onConflictDoNothing();

console.log("Seeded:", inserted);

await client.end();

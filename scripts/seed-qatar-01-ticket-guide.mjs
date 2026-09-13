// Qatar GP 2026 — Experience 1/21: Where to Sit — Grandstand & Ticket Guide
// experience-researcher process followed inline (no screen presentation per
// user instruction 12 Sep 2026 — output tokens are being conserved, direct-
// to-DB seeding with self-audit per skill §5b in place of the approval pause).
// Sources: gpdestinations.com official promoter price table (27-29 Nov 2026,
// 3-day tickets); marhaba.qa + qatar-tribune.com (Paddock Club + GA sold out,
// corroborated independently, Sep 2026); formula1.com session times
// (verified directly 12 Sep 2026).

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DOHA_ID = "4e53af71-7526-4d55-bf81-5d57d6f22136";
const QATAR_GP_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";
const slug = "qatar-gp-ticket-guide-" + Date.now().toString(36);

const bodyContent = `Lusail runs at night, and where you sit decides how much of that you actually get. The circuit's own promoter publishes four ticket tiers, and each one buys a genuinely different weekend, not just a different price tag.

Main Grandstand sits directly opposite the pits, facing the front straight — start, finish, grid, and podium all from one seat, split into zones A/B, C/D and E/F. It's covered on the back half, and because the stand faces north, that roof throws real shade as the sun drops late in the afternoon before the lights take over. Three-day tickets run QAR 2,000, about US$548, the most expensive seat at the track.

North Grandstand, on the opposite side of the main straight, costs less at QAR 1,500 (about US$411) and gets you the start line and Turn 1. The seating isn't allocated — you walk in and claim whatever's open — and the stand is uncovered, so bring a layer once the desert evening cools. The genuine upside here: a North Grandstand ticket also includes access to the Lusail Hill general admission area outside Turn 1, effectively two viewing spots on one ticket.

The mid-range stands at Turn 2, Turn 3, and Turn 16 run QAR 1,000 (about US$274) for the weekend. These put you trackside at a specific corner instead of the ceremony of the front straight — better if you want to watch actual racing, braking zones and overtakes, over start-finish theatre.

General Admission, sold as Lusail Hill, is the cheapest ticket at QAR 600 (about US$165) — and it's already gone. GA sold out on the official ticket platform before the race weekend arrived, alongside one section of the Main Grandstand and the entire Paddock Club allocation. For a race that's historically been one of the more affordable weekends on the calendar, that's a real shift, and it means anyone still shopping for tickets is choosing between the paid grandstand tiers or the resale market, not the once-reliable cheap seat.

The weekend itself is a standard format, no sprint race: practice runs Friday (1:30-2:30pm and 5-6pm local), practice and qualifying Saturday (2:30-3:30pm and 6-7pm), and the race goes green Sunday at 4pm — timed so the final laps run fully under the floodlights regardless of session slippage.`;

const whyItsSpecial = `Lusail is one of the few circuits where the ticket tier genuinely changes what kind of race you watch, not just how comfortable you are watching it. The front straight and Turn 1 tell the start-and-finish story; the mid-corner stands tell the overtaking story. Neither is objectively better, but they're different trips, and most fans buying blind end up at the Main Grandstand by default because it sounds premium, when a Turn 2 or Turn 3 ticket at less than half the price often delivers more actual racing.

The bigger shift this year is what's no longer available at all. General Admission selling out before the weekend arrived is new for Qatar specifically — this has been a race fans could show up to decide on late, and that's no longer true. Anyone weighing this trip now needs to treat ticket-buying as a real, time-pressured decision rather than something to sort out once flights are booked, which is a meaningfully different planning problem than this race has presented in its short history on the calendar.`;

const insiderTips = [
  "A North Grandstand ticket doubles as entry to the Lusail Hill general admission zone outside Turn 1 — worth knowing since GA on its own is no longer purchasable.",
  "Main Grandstand's roof only shades the back half of the stand and only works because it faces north — an east- or south-facing seat at another circuit wouldn't get the same benefit, so don't assume grandstand seating elsewhere at Lusail shades the same way.",
  "North Grandstand has no assigned seating — arrive at gate-open, not race-start, if you want a front-row spot within the stand.",
];

const whatToAvoid = "Don't assume General Admission will still be biddable at the gate the way it has been at some other circuits — Lusail's GA sold out entirely on the official platform ahead of the weekend, so anyone without a ticket already is looking at resale markup, not a walk-up option. Don't book Main Grandstand purely for the podium view if you actually want to watch overtaking — the front straight shows start-finish drama well but very little of the corner-to-corner racing that decides most of the result.";

const practicalInfo = {
  hours: "Gates open several hours before first session each day; exact times published closer to the race weekend",
  costRange: "QAR 600–2,000 (approx. US$165–548) for a 3-day ticket, tier-dependent — GA sold out",
  bookingMethod: "Official tickets via tickets.formula1.com or the Lusail International Circuit ticket portal. Most tiers still open as of Sep 2026 except General Admission and one Main Grandstand section, both sold out.",
  website: "https://www.formula1.com/en/racing/2026/qatar",
  howToBook: "",
};

const gettingThere = "Lusail International Circuit sits on Doha's northern outskirts. Take the Doha Metro Red Line to Lusail Metro Station, then the free ticket-holder shuttle — shuttles run from the station's east side starting roughly 30 minutes before gates open, with the ride taking 20-40 minutes depending on traffic.";

const [inserted] = await db.insert(experiences).values({
  title: "Where to Sit — Grandstand & Ticket Guide",
  subtitle: "Main, North, mid-corner, and why GA is already gone for 2026",
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
  editorialNote: "Sources: gpdestinations.com (official promoter 3-day price table), marhaba.qa + qatar-tribune.com (sellout corroboration), formula1.com (session times, verified directly 12 Sep 2026). No Google Maps rating — this experience is about ticket-buying strategy, not a rateable single venue.",
}).returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

await db.insert(sportingEventExperiences)
  .values({ experienceId: inserted.id, sportingEventId: QATAR_GP_EVENT_ID })
  .onConflictDoNothing();

console.log("Seeded:", inserted);

await client.end();

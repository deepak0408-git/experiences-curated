// Qatar GP 2026 — Experience 6/21: Inside Lusail Circuit (venue orientation)

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DOHA_ID = "4e53af71-7526-4d55-bf81-5d57d6f22136";
const QATAR_GP_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";
const slug = "qatar-gp-inside-lusail-circuit-" + Date.now().toString(36);

const bodyContent = `Lusail International Circuit is younger than it looks on TV. It opened in September 2004, built in under a year by around 1,000 workers for roughly US$58 million, and spent its first two decades as a motorcycle venue — it hosted MotoGP's first-ever night race back in 2008, years before Formula 1 arrived for its debut Qatar Grand Prix in 2021.

The track itself runs 5.419km with 16 turns and a 1.068km main straight, fast and flowing by modern F1 standards. Lando Norris holds the outright lap record, a 1:22.384 set in 2024. One design detail is easy to miss on a broadcast but obvious in person: the track is bordered by artificial grass rather than real turf, a practical fix to stop desert sand blowing onto the racing line.

The venue most fans know today is largely a 2023 rebuild, done ahead of that year's race without touching the actual track layout. Capacity jumped from the original 8,000 to over 52,000, spectator parking expanded to 15,000 spaces, and a new pit building went in with 50 individual pit boxes — more than any other circuit on the F1 calendar. That new building also houses the Paddock Club, positioned directly above the garages.

The rebuild extended well past racing infrastructure: an ultramodern media centre, a new medical centre, three access tunnels to improve crowd flow around the site, and roughly 180,000 square metres of landscaping — over 2,500 trees and nearly 27,000 shrubs planted around a circuit that sits, unmistakably, in the desert. Eighty-five screens are placed around the venue, so no matter where you're standing, there's a screen nearby covering whatever your seat can't see directly. Lusail Hill, the elevated public viewing area at Turn 1, was also new with this rebuild — purpose-built rather than a leftover space pressed into service.

Lusail isn't only a race-week venue — outside the Formula 1 calendar, the circuit runs its own public track-day programme, open to visitors with no racing licence required. Karting sessions run Wednesday to Saturday evenings (6-11pm), 12 minutes per session on a roughly 900m kart layout, at QAR 125 including helmet. Cars Track Day and Motorbikes Track Day both put drivers and riders — novice through experienced — on the full circuit for 3-hour sessions, run as either private (smaller group, more personalised) or public (mixed skill levels) format, at QAR 1,000 per car (plus QAR 250 per passenger) or QAR 1,000 per bike, with expert supervision throughout. Mixed Training Days take a different angle entirely: a 3-hour open-track window (6-9pm) for cycling, walking, or running the 5.38km lap, open to all fitness levels. All four programmes book through the circuit's own member portal (members.lcsc.qa) with advance registration required — none of it is walk-up.`;

const whyItsSpecial = `Most fans arrive at Lusail assuming it's just another purpose-built modern circuit, interchangeable with a dozen others on the calendar. It isn't. This is a track that ran real motorsport history — MotoGP's first night race — nearly two decades before F1 ever showed up, and the 2023 rebuild that turned it into today's 52,000-capacity venue happened without touching the actual racing layout that already had that history attached to it.

The scale of the infrastructure is also genuinely unusual: the largest pit lane building on the calendar, 85 screens, three dedicated access tunnels specifically engineered to move tens of thousands of people through a site that started life a fraction of its current size. Knowing that context changes how the venue reads in person — it's not scenery, it's a circuit that was deliberately over-built to handle a bigger future than it had when it opened.`;

const insiderTips = [
  "With 85 screens placed throughout the venue, you're never actually blind to the race even from a partial-sightline seat — worth knowing before paying a premium purely to avoid a screen-reliant view.",
  "The circuit's three dedicated access tunnels exist specifically to ease crowd flow around the 2023-expanded capacity — using them instead of the main gate routes can meaningfully cut your walk time between the Fan Zone, grandstands, and metro shuttle pickup.",
];

const whatToAvoid = "Don't assume you can book a track-day slot on short notice — advance registration through members.lcsc.qa is mandatory, and on-site signups aren't accepted; Mixed Training Days explicitly warn that walk-up registration delays your track access. Don't expect a refund if a session is cancelled for weather or safety — Lusail's policy issues a future-use voucher only, and bookings can't be exchanged, rescheduled, transferred, or refunded. Don't bring younger kids expecting to kart together — Karting sets a hard minimum of 13 years and 153cm, a 120kg weight cap, and requires a guardian present for anyone under 18.";

const practicalInfo = {
  hours: "Gates open several hours before first session each race day. 2026 session times (local/Doha, AST): Practice 1 Fri 4:30-5:30pm, Practice 2 Fri 8-9pm, Practice 3 Sat 5:30-6:30pm, Qualifying Sat 9-10pm, Race Sun 7pm.",
  bookingMethod: "Race-weekend access is included with any ticket tier. The circuit's own track-day programmes (Karting, Cars Track Day, Motorbikes Track Day, Mixed Training Days) run separately from race weekend and require advance registration via members.lcsc.qa.",
  website: "https://www.lcsc.qa/",
  howToBook: "",
};

const gettingThere = "Access via the Doha Metro Red Line to Lusail Metro Station, then the free ticket-holder shuttle from the station's east side.";

const [inserted] = await db.insert(experiences).values({
  title: "Inside Lusail Circuit",
  subtitle: "A 2004 motorcycle track rebuilt into F1's largest pit lane building",
  slug,
  experienceType: "sports_venue",
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
  editorialNote: "Sources: en.wikipedia.org/wiki/Lusail_International_Circuit (track facts, history, lap record), thepeninsulaqatar.com (2023 remodel detail). Venue orientation piece, not a ticket/grandstand guide — distinct from experience 1 (ticket guide) and experiences 4/5 (individual grandstands).",
}).returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

await db.insert(sportingEventExperiences)
  .values({ experienceId: inserted.id, sportingEventId: QATAR_GP_EVENT_ID })
  .onConflictDoNothing();

console.log("Seeded:", inserted);

await client.end();

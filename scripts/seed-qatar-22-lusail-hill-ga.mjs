// Qatar GP 2026 — Experience 22/22: General Admission — Lusail Hill
// Added after the original 21-item locked list, per founder confirmation
// (13 Sep 2026) that no standalone GA/Hill experience existed — only the
// general ticket-tier guide (#1) and general venue-orientation piece (#6)
// touched on it. Researched via experience-researcher skill.
//
// Sources: tickets.formula1.com (official F1 ticket store, confirmed via
// curl with a realistic browser UA — confirmed EUR currency, confirmed the
// standard GA/Lusail Hill product is delisted/sold out as of 13 Sep 2026,
// confirmed a SEPARATE "Lusail Hill" hospitality-club product exists under
// the same name at a much higher price — do not confuse the two in future
// updates); oversteer48.com/lusail-hill-general-admission-qatar-gp
// (firsthand fan report — walking distance, arrival timing, blanket/insect
// tip, night temperature drop); WebSearch cross-referencing (Turn 1
// location, sellout timing). QAR 600 pre-sellout price appears on multiple
// secondary/reseller sites but could not be traced to a primary source
// before delisting — flagged as unconfirmed in practicalInfo.costRange
// only, never stated as fact in body copy, per experience-researcher §2d.
// No planner_ticket_tier_cost row exists yet for this event (Tickets
// category not yet researched), so there was no seeded data to ground
// pricing in.
//
// No hero image — a dedicated search (Wikimedia Commons, Unsplash, Pexels)
// turned up only grandstand photos, unrelated-circuit night shots, and
// daytime F1 crowd photos from other venues. No genuine grass-hill/GA-
// embankment image was found licensed. heroImageUrl left null; curator can
// supply one later.
//
// No Google Maps rating — this experience is about a specific GA viewing
// zone/ticket product, not an independently addressable Google-listed
// place. The circuit's own overall rating (4.6, 2708 reviews) doesn't
// represent this specific product and would be misleading here.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DOHA_ID = "4e53af71-7526-4d55-bf81-5d57d6f22136";
const QATAR_GP_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";
const slug = "qatar-gp-lusail-hill-general-admission-" + Date.now().toString(36);

const bodyContent = `The gravel trap in front of Turn 1 is enormous, and the cheap seats sit right on top of the hill above it. Walk out from the Fan Zone, find a slope on the outside of Turn 1, and you get a sightline that runs almost the length of the front straight. On a clear night you can trace the cars from the grid all the way past Turn 16 in the distance. That's a better view than most of Lusail's actual grandstands offer, gravel trap or not.

General Admission (Lusail Hill) is the cheapest ticket sold for this race, and it buys three days on that hill: Friday practice through Sunday's race. No reserved seat, no shade structure. Grass banking and whatever spot you claim first. Qatar races at night, so the daytime desert heat people worry about mostly isn't the issue. The sun's dropping by the time the support races start, and by the small hours it can get properly cool. Pack a hoodie before sunscreen. Folding chairs aren't allowed on the hill, but a blanket earns its keep against both the evening chill and the insects that show up once the lights come on.

There's no assigned entry point for a specific spot, so the hill runs first-come all weekend. The good ground directly opposite the pit straight, high enough to see over the fence and the gravel trap, fills up fast on race day. Regulars get through the gates about half an hour before they open on Sunday. Show up an hour or two later and you're watching from further back.

The ticket covers more than the hill: Fan Zone, food court, post-race concerts, the same access grandstand holders get, plus free parking and a shuttle to the metro. That shuttle matters before you commit to GA over a seat, because the drop-off point sits on the opposite side of the circuit from the hill. Budget a genuine 35-minute walk from the bus stop, which is a real ask after a long day standing.`;

const whyItsSpecial = `Every grandstand at Lusail sells you a fixed seat and a fixed angle. Lusail Hill sells you the run of Turn 1 instead — the only place on the property where a fan can trade a few hours in line for a sightline that actually beats paid seating. The elevation does the work reserved seats can't: it clears the fence and the gravel trap and opens up a view down the straight that most ticketed grandstands don't get. It's also the one part of the ticket structure that doesn't punish a fan for booking late or on a budget — the cheapest product at the track happens to double as one of the better vantage points on it, which isn't true at most circuits, where cheap and good are opposites. The tradeoff is real: no seat, no shade, and a long walk from the shuttle. But for a fan who'd rather stand somewhere great than sit somewhere average, that's not really a tradeoff at all.`;

const insiderTips = [
  "The shuttle drop-off point sits on the far side of the circuit from Lusail Hill — budget the 35-minute walk into your arrival plan, especially if you're arriving close to gates-open.",
  "Because it's a night race, the real cold-weather risk is after midnight, not the daytime heat — a hoodie or light jacket is more useful gear than sunscreen for this specific ticket.",
];

const whatToAvoid = "Don't assume grandstand seating is automatically the better view — Lusail Hill's elevation clears the Turn 1 fence and gravel trap for a sightline down the front straight that several of the circuit's paid grandstands can't match. Don't bring a folding chair expecting to use it — they're not permitted on the hill, and turning up without a blanket means sitting directly on grass that gets genuinely buggy once the floodlights come on.";

const practicalInfo = {
  hours: "Gates open ahead of each day's on-track session, Fri 27 – Sun 29 Nov 2026. 2026 session times (local/Doha, AST): Practice 1 Fri 4:30-5:30pm, Practice 2 Fri 8-9pm, Practice 3 Sat 5:30-6:30pm, Qualifying Sat 9-10pm, Race Sun 7pm.",
  costRange: "General Admission (Lusail Hill) sold out on the official F1 ticket store by late Aug 2026 — last listed around QAR 600 for the 3-day pass on secondary sources, unconfirmed against the official site directly. The official site no longer lists a standard GA product, only a separately named, much more expensive 'Lusail Hill' hospitality club product — do not confuse the two.",
  bookingMethod: "Sold via the official F1 ticket store (tickets.formula1.com) as a 3-day Friday–Sunday pass — no single-day GA option exists. It sold out on the official platform by late August 2026 for the 2026 race; check the official site directly for any releases or resale before assuming it's unavailable.",
  website: "https://tickets.formula1.com/en/f1-56257-qatar",
  howToBook: "",
};

const gettingThere = "Free shuttle from Lusail Metro Station (Doha Metro Red Line) to the circuit — budget a 35-minute walk from the shuttle drop-off point to reach the hill itself, since it sits on the opposite side of the circuit.";

const [inserted] = await db.insert(experiences).values({
  title: "General Admission — Lusail Hill",
  subtitle: "The cheapest ticket at the track — and one of its best views of Turn 1.",
  slug,
  experienceType: "fan_experience",
  status: "in_review",
  destinationId: DOHA_ID,
  address: "Lusail International Circuit, Lusail, Qatar",
  bodyContent,
  whyItsSpecial,
  practicalInfo,
  gettingThere,
  insiderTips,
  whatToAvoid,
  sport: ["formula_one"],
  moodTags: ["budget-friendly", "atmosphere", "fan-culture"],
  interestCategories: ["sport"],
  pace: "active",
  physicalIntensity: 3,
  budgetTier: "budget",
  budgetCurrency: "EUR",
  bestSeasons: ["nov"],
  advanceBookingRequired: true,
  availability: "event_only",
  curationTier: "editorial",
  lastVerifiedDate: new Date().toISOString().slice(0, 10),
  editorialNote: "Researched 13 Sep 2026. Sources: tickets.formula1.com (official F1 ticket store — confirmed EUR currency, confirmed standard GA product delisted/sold out, confirmed a separate higher-priced 'Lusail Hill' hospitality-club product exists under the same name), oversteer48.com/lusail-hill-general-admission-qatar-gp (firsthand fan report), WebSearch cross-referencing. QAR 600 pre-sellout price is unconfirmed against a primary source — flagged in costRange only, never stated as fact in body copy. No seeded planner_ticket_tier_cost row exists yet for this event. No hero image — genuine grass-hill/GA image search came up empty on Wikimedia/Unsplash/Pexels.",
}).returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

await db.insert(sportingEventExperiences)
  .values({ experienceId: inserted.id, sportingEventId: QATAR_GP_EVENT_ID, packRank: null })
  .onConflictDoNothing();

console.log("Seeded:", inserted);

await client.end();

// Hero image needed — source a South Bank / Borough Market shot and upload to R2
// Key: "experiences/hero/london-day-trip.jpg"
// Until then, heroImageUrl is left null.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEvents } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Look up Wimbledon 2026 event ID
const [existing] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, "wimbledon-2026"));
const wimbledonEventId = existing?.id;

if (!wimbledonEventId) {
  console.error("Could not find or create Wimbledon 2026 event");
  process.exit(1);
}

const LONDON_DESTINATION_ID = "75758888-28b9-4e09-82ba-f05681ecc904";
const slug = "london-rest-day-" + Date.now().toString(36);

await db.insert(experiences).values({
  slug,
  destinationId: LONDON_DESTINATION_ID,
  sportingEventId: wimbledonEventId,
  title: "The Rest Day: A Day in London Away from the Courts",
  subtitle: "South Bank to Borough Market to South Kensington — a Wimbledon rest day that uses the city properly",
  experienceType: "day_trip",
  budgetTier: "moderate",
  availability: "event_adjacent",
  curationTier: "editorial",
  status: "in_review",
  neighborhood: "Central London",
  moodTags: ["exploratory", "cultural", "relaxed", "walkable"],
  interestCategories: ["day trip", "culture", "food markets", "walking", "museums"],
  lastVerifiedDate: "2026-04-28",
  editorialNote: "Rest-day itinerary for Wimbledon visitors. South Bank route is the most reliable shape — continuous, interesting, good food anchor at Borough Market. V&A or Hyde Park in the afternoon. 21-min train each way makes it genuinely low-stress.",
  specScoreSpecificity: 5,
  specScoreProvenance: 4,
  specScoreExceptionalism: 3,
  specScoreCurrency: 5,
  bodyContent: `The SWR train from Wimbledon to London Waterloo takes 21 minutes. That fact changes the whole shape of a rest day — it's close enough that you're not committing to a big expedition, and far enough that you actually arrive somewhere different.

You don't need to do all of London in a day, and trying is a category error. Pick a route, go deep on it, eat somewhere worthwhile, and come back feeling like you used the time honestly.

**The South Bank route (most reliable)**

Walk east from Waterloo along the South Bank. River on your left the whole way, about 2km to Borough Market. The walk takes 25-30 minutes at a relaxed pace, and the detours along the way are good: Tate Modern is free and the Turbine Hall is always doing something interesting; the Globe is worth a look from outside even if you're not doing a tour; Bankside generally has the quality of a city that remembers it was once a different kind of place.

The South Bank in the morning, before the tourist wave settles in around midday, is one of the better walks in London. Get out of Waterloo by 9:30am if you want the river path largely to yourself.

Borough Market is open Tuesday through Saturday. It's a working market with proper specialist traders, not a food court — the fishmongers, cheese vendors, and charcuterie stalls are the real thing. Lunch from the stalls is easy and doesn't require much planning: a sandwich from Flour Power City Bakery, cheese from Neal's Yard, fruit from the market itself. If you want to sit down, Elliot's on Stoney Street grew out of the market and still uses it as a larder. Brindisa, the Spanish grocery and tapas place on the market's southern edge, is good for a quick lunch without a long queue.

After Borough Market, cross London Bridge on foot — two minutes, and the view downstream toward Tower Bridge is worth stopping for.

**Moving west in the afternoon**

From London Bridge, take the Tube (Northern line north to Leicester Square, then Piccadilly line west to South Kensington — about 30 minutes total). Or walk if the weather is good: it's around 5km through the City and along the Embankment, and it's a genuinely good walk with the river on your right.

At South Kensington, the choice splits cleanly.

The V&A Museum is free, and larger than it's possible to do properly in a single afternoon. Don't try. The Medieval and Renaissance galleries in the north section of the building are worth at least an hour. The cafe has a courtyard garden that's one of the quieter spots in that part of the city — good for 20 minutes with a coffee before you move on.

If museums aren't right for a rest day, Kensington Gardens is immediately across the road from the V&A. The Long Water, the Serpentine Gallery (also free), and the path through to Hyde Park proper takes about an hour at an unhurried pace.

**Getting back**

From South Kensington, the District line to Wimbledon is direct and runs frequently. About 30 minutes. Alternatively, walk back to the South Bank and take the SWR from Waterloo — same 21 minutes as the morning.

If you want dinner in Wimbledon Village rather than central London, aim to be back by 6:30pm. That gives you enough time to walk up to The Crooked Billet on the Common, or to have made a booking at The Light House.

**A shorter version**

If a full city day sounds like more than you want: Wimbledon Common has 460 hectares and you can walk for two hours without retracing your steps. The Isabella Plantation in Richmond Park (20-minute bus ride — bus 493 toward Kingston) is open year-round and has a woodland garden that's worth the detour in summer. Neither requires a plan or a reservation, and both return you to SW19 feeling like you've actually been somewhere.`,

  whyItsSpecial: `The South Bank route works as a rest-day structure because it's continuous. You're walking in one direction, along one river, and the city presents itself without demanding decisions every five minutes. Borough Market is the right anchor because the food is genuinely good — not just convenient — and it gives you a reason to stop that isn't a famous sight requiring a timed ticket.

The 21-minute train in both directions is what makes the whole thing work for Wimbledon visitors specifically. It removes the anxiety about getting back, which means you can actually stay in the afternoon instead of watching the time. This is the difference between a day that uses the city and one that samples it nervously.

London during Wimbledon fortnight has a particular quality: the weather is often good enough that walking is genuinely pleasant, the city is busy but not crushed, and you're arriving from a corner of it that most visitors don't see. The South Bank to Borough Market walk gives you a version of London that's not in the obvious tourist orbit, even if the individual landmarks are recognisable.`,
});

console.log("Seeded: The Rest Day: A Day in London Away from the Courts");
await client.end();

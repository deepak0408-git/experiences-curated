import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-weather-mud24hlf";

const newBodyContent = `Mid-April in Shanghai runs mild and genuinely spring-like — averages around 16-17°C, climbing toward the low-20s by month's end, with daytime highs regularly hitting 20°C or warmer. Rain is the detail that actually matters for planning: roughly 90mm falls across the month over 10-12 rainy days, usually light and short rather than a dramatic downpour, but frequent enough that a wet session is a real possibility across a three-day weekend. Humidity sits around 75%, enough to make a mild temperature feel heavier than the number suggests, and skies are overcast or cloudy more often than not.

Pack for that mix rather than a single average. A packable rain shell beats a full umbrella — easier to manage in a grandstand crowd, and April's rain is rarely heavy enough to need more. Bring layers: a light jacket or fleece for cooler mornings and evenings, with something breathable underneath for warmer, humid afternoons. Closed, comfortable walking shoes matter more than anything else — you're on your feet across a full session day, possibly on wet concrete. Sunglasses and a light hat are still worth packing even with the cloud cover, since Shanghai's spring sun does break through, and a reusable water bottle helps with the humidity. If your seat is in an uncovered grandstand or general admission, treat the rain layer as essential rather than optional.

Grandstand A, H, and K are covered structures; Grandstand B and general admission areas offer no reliable shelter. Pack based on where you're actually sitting, not just the citywide forecast.`;

const newWhyItsSpecial = `A lot of race-weekend weather advice is generic — "pack layers," "bring an umbrella" — the kind of thing that applies equally to any city on any continent. Shanghai's April climate has real, specific shape to it: a genuine spring warm-up, a rain pattern frequent enough to plan around but rarely severe, and a humidity level that changes how a mild temperature actually feels on your skin. Knowing that shape, paired with a packing list built for it rather than a generic one, is what lets you pack once, correctly, rather than over-pack for every possibility or under-pack and regret it on a damp Saturday qualifying session.`;

await db.update(experiences)
  .set({
    bodyContent: newBodyContent,
    whyItsSpecial: newWhyItsSpecial,
  })
  .where(eq(experiences.slug, SLUG));

console.log("Updated body (shortened weather data, added real packing section) and whyItsSpecial.");

await client.end();

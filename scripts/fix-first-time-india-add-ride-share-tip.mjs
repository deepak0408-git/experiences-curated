import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "first-time-india-mued2mc4";

const OLD = `Traffic in Indian cities peaks hard around 9am and again from roughly 5-8pm on weekdays, and a short-looking distance on the map can easily take two or three times longer than the estimated drive time during those windows. Build real buffer into any plan that involves getting somewhere for a fixed time, a session start, a dinner reservation, a flight, especially if it crosses a city centre during peak hours. Ride-share and auto-rickshaw drivers generally know the real-time situation better than the app does, so when in doubt, ask before you commit to a route.`;

const NEW = `Traffic in Indian cities peaks hard around 9am and again from roughly 5-8pm on weekdays, and a short-looking distance on the map can easily take two or three times longer than the estimated drive time during those windows. Build real buffer into any plan that involves getting somewhere for a fixed time, a session start, a dinner reservation, a flight, especially if it crosses a city centre during peak hours. Ride-share and auto-rickshaw drivers generally know the real-time situation better than the app does, so when in doubt, ask before you commit to a route.

For getting around, book through Uber or Ola rather than flagging a taxi on the street. Both apps work the same way they do elsewhere, show the fare upfront, track the route, and remove the haggling and language-barrier friction that comes with hailing a cab directly, and they're the default way most locals in these cities get around too, not just a tourist workaround.`;

const [row] = await db.select({ bodyContent: experiences.bodyContent }).from(experiences).where(eq(experiences.slug, SLUG));

if (!row.bodyContent.includes(OLD)) {
  console.error("Target paragraph not found verbatim — aborting.");
  process.exit(1);
}

const updatedBody = row.bodyContent.replace(OLD, NEW);

const [result] = await db.update(experiences)
  .set({ bodyContent: updatedBody })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
console.log("New length:", updatedBody.length, "chars");
process.exit(0);

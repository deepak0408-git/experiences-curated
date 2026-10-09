import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "first-time-india-mued2mc4";

const OLD_CASH_PARA = `Carry Indian Rupees, not foreign currency, for anything beyond a hotel bill. Card acceptance has grown a lot in India's cities, but plenty of transport, small restaurants, and street food stalls are cash-only, so keep a mix of cash, including small notes, on hand, and exchange money only at authorized outlets rather than informal street changers.`;

const NEW_CASH_PARA = `Carry Indian Rupees, not foreign currency, for anything beyond a hotel bill. Card acceptance has grown a lot in India's cities, but plenty of transport, small restaurants, and street food stalls are cash-only, so keep a mix of cash, including small notes, on hand, and exchange money only at authorized outlets rather than informal street changers. Tap-to-pay with Google Pay or Apple Pay works at NFC terminals in hotels, malls, and larger chain stores, and Apple Pay has recently begun supporting select international cards in India, but most everyday Indian transactions, street stalls, auto-rickshaws, small local restaurants, run on UPI QR-code payments, a system foreign cards and wallets generally can't plug into, so don't expect tap-to-pay to work as universally as it might at home.`;

const NEW_MAPS_PARA = `Google Maps works well enough to rely on day to day, but go in with realistic expectations rather than blind trust. Street-level accuracy in India can be patchy, directions occasionally route through a market, a closed lane, or a path that technically exists but isn't meant for traffic, and the app's ETAs often can't keep pace with how fast a city's traffic situation changes hour to hour. If a route looks obviously wrong once you're on the ground, trust what you're seeing over the app, and don't be shy about asking someone on the street. Directions from locals aren't always precise either, but the combination of a rough verbal pointer and a friendly willingness to help usually gets you there, and it's a completely normal, expected way to navigate here rather than a last resort.

Traffic in Indian cities peaks hard around 9am and again from roughly 5-8pm on weekdays, and a short-looking distance on the map can easily take two or three times longer than the estimated drive time during those windows. Build real buffer into any plan that involves getting somewhere for a fixed time, a session start, a dinner reservation, a flight, especially if it crosses a city centre during peak hours. Ride-share and auto-rickshaw drivers generally know the real-time situation better than the app does, so when in doubt, ask before you commit to a route.`;

const NEW_HOSPITALITY_PARA = `One thing that surprises a lot of first-time visitors is just how far Indian hospitality extends to strangers. Offers of help, a chai, directions, a genuine effort to make sure you're not lost or stuck, are common and usually sincere rather than a sales pitch, particularly outside the most touristed areas. It's one of the more reliable throughlines of a first trip here: people tend to go out of their way for a visitor who seems a little lost, and accepting that help is generally the right call rather than something to be wary of.`;

const [row] = await db.select({ bodyContent: experiences.bodyContent }).from(experiences).where(eq(experiences.slug, SLUG));

if (!row.bodyContent.includes(OLD_CASH_PARA)) {
  console.error("Cash paragraph not found verbatim — aborting.");
  process.exit(1);
}

const updatedBody = row.bodyContent.replace(OLD_CASH_PARA, NEW_CASH_PARA) + `\n\n${NEW_MAPS_PARA}\n\n${NEW_HOSPITALITY_PARA}`;

const [result] = await db.update(experiences)
  .set({ bodyContent: updatedBody, practicalInfo: null })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, status: experiences.status, practicalInfo: experiences.practicalInfo });

console.log("Updated:", result);
console.log("\n--- New body ---\n");
console.log(updatedBody);
console.log("\nLength:", updatedBody.length, "chars");
process.exit(0);

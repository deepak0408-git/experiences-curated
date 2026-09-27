import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "first-time-india-" + Date.now().toString(36);

const bodyContent = `A handful of practical basics make the difference between a smooth first trip to India and a stressful one, and none of them are complicated once you know them going in.

Get a local SIM or eSIM as soon as you land. Airtel and Jio both offer wide coverage and fast data, and a 28-day tourist plan with generous data costs only a few dollars, bought at the airport with your passport or set up as an eSIM before you even leave home if your phone supports it. Reliable data matters more here than in most countries, for ride-share apps, translation, and simply staying oriented across three unfamiliar cities.

Carry Indian Rupees, not foreign currency, for anything beyond a hotel bill. Card acceptance has grown a lot in India's cities, but plenty of transport, small restaurants, and street food stalls are cash-only, so keep a mix of cash, including small notes, on hand, and exchange money only at authorized outlets rather than informal street changers.

Tap water isn't safe to drink anywhere in this pack's three cities. Stick to sealed bottled water with an intact cap, use it to brush your teeth too, and be cautious with ice unless you know where it came from. This single habit prevents most of the stomach trouble that catches out first-time visitors.

At religious sites, temples, mosques, the ashram, dress modestly and expect to remove your shoes before entering. Use your right hand for handing over money or touching someone; the left hand carries a cultural association with hygiene that makes it best avoided for these interactions. In markets, bargaining is genuinely expected and normal, kept friendly rather than aggressive, but fixed-price stores and restaurants don't expect it.

Tipping is straightforward: roughly ₹200-500 per day for a driver depending on trip length, ₹300-500 for a guide per session, ₹50-100 for hotel porters, and 10% at restaurants if a service charge isn't already added to the bill, worth checking before tipping twice.`;

const whyItsSpecial = `None of this is exotic or difficult, but it's exactly the kind of practical knowledge that a first-time visitor to India doesn't have and won't think to look up until it's already a minor problem, a bad stomach from tap water, an awkward moment over which hand to use, a cash-only stall you can't pay at. Getting these basics right before you land means your attention across three cities and a five-day Test can go toward the cricket and the country, not toward recovering from small, entirely avoidable mistakes.`;

const insiderTips = [
  "Set up an eSIM before you leave home if your phone supports it — you'll have working data the moment you land, rather than navigating an unfamiliar airport to find a SIM counter first.",
  "Keep a stash of small-denomination rupee notes specifically for street food, auto-rickshaws, and small vendors — these transactions are often cash-only and change for large notes isn't always readily available.",
];

const whatToAvoid = `Don't assume card payments will work everywhere just because they're widely accepted in your hotel — plenty of everyday transactions across all three cities in this pack are cash-only, and getting caught without rupees at a street food stall or local auto-rickshaw is a common, avoidable first-timer mistake. Don't use your left hand to hand over money, food, or touch someone in greeting — it's a genuine cultural misstep, not a minor one, even though it's an easy habit to forget without thinking about it.`;

const gettingThere = `This is a general practical reference, not a bookable location — see this pack's city-specific experiences for transit and logistics detail.`;

const practicalInfo = {
  bookingMethod: "Not applicable — this is a practical reference, not a bookable experience.",
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "First Time in India — A Practical Primer",
      subtitle: "SIM cards, cash vs. card, tap water, and the small etiquette details worth knowing before you land.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: null,
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Sources: NomadicMatt/StayVista first-timer guides, Wise/IndiaSomeday tipping guides, Lonely Planet India essentials. Planning/reference piece — no venue to rate.",
      sport: ["cricket"],
      moodTags: ["first-timer", "practical", "etiquette"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "INR",
      bestSeasons: ["jan", "feb", "mar"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-23",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences).values({ experienceId: result.id, sportingEventId: EVENT_ID }).onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

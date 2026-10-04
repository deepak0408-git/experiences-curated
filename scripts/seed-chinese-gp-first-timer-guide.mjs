// First-Timer's Guide — Chinese GP 2027. Sources: multiple independent,
// corroborated sources on China's 2026 visa-free policies (30-day unilateral
// list, 240-hour transit exemption) and mobile payment setup (Alipay/WeChat
// Pay international card linking). No formula1shanghai.com cited.
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "998a8774-05ac-4482-ba7a-4ca2a556b963";
const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";
const slug = "chinese-gp-first-timer-guide-" + Date.now().toString(36);

const bodyContent = `A first trip to China for a Grand Prix comes with real logistics that a first trip to a European or North American round doesn't — worth sorting out before you land, not once you're jet-lagged and trying to buy a metro ticket.

Visa requirements depend heavily on your passport, and the rules have genuinely shifted in the past couple of years. As of early 2026, citizens of roughly 50 countries — most of Europe including the UK, plus Japan, South Korea, Australia, New Zealand, Singapore, and several others — can enter China visa-free for stays up to 30 days, requiring only a passport valid for 3+ months and a confirmed onward or return ticket. Notably, as of this writing, US citizens are not on that unilateral list — if you're American, check current requirements directly rather than assuming the same rules apply. Separately, a 240-hour (10-day) visa-free transit policy covers travelers from 57 countries passing through China on the way to a third destination, with real conditions attached (an onward ticket to a genuinely different country, not back where you started). Confirm which policy, if any, applies to your specific passport and itinerary well before booking flights.

Payment in Shanghai runs almost entirely on mobile apps — Alipay and WeChat Pay dominate everywhere from restaurants to taxis to circuit vendors, and cash, while technically still legal tender, is often the slower, less-accepted option in practice. The genuinely good news for 2026 visitors: both apps now let you link an international Visa, Mastercard, or Amex directly, without needing a Chinese bank account or phone number, after a passport-and-selfie verification step. Set this up before you leave home, using your regular App Store — trying to configure it for the first time after landing, on unfamiliar wifi, with jet lag, is a genuinely worse experience. Expect a roughly 3% fee on transactions over ¥200 using a linked foreign card; smaller transactions are typically fee-free.

The Metro is genuinely easy to use once you're set up — signage is bilingual, announcements are in English as well as Mandarin, and Line 11 runs directly to the circuit. The passport registration requirement covered elsewhere in this pack applies at the circuit specifically, separate from general entry-visa requirements — don't confuse the two.`;

const insiderTips = [
  "Set up Alipay or WeChat Pay with your international card before you leave home — the passport-and-selfie verification step is straightforward but takes a few minutes, far better handled with reliable home wifi than at the airport on arrival.",
  "If you're American, don't assume the same visa-free rules apply that a European or Asia-Pacific visitor gets — check current requirements for your specific passport directly, since the unilateral 30-day list explicitly excludes US citizens as of this writing.",
];

const whyItsSpecial = `Most first-timer guides for a Grand Prix city cover things like queue etiquette and local food. This one leads with something more consequential: whether you can even enter the country the way you're assuming, and whether your payment method will actually work once you're there. China's travel rules have moved fast in the past two years — genuinely more visa-free access for many nationalities, a real shift toward mobile-only payment, and specific gaps (like the US citizen exclusion from the unilateral list) that don't map onto what a first-timer might expect from experience in Europe or elsewhere. Getting these two things right before departure is the difference between a smooth arrival and a genuinely stressful first day in an unfamiliar country.`;

const practicalInfo = {
  hours: "N/A — planning guidance, not a ticketed experience",
  costRange: "N/A",
  bookingMethod: "Set up Alipay or WeChat Pay with an international card before departure, via your home App Store. Confirm your specific passport's visa requirements directly with China's official visa resources or your nearest Chinese consulate well ahead of booking flights.",
  website: "https://www.formula1.com/en/racing/2027/china",
};

const gettingThere = "N/A — see the Getting to the Circuit experience in this pack for transit-specific detail.";

const whatToAvoid = "Don't assume your visa-free eligibility matches a friend's or a general online summary without checking your specific passport — China's visa-free rules genuinely vary by nationality, and the unilateral 30-day list explicitly excludes some nationalities, including US citizens, as of this writing. Don't rely on cash as a backup plan without also having mobile payment set up — while cash remains legal tender, many vendors in Shanghai, including at tourist attractions, treat mobile payment as the default and cash as a slower, sometimes awkward fallback.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "First-Timer's Guide — Visa, Payment & Entry Basics",
      subtitle: "Visa-free rules genuinely vary by passport, and payment runs on mobile apps — sort both out before you land.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Citywide",
      address: "N/A — general China/Shanghai travel guidance",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Visa policy figures corroborated across multiple independent sources (china-briefing.com, chinadiscovery.com, travelchinaguide.com — consistent on 30-day unilateral list, 240-hour transit exemption, US exclusion as of early-to-mid 2026). Payment setup detail corroborated across multiple sources (upesim.com, shanghaitourism.org, yellowbirdtour.com — consistent on Alipay/WeChat Pay international card linking, fee structure). Policy details subject to change — flagged as current-as-of-research-date, recommend re-verification closer to April 2027 travel.",
      sport: ["formula_one"],
      moodTags: ["practical"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: new Date().toISOString().slice(0, 10),
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓", result.title, "→", result.id, `(${result.slug})`, result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

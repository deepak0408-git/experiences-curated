import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "883ac422-5318-460f-819a-6ae784ac4b8c";
const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a";
const slug = "mexico-city-gp-ticket-guide-" + Date.now().toString(36);

const bodyContent = `Mexico City sells out faster than almost any race on the F1 calendar. When 2026 tickets went on general sale through the official promoter, they were gone within days. If you're planning this trip, the ticket decision isn't really "which tier" — it's "buy the moment tickets open, then work out the tier."

There are four real tiers to understand. General admission (branded Grada 2A) is the cheapest way in — a 3-day pass ran around $191 USD in recent years, with no assigned seat, standing or lawn access only, and no guarantee of a clear sightline once the popular spots fill up on race morning. Numbered grandstand seats are the mid-tier, and pricing varies enormously by zone: a stand in the Blue Zone (turns 1-3, where the real racing happens) or Foro Sol's stadium stands typically runs from roughly $490 up past $1,700 for a 3-day pass, depending on location and how early you buy. Above that sit two hospitality products: the Champions Club, F1 Experiences' hospitality tier opposite the pits, starting around $5,600 for 3 days all-inclusive, and the F1 Paddock Club itself, the top tier, starting around $9,600 for 3 days with paddock access, pit lane walks, and a suite view over the circuit.

All tickets here are sold as 3-day passes covering practice, qualifying, and the race — Mexico City doesn't typically offer single-day tickets the way some circuits do, so budget for the full weekend rather than trying to pick just race day.

Because this race consistently sells out fast after release, the practical strategy is straightforward: know the release date in advance (announced via the official promoter and Formula 1's own channels, several months ahead), have a payment method ready, and be online the moment sales open. If you miss the official window, resale platforms carry inventory afterward, but at a real markup — general admission resale has been seen as low as the official price but grandstand and box seats can run several times the original figure, and there's no guarantee the listing is genuine until it's in your hands.

One more factor unique to 2026: race weekend (30 October - 1 November) lands directly on top of Mexico City's Día de Muertos parade weekend, one of the biggest tourism draws in the city's calendar independent of F1. That means hotel and flight demand stacks on top of an already sold-out race — book accommodation as early as you buy tickets, not after.`;

const whyItsSpecial = `Most ticket guides are a formality — a list of tiers you skim once and move on. This one isn't, because the actual risk here is real: this race sells out in a single day, and unlike some circuits where late buyers can usually find something reasonable close to the date, Mexico City's demand consistently outstrips supply from the moment tickets go live. Understanding the tiers before release day means you're not making a decision under pressure in the ten minutes before General Admission disappears — you already know whether you're chasing a Blue Zone grandstand or accepting general admission, and you're ready to act the second the page goes live.`;

const insiderTips = [
  "The official release date is typically announced via Formula 1's own channels and the promoter months ahead of the race — set a calendar reminder rather than relying on stumbling across the announcement, since the gap between announcement and sell-out has been as short as a few days.",
  "If you miss the release entirely, check resale platforms specifically for general admission first — it's the tier most likely to still be near face value, while grandstand and hospitality resale prices climb fast once official stock is gone.",
];

const whatToAvoid = `Don't wait to see how the season's championship battle shapes up before buying — by the time storylines are clear in September/October, this race has typically been sold out for months. And don't assume you can buy single-day tickets to save money — Mexico City sells its major tiers as 3-day weekend passes, so budgeting for "just Sunday" isn't usually an option here the way it might be elsewhere.`;

const practicalInfo = {
  hours: "Ticket sales open via the official promoter — announced several months ahead of race week; check mexico.gp or tickets.formula1.com for the confirmed 2026 release date",
  costRange: "General admission ~US$191 (3-day) · Grandstand roughly US$490-US$1,700 (3-day, varies by zone) · Champions Club hospitality from ~US$5,600 (3-day) · F1 Paddock Club from ~US$9,600 (3-day)",
  bookingMethod: "Buy directly at tickets.formula1.com or mexico.gp the moment sales open — this race has sold out within days in recent seasons. Resale platforms (StubHub, Viagogo) carry inventory afterward at a markup, general admission typically closest to face value.",
  website: "https://tickets.formula1.com/en/f1-4861-mexico, https://www.mexico.gp/en/tickets",
};

const gettingThere = "N/A — this is a ticket-strategy guide, not a physical location.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Mexico City GP Ticket Guide",
      subtitle: "This race sells out fast — know your tier before release, not after",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: null,
      address: null,
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo: {
        hours: practicalInfo.hours,
        costRange: practicalInfo.costRange,
        bookingMethod: practicalInfo.bookingMethod,
        website: practicalInfo.website,
      },
      gettingThere: null,
      editorialNote: "Pricing sourced from GPDestinations.com's 2026 budget planner and ticket-buying guide, and Goal.com's 2025/2026 ticket pricing coverage, Sep 2026 — all figures attributed as approximate/recent-season, not officially confirmed 2026 numbers where the source itself flagged them as such. The specific ticketing-platform claim (Ticketmaster Mexico as intermediary) was removed 6 Sep 2026 — sourced from only one third-party site with no independent confirmation, and the founder flagged it as inconsistent with their own knowledge of how F1 Mexico tickets are actually sold. Fast sell-out timing itself is retained (multiple sources agree tickets sold out within days of the 2026 on-sale), but the specific platform name is not asserted.",
      sport: ["formula_one"],
      moodTags: ["practical", "planning-essential"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["oct", "nov"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-06",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #3 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

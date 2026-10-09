import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "fb782de2-bbe6-410f-b466-2a4e628cda10"; // New York
const EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9"; // US Open 2026
const slug = "us-open-luxury-hospitality-" + Date.now().toString(36);

const bodyContent = `Luxury at the US Open runs through the USTA itself rather than a patchwork of third-party operators — the tournament's own "Premier" hospitality program is the sole official channel, run directly out of Arthur Ashe Stadium, with three genuinely different tiers for 2026. The Blue Room sits at the top: a transformed club-level space inside Ashe with an all-inclusive premium bar and a seated, multi-course dining service — the closest thing the tournament offers to a private restaurant with the best seat in the house attached. The Club sits one step down, at the threshold between the stadium and the outer grounds, with a dedicated chef service and a genuine buffet spread rather than plated courses — the pick if staying mobile between matches matters more than a sit-down meal. Luxury Suites, on two newly dedicated suite levels, hold 22-35 seats each and come with a player-appearance inclusion specific to the suite tier. None of the three publish rates online — every package routes through an "inquire" booking flow rather than a listed price, so budget conversations happen directly with the USTA's hospitality team, not a public rate card. On Location, the tournament's official travel partner, also sells combination packages bundling courtside tickets with Club-level access for anyone who'd rather book hospitality and tickets as one transaction.

Getting to the grounds in genuine comfort is its own smaller decision. Multiple licensed car services run fixed-price transfers between JFK or LaGuardia and the grounds or your hotel — sedan rates typically start in the $115-190 range depending on the airport and vehicle class, booked in advance with flight tracking and a real wait-time allowance built in, which matters more at LaGuardia and JFK than it would at a quieter airport given how much short-haul traffic both handle during the tournament's two weeks.

Off the grounds, the honest luxury move isn't a single named restaurant — it's the Honey Deuce itself, which has become a genuine New York institution well beyond the tournament: Grey Goose vodka, lemonade, and Chambord, finished with frozen honeydew melon balls styled to look like miniature tennis balls, over 3 million sold since it was introduced in 2007. Several of the city's actual cocktail bars now run their own seasonal riff on it during tournament fortnight specifically for people who want the drink without a ticket — Bar Fiori's Grand Slam Spritz and Eleven Madison Park's Clemente Bar version both take the same base and dress it up for a genuine cocktail-bar setting rather than a stadium plastic cup. It's a real, low-cost way to bring a piece of the tournament into an otherwise unrelated New York evening.`;

const whyItsSpecial = `A lot of Grand Slam hospitality writing treats luxury as a single escalating ladder — more money gets you a better version of the same thing. The US Open's version is genuinely stranger and more interesting than that, because the same two weeks that sell suite packages through an inquire-only booking flow also built a cocktail into one of the most recognized drink brands in American sport, sold by the millions to people who never set foot on the grounds. That's not a contradiction, it's the whole personality of this tournament in miniature — unapologetically commercial, happy to sell the high end and the low end with equal enthusiasm, and not remotely precious about which one is the "real" US Open experience. The honest answer is both are. A trip that only does the Blue Room misses the drink that's genuinely part of the cultural moment; a trip that only does the Honey Deuce at a downtown bar misses what the tournament's top tier actually looks like from inside Ashe.`;

const insiderTips = [
  "None of the three official hospitality tiers publish pricing — budget for a real conversation with the USTA's hospitality team or On Location rather than expecting a rate card, and start that inquiry well before the tournament given packages sell out ahead of the dates.",
  "Several Manhattan cocktail bars (Bar Fiori, Eleven Madison Park's Clemente Bar) run their own seasonal take on the Honey Deuce during tournament fortnight — a genuine way to get a piece of the US Open's signature drink without a ticket, worth building into a rest-day evening in the city.",
];

const whatToAvoid = `Don't assume Club-level access automatically includes a seated meal the way the Blue Room does — the Club runs a buffet-and-chef-service model built for staying mobile between matches, a genuinely different format from a plated dining room. Don't book a rideshare on arrival expecting a predictable price on a night-session evening — surge pricing around Flushing Meadows after a late match is real and can run well above a pre-booked fixed-rate car service's quote for the same route.`;

const gettingThere = `Pre-booked car service from JFK or LaGuardia directly to the grounds or your hotel; see the Getting There guide for the 7 train alternative.`;

const practicalInfo = {
  costRange: "Packages priced on inquiry only — no published rate card; airport car service transfers run roughly $115-190 one-way depending on airport and vehicle class",
  bookingMethod: "Submit an inquiry directly via hospitality.usopen.org/2026 for Blue Room, Club, or Luxury Suite access — packages sell out well ahead of the tournament and pricing is only shared on request. On Location (onlocationexp.com) sells combined ticket-plus-hospitality packages for anyone who'd rather book both at once. Pre-book airport car service in advance rather than hailing one on arrival, especially for a late-night-session return.",
  website: "https://hospitality.usopen.org, https://onlocationexp.com/tennis/us-open-tennis-tickets",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Official Hospitality, Premium Transit, and the Honey Deuce",
      subtitle: "Three real hospitality tiers inside Ashe, plus the drink that sells 3 million a year",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Flushing Meadows-Corona Park, Queens",
      address: "Arthur Ashe Stadium, USTA Billie Jean King National Tennis Center, Flushing Meadows-Corona Park, Queens, NY 11368",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from usopen.org Premier hospitality announcement, hospitality.usopen.org/2026, Good Morning America (Honey Deuce), Time Out NY (Honey Deuce riffs). Verified 5 Oct 2026. No public pricing found for official hospitality tiers — stated honestly rather than guessed, per sourcing bar.",
      googleMapsReviewCount: null,
      sport: ["tennis"],
      moodTags: ["luxury", "exclusive"],
      interestCategories: ["hospitality"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "luxury",
      budgetCurrency: "USD",
      bestSeasons: ["aug", "sep"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-10-05",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

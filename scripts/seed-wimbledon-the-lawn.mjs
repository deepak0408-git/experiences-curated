import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const LONDON_ID = "75758888-28b9-4e09-82ba-f05681ecc904";
const slug = "wimbledon-the-lawn-hospitality-" + Date.now().toString(36);

const [event] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, "wimbledon-2026"));

const wimbledonEventId = event?.id ?? null;
console.log("✓ Sporting event ID:", wimbledonEventId);

const bodyContent = `The Lawn is the AELTC's own premium hospitality package, which means it's inside the grounds, operated by the Club, and catered by Michel Roux Jr and his daughter Emily Roux. Not a third-party hospitality tent on Church Road — inside the gates, on a covered garden terrace, with a reserved seat on Centre Court or No. 1 Court included.

The format runs from pre-match arrival through to the close of play. You get a champagne reception on arrival, a three-course lunch from the Roux menu, afternoon tea during the match, and access to the private garden terrace throughout the day. The premium tier includes private dining from £1,125 per person; the standard Lawn package starts from £1,025 per person.

Michel Roux Jr opened Le Gavroche in 1991 and held two Michelin stars for over 25 years before closing the restaurant in January 2024. His daughter Emily Roux runs Caractère in Notting Hill, which holds one star. The food here is not tournament catering with a famous name attached — the menus are written by working chefs, and the seasonal produce approach is the same across all their venues.

The practical advantage over buying a debenture and arranging your own lunch is that everything is handled. You arrive, you're shown to your table, your seat on court is confirmed, and you don't need to navigate the Wimbledon food queues or find a reservation in SW19 on a peak tournament day. On a finals weekend, that convenience has a real value that the £1,000+ price point partially reflects.

The Lawn capacity is limited. Packages sell out considerably earlier than match tickets, particularly for week two and finals weekend. The AELTC releases allocations through the official hospitality page and through appointed hospitality agents (Keith Prowse is the primary official agent). Direct booking via the AELTC is possible but limited.

Dress code is smart. The AELTC's guidance for Centre Court hospitality is "elegant" — described as similar to a smart summer wedding. Men in suits, women in dresses or smart separates. The enforcement is light but the expectation is real, and the crowd around you will be dressed accordingly.`;

const whyItsSpecial = `Most Wimbledon hospitality is sold by third-party operators who buy blocks of debenture seats and bundle them with hotel nights, transfers, and catering that has nothing to do with the AELTC. The Lawn is different — it's on the actual grounds, run by the Club, and catered by a team that takes the food seriously.

The Roux connection matters. Michel Roux Jr is not a celebrity name attached to a catering contract. He and Emily run working kitchens, and the seasonal British menu approach they use at Caractère and their other venues is what appears here. Strawberries and cream exist on the menu, but so does a proper three-course lunch that happens to take place thirty metres from Centre Court.

For someone spending a significant amount on the trip overall, this removes the one part of a Wimbledon day that is most likely to disappoint: the food. The grounds have improved their catering substantially over the past decade, but finding a good meal on a peak first-week day still requires either planning or luck. The Lawn removes that variable entirely.`;

const insiderTips = [
  "Book through the AELTC official hospitality page or Keith Prowse (the primary official agent) — third-party operators resell at a premium on top of the face value",
  "Finals weekend and semi-final days sell out by January; first and second week packages remain available longer but still go before March",
  "Smart dress is expected and enforced — treat it as a summer wedding, not a sports event",
];

const practicalInfo = {
  hours: "Arrives from pre-match. Full day through close of play.",
  costRange: "From £1,025 per person (standard). From £1,125 per person (private dining). Includes match seat, all food and drink.",
  bookingMethod: "Official AELTC hospitality page or Keith Prowse (keithprowse.co.uk/the-all-england-lawn-tennis-club). Book before January for finals week; March for general tournament days.",
  reservationsRequired: true,
  website: "https://www.wimbledon.com/en_GB/hospitality/index.html",
  howToBook: "Go to wimbledon.com/hospitality or keithprowse.co.uk and select The Lawn package. Choose your preferred day — finals weekend and semi-final days sell out first. You'll be asked for dress size/preference as part of the booking to ensure the right hospitality wristband. Payments are typically split: deposit on booking, balance 8 weeks before the event.",
};

const gettingThere = `The Lawn is inside the All England Club grounds. Guests use the hospitality entrance on Somerset Road (Gate 5), which is separate from the public queuing entrance on Church Road. A hospitality booking confirmation includes entry credentials. From London, SWR from Waterloo to Wimbledon (21 minutes) is the correct route. A chauffeur car to Gate 5 on Somerset Road avoids the Church Road crowds entirely on peak days.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Lawn at Wimbledon",
      subtitle: "The AELTC's own hospitality terrace — Michel Roux Jr catering, a Centre Court seat, and no queuing for anything",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: LONDON_ID,
      sportingEventId: wimbledonEventId,
      neighborhood: "SW19, Wimbledon",
      address: "All England Lawn Tennis Club, Somerset Road entrance (Gate 5), Wimbledon, London SW19 5AE",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      practicalInfo,
      gettingThere,
      editorialNote: "Pricing and format confirmed via Keith Prowse official Wimbledon hospitality listings and AELTC hospitality page. Michel Roux Jr and Emily Roux connection verified — Le Gavroche closed January 2024; Emily Roux runs Caractère, Notting Hill (one Michelin star). Dress code from official AELTC guidance.",
      moodTags: ["exclusive", "refined", "celebratory"],
      interestCategories: ["sports", "food", "luxury"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "luxury",
      budgetCurrency: "GBP",
      budgetMinCost: "1025",
      budgetMaxCost: "1500",
      bestSeasons: ["jun", "jul"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      comfortLevel: 100,
      lastVerifiedDate: "2026-05-04",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title });

  console.log("\n✓ Experience created:", result.title);
  console.log("  Slug:", result.slug);
  console.log("\n→ http://localhost:3000/curator/review");
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await client.end();
}

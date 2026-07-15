import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "de40345a-9fbc-4b77-9833-dafed8189e40";
const EVENT_ID = "be8e1129-6e53-4e45-a574-931250988806";
const slug = "where-to-stay-sandton-" + Date.now().toString(36);

const bodyContent = `Sandton is where almost every visiting cricket fan bases themselves in Johannesburg, and for good reason — it's the safest, most walkable, and best-connected part of the city, with the Gautrain running straight through it and the Wanderers a short Uber ride away.

The Michelangelo Towers is the standout luxury option, an all-suite five-star property with direct access into Sandton City Mall and Nelson Mandela Square. Rooms come as full apartments with kitchens and separate living areas, which suits a longer stay covering multiple match days. There's a spa, indoor and outdoor pools, and an on-site restaurant, Parc Ferme, running breakfast through dinner. Being connected directly into the mall means you can walk to restaurants and shops without ever really stepping outside.

The Radisson Blu Gautrain Hotel is the practical alternative, positioned right next to Sandton's Gautrain station. It leans business-hotel in character rather than resort-luxury, but the location is genuinely hard to beat if minimizing transit time to the airport, the CBD, or the Wanderers itself is your priority. It's a reliable, well-reviewed choice for a shorter, more matchday-focused stay.

Both hotels sit within Sandton's core, meaning you're a short walk or quick rideshare from Nelson Mandela Square's restaurants, the Sandton Gautrain station, and the wider retail district. Neither requires much thought about after-dark movement, since Sandton's central core is well-lit, busy, and one of the more consistently secure parts of Johannesburg.`;

const whyItsSpecial = `The choice here isn't really about picking between two hugely different experiences, both hotels put you in the same safe, connected core of the city. It's more a question of how long you're staying and what kind of stay you want.

The Michelangelo Towers makes sense if you're in Johannesburg for several days and want the extra space an apartment-style suite gives you, plus the direct mall access if the weather turns. The Radisson Blu is the tighter, more efficient choice if you're focused on getting to the Wanderers and back with minimum friction. Neither is a wrong call.`;

const practicalInfo = {
  hours: "Standard hotel check-in/out",
  costRange: "Michelangelo Towers sits in the luxury five-star range; Radisson Blu Gautrain Hotel in the moderate-to-splurge business-hotel range — confirm current rates directly given September-October demand",
  bookingMethod: "Book directly with each hotel or via Booking.com. Book ahead of the September-October tour window given the scale of a marquee Australia series.",
  website: "michelangelo.co.za / radissonhotels.com",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Where to Stay in Sandton",
      subtitle: "The safe, connected base almost every visiting cricket fan uses — two real options for different lengths of stay",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Sandton",
      address: "Sandton, Johannesburg",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "The Michelangelo Towers connects directly into Sandton City Mall — useful if you want to walk to dinner without stepping outside after dark.",
        "The Radisson Blu Gautrain Hotel's location next to Sandton station makes it the fastest base for airport transfers and Wanderers matchday trips alike.",
      ],
      whatToAvoid: "Don't book accommodation outside Sandton's core to save money without checking the area's walkability and transit access first — Sandton's central safety and connectivity is a real, specific advantage over other parts of Johannesburg.",
      practicalInfo,
      gettingThere: "Both hotels sit within Sandton's core, walkable to Sandton Gautrain station and Nelson Mandela Square, and a short Uber/Bolt ride from the Wanderers Stadium.",
      editorialNote: "Sources: michelangelo.co.za, legacyhotels.co.za, expedia.com (Sandton hotel listings), radissonhotels.com. Verified 14 Jul 2026. Booking.com affiliate candidates flagged, not yet linked: Michelangelo Towers, Radisson Blu Gautrain Hotel.",
      sport: ["cricket"],
      moodTags: ["comfort", "practical", "premium"],
      interestCategories: ["accommodation", "sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "ZAR",
      bestSeasons: ["sep", "oct"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-07-14",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("✗ FAILED:", e.message);
} finally {
  await client.end();
}

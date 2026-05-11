import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const NY_ID = "fb782de2-bbe6-410f-b466-2a4e628cda10";
const slug = "us-open-queens-food-tour-" + Date.now().toString(36);

const [event] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, "us-open-2026"));

const usOpenEventId = event?.id ?? null;
console.log("✓ Sporting event ID:", usOpenEventId);

const bodyContent = `The US Open is in Queens. This is the single biggest thing that separates it from the other three Grand Slams — not the stadium, not the night sessions, not the noise. The food situation around this tournament is genuinely world-class, and most people attending never leave the USTA grounds to find it.

Flushing's Golden Mall is the right starting point. The basement food court at 41-28 Main Street, about 15 minutes on foot from the tournament gates, is one of the most concentrated regional Chinese food environments in the United States. Hand-pulled noodles, Sichuan cold dishes, Shanghainese soup dumplings, Fujianese rice dishes — each stall run by people from a specific part of China cooking what they actually eat. The price point is $8 to $15 per dish. The atmosphere is not designed for tourists.

Jackson Heights is 20 minutes further on the 7 train, under the elevated tracks on Roosevelt Avenue. Within six blocks: Colombian bakeries, Tibetan momos, Nepali thali, Bangladeshi biryani, Mexican tacos from the food carts under the elevated line. The Arepa Lady — Gloria Campos, who sold arepas from a cart on this street for years before her sons opened a brick-and-mortar — is at 77-17 37th Avenue and worth the trip alone.

A private guide turns this from a navigation exercise into something easier. Eat Your World runs private food tours of both Flushing and Jackson Heights; Laura Siciliano-Rosen has guided Jackson Heights since 2008 and knows which stalls are worth visiting and which have turned over. Joe DiStefano (joedistefano.nyc) runs private Flushing tours with a focus on the food court vendors specifically — he's been writing about Queens food for 20 years and the tours reflect that depth.

The practical format: a morning or afternoon tour (3 to 4 hours, 8 to 10 stops, roughly $100 to $150 per person for a private group of 4 to 6) followed by a day session at the tournament. The grounds pass from 11am gives you outer court access for the afternoon; combine with a food tour from 8am and you have a full day without setting foot in a tourist restaurant.

The food inside the USTA grounds is not bad by tournament standards — more diverse than any other Slam because the catering reflects its location. But it charges tournament prices. The Golden Mall charges what the food is worth.`;

const whyItsSpecial = `Every Grand Slam has a food story. Wimbledon has strawberries and cream and a few good SW19 restaurants. Roland-Garros is in Paris. Melbourne has the food village. The US Open is in Queens, and Queens has a food culture that no other tennis tournament venue comes close to matching.

This is not incidental. The neighbourhood around the USTA facility is one of the most diverse food environments in the world — Flushing has one of the largest Chinese populations outside China, Jackson Heights is where South Asian and Latin American New York overlaps under an elevated subway line. These are not food destinations that exist because of the tournament. They predate it by decades and would be worth visiting regardless.

The private tour format works because navigation is genuinely the main obstacle. The Golden Mall basement is not signposted for outsiders. The Roosevelt Avenue food carts have no fixed addresses. A guide who knows which stall makes the best hand-pulled noodles on a given week, and who speaks enough Mandarin to order the unlisted dishes, changes what you get to eat considerably.`;

const insiderTips = [
  "Book Eat Your World (eatyourworld.com) or Joe DiStefano (joedistefano.nyc) at least 2 weeks ahead — both run small group private tours that fill quickly during the Open fortnight",
  "Flushing Golden Mall is cash only at most stalls — bring $50 to $80 per person in small bills",
  "Schedule the food tour for the morning before a day session: grounds passes are valid from 11am, giving you 3 to 4 hours in Queens before heading to the courts",
];

const practicalInfo = {
  hours: "Morning tours typically 8am to 12pm. Afternoon tours available. Day session grounds passes valid from 11am.",
  costRange: "Private food tour: $100 to $150 per person (group of 4 to 6). Eat Your World: contact laura@eatyourworld.com for private tour pricing. Joe DiStefano: joedistefano.nyc/tours. Food costs at the Golden Mall: $8 to $15 per dish.",
  bookingMethod: "Eat Your World: eatyourworld.com or laura@eatyourworld.com. Joe DiStefano: joedistefano.nyc/tours. Both accept private group bookings with 2 weeks minimum notice.",
  reservationsRequired: true,
  website: "https://eatyourworld.com/food-tours/",
  howToBook: "Email laura@eatyourworld.com for a private Flushing or Jackson Heights tour, specifying your preferred date, group size, and start time. Alternatively, book through Joe DiStefano at joedistefano.nyc/tours for a Flushing-focused private tour. Both guides ask about dietary restrictions in advance. If private tours are full, Eat Your World also publishes self-guided tour PDFs for both Flushing and Jackson Heights at eatyourworld.com.",
};

const gettingThere = `Golden Mall: 41-28 Main Street, Flushing, Queens, NY 11355. Take the 7 train to Flushing-Main Street (end of the line), 3-minute walk south on Main Street. From the USTA Billie Jean King National Tennis Center, it's a 15-minute walk or a short cab. Jackson Heights: 7 train to 74th Street–Broadway, Roosevelt Avenue exit. The food carts are directly under the elevated line; the Arepa Lady is at 77-17 37th Avenue, one block south.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "A Morning in Queens Before the Tennis",
      subtitle: "Private food tour through Flushing and Jackson Heights — the food reason the US Open is different from every other Slam",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: NY_ID,
      sportingEventId: usOpenEventId,
      neighborhood: "Flushing / Jackson Heights, Queens",
      address: "41-28 Main Street, Flushing, Queens, NY 11355",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      practicalInfo,
      gettingThere,
      editorialNote: "Eat Your World confirmed via eatyourworld.com — Laura Siciliano-Rosen has run Jackson Heights tours since 2008, private tours available on request. Joe DiStefano confirmed at joedistefano.nyc/tours — 20 years writing about Queens food. Golden Mall at 41-28 Main Street confirmed as the correct address for the basement food court. Arepa Lady address confirmed at 77-17 37th Avenue. Cash-only policy at most Golden Mall stalls confirmed via multiple visitor reports.",
      moodTags: ["adventurous", "authentic", "local"],
      interestCategories: ["food", "culture", "sports"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      budgetMinCost: "100",
      budgetMaxCost: "200",
      bestSeasons: ["aug", "sep"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      comfortLevel: 60,
      lastVerifiedDate: "2026-05-04",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title });

  console.log("\n✓ Experience created:", result.title);
  console.log("  Slug:", result.slug);
  console.log("\n→ http://localhost:3000/curator/review");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "1a968a48-105b-4c30-b092-56e0cdc4a0a2";
const EVENT_ID = "8e4d5aac-f472-48ac-b515-d253487cda50";
const slug = "atp-finals-piedmontese-dining-" + Date.now().toString(36);

const bodyContent = `Turin's food identity runs deeper than any single dish — this is the region where the Slow Food movement was born, built on the philosophy of quality local ingredients and traditional preparation, and that philosophy shows up directly on the plate at the city's best Piedmontese restaurants.

Agnolotti del plin is the dish to know first — small, hand-pinched pasta parcels filled with meat, distinct from a standard tortellino or ravioli by their pinched-closed edges (plin means "pinch" in Piedmontese dialect) and traditionally served with a butter-sage sauce or a roast meat jus. Tajarin, Piedmont's answer to tagliatelle, is the other essential — thin egg pasta, often paired with a local sausage or a simple butter sauce that lets the pasta itself carry the dish.

Three restaurants represent different real ways to eat this cuisine in Turin. Scannabue serves well-made Piedmontese classics, including a genuinely good agnolotti del plin, with attentive service that makes it a solid, unfussy choice. Ristorante Consorzio takes the same dish further — its agnolotti, typically served with butter-sage or meat jus, is considered among the city's best versions. Razzo sits at the more ambitious end: a relaxed dining room with a refined, chef-curated menu that's earned Michelin recognition and one of the most complete wine lists in the city, worth choosing if you want a genuine tasting-menu experience built around the region's ingredients rather than a straightforward trattoria meal.`;

const whyItsSpecial = `What connects all three of these restaurants, despite their different registers, is that none of them are performing "authentic Italian" for a tourist audience — this is what Piedmontese food actually looks like when a kitchen takes the region's own ingredients and techniques seriously, which is exactly what the Slow Food movement (born in this region) set out to protect and promote. For a first-time visitor, the practical value of naming three options rather than one is genuine choice: Scannabue for a reliable, unfussy classic meal, Consorzio for a more considered version of the same dishes, Razzo for a full tasting-menu evening if that's the kind of trip you're on.`;

const insiderTips = [
  "Order agnolotti del plin specifically at whichever restaurant you choose — it's the dish that best represents Piedmontese cooking technique, and the pinched-edge pasta style is unique to this region.",
  "Razzo's wine list is considered one of the most complete in the city — worth asking for a by-the-glass pairing if you're doing the tasting menu, rather than defaulting to a single bottle.",
];

const whatToAvoid = `Don't assume any Turin restaurant claiming "Piedmontese cuisine" is equivalent — the region's food culture runs deep enough that quality varies significantly, and these three are worth seeking out specifically rather than picking the nearest option to your hotel.`;

const practicalInfo = {
  hours: "Standard Italian dinner hours — check individual restaurant schedules, and note many close one day per week.",
  costRange: "Scannabue and Consorzio: moderate, typical Italian sit-down pricing. Razzo: tasting menu, higher end, reflecting its Michelin recognition.",
  bookingMethod: "Reservations recommended for all three, essential for Razzo given its tasting-menu format.",
  howToBook: "",
  website: "",
  reservationsRequired: true,
};

const gettingThere = "All three located within central Turin — check individual addresses when booking.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Piedmontese dining — 3 real ways to eat Turin",
      subtitle: "Agnolotti del plin and tajarin at Scannabue, Consorzio, and Razzo — classic to tasting-menu",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Centro",
      address: "Central Turin, Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Restaurant names and positioning (Scannabue, Consorzio, Razzo) confirmed via tastingtable.com food-culture roundup, cross-checked against italysegreta.com. Dish descriptions (agnolotti del plin, tajarin) confirmed via multiple Piedmontese food-culture sources. Verified 4 Aug 2026.",
      sport: [],
      moodTags: ["local-cuisine", "dining"],
      interestCategories: ["dining"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-04",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓ Created:", result.title, "→", result.id, result.slug, result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

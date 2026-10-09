import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "nagpur-saoji-food-" + Date.now().toString(36);

const bodyContent = `Nagpur has two food identities and neither is subtle. It's the Orange City, supplying much of the country's citrus, and it's also home to Saoji cuisine, widely considered one of the spiciest regional cooking styles in India. You can get both in the same day without much effort.

Baba Saoji is the most practical starting point for Saoji food if you haven't tried it before. It's built its name on loaded plates of mutton rassa (a thin, fiercely spiced curry built on a base of dry-roasted whole spices, not a thickened gravy) served with fresh jowar bhakri, and it draws a large, consistent crowd of both locals and visitors. It's not a delicate meal. Saoji cooking is meant to hit hard, and the reviews reflect a genuinely divisive dish rather than a crowd-pleaser watered down for outsiders, which is exactly why it's worth trying. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=1716231842748941226)

For something gentler and genuinely local in a different way, Saburi Tarri Poha Misal Centre serves tarri poha, flattened rice topped with a thin, spiced curry gravy that's a Nagpur breakfast staple you won't easily find outside Vidarbha. It's a small, unpretentious counter-style place, and the strong rating reflects a dish done simply and well rather than a destination restaurant. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=2933583652642667761)

And for the other half of Nagpur's food identity, Haldiram's, which actually has roots in this part of India before becoming a national chain, is a reliable stop for orange-based sweets and snacks if you want to taste the Orange City claim rather than just hear about it. It's not an intimate discovery, it's a big, well-known name, but the orange barfi and citrus-flavoured namkeen are genuinely representative of what the city is known for. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=3353984801354303639)`;

const whyItsSpecial = `Saoji food doesn't travel well, in the sense that it barely exists as a restaurant category outside Vidarbha, and even within Nagpur it's the kind of cuisine locals argue about rather than agree on a single "best" version of. That's worth more to a visiting fan than a polished, universally-loved recommendation would be. Eating something this regionally specific, and specifically not built for a tourist's palate, is a more honest taste of Nagpur than anything you'll find near the stadium. Pairing it with tarri poha and the city's orange-sweet tradition on the same day gives you the full, contradictory range of what this city actually eats, not just the version aimed at cricket tourists.`;

const insiderTips = [
  "Saoji rassa is built to be eaten with bhakri, not rice or naan — ask for it that way even if it's not automatically offered, since the flatbread is what the dish is actually designed around.",
  "If spice tolerance is a real concern, order tarri poha before you try Saoji mutton, not after — it's a genuinely mild dish that works as a safe first stop rather than a recovery meal.",
];

const whatToAvoid = `Don't order Saoji food expecting a milder regional variant of a curry you already know — it's built to be aggressively spiced by design, and asking a Saoji kitchen to tone it down significantly tends to change the dish rather than just soften it. Don't assume every "Saoji" restaurant in the city serves the same standard — quality and heat level vary noticeably between places, so a bad first experience at one spot isn't a fair verdict on the cuisine itself.`;

const gettingThere = `All three spots are within Nagpur's central city area, a short taxi or auto-rickshaw ride from most city-centre hotels; none are near the Jamtha stadium side of town.`;

const practicalInfo = {
  bookingMethod: "Walk-in only at all three — none of these take reservations, and none are far enough from the centre to require advance planning.",
  costRange: "Saoji thali/rassa meals typically run ₹200-400 per person; tarri poha is a few dozen rupees; Haldiram's sweets are sold by weight, inexpensively",
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Nagpur's Saoji Cuisine & Orange City Food Scene",
      subtitle: "Fiercely spiced mutton rassa, a breakfast poha you won't find elsewhere, and the city's real orange sweets.",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Central Nagpur",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Sources: TheLiveNagpur (oldest Saoji places), Slurrp/Zomato Saoji roundups. Multi-venue dining piece — 3 named venues, each with a real Google Places API rating lookup (Baba Saoji 3.7/660; Saburi Tarri Poha Misal Centre 4.4/275; Haldiram's 4.3/15,546), same date. No single top-level googleMapsRating set — see MULTI_VENUE_RATINGS entry.",
      sport: ["cricket"],
      moodTags: ["local-food", "spicy", "breakfast"],
      interestCategories: ["food"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "INR",
      bestSeasons: ["jan"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-23",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences).values({ experienceId: result.id, sportingEventId: EVENT_ID }).onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

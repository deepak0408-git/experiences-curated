import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const bodyContent = `The food that actually defines a Paris day is a baguette with butter and ham, wrapped in paper, eaten on a bench or on the move. It's called jambon-beurre — Parisians buy roughly three million a day — and with only three ingredients (crusty baguette, good butter, a few slices of quality ham) there's nowhere for a mediocre boulangerie to hide. Expect €4-7 at most boulangeries; a "gourmet" version can run €13-15.

Two real options near the stadium, both genuinely popular with locals rather than tourist-guide picks:

Boulangerie Sainte Périne (118 Avenue de Versailles, 75016) is the closer of the two — a short walk from Auteuil and an easy stop on the way to or from the grounds. It's been a certified "Boulangerie Gourmande" since 2017, runs as a proper neighborhood tea salon rather than a grab-and-go counter, and regulars come specifically for the almond croissant and baguettes that reliably sell out by mid-afternoon — a decent sign the bread itself is the draw, not just the location. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=13183697219286576139)

Boulangerie Basil (12 Rue François Millet, 75016), near Radio France, has built its reputation on naturally-leavened sourdough and organic Île-de-France flour rather than volume — a slightly longer detour, and sandwiches run pricier than the neighborhood average, so it's worth it for the bread itself more than a quick grab-and-go. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=11155372181741909896)

Either way, the habit — buying from whichever boulangerie is nearest and eating standing up — is the real experience, more than any single named address.`;

const whyItsSpecial = `Every food guide to Paris eventually points you toward a Michelin star. Almost none of them stop to explain the sandwich the entire city actually eats for lunch. That gap is the argument for this entry existing at all — the jambon-beurre isn't a lesser experience standing in the shadow of fine dining, it's a genuinely different and equally real slice of how Paris eats, one that costs less than a coffee at a tourist café and tells you more about the city's food culture in one bite than a five-course tasting menu might.

Both boulangeries here earn their place on quality, not proximity alone — Sainte Périne for a reliable, well-reviewed everyday loaf right by the stadium, Basil for bread worth a short detour. Neither is a tourist-trap pick; both are the kind of place a local in the 16th actually queues at.`;

const editorialNote = `Jambon-beurre facts (~3M/day, €4-7 standard price) from Tripadvisor jambon-beurre roundup and Timeout. Sainte Périne's "Boulangerie Gourmande" status (since 2017), tea-salon format, and almond croissant/sell-out-baguette detail from Tripadvisor reviewer comments. Boulangerie Sainte Périne (118 Avenue de Versailles, 75016) and Boulangerie Basil (12 Rue François Millet, 75016) verified via Google Places API 7 Sep 2026 — ratings 4.7/420 reviews and 4.6/520 reviews respectively, both genuinely well-reviewed neighborhood bakeries in the 16th arrondissement near the stadium. Previously listed à la Flûte Enchantée dropped — verified only 3.4/5 on Tripadvisor with recurring rude-service complaints, not a genuine recommendation. Grand Prix de la Baguette / Fournil Didot civic-history material cut per founder direction (7 Sep 2026) — too theoretical, not tactical, and the actual winning bakery is a real trek from Roland-Garros. Verified 7 Sep 2026. Hero image pending — batch pass to follow.`;

await db.update(experiences)
  .set({
    bodyContent,
    whyItsSpecial,
    editorialNote,
    address: "Boulangerie Sainte Périne, 118 Avenue de Versailles, 75016 Paris; Boulangerie Basil, 12 Rue François Millet, 75016 Paris",
    practicalInfo: {
      hours: "Most boulangeries open early morning (07:00-08:00) through early evening; many close one day a week, typically Monday",
      address: "Boulangerie Sainte Périne, 118 Avenue de Versailles, 75016 Paris; Boulangerie Basil, 12 Rue François Millet, 75016 Paris",
      website: "https://www.paris.fr",
      costRange: "€4-7 for a standard jambon-beurre; €13-15 for a gourmet version",
      bookingMethod: "Walk in — no reservation needed at either boulangerie.",
      reservationsRequired: false,
    },
  })
  .where(eq(experiences.slug, "everyday-parisian-eating-baguette-jambon-beurre"));

console.log("✓ everyday-parisian-eating-baguette-jambon-beurre — rewritten with tactical venue info + multi-venue ratings");

await client.end();

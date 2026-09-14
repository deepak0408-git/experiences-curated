// Qatar GP 2026 — Experience 10/21: Staybridge Suites Lusail

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DOHA_ID = "4e53af71-7526-4d55-bf81-5d57d6f22136";
const QATAR_GP_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";
const slug = "qatar-gp-staybridge-suites-lusail-" + Date.now().toString(36);

const bodyContent = `Staybridge Suites Doha Lusail is the value play in a neighborhood built around five-star towers — full apartments instead of hotel rooms, at a genuinely lower price point, without giving up the short trip to the circuit.

Every unit is a one, two, or three-bedroom apartment with a fully equipped kitchen (full-size fridge/freezer, microwave, cookware, dishes), a washer, a separate dining area, and a dedicated workspace — closer to renting a flat than booking a hotel room. That matters most for anyone traveling as a group or family: splitting a two- or three-bedroom apartment across several people brings the effective per-person cost down well below anything else in Lusail, and having a real kitchen means at least some meals don't have to happen at circuit or restaurant prices.

A 24-hour convenience store on-site (The Pantry) backs up the self-catering pitch further, alongside a fitness centre and pool. Breakfast, WiFi, and parking are all included free — a real difference from the five-star towers nearby, where each of those is typically an add-on charge.

It sits about 10 minutes from downtown Doha and roughly 30 minutes from Hamad International Airport — a genuinely central Lusail location, just without the marina-front premium of Raffles or Fairmont a short distance away.`;

const whyItsSpecial = `The case for Staybridge isn't just "cheaper" — it's a fundamentally different kind of stay that happens to suit a race weekend particularly well. A group of four or five splitting a three-bedroom apartment, cooking a couple of meals a day instead of eating out for every one, and doing their own laundry mid-trip ends up spending meaningfully less overall than the same group scattered across individual hotel rooms at any of the marina properties, even before comparing the nightly rate directly.

It's also proof that staying in Lusail — close to the circuit — doesn't require five-star pricing. For anyone whose priority is proximity to the track over resort-style amenities, this is the honest answer to "where do I actually need to spend the money."`;

const insiderTips = [
  "A two- or three-bedroom apartment split across a group brings the effective per-person cost meaningfully below any single-room option in Lusail — do the math on total group cost, not just the advertised nightly rate.",
  "The on-site Pantry convenience store runs 24 hours — useful for stocking the kitchen on a late arrival before shops elsewhere have closed for the night.",
];

const whatToAvoid = "Don't expect resort-level facilities or a marina view — this is a practical, apartment-style stay, not a luxury property, and the tradeoff for the lower price is a simpler physical space. Don't book without checking ventilation reviews if you're sensitive to it — a handful of guest reviews specifically flag ventilation as inconsistent, worth a quick check before committing if that's a concern for you.";

const practicalInfo = {
  hours: "Standard check-in 3:00pm, check-out 12:00pm",
  costRange: "Mid-range — meaningfully below the marina five-star towers, especially per person when splitting a multi-bedroom unit",
  bookingMethod: "Direct via ihg.com/staybridge or major booking platforms.",
  website: "https://www.ihg.com/staybridge/hotels/us/en/doha/dohls/hoteldetail",
  howToBook: "",
};

const gettingThere = "In Lusail, roughly 10 minutes from downtown Doha and about 30 minutes from Hamad International Airport — a short taxi or drive to Lusail International Circuit.";

const [inserted] = await db.insert(experiences).values({
  title: "Staybridge Suites Lusail",
  subtitle: "Full apartments with kitchens — the value base in a five-star neighborhood",
  slug,
  experienceType: "accommodation",
  status: "in_review",
  destinationId: DOHA_ID,
  bodyContent,
  whyItsSpecial,
  practicalInfo,
  gettingThere,
  insiderTips,
  whatToAvoid,
  sport: ["formula_one"],
  budgetTier: "moderate",
  curationTier: "editorial",
  lastVerifiedDate: new Date().toISOString().slice(0, 10),
  googleMapsRating: "4.7",
  googleMapsReviewCount: 703,
  googleMapsUrl: "https://maps.google.com/?cid=12120076132753572246&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  editorialNote: "Sources: tripadvisor.com (#9/12 Lusail, amenities detail), ihg.com (official amenities). Google Places API lookup 12 Sep 2026: 4.7/703 reviews.",
}).returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

await db.insert(sportingEventExperiences)
  .values({ experienceId: inserted.id, sportingEventId: QATAR_GP_EVENT_ID })
  .onConflictDoNothing();

console.log("Seeded:", inserted);

await client.end();

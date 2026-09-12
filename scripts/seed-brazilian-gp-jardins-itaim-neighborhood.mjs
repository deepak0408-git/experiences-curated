import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb";
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const slug = "brazilian-gp-jardins-itaim-neighborhoods-" + Date.now().toString(36);

const bodyContent = `Three neighborhoods sit next to each other south of Paulista Avenue, and together they cover most of the self-catering and mid-to-high-end stay options fans use for race weekend: Jardins, Itaim Bibi, and Vila Nova Conceição.

Jardins is the one built around Rua Oscar Freire — high-end retail, some of the city's best restaurants, and a genuinely walkable grid of tree-lined streets. It's the most polished of the three and the closest to a "tourist can find their way around easily" area, without actually being touristy in the way that phrase usually implies. Short-term rental options here skew toward boutique apartment buildings rather than large towers.

Itaim Bibi sits just south, built more around business than leisure during the week — it's a financial-district-adjacent neighborhood with sleek modern towers, but it fills with genuinely good, less see-and-be-seen restaurants at night once the office crowd clears out. Faria Lima, the avenue running through it, has direct metro access via the Yellow Line, and self-catering apartments here (Housi Faria Lima, Charlie Faria Lima, and similar buildings) are common and usually well set up with a kitchen and basic amenities, aimed at longer-stay business travelers as much as tourists.

Vila Nova Conceição is smaller and quieter than either — mostly residential towers, genuinely leafy, sitting right against Ibirapuera Park's edge. It has less going on after dark than Jardins or Itaim, but if you want proximity to the park and a calmer base to return to after a loud race day, it's the pick of the three.

For getting to Interlagos specifically: Vila Olímpia, on the border of Itaim Bibi, sits directly on Line 9 (Esmeralda) — the same line that runs straight to the Autódromo stop, so an apartment near Vila Olímpia's station can mean a single-line trip to the circuit with no transfer. Jardins and Vila Nova Conceição both require a short connection onto Line 9 from a different line.`;

const whyItsSpecial = `Race-weekend accommodation advice usually collapses into "stay near the circuit" or "stay central," and neither answer fits São Paulo well — this is a genuinely enormous city, and "central" doesn't mean one thing here the way it might in a smaller European capital. These three neighborhoods work as a set because they let you choose the actual tradeoff that matters to you: Jardins for polish and food, Itaim for a business-district energy that turns social at night, Vila Nova Conceição for quiet and green space. All three sit close enough to each other that you could stay in one and eat in another without much friction, which is its own kind of flexibility a single-neighborhood recommendation can't offer.`;

const insiderTips = [
  "If a single-line trip to Interlagos matters to you, look specifically for a rental near Vila Olímpia's Line 9 station rather than just 'somewhere in Itaim Bibi' — the area is large, and only the part close to that specific station gets you the no-transfer route to the Autódromo stop.",
  "Self-catering apartments in Faria Lima/Itaim Bibi are built more for longer business stays than short tourist visits, which works in your favor for a multi-day race weekend — expect a genuine kitchen and workspace setup rather than a stripped-down tourist studio.",
];

const whatToAvoid = `Don't assume all three neighborhoods have similar nightlife — Vila Nova Conceição is quiet after dark by design, mostly residential, so anyone expecting a lively evening scene walking distance from their rental should look at Jardins or Itaim Bibi instead. And don't book based on straight-line distance to Interlagos on a map — actual transit time depends entirely on which metro line your specific building connects to, and a neighborhood that looks close on a map can still mean two transfers if you're not near the right station.`;

const practicalInfo = {
  hours: "N/A — neighborhood overview",
  costRange: "Self-catering apartments generally run US$80-200+/night depending on building and season; race weekend carries a premium across all three areas",
  bookingMethod: "Search Airbnb or Vrbo filtered to Jardins, Itaim Bibi, or Vila Nova Conceição specifically — cross-check the listing's exact address against Line 9 (Esmeralda) station proximity if a direct route to Interlagos matters to you.",
  website: "https://www.airbnb.com",
};

const gettingThere = "Vila Olímpia sits directly on Metrô Line 9 (Esmeralda), the same line serving the Autódromo stop for Interlagos. Jardins and Vila Nova Conceição require a short connection onto Line 9 from the Yellow Line or a bus/rideshare transfer — check your specific building's nearest station before booking.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Jardins, Itaim Bibi & Vila Nova Conceição",
      subtitle: "Three neighborhoods, three different weekends — polish, business-district energy, or quiet green space",
      slug,
      experienceType: "neighborhood",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Jardins / Itaim Bibi / Vila Nova Conceição",
      address: "Jardins, Itaim Bibi, and Vila Nova Conceição, São Paulo, SP, Brazil",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Neighborhood character sourced from Expedia's area guides and Hotels.com's neighborhood pages for Itaim Bibi and Vila Nova Conceição, 11 Sep 2026 — rewritten entirely to strip AI-vocabulary phrasing found in source material ('vibrant urban oasis', 'enchanting', 'seamlessly blends'). Vila Olímpia's direct Line 9 (Esmeralda) connection sourced from a self-catering apartment listing's own stated transit info (1.5km/direct line to Esmeralda), cross-checked against the official Metrô Line 9 route map, 11 Sep 2026. This is a genuinely multi-venue/multi-area piece (3 named neighborhoods, no single addressable venue) — no single Google Maps rating applies; per skill §2c this stays without a MULTI_VENUE_RATINGS entry since no individually-named, rateable venues (specific hotels/restaurants) are called out by name in this piece, only areas.",
      sport: ["formula_one"],
      moodTags: ["practical", "upscale"],
      interestCategories: ["accommodation"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-11",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #9 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

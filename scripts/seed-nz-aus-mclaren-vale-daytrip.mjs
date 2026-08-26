import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "361d539e-4b17-4c9e-88ed-bc12e51cc853"; // Adelaide
const EVENT_ID = "ff13692a-c1b3-415a-8264-42b3d8535afd";
const slug = "mclaren-vale-adelaide-wine-daytrip-" + Date.now().toString(36);

const bodyContent = `McLaren Vale is a 45-minute drive south of Adelaide via the Southern Expressway, and it's the one leg of this tour where hiring a car for the day, or booking a tour that includes transport, genuinely changes what you can do — public transport exists but isn't built for a day trip. The train-plus-bus route via Noarlunga Centre takes over an hour each way and there's no direct bus back, so unless you're on a dedicated hop-on-hop-off wine tour bus, this is a self-drive or organised-tour day, not a wander-in-on-transit one.

The region is Shiraz country first — McLaren Vale's warm, coastal climate and ancient soils produce some of Australia's best-known reds, alongside Grenache, Cabernet, and a growing list of Spanish and Italian varieties like Tempranillo and Fiano. Over 70 cellar doors sit within the region, which means the real skill in a one-day visit is picking two or three rather than trying to see them all.

The d'Arenberg Cube is the one stop that isn't optional. A five-level building shaped like a giant Rubik's Cube, it houses the Alternate Realities Museum, a formal tasting room on Level 4 with panoramic vineyard views, and rotating art exhibitions — it's as much a piece of architecture and provocation as it is a winery, which is exactly the point. General admission is A$20, covering the self-guided museum, redeemable against a wine purchase in the Tasting Room; it opens at 10:30am and the venue recommends arriving by 3:30pm to allow enough time. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=7142486096604685136&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Port Willunga Beach, about 35km south of Adelaide and a short drive from the Cube, is worth the detour even outside wine season — golden cliffs, clear water, and the remains of a 19th-century jetty. Sections of the wreck of the Star of Greece, a cargo ship that sank offshore in 1888, still sit on the seabed and draw divers, and the clifftop restaurant named after it has views along the whole stretch of coast. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=12639484998096961586&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

For lunch, Star of Greece itself is the obvious pick if you can get a table — book ahead, since the clifftop position and the shipwreck story make it a genuine destination, not just a beach café. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=12988372832256831477&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)`;

const whyItsSpecial = `Adelaide Oval is a short walk from the city's own restaurant strip, so the temptation on a rest day is to just stay in town. McLaren Vale is why you shouldn't. It's the rare wine region that's both genuinely serious, one of Australia's most respected Shiraz-producing areas, and genuinely strange in places, the d'Arenberg Cube looks like nothing else in South Australian wine country, mixing an art museum into a working winery without apologising for it. Add a coastline with a real shipwreck story at Port Willunga and you get a day that isn't just "nice vineyards," it's a specific, textured stretch of South Australia that most Ashes-adjacent or Big Bash-focused itineraries never make time for. The catch is real too: this only works if someone's driving or you've booked a tour, and that constraint is worth knowing before you plan the day, not after you've missed the last bus back.`;

const insiderTips = [
  "The d'Arenberg Cube's $20 general admission is redeemable against a wine purchase of two bottles or more in the Tasting Room — worth timing your visit so the tasting comes after the museum, not before.",
  "There's no direct bus back to Adelaide from McLaren Vale — the public transport route is train to Noarlunga Centre then a connecting bus, over an hour each way. If you're not driving, book a hop-on-hop-off wine tour bus or a private tour rather than relying on transit for the return trip.",
];

const whatToAvoid = "Don't try to visit more than two or three cellar doors in a single day — with over 70 in the region, the temptation to cram in \"just one more\" tasting is real, but it turns a considered wine day into a rushed one, and driving between wineries means someone in the group needs to stay well under the limit throughout. Don't skip booking ahead at Star of Greece assuming a clifftop restaurant in a small town will have walk-in tables — its combination of view and story makes it a genuine destination booking, especially on weekends.";

const practicalInfo = {
  hours: "d'Arenberg Cube: daily 10:30am-4:30pm (arrive by 3:30pm). Port Willunga Beach: always open. Star of Greece: lunch and dinner, check current hours before visiting.",
  costRange: "d'Arenberg Cube general admission A$20/adult (A$10 under 18); cellar door tastings typically A$10-15pp, often waived with a purchase; Star of Greece mains roughly A$35-55",
  bookingMethod: "d'Arenberg Cube tickets at darenberg.com.au. No booking needed for Port Willunga Beach. Star of Greece bookings via their website or by phone, especially for weekend lunch.",
  howToBook: "",
  website: "https://www.darenberg.com.au, https://mclarenvale.info",
  reservationsRequired: false,
};

const gettingThere = "McLaren Vale is a 45-minute drive from Adelaide via the Southern Expressway. Public transport exists (train to Noarlunga Centre, then bus route 750/751) but takes over an hour each way with no direct return bus — a hop-on-hop-off wine tour bus or self-drive is the practical option for a day trip.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "McLaren Vale — Adelaide's Wine Region Day Trip",
      subtitle: "Shiraz country, a winery shaped like a giant cube, and a shipwreck beach 45 minutes south",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "McLaren Vale",
      address: null,
      heroImageUrl: null,
      heroImageAlt: null,
      heroImageCredit: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: mclarenvale.info and darenberg.com.au (region overview, Cube admission/hours), discoveradelaide.au and fittravel.com.au (drive time, Cube description), fleurieupeninsula.com.au and mclarenvale.info/port-willunga-beach-2 (Port Willunga Beach, Star of Greece shipwreck 1888 history), rome2rio.com and mclarenvaleandfleurieucoast.com.au/plan/getting-here (public transport route/timing confirmed, no direct return bus). Google Places API lookups: The d'Arenberg Cube (4.4/1,483), Port Willunga Beach (4.8/1,288), Star of Greece restaurant (4.6/2,327), all captured 16 Aug 2026 — real, well-attested ratings. Multi-venue experience — no single googleMapsRating on this row, live per-venue rating links written inline in bodyContent per skill §2c.",
      googleMapsRating: null,
      googleMapsReviewCount: null,
      googleMapsUrl: null,
      sport: ["cricket"],
      moodTags: ["wine", "scenic", "relaxed"],
      interestCategories: ["food_drink", "nature", "culture"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["dec"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-16",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID, packRank: 16 })
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

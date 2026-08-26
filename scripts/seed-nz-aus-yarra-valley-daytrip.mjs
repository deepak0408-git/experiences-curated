import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne
const EVENT_ID = "ff13692a-c1b3-415a-8264-42b3d8535afd";
const slug = "yarra-valley-melbourne-wine-daytrip-" + Date.now().toString(36);

const bodyContent = `Yarra Valley sits about an hour east of Melbourne by car — not the 30 minutes some tourism copy claims, which measures to the valley's western edge rather than to where the wineries actually cluster around Coldstream and Healesville. Public transport gets you there but works against a genuine day trip: the train to Lilydale takes about an hour, and from there you're relying on an infrequent connecting bus or a taxi to reach any individual winery. A hired car, a driver, or a tour that includes transport is the realistic way to do this properly, not an afterthought.

The region is Australia's cool-climate benchmark, known specifically for Chardonnay and Pinot Noir rather than the bigger reds of South Australia, and it holds around 90 open cellar doors across roughly 150 wineries — enough that picking two or three well matters more than trying to cover ground.

Domaine Chandon (trading as Chandon Australia) is the name most people already half-know — it's the Yarra Valley outpost of Moët & Chandon, built specifically for sparkling wine, with a tasting room looking out over 270 degrees of vineyard from a hillside site in Coldstream. Tastings run 20-55 minutes depending on the package, sampling 6-10 wines, and the sparkling focus makes it a genuinely different experience from a standard still-wine cellar door. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=1268132172497026518&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Oakridge Wines, also in Coldstream, is the pick for lunch and a more serious cellar-door conversation — it's rated higher than most of its neighbours by a real margin, and the format leans into actually tasting through the range with someone who works the vineyard rather than a scripted pour. Mains run roughly A$25-40, making it more accessible than some of the valley's fine-dining wineries without cutting corners on the wine itself. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=18380633781098806747&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

A realistic day: Chandon for a late-morning tasting, Oakridge for lunch, then one more cellar door on the drive back if there's time and a designated driver. December in the Yarra Valley is warm and green rather than parched — it's a different climate story than Adelaide or Perth on this tour, closer to a European wine-country summer than an Australian outback one.`;

const whyItsSpecial = `Every wine-region day trip on this tour risks reading the same: drive out, taste, eat, drive back. What separates Yarra Valley is what it's actually known for — cool-climate Chardonnay and Pinot Noir put it in a different conversation from McLaren Vale's Shiraz, and Domaine Chandon's sparkling focus adds a third register most single-day visitors don't expect from an Australian wine trip. It's also the most demanding of this tour's day trips to get right: the real drive time is longer than the marketing suggests, and public transport genuinely isn't built for it, so doing this well means committing to a car or a tour rather than hoping to wing it. That friction is worth stating plainly rather than glossing over, because a fan who plans around the wrong number loses hours of a rest day they won't get back.`;

const insiderTips = [
  "Chandon's tasting room sits on a hillside with 270-degree views — book the longer of their tasting packages if you want a proper sit-down experience rather than the quickest 20-minute option, since the setting is as much the draw as the wine.",
  "If you're not driving, the train-to-Lilydale-plus-bus route works but adds real time — budget close to two hours each way door to door, not the one-hour figure some tour operators quote for the drive alone.",
];

const whatToAvoid = "Don't assume every source's \"30 minutes from Melbourne\" claim for Yarra Valley is measuring the same thing — that figure usually refers to the valley's nearest edge, not the Coldstream/Healesville cluster where most well-known wineries actually sit, which is closer to an hour's drive. Don't book a self-drive day assuming you can visit four or five wineries and still enjoy any of them properly — with someone needing to stay under the alcohol limit throughout, two tastings plus a proper lunch stop is a fuller day than it sounds.";

const practicalInfo = {
  hours: "Domaine Chandon: 10:30am-4:30pm Monday-Saturday (check Sunday hours before visiting). Oakridge Wines: check current opening hours before visiting, typically daily for cellar door with more limited restaurant service days.",
  costRange: "Domaine Chandon tastings roughly A$20-45pp depending on package length; Oakridge Wines mains roughly A$25-40",
  bookingMethod: "Domaine Chandon tastings can be booked ahead at chandon.com.au, walk-ins possible depending on staff availability. Oakridge Wines bookings recommended for lunch via their website, especially weekends.",
  howToBook: "",
  website: "https://www.chandon.com.au, https://www.oakridgewines.com.au",
  reservationsRequired: false,
};

const gettingThere = "Yarra Valley's main winery cluster around Coldstream is roughly an hour's drive east of Melbourne. By public transport: train from Melbourne CBD to Lilydale station (about an hour), then a connecting bus or taxi to individual wineries — budget close to two hours door to door if not driving.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Yarra Valley — Melbourne's Wine Country Day Trip",
      subtitle: "Cool-climate Chardonnay and Pinot, a Moët & Chandon outpost, an hour east of the city",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Yarra Valley / Coldstream",
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
      editorialNote: "Independently re-verified 16 Aug 2026 per curator flag — prior pass had not confirmed this region's facts. Sources: winetraveler.com, autopiatours.com.au, travellingcorkscrew.com.au (drive time discrepancy 30min-90min noted and resolved to ~1hr for the Coldstream/Healesville cluster specifically), chandon.com.au and yarravalleywineries.com.au (Domaine Chandon address/hours/tasting format), restaurantsyarravalley.com.au and tripadvisor listings (Oakridge Wines pricing/format, 4.6-star Google/4.4 TripAdvisor sentiment), visitmelbourne.com and winehistorytours.com (public transport route via Lilydale confirmed genuinely slow/limited for a day trip). Google Places API lookups: CHANDON Australia (4.3/1,188), Oakridge Wines (4.7/1,133), both captured 16 Aug 2026 — real, well-attested ratings. Multi-venue experience — no single googleMapsRating on this row, live per-venue rating links written inline in bodyContent per skill §2c. Healesville Sanctuary intentionally not covered here — reserved for experience #24 (combined with Philip Island) per locked list, avoiding overlap.",
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
    .values({ experienceId: result.id, sportingEventId: EVENT_ID, packRank: 17 })
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

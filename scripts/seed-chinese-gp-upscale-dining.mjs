// Upscale dining (Mr & Mrs Bund) — Chinese GP 2027. Sources: general web
// research (Michelin Guide coverage, SilverKris, Asia's 50 Best context —
// independently corroborated across multiple sources), Google Places API
// (New) real rating lookup, 23 Sep 2026 (confirmed exact name match, unlike
// an earlier candidate "Meet The Bund" which could not be confidently
// matched to a single Google listing and was dropped rather than guessed).
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "998a8774-05ac-4482-ba7a-4ca2a556b963";
const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";
const slug = "chinese-gp-upscale-dining-" + Date.now().toString(36);

const bodyContent = `A genuinely upscale meal in Shanghai means leaving Jiading — the city's serious fine dining is concentrated downtown, particularly along the Bund, and no circuit-adjacent option comes close to matching it. For visitors treating this trip as a proper Shanghai visit with the Grand Prix as one part of it, that's not a downside — it's the reason to build a rest day around the city rather than staying circuit-side the entire weekend.

Mr & Mrs Bund sits inside a former Shanghainese bank building from 1922, one of the Bund's historic waterfront addresses, now home to French chef Paul Pairet's take on upscale international dining. The setting alone does real work — a genuine piece of 1920s Shanghai architecture rather than a purpose-built modern dining room — and the kitchen has built a serious independent reputation on top of it, drawing consistent recognition in Shanghai's fine-dining coverage over more than a decade of operation.

This isn't a quick stop. Getting here from Jiading means committing to the roughly hour-long Metro Line 11 journey each way, plus the dinner itself, so it's realistically a full-evening plan rather than something to fold into a session day. Build it into a rest day, or the evening before or after the race weekend, rather than trying to squeeze it between Saturday qualifying and Sunday's race. It's a genuinely good way to close out a day spent exploring Shanghai and the Bund — walk the waterfront, see the city by daylight, then sit down here as the evening's natural finish rather than treating dinner as a separate trip back downtown.

Reservations matter here — this is the kind of restaurant that fills up on its own reputation regardless of any race weekend happening in the city, so book ahead rather than assuming a Grand Prix-adjacent walk-in will work.`;

const whyItsSpecial = `A circuit-adjacent dinner is convenient. A meal inside a century-old Bund bank building, with a kitchen that's held its own reputation in one of Asia's most competitive dining cities for well over a decade, is something else entirely — and it's the argument for treating this trip as a real Shanghai visit rather than a race weekend that happens to be in Shanghai. The Jiading-versus-downtown trade-off this pack covers elsewhere isn't really a question here: for a meal at this level, there's no equivalent near the circuit, and there isn't meant to be. The hour on the Metro is the price of admission to the city's actual fine-dining scene, and for one evening of a multi-day trip, it's a genuinely reasonable one to pay.`;

const practicalInfo = {
  hours: "Lunch: every day, 11:30 AM–2:30 PM. Dinner: every day, 5:30–10 PM. Per the restaurant's own official site.",
  costRange: "À la carte mains roughly ¥280-420 (~US$39-58); signature dishes like the Jumbo Shrimp in Citrus Jar (¥180) or Meunière Truffle Bread (¥120) run lower. Brunch sets from ¥250 up to ¥780 per person. Splurge tier overall — budget US$80-150+ per person for a full dinner with drinks.",
  bookingMethod: "Reservations recommended well in advance, particularly around a major event weekend — book via reservations@mmbund.com or call +86 21 6323 9898.",
  website: "https://www.mmbund.com/",
};

const gettingThere = "From Jiading: Metro Line 11 into central Shanghai, then a short taxi or walk to the Bund waterfront — budget roughly an hour each way from the circuit area, plus onward local transit downtown.";

const insiderTips = [
  "Order the Long Short Rib Teriyaki and the Lemon-and-Lemon Tart — the short rib is the dish regulars talk about most, and the tart (a whole lemon confit-ed for 72 hours, hiding sorbet and curd inside) is Chef Paul Pairet's best-known dessert.",
  "If you want the full Pairet signature spread without overordering, the Jumbo Shrimp in Citrus Jar (steamed with lemongrass and vanilla) and the Meunière Truffle Bread are the two smaller, most distinctive plates worth adding alongside a main.",
];

const whatToAvoid = "Don't order a la carte and skip the signature dishes by accident — the menu runs to roughly 250 items, so without steering toward the Long Short Rib Teriyaki, the Jumbo Shrimp in Citrus Jar, or the Lemon-and-Lemon Tart, it's easy to end up with a competent but forgettable meal instead of the dishes this kitchen is actually known for. Don't assume walk-in availability because you're visiting during a major event — this restaurant's demand comes from its own standing reputation in Shanghai's dining scene, not from Grand Prix tourism specifically, so book ahead regardless of race weekend timing.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Mr & Mrs Bund — A Proper Shanghai Dinner",
      subtitle: "A 1922 Bund bank building turned upscale dining room — worth the hour from Jiading on a genuine rest-day evening.",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "The Bund (Huangpu District)",
      address: "18 Zhongshan Dong Yi Lu, The Bund, Huangpu District, Shanghai, China",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced via general web research (Michelin/fine-dining press coverage of the Bund's dining scene, independently corroborated across multiple sources) and Google Places API (New) lookup, 23 Sep 2026: Mr&Mrs Bund 4.6/165 reviews, confirmed exact name match. An earlier candidate ('Meet The Bund') could not be confidently matched to a single Google listing on retry and was dropped rather than guessed, per §2c. Hours/address/phone/reservation email confirmed directly via mmbund.com (official restaurant site), 2 Oct 2026. Signature dish names/prices via danielfooddiary.com — Meunière Truffle Bread ¥120, Chicken Picnic Aioli ¥125, Jumbo Shrimp in Citrus Jar ¥180, Black Cod In The Bag ¥280-360, Long Short Rib Teriyaki ¥420, Lemon-and-Lemon Tart ¥110 — cross-checked against WebSearch-aggregated Tripadvisor/Trip.com pricing (brunch ¥250-780/person) for the general splurge-tier cost range.",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 165,
      googleMapsUrl: "https://maps.google.com/?cid=10753692364766140349&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
      sport: ["formula_one"],
      moodTags: ["luxurious", "romantic"],
      interestCategories: ["dining"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: new Date().toISOString().slice(0, 10),
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓", result.title, "→", result.id, `(${result.slug})`, result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

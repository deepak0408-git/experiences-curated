// Where to Stay — Jiading/Anting vs. Downtown, Chinese GP 2027. Sources:
// formula1.com/en/racing/2027/china (official — Metro Line 11, ~60min to
// circuit), Google Places API (New) real ratings lookups, 23 Sep 2026 (2
// Jiading hotels) + 2 Oct 2026 (3 downtown hotels added). Jiading
// neighborhood content (Nanxiang Old Street, Guyi Garden, Nanxiang Temple)
// via WebSearch of Tripadvisor/travelchinaguide, 2 Oct 2026 — general
// descriptive content, not individually rated venues. Multi-venue
// experience — no top-level googleMapsRating; per-hotel inline links +
// MULTI_VENUE_RATINGS entry (venueCount: 5) required.
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "998a8774-05ac-4482-ba7a-4ca2a556b963";
const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";
const slug = "chinese-gp-where-to-stay-" + Date.now().toString(36);

const bodyContent = `The real decision for a Chinese Grand Prix trip isn't which neighborhood is nicer — it's how much of your daily travel time you're willing to spend on Metro Line 11. Formula 1's own event page puts the journey from central Shanghai to the Shanghai Circuit stop at roughly 60 minutes each way. That's not a minor detail on a three-day race weekend; it's an hour you either spend twice a day commuting, or you spend once, getting settled near the circuit and taking a single longer trip into the city on a rest day instead.

Jiading isn't just a commute-saver — it's built around Nanxiang, the old water town widely credited as the birthplace of xiaolongbao, and it has its own genuine character if you give it an evening. Nanxiang Old Street runs along narrow canals lined with teahouses and steamed-bun stalls, with the restored Twin Towers forming the centre of the old town. The Guyi Garden nearby is a real classical Chinese garden — lotus pools, pagodas, a lagoon — and the Nanxiang Temple, with its koi pond and a bell tower you can climb for a view over the old town, rounds out a quiet half-day that has nothing to do with the race. It's not downtown Shanghai, but it's not a soulless commuter district either.

Staying near the circuit, in Jiading district, means a short taxi or shuttle instead of an hour on the Metro each way — genuinely valuable on race day specifically, when you want every extra minute of sleep and the shortest possible route to the gates. Courtyard Shanghai Jiading is a solid, well-reviewed option in this category, an international Marriott brand with a real, sizeable review base behind it. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=16451965956038068932&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

A step up in comfort in the same general area is Hyatt Regency Shanghai Jiading — a genuinely higher-end pick, though its current review count is smaller, so treat it as a promising lead worth checking closer to booking rather than a fully confirmed recommendation on review strength alone. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=17632445913611758289&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Staying downtown instead — the Bund, French Concession, or Lujiazui — trades that commute time for genuine Shanghai: better restaurants, more to do on a rest day before or after the race, and a city that doesn't shut down once the Grand Prix ends on Sunday evening. Across the three budget tiers, Campanile Shanghai Bund Hotel is the honest budget pick — walking distance to the Bund in Huangpu District, functional rather than stylish, but well-placed and well-reviewed for the price. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=5743467740145777665&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) For a moderate budget, Okura Garden Hotel Shanghai sits on the elegant Huai Hai Road in the French Concession and consistently ranks among the area's best-value picks. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=14460988116141205306&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) At the luxury end, Waldorf Astoria Shanghai on the Bund occupies the meticulously restored 1910 Shanghai Club building right on the riverfront — the kind of address that makes the downtown-vs-Jiading trade-off genuinely tempting even with the commute. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=14845214940755852074&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

If your trip is built around Shanghai as a destination and the race is one part of a longer visit, downtown makes real sense. If the race itself is the priority and Shanghai is secondary, Jiading cuts the single biggest logistical friction point out of your weekend without leaving you with nothing to do once the sessions end.

There's no wrong answer here, but there is a wrong assumption: don't book downtown assuming the circuit is a quick hop away. An hour each way, twice a day, across three session days, adds up to real fatigue by Sunday.`;

const whyItsSpecial = `Every Grand Prix city has some version of this trade-off, but Shanghai's version is sharper than most because the distance is genuinely large — this isn't a 20-minute debate, it's a full hour each way on the Metro, confirmed directly on Formula 1's own event page. What makes Jiading more than a logistics compromise is Nanxiang: a real old water town, credited as the birthplace of xiaolongbao, with canals, a restored historic centre, and a classical garden worth an evening on their own merits, not just a place to sleep near the circuit. That makes the Jiading-vs-downtown question less about convenience versus nothing, and more about two genuinely different kinds of Shanghai — one quiet and historic, one the full-scale modern city — each with real hotels at every budget level to back the choice up. Getting this decision right before you book, rather than discovering the commute reality on the Friday morning of practice, is the difference between a race weekend that feels relaxed and one that feels like a logistics exercise with racing squeezed in around it.`;

const practicalInfo = {
  hours: "Check-in: Courtyard Shanghai Jiading 2:00 PM, Hyatt Regency Shanghai Jiading 3:00 PM, Campanile Shanghai Bund Hotel 2:00 PM, Okura Garden Hotel Shanghai 2:00 PM, Waldorf Astoria Shanghai on the Bund 3:00 PM — all per each hotel's official site, check-out 12:00 PM at all five.",
  costRange: "Jiading district and budget downtown hotels generally run more affordably than moderate and luxury downtown properties — confirm current rates directly with each hotel",
  bookingMethod: "Book directly through each hotel's own official site.",
  website: "https://www.marriott.com/en-us/hotels/shajd-courtyard-shanghai-jiading/overview/, https://www.hyatt.com/hyatt-regency/en-US/sharj-hyatt-regency-shanghai-jiading, https://shanghai-bund.campanile.com/en-us/, https://www.gardenhotelshanghai.com/, https://www.hilton.com/en/hotels/shawawa-waldorf-astoria-shanghai-on-the-bund/",
};

const gettingThere = "Jiading-based hotels: short taxi or shuttle to the circuit (avoids the ~60-minute Metro Line 11 journey from downtown). Downtown hotels: Metro Line 11 direct to Shanghai Circuit station, roughly 60 minutes each way per Formula 1's own event page.";

const insiderTips = [
  "If race day is the priority, book Jiading and accept a quieter evening scene — the hour saved each way across three session days adds up to real rest, especially on race morning when an early, unhurried start matters most. Spend one evening in Nanxiang Old Street rather than writing Jiading off as purely functional.",
  "If you do choose downtown, plan one dedicated Metro trip out to the circuit for a practice or qualifying day to scout the actual journey time and station layout before race day itself, rather than discovering it for the first time when the stakes (and crowds) are highest.",
];

const whatToAvoid = "Don't book a downtown hotel purely on Bund or French Concession address without checking its actual walk to a Metro Line 11 connection — not every downtown neighborhood sits near that specific line, and a short-looking distance on a map can still mean a transfer or a longer walk than expected on race morning. Don't leave hotel booking until close to the event — F1 weekends draw real demand at this circuit, and the best-located, best-reviewed rooms at every tier (Jiading and downtown alike) are the first to sell out as race week approaches.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Where to Stay — Jiading vs. Downtown Shanghai",
      subtitle: "An honest hour-each-way trade-off: circuit-adjacent convenience in Jiading, or genuine Shanghai downtown.",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Jiading District / Downtown Shanghai",
      address: "Jiading District and Downtown Shanghai (multiple properties — see body text for specific hotels)",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from formula1.com/en/racing/2027/china (official — Metro Line 11, ~60min journey). Jiading neighborhood content (Nanxiang Old Street, Twin Towers, Guyi Garden, Nanxiang Temple, xiaolongbao origin) via WebSearch of Tripadvisor/travelchinaguide aggregated results, 2 Oct 2026. Google Places API (New) lookups: Courtyard Shanghai Jiading 4.0/68 reviews, Hyatt Regency Shanghai Jiading 4.6/34 reviews (thinner sample, flagged honestly in copy per §2c) — 23 Sep 2026; Campanile Shanghai Bund Hotel 4.3/544 reviews, Okura Garden Hotel Shanghai 4.4/325 reviews, Waldorf Astoria Shanghai on the Bund 4.5/605 reviews (matched to the actual hotel entity, not brand/operator page) — 2 Oct 2026. Check-in times and official hotel website URLs via WebSearch of each hotel's official domain (marriott.com, hyatt.com, shanghai-bund.campanile.com, gardenhotelshanghai.com, hilton.com), 2 Oct 2026 — Marriott and Hyatt pages returned HTTP 403 on direct fetch, so those two check-in times rely on WebSearch-aggregated snippets citing the official domain rather than a direct page read; flagged for spot-check if precision matters later. MULTI_VENUE_RATINGS entry in app/experience/[slug]/page.tsx updated to venueCount: 5.",
      sport: ["formula_one"],
      moodTags: ["practical"],
      interestCategories: ["accommodation"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: true,
      availability: "event_only",
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

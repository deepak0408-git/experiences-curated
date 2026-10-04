import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-where-to-stay-mud1vfyd";

const newBodyContent = `The real decision for a Chinese Grand Prix trip isn't which neighborhood is nicer — it's how much of your daily travel time you're willing to spend on Metro Line 11. Formula 1's own event page puts the journey from central Shanghai to the Shanghai Circuit stop at roughly 60 minutes each way. That's not a minor detail on a three-day race weekend; it's an hour you either spend twice a day commuting, or you spend once, getting settled near the circuit and taking a single longer trip into the city on a rest day instead.

Jiading isn't just a commute-saver — it's built around Nanxiang, the old water town widely credited as the birthplace of xiaolongbao, and it has its own genuine character if you give it an evening. Nanxiang Old Street runs along narrow canals lined with teahouses and steamed-bun stalls, with the restored Twin Towers forming the centre of the old town. The Guyi Garden nearby is a real classical Chinese garden — lotus pools, pagodas, a lagoon — and the Nanxiang Temple, with its koi pond and a bell tower you can climb for a view over the old town, rounds out a quiet half-day that has nothing to do with the race. It's not downtown Shanghai, but it's not a soulless commuter district either.

Staying near the circuit, in Jiading district, means a short taxi or shuttle instead of an hour on the Metro each way — genuinely valuable on race day specifically, when you want every extra minute of sleep and the shortest possible route to the gates. Courtyard Shanghai Jiading is a solid, well-reviewed option in this category, an international Marriott brand with a real, sizeable review base behind it. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=16451965956038068932&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

A step up in comfort in the same general area is Hyatt Regency Shanghai Jiading — a genuinely higher-end pick, though its current review count is smaller, so treat it as a promising lead worth checking closer to booking rather than a fully confirmed recommendation on review strength alone. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=17632445913611758289&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Staying downtown instead — the Bund, French Concession, or Lujiazui — trades that commute time for genuine Shanghai: better restaurants, more to do on a rest day before or after the race, and a city that doesn't shut down once the Grand Prix ends on Sunday evening. Across the three budget tiers, Campanile Shanghai Bund Hotel is the honest budget pick — walking distance to the Bund in Huangpu District, functional rather than stylish, but well-placed and well-reviewed for the price. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=5743467740145777665&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) For a moderate budget, Okura Garden Hotel Shanghai sits on the elegant Huai Hai Road in the French Concession and consistently ranks among the area's best-value picks. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=14460988116141205306&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) At the luxury end, Waldorf Astoria Shanghai on the Bund occupies the meticulously restored 1910 Shanghai Club building right on the riverfront — the kind of address that makes the downtown-vs-Jiading trade-off genuinely tempting even with the commute. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=14845214940755852074&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

If your trip is built around Shanghai as a destination and the race is one part of a longer visit, downtown makes real sense. If the race itself is the priority and Shanghai is secondary, Jiading cuts the single biggest logistical friction point out of your weekend without leaving you with nothing to do once the sessions end.

There's no wrong answer here, but there is a wrong assumption: don't book downtown assuming the circuit is a quick hop away. An hour each way, twice a day, across three session days, adds up to real fatigue by Sunday.`;

const newWhyItsSpecial = `Every Grand Prix city has some version of this trade-off, but Shanghai's version is sharper than most because the distance is genuinely large — this isn't a 20-minute debate, it's a full hour each way on the Metro, confirmed directly on Formula 1's own event page. What makes Jiading more than a logistics compromise is Nanxiang: a real old water town, credited as the birthplace of xiaolongbao, with canals, a restored historic centre, and a classical garden worth an evening on their own merits, not just a place to sleep near the circuit. That makes the Jiading-vs-downtown question less about convenience versus nothing, and more about two genuinely different kinds of Shanghai — one quiet and historic, one the full-scale modern city — each with real hotels at every budget level to back the choice up. Getting this decision right before you book, rather than discovering the commute reality on the Friday morning of practice, is the difference between a race weekend that feels relaxed and one that feels like a logistics exercise with racing squeezed in around it.`;

const newInsiderTips = [
  "If race day is the priority, book Jiading and accept a quieter evening scene — the hour saved each way across three session days adds up to real rest, especially on race morning when an early, unhurried start matters most. Spend one evening in Nanxiang Old Street rather than writing Jiading off as purely functional.",
  "If you do choose downtown, plan one dedicated Metro trip out to the circuit for a practice or qualifying day to scout the actual journey time and station layout before race day itself, rather than discovering it for the first time when the stakes (and crowds) are highest.",
];

const newWhatToAvoid = "Don't book a downtown hotel assuming the circuit is a short trip — Formula 1's own event page puts the journey at roughly 60 minutes each way via Metro Line 11, a real commitment across three session days, not a minor inconvenience. Don't choose Hyatt Regency Shanghai Jiading purely on its higher star rating without checking current reviews yourself first — its review sample is smaller than Courtyard Shanghai Jiading's, so it's a promising option rather than a fully confirmed one at this review volume.";

const newPracticalInfo = {
  hours: "N/A — multi-venue accommodation guide, see individual hotel links",
  website: "https://www.formula1.com/en/racing/2027/china",
  costRange: "Jiading district and budget downtown hotels generally run more affordably than moderate and luxury downtown properties — confirm current rates directly with each hotel",
  bookingMethod: "Book directly through each hotel's own site or a major booking platform — search by name for any of the five hotels named here (Courtyard Shanghai Jiading, Hyatt Regency Shanghai Jiading, Campanile Shanghai Bund Hotel, Okura Garden Hotel Shanghai, Waldorf Astoria Shanghai on the Bund).",
};

await db.update(experiences)
  .set({
    bodyContent: newBodyContent,
    whyItsSpecial: newWhyItsSpecial,
    insiderTips: newInsiderTips,
    whatToAvoid: newWhatToAvoid,
    practicalInfo: newPracticalInfo,
    editorialNote: "Sourced from formula1.com/en/racing/2027/china (official — Metro Line 11, ~60min journey). Jiading neighborhood content (Nanxiang Old Street, Twin Towers, Guyi Garden, Nanxiang Temple, xiaolongbao origin) via WebSearch of Tripadvisor/travelchinaguide aggregated results, 2 Oct 2026 — general descriptive content, not tied to individually-rated venues, per founder instruction that Google IDs are only needed for the 5 named hotels, not neighborhood sights. Hotel ratings verified via Google Places API (scripts/_places-lookup.mjs), 2 Oct 2026: Courtyard Shanghai Jiading 4.0/68 reviews, Hyatt Regency Shanghai Jiading 4.6/34 reviews (both from prior pass, 23 Sep 2026); Campanile Shanghai Bund Hotel 4.3/544 reviews, Okura Garden Hotel Shanghai 4.4/325 reviews, Waldorf Astoria Shanghai on the Bund 4.5/605 reviews (new, 2 Oct 2026, matched to the actual hotel entity not brand/operator page). FLAG: multi-venue experience — needs MULTI_VENUE_RATINGS entry in app/experience/[slug]/page.tsx updated to venueCount: 5 (was 2), not yet added (deferred to spoke-build reconciliation pass).",
  })
  .where(eq(experiences.slug, SLUG));

console.log("Updated chinese-gp-where-to-stay-mud1vfyd: body, whyItsSpecial, insiderTips, whatToAvoid, practicalInfo, editorialNote.");

await client.end();

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "883ac422-5318-460f-819a-6ae784ac4b8c";
const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a";
const slug = "mexico-city-zocalo-cathedral-templo-mayor-" + Date.now().toString(36);

const bodyContent = `The Zócalo sits on the literal center of Tenochtitlán, the Aztec capital that stood here when Hernán Cortés arrived in 1519. After the conquest, Cortés had the city demolished and ordered a new Spanish colonial capital built directly on top — using stone salvaged from the destroyed Aztec ceremonial precinct to do it. That single fact is the key to understanding everything else on this plaza: the buildings around you weren't just built near Aztec Tenochtitlán, several of them were built out of it. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=5548166858216125964&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

The Metropolitan Cathedral, flanking the plaza's north side, took nearly 250 years to complete — construction began in 1573 and wasn't finished until 1813, passing through multiple architects and stylistic changes along the way, which is part of why its interior feels layered rather than uniform. It's free to enter, open daily from roughly 9am to 5:30pm, and much of its stone came directly from the demolished Templo Mayor a few steps away. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=10470655760320782119&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Templo Mayor itself has a stranger, more recent story: after the Spanish conquest, the temple was buried under colonial construction and stayed hidden for 450 years, until electrical workers digging a few blocks from the plaza in 1978 accidentally uncovered it. What's visible today is an excavated site alongside a purpose-built museum holding artifacts recovered from the dig — a genuinely rare case of a major ancient monument being rediscovered by accident in the middle of a modern capital city, not through deliberate archaeological search. A visit runs 60-90 minutes and costs a modest entry fee. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=10128805338444740272&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Together, the three sites form a natural half-day loop: the plaza itself, the cathedral built from the temple's own stones, and the temple's excavated remains a short walk away — a genuinely rare chance to stand in one place and read three overlapping layers of the same city's history side by side.`;

const whyItsSpecial = `Most historic city centers ask you to imagine the layers of history stacked underneath them. The Zócalo doesn't require imagination — the cathedral is quite literally built from the stones of the temple it replaced, and that temple itself sat hidden and forgotten for 450 years until it was rediscovered by accident during routine utility work in a modern, functioning capital city. Standing in this plaza means standing on top of one civilization's deliberate erasure and another's accidental rediscovery, both still physically visible within a few minutes' walk of each other. Few public squares anywhere let you read that much real history so directly, without a placard doing the explaining for you.`;

const insiderTips = [
  "Visit the Templo Mayor museum before or after seeing the excavated site itself, not instead of it — the museum's recovered artifacts make far more sense once you've seen the physical foundations they came from, and vice versa.",
  "The cathedral's construction spanned nearly 250 years and multiple architectural styles — look for the visible shifts in style as you move through the interior rather than expecting one unified design, since that inconsistency is itself part of the building's real history.",
];

const whatToAvoid = `Don't show up on a Monday expecting to see Templo Mayor — the site and its museum are closed that day, official INAH policy, so check the day of the week before building this into your itinerary rather than discovering it at a locked gate. And don't wander into one of the tourist-facing cantinas or restaurants immediately surrounding the plaza without checking your bill item by item — inflated charges and items added that weren't ordered are a real, recurring complaint specifically in this high-foot-traffic area, not a rare exception.`;

const practicalInfo = {
  hours: "Metropolitan Cathedral: daily, roughly 9am-5:30pm, free entry. Templo Mayor Museum: check current hours, typically closed Mondays — allow 60-90 minutes.",
  costRange: "Zócalo and Metropolitan Cathedral: free. Templo Mayor Museum: 100 MXN (roughly US$5.92) Tuesday-Saturday; free on Sundays for Mexican citizens and foreign residents with valid ID, but foreign visitors without residency pay the standard fee any day.",
  bookingMethod: "No advance booking needed for any of the three — all accept walk-in visitors during opening hours.",
  website: "https://mexicocity.cdmx.gob.mx/venues/metropolitan-cathedral/, https://lugares.inah.gob.mx/en/node/4236",
};

const gettingThere = "Zócalo Metro station (Line 2) sits directly beneath the plaza — the most direct way in from anywhere else in the city.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Zócalo, Cathedral & Templo Mayor",
      subtitle: "A cathedral built from a temple's stones, and a temple rediscovered by accident in 1978",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Centro Histórico",
      address: "Plaza de la Constitución, Centro Histórico, 06000 Ciudad de México",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      bookingLinks: [
        { platform: "GetYourGuide", label: "Metropolitan Cathedral", url: "https://www.getyourguide.com/catedral-metropolitana-de-mexico-l17000/?partner_id=HCNITTS&utm_medium=online_publisher" },
        { platform: "GetYourGuide", label: "Templo Mayor Museum", url: "https://www.getyourguide.com/templo-mayor-museum-mexico-city-l4157/?partner_id=HCNITTS&utm_medium=online_publisher" },
      ],
      editorialNote: "History (Tenochtitlán, 1521 conquest, cathedral construction 1573-1813 using Templo Mayor stone, 1978 accidental rediscovery) sourced from InfoMexico.org's Zócalo guide and AbbysHearth.com's Metropolitan Cathedral guide, Sep 2026, cross-checked for consistency. Google ratings via Places API lookup same session: Zócalo/Constitution Plaza 4.7/324,374 reviews, Metropolitan Cathedral 4.7/24,190 reviews, Templo Mayor Museum 4.8/34,995 reviews. Multi-venue: MULTI_VENUE_RATINGS entry required, venueCount 3. What to Avoid rebuilt 6 Sep 2026 — the original's first avoid restated bodyContent's own 60-90 minute timing fact. Replaced with 2 genuinely new avoids: Templo Mayor's Monday closure (official INAH policy, confirmed via multiple museum-hours sources, 6 Sep 2026 — not previously mentioned anywhere in this experience) and inflated-bill scams at tourist-facing restaurants immediately around the plaza (sourced from MexicoCity-Trip.com's safety guide, 6 Sep 2026). Templo Mayor entry fee corrected 7 Sep 2026 — replaced the vague '~US$5 equivalent' estimate with the real peso figure (100 MXN, confirmed directly on the official templomayor.inah.gob.mx English page, which explicitly states no nationality-based price differential — a separate AI-search summary had claimed a 210/105 MXN foreigner/resident split 'effective Jan 1 2026,' but that contradicted the official page's own text and wasn't independently verifiable, so it was not used) converted to USD at today's real rate (0.05917, api.frankfurter.dev, 7 Sep 2026) = US$5.92. GetYourGuide affiliate links (Metropolitan Cathedral, Templo Mayor Museum) added 7 Sep 2026, founder-supplied real affiliate URLs per feedback_affiliate_link_generation.md.",
      sport: ["formula_one"],
      moodTags: ["historic", "free", "must-see"],
      interestCategories: ["culture", "history"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "free",
      budgetCurrency: "MXN",
      bestSeasons: ["oct", "nov"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-06",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #15 seeded:", result.title, "|", result.id, "|", result.slug);
  console.log("REMINDER: add MULTI_VENUE_RATINGS entry, venueCount=3");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

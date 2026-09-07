import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "883ac422-5318-460f-819a-6ae784ac4b8c";
const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a";
const slug = "mexico-city-where-to-stay-condesa-" + Date.now().toString(36);

const bodyContent = `Condesa sits right next to Roma Norte and shares much of its safety profile and walkability, but the character is different — this is the greener, calmer half of the pairing, built around two large parks, Parque México and Parque España, that give the neighborhood a genuine sense of open space you don't get in denser parts of the city. It's popular with long-term expats and dog walkers as much as visitors, which shows up in the pace: quieter streets, more joggers, fewer late-night crowds than Roma Norte's restaurant strip.

Hotel CondesaDF sits right beside Parque España and is the neighborhood's best-known property — French designer India Mahdavi did the interiors, and the triangular rooftop bar has become a genuine draw in its own right, not just a hotel amenity. It's been a fixture on "best of Mexico City" lists for years, and the volume of reviews behind its rating reflects a hotel that's been tested by a lot of guests over a long run, not a newer property still building a track record. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=5467969283992143401&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Casa Cuenca is the smaller, quieter alternative — just a handful of rooms inside a restored 1930s mansion, with a design-forward but understated look rather than CondesaDF's more design-statement interiors. Its on-site restaurant, Maleza, does contemporary Mexican food and is worth booking even if you're not staying there. The review count here is genuinely smaller than CondesaDF's, reflecting the property's size rather than a quality gap — worth knowing going in rather than reading the smaller number as a red flag. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=12864350849424035959&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Both hotels sit within walking distance of Parque México, and both put you closer to a quieter, park-adjacent version of the Roma-Condesa corridor than a hotel actually inside Roma Norte would. Like Roma Norte, neither sits directly on Metro Line 9 — factor in a short taxi or rideshare for circuit days.`;

const whyItsSpecial = `If Roma Norte is the neighborhood you go to for the restaurant and bar scene, Condesa is the one you retreat to at the end of the night — and on a trip built around a loud, high-energy race weekend, that contrast is worth choosing deliberately rather than by accident. Two large parks within walking distance of your hotel means genuine quiet is available here in a way it isn't in most of central Mexico City, which matters more than it sounds like it should after a full day of grandstand noise and altitude-thinned air.`;

const insiderTips = [
  "Book a room facing away from Avenida Amsterdam or Nuevo León if street noise bothers you — Condesa is quieter than Roma Norte overall, but its two main commercial streets still carry real evening traffic and bar noise.",
  "Casa Cuenca's on-site restaurant, Maleza, is worth booking a table at even if you're staying elsewhere — its small size means it doesn't always show up on general 'best restaurants' roundups despite the quality.",
];

const whatToAvoid = `Don't assume Condesa's quieter reputation means every street is equally calm — the blocks directly along Avenida Amsterdam and Avenida Michoacán carry real restaurant and bar noise into the evening, so check a specific hotel's exact block rather than relying on the neighborhood's overall reputation. And don't book Casa Cuenca expecting CondesaDF's scale of amenities (multiple bars, a larger rooftop scene) — it's a genuinely different, smaller kind of property, and going in with the wrong expectation is the more common source of disappointment than anything about the hotel itself.`;

const practicalInfo = {
  hours: "Condesa df: check-in from 3:00pm, check-out by 12:00pm. Casa Cuenca: check-in 3:00pm-midnight, check-out by 12:00pm. Early check-in/late check-out available on request, subject to availability.",
  costRange: "Hotel CondesaDF and Casa Cuenca both sit in the moderate-to-splurge range — CondesaDF typically the pricier of the two given its scale and rooftop draw",
  bookingMethod: "Book directly through each hotel's own site or via Booking.com — given the Día de Muertos overlap with race weekend, book earlier than usual for this neighborhood.",
  website: "https://www.condesadf.com, https://www.casacuenca.mx",
};

const gettingThere = "Neither hotel sits directly on Metro Line 9 — plan a short taxi/rideshare or a connecting walk toward Chilpancingo or Patriotismo station for onward travel to the circuit.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Where to Stay in Condesa",
      subtitle: "Two parks, a quieter pace, and Mexico City's most design-forward small hotels",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Condesa",
      address: "Condesa df: Av. Veracruz 102, Col. Condesa, Cuauhtémoc, 06700 Ciudad de México. Casa Cuenca: Cuernavaca 4, Col. Condesa, Cuauhtémoc, 06140 Ciudad de México.",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      bookingLinks: [
        { platform: "Booking.com", label: "Condesa df", url: "https://www.jdoqocy.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fmx%2Fcondesa-df.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4Aof5-NQGwAIB0gIkNDBhNDA0OTItNWY4Mi00NTI5LWE2ZjUtN2FkNjI2ZTBhZGI52AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26all_sr_blocks%3D17627004_89150832_2_1_0%26checkin%3D2026-10-29%26checkout%3D2026-11-02%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D17627004_89150832_2_1_0%26hpos%3D1%26matching_block_id%3D17627004_89150832_2_1_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Ddistance_from_search%26sr_pri_blocks%3D17627004_89150832_2_1_0__284889%26srepoch%3D1788755172%26srpvid%3D543a1f312eab23a6%26type%3Dtotal%26ucfs%3D1%26", pricePoint: "splurge" },
        { platform: "Booking.com", label: "Casa Cuenca", url: "https://www.anrdoezrs.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fmx%2Fcasa-cuenca.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4Aof5-NQGwAIB0gIkNDBhNDA0OTItNWY4Mi00NTI5LWE2ZjUtN2FkNjI2ZTBhZGI52AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26checkin%3D2026-10-29%26checkout%3D2026-11-02%26dest_id%3D11826518%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26hpos%3D1%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26soh%3D1%26sr_order%3Dpopularity%26srepoch%3D1788755337%26srpvid%3De13f1f1b90a806d1%26type%3Dtotal%26ucfs%3D1%26%23no_availability_msg", pricePoint: "moderate" },
      ],
      editorialNote: "Condesa neighborhood character sourced from CasaGoliana.com's Roma-vs-Condesa comparison, Sep 2026. Hotel picks (Hotel CondesaDF, Casa Cuenca) sourced from BridgesAndBalloons.com and Hotel-Scoop.com boutique roundups; Google ratings via Places API lookup same session (CondesaDF 4.3/2,537 reviews, Casa Cuenca 4.4/67 reviews — smaller but above the thin-count threshold, noted explicitly in body copy). Multi-venue: MULTI_VENUE_RATINGS entry required, venueCount 2. Check-in/check-out times added 7 Sep 2026: Condesa df (3:00pm/12:00pm) and Casa Cuenca (3:00pm-midnight/12:00pm) sourced from Momondo/Tripadvisor and Booking.com/Trip.com listings respectively. Real addresses added 7 Sep 2026: Condesa df (Av. Veracruz 102, corroborated on Yelp and HotelPlanner listings) and Casa Cuenca (Cuernavaca 4, corroborated on Tablet Hotels and Michelin Guide listings — not listed on the hotel's own site). bookingLinks replaced 7 Sep 2026 with the founder's own real affiliate URLs (per feedback_affiliate_link_generation.md — identification only is done here, the founder generates the actual affiliate link) plus distinct per-hotel `label` values, after the original plain non-affiliate URLs were found to have been written in error during initial seeding.",
      sport: ["formula_one"],
      moodTags: ["quiet", "park-adjacent", "boutique"],
      interestCategories: ["accommodation"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "USD",
      bestSeasons: ["oct", "nov"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-06",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #10 seeded:", result.title, "|", result.id, "|", result.slug);
  console.log("REMINDER: add MULTI_VENUE_RATINGS entry, venueCount=2");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

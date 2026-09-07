import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "883ac422-5318-460f-819a-6ae784ac4b8c";
const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a";
const slug = "mexico-city-tacos-al-pastor-" + Date.now().toString(36);

const bodyContent = `Tacos al pastor didn't originate in Mexico — the trompo, the vertical spit the pork rotates on, came from Lebanese immigrants who arrived in central Mexico in the late 19th century bringing shawarma technique with them. What developed over the following decades is genuinely Mexican: pork instead of lamb, a marinade built on dried chiles and achiote, and the signature move of shaving a piece of pineapple off the top of the spit to land directly on the meat as it's carved into the tortilla. It's one of the clearest examples anywhere of immigrant food culture becoming something new rather than staying a transplant, and Mexico City is still the place to actually taste that history rather than read about it.

El Vilsito is the most distinctive entry point: an actual working car repair shop in the Narvarte neighborhood by day that turns into one of the city's most talked-about taquerias by night, mechanics' tools still visible around the trompo. It stays open until 3am on weekdays and 5am on weekends, and its specialty, the gringa de pastor (al pastor folded into a flour tortilla with melted cheese), is worth ordering alongside the standard corn tortilla tacos. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=16740546902627837206&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Los Cocuyos, in the Centro Histórico, is the classic late-night stand — order the campechano, a mix of maciza (lean pork) and longaniza sausage, alongside the al pastor itself, and don't skip the surtido if you want a genuine sampling of everything on the trompo in one order. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=14051425661561475567&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Taquería Orinoco is the third name that comes up constantly in Mexico City taco conversations, but it's worth knowing going in that it's a genuine multi-location chain rather than a single stand — there are Orinoco branches across several neighborhoods, including ones in Nápoles and Tabacalera, each independently reviewed. Rather than treat this as "one restaurant," pick whichever branch sits closest to where you're already staying (Roma Norte and Condesa both have reasonably close options) and expect the consistent quality the brand is known for rather than one specific "original" location's exact character. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=13179114513861336775&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Street tacos here typically run 15-30 pesos each — genuinely a few of them will cost less than a single coffee back home — so the standard approach is ordering two or three tacos across two or three different stands in one evening rather than filling up at just one.`;

const whyItsSpecial = `Mexico City has more Michelin-recognized restaurants than Paris now, and it's tempting to think that's the headline food story here — but the actual argument for this city's food scene is that a 25-cent taco from a stand and a several-thousand-peso tasting menu can both be genuinely world-class on the same night, from the same visit, without either one being the "real" version and the other a compromise. Al pastor specifically carries that argument better than almost any other dish, because it's simultaneously a serious piece of immigrant culinary history and something you can eat standing on a sidewalk for less than a dollar. That combination — depth and accessibility in the same bite — is rare enough to be worth building a real evening around.`;

const insiderTips = [
  "Order the gringa de pastor at El Vilsito specifically — it's the stand's signature variation (al pastor in a flour tortilla with melted cheese) and genuinely different from the standard corn-tortilla taco most other stands serve as their only option.",
  "Taquería Orinoco is a chain with multiple independent branches across the city, not one single location — check which branch is actually closest to your hotel rather than trying to seek out one specific 'original' address.",
];

const whatToAvoid = `Don't fill up at the first stand you try — the standard, and genuinely more rewarding, approach in Mexico City is ordering two or three tacos across two or three different stands in one evening, since each one's trompo has its own marinade and char. And don't assume the busiest-looking stand automatically means the best food — a long line at dinner rush is a genuine positive signal here, but some of the best al pastor comes from stands that are quieter earlier in the evening and only build a real queue after 10pm.`;

// No website field — multiple independent stands, no single shared official
// site; see Google Maps links in bodyContent for each. Per experience-seeder
// skill's hard rule, omit the key entirely rather than write "N/A" as a
// rendered placeholder value. Removed 7 Sep 2026 after shipping as "N/A".
const practicalInfo = {
  hours: "El Vilsito: evenings until 3am weekdays, 5am weekends. Los Cocuyos and Orinoco branches: check individual location hours, most run into the late evening",
  costRange: "Individual street tacos typically run 15-30 MXN each — a full meal of several tacos across one or two stands rarely exceeds a few hundred pesos per person",
  bookingMethod: "No reservations — these are walk-up street food stands, and part of the experience is being flexible about where you end up eating based on what's busy and what smells good.",
};

const gettingThere = "El Vilsito is in Narvarte, a short taxi or Metro ride from Roma Norte/Condesa; Los Cocuyos sits in the Centro Histórico near the Zócalo; Orinoco has branches across multiple neighborhoods, including locations convenient to Roma Norte and Condesa.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Tacos al Pastor & the City's Street Food Culture",
      subtitle: "A Lebanese spit-roasting technique that became Mexico City's defining street food",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Multiple — Narvarte, Centro Histórico, Roma/Condesa",
      address: "El Vilsito: Petén 15, Narvarte Poniente; Los Cocuyos: Bolívar 55, Centro Histórico; Taquería Orinoco: multiple branches, see body text",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Al pastor origin story (Lebanese immigration, trompo technique) sourced from Afar.com's 'true tale of tacos al pastor' feature, Sep 2026. Stand recommendations (El Vilsito, Los Cocuyos, Orinoco) sourced from TravelMexicoSolo.com and SolSalute.com taco guides. Google ratings via Places API lookup same session: El Vilsito 4.3/16,281 reviews, Los Cocuyos 4.1/13,957 reviews. Orinoco confirmed as multi-location chain (6 distinct branches found in search) rather than single venue — stated honestly in body copy, one representative branch rating (4.6/27,866) linked rather than implying a single canonical location. Multi-venue: MULTI_VENUE_RATINGS entry required, venueCount 3.",
      sport: ["formula_one"],
      moodTags: ["street-food", "authentic", "late-night"],
      interestCategories: ["food"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "budget",
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

  console.log("Experience #12 seeded:", result.title, "|", result.id, "|", result.slug);
  console.log("REMINDER: add MULTI_VENUE_RATINGS entry, venueCount=3");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

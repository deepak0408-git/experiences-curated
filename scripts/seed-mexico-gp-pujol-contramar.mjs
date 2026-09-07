import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "883ac422-5318-460f-819a-6ae784ac4b8c";
const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a";
const slug = "mexico-city-pujol-contramar-" + Date.now().toString(36);

const bodyContent = `Mexico City now has more Michelin-recognized restaurants than Paris, and the two names that come up before any others are Pujol and Contramar — genuinely different restaurants, both worth planning around, for different reasons.

Pujol is chef Enrique Olvera's tasting-menu restaurant in Polanco, and its most famous dish is mole madre — a mole sauce the kitchen has kept continuously alive and aged for years, served alongside a small dollop of that day's freshly made mole so you can taste the difference age makes side by side. The full tasting menu experience runs close to four hours across multiple courses, with an optional wine pairing, and it isn't a casual meal — it's a genuine occasion, priced and paced accordingly. Reservations open exactly 30 days ahead of any given date, released at midnight Mexico City time through Pujol's own website — nowhere else. Popular dates, especially weekends, have been known to fill within minutes of the calendar releasing. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=11653406765589265174&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Contramar sits in Roma Norte and could not be more different in tone — a bright, bustling, lunch-focused seafood restaurant from chef Gabriela Cámara that's been a fixture of the city's dining scene for years without ever feeling like a museum piece. The signature dish is the tuna tostada, served two ways side by side (one red, one green salsa) on the same plate, and it's genuinely one of the dishes people specifically fly to Mexico City to eat. Unlike Pujol, Contramar takes reservations through OpenTable or a direct phone call, and walk-ins are possible, though expect a real wait — sometimes up to two hours at peak times. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=1047725080642144831&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Between the two, the honest advice is to treat them as different kinds of trip highlights rather than a "which is better" question. Pujol is the one meal of the trip built entirely around the tasting-menu experience; Contramar is the lively, plate-sharing lunch you can genuinely enjoy without four hours set aside. Both are within a reasonable taxi ride of Roma Norte, Condesa, or Polanco, so neither one should force a change to where you're staying.`;

const whyItsSpecial = `The gap between "Mexico City has world-class fine dining" as a fact you read and actually understanding what that means is Pujol's mole madre — a dish that's been kept alive for years, evolving daily, served with the day's fresh version specifically so you can taste time itself as an ingredient. Contramar makes the opposite argument just as convincingly: that genuinely great cooking doesn't require ceremony, tasting menus, or four-hour sittings, and a lunch built around one perfect tostada can sit at the same level as a formal degustation. Together, they're the two ends of what makes this city's food scene worth taking seriously — not one style of excellence, but at least two entirely different ones operating at the same standard.`;

const insiderTips = [
  "Pujol's reservation calendar for any given date releases at midnight Mexico City time exactly 30 days ahead — if you have a specific date in mind, know the exact midnight and be ready on the site, since popular dates have filled within minutes of release.",
  "For Contramar, arriving 10 minutes before opening dramatically improves your odds of a walk-in table without the full wait — showing up at the advertised opening time itself is often already too late for a same-day seat during peak hours.",
];

const whatToAvoid = `Don't try to book Pujol through a third-party reservation platform or a hotel concierge service claiming special access — reservations are only released through Pujol's own website exactly 30 days out, and any other channel claiming to guarantee a table outside that window should be treated skeptically. And don't plan Contramar as a late dinner — it's a lunch-and-early-evening restaurant (open until 8pm both on weekdays and weekends), not a late-night destination the way some of the city's other big-name spots are.`;

const practicalInfo = {
  hours: "Pujol: dinner service, hours vary — check pujol.com.mx directly. Contramar: Mon-Fri 12pm-8pm, Sat-Sun 11am-8pm",
  costRange: "Pujol tasting menu runs several thousand pesos per person before wine pairing — a genuine splurge occasion. Contramar runs moderate-to-splurge for a full lunch with the signature tostadas and mains.",
  bookingMethod: "Pujol: reservations open exclusively via pujol.com.mx exactly 30 days ahead, released at midnight Mexico City time. Contramar: book via OpenTable or call directly; walk-ins possible with a wait, especially at peak times.",
  howToBook: "For Pujol, set a reminder for exactly 30 days before the date you want, and be on pujol.com.mx at midnight Mexico City time when the calendar releases — this is the only way in, no exceptions and no back channel through a concierge or booking service actually works here. For Contramar, if you don't manage to book ahead via OpenTable, call the restaurant directly at 55 5514 3169 to check same-day availability, or simply arrive 10 minutes before opening (11am weekends, 12pm weekdays) and ask for walk-in seating — that early arrival window is the single most reliable way to get seated without a reservation at all.",
  website: "https://www.pujol.com.mx, https://www.opentable.com/r/contramar-ciudad-de-mexico",
};

const gettingThere = "Pujol is in Polanco; Contramar is in Roma Norte. Both are a reasonable taxi or rideshare ride from any of the three neighborhoods recommended elsewhere in this pack (Roma Norte, Condesa, Polanco).";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Pujol, Contramar & the City's Michelin Scene",
      subtitle: "A four-hour tasting menu and a two-hour walk-in wait — book both differently",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Polanco / Roma Norte",
      address: "Pujol: Tennyson 133, Polanco; Contramar: Durango 200, Roma Norte",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Pujol booking mechanics (30-day window, midnight release) sourced from JoinPearl.co's 2026 Pujol booking guide and LivingTheDreamRTW.com's reservation guide, Sep 2026. Mole madre detail sourced from Wikipedia's Pujol restaurant entry. Contramar reservation/walk-in detail, phone number, and hours sourced from Tripadvisor, Mindtrip.ai, and the restaurant's OpenTable listing. Google ratings via Places API lookup same session: Pujol 4.4/6,036 reviews, Contramar 4.5/6,797 reviews.",
      sport: ["formula_one"],
      moodTags: ["fine-dining", "splurge", "must-book"],
      interestCategories: ["food"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "MXN",
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

  console.log("Experience #13 seeded:", result.title, "|", result.id, "|", result.slug);
  console.log("REMINDER: add MULTI_VENUE_RATINGS entry, venueCount=2 (Pujol + Contramar — need Places lookups)");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

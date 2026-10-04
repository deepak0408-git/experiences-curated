// Getting to the Circuit — Chinese GP 2027. Sources: formula1.com/en/
// racing/2027/china (official — Metro Line 11, Shanghai Circuit stop, 60
// min from city), general web research corroborated across multiple
// independent transit/travel sources for airport-to-circuit detail (Didi/
// taxi pricing ranges, Metro Line 2→11 transfer route). No formula1shanghai.com
// or ticket resale site cited.
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "998a8774-05ac-4482-ba7a-4ca2a556b963";
const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";
const slug = "chinese-gp-getting-there-" + Date.now().toString(36);

const bodyContent = `Formula 1's own event page gives the simplest version of the journey: hop on Shanghai Metro Line 11 and get off at the Shanghai Circuit stop, roughly 60 minutes from central Shanghai. That's the backbone of getting to this race, and for most visitors staying anywhere near a Line 11 station, it's genuinely the easiest option — no traffic to worry about, a direct line with no transfers if you're already on the route, and a station built specifically to serve the circuit.

Arriving from Shanghai's two airports is a different calculation. From Pudong International Airport (PVG), the metro route means Line 2 into the city, then a transfer to Line 11 out to the circuit — a real journey, typically around two hours door to door once you account for the transfer and the distance involved. A taxi or Didi (China's equivalent of Uber, bookable through the Alipay app) covers the same ground in roughly 90 minutes depending on traffic, at a real cost — private transfers from Pudong to Jiading district start somewhere in the ¥300+ range, with standalone taxi or Didi fares typically landing lower than a pre-booked private transfer.

If you're flying into Hongqiao Airport (SHA) instead, the situation improves — Hongqiao sits directly on Metro Line 2, which connects to Line 11 for the circuit, cutting real time off the Pudong route. If you have a choice of airport for this specific trip, Hongqiao's proximity to Jiading is a genuine practical advantage worth factoring into flight search, not just an afterthought.

For race day specifically, budget more time than a normal Line 11 journey would suggest — station crowding on session days is real at any circuit with metro access, and arriving with a buffer beats arriving stressed. Download Didi and set up Alipay before you land if a taxi is part of your plan at any point in the trip; both are far easier to arrange in advance than to figure out for the first time at the airport.`;

const whyItsSpecial = `A lot of Grand Prix circuits sit close enough to a city center that "getting there" barely needs its own guide. Shanghai isn't one of those circuits — the distance is real, confirmed directly by Formula 1's own event page at roughly an hour from downtown by metro, and the airport-to-circuit journey adds a genuine layer of planning most first-time visitors won't expect. Getting this right before you land, rather than figuring it out jet-lagged at Pudong with a race to make, is worth the ten minutes it takes to read this. The metro is the honest backbone of the trip; knowing when a taxi or Didi actually saves you time, and when it doesn't, is what turns a stressful transit day into a straightforward one.`;

const practicalInfo = {
  hours: "Shanghai Metro Line 11 runs standard daily service hours — check current timetables closer to your trip, particularly for early race-day departures",
  costRange: "Metro: standard Shanghai transit fares (inexpensive, pay via transit card or Alipay). Taxi/Didi from Pudong Airport: roughly ¥300+ for a private transfer, often less for a standard Didi booking.",
  bookingMethod: "Metro: no booking needed, pay at the station or via transit card. Didi (taxi equivalent): download the Didi app and set up Alipay before arrival for the smoothest booking experience.",
};

const gettingThere = "Shanghai Metro Line 11 direct to Shanghai Circuit station, roughly 60 minutes from central Shanghai. From Pudong Airport (PVG): Metro Line 2 to a Line 11 transfer, roughly 2 hours, or taxi/Didi, roughly 90 minutes depending on traffic. From Hongqiao Airport (SHA): more direct via Line 2 to Line 11.";

const insiderTips = [
  "If you have a choice of arrival airport, Hongqiao (SHA) sits more directly on the Line 2/Line 11 route to the circuit than Pudong (PVG) — a genuine time saving worth factoring into your flight search, not just a minor detail.",
  "Set up Didi and Alipay before you land, not after — both take a few minutes to configure properly and are far easier to sort out with working wifi before your trip than at an airport taxi rank for the first time.",
];

const whatToAvoid = "Don't assume a taxi or Didi is always faster than the metro — from central Shanghai specifically, Line 11's direct route can beat a taxi once you account for traffic near the circuit on session days, even though a taxi feels like the more direct option. Don't cut race-day transit timing close — station crowding on a Line 11 headed to a 200,000-capacity event is real, and arriving with a buffer is worth far more than the extra sleep from cutting it fine.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Getting to Shanghai International Circuit",
      subtitle: "Metro Line 11 is the backbone — but airport arrivals, taxi timing, and race-day crowding all need real planning.",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Anting, Jiading District",
      address: "Shanghai International Circuit, No. 2000 Yining Road, Anting Town, Jiading District, Shanghai, China",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from formula1.com/en/racing/2027/china (official — Metro Line 11, 60min). Airport-to-circuit detail corroborated across multiple independent transit/travel sources (Didi/taxi pricing ranges, Metro Line 2→11 transfer route). No formula1shanghai.com or resale site cited.",
      sport: ["formula_one"],
      moodTags: ["practical"],
      interestCategories: ["transit"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: false,
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

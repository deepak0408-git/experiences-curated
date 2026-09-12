import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb";
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const slug = "brazilian-gp-campos-do-jordao-daytrip-" + Date.now().toString(36);

const bodyContent = `Campos do Jordão sits roughly 1,700 metres up in the Serra da Mantiqueira, about a 2-hour drive from São Paulo, and it's the highest city in Brazil — which explains why it's nicknamed the "Brazilian Switzerland." Swiss, German, and Scottish influence shaped the town's architecture over the last century, and the result is a genuinely strange, charming contrast to São Paulo's modernist skyline: alpine-style buildings, a cooler climate, and a pace that feels imported from somewhere else entirely.

A typical day tour runs around 12 hours total, including the drive both ways, with stops at Palácio Boa Vista — the state governor's official residence, [carrying a strong, large-sample rating](https://maps.google.com/?cid=7840669418331014098&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) — and Ducha de Prata, a waterfall right in town with a craft market built around it. Vila Capivari and Vila Inglesa, the town's two most walkable central neighborhoods, are where most tours build in free time — Vila Capivari specifically has its own small cable-car-style ride up Morro do Elefante for panoramic views over the town and mountains, [a genuinely well-reviewed, if smaller-scale, attraction](https://maps.google.com/?cid=2368731371712976686&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA). The town is also known regionally for its chocolate production, and most tours build in a stop at a chocolate factory retail store on the way back to the city — regional wine and cheese sold alongside the chocolate itself.

At altitude and this far from the city, the climate genuinely shifts — cooler year-round than São Paulo, which is part of why the town became a resort destination in the first place. Food and drinks aren't typically included in the base tour price, so budget separately for lunch in one of the town's cafés or restaurants.`;

const whyItsSpecial = `Race weekends tend to get judged entirely on the track and the host city, and both are worth the trip on their own — but Campos do Jordão is the reminder that São Paulo state is bigger and stranger than the metro area most visitors ever see. A mountain town at nearly 1,700 metres, built by Swiss and German immigrants to look nothing like the rest of Brazil, sitting two hours from a circuit hosting Formula 1, is the kind of contrast that makes a trip memorable beyond the racing itself. It's a genuinely long day — 12 hours including the drive — but for anyone with a rest day built into their schedule, it's the single biggest change of scenery available from São Paulo.`;

const insiderTips = [
  "This is a genuinely full day given the 2-hour drive each way — reserve it for a rest day between race sessions rather than trying to fit it around a session day, since a 12-hour round trip leaves no real flexibility.",
  "Bring a layer you wouldn't normally pack for a São Paulo trip — the altitude here means noticeably cooler temperatures than the city, even in November, and it's easy to underdress if you're only thinking about the coastal city's climate.",
];

const whatToAvoid = `Don't plan this trip on a day you also want to attend a track session — the round-trip drive alone takes 4 hours, and combined with the time actually spent in the town, this genuinely occupies a full day. And don't skip lunch planning assuming the tour has it covered — food and drinks are typically excluded from the base tour price, so either bring a plan for lunch in town or budget for buying it there.`;

const practicalInfo = {
  hours: "Day tours typically run around 12 hours total including the 2-hour drive each way, departing São Paulo early morning",
  costRange: "Roughly US$115+ per person for a guided day tour including hotel pickup, transport, and attraction tickets; food and drinks extra",
  bookingMethod: "Book via Civitatis, GetYourGuide, or Viator — advance booking recommended given the early departure and full-day itinerary.",
  website: "https://www.civitatis.com/en/sao-paulo/day-trip-campos-jordao/",
};

const gettingThere = "Campos do Jordão sits roughly 170km (a 2-hour drive) from São Paulo in the Serra da Mantiqueira. Virtually all visitors reach it via an organized day tour or private car, given the distance and the multi-stop itinerary.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Campos do Jordão — Brazil's Mountain Town",
      subtitle: "The highest city in Brazil, built by European immigrants two hours from Interlagos",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Campos do Jordão (day trip from São Paulo)",
      address: "Campos do Jordão, São Paulo state, Brazil",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Tour structure (12-hour duration, Palácio Boa Vista, Vila Inglesa/Alto Capivari, Ducha de Prata waterfall/craft market, Vila Capivari free time with cable car, chocolate factory stop, food/drinks excluded, ~US$116 starting price) sourced directly from Civitatis' official tour listing via WebFetch, 11 Sep 2026. Town background (~1,700m altitude, highest city in Brazil, Swiss/German/Scottish architectural influence, 'Brazilian Switzerland' nickname) sourced from earlier destination-level research (multiple aggregator sources), cross-checked, 11 Sep 2026. Real Google Maps ratings confirmed via Places API, 11 Sep 2026: Boa Vista Palace 4.6/10,601 reviews; Morro do Elefante cable car 4.2/502 reviews. Multi-stop day-trip experience — inline links per named attraction per skill §2c; add MULTI_VENUE_RATINGS entry (venueCount: 2) to app/experience/[slug]/page.tsx in the same pass as any future edit.",
      sport: ["formula_one"],
      moodTags: ["scenic", "distinctive", "relaxing"],
      interestCategories: ["nature", "culture"],
      pace: "slow",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-11",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #21 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

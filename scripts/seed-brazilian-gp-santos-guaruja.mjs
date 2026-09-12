import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb";
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const slug = "brazilian-gp-santos-guaruja-daytrip-" + Date.now().toString(36);

const bodyContent = `Santos and Guarujá sit roughly 70km south of São Paulo, and together they're the coastal counterweight to the city's density — historic port streets, a genuine football pilgrimage site, and actual beaches, all reachable in a single day.

Santos is home to the Museu Pelé, housed inside the 19th-century Casarões do Valongo — shirts, boots, trophies, and honors from the career of Brazil's most famous footballer, [rated strongly by a large sample of visitors](https://maps.google.com/?cid=7185091842619527020&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA). A short distance away, the Monte Serrat funicular climbs to a genuine panoramic viewpoint over the port and coastline — [also well-reviewed](https://maps.google.com/?cid=7838878492077210349&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA), if on a smaller sample given its scale as an attraction. Santos itself is also home to the largest port in Latin America, and the historic center — walkable, with an optional electric tram — still carries real 19th and early-20th-century character from its coffee-export boom years.

Guarujá, connected by ferry, is where the day turns to beach — white sand, calmer seas than much of the Brazilian coast, and beachfront kiosks serving straightforward, good local food with your feet still in the sand. Most organized tours build the day exactly this way: history and football in Santos during the morning, funicular views, then ferry across to Guarujá for beach time and lunch in the afternoon.

Shared-group day tours run roughly US$95-150 per person depending on operator and exact itinerary, typically 8-12 hours including hotel pickup; private tours cost meaningfully more but add flexibility on pacing.`;

const whyItsSpecial = `A race weekend built entirely around Interlagos and central São Paulo risks feeling like one long urban stretch, however good the city is — Santos and Guarujá break that pattern completely. Standing inside the actual museum built around Pelé's career, in the city where he played his entire domestic career for Santos FC, connects the football culture that runs through so much of Brazilian identity directly to something concrete you can walk through. Following that with an actual beach afternoon, feet in white sand after a morning of history and a funicular ride, is a genuinely different day than anything the city itself offers — and it's an easy day to build around a rest day between race sessions.`;

const insiderTips = [
  "The Museu Pelé and the Coffee Museum are both closed Mondays — check your tour's exact day against this before booking if either museum is the reason you're going.",
  "Shared-group day tours run noticeably cheaper than private options (roughly US$95-150 vs. US$240+ per person) — a shared tour is the better value if you don't specifically need a private vehicle's flexibility on timing.",
];

const whatToAvoid = `Don't book a Monday for this trip if the Pelé Museum or Coffee Museum are priorities — both close that day, and you'd be left with the funicular, the historic center, and the beach but miss the specific football-history draw. And don't skip checking what's actually included before booking — lunch is typically NOT included in the base tour price on most listings, even though a beachfront kiosk lunch is usually built into the itinerary's timing, so budget separately for that meal.`;

const practicalInfo = {
  hours: "Day tours typically run 8-12 hours, departing São Paulo in the morning",
  costRange: "Shared-group tours: roughly US$95-150 per person. Private tours: US$240+ per person. Lunch typically not included.",
  bookingMethod: "Book via Viator, GetYourGuide, or a local operator such as AroundSP — check group size and exact itinerary (which museum, whether the historic tram is included) before booking.",
  website: "https://www.viator.com/Santos-tours/Day-Trips-and-Excursions/d4450-g5",
};

const gettingThere = "Santos and Guarujá sit roughly 70km (about 1-1.5 hours by road) south of São Paulo. Virtually all visitors reach them via an organized day tour with hotel pickup, given the multi-stop itinerary spanning two towns connected by ferry.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Santos & Guarujá — Football History and the Coast",
      subtitle: "The Pelé Museum, a cliffside funicular, and a beach afternoon 70km from São Paulo",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Santos & Guarujá (day trip from São Paulo)",
      address: "Santos and Guarujá, São Paulo state, Brazil",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Tour structure (Museu Pelé/Coffee Museum both closed Mondays, Monte Serrat funicular, Santos historic center with optional tram, Guarujá beach/kiosk lunch) sourced from Pelago's official tour listing (via WebFetch) and multiple aggregator day-trip descriptions, cross-checked, 11 Sep 2026. Per-person shared-group pricing (~US$95-150) vs. private tour pricing (~US$240+) sourced from Viator and TheAbroadGuide listings, 11 Sep 2026 — noting the initial Pelago listing's ~US$537-578 figure was a private/full-vehicle rate, not representative of standard per-person shared pricing, so the lower shared-group figures are cited as the more useful reference point. Real Google Maps ratings confirmed via Places API, 11 Sep 2026: Museu Pelé 4.6/9,914 reviews; Monte Serrat Funicular 4.7/700 reviews (smaller but still meaningful sample for a single attraction of this type). Multi-stop day-trip experience — inline links per named attraction per skill §2c; add MULTI_VENUE_RATINGS entry (venueCount: 2) to app/experience/[slug]/page.tsx in the same pass as any future edit.",
      sport: ["formula_one"],
      moodTags: ["scenic", "cultural", "relaxing"],
      interestCategories: ["culture", "nature", "sport"],
      pace: "moderate",
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

  console.log("Experience #20 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

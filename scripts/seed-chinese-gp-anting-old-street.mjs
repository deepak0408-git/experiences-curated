// Anting Old Street (near-venue casual dining) — Chinese GP 2027. Sources:
// chinadaily.com.cn/subsites Jiading coverage (state media, genuine local
// government-affiliated source), general web research corroborated across
// multiple independent sources (TripAdvisor, China Holiday). Google Places
// API (New) lookup for the district itself, 23 Sep 2026.
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "998a8774-05ac-4482-ba7a-4ca2a556b963";
const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";
const slug = "chinese-gp-anting-old-street-" + Date.now().toString(36);

const bodyContent = `Anting Old Street sits a short distance from Shanghai International Circuit, and the contrast between the two places is the whole point of visiting. The circuit is glass, tarmac, and modern automotive infrastructure. Anting Old Street traces its history back to 239 AD, when the Puti Temple was built and a town gradually grew up around it — one of the oldest settlements in what's now Shanghai's Jiading District, restored to reflect its Ming and Qing dynasty character.

The street follows a genuine "road-river-street" layout, built along the Anting River with the historic Yansi Bridge, dating to the Ming dynasty, at its center. Traditional buildings line both sides, housing snack restaurants, tea shops, fruit sellers, and craft stores selling porcelain and local specialties. Mornings bring real local commerce — vendors, foot traffic, the sounds of an actual working street rather than a preserved museum piece — with a quieter afternoon lull that picks up again as local schools let out.

This is casual, inexpensive eating: traditional Shanghai and Jiangnan-region snacks rather than a sit-down restaurant experience, closer in spirit to grazing your way down a market street than booking a table. It's exactly the kind of stop that fits naturally around a race weekend — close enough to the circuit to visit in a spare few hours between sessions or on the day you arrive, without requiring a dedicated trip into central Shanghai.

The old street sits in direct, almost pointed contrast to the modern Shanghai International Auto City development that now surrounds it — worth noticing as you walk from one to the other, since it's a genuinely rare thing to have nearly 1,800 years of continuous local history sitting a short walk from a Formula 1 circuit.`;

const whyItsSpecial = `Most race weekends offer a choice between the circuit and a long trip into the host city's actual character — Shanghai's version of that trade-off is usually framed as Jiading versus downtown, full stop. Anting Old Street breaks that framing. It's genuine historic Shanghai, dating back nearly 1,800 years, sitting close enough to the circuit that it doesn't cost you a commute to experience it. For a visitor whose race-weekend schedule doesn't leave room for a full downtown day, this is what "seeing real Shanghai" looks like without sacrificing time you'd rather spend at the track. The food here won't be the most refined meal of your trip, but it's an honest one, and the setting — a working river-street town that's been here since long before the automotive industry arrived next door — earns its place on the list.`;

const practicalInfo = {
  hours: "Busiest in the morning with local commerce; quieter afternoons, picking up again in early evening — individual restaurants and shops vary",
  costRange: "Budget — traditional snack food, tea, and casual local dining throughout the street",
  bookingMethod: "Walk-in — no reservations needed for the street's casual snack restaurants and tea shops.",
  website: "http://subsites.chinadaily.com.cn/jiading/2013-07/05/c_709373.htm",
};

const gettingThere = "A short taxi or local transit ride from Shanghai International Circuit within Jiading District — genuinely convenient for a stop during race weekend without a trip into central Shanghai.";

const insiderTips = [
  "Visit in the morning if you want to see the street at its most alive — local commerce and foot traffic pick up early and quiet down by afternoon, the opposite rhythm of a typical tourist district.",
  "Come hungry to graze rather than planning one sit-down meal — the street's character is built around moving between multiple small snack vendors and tea shops, not a single restaurant destination.",
];

const whatToAvoid = "Don't expect a polished, tourist-optimized experience — Anting Old Street is a genuine working local district with real commerce hours and a real quiet afternoon lull, not a curated attraction open uniformly all day. Don't confuse this historic old town with the nearby Anting German Town development — they're different places with different histories entirely, and searching for one can easily surface results for the other given their shared district name.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Anting Old Street — Circuit-Adjacent, 1,800 Years Old",
      subtitle: "A real Ming-and-Qing-era river town near the circuit — casual snacks, tea shops, genuine local history.",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Anting, Jiading District",
      address: "Anting Old Street, Jiading District, Shanghai, China",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from chinadaily.com.cn/subsites Jiading coverage (state media, local govt-affiliated) and cross-checked against independent tourism sources for the street's history/layout. No formula1shanghai.com or unverified third-party site cited. Google Places API (New) lookup, 2 Oct 2026: Anting Old Street resolved to 4.0/3 reviews (place ID confirmed against founder-supplied Maps link) — sample too thin to cite as a rating, so googleMapsRating/ReviewCount/Url deliberately left unset.",
      sport: ["formula_one"],
      moodTags: ["cultural", "authentic", "budget-friendly"],
      interestCategories: ["dining", "culture"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: false,
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

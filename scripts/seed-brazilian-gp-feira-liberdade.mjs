import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb";
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const slug = "brazilian-gp-feira-da-liberdade-" + Date.now().toString(36);

const bodyContent = `The Feira da Liberdade has run every Saturday and Sunday since 1975, set up around the Liberdade metro station in the heart of the neighborhood that grew from São Paulo's early-20th-century Japanese immigration. It started as a way to formally showcase the craft and food traditions of the Japanese and broader Asian community that had settled here, and five decades later it's still exactly that — not a tourist-oriented reproduction, but the same kind of weekend market the neighborhood has run for two generations.

Stalls sell traditional Japanese ornaments, jewelry, and clothing alongside genuinely good street food — sushi, takoyaki, and other Japanese and Asian dishes cooked to order rather than pre-packaged for a market crowd. Given the neighborhood's history, several stalls trace directly back to the agricultural and craft traditions Japanese immigrants brought with them in the early 1900s — flowers, rice, vegetables, mushrooms, and macrobiotic food specifically.

The market runs 9am-6pm both days, right by the same Liberdade metro station (Line 1, Blue) that serves the neighborhood's ramen restaurants — Aska and Lamen Kazu, covered elsewhere in this pack, sit an easy walk from the market itself, making a weekend late-morning market visit followed by a ramen lunch one of the more naturally paired half-days in the city.`;

const whyItsSpecial = `A weekend market that's run continuously since 1975 has survived on something other than novelty — it survives because a neighborhood keeps showing up for it. The Feira da Liberdade isn't staged for visitors; it's the same market Liberdade's own residents have used for decades to buy food and crafts on a Saturday morning, and that authenticity is exactly what separates it from a market built primarily around tourism. Walking through stalls selling the same kind of ornaments and cooking the same street food a Japanese-Brazilian community has made here for a century gives you a genuinely different read on São Paulo than any single museum or restaurant can.`;

const insiderTips = [
  "Go hungry — the food stalls here (sushi, takoyaki, and other cooked-to-order Japanese street food) are a genuine highlight, not an afterthought to the craft stalls, so don't fill up beforehand.",
  "Pair a market visit with lunch at Aska or Lamen Kazu, both an easy walk away — arriving at the market late morning and moving to ramen around midday avoids both the market's midday crowd peak and the restaurants' worst lines.",
];

const whatToAvoid = `Don't visit on a weekday expecting the market to be running — it operates Saturdays and Sundays only, 9am-6pm, so a weekday trip to Liberdade will find the square empty of stalls. And don't expect a purely quiet, contemplative browse — like most genuinely popular weekend street markets, it draws real crowds, especially by early afternoon, so early arrival suits anyone who wants to move through stalls without much jostling.`;

const practicalInfo = {
  hours: "Saturdays and Sundays, 9am-6pm",
  costRange: "Free to browse; food and crafts priced individually, generally inexpensive (a few dollars per item/dish)",
  bookingMethod: "No booking needed — just show up during operating hours.",
  website: "https://en.wikipedia.org/wiki/Liberdade_street_market",
};

const gettingThere = "Liberdade metro station (Line 1, Blue) sits directly at the market's edge — one of the most transit-direct attractions in central São Paulo.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Feira da Liberdade Weekend Market",
      subtitle: "Running every Saturday and Sunday since 1975 — the same market the neighborhood has always used",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Liberdade",
      address: "Praça da Liberdade, Liberdade, São Paulo, SP, Brazil",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Market history (1975 founding, weekend-only Sat-Sun 9am-6pm schedule, Japanese/Asian immigrant craft and food tradition) sourced from Wikipedia's dedicated Liberdade street market entry and LivetheWorld's activity guide, cross-checked, 11 Sep 2026. Google Maps rating check via Places API returned only thin samples for this market (best match: 'Feira Livre - Liberdade', 4.4/99 reviews; a second nearby listing showed 4.4/16 reviews) — per skill §2c's rule on thin review counts, this is noted honestly rather than cited as a confident rating; googleMapsRating left unset on this row since neither sample clears a meaningful confidence bar, and a street market's real reputation is better evidenced by its 50-year operating history than a thin Google sample.",
      sport: ["formula_one"],
      moodTags: ["cultural", "authentic", "budget-friendly"],
      interestCategories: ["culture", "food"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "budget",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-11",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #17 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

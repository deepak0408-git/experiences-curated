import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb";
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const slug = "brazilian-gp-liberdade-japanese-dining-" + Date.now().toString(36);

const bodyContent = `São Paulo has the largest population of Japanese descent of any city outside Japan, and Liberdade is the neighborhood that grew up around that community starting in the early 20th century. The food here isn't a themed district built for tourists — it's a genuine, generations-deep food culture, and two ramen shops in particular have become destinations in their own right, drawing lines that have nothing to do with novelty.

Restaurante Lamen ASKA keeps its menu genuinely narrow: two gyoza options, three lamen options, pork or chicken broth, nothing else. That narrowness is the point — everything on the menu gets full attention rather than a kitchen spreading itself across sushi, sashimi, and a dozen other dishes at once. Lines form before opening, and they're worth the wait; this is one of the most consistently well-reviewed restaurants in the entire neighborhood.

Lamen Kazu, a short walk away on Rua Thomaz Gonzaga, is arguably the more famous of the two specifically for its tonkotsu — a rich, genuinely long-simmered pork broth ramen that regulars describe as the reason they keep coming back regardless of the wait. Like Aska, expect a line, especially on weekends, and expect it to move for a genuine reason once you're inside.

Both restaurants sit inside walking distance of the Feira da Liberdade, the neighborhood's weekend street market (Saturdays and Sundays, 9am-6pm) — pairing a ramen lunch with a walk through the market's stalls of Japanese-Brazilian food, crafts, and ornaments is the single best way to spend a few hours in this part of the city.`;

const whyItsSpecial = `A lot of "Japantown" neighborhoods around the world have become more symbolic than functional — signage and gates commemorating a community that's since moved elsewhere. Liberdade isn't that. The lines outside Aska and Lamen Kazu aren't tourist lines; they're the same kind of line you'd find outside a genuinely great ramen shop in Tokyo, made up mostly of São Paulo residents who've been coming for years. [See live rating and reviews for Lamen ASKA](https://maps.google.com/?cid=5067517373091332203&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) and [Lamen Kazu](https://maps.google.com/?cid=4536772839955531305&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) — both carry real, sustained, large-sample ratings that back up the reputation rather than just a viral moment.`;

const insiderTips = [
  "Both restaurants form real lines before opening on weekends — if you want to minimize the wait, arrive right at opening on a weekday rather than midday on a Saturday, when the queue can genuinely stretch down the block.",
  "Pair either restaurant with a walk through the Feira da Liberdade street market (Saturdays and Sundays, 9am-6pm) — it's a short walk from both, and the combination of a ramen lunch and the market's stalls is the single best few-hour block you can plan in this neighborhood.",
];

const whatToAvoid = `Don't come to Aska expecting a full Japanese menu — it deliberately serves only lamen and gyoza, so if you want sushi or a broader menu, look elsewhere in the neighborhood rather than being surprised at the door. And don't skip the wait assuming a quieter weekday evening will be empty too — both restaurants are popular enough that even off-peak times can involve some wait, so build a little flexibility into your schedule rather than assuming a fixed arrival time will get you seated immediately.`;

const practicalInfo = {
  hours: "Both restaurants generally open for lunch and dinner service; check current hours directly as they can vary by day",
  costRange: "Genuinely affordable — expect roughly US$8-15 per person for a full ramen meal at either restaurant",
  bookingMethod: "No reservations — both operate on a walk-in, line-up basis.",
  website: "https://maps.google.com/?cid=5067517373091332203, https://maps.google.com/?cid=4536772839955531305",
};

const gettingThere = "Liberdade has its own metro station (Liberdade, Line 1 Blue), making it one of the most directly transit-accessible neighborhoods in central São Paulo. Both restaurants are within a short walk of the station.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Liberdade's Ramen Shops — Aska & Lamen Kazu",
      subtitle: "Real lines, real broth — the two ramen shops that define São Paulo's Japantown",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Liberdade",
      address: "Liberdade, São Paulo, SP, Brazil",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Neighborhood/community history (largest Japanese-descended population outside Japan, early 20th-century immigration) is well-established, widely-cited background, cross-referenced against Liberdade's own Wikipedia entry, 11 Sep 2026. Restaurant specifics (Aska's narrow lamen/gyoza-only menu, Lamen Kazu's tonkotsu reputation, both known for pre-opening lines) sourced from Tripadvisor's Liberdade Japanese-restaurant rankings and LeftTurnsTravel's dedicated Liberdade dining guide, 11 Sep 2026. Both confirmed currently operating with real, large-sample Google ratings via Places API, 11 Sep 2026: Restaurante Lamen ASKA 4.5/10,295 reviews (Rua Barão de Iguape, 260); Lamen Kazu 4.6/8,559 reviews (R. Thomaz Gonzaga, 87). Feira da Liberdade market days/hours (Sat-Sun, 9am-6pm) sourced from earlier destination-level research for this pack, cross-checked. Multi-venue experience — inline links per skill §2c; add MULTI_VENUE_RATINGS entry (venueCount: 2) to app/experience/[slug]/page.tsx in the same pass as any future edit.",
      sport: ["formula_one"],
      moodTags: ["authentic", "budget-friendly", "cultural"],
      interestCategories: ["food", "culture"],
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

  console.log("Experience #14 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

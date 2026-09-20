import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne
const EVENT_ID = "64792f75-c009-4070-a12b-23d7bd0a3a7f"; // Australian GP 2027
const slug = "first-timers-guide-albert-park-" + Date.now().toString(36);

const bodyContent = `First-time visitors to Albert Park underestimate two things: the noise and the crowd's discipline. Modern F1 cars are genuinely louder in person than broadcast ever conveys, especially near the fast sections — foam earplugs prevent the dull-headache feeling that a lot of first-timers mistake for tiredness by mid-afternoon. And on Park Pass general admission, the veterans around you have almost always committed to one primary viewing spot rather than roaming the circuit looking for something better — that discipline is worth copying, since constant repositioning tends to mean missing the actual racing while you walk.

There's no on-site parking, full stop — road closures around the circuit make driving in pointless even if you wanted to, and every guide agrees the free tram/train system is the only sensible way in. Inside the circuit, there's no public wifi, so download the official Grand Prix app before you leave for maps, timing screens, and session schedules rather than relying on data or hoping for a signal. There are no ATMs inside either — bring a card or cash sorted before you arrive.

Food and drink policy is more generous than a lot of first-timers expect: you can bring your own food and non-alcoholic drinks in, just not alcohol or glass containers, and hard eskies are out while soft coolers and polystyrene eskies are fine. If you'd rather buy inside, budget for it — circuit food runs at genuine event pricing (some novelty items have hit $30, most proper meals sit $10-15, a beer around $8, soft drink around $6) — and the smart move is eating during a practice session rather than in the 20 minutes right after a headline session ends, when every vendor queue triples.

Thursday and Friday are the days to actually explore the circuit — smaller crowds, easier movement between grandstands and general admission areas, and a good chance to scope out where you'll want to be on Saturday and Sunday before the weekend crowds arrive. Merchandise sizes and popular items also sell out by Sunday, so if there's a specific t-shirt or cap you want, shop early rather than assuming it'll still be there on race day.`;

const whyItsSpecial = `Every piece of first-timer advice for Albert Park points at the same underlying truth: this is a big, well-organised event that rewards a small amount of preparation disproportionately. The gap between someone who downloaded the app, brought earplugs, and picked a food strategy in advance, and someone who didn't, isn't a minor comfort difference — it's the difference between a smooth day and a frustrating one, at an event that's otherwise genuinely built to be enjoyable for newcomers.

None of this advice is complicated or expensive. It's mostly about knowing what to expect before you're standing in a food queue at 2pm wondering why nobody warned you, or reaching the fence with a headache you didn't need to have. A first Australian Grand Prix should be remembered for the racing and the atmosphere, not for the avoidable friction around it — and almost all of that friction is avoidable with information that's freely available, just not obvious until someone's told you.`;

const insiderTips = [
  "Download the official Grand Prix app before leaving your accommodation — there's no public wifi inside the circuit, and the app is the only reliable way to check session timing and circuit maps once you're through the gates.",
  "Eat during a practice session rather than immediately after qualifying or the race — food and drink queues at every vendor roughly triple in the 20 minutes after a headline session ends.",
];

const whatToAvoid = "Don't drive to Albert Park expecting to park nearby — road closures around the circuit make it genuinely impractical, and every official and independent guide points to free public transport as the only sensible option. And don't wait until Sunday to buy merchandise you want — popular sizes and items sell out well before race day, a genuinely common first-timer regret that's easy to avoid by shopping Thursday or Friday instead.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "First Timer's Guide — Etiquette & Crowd Culture",
      subtitle: "Why the noise, the food queues, and no on-site wifi catch out almost every first-time visitor.",
      slug,
      experienceType: "activity",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Albert Park Grand Prix Circuit",
      address: "Albert Park Grand Prix Circuit, 12 Aughtie Dr, Albert Park VIC 3206, Australia",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      editorialNote: "Sources: fanvoyageinsider.substack.com first-timer circuit guide (earlplug advice, one-spot discipline, no wifi/app download, no ATMs, merchandise timing), search summary of racv.com.au/who.com.au/nzherald.co.nz/secretmelbourne.com (BYO food/drink policy, on-site pricing examples — $30 sausage sizzle, $8 beer, $6 soft drink, $10-15 typical meals — queue timing around sessions). Verified 20 Sep 2026.",
      sport: ["formula_one"],
      moodTags: ["practical", "authentic"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-20",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created:", result.title, "|", result.id, "|", result.slug, "|", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

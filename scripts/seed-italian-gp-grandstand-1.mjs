import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b0d8f9a-911d-4cc7-8049-50e4685958ca"; // Milan
const EVENT_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e"; // Italian Grand Prix
const slug = "italian-gp-grandstand-1-centrale-" + Date.now().toString(36);

const bodyContent = `Grandstand 1 — the Centrale — sits opposite the start line, halfway down the pit straight, and it's the oldest grandstand still standing at Monza. It's also, by most accounts, the most expensive reserved seat at the circuit. Those two facts sit together for a reason: this is the view F1 has protected longest, because it's the one that shows you the whole shape of a race start without turning your head.

From here you get the grid, the lights, and the opening scramble into the Rettifilo chicane, plus a clean sightline across to the pit lane — pit stops play out in real time in front of you instead of arriving as a TV graphic seconds later. Seats in the high 50s and low 60s sit close to level with the start line itself; seat 58 in block 2 lines up almost exactly with the pole position marking, though those particular seats sell first and sell fast.

Sources disagree on exactly how sheltered this stand is. Some describe it as fully roofed. Others say only the upper rows carry cover and the lower rows sit exposed to the sky. What's consistent across every account: the stand faces east, so afternoon shade builds regardless of row, and a September Monza forecast that looks clear in the morning can still turn into a sharp, fast shower by mid-afternoon. If you're booking without a seating chart in front of you, plan as if the lower rows are exposed.

Seating itself is individual plastic bleacher chairs, not padded, arranged in rows A through M — A at the front, M at the back. A stadium cushion is a genuinely useful thing to bring for a three-day ticket here, and most regulars do. Entrance gates A and B both serve this stand, each roughly a 5 to 10 minute walk depending on where you're coming from inside the grounds.

What you don't get from Grandstand 1 is the middle and far side of the circuit — no sightline down to Turn 1 on the left, none of the Parabolica exit on the right. This is a start-and-pit-lane seat, not a whole-lap seat. If you want the podium ceremony specifically, Grandstand 26 further down the straight has the clearer view of that; Grandstand 1's real strength is everything that happens before the cars disappear from view, not after they cross the line.`;

const whyItsSpecial = `Every grandstand at Monza sells you a version of speed. Grandstand 1 sells you something closer to continuity. The stand has stood on this exact stretch of tarmac since 1938, which means the view from these seats has outlasted safety-car eras, aero regulation rewrites, entire championship generations. You're not watching from a rebuilt stand with a plaque explaining what used to be here. You're sitting where it already happened.

That history is also why it costs what it does. The premium isn't really about sightlines, though the pit-lane view is genuinely good — it's about being in the one seat at Monza that has watched every version of this race since before most current fans' grandparents were born. For a circuit that trades so heavily on its own age, Grandstand 1 is where that age is least abstract.`;

const insiderTips = [
  "Seats in the high 50s to low 60s sit closest to the actual start line — seat 58 in block 2 lines up almost exactly with the pole position marking — but they're the first to sell out, so decide fast if that specific sightline matters to you.",
  "Bring a stadium cushion. Seating is individual plastic bleacher chairs with no padding, and across a full practice-to-race weekend that adds up.",
];

const whatToAvoid = `Don't book Grandstand 1 expecting to see the whole lap — there's no sightline to Turn 1 on one side or the Parabolica exit on the other, so if you want to follow cars around more of the circuit, a different grandstand suits that better. And don't assume the lower rows are covered based on one source alone — accounts genuinely disagree on how much of this stand is roofed, so dress for possible sun and rain regardless of which row you land in.`;

const practicalInfo = {
  hours: "Gates open 07:00 on race weekend days; grid formation and race start on Sunday afternoon",
  costRange: "Historically the most expensive 3-day grandstand ticket at Monza; 2027 pricing not yet released as of Sep 2026",
  bookingMethod: "Book via the official monzanet.it ticket store once 2027 sales open — join the site's notification waitlist to be alerted.",
  website: "https://www.monzanet.it/en/tickets/",
};

const gettingThere = "Gates A and B both serve Grandstand 1, each a 5-10 minute walk from the stand depending on your route inside the grounds.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Grandstand 1 — Centrale",
      subtitle: "Monza's oldest and most expensive seat — the start line and pit lane, from the same tarmac since 1938",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Monza",
      address: "Autodromo Nazionale Monza, Parco di Monza, 20900 Monza MB, Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Location, view, seating structure, and pricing-tier positioning sourced from f1italy.com's official Grandstand 1 Centrale product page and oversteer48.com's independent seating guide, cross-checked 18 Sep 2026 — the two sources disagree on roof coverage (fully covered vs. upper-rows-only), noted honestly in the copy rather than picking one arbitrarily. 2027 pricing not yet published anywhere (confirmed via official F1 ticketing, Monzanet, and f1italy.com, all showing 'Coming soon' as of this research).",
      sport: ["formula_one"],
      moodTags: ["electric", "authentic"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "splurge",
      budgetCurrency: "EUR",
      bestSeasons: ["sep"],
      advanceBookingRequired: true,
      advanceBookingDays: 180,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-18",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

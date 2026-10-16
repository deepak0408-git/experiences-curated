import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

// Rewrite of the archived "Hungaroring Grandstand" experience (16 Oct 2026),
// as part of the grandstand-experience restructure following the Ticket
// Intelligence build. Covers BOTH tiers of the rebuilt main grandstand
// (Hungaroring + Hungaroring Platinum) in one piece, since they're the same
// physical structure with one price-tier distinction, matching how Italian
// GP's own Hotels spoke treats a two-tier product as one experience.
// Real sector/row detail sourced from oversteer48.com's two dedicated
// reviews (hungaroring-grandstand, hungaroring-platinum-grandstand) and
// gpdestinations.com's review — all three corroborate the core facts
// (17 sectors A-R skipping I, 17 rows standard tier; 15 sectors A-P, 5 rows
// Platinum; only covered stand at the circuit; replaced "Super Gold" in the
// 2025 reconstruction). Pricing grounded in this event's own seeded
// planner_ticket_tier_cost (tier3: T1/Hungaroring/Hungaroring Platinum,
// $540-799) per the experience-researcher skill §2d, not independently
// guessed.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const slug = "hungaroring-grandstand-both-tiers-" + Date.now().toString(36);

const bodyContent = `The Hungaroring's old Super Gold stand came down ahead of the 2025 race, and what went up in its place is the closest thing this circuit has to a proper modern grandstand: two tiers, opposite the pit garages, the only roof at the entire track. Regular Hungaroring tickets buy the lower deck, 17 sectors lettered A through R (there's no sector I), 17 rows each. Platinum buys the smaller upper deck directly above it, 15 sectors, only 5 rows, and full weather protection the lower tier doesn't quite manage in its front rows.

What you're actually watching from here is the start-finish straight, not a single corner. Sectors A and B, at the Turn 1 end, catch cars braking into the race's one reliable passing zone. Sectors P, Q and R, at the opposite end, sit level with the start line and the podium, with four screens mounted on the pit buildings across the track so you're never watching a gap. Sector Q row 2 puts you close enough to the line to feel the start, though the pit wall blocks most of the pit lane from that low down — row 10 or higher in P through R is the better seat if you want both the line and a clean view over the wall.

Platinum's real argument isn't the extra row count, it's the guarantee. Lower-deck seats in the front few rows still get rained on despite the roof, since the structure sits too high to fully shelter them, and the open sides don't help either. Upper-deck seats sit further back under the same roofline and stay dry. That's worth something specific in a Hungarian July, when the forecast can turn from clear to a short, hard downpour inside twenty minutes.

Neither tier is built for corner-by-corner drama. You're not going to see much actual overtaking from the pit straight itself, most of that happens at Turn 1 or through the Chicane, both a walk away. What you get instead is the start, any safety car restart, pit stops in real time, and the sprint to the flag, which is arguably the set of moments that decide a Hungaroring race more than any single corner does. If that trade sounds backwards, the T1 grandstand next door sells the opposite one.`;

const whyItsSpecial = `Most Hungaroring grandstands ask you to commit to one corner and live with whatever that corner gives you that day. This one doesn't. You get the start, you get stops, you get the restart if there's a safety car, and you get the run to the flag, all without turning your head. That's a genuinely different way to watch a Grand Prix, less about chasing one dramatic braking zone and more about seeing the shape of the whole race unfold in front of you.

The roof matters more here than at most circuits. Late July in the valley around Mogyoród runs hot enough that shade alone is worth paying for, and the storms that roll through tend to arrive fast and leave just as quickly. Being dry and shaded while General Admission scrambles for cover below the tree line isn't a small thing over three full days. Platinum sells that certainty outright; the standard tier sells most of it for less, if you're willing to risk the front rows on a dry forecast.`;

const insiderTips = [
  "If you want the start line, the finish, and the podium in one sightline without the Platinum premium, book standard Hungaroring seats in Sector P, Q or R, row 10 or above — high enough to clear the pit wall, still on the cheaper tier.",
  "Sector Q, row 2 looks appealing for its proximity to the start line but actually gives one of the worst pit-lane views in the whole stand, the wall sits right in your eyeline from that low — trade a few metres of closeness for height instead.",
  "Weather-check your actual dates before deciding between tiers, not just the week's general forecast — a hard but brief Hungaroring storm is common enough in July that a clear morning doesn't rule one out by afternoon.",
];

const whatToAvoid = `Don't buy here expecting corner-by-corner battling, the sightline is wide and pit-straight-focused, which means long stretches with no overtaking at all between the start and whatever happens at the flag. And if you're driving, don't assume parking right behind the stand is free — the lot just inside Gate 2 switched to paid parking from 2026, with premium paid spaces also sold directly behind the Hungaroring grandstand itself; the free lots are further out, outside the circuit entirely.`;

const practicalInfo = {
  hours: "Gates typically open around 8am on race weekend days; grandstand seating holds for the full day once sessions begin",
  costRange: "Standard Hungaroring tier roughly US$540-702 (3-day); Platinum tier roughly US$702-799 (3-day) — both well above General Admission, reflecting the roof and main-straight position",
  bookingMethod: "Book via the official reseller gpticketshop.hu or tickets.formula1.com. The covered tier is the circuit's most weather-reliable seat and sells through accordingly — book months rather than weeks ahead if a dry, shaded seat matters to your trip.",
  website: "https://www.gpticketshop.hu, https://tickets.formula1.com/en/f1-3277-hungary",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Hungaroring Grandstand — Standard & Platinum",
      subtitle: "The circuit's only roof, opposite the pits, with the start line, podium and flag all in one sightline.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Hungaroring, Mogyoród",
      address: "Hungaroring, 2146 Mogyoród, Hungary",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere: "M2 metro to Örs vezér tere, then HÉV suburban rail toward Kerepes, then the free circuit shuttle to Gate 7 — the grandstand's own nearest entrance.",
      editorialNote: "Sources: oversteer48.com/hungaroring-grandstand (sector/row layout, best-seat recommendation), oversteer48.com/hungaroring-platinum-grandstand (Platinum tier detail), gpdestinations.com/hungarian-grand-prix-hungaroring-grandstand-review (pricing corroboration), hungaroring.hu's official 2026 FAQ (Gate 2 paid parking from 2026). Pricing grounded in seeded planner_ticket_tier_cost tier3 row for this event ($540-799, sourced from gpticketshop.hu's real 2026 Weekend prices, converted to USD). Verified 16 Oct 2026. Rewrite of the archived 'Hungaroring Grandstand' experience, now covering both tiers in one piece and adding real sector/row-level detail the original lacked.",
      sport: ["formula_one"],
      moodTags: ["comfortable", "panoramic", "premium"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "USD",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-10-16",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b0d8f9a-911d-4cc7-8049-50e4685958ca"; // Milan
const EVENT_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e"; // Italian Grand Prix
const slug = "italian-gp-grandstand-5-piscina-" + Date.now().toString(36);

const bodyContent = `Grandstand 5 — locals call it the Piscina, after a swimming pool that used to sit nearby — is on the left side of the start/finish straight, a short walk past the start line and roughly midway to the Prima Variante, Monza's opening chicane. It's not the seat for a clean, wide view of the podium or the grid. It's the seat for sound.

Cars leave the grid at full throttle and hold it almost all the way to the Prima Variante braking zone, which means Grandstand 5 catches them at close to their loudest and fastest, right before they stand on the brakes for Turn 1. If Grandstand 1 sells you history and the podium sightline, Grandstand 5 sells you proximity to raw acceleration — genuinely one of the more visceral seats at the circuit, even if the sightline itself is narrower than the marquee stands further down the straight.

Seating is reserved and covered, with guaranteed group seating for parties booking together, TV screens for the parts of the lap you can't see from your seat, and access to the F1 Monza Fanzone. The stand runs as a 3-day package — practice, qualifying, and race — rather than single-day tickets. For the 2027 Italian Grand Prix (3-5 September), monzanet.it has already listed a 3-day price of €989, discounted to €959.

What you're trading for that proximity to the start-line acceleration is width of view. Grandstand 5 doesn't give you the Prima Variante's actual braking and passing action the way a stand positioned directly at the chicane would, and it doesn't give you the grid or podium the way Grandstand 1 does. It's genuinely a specialist's seat — the one you pick if you've already done Monza once and want to feel the start differently the second time, not the one you pick as your only Monza grandstand if you've never been.`;

const whyItsSpecial = `Most first-time advice about Monza points you toward the start/finish straight for the grid and the podium, which is correct advice and also incomplete. Grandstand 5 is what the straight sounds like from the ground, at the exact moment twenty cars are still accelerating rather than settled into a rhythm. That's a genuinely different sensory experience from watching the same cars glide past at speed further down the lap.

The Piscina name is a small, easy-to-miss piece of Monza's own layered history — a nickname surviving from a pool that isn't there anymore, still used by locals and regulars even though nothing about the current grandstand references water at all. It's the kind of detail that separates someone who's actually spent time at this circuit from someone reading a seating chart for the first time.`;

const insiderTips = [
  "This is a genuinely loud seat — cars are still at or near full acceleration when they pass, before the Prima Variante braking zone. If you've only ever watched Monza from a mid-lap grandstand, the difference in intensity here is real, not marketing copy.",
  "2027 pricing is already live for this specific stand (€989, discounted to €959 for 3 days) even though many other Monza grandstands still show 'Coming soon' — worth checking directly on monzanet.it rather than assuming no 2027 prices exist anywhere yet.",
];

const whatToAvoid = `Don't pick Grandstand 5 as your only Monza grandstand if this is your first visit and you want the classic grid-and-podium experience — its sightline is narrower than Grandstand 1 or 26, and it trades that view for proximity to acceleration sound instead. And don't expect a clear view of the actual Prima Variante braking and passing action from here — you're positioned for the run-up to the chicane, not the chicane itself.`;

const practicalInfo = {
  hours: "Gates open 07:00 on race weekend days; grid formation and race start on Sunday afternoon",
  costRange: "€989 for a 3-day pass, discounted to €959 (2027 pricing, confirmed live on monzanet.it as of Sep 2026)",
  bookingMethod: "Book directly via monzanet.it/en/tickets/ — 3-day reserved seating only, no single-day option shown.",
  website: "https://www.monzanet.it/en/tickets/",
};

const gettingThere = "Positioned on the left side of the start/finish straight — accessible from Gate A/B, the same entrance serving the start-line grandstands.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Grandstand 5 — Piscina",
      subtitle: "Full-throttle acceleration off the start line, caught at close range before the Prima Variante braking zone",
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
      editorialNote: "Location (left side of start/finish straight, midway to the Prima Variante), the 'Piscina' name origin, and real, confirmed 2027 pricing (€989/€959, live as of this research) sourced from f1italy.com's official Grandstand 5 product page and oversteer48.com's independent seating guide, cross-checked 18 Sep 2026.",
      sport: ["formula_one"],
      moodTags: ["electric"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "splurge",
      budgetCurrency: "EUR",
      budgetMinCost: "959",
      budgetMaxCost: "989",
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

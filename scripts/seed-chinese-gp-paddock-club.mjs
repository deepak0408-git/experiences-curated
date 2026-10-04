// F1 Paddock Club / Hospitality — Chinese GP 2027. Sources:
// ticketing.formula1.com/hospitality/china (official — Paddock Club exists,
// panoramic vantage point, Gordon Ramsay at the F1 Paddock named),
// f1experiences.com/2027-chinese-grand-prix (Starter/Hero/Podium package
// tiers, real inclusions). No third-party hospitality reseller cited per
// founder instruction, 23 Sep 2026.
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "998a8774-05ac-4482-ba7a-4ca2a556b963";
const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";
const slug = "chinese-gp-paddock-club-" + Date.now().toString(36);

const bodyContent = `F1's own top hospitality product — the F1 Paddock Club — is confirmed for the 2027 Chinese Grand Prix, positioned directly above the Shanghai International Circuit pits with what F1's own ticketing site describes as a "panoramic vantage point" over the race. It's the same product sold at every round of the championship, and Shanghai's version adds a genuinely distinct feature: Gordon Ramsay at the F1 Paddock, a dedicated dining concept inside the hospitality suite rather than a generic catering line, confirmed directly by name on F1's own site.

Below Paddock Club sits a real tiered structure, currently sold through F1 Experiences, the sport's official hospitality and travel partner. Three tiers exist for 2027 as of this writing:

Starter (Thursday–Sunday) pairs a Grandstand B or H/K seat with the Aramco F1 Pit Lane Walk, a guided track tour, a championship trophy photo opportunity, and an F1 Experiences gift — the entry point into hospitality-adjacent extras without full Paddock Club access.

Hero (Thursday–Sunday) steps up to a Grandstand A or B seat and adds "Inside F1" access on top of the same pit lane walk, track tour, and trophy photo.

Podium | A (Friday–Sunday) is the tier that gets closest to Paddock Club territory without technically being it — a Grandstand A seat plus genuine F1 Podium access and photo, Paddock Insider access, pit area access, and an FIA Safety Car inspection viewing.

None of these tiers show 2027 pricing yet; F1 Experiences is taking deposits for priority access ahead of a full on-sale, and the full Paddock Club product itself is still marked "full details announced soon" on F1's own hospitality page. What's confirmed is the structure: a genuine ladder from grandstand-plus-extras up through near-Paddock access, with the real Paddock Club sitting above all of it as the top tier once its own 2027 details go live.`;

const whyItsSpecial = `Most Grands Prix sell hospitality as a single expensive tier and everything else as "just a ticket." Shanghai's structure, at least as F1 Experiences has built it for 2027, is more honest about the gap between those two things — Starter and Hero give you real added extras (a pit lane walk, a track tour, genuine proximity to the paddock) without the full Paddock Club price tag, while Podium | A gets you to the actual podium and pit area, which is as close as most fans will ever stand to a Grand Prix result being decided. The real Paddock Club sits above all of it, and the fact that F1 built a specific Gordon Ramsay dining concept into Shanghai's version — not just a generic catering line — says something about how seriously the sport is treating this circuit's hospitality tier for 2027. Whichever level you choose, the ladder itself is the point: there's a real, considered step between a grandstand seat and the top of the sport's hospitality offering, not just an enormous price cliff between the two.`;

const practicalInfo = {
  hours: "Gate/session times TBC for 2027 — check formula1.com closer to the event",
  costRange: "2027 pricing not yet published for Paddock Club or F1 Experiences tiers as of Sep 2026",
  bookingMethod: "Paddock Club: join the hospitality waitlist at ticketing.formula1.com/hospitality/china for pre-sale access. Starter, Hero, and Podium | A tiers: reserve a priority-access deposit at f1experiences.com/2027-chinese-grand-prix.",
  website: "https://ticketing.formula1.com/hospitality/china/, https://f1experiences.com/2027-chinese-grand-prix",
};

const gettingThere = "Shanghai Metro Line 11 to Shanghai Circuit station — roughly 60 minutes from central Shanghai — then follow dedicated hospitality/Paddock Club signage to the entrance above the pit lane; F1 Experiences package holders check their confirmation for the specific grandstand entrance tied to their tier.";

const insiderTips = [
  "Deposits for F1 Experiences' 2027 tiers are open now, ahead of full pricing — placing one secures priority access without committing to a final price, worth doing early if Podium | A or Hero is the plan, since these are the tiers most likely to sell out first once pricing lands.",
  "Gordon Ramsay at the F1 Paddock is a named, specific dining concept inside Shanghai's Paddock Club — not just generic hospitality catering — worth knowing about if food quality is a real factor in which hospitality tier you choose.",
];

const whatToAvoid = "Don't confuse F1 Experiences' Starter/Hero/Podium tiers with the full F1 Paddock Club — they're related but distinct products, and only Paddock Club itself gets you the pit-side panoramic suite and open-bar hospitality; the F1 Experiences tiers are grandstand seats bundled with real but more limited extras. Don't wait until pricing is fully published to start planning — with 2027 tiers already accepting deposits, the earliest movers get priority access before general on-sale, and Shanghai's Paddock Club and top F1 Experiences tiers have historically sold out ahead of race week in other markets.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "F1 Paddock Club & Hospitality Tiers — China 2027",
      subtitle: "From a grandstand-plus-extras Starter tier up to full Paddock Club — Shanghai's real hospitality ladder, tier by tier.",
      slug,
      experienceType: "fan_experience",
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
      editorialNote: "Sourced from ticketing.formula1.com/hospitality/china (official — Paddock Club, Gordon Ramsay dining concept) and f1experiences.com/2027-chinese-grand-prix (official F1 hospitality/travel partner — Starter/Hero/Podium tier inclusions). No third-party hospitality reseller cited per founder instruction, 23 Sep 2026. 2027 pricing not yet published for any tier — stated honestly as TBC.",
      sport: ["formula_one"],
      moodTags: ["luxurious", "exclusive"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "luxury",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: true,
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

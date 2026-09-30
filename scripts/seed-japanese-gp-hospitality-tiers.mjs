// Seed: "Suzuka's Hospitality Tiers — Beyond Paddock Club" — experience #6/20
// for Japanese Grand Prix 2027 (Suzuka).
//
// Sources (verified 21 Sep 2026):
// - f1experiences.com/2027-japanese-grand-prix/champions-club (Champions Club location/inclusions)
// - f1experiences.com/2025-japanese-grand-prix/paddock-club-3-days-f1-experiences-suite (Paddock Club inclusions)
// - tracksideculture.com/guides/suzuka-vip-hospitality; grandprixgetaway.com 2026 hospitality guide
//   (House 44, corner suites, team suite hospitality — noted as real, named tiers; full 2027
//   package details "to be announced" per search results, stated honestly rather than invented)
//
// CORRECTED 22 Sep 2026: this script's website/bookingMethod referenced
// japan.gp, which is an affiliate site, not the official F1 ticketing site.
// Live DB row corrected to ticketing.formula1.com/japan via
// scripts/_fix-japan-gp-official-urls.mjs. This file is left as the
// historical record of what actually ran — do not re-run it, and do not
// treat its japan.gp values below as current truth.
//
// UPDATED 23 Sep 2026: real, confirmed 2027 F1 Experiences package pricing
// added, sourced from founder-supplied screenshots of the live checkout at
// f1experiences.com/2027-japanese-grand-prix/hero (Hero | Main Grandstand V2
// $2,969.00, Hero | Grandstand B2 $2,199.00, both + processing fee, USD) and
// f1experiences.com/2027-japanese-grand-prix/champions-club (Champions Club
// $4,949.00 + processing fee, USD). Champions Club inclusions independently
// confirmed via direct fetch of that page the same day. Hero is a distinct,
// cheaper F1 Experiences product — a named grandstand seat (not a hospitality
// lounge) bundled with the same pit lane walk / track tour / trophy photo
// extras — added here as the accessible entry point below Champions Club.
// Pricing dynamically loads via JS and is not fetchable directly; figures
// below are taken from the founder's own screenshots of the live page.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9a26a4f4-2d3b-4e68-9bc3-ce2b55bb15e9";
const EVENT_ID = "9fe13c2e-37d1-49f0-8a48-d3ea40186fe4";
const slug = "japanese-gp-suzuka-hospitality-tiers";

const bodyContent = `Paddock Club gets named more than any other hospitality product at Suzuka, but it isn't the only real option, and treating it as the sole choice means missing a genuine mid-tier alternative that costs less and still delivers a real paddock experience.

F1 Paddock Club sits directly above the pit building, looking down over the start-finish straight and the pit lane below. The package includes premium open bars, curated local food menus, daily pit lane walks across Friday, Saturday, and Sunday, and — the detail that separates it from every grandstand ticket at any price — a lap of the circuit on the back of a flatbed truck with expert hosts, past the spots where the weekend's real history happens. Depending on the specific package, meet-and-greets with current or former F1 drivers are included too.

Champions Club is the tier most people don't know exists. It sits in the same building, directly above the team garages in the main pit structure, with the same view of the main straight, pit lane, and grid preparations — but at a genuinely different price point and access level. The inclusions are real: all-day food and drink including a proper curated lunch and open bar, F1 insider appearances from drivers, executives, or media figures, a grid walk with a professional photo at the championship trophy, and one assigned day of guided paddock tour access across the three-day weekend. It's not a scaled-down Paddock Club — it's a genuinely separate product built for people who want real paddock access without the top tier's full price. Confirmed 2027 pricing direct from F1 Experiences: US$4,949 per person plus processing fee.

Below Champions Club sits Hero, F1 Experiences' most accessible package at Suzuka — and worth understanding separately, because it isn't a hospitality lounge at all. Hero is a named grandstand seat, either Main Grandstand V2 (seat-back style seating, giant screen viewing, panoramic views over the main straight) or Grandstand B2 (bleacher-style seating, roving access on Friday, reserved seating Saturday and Sunday at the outside of the first two corners), bundled with the same walk-on extras the lounge tiers get: an exclusive Aramco F1 pit lane walk, a guided track tour, a championship trophy photo, and an F1 Experiences gift redeemable through F1 Authentics. Confirmed 2027 pricing: US$2,969 for Main Grandstand V2, US$2,199 for Grandstand B2, both plus processing fee.

Beyond these three named packages, Suzuka's 2027 hospitality lineup is reported to include further options — a design-led alternative called House 44, premium suites near the S-curves section of the circuit, and team-branded hospitality from outfits like Ferrari, Red Bull, McLaren, and Mercedes offering garage access and driver contact. Full 2027 package details for these hadn't been published as of this writing, so treat them as real, confirmed-to-exist tiers worth watching for rather than fully bookable products yet.

Every hospitality tier at Suzuka shares one real risk: they sell out, and the more exclusive tiers sell out first. If a genuine hospitality weekend is the goal rather than a grandstand seat, deciding between Paddock Club, Champions Club, and Hero — and watching for the announcement of the others — is worth doing well before the weekend gets close.`;

const whyItsSpecial = `The gap between "I want the best seat at the circuit" and "I want the best hospitality experience" is real, and Suzuka's tier structure makes that gap concrete. Paddock Club is the obvious, most-marketed choice, but Champions Club sits in the exact same building with a genuinely comparable view and most of the same real inclusions — the pit lane views, the food and drink, the paddock access — at what's clearly built to be the more accessible entry point into that world.

Knowing that Champions Club exists changes the decision entirely for anyone who assumed hospitality at Suzuka meant one product at one price. It doesn't, and the difference between picking the right tier and defaulting to the only one you'd heard of is a real amount of money for a comparable weekend.`;

const insiderTips = [
  "Champions Club shares Paddock Club's building and its view of the main straight and pit lane — if the full Paddock Club price is the barrier, this is the tier to look at before assuming hospitality is out of reach entirely.",
  "Hero is genuinely the most accessible F1 Experiences package at Suzuka — a real grandstand seat plus the pit lane walk and track tour, at roughly half of Champions Club's price — worth considering if you want the walk-on extras without paying for a lounge you might not use.",
];

const whatToAvoid = `Don't assume Champions Club is a watered-down Paddock Club — it's a genuinely separate product with its own real inclusions (grid walk, guided paddock tour day, insider appearances), not a discount version of the top tier. Don't confuse Hero with a hospitality package — it's a grandstand seat with walk-on extras, not a lounge with food and open bar, so if all-day dining and drinks are what you actually want, Champions Club or Paddock Club is the right tier, not Hero.`;

const practicalInfo = {
  hours: "Hospitality access typically follows Friday-Sunday race weekend hours — exact 2027 schedule not yet published",
  costRange: "Confirmed 2027 F1 Experiences pricing, per person plus processing fee, USD: Hero | Grandstand B2 US$2,199, Hero | Main Grandstand V2 US$2,969, Champions Club US$4,949. Paddock Club sits above Champions Club; exact 2027 Paddock Club figure not yet published.",
  bookingMethod: "Available via official F1 Experiences packages (f1experiences.com/2027-japanese-grand-prix) and authorized hospitality operators (e.g. GP Management, Edge Global Events).",
  howToBook:
    "If you're weighing Paddock Club against Champions Club, ask directly whether the flatbed-truck circuit lap and driver meet-and-greet are included in your specific package tier — these vary by exact Paddock Club product and aren't guaranteed at every price point within it. F1 Experiences' own packages are the most consistently documented route to Paddock Club, Champions Club, and Hero; for House 44, the S-curves suites, or team hospitality once announced, expect a much shorter booking window given the smaller inventory of team-branded and design-led suites.",
  website: "https://f1experiences.com/2027-japanese-grand-prix",
};

// UPDATED 22 Sep 2026 (live DB, not this const): getting_there now carries the
// full Nagoya Station -> Suzuka Circuit Ino Station route detail directly,
// per founder's instruction to put it on every in-circuit experience rather
// than only cross-referencing the dedicated Getting to Suzuka experience.
const gettingThere = "See the dedicated Getting to Suzuka experience for full transit detail from Nagoya and the circuit's rail/shuttle connections.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Suzuka's Hospitality Tiers — Beyond Paddock Club",
      subtitle: "Paddock Club, Champions Club, Hero, and the real alternatives — what each tier actually includes and costs.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Suzuka Circuit",
      address: "Suzuka Circuit, 7992 Ino-cho, Suzuka, Mie 510-0295, Japan",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sources: f1experiences.com Champions Club and Paddock Club package pages (verified 21 Sep 2026), tracksideculture.com and grandprixgetaway.com 2026 hospitality guides (House 44, S-curves suites, team hospitality — noted as real reported tiers, full 2027 details unpublished, stated honestly per skill §2a-3). Confirmed 2027 pricing for Hero (Main Grandstand V2 $2,969, Grandstand B2 $2,199) and Champions Club ($4,949) added 23 Sep 2026 from founder-supplied screenshots of the live f1experiences.com checkout — this pricing loads dynamically via JS and isn't visible to a static page fetch.",
      sport: ["formula_one"],
      moodTags: ["luxury", "vip"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "luxury",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-23",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db
    .insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓ Experience created:", result.title, "|", result.id, "|", result.slug, "|", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

// Fix: Suzuka's Hospitality Tiers experience — added real, confirmed 2027
// F1 Experiences package pricing per founder instruction 23 Sep 2026.
//
// Founder supplied screenshots of the live checkout at
// f1experiences.com/2027-japanese-grand-prix/hero (Hero | Main Grandstand V2
// $2,969.00, Hero | Grandstand B2 $2,199.00) and
// f1experiences.com/2027-japanese-grand-prix/champions-club (Champions Club
// $4,949.00) — this pricing loads dynamically via JS and isn't visible to a
// static page fetch, so the screenshots are the source of record. Champions
// Club inclusions independently re-confirmed via direct fetch the same day.
//
// Hero is a distinct, cheaper F1 Experiences product (a named grandstand
// seat bundled with pit lane walk / track tour / trophy photo extras, not a
// hospitality lounge) — added to body copy, tips, and avoids as the
// accessible entry point below Champions Club. Title kept; subtitle updated
// to name Hero explicitly.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "japanese-gp-suzuka-hospitality-tiers";

const bodyContent = `Paddock Club gets named more than any other hospitality product at Suzuka, but it isn't the only real option, and treating it as the sole choice means missing a genuine mid-tier alternative that costs less and still delivers a real paddock experience.

F1 Paddock Club sits directly above the pit building, looking down over the start-finish straight and the pit lane below. The package includes premium open bars, curated local food menus, daily pit lane walks across Friday, Saturday, and Sunday, and — the detail that separates it from every grandstand ticket at any price — a lap of the circuit on the back of a flatbed truck with expert hosts, past the spots where the weekend's real history happens. Depending on the specific package, meet-and-greets with current or former F1 drivers are included too.

Champions Club is the tier most people don't know exists. It sits in the same building, directly above the team garages in the main pit structure, with the same view of the main straight, pit lane, and grid preparations — but at a genuinely different price point and access level. The inclusions are real: all-day food and drink including a proper curated lunch and open bar, F1 insider appearances from drivers, executives, or media figures, a grid walk with a professional photo at the championship trophy, and one assigned day of guided paddock tour access across the three-day weekend. It's not a scaled-down Paddock Club — it's a genuinely separate product built for people who want real paddock access without the top tier's full price. Confirmed 2027 pricing direct from F1 Experiences: US$4,949 per person plus processing fee.

Below Champions Club sits Hero, F1 Experiences' most accessible package at Suzuka — and worth understanding separately, because it isn't a hospitality lounge at all. Hero is a named grandstand seat, either Main Grandstand V2 (seat-back style seating, giant screen viewing, panoramic views over the main straight) or Grandstand B2 (bleacher-style seating, roving access on Friday, reserved seating Saturday and Sunday at the outside of the first two corners), bundled with the same walk-on extras the lounge tiers get: an exclusive Aramco F1 pit lane walk, a guided track tour, a championship trophy photo, and an F1 Experiences gift redeemable through F1 Authentics. Confirmed 2027 pricing: US$2,969 for Main Grandstand V2, US$2,199 for Grandstand B2, both plus processing fee.

Beyond these three named packages, Suzuka's 2027 hospitality lineup is reported to include further options — a design-led alternative called House 44, premium suites near the S-curves section of the circuit, and team-branded hospitality from outfits like Ferrari, Red Bull, McLaren, and Mercedes offering garage access and driver contact. Full 2027 package details for these hadn't been published as of this writing, so treat them as real, confirmed-to-exist tiers worth watching for rather than fully bookable products yet.

Every hospitality tier at Suzuka shares one real risk: they sell out, and the more exclusive tiers sell out first. If a genuine hospitality weekend is the goal rather than a grandstand seat, deciding between Paddock Club, Champions Club, and Hero — and watching for the announcement of the others — is worth doing well before the weekend gets close.`;

const insiderTips = [
  "Champions Club shares Paddock Club's building and its view of the main straight and pit lane — if the full Paddock Club price is the barrier, this is the tier to look at before assuming hospitality is out of reach entirely.",
  "Hero is genuinely the most accessible F1 Experiences package at Suzuka — a real grandstand seat plus the pit lane walk and track tour, at roughly half of Champions Club's price — worth considering if you want the walk-on extras without paying for a lounge you might not use.",
];

const whatToAvoid =
  "Don't assume Champions Club is a watered-down Paddock Club — it's a genuinely separate product with its own real inclusions (grid walk, guided paddock tour day, insider appearances), not a discount version of the top tier. Don't confuse Hero with a hospitality package — it's a grandstand seat with walk-on extras, not a lounge with food and open bar, so if all-day dining and drinks are what you actually want, Champions Club or Paddock Club is the right tier, not Hero.";

const subtitle = "Paddock Club, Champions Club, Hero, and the real alternatives — what each tier actually includes and costs.";

const editorialNote =
  "Sources: f1experiences.com Champions Club and Paddock Club package pages (verified 21 Sep 2026), tracksideculture.com and grandprixgetaway.com 2026 hospitality guides (House 44, S-curves suites, team hospitality — noted as real reported tiers, full 2027 details unpublished, stated honestly per skill §2a-3). Confirmed 2027 pricing for Hero (Main Grandstand V2 $2,969, Grandstand B2 $2,199) and Champions Club ($4,949) added 23 Sep 2026 from founder-supplied screenshots of the live f1experiences.com checkout — this pricing loads dynamically via JS and isn't visible to a static page fetch.";

try {
  const [row] = await db.select({ practicalInfo: experiences.practicalInfo }).from(experiences).where(eq(experiences.slug, SLUG));
  if (!row) throw new Error(`Not found: ${SLUG}`);

  const updatedPracticalInfo = {
    ...row.practicalInfo,
    costRange:
      "Confirmed 2027 F1 Experiences pricing, per person plus processing fee, USD: Hero | Grandstand B2 US$2,199, Hero | Main Grandstand V2 US$2,969, Champions Club US$4,949. Paddock Club sits above Champions Club; exact 2027 Paddock Club figure not yet published.",
    bookingMethod:
      "Available via official F1 Experiences packages (f1experiences.com/2027-japanese-grand-prix) and authorized hospitality operators (e.g. GP Management, Edge Global Events).",
    howToBook:
      "If you're weighing Paddock Club against Champions Club, ask directly whether the flatbed-truck circuit lap and driver meet-and-greet are included in your specific package tier — these vary by exact Paddock Club product and aren't guaranteed at every price point within it. F1 Experiences' own packages are the most consistently documented route to Paddock Club, Champions Club, and Hero; for House 44, the S-curves suites, or team hospitality once announced, expect a much shorter booking window given the smaller inventory of team-branded and design-led suites.",
    website: "https://f1experiences.com/2027-japanese-grand-prix",
  };

  const [result] = await db
    .update(experiences)
    .set({
      subtitle,
      bodyContent,
      insiderTips,
      whatToAvoid,
      practicalInfo: updatedPracticalInfo,
      editorialNote,
      lastVerifiedDate: "2026-09-23",
    })
    .where(eq(experiences.slug, SLUG))
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  console.log("Updated:", result.title, "|", result.id, "|", result.slug, "|", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

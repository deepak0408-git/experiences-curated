import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

// Generalizes the existing published "Paddock Club" experience to cover
// both F1 Paddock Club AND Champions Club, per founder instruction 16 Oct
// 2026 — Champions Club has no dedicated experience and is folded in here
// rather than getting its own write-up, matching the real tier4 hospitality
// category in this event's seeded circuit_seating_profile/
// planner_ticket_tier_cost. Champions Club detail sourced fresh
// (f1experiences.com's official 2026 Hungarian GP Champions Club package
// page and its own "Explained — What is Champions Club?" blog post):
// Saturday-only Grid Walk + Championship Trophy photo (its real centrepiece,
// distinct from Paddock Club's daily Pit Lane Walk), a guided paddock tour,
// all-inclusive catering with open bar, F1 Insider appearances.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "752d5d06-1e81-403b-8e57-4f77dd8b57e3";

const bodyContent = `F1 sells two distinct hospitality products above a grandstand ticket at the Hungaroring, both official, both run by the sport itself rather than a third-party operator, and genuinely different days out rather than one being a cheaper version of the other.

Paddock Club sits directly above the team garages on the main straight, looking down onto the start-finish line and the grid. Its centrepiece is the Pit Lane Walk, 30 to 60 minutes roaming the actual pit lane most days of the weekend, close enough to watch mechanics prep the cars and, often enough that it's not rare, pass a driver or team principal doing the same thing you are. Beyond the walk, packages typically add a Championship Trophy photo opportunity, an F1 Pit Stop Challenge where guests try a simulated tyre change against the clock, simulator rigs, and a Parade Truck Tour.

Champions Club sits one tier below, and the honest way to think about it isn't "Paddock Club but cheaper," it's built around one specific moment instead of all-weekend pit lane access. On the Saturday of your package, guests walk the actual starting grid and get a professional photo with the Championship Trophy, the kind of access a grandstand ticket simply doesn't sell at any price. A guided tour of the restricted paddock runs once during the weekend too, assigned a day and time ahead of the event, giving a real chance to see teams, drivers, and media working up close. Both tiers run full hospitality, catering through the day, an open bar, and appearances from F1 personnel, though Paddock Club's food and bar service runs longer and reaches further into Champagne and spirits where Champions Club keeps to beer, wine, and soft drinks.

Weather is a real factor either way. Hungaroring race weekend regularly hits 30°C-plus in late July, and an air-conditioned suite is as much a relief from the heat as it is a viewing position. Parking for Paddock Club runs one pass per four guests, worth knowing if you're coordinating a group.`;

const whyItsSpecial = `Most premium hospitality at a Grand Prix is a good view plus good catering, interchangeable in spirit from one circuit to the next. What separates these two tiers from a grandstand upgrade is proximity to the sport's actual mechanics, not just better food. Paddock Club's Pit Lane Walk puts you where the mechanics are working, every day of the weekend. Champions Club trades that daily access for one concentrated moment, the actual starting grid, the actual trophy, a professional photo that proves you stood where only a handful of fans ever do.

Neither is a watered-down version of the other. Paddock Club sells volume and proximity across the whole weekend; Champions Club sells one genuinely unrepeatable Saturday. Picking between them is really picking what kind of access matters more to you, constant closeness to the pit lane, or one specific, unbeatable moment on the grid itself.`;

const insiderTips = [
  "Book the Aramco Pit Lane Walk time slot as early in your first Paddock Club day as you can, it's a fixed daily window, runs once or twice between sessions, and once it's over for the day, it's over.",
  "Champions Club's Grid Walk and Trophy photo only run on the Saturday of your package, so book Saturday-inclusive access specifically if that moment is the actual reason you're buying Champions Club — a Sunday-only package won't include it.",
  "If you're travelling as a group for Paddock Club, remember parking passes are issued one per four guests, coordinate who's driving before race morning rather than assuming everyone gets their own pass.",
];

const whatToAvoid = `Don't assume Paddock Club automatically includes a specific team's suite, generic F1 Experiences packages and named-team suites (McLaren, Ferrari, etc.) are sold and priced separately, confirm exactly which you're booking before paying. And don't buy Champions Club expecting Paddock Club's daily pit lane access, its real strength is the one-off Saturday Grid Walk and paddock tour, not an all-weekend hospitality routine — if constant proximity to the pit lane matters more than one standout moment, Paddock Club is the tier that actually delivers that.`;

const practicalInfo = {
  hours: "3-day access (Fri-Sun) for Paddock Club; Champions Club packages vary by day combination — confirm Saturday inclusion if the Grid Walk matters to you. Suite opens ahead of first practice each day.",
  website: "https://f1experiences.com/2026-hungarian-grand-prix",
  costRange: "Champions Club from approx. $4,899 USD (3-day, f1experiences.com's own 2026 package page); Paddock Club runs above that, roughly $6,670-11,935 USD depending on package and suite — check f1experiences.com for current pricing on both",
  howToBook:
    "If you're planning on Paddock Club for Hungaroring, book through f1experiences.com directly rather than a reseller markup, it's the official channel and carries F1's own guarantee. Contact info@f1experiences.com or +1 888 326 5430 directly if you want a named team suite (McLaren, Ferrari, Red Bull) confirmed before paying, availability for specific suites isn't always visible on the site until you ask. Paddock Club packages for mid-season European rounds like Hungary typically go on sale the preceding autumn and the best team-branded suites sell out first, often 4-5 months before race weekend, well ahead of the general public ticket window. If a specific team's suite matters more than the Saturday grid moment, that's the detail to lock in early, generic Paddock Club access stays available longer than named-team hospitality. For Champions Club, confirm your package's exact day combination before paying, the Grid Walk and Trophy photo only fire on the Saturday — a Sunday-only or Friday-Sunday package that doesn't explicitly include Saturday access won't carry it, and f1experiences.com's own package listings for Hungary have shown Saturday-Sunday Champions Club selling out before the weekend in past seasons, so treat Saturday availability as the real deadline if that's the point of buying in.",
  bookingMethod:
    "Official F1 hospitality, sold via f1experiences.com and authorised resellers such as edgeglobalevents.com and grandprixevents.com. Paddock Club includes the daily Aramco Pit Lane Walk, Championship Trophy photo opportunity, F1 Pit Stop Challenge, F1 simulators, and Parade Truck Tour, with one parking pass issued per four guests. Champions Club includes a Saturday Grid Walk with Championship Trophy photo, a guided paddock tour, and all-inclusive catering with an open bar (beer, wine, soft drinks).",
  reservationsRequired: true,
};

const [result] = await db
  .update(experiences)
  .set({
    title: "Paddock Club & Champions Club — Above the Garages",
    subtitle: "F1's own two hospitality tiers: daily pit lane access, or one unrepeatable Saturday on the grid.",
    bodyContent,
    whyItsSpecial,
    insiderTips,
    whatToAvoid,
    practicalInfo,
    budgetCurrency: "USD",
    editorialNote:
      "Generalized 16 Oct 2026 from the original 'Paddock Club' experience (published 11 Jul 2026, sources: f1experiences.com/2026-hungarian-grand-prix, edgeglobalevents.com/f1-paddock-club/hungary, gpdestinations.com/tickets-hungarian-f1-grand-prix) to also cover Champions Club, per founder direction to fold the two hospitality tiers into one experience rather than seed Champions Club separately. Champions Club detail freshly sourced: f1experiences.com/2026-hungarian-grand-prix/champions-club-3-days and f1experiences.com/blog/explained-what-is-champions-club (Saturday-only Grid Walk + Trophy photo, guided paddock tour, catering tier distinct from Paddock Club's). Pricing: Champions Club $4,899 (f1experiences.com, screenshot supplied directly by founder); Paddock Club $6,670-11,935 (reseller range, multiple 2026 sources) — see seeded planner_ticket_tier_cost tier4 row for this event.",
    lastVerifiedDate: "2026-10-16",
    updatedAt: new Date(),
  })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

console.log("\n✓ Experience updated successfully");
console.log("  Title: ", result.title);
console.log("  ID:    ", result.id);
console.log("  Slug:  ", result.slug);
console.log("  Status:", result.status);

await client.end();

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const PARIS_ID = "488adb47-5327-43e2-8206-d40480301962";
const FRENCH_OPEN_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";
const slug = "what-to-eat-inside-roland-garros";

const bodyContent = `Wimbledon has strawberries and cream. Roland-Garros has spent recent years actively trying to build its own version of that same signature-food identity, and the current answer is the Balle de Break: a chocolate-filled pastry shaped like a tennis ball, designed as much to be photographed as eaten. It's a deliberate move, not an accident — the tournament wants an edible symbol the way Wimbledon has one, and this is the bet.

The everyday concessions are simpler and spread across the grounds by court. Bar des Mousquetaires is the best-known stand, sandwiches and hot dishes for people who want to eat fast and get back to their seat. Hot dog stands cluster near Court 6 and the walkways around Chatrier. The main food court runs croque-monsieur, galettes, pitas and chicken-and-fries, the closest thing to a proper sit-down meal without leaving the grounds mid-session. Small grocery-style stands near Suzanne-Lenglen, Court 6 and Fonds des Princes sell drinks, salads, wraps and packaged snacks for anyone who'd rather eat on the move. Waffles slathered in Nutella have long been the unofficial dessert of choice regardless of what the tournament's marketing team is pushing that year.

2026 brought something more ambitious: Le Jardin des Chefs, a new culinary hub built into the Jardin des Serres d'Auteuil near Court Simonne-Mathieu, running for the tournament's full run. Lunch service, 11:30am to 3:30pm, pairs two chefs each serving two dishes with a dedicated pastry chef for dessert. Evenings shift to bodega-style shared platters overseen by chef Yves Camdeborde, with a 1,200-square-metre terrace, two giant screens, a cocktail bar and live music. It's a genuine attempt to make eating at Roland-Garros an event in itself rather than a break between matches — whether it becomes a permanent fixture for future editions or an experiment specific to that year is worth checking closer to 2027.

Bringing your own food onto the grounds is explicitly permitted — a real option for anyone managing a tight budget across a long day of matches. Alcohol and sharp cutlery are the notable exceptions on the prohibited list.`;

const whyItsSpecial = `Every Grand Slam eventually tries to manufacture a signature food, and most of them feel bolted on. The Balle de Break is Roland-Garros doing it deliberately and self-awarely — a chocolate tennis ball built for a phone camera as much as an appetite — and there's something almost charming about a 99-year-old tournament trying this hard to catch up to Wimbledon's century-plus head start on strawberries.

Le Jardin des Chefs is the more interesting story, because it's not really about snacking between matches at all. A dedicated chef-led food court, built into a working botanical garden next to one of the tournament's actual show courts, with a named chef running the evening service, is Roland-Garros treating food as part of the tournament's identity rather than a logistics problem to be solved with hot dog stands. Whether that ambition survives past its first year or becomes a permanent institution the way the tennis itself has, it's worth experiencing while it's there.`;

const insiderTips = [
  "Le Jardin des Chefs runs a distinct lunch (11:30am-3:30pm, chef-led dishes) and evening (6-10pm, bodega-style shared platters) service — the two are genuinely different experiences, not the same menu at different times, so pick based on which part of the day you're actually there.",
  "Bringing your own food onto the grounds is explicitly allowed (alcohol and sharp cutlery are the exceptions) — a real way to manage cost across a long tournament day without relying entirely on concession pricing.",
];

const whatToAvoid = `Don't assume Le Jardin des Chefs is a quick-bite option — it's built around a proper lunch or evening service with named chefs, not a fast concession stand, so budget real time if you want the full experience rather than trying to squeeze it into a 20-minute changeover between matches. And don't expect the Balle de Break or any single "signature" item to be available at every food stand across the grounds — Roland-Garros's food offering is genuinely spread across many separate stands and courts rather than centralized, so a specific item worth trying may only be at one or two locations, not wherever you happen to be standing.`;

const practicalInfo = {
  address: "2 Avenue Gordon Bennett, 75016 Paris, France",
  website: "https://www.rolandgarros.com/en-us/page/eating-and-drinking-at-roland-garros",
  hours: "Concessions run throughout match sessions; Le Jardin des Chefs runs lunch 11:30-15:30 and evening 18:00-22:00",
  costRange: "Concession items typically €5-15; Le Jardin des Chefs dining priced as a proper meal rather than a snack (specific 2027 pricing not yet published)",
  bookingMethod: "No booking required for standard concessions — walk up at any stand across the grounds. Le Jardin des Chefs may require a reservation for table service; check closer to the 2027 dates.",
  reservationsRequired: false,
};

const gettingThere = `All concessions are inside the main Stade Roland-Garros grounds — no separate travel needed once inside. Le Jardin des Chefs sits within the Jardin des Serres d'Auteuil, adjacent to Court Simonne-Mathieu, on the western side of the complex.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "What to Eat Inside Roland Garros",
      subtitle: "From hot dog stands to a chef-led food court built into a botanical garden",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: PARIS_ID,
      sportingEventId: FRENCH_OPEN_EVENT_ID,
      neighborhood: "16th arrondissement / Porte d'Auteuil",
      address: "2 Avenue Gordon Bennett, 75016 Paris, France",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Concession detail (Bar des Mousquetaires, food court, grocery stands) from earlier WebSearch aggregation citing rolandgarros.com eating-and-drinking pages. Balle de Break and Le Jardin des Chefs detail from cook-in-france.com feature on the 2026 food initiative (Jardin des Serres d'Auteuil location, chef Yves Camdeborde, lunch/evening service structure). Verified 4 Sep 2026 — note Jardin des Chefs was a 2026-specific initiative; confirm it recurs for 2027 closer to the date. Hero image pending — batch pass to follow.",
      moodTags: ["casual", "social", "authentic"],
      interestCategories: ["food_and_drink", "sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "EUR",
      bestSeasons: ["may"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-04",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: FRENCH_OPEN_EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created:", result.title, "→", result.slug, `(${result.status})`);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "bc5bb5bd-8b52-4225-94ea-66451f57af10";
const EVENT_ID = "48aa4415-f6a2-4867-b390-eb6b28b6903b";
const slug = "singapore-gp-padang-grandstand-" + Date.now().toString(36);

const bodyContent = `Padang Grandstand sits in Zone 4, split into A and B sections flanking the Padang Stage, watching drivers approach Turn 10, the Singapore Sling, at up to 275km/h. On paper that sounds like a real racing seat. In practice, independent reviewers are blunt about it: the grandstands aren't steeply pitched, the straight between Turns 9 and 10 gives only a few seconds of passing cars, and neither section offers a genuinely decent view of either corner. It's fair to walk in knowing what you're buying.

What you're actually buying is proximity. Padang A and B sit immediately next to the main stage where the weekend's headline acts play, so you get the concert experience without moving after the chequered flag. In 2026 that's JJ Lin and CORTIS on Friday, Zara Larsson and The Killers on Saturday, and Lana Del Rey's Singapore debut alongside James Arthur on Sunday. Between sessions, the festival atmosphere here doesn't dip the way it can in a purely trackside stand.

Seating is individual bucket seats with backs, up to 43 rows and 24 seats per section, uncovered. Bring something for rain, this circuit gets tropical downpours without much warning. Zone 4 also puts you near Portside Hawkers and Dockside Hawkers, both curated food stalls mixing Singaporean staples with international options, so you're not stuck with generic stadium concessions between the racing and the music.

If you came for the racing above all else, Padang isn't the stand. If a genuine race weekend with real concerts attached matters as much as the laps, it's an honest, well-placed pick, just go in knowing the on-track view is secondary to everything happening around it.`;

const whyItsSpecial = `Padang is the one grandstand at Singapore where I'd actively push back on the marketing copy. Official pages sell it as a Turn 10 viewing seat; independent reviewers who've actually sat there say the racing view barely qualifies. Both things can be true, and pretending otherwise does readers no favours. What's genuinely special is the trade Padang represents, real proximity to a stage that's hosting Lana Del Rey's Singapore debut, real hawker food two minutes away, real festival energy that doesn't require choosing between the race and the night out. That's a legitimate reason to buy this stand. Buying it expecting a great sightline isn't.`;

const insiderTips = [
  "Rows 20-30 offer the least-compromised sightlines of the two sections — still not great for racing, but better than the lower rows.",
  "Portside Hawkers and Dockside Hawkers, both inside Zone 4, are worth building into your evening rather than settling for the nearest concession stand.",
];

const whatToAvoid = `Don't buy Padang expecting a genuine racing seat — if on-track action through Turns 9-10 is the priority, Stamford or Turn 1 deliver far more for a similar or lower price. Also don't assume covered seating: Padang is fully open-air, and Singapore's race-week storms arrive fast and heavy.`;

const practicalInfo = {
  hours: "Race weekend sessions Friday–Sunday, 9–11 Oct 2026, into the evening",
  costRange: "S$738 for 3-day (2026, sold out at time of writing); single-day Friday/Saturday/Sunday priced separately, check live availability",
  bookingMethod: "Book via singaporegp.sg or tickets.formula1.com under Zone 4 grandstands. 3-day and Sunday tickets typically sell out well ahead of race week.",
  howToBook: "",
  website: "https://singaporegp.sg/en/tickets/general-tickets/grandstands/padang-grandstand/, https://tickets.formula1.com/en/f1-3301-singapore",
  reservationsRequired: true,
};

const gettingThere = "Access via Gates 3A, 4, 5, 6, or 7 into Zone 4. Nearest MRT: Promenade or Esplanade.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Padang Grandstand — the honest trade-off",
      subtitle: "Weak racing view, unbeatable proximity to the Padang Stage headliners — know which you're buying",
      slug,
      experienceType: "sports_venue",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Marina Bay",
      address: "Padang Grandstand, Zone 4, Marina Bay Street Circuit, Singapore",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from singaporegp.sg official Padang page, gpdestinations.com independent review, 2026 Padang Stage lineup confirmed via multiple outlets. Verified 1 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["high-energy", "festival"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "SGD",
      bestSeasons: ["oct"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-01",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓ Created:", result.title, "→", result.id, result.slug, result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

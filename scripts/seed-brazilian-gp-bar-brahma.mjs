import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb";
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const slug = "brazilian-gp-bar-brahma-" + Date.now().toString(36);

const bodyContent = `Bar Brahma sits on the corner of Avenida São João and Avenida Ipiranga in São Paulo's historic center, and it's been running since 1948 — a genuine art deco botequim, not a themed recreation of one. Legends of Brazilian music, including João Gilberto and Elis Regina, played here in its earlier decades, and the venue faced real decline through the 1990s before a 2001 revival brought it back as one of the city's essential live-music addresses.

The stage runs live samba, MPB, choro, and pagode seven nights a week, starting from around 8pm and continuing into the early hours — the venue itself is open 11am to 1am daily, so you can also come earlier for a drink in a quieter room before the music picks up. The room is genuine art deco, cold chopp (draft beer) on tap, and classic bar food alongside the music, with a reputation built over decades rather than a recent rediscovery.

The main floor doesn't take reservations, so arriving with the crowd rather than expecting a held table is the norm — larger groups of eight or more can book the private dining room separately. Weekend nights get genuinely busy, and getting there before the room fills up matters more than trying to reserve ahead.`;

const whyItsSpecial = `São Paulo has plenty of bars trading on a manufactured sense of history — reproduction decor, a name borrowed from somewhere older. Bar Brahma is the real thing: a room that's actually hosted the musicians whose names get invoked as Brazilian music's foundational figures, running continuously (with one real interruption and comeback) since 1948. [Its exceptionally large, well-attested rating](https://maps.google.com/?cid=1263428164082259505&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) reflects a venue that's stayed genuinely good across generations, not one riding a single moment of hype. A night here is as close as a visiting fan gets to hearing Brazilian music the way it's actually been played in this city for eighty years, not a version curated for tourists.`;

const insiderTips = [
  "Live music generally starts around 8pm — arrive earlier for a quieter drink and a table, or later specifically for the performance, since the room's energy shifts noticeably once the band starts.",
  "The main floor is walk-in only — if you're coming on a weekend night specifically for the music, arrive with the earlier crowd rather than expecting to reserve a spot, since only larger groups (8+) can book the private room ahead.",
];

const whatToAvoid = `Don't assume you can reserve a table on the main floor — reservations are only available for the private dining room and groups of 8 or more, so plan your arrival time around getting there before the room fills, especially on weekends. And be aware that reported cover charges for this venue vary significantly across sources (from a modest per-person fee to a much higher figure) — confirm the current cover directly at the door or via the venue's own channels before assuming a specific price, rather than budgeting off an unconfirmed online figure.`;

const practicalInfo = {
  hours: "Daily, 11am-1am. Live music typically from around 8pm.",
  costRange: "Reported cover charges vary significantly across sources (from roughly R$20 to a much higher figure) — this could not be confirmed to a single reliable number; verify directly at the venue. Drinks and bar food are moderately priced.",
  bookingMethod: "No reservations for the main floor — walk in. Groups of 8+ can book the private dining room separately.",
  website: "https://en.wikipedia.org/wiki/Bar_Brahma",
};

const gettingThere = "Located at the corner of Avenida São João and Avenida Ipiranga in São Paulo's historic center (Centro). Nearest metro station is República (Lines 3 Red and 4 Yellow), a short walk away.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Bar Brahma — Live Samba Since 1948",
      subtitle: "The art deco botequim where João Gilberto and Elis Regina once played",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Centro Histórico",
      address: "Av. São João, 677, Centro Histórico de São Paulo, 01036-000 São Paulo, SP, Brazil",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "History (1948 opening, João Gilberto/Elis Regina performances, 1990s decline, 2001 revival) sourced from LikeALocalGuide's venue feature, cross-checked, 11 Sep 2026. Hours (11am-1am daily) sourced from Wanderlog aggregator listing. Cover charge sources genuinely conflicted — one Tripadvisor review cited ~$50/person, another cited R$20/person, a difference too large to resolve confidently (could reflect different nights/events or one figure being inaccurate) — flagged explicitly in copy per skill §1's rule to state source conflicts rather than pick one arbitrarily. Live music format (samba/MPB/choro/pagode, 7 nights, ~8pm start) sourced from LikeALocalGuide and BarsForKings. Real Google Maps rating confirmed via Places API, 11 Sep 2026: 4.5/22,383 reviews.",
      sport: ["formula_one"],
      moodTags: ["energetic", "authentic", "historic"],
      interestCategories: ["nightlife", "culture"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-11",
      googleMapsRating: "4.5",
      googleMapsReviewCount: 22383,
      googleMapsUrl: "https://maps.google.com/?cid=1263428164082259505&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #22 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

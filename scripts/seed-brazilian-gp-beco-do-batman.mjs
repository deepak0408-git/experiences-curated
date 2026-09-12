import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb";
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const slug = "brazilian-gp-beco-do-batman-" + Date.now().toString(36);

const bodyContent = `Beco do Batman started in the late 1980s with a single Batman drawing on one wall of a Vila Madalena alley. Fine arts students noticed it, added their own work around it, and the alley kept growing from there into what's now a genuine open-air gallery spanning several connecting streets — primarily Rua Gonçalo Afonso and Rua Medeiros de Albuquerque.

It's public street art on a public street, which means no gates, no ticket desk, and no fixed hours — access is effectively 24 hours since it's just a residential alley that happens to be covered in murals. That also means the work itself changes: artists paint over older pieces regularly, both established Brazilian names and visiting international street artists, so what you see on any given visit is genuinely different from what was there a year, or even a few months, earlier.

The alley has become popular enough that it draws a real, sustained crowd, and Vila Madalena's own bar and restaurant scene sits an easy walk away — pairing an afternoon here with an evening at Mercearia São Pedro or Bar Astor (covered elsewhere in this pack) makes for a natural day-into-night combination in one neighborhood.`;

const whyItsSpecial = `Most "street art district" recommendations point you toward something curated — a commissioned mural wall, a city-sanctioned public art program. Beco do Batman is the opposite: it started as an accident, grew through genuine artist-to-artist momentum with no central authority deciding what goes up, and it's stayed that way for nearly four decades. [Its exceptionally large, well-attested rating](https://maps.google.com/?cid=14245353340631514914&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) tells you it's become a genuine destination without ever losing the organic, unpermitted character that made it interesting in the first place. It's one of the few places in the city where the art is literally never finished — someone painted over a wall last month, and someone else probably will again before your next visit.`;

const insiderTips = [
  "Visit before 10am on a weekday if you want fewer people in your photos and the best morning light on the walls — this alley draws real crowds later in the day and on weekends.",
  "Because artists repaint sections regularly, don't expect to see the exact murals from photos you've seen online — treat every visit as genuinely current rather than assuming a specific piece will still be there.",
];

const whatToAvoid = `Don't expect a formal, gallery-style experience with information plaques or guided context — this is an unmanaged public street, so any context you want (who painted what, when) mostly comes from doing your own research beforehand or joining a local street-art-focused tour rather than finding it on-site. And don't treat it as a quick five-minute photo stop — the alley spans multiple connecting streets, and rushing through misses most of the actual work.`;

const practicalInfo = {
  hours: "Open 24 hours as a public street — daylight visits recommended for visibility and safety",
  costRange: "Free",
  bookingMethod: "No booking needed — walk in at any time.",
  website: "https://en.wikipedia.org/wiki/Beco_do_Batman",
};

const gettingThere = "Located in Vila Madalena, primarily along Rua Gonçalo Afonso and Rua Medeiros de Albuquerque. Nearest metro is Vila Madalena (Line 2, Green), followed by a short walk.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Beco do Batman — Vila Madalena's Street Art Alley",
      subtitle: "Started with one drawing in the late 1980s, repainted continuously ever since",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Vila Madalena",
      address: "Rua Gonçalo Afonso, Vila Madalena, São Paulo, SP, Brazil",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "History (late-1980s single Batman drawing origin, fine-arts-student-led organic growth, no central curation) sourced from Globe Guide's dedicated feature and Wikipedia's Beco do Batman entry, cross-checked, 11 Sep 2026. 24-hour public-street access confirmed via Airial's 2026 visitor guide. Real Google Maps rating required a retry with a type-qualified query ('tourist attraction') after an initial bare-name search returned no rating data — the retry matched the correct, well-attested entity: 4.6/34,090 reviews, confirmed via Places API, 11 Sep 2026.",
      sport: ["formula_one"],
      moodTags: ["artistic", "distinctive", "budget-friendly"],
      interestCategories: ["culture"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-11",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 34090,
      googleMapsUrl: "https://maps.google.com/?cid=14245353340631514914&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #18 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

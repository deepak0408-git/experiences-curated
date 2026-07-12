import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const slug = "camping-hungaroring-" + Date.now().toString(36);

const bodyContent = `Zengo Camping is the closest campsite to the Hungaroring, sitting right behind the final corner, a hundred metres from Gate 6 and a short stroll from the Apex grandstands. It's an open, grassy field with no shade, and it's built for tents, car camping, caravans, and motorhomes alike. Showers run hot and cold water, toilets are on site, security runs 24 hours, and there's a bar plus food and drink sellers for evenings when walking back into Budapest isn't appealing.

The economics are the real draw. A shared pitch without electricity runs around €100 per person for four nights, among the cheapest camping on the entire F1 calendar alongside the Red Bull Ring and Spa-Francorchamps. Electricity is available for an additional €15 a night if you need it, plus a small visitor's tax per person per night.

What you're trading for that price is comfort, not proximity. Being a hundred metres from Gate 6 means walking distance to the circuit rather than a shuttle bus queue, but it also means several nights in an unshaded field in late-July Hungarian heat, with the noise and energy of a race weekend campsite rather than a quiet hotel room.`;

const whyItsSpecial = `Most people who camp at a Grand Prix aren't doing it because it's comfortable, they're doing it because the arithmetic works and the atmosphere is part of the point. Zengo's specific advantage is that it removes the transit question entirely, no metro, no HÉV, no shuttle timing to plan around, just a walk to the gate. For a circuit as awkward to reach by car as the Hungaroring, that's worth more than it sounds, and at roughly a quarter of what even a modest Budapest hotel costs for the same nights, it changes who can realistically justify the trip at all.`;

const insiderTips = [
  "Bring your own shade, the field has none, and race weekend temperatures regularly exceed 30°C during the day.",
  "Budget separately for electricity (€15/night) and the per-person visitor's tax if you want power for a fridge or fan, base pricing assumes an unpowered shared pitch.",
];

const whatToAvoid = `Don't book Zengo expecting quiet, it's a genuine race-weekend campsite with a bar and constant foot traffic to and from Gate 6, not a peaceful rural pitch. If you want proximity without the noise, a Gödöllő hotel a short drive away is the better compromise.`;

const practicalInfo = {
  hours: "Typically opens 2-3 days before the race weekend and closes the day after; check zengocamping.hu for exact 2026 dates",
  costRange: "~€100 per person for 4 nights (shared, unpowered pitch); +€15/night for electricity; +€1/person/night visitor's tax",
  bookingMethod: "Book directly via zengocamping.hu or through official F1 ticket resellers listing Camping Zengo. Pitches are limited and this is the closest site to the circuit, book as early as the ticket window opens.",
  website: "https://zengocamping.hu/en/",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Camping at the Circuit — Zengo, 100m from Gate 6",
      subtitle: "The closest, cheapest campsite at the Hungaroring — a field behind the final corner, no shuttle required.",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Hungaroring, Mogyoród",
      address: "Zengo Camping, near Gate 6, Hungaroring, 2146 Mogyoród, Hungary",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere: "Walking distance to Gate 6 from the campsite itself; no metro or shuttle needed once on site.",
      editorialNote: "Sources: zengocamping.hu/en, oversteer48.com/hungaroring-camping-f1, gpdestinations.com/european-f1-camping-guide-2026. Verified 11 Jul 2026.",
      sport: ["formula_one"],
      moodTags: ["budget-friendly", "communal", "no-frills"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 3,
      budgetTier: "budget",
      budgetCurrency: "EUR",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-07-11",
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

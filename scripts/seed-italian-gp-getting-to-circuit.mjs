import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b0d8f9a-911d-4cc7-8049-50e4685958ca"; // Milan
const EVENT_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e"; // Italian GP 2026
const slug = "getting-to-the-circuit-monza-" + Date.now().toString(36);

// ─── Content ──────────────────────────────────────────────────────────────────

const bodyContent = `Monza is not like other F1 circuits. You don't drive there. You take the train, step off at Biassono-Lesmo Parco, and walk 20 minutes through one of Europe's largest walled parks to reach the gates. It's genuinely one of the best approaches to any sporting venue in the world.

The trains are S8, S9, and S11 suburban services from Milano Porta Garibaldi. Journey time is 20–25 minutes. Pre-purchase your ticket at the station or via the Trenord app — €3.10 each way. On race day the trains run every 5–10 minutes and fill up fast after 09:00; aim to board before then. Allow 90 minutes total from central Milan to your seat.

From Biassono-Lesmo Parco station, you have two options. The Black Line shuttle bus runs directly to the circuit gates (check f1italy.com for 2026 schedule and fares). Or walk — the 20-minute path through Parco di Monza is tree-lined, shaded, and the crowd walking it together is already part of the Italian GP atmosphere. Take the walk at least once.

Driving is an option but the wrong one on race day. Parking lots (Blue and Red zones) sell out months before the event and traffic around the park is severe for 3–4 hours post-race. If you drive, budget 2 hours to exit the area after the chequered flag. The train takes 25 minutes back to Milan and you're on the first one home.

One practical note: the walk through the park on Sunday is slow-going in the crowd. Give yourself more time than you think you need, especially if you have grandstand seats on the far side of the circuit.`;

const whyItsSpecial = `Most F1 circuits make getting there feel like an ordeal. Monza makes it feel like the event has already started. The walk from Biassono-Lesmo through the park — surrounded by thousands of people in Ferrari red, the distant sound of engines during practice sessions carrying through the trees — is unlike anything at Silverstone or Spa. It's specifically Italian: unhurried, social, the crowd treating the walk as its own ritual.

The park itself is something. 688 hectares of woodland, paths, and the Villa Reale, with the circuit embedded inside it. You pass the old banked oval on the way in if you know where to look. No other F1 venue puts you through a park like this to get to the grid.`;

const practicalInfo = {
  hours: "Trains run from approximately 06:00 daily; race-day services increase to every 5–10 minutes from Milano Porta Garibaldi",
  costRange: "€3.10 each way (Trenord suburban train); Black Line shuttle additional cost (see f1italy.com)",
  bookingMethod: "Buy Trenord tickets at the station or via the Trenord app; no advance booking required but buy before boarding.",
  howToBook: "No advance booking needed for the train itself — €3.10 single on the Trenord suburban network. The Black Line shuttle does require a ticket; check f1italy.com for 2026 pricing and schedule, typically released 4–6 weeks before race weekend. If driving: Blue and Red parking zones are sold through the official Italian GP ticketing site (f1italy.com) and sell out well before the event — book at the same time as your grandstand ticket. On Location Experiences and F1 Experiences packages often include transport from Milan as part of the hospitality bundle, which removes the train logistics entirely.",
  website: "https://www.trenord.it/en/",
  reservationsRequired: false,
};

const gettingThere = "Take the S8, S9 or S11 suburban train from Milano Porta Garibaldi (20–25 mins, €3.10) to Biassono-Lesmo Parco. From there: walk 20 minutes through Parco di Monza to the circuit gates, or take the Black Line shuttle bus. Allow 90 minutes total from central Milan to your seat on race day.";

// ─── Insert experience ────────────────────────────────────────────────────────
try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Getting to the Circuit — Train, Walk & Parking",
      subtitle: "S8/S9/S11 from Porta Garibaldi, 20 mins. Then a walk through Parco di Monza that's already part of the event.",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Parco di Monza",
      address: "Stazione Biassono-Lesmo Parco, Via Mentana, 20853 Biassono MB, Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "Board at Milano Porta Garibaldi before 09:00 on race day — trains after that fill up and the platform gets chaotic; you'll stand the whole way.",
        "Take the 20-minute park walk at least on Sunday — the crowd moving through the trees in Ferrari red, engines audible in the distance, is the Italian GP starting early.",
      ],
      whatToAvoid: "Don't drive on race day unless you've pre-booked parking and have 2 hours to spare after the race. Road congestion around Parco di Monza is severe — the first train back to Milan will get you into the city long before the last car clears the lot.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: formula1.com getting-to-monza guide, trenord.it suburban rail, f1italy.com transport section, monzanet.it park info. Fares verified Jun 2026 at €3.10 single. GTG: no transport-specific listing expected. Booking.com: N/A. Hero image: pending — better image needed.",
      moodTags: ["local", "essential", "low-key"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "budget",
      budgetCurrency: "EUR",
      bestSeasons: ["sep"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-06-29",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
  console.log("\n→ Review at:    http://localhost:3000/curator/review");
  console.log("→ Experience:   http://localhost:3000/experience/" + result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

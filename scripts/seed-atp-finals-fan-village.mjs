import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "1a968a48-105b-4c30-b092-56e0cdc4a0a2";
const EVENT_ID = "8e4d5aac-f472-48ac-b515-d253487cda50";
const slug = "atp-finals-fan-village-" + Date.now().toString(36);

const bodyContent = `The Fan Village is free to enter — no match ticket required — and it's a genuinely substantial 8,000 square metre space built around Inalpi Arena itself, spanning Piazzale Grande Torino and the Marathon Tower. Free access runs all day on 11 and 20 November, and every evening from 12 to 19 November starting at 9pm, closing at midnight or an hour after the last match of the day finishes.

The standout feature for 2026 is the Play Garden — a bioclimatic greenhouse housing four pickleball courts, with instruction available from the Italian Tennis and Padel Federation, and a design that recovers heat from neighbouring structures rather than running independently. It's described as giving spectators inside the pavilion an unusual sense of being able to see the sky while playing, a genuinely distinctive space rather than a standard temporary court setup.

Beyond the Play Garden, there's an expanded food court with real, named vendors — Fior Food by La Credenza, I Love Poke, Antica Focacceria San Francesco, Revolucion among them — plus additional food and drink in Piazzale Grande Torino itself, a children's area with the tournament's Lob & Drop mascots, school tennis programmes run by FITP coaches, and video mapping that transforms the outdoor spaces after dark.

Crucially, this is also where you can access practice sessions with a Circolo della Stampa Sporting practice ticket, which covers all three pavilions of the Fan Village from 15-20 November — see the separate practice courts experience for detail on watching players train.`;

const whyItsSpecial = `What makes the Fan Village worth building real time into your schedule for, rather than treating it as a pre-match waiting area, is that it's genuinely free and genuinely substantial — an 8,000 square metre space with real infrastructure (a purpose-built greenhouse, an actual food court with named local vendors, not generic event catering) that most tournaments wouldn't bother building for fans without match tickets. For a visitor on a tighter budget, or simply not able to get a session ticket for every day of their trip, this is real, free access to the tournament's atmosphere and, via the practice-ticket link, genuine player proximity, without needing to buy into every session.`;

const insiderTips = [
  "Free entry windows are specific, not all-day-every-day: 11 and 20 November are free all day, while 12-19 November free access starts at 9pm each evening — check the exact date against this pattern before planning your visit.",
  "The Fan Village practice-ticket combination (covering all three pavilions, 15-20 Nov) is the most cost-effective way to get real player proximity without a full session ticket — see the practice courts experience.",
];

const whatToAvoid = `Don't assume the Fan Village is free every day at all hours — the free-access windows are specific (two full free days, evenings-only on the six days between), and turning up on a group-stage afternoon expecting free entry outside those windows will mean you actually need a ticket.`;

const practicalInfo = {
  hours: "Free all day 11 & 20 Nov; free from 9pm on 12-19 Nov evenings. Closes midnight or 1hr after the day's final match.",
  costRange: "Free entry within the stated windows; food/drink at the Fan Village priced individually by vendor.",
  bookingMethod: "No booking required for free-access windows.",
  howToBook: "",
  website: "https://www.nittoatpfinals.com/en/venue/fan-village",
  reservationsRequired: false,
};

const gettingThere = "Piazzale Grande Torino and the Marathon Tower, adjacent to Inalpi Arena — same transit access as the main venue.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Fan Village at Inalpi Arena — free access",
      subtitle: "8,000sqm of pickleball, food, and player-adjacent atmosphere, no match ticket required",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Santa Rita",
      address: "Piazzale Grande Torino, Turin, Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Fan Village details (size, Play Garden, food vendors, free-access windows) confirmed directly via official venue page nittoatpfinals.com/en/venue/fan-village. Verified 4 Aug 2026.",
      sport: ["tennis"],
      moodTags: ["free", "atmosphere"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-04",
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

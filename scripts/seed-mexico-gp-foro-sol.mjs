import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "883ac422-5318-460f-819a-6ae784ac4b8c";
const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a";
const slug = "foro-sol-mexico-city-gp-" + Date.now().toString(36);

const bodyContent = `Foro Sol was never built for racing. It went up in the early 1990s as a baseball park for the Diablos Rojos, Mexico City's professional team, and it still hosts concerts and games most of the year. When F1 came back to the Autódromo Hermanos Rodríguez in 2015 after 23 years away, the circuit's designers cut the new track straight through the old outfield, threading turns 12 through 15 between the stadium's two grandstands. Nobody had built a corner like it before, and the result is unlike anything else on the calendar — for one weekend a year, this is the loudest room in Formula 1.

The two stands facing each other across the old diamond are Grandstand 14 (Foro Sol South) and Grandstand 15 (Foro Sol North). Sightlines are similar from both: you watch cars thread turn 12, disappear behind the stadium wall, then reappear through 13 and 14 a few seconds later. These are the slowest corners on the whole circuit, so don't expect overtaking drama — this section sells on atmosphere, not racing action. Grandstand 14 got a full roof recently and faces north, so by early afternoon the stand sits in shade. Grandstand 15, in what's marketed as the Brown Zone near the old Forum building, stays in direct sun longer — worth factoring in given the sun at 2,200 meters is stronger than it looks.

Neither stand has individual seats. You're on concrete terracing, numbered but not cushioned, for the length of a session. Some of the top rows in both stands also have their view partly blocked by the giant screens mounted above — not obvious from a seating chart, but a real factor if you want an unbroken sightline.

What actually sells this section is the crowd, not the corner. Every seat fills for every session, not just the race — Foro Sol sings through Friday practice the way most circuits only manage on Sunday. When the checkered flag falls, the stadium becomes the actual finish line for the weekend: fans stay in their seats as the podium ceremony happens right there in front of them, drivers doing donuts and spraying champagne with 40,000 people roaring around them. Most Grands Prix usher spectators out before the podium. Mexico City makes the crowd part of it.

Neither stand puts you near the pit lane or paddock. If pit walks or garage proximity matter more to you than atmosphere, Grandstands 1 and 2 on the front straight are the better buy — Foro Sol is a specific trade: you give up proximity to the cars in exchange for the loudest, most physically packed few hours in the sport.`;

const whyItsSpecial = `Every other grandstand at every other circuit puts you next to a piece of track. Foro Sol puts you inside a stadium that was built for something else entirely, then had a race circuit threaded through it as an afterthought that became the signature moment of the weekend. That's backwards from how every other F1 venue works, and it's exactly why it's the one section of this circuit people talk about a year later. The podium ceremony happening at ground level, in front of fans who never left their seats, isn't a staged spectacle bolted onto the race — it's just what happens when 40,000 people are already packed into a bowl at the finish line. You don't get that anywhere else on the calendar.`;

const insiderTips = [
  "Only every third step of the concrete terracing is numbered — count up from the last visible number rather than assuming your row is missing, a common source of confusion at the gate.",
  "If pit lane or paddock proximity matters more to you than atmosphere, Grandstands 1 and 2 on the front straight are the better buy — Foro Sol sells on the stadium moment, not access to the cars.",
];

const whatToAvoid = `Don't plan on bringing a seat cushion expecting to use it openly — chairs and cushions are on the circuit's official prohibited items list, and while some fans do try to sneak one in, security confiscates them on the spot if caught at the gate. Don't book the very top rows of either stand if an unbroken view of the track matters to you — the giant screens mounted above both grandstands block sightlines from up there, which isn't obvious from the seating chart when you're buying.`;

const practicalInfo = {
  hours: "Gates open ahead of each day's first session — check the official schedule closer to race week for exact times",
  costRange: "Grandstand tickets vary by day (1-day vs 3-day passes) and season — check tickets.formula1.com for current pricing",
  bookingMethod: "Buy directly through tickets.formula1.com or the circuit's own site, mexico.gp — grandstand tickets for Foro Sol (14 and 15) are sold as named, numbered seats, and both stands have sold out in past seasons well before race week.",
  website: "https://tickets.formula1.com/en/f1-4861-mexico, https://www.mexico.gp/en/map-of-the-grandstands-17",
};

const gettingThere = "Both Foro Sol grandstands sit at the far end of the circuit from the main Metro entrance at Ciudad Deportiva (Line 9) — budget extra walking time from the station gates, especially on race day when the paths fill with foot traffic.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Foro Sol — The Loudest Corner in F1",
      subtitle: "A converted baseball stadium where 40,000 fans roar the cars through turns 13-14",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Granjas México, Iztacalco",
      address: "Autódromo Hermanos Rodríguez, Av. Río Churubusco S/N, Granjas México, Iztacalco, 08400 Ciudad de México",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Grandstand seating detail, roof/sun-direction facts, and prohibited-items note sourced from oversteer48.com's Grandstand 14/15 guides and Formula1.com's official grandstand ticket pages, Sep 2026. Foro Sol history (Diablos Rojos baseball origin, 2015 F1 return) sourced from Formula1.com's 'ultimate fiesta' feature. No official per-seat pricing found for 2026 at time of writing — costRange left general, pointed to official ticket site rather than an invented figure.",
      sport: ["formula_one"],
      moodTags: ["high-energy", "iconic", "crowd-atmosphere"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 3,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["oct", "nov"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-06",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #1 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "883ac422-5318-460f-819a-6ae784ac4b8c";
const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a";
const slug = "mexico-city-gp-where-to-sit-" + Date.now().toString(36);

const bodyContent = `The Autódromo Hermanos Rodríguez splits into distinct zones, and which one you pick genuinely changes what kind of weekend you have — this isn't a case where every grandstand is basically the same view with a different price tag.

If you want the actual racing, the Blue Zone is the buy. Grandstands 3, 4, 5, and 6 line the run from the start/finish straight through turns 1, 2, and 3, where cars brake from well over 300kph down to barely 100 for the first corner. This is where overtaking genuinely happens — the long straight into a tight first corner is a classic passing zone, and you'll see it play out lap after lap in the race and during any safety car restart. Grandstand 5 has the widest sightline across the full chicane; Grandstand 3 sits right on the braking zone itself, which is the more visceral seat if you want to feel the deceleration rather than watch the wider racing line.

Grandstand 12, in the Yellow Zone, covers turns 4 through 6 — a slower, more technical stretch, but it's semi-covered, with a short roof over the top 10-15 rows. If Mexico City's midday sun at 2,200 meters is a real concern for you (and it should be — this is stronger sun than the temperature suggests), this is one of the few stands offering any shade at all.

Foro Sol, covered in its own experience elsewhere in this pack, is the opposite trade: slow, technical corners with minimal overtaking, but the loudest, most atmospheric section of the circuit and the site of the podium ceremony.

General admission areas and most of the remaining numbered grandstands are fully uncovered. Seating is bench-style with plastic pads over metal frames that get genuinely hot by midafternoon — sunscreen, a hat, and water are not optional extras here, they're the difference between an enjoyable session and a rough one. Most stands come with a big screen directly in front, which matters more than it sounds: several sections of this circuit are technical and slow enough that you'll be watching the screen as much as the live action regardless of where you sit.

The practical takeaway: decide what you actually want from race weekend before you buy. Racing action and overtaking → Blue Zone (Grandstands 3-6). Some shade and a technical, if slower, corner → Grandstand 12. Pure atmosphere, noise, and the podium moment → Foro Sol (Grandstands 14-15). Budget and don't mind full sun exposure → general admission, with proper sun protection non-negotiable.`;

const whyItsSpecial = `Most circuits have one or two grandstands worth debating and the rest are minor variations on a theme. The Autódromo Hermanos Rodríguez genuinely doesn't work that way — the difference between sitting in the Blue Zone and sitting at Foro Sol isn't a matter of degree, it's two different events happening at the same race. One buys you the on-track battle for position into turn 1; the other buys you a stadium crowd experience that has nothing to do with overtaking and everything to do with being inside something loud and physical. Knowing that distinction before you buy is worth more here than at almost any other stop on the calendar, because getting it wrong doesn't mean a slightly worse seat — it means a fundamentally different weekend than the one you were picturing.`;

const insiderTips = [
  "Grandstand 12 is one of the only sections with real roof cover — worth a look specifically if you're sensitive to sun rather than just chasing the best track view, since most of the circuit's other stands are fully exposed.",
  "If you can't decide between racing action and atmosphere, a 3-day ticket in the Blue Zone still lets you walk over toward Foro Sol on foot during breaks to soak up the crowd there — the reverse isn't really true, since Foro Sol tickets don't get you close to turn 1.",
];

const whatToAvoid = `Don't assume every grandstand comes with real seats — most of this circuit's stands, including several in the Blue Zone, use bench-style bleacher seating with thin plastic pads over metal frames, which get uncomfortably hot in direct sun by midafternoon. And don't buy general admission expecting shade or a guaranteed sightline — GA areas here are standing/lawn zones with no assigned view, and popular vantage points fill up hours before sessions start on race day specifically.`;

const practicalInfo = {
  hours: "Gates open ahead of each day's first session — check the official schedule closer to race week for exact times",
  costRange: "Varies significantly by zone and day — Blue Zone and Foro Sol grandstands command a premium over Yellow Zone and general admission; check tickets.formula1.com for current tier pricing",
  bookingMethod: "All grandstands are sold as numbered, allocated seats through tickets.formula1.com or mexico.gp — general admission is sold separately as standing/lawn access with no assigned seat.",
  website: "https://www.mexico.gp/en/map-of-the-grandstands-17, https://tickets.formula1.com/en/f1-4861-mexico",
};

const gettingThere = "Entry gates correspond to specific grandstand zones — check your ticket for the correct gate before race day, since the circuit perimeter is long enough that arriving at the wrong gate can mean a lengthy walk around to the right one.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Where to Sit — Grandstand Comparison",
      subtitle: "Blue Zone for overtaking, Foro Sol for atmosphere — the two are not the same weekend",
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
      editorialNote: "Zone/grandstand comparison sourced from oversteer48.com's individual grandstand guides (3, 4, 5, 6, 6A, 8, 9, 12, 14, 15) and Formula1.com's official grandstand pages, Sep 2026. No official 2026 per-zone pricing found — costRange kept general, pointed to official site.",
      sport: ["formula_one"],
      moodTags: ["strategic", "practical", "first-timer-friendly"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
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

  console.log("Experience #2 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

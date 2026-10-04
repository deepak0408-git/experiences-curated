// Grandstand H — Chinese GP 2027. Ticket/schedule facts from
// formula1.com/en/racing/2027/china (official — 1.2km Turn 13-14 straight,
// hairpin overtaking zone), ticketing.formula1.com (passport requirement),
// f1experiences.com (H/K package option). Seat-specific detail (covered,
// facing K across the hairpin exit, distant final-corner/pit-entry views)
// confirmed directly by founder against circuit reference material, 23 Sep
// 2026 — not attributed to a specific URL.
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "998a8774-05ac-4482-ba7a-4ca2a556b963";
const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";
const slug = "chinese-gp-grandstand-h-" + Date.now().toString(36);

const bodyContent = `Grandstand H sits at the end of one of the longest straights on the current F1 calendar — the 1.2km run linking Turns 13 and 14, confirmed directly on formula1.com as a defining feature of this circuit. That length matters: it gives cars enough room to build a genuine slipstream on the car ahead, and enough braking distance into the hairpin at the end for a real overtaking attempt rather than a token look up the inside.

H is a covered grandstand, facing directly across the hairpin at Grandstand K on the exit side. The two stands watch the same corner from opposite ends of the same move — H sees the approach and the braking, the moment where a slipstream either converts into a pass or doesn't; K sees the exit, where you find out whether it actually stuck. If you're choosing between them, that's the real question to ask yourself: do you want to watch the attempt, or the result?

Seats at H also give you distant views of the final corner and pit entry, a bonus beyond the hairpin itself, and — like every grandstand at the circuit — a large screen keeps you following whatever's happening elsewhere on the lap.

F1 Experiences currently sells Grandstand H paired with K as a single "H/K" choice within its 2027 package tiers, which suggests the two are close enough in price and general area to be offered together — but they're genuinely different views, not interchangeable seats, so it's worth asking specifically which one you're being allocated rather than assuming.

As with every grandstand at this circuit, all attendees need passport details registered against their ticket ahead of the event.`;

const whyItsSpecial = `A hairpin at the end of a long straight is the single most reliable overtaking setup in modern Formula 1, and Grandstand H watches the exact moment that setup pays off or doesn't — the braking zone, where a driver either commits to a move built over 1.2km of slipstream or backs out of it. That's a sharper, more tension-filled few seconds than most grandstands on most circuits ever offer. The trade-off against its mirror-image neighbor, Grandstand K, is real and worth understanding: H gives you the drama of the attempt, K gives you the resolution. Neither is objectively better — it depends whether you'd rather watch a driver commit to a risk or watch whether that risk paid off. For a circuit whose defining straight exists specifically to manufacture this exact moment, sitting at either end of it is sitting exactly where the race weekend's real tension lives.`;

const practicalInfo = {
  hours: "Gate times TBC for 2027 — check formula1.com closer to the event",
  costRange: "2027 pricing not yet published by Formula 1 or F1 Experiences as of Sep 2026",
  bookingMethod: "Tickets at ticketing.formula1.com/china. F1 Experiences packages naming a Grandstand H/K option: reserve a priority-access deposit at f1experiences.com/2027-chinese-grand-prix.",
  website: "https://www.formula1.com/en/racing/2027/china, https://ticketing.formula1.com/china/, https://f1experiences.com/2027-chinese-grand-prix",
};

const gettingThere = "Shanghai Metro Line 11 to Shanghai Circuit station — roughly 60 minutes from central Shanghai, per Formula 1's own event page — then follow circuit signage toward the Turn 14 hairpin, approach side (opposite Grandstand K).";

const insiderTips = [
  "H watches the braking zone and the attempt itself, not the resolution — if you specifically want to see whether an overtake actually sticks, Grandstand K across the hairpin gives you that half of the move instead.",
  "F1 Experiences currently pairs H and K as a single package choice — confirm exactly which grandstand you're being allocated when you book, since the two views are genuinely different despite being sold together.",
];

const whatToAvoid = "Don't assume H and K are interchangeable just because F1 Experiences sometimes bundles them as one package option — they face opposite sides of the same hairpin, and the specific moment you see (the braking attempt vs. the exit result) differs between them. Don't skip the passport registration requirement until race week — it applies to every attendee at this circuit and is easy to leave too late if you're used to buying F1 tickets with less paperwork elsewhere.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Grandstand H — Shanghai's Braking-Zone Seat",
      subtitle: "Covered, facing the hairpin approach at the end of the calendar's longest straight — the attempt, not the result.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Anting, Jiading District",
      address: "Shanghai International Circuit, No. 2000 Yining Road, Anting Town, Jiading District, Shanghai, China",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Ticket/schedule facts from formula1.com/en/racing/2027/china, ticketing.formula1.com, f1experiences.com. Seat-specific detail (covered, faces K across hairpin, distant final-corner views) confirmed directly by founder against circuit reference material, 23 Sep 2026.",
      sport: ["formula_one"],
      moodTags: ["thrilling", "iconic"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: new Date().toISOString().slice(0, 10),
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓", result.title, "→", result.id, `(${result.slug})`, result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

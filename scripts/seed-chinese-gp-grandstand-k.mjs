// Grandstand K — Chinese GP 2027. Ticket/schedule/circuit facts sourced from
// formula1.com/en/racing/2027/china (official — Turn 14-15 hairpin
// recommendation, Turn 6 alternative, circuit layout), ticketing.formula1.com
// (passport requirement, large screens circuit-wide), f1experiences.com
// (H/K package pairing). Seat-specific view/cover/proximity detail (facing H
// across the hairpin exit, proximity to Main Grandstand and food/drink/
// merchandise, covered stand, photo opportunities) confirmed directly by the
// founder against circuit reference material, 23 Sep 2026 — not attributed to
// a specific URL, distinct from the three official-source facts above. No
// third-party ticket/tour site cited directly per founder instruction.
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "998a8774-05ac-4482-ba7a-4ca2a556b963";
const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";
const slug = "chinese-gp-grandstand-k-" + Date.now().toString(36);

const bodyContent = `Formula 1's own race guide names one grandstand above the rest for overtaking: Grandstand K, at the Turn 14-15 hairpin, described directly on formula1.com as where "you'll be in the best seats to watch all the overtaking." That's F1's own recommendation, not a resale site's marketing line, and the geometry backs it up — the hairpin sits at the end of a 1.2km straight linking Turns 13 and 14, one of the longest continuous runs on the current calendar. Cars arrive at full speed and brake hard, which is exactly the setup that produces real passing rather than the processional following that fills most of a modern Grand Prix lap.

Grandstand K sits on the exit side of that hairpin, directly across from Grandstand H on the entry side. Both stands are covered and both come with a large screen, so the choice between them isn't about comfort — it's about which half of the move you want to watch. K catches the second half of any overtake, as cars power back up out of the hairpin, which tends to reward you with better photo opportunities of the low-speed action than the braking-zone view from H. K also sits closer to the circuit's Main Grandstand and to the bulk of the food, drink, and merchandise stalls, so it's a more convenient base if you're planning to move around the venue across the weekend rather than stay put in your seat.

F1's guide also names a second genuine passing zone worth knowing about even if you're sitting at K: Turn 6, a second-gear hairpin with generous run-off, where Daniel Ricciardo sealed his 2018 win with a move on Valtteri Bottas. It's a reminder that Shanghai's racing doesn't happen in one place — if K is sold out, a seat near Turn 6 is a genuine second option, not a consolation prize.

As with every grandstand at this circuit, all attendees need passport details registered against their ticket ahead of the event — a real requirement on F1's own ticketing site, and one that catches out fans used to buying F1 tickets in Europe, where it isn't asked for.`;

const whyItsSpecial = `Plenty of grandstands claim a good view. Grandstand K is one F1 itself is willing to single out by name as the best seat for actual racing, not just proximity to the track — a circuit's own promoters rarely go out of their way to recommend one specific stand over the dozen others selling tickets right alongside it. The reason is structural: this grandstand faces the exit of the hairpin at the end of the longest straight on the current F1 calendar, catching cars mid-overtake as they power back up to speed. Sitting across from Grandstand H rather than facing the braking zone head-on is a real trade worth understanding before you book — K gives up the drama of the initial lunge for a better look at whether the move actually stuck, plus easier access to the food and merchandise hub that clusters near it. If the race has a moment worth building a seat around, this is where F1 itself says it happens, and K is the seat that watches it resolve.`;

const practicalInfo = {
  hours: "Gate times TBC for 2027 — check formula1.com closer to the event",
  costRange: "2027 pricing not yet published by Formula 1 or F1 Experiences as of Sep 2026",
  bookingMethod: "Tickets at ticketing.formula1.com/china. F1 Experiences packages naming a Grandstand H/K option: reserve a priority-access deposit at f1experiences.com/2027-chinese-grand-prix.",
  website: "https://www.formula1.com/en/racing/2027/china, https://ticketing.formula1.com/china/, https://f1experiences.com/2027-chinese-grand-prix",
};

const gettingThere = "Shanghai Metro Line 11 to Shanghai Circuit station — roughly 60 minutes from central Shanghai, per Formula 1's own event page — then follow circuit signage toward the Turn 14 hairpin, exit side (opposite Grandstand H).";

const insiderTips = [
  "K catches the exit of the hairpin, not the braking zone — if you specifically want the drama of the late lunge under braking, Grandstand H across the way gives you that half of the move instead; K rewards you with the resolution and better photos as cars power back up to speed.",
  "F1's own race guide names Turn 6 as the circuit's other genuine passing zone — if Grandstand K sells out or is over budget, ask specifically about seats near Turn 6 rather than defaulting to a straight-line grandstand with less racing happening in front of it.",
];

const whatToAvoid = "Don't assume Grandstand K and Grandstand H offer the same view just because F1 Experiences sometimes pairs them as one package choice — they face opposite sides of the same hairpin, and the moment you actually see differs between them. Don't skip the passport registration requirement until race week — it applies to every attendee at this circuit and is easy to leave too late if you're used to buying F1 tickets with less paperwork elsewhere.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Grandstand K — Shanghai's Real Overtaking Seat",
      subtitle: "F1's own guide calls this the best seat for overtaking — the hairpin exit, closer to food and merch than H.",
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
      editorialNote: "Ticket/schedule facts from formula1.com/en/racing/2027/china (Turn 14-15 recommendation, Turn 6), ticketing.formula1.com (passport requirement), f1experiences.com (H/K package option). Seat-specific view/proximity detail confirmed directly by founder against circuit reference material, 23 Sep 2026.",
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

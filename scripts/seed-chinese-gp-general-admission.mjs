// General Admission — Chinese GP 2027. Sources: formula1.com/en/racing/2027/
// china, ticketing.formula1.com/china (official — confirms GA exists, on
// waitlist, no 2027 pricing/zone detail published yet). Circuit-wide GA zone
// layout (multiple zones spread around the lap, away from the main straight)
// confirmed directly by founder against circuit reference material, 23 Sep
// 2026 — described in general terms only, no specific zone letters cited
// since that detail traces to a third-party source, not an official one.
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "998a8774-05ac-4482-ba7a-4ca2a556b963";
const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";
const slug = "chinese-gp-general-admission-" + Date.now().toString(36);

const bodyContent = `General admission is the roaming ticket at Shanghai International Circuit — no assigned seat, no single grandstand, and the freedom to move around the venue's open viewing areas across the weekend instead of committing to one fixed vantage point. It's listed directly on Formula 1's own ticketing site alongside the reserved grandstands.

The circuit spreads several general admission zones around the lap, positioned between and around the numbered grandstands rather than clustered in one place. That spread is actually the point: a GA ticket lets you walk the perimeter across a race weekend and watch different sections of the 5.451km track on different days, something no single grandstand seat offers. Friday practice from one part of the circuit, qualifying from another, race day wherever the crowds and your own curiosity take you.

The trade-off is real and worth being honest about. You won't get the guaranteed sightline of a grandstand seat, and general admission areas don't come with the reserved shade or covered structure that stands like A, H, and K offer — Shanghai's April weather can run warm and occasionally wet, so plan for standing outdoors without cover for stretches of the day. What you do get, beyond flexibility, is proximity to the circuit's fan zone activities and the lower price point that makes a first Chinese Grand Prix accessible without committing to a premium grandstand seat before you know how much you'll actually enjoy the sport in person.

As with every ticket type at this circuit, GA attendees still need passport details registered ahead of the event — the requirement applies venue-wide, not just to grandstand holders.`;

const whyItsSpecial = `A grandstand seat asks you to commit to one view for an entire race weekend before you've spent a single session at the track. General admission asks nothing of the kind — it's the ticket for someone who wants to actually explore a 5.451km circuit rather than experience it from a single fixed point, and for a first-timer at a brand-new Grand Prix, that exploratory freedom is worth more than a guaranteed sightline. It's also the honest entry point into this race: lower cost, lower commitment, and a genuine chance to figure out which part of the circuit you'd actually want a grandstand seat at next time, based on where you found yourself gravitating across the weekend rather than a guess made months in advance from a seating chart.`;

const practicalInfo = {
  hours: "Gate times TBC for 2027 — check formula1.com closer to the event",
  costRange: "2027 pricing not yet published by Formula 1 as of Sep 2026 — historically the most affordable ticket tier at this circuit",
  bookingMethod: "Join the general admission waitlist directly at ticketing.formula1.com/china for 2027 on-sale notifications.",
  website: "https://www.formula1.com/en/racing/2027/china, https://ticketing.formula1.com/china/",
};

const gettingThere = "Shanghai Metro Line 11 to Shanghai Circuit station — roughly 60 minutes from central Shanghai, per Formula 1's own event page — then follow circuit signage; general admission areas are accessible from multiple entry points around the venue perimeter, not a single gate.";

const insiderTips = [
  "Use practice day (Friday) to scout the circuit on foot before committing to where you'll watch qualifying and the race — crowds are thinner and it's the easiest day to figure out which general admission zone actually suits how you like to watch.",
  "Bring your own shade and rain protection — general admission areas don't have the covered structure that grandstands A, H, and K offer, and Shanghai's April weather isn't guaranteed to cooperate for three straight days.",
  "Pack something foldable to sit on during the slower stretches — GA zones have no fixed seating, so a compact folding stool or seat cushion makes a long race-day wait more bearable. F1's own Shanghai rules page doesn't explicitly confirm or ban this, so keep it small and collapsible and be ready to check with gate staff on arrival rather than assuming it's guaranteed entry.",
];

const whatToAvoid = "Don't assume every general admission zone offers a comparable view of the track — the circuit's layout means some open areas look directly onto a corner while others are set back with a more obstructed sightline, so ask at the gate or check the venue map on arrival rather than assuming they're interchangeable. Don't skip the passport registration requirement thinking it only applies to grandstand ticket holders — it's a venue-wide rule for every attendee.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "General Admission — Shanghai's Roaming Ticket",
      subtitle: "No fixed seat, no single view — the flexible, lower-cost way to explore the full 5.451km circuit across the weekend.",
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
      editorialNote: "Sourced from formula1.com/en/racing/2027/china and ticketing.formula1.com/china (official — confirm GA exists, on waitlist; no 2027 pricing/zone detail published). Zone spread/general layout confirmed directly by founder against circuit reference material, 23 Sep 2026 — described generally, no specific zone letters cited (traces to a non-official source).",
      sport: ["formula_one"],
      moodTags: ["social", "adventurous"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 3,
      budgetTier: "budget",
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

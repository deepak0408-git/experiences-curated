import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne
const EVENT_ID = "64792f75-c009-4070-a12b-23d7bd0a3a7f"; // Australian GP 2027
const slug = "vettel-stand-turns-11-12-" + Date.now().toString(36);

const bodyContent = `The Vettel Grandstand sits on the outside of Turn 11, the slow, tight corner that closes out one of Albert Park's DRS zones. That combination — a DRS straight feeding a genuinely slow corner — is what makes this one of the circuit's real overtaking spots, not just a scenic vantage point. You watch cars arrive fast off the bridge before the corner, brake hard, and either hold position or get passed right in front of you.

The stand is small: 12 rows, labelled A through M with no row I, seat numbers running 1-36 in Section A and 1-26 in Sections B and C. Because it doesn't rise very high, you're always watching through the safety fence rather than over it — a real trade-off against taller stands elsewhere on the circuit, though the actual racing more than compensates if overtaking is what you came to see. Section A and B give you the approach and the corner itself; Section C is the pick if you want more, since it also opens up a sightline down to the braking and turn-in point for Turn 12, where the Lauda Grandstand sits.

That's worth knowing because Turn 12 is a different kind of corner entirely — a fast right-hander taken at around 220km/h, all about downforce holding the car rather than late braking. From most of Vettel you won't see it; only Section C gives you the bridge between the two. If you specifically want Turn 12's high-speed apex rather than Turn 11's braking battle, Lauda — facing back toward the city skyline — is the stand built for that, not Vettel.

Vettel is a corner-specialist's seat: no podium, no start-finish straight, just a genuine slow-corner passing zone with a DRS approach feeding into it. For fans who'd rather watch cars actually racing wheel-to-wheel than watch pit stops from a distance, this is one of the sharper picks at Albert Park, priced well below the premium pit-straight stands.`;

const whyItsSpecial = `Albert Park has plenty of grandstands that sell proximity to something famous — the pits, the podium, the paddock. Vettel sells something rarer: a genuine chance of seeing an overtake happen right in front of you. Turn 11 sits at the end of a DRS zone and is slow enough that a car with a run can actually complete a pass here, which isn't true of most of this circuit's fast, flowing corners.

It's a small, no-frills stand — you're looking through fencing rather than over it, and there's no podium ceremony to watch afterward. But that's the honest trade for a seat built around one specific, repeatable piece of racing action rather than atmosphere or ceremony. For a fan who'd rather watch ten genuine passing attempts across a race than one polished podium moment, Vettel is the more interesting seat, and it costs meaningfully less than the pit-straight stands to get it.`;

const insiderTips = [
  "Section C is the only part of the Vettel stand that also opens up a sightline to Turn 12's braking zone — worth the small premium if you want two corners' worth of action instead of one.",
  "Because the stand only has 12 rows and doesn't rise above the safety fence, bring binoculars if you want a clean, unobstructed look at close-quarters battles rather than relying on the big screens.",
];

const whatToAvoid = "Don't buy Vettel expecting the podium ceremony or pit-lane action — this stand faces a mid-circuit corner with no view of the start-finish straight at all. And don't assume Sections A or B give you any view of Turn 12 — only Section C's sightline extends that far, so if the Lauda-style Turn 12 apex is specifically what you want to see, book Lauda directly rather than gambling on Vettel's Section C availability.";

const practicalInfo = {
  hours: "Gates open from approximately 08:00 each day, 2–4 Apr 2027. Reserved seating applies Friday–Sunday; Thursday is unreserved circuit-wide.",
  costRange: "US$330–400 for a 3-day reserved ticket (2027 tier pricing, shared with Button, Waite, Webber, Stewart, Senna and several other mid-tier grandstands).",
  bookingMethod: "Buy directly through the Australian Grand Prix Corporation's official ticketing hub at grandprix.com.au.",
  website: "https://www.grandprix.com.au/en/tickets",
  reservationsRequired: true,
};

const gettingThere = "Albert Park is a 5-10 minute walk from Melbourne's tram network (routes 1, 3, 5, 6, 16, 64, 67, 72 serve the precinct) — a free AGPC shuttle also runs from the city on event days. Vettel sits on the circuit's southern side near Turns 11-12; check your ticket for the specific gate letter, since Albert Park's perimeter gates each serve different grandstands.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Vettel Stand — Turns 11 & 12",
      subtitle: "A DRS-zone overtaking corner at Albert Park — braking battles up close, not a scenic seat.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Albert Park Grand Prix Circuit",
      address: "Albert Park Grand Prix Circuit, 12 Aughtie Dr, Albert Park VIC 3206, Australia",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: oversteer48.com/vettel-grandstand/ (seating plan A-M no row I, Section C sightline to Turn 12, fencing height), oversteer48.com/lauda-grandstand/ (Turn 12 apex speed ~220km/h, facing city skyline), grandprixgrandtours.com circuit guide (DRS zone/overtaking context). Seeded planner_ticket_tier_cost (tier2, US$330-400, confirmed in DB 19 Sep 2026). Verified 20 Sep 2026.",
      sport: ["formula_one"],
      moodTags: ["high-energy", "authentic", "immersive"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-20",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created:", result.title, "|", result.id, "|", result.slug, "|", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

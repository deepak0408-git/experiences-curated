import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne
const EVENT_ID = "64792f75-c009-4070-a12b-23d7bd0a3a7f"; // Australian GP 2027
const slug = "fangio-grandstand-albert-park-" + Date.now().toString(36);

const bodyContent = `The Fangio Grandstand sits on the outside of the main straight, directly opposite the pit lane and garages, with the podium in your eyeline once the chequered flag falls. Named after Juan Manuel Fangio, it's one of the four premium grandstands at Albert Park — reserved seating with a real view of the pre-race grid walk, pit stops, and the finish, rather than a single corner's worth of action.

The 2026 rebuild shrank Fangio to make room for the new Piastri Grandstand next door, and cover was added to roughly half the seats for the first time — sections labelled AA through NN at the top are shaded, while the lower, uncovered rows keep the original open-air feel. That covered upper tier is worth paying for in Melbourne, where a clear morning can turn into a squally afternoon inside a single session.

What you don't get from Fangio is a clean look at Turn 1 or the final corner — safety fencing at both ends of the straight blocks that sightline almost entirely, which is the trade-off for sitting this close to the pits. If watching pit stops and the podium matters more to you than watching cars brake into a corner, that trade is worth making. Section F, nearest the start-finish line, gives the most direct view of the big screens and the podium steps; row K or higher is where the pit lane itself actually opens up below the garage roofline.

Thursday is unreserved seating across the whole grandstand — if you're at Albert Park early for support-category practice or the Melbourne Walk, you can sit anywhere in Fangio before the weekend's reserved allocation kicks in from Friday.

Three-day Fangio tickets for 2027 sit in the top reserved-seating tier at Albert Park, alongside Piastri, Prost and Jones — Formula 1's most in-demand start-finish-straight seats outside the paddock itself. Buy through the official Australian Grand Prix Corporation ticketing hub; resale prices on this stand climb fast once the official allocation sells through, which at Fangio has historically been before the new year for an April race.`;

const whyItsSpecial = `Most grandstands at Albert Park sell you one corner. Fangio sells you the whole ceremony — the grid forming, the pit crews working, and, if your team is in podium contention, the finish itself, all from one seat. That's a different kind of afternoon than watching a braking zone, and it's why this stand and its three neighbours command the highest reserved-seating prices on the circuit.

The 2026 addition of partial cover changed the calculation here. Albert Park in April can deliver real heat and a real downpour in the same session, and half of Fangio now shrugs that off. What hasn't changed is the fencing at both ends of the straight — you're trading the first and last corners for the pit lane and the podium, and that's a genuine trade, not a minor inconvenience. Anyone choosing Fangio should choose it because pit lane theatre and the finish are what they actually want to watch, not because it's the grandstand with the famous name.`;

const insiderTips = [
  "Row K or higher is the actual threshold for seeing over the pit garage roofline into the pit lane itself — anything lower and the pit crews are mostly hidden.",
  "Thursday's unreserved seating means you can sample the covered upper rows before the weekend's assigned seating locks you into whichever section you bought.",
];

const whatToAvoid = "Don't buy Fangio expecting a clear view of Turn 1 or the final corner — safety fencing at both ends of the straight blocks most of that sightline, a genuine limitation regardless of which row you're in. And don't assume every seat is covered: the 2026 rebuild only shaded the upper AA–NN rows, so a lower-numbered seat in the standard tier is still fully exposed to sun and rain.";

const practicalInfo = {
  hours: "Gates open from approximately 08:00 each day, 2–4 Apr 2027. Reserved seating applies Friday–Sunday; Thursday is unreserved circuit-wide.",
  costRange: "US$485–625 for a 3-day reserved ticket (2027 tier pricing, shared with Piastri, Prost and Jones grandstands).",
  bookingMethod: "Buy directly through the Australian Grand Prix Corporation's official ticketing hub at grandprix.com.au — Fangio is one of the top reserved-seating tiers and has historically sold out its official allocation well ahead of race weekend.",
  website: "https://www.grandprix.com.au/en/tickets",
  reservationsRequired: true,
};

const gettingThere = "Albert Park is a 5-10 minute walk from Melbourne's tram network (routes 1, 3, 5, 6, 16, 64, 67, 72 all run near the precinct) — the free AGPC shuttle also runs from the city on event days. Fangio's entry gates sit on the lakeside path opposite the pit straight; check your ticket for the specific gate letter, since Albert Park's perimeter gates each serve different grandstands.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Fangio Grandstand — Pit Straight & Podium",
      subtitle: "Reserved seats opposite the pits at Albert Park — the grid, the stops, and the finish from one seat.",
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
      editorialNote: "Sources: f1-australia.com/en/ticket-info/grandstand-fangio (location, seating tiers, Thursday unreserved rule), oversteer48.com/fangio-grandstand/ (2026 rebuild detail, sections A-F, row K sightline, fencing limitation), seeded planner_ticket_tier_cost (tier3, US$485-625, confirmed in DB 19 Sep 2026). Verified 20 Sep 2026.",
      sport: ["formula_one"],
      moodTags: ["high-energy", "premium", "immersive"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 1,
      budgetTier: "splurge",
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

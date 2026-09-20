import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne
const EVENT_ID = "64792f75-c009-4070-a12b-23d7bd0a3a7f"; // Australian GP 2027
const slug = "piastri-grandstand-albert-park-" + Date.now().toString(36);

const bodyContent = `The Piastri Grandstand opened in 2026, built for one reason: Oscar Piastri went from karting on Melbourne's local tracks to winning grands prix faster than any Australian driver before him, and Albert Park wanted a stand with his name on it directly opposite the McLaren garage. It sits at the very end of what used to be the full-length Fangio Grandstand, carved out as its own five-section structure — A through E, 62 seats per section — on the outside of the main straight.

The view is the same trade-off as its neighbour Fangio: you get the start-finish line, the pit lane, and the podium dead ahead, but safety fencing at both ends of the straight blocks most of the sightline into Turn 1 and the final corner. Sections B and C sit closest to the podium and start-finish line and are the pick if that's what you came for. Row K or higher is where the pit garages themselves become visible over the wall — anything lower and you're watching screens more than pit crews.

Seating splits the same way as Fangio: standard uncovered rows A-N in the lower half, premium covered rows AA-NN above, with armrests and cup holders on the premium tier. Row N in the standard section catches sun until around 4pm, which matters on Albert Park's warmer April afternoons — the covered upper rows are worth the premium if shade is a priority. A support pole here and there can clip the view from some FF-and-above seats, a real if minor trade for the shade.

Original 2026-season buyers received Piastri-branded merchandise (a cap and t-shirt) as a launch perk — whether that continues for 2027 hasn't been confirmed, so treat it as a bonus rather than a reason to buy. What is certain is that this is the newest, most in-demand grandstand at the circuit, built specifically because a home-grown driver's results earned it — expect it to sell out before the less name-driven stands every year it's offered.`;

const whyItsSpecial = `Albert Park has grandstands named after Fangio, Brabham, Stewart, Lauda — legends long retired or gone. Piastri is different: it's named after someone racing this exact season, built while his career is still being written, for a home crowd that watched him come up through Australian karting before most of the world had heard of him. Sitting here isn't just buying a seat with a good sightline to the pits — it's buying into the newest chapter of Melbourne's own F1 story while it's still being written.

That novelty comes with real limitations worth being honest about: the same fencing that blocks Fangio's view of Turn 1 blocks Piastri's too, and this isn't a corner-watching stand. What it is, is the seat closest to the McLaren garage on race weekend, in the newest structure on the circuit, named for a driver whose Melbourne roots make this grandstand feel personal in a way none of the others quite do.`;

const insiderTips = [
  "Sections B and C sit most directly opposite the podium and start-finish line — the two sharpest picks within the stand if the finish and trophy ceremony matter most to you.",
  "Standard-tier row N gets direct sun until roughly 4pm on race day — pack accordingly, or pay the premium-tier difference for the shaded AA-NN rows if you're sensitive to Melbourne's April sun.",
];

const whatToAvoid = "Don't expect a view of Turn 1 or the final corner — like Fangio next door, safety fencing at both ends of the straight blocks most of that sightline regardless of seat choice. And don't book an FF-or-above seat assuming an unobstructed view without checking the seat map first — a support pole clips sightlines from some seats in that row, a genuine limitation the ticket page doesn't always flag clearly.";

const practicalInfo = {
  hours: "Gates open from approximately 08:00 each day, 2–4 Apr 2027. Reserved seating applies Friday–Sunday; Thursday is unreserved circuit-wide.",
  costRange: "US$485–625 for a 3-day reserved ticket (2027 tier pricing, shared with Fangio, Prost and Jones grandstands).",
  bookingMethod: "Buy directly through the Australian Grand Prix Corporation's official ticketing hub at grandprix.com.au — as the newest and most in-demand stand at Albert Park, Piastri has sold out its official allocation early in each season it's been offered.",
  website: "https://www.grandprix.com.au/en/tickets",
  reservationsRequired: true,
};

const gettingThere = "Albert Park is a 5-10 minute walk from Melbourne's tram network (routes 1, 3, 5, 6, 16, 64, 67, 72 all serve the precinct) — a free AGPC shuttle also runs from the city on event days. Piastri sits at the far end of the old Fangio structure; check your ticket for the specific gate letter, since Albert Park's perimeter gates each serve different grandstands.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Piastri Grandstand — Albert Park's Newest Stand",
      subtitle: "Built for Melbourne's own F1 star — pit-straight seats opposite the McLaren garage, new for 2026.",
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
      editorialNote: "Sources: oversteer48.com/piastri-grandstand-australian-grand-prix/ (sections A-E, row K sightline, sun exposure on row N, pole obstruction on FF+), autoaction.com.au (why the stand was built, Piastri/Webber quotes, launch merch), seeded planner_ticket_tier_cost (tier3, US$485-625, confirmed in DB 19 Sep 2026). 2027 launch-merch continuation unconfirmed — flagged as such. Verified 20 Sep 2026.",
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

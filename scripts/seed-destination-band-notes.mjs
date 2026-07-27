import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// 2-sentence curated editorial notes for Local Travel and Food, confirmed
// with user 19 Jul 2026. Written from real published in-house experience
// content (not generic travel-blog advice) — "Getting to the Circuit",
// "Belgian Race Weekend Street Food", "Eating in Monza", "The 7 Train to
// Flushing", "Jackson Heights: The Food Mile", "Flushing's Golden Mall".
// Abu Dhabi deliberately excluded — no in-house content exists yet,
// deferred to the production data pass, not researched fresh for this
// test-data round.
const NOTES = [
  {
    destId: "101b815a-ba64-4484-aad6-63721a44ed85",
    name: "Belgian Ardennes",
    localTravelNote: "The City Shuttle from Brussels, Liège, and 12 other cities is the cleanest way in — the circuit has no train station and sits in a valley 13km from Spa town. Book early; shuttle seats and race-weekend parking both sell out.",
    foodNote: "Circuit food is Belgian and genuinely expensive, with vendors near the Francorchamps gates doing only slightly better. Sort your frites and Liège waffles before heading to the circuit, or save proper eating for Spa town's restaurants after.",
  },
  {
    destId: "0b0d8f9a-911d-4cc7-8049-50e4685958ca",
    name: "Milan",
    localTravelNote: "Monza isn't a drive-in circuit — take the S8/S9/S11 suburban train to Biassono-Lesmo Parco, then walk 20 minutes through Parco di Monza to the gates. Pre-buy your €3.10 ticket at the station or via the Trenord app; it's one of the best approaches to any F1 venue.",
    foodNote: "Skip the circuit's inflated stalls when you can — Monza town and the Brianza area serve serious, unpretentious local food like risotto con la luganega. It's not polished like central Milan, but you'll eat better than you'd expect this close to a racetrack.",
  },
  {
    destId: "fb782de2-bbe6-410f-b466-2a4e628cda10",
    name: "New York",
    localTravelNote: "The 7 train is the move — board anywhere between Hudson Yards and Queensboro Plaza and ride direct to Mets-Willets Point, one stop from the end of the line and right by the tournament gates. No transfers, no guessing.",
    foodNote: "Skip the concourse prices and detour to Jackson Heights or Flushing's Golden Mall, both directly on the 7 line. Roosevelt Avenue's food mile and the Golden Mall's basement food court serve genuinely excellent South Asian, Latin American, and Chinese regional food at neighborhood prices.",
  },
];

for (const n of NOTES) {
  await sql`
    UPDATE planner_destination_bands
    SET local_travel_note = ${n.localTravelNote}, food_note = ${n.foodNote}
    WHERE destination_id = ${n.destId}
  `;
  console.log(`✓ ${n.name}`);
}

await sql.end();

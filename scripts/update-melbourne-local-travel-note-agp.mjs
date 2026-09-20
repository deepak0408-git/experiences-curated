import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Broaden Melbourne's shared planner_destination_bands.local_travel_note to
// cover the Australian Grand Prix's own free-transit perk for ticket-holders
// (confirmed 19 Sep 2026 via grandprix.com.au: free shuttle trams CBD <->
// Albert Park + free train travel via State Library/Town Hall/Anzac stations
// on race days), alongside the existing Australian Open tram 70/70a perk.
// This row is per-destination (shared across every Melbourne event, not
// per-event) per the planner-data-researcher skill's Local Travel/Food
// methodology -- so the note is broadened, not replaced, to stay accurate
// for both events. costLow/costHigh/foodNote are unchanged.

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne

const NEW_NOTE =
  "This price covers Melbourne's myki-based trains, trams, and buses, capped at $11.40/day for Zone 1+2 — genuinely no car needed. Ticket-holders get free rides on event days: Australian Open fans get free tram 70/70a between Docklands and Melbourne Park, and Australian Grand Prix fans get free shuttle trams from the CBD to Albert Park plus free trains via State Library/Town Hall/Anzac stations.";

const result = await sql`
  UPDATE planner_destination_bands
  SET local_travel_note = ${NEW_NOTE}, last_updated = NOW()
  WHERE destination_id = ${DESTINATION_ID}
  RETURNING local_travel_note
`;
console.log("Updated local_travel_note:\n", result[0]?.local_travel_note);

await sql.end();

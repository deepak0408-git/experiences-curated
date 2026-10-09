import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import fs from "fs";
import { plannerFlightCost } from "../schema/database.ts";

// Border-Gavaskar Trophy 2027 — 49-origin flight cost seed into Chennai.
// Researched 9 Oct 2026 per planner-data-researcher skill's Flights
// methodology. Window: 24 Jan - 7 Feb 2027 (Chennai Test, 29 Jan-2 Feb,
// +/-5 days). Round-trip economy, <=1 stop.
//
// 45/49 routes: real combined Google Flights + Kayak data, density-
// boundary outlier exclusion (>=4 neighbours within $200).
// 4/49 routes: single-source fallback after 3 independent retries on the
// other site returned zero usable results (Buenos Aires/Mexico City:
// Kayak only; Casablanca: Kayak, Google Flights' 3 points excluded as
// outliers; Moscow: Google Flights only, the documented standing Kayak
// gap for this origin).
//
// FOUNDER CORRECTION, 9 Oct 2026: the 3 India-domestic origins (Bangalore,
// Mumbai, New Delhi) came back implausibly high from the Google Flights/
// Kayak pass ($86-163, $149-279, $217-365) for short domestic Indian
// routes. Re-sourced from MakeMyTrip's own listed one-way low fares
// (India's dominant domestic booking platform), doubled for round-trip --
// NOT the full 2-site density-boundary methodology (MakeMyTrip is
// JS-rendered, no browser-automation tool available in this session to
// pull a real combined-dataset sample the way Google Flights/Kayak were).
// Flagged as a narrower, single-source-equivalent result:
//   Bangalore: MYT one-way INR 2,323-3,999 (IndiGo/Air India) -> USD 48-83
//   Mumbai: MYT one-way INR 5,707-6,118 (Air India/IndiGo) -> USD 118-126
//   New Delhi: MYT one-way INR 5,508-9,253 (Air India/IndiGo) -> USD 114-191
//
// Full compiled table reviewed and approved via Artifact
// (https://claude.ai/artifact/Ut2Afwn9tErZUvtUutND7H) before this script
// was run. Source data: scratchpad/bgt-flights-table.json.

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9"; // Chennai
const EDITION_YEAR = 2027;
const SEASONAL_BAND = "jan";

const rows = JSON.parse(fs.readFileSync("scratchpad/bgt-flights-table.json", "utf-8"));

const values = rows.map((r) => {
  const [, low, high] = r.finalRange.match(/^\$(\d+)-(\d+)$/);
  return {
    destinationId: DESTINATION_ID,
    originMarket: r.origin,
    seasonalBand: SEASONAL_BAND,
    editionYear: EDITION_YEAR,
    costLow: Number(low).toFixed(2),
    costHigh: Number(high).toFixed(2),
    currency: "USD",
    refreshPass: "initial",
  };
});

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

await db.insert(plannerFlightCost).values(values).onConflictDoNothing();

console.log(`Seeded ${values.length} planner_flight_cost rows for Border-Gavaskar Trophy 2027 (Chennai, ${SEASONAL_BAND} ${EDITION_YEAR}).`);
await client.end();

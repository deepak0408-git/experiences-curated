import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// Nearest bookable airport, batch 2 — researched and confirmed with user
// 19 Jul 2026. Both chosen using the "highest genuine international traffic"
// rule (not pure proximity, not just the nearest/capital city):
// - Liverpool -> MAN (Manchester), not LPL. theopen.com's own "Getting
//   There" page lists both, but Manchester handled ~32M passengers in 2025
//   with real long-haul international routes vs LPL's ~5.6M mostly-
//   short-haul European leisure traffic — the realistic hub an
//   international golf fan actually books into.
// - Johannesburg -> JNB (OR Tambo), confirmed correct for the Australia in
//   South Africa cricket tour even though it's a 5-city tour (Durban,
//   Johannesburg, Potchefstroom, Gqeberha, Cape Town) and JNB only hosts 1
//   of 6 fixtures — OR Tambo is Africa's busiest airport (28M+ passengers),
//   the only genuine long-haul international gateway in the country, and
//   Cape Town-Johannesburg is Africa's busiest domestic route precisely
//   because international fans fly into JNB first, then connect onward.
const DESTINATIONS = [
  { destId: "263faaad-ceed-4355-acb7-9f2073cb1028", name: "Liverpool", iata: "MAN" },
  { destId: "de40345a-9fbc-4b77-9833-dafed8189e40", name: "Johannesburg", iata: "JNB" },
];

for (const d of DESTINATIONS) {
  await sql`
    UPDATE destinations SET nearest_airport_iata = ${d.iata} WHERE id = ${d.destId}
  `;
  console.log(`✓ ${d.name} -> ${d.iata}`);
}

await sql.end();

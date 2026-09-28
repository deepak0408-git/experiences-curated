// Adds turn/section references to Mexico City GP's circuit_seating_profile
// zone_label field for rows whose label had none (mostly hospitality
// suites, plus Grandstand 2A/3A which had a color/section-only label).
// Founder-flagged 28 Sep 2026: the circuit map's own numbering (Turns 1-15)
// has no grandstand names on it, so a fan reading "Green Zone" alone has
// no way to match a seat option back to a spot on the map — every seat
// option needs a turn/section reference for the map to actually mean
// anything.
//
// Sourced 28 Sep 2026 (never guessed, per feedback_f1_tickets_reseller_
// verification / feedback_websearch_ratings_unverified standing rules):
// - F1 Experiences (f1experiences.com/blog/where-to-watch-the-action-at-the-mexico-city-gp):
//   Champions Club on the Main Straight near team garages/start-finish;
//   Paddock Club above team garages + in the Foro Sol stadium complex.
// - TracksideCulture VIP hospitality guide (tracksideculture.com/guides/mexico-vip-hospitality):
//   Champions Club near the Turn 1 braking zone specifically; Paddock Club
//   above the pit lane; Estadio GNP Seguros suites in the stadium section
//   (Turns 12-14, per the circuit's own Foro Sol section, already
//   documented on Grandstand 14 Sur/15 Norte's existing zone_label rows).
// - F1 official tickets site (Main Grandstand + Speed Lounge Package
//   listing) + oversteer48.com (Main Grandstand 1 guide): Platinum Plus,
//   Skybox, Speed Lounge all Green Zone, Main Grandstand area, start/finish
//   straight (Turn 17 exit to start line).
// - F1 Experiences (House 44 + Gordon Ramsay's La Terraza 2026 product
//   pages) + Soho House's own House 44 writeup: both sit in the Estadio
//   section of F1 Paddock Club — the Foro Sol/Estadio GNP Seguros stadium
//   complex, i.e. Turns 12-14, same section as Grandstand 14/15.
// - oversteer48.com (Grandstand 2A guide): start/finish straight, ~2/3
//   along it, shortly before the Turn 1 braking zone — does NOT overlook
//   Turn 1 itself.
// - oversteer48.com (Grandstand 3A guide): braking zone for Turn 1 plus
//   Turns 1-3 (Curva Moisés Solana, the first chicane).
import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env.local" });
const sql = postgres(process.env.DATABASE_URL, { max: 1 });

const MEXICO_CITY_GP_EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a";

const updates = [
  {
    seatName: "Champions Club",
    zoneLabel: "Green Zone — Main Straight near the Turn 1 braking zone, close to the team garages and start/finish line",
  },
  {
    seatName: "Gordon Ramsay's La Terraza",
    zoneLabel: "Estadio section, Foro Sol stadium complex — overlooks Turns 12-14",
  },
  {
    seatName: "Grandstand 2A",
    zoneLabel: "Orange Zone — start/finish straight, roughly two-thirds along it, shortly before the Turn 1 braking zone (does not overlook Turn 1 itself)",
  },
  {
    seatName: "Grandstand 3A",
    zoneLabel: "Blue Zone — braking zone for Turn 1 through Turns 1-3, the Curva Moisés Solana chicane",
  },
  {
    seatName: "House 44 at F1 Paddock Club",
    zoneLabel: "Estadio section of F1 Paddock Club, Foro Sol stadium complex — overlooks Turns 12-14",
  },
  {
    seatName: "Paddock Club",
    zoneLabel: "Green Zone / Estadio — above the pit lane on the start/finish straight, with a second location in the Foro Sol stadium complex (Turns 12-14)",
  },
  {
    seatName: "Platinum Plus",
    zoneLabel: "Green Zone — Main Grandstand area, start/finish straight between the Turn 17 exit and the start line",
  },
  {
    seatName: "Skybox",
    zoneLabel: "Green Zone — Main Grandstand area, start/finish straight between the Turn 17 exit and the start line",
  },
  {
    seatName: "Speed Lounge",
    zoneLabel: "Green Zone — Main Grandstand area, start/finish straight between the Turn 17 exit and the start line, or Yellow Zone — add-on package",
  },
];

for (const { seatName, zoneLabel } of updates) {
  const result = await sql`
    UPDATE circuit_seating_profile
    SET zone_label = ${zoneLabel}
    WHERE sporting_event_id = ${MEXICO_CITY_GP_EVENT_ID} AND seat_name = ${seatName}
    RETURNING seat_name, zone_label
  `;
  console.log(result.length ? `Updated: ${result[0].seat_name} → ${result[0].zone_label}` : `NOT FOUND: ${seatName}`);
}

await sql.end();

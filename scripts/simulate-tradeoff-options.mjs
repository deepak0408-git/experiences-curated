import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const HOTEL_ORDER = ["budget", "moderate", "splurge", "luxury"];
const TICKET_ORDER = ["tier1", "tier2", "tier3", "tier4"];

function findCurrent(generalRow, realRows, order) {
  if (!generalRow || realRows.length === 0) return null;
  const generalMid = (Number(generalRow.cost_low) + Number(generalRow.cost_high)) / 2;
  let closest = null, closestDelta = Infinity;
  for (const row of realRows) {
    const mid = (Number(row.cost_low) + Number(row.cost_high)) / 2;
    const delta = Math.abs(mid - generalMid);
    if (delta < closestDelta) { closestDelta = delta; closest = row; }
  }
  return closest;
}

const ITALIAN_GP_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e";
const MILAN_DEST_ID = "0b0d8f9a-911d-4cc7-8049-50e4685958ca";

const hotelRows = await sql`SELECT * FROM planner_hotel_tier_cost WHERE destination_id = ${MILAN_DEST_ID}`;
const hotelGeneral = hotelRows.find(r => r.tier === "general");
const hotelReal = hotelRows.filter(r => HOTEL_ORDER.includes(r.tier));
const hotelCurrent = findCurrent(hotelGeneral, hotelReal, HOTEL_ORDER);
const hotelCurrentIdx = hotelCurrent ? HOTEL_ORDER.indexOf(hotelCurrent.tier) : -1;
console.log("Hotel general:", hotelGeneral.cost_low, "-", hotelGeneral.cost_high);
console.log("Hotel current tier:", hotelCurrent.tier, `(index ${hotelCurrentIdx})`);
console.log("Hotel cheaper options:", hotelReal.filter(r => HOTEL_ORDER.indexOf(r.tier) < hotelCurrentIdx).map(r => `${r.tier} $${r.cost_low}-${r.cost_high} (${hotelCurrentIdx - HOTEL_ORDER.indexOf(r.tier)} steps)`));

const ticketRows = await sql`SELECT * FROM planner_ticket_tier_cost WHERE sporting_event_id = ${ITALIAN_GP_ID}`;
const ticketGeneral = ticketRows.find(r => r.tier === "general");
const ticketReal = ticketRows.filter(r => TICKET_ORDER.includes(r.tier) && r.event_tier_label !== null);
const ticketCurrent = findCurrent(ticketGeneral, ticketReal, TICKET_ORDER);
const ticketCurrentIdx = ticketCurrent ? TICKET_ORDER.indexOf(ticketCurrent.tier) : -1;
console.log("\nTicket general:", ticketGeneral.cost_low, "-", ticketGeneral.cost_high);
console.log("Ticket current tier:", ticketCurrent.tier, ticketCurrent.event_tier_label, `(index ${ticketCurrentIdx})`);
console.log("Ticket cheaper options:", ticketReal.filter(r => TICKET_ORDER.indexOf(r.tier) < ticketCurrentIdx).map(r => `${r.tier} "${r.event_tier_label}" $${r.cost_low}-${r.cost_high} (${ticketCurrentIdx - TICKET_ORDER.indexOf(r.tier)} steps)`));

await sql.end();

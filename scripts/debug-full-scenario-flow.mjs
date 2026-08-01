import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

const BELGIAN_GP_ID = "b1816396-6d71-4693-a53f-05bccb2d8a8e";
const BELGIAN_DEST_ID = "101b815a-ba64-4484-aad6-63721a44ed85";
const days = 6;
const budgetMax = 2500;

// Simulate exactly what getTradeoffOptions does
const hotelRows = await sql`SELECT * FROM planner_hotel_tier_cost WHERE destination_id = ${BELGIAN_DEST_ID}`;
const HOTEL_ORDER = ["budget", "moderate", "splurge", "luxury"];
const hotelCurrent = hotelRows.find(r => r.tier === "moderate");
const hotelCurrentIdx = HOTEL_ORDER.indexOf(hotelCurrent.tier);
const hotelCheaper = hotelRows.filter(r => HOTEL_ORDER.indexOf(r.tier) < hotelCurrentIdx)
  .map(r => ({ tier: r.tier, costLow: Number(r.cost_low)*days, costHigh: Number(r.cost_high)*days, stepsFromCurrent: hotelCurrentIdx - HOTEL_ORDER.indexOf(r.tier) }));
console.log("Hotel current:", hotelCurrent.tier, Number(hotelCurrent.cost_low)*days, Number(hotelCurrent.cost_high)*days);
console.log("Hotel cheaper options:", hotelCheaper);

const ticketRows = await sql`SELECT * FROM planner_ticket_tier_cost WHERE sporting_event_id = ${BELGIAN_GP_ID}`;
const TICKET_ORDER = ["tier1", "tier2", "tier3", "tier4"];
const ticketCurrent = ticketRows.find(r => r.tier === "tier2");
const ticketCurrentIdx = TICKET_ORDER.indexOf(ticketCurrent.tier);
const ticketCheaper = ticketRows.filter(r => TICKET_ORDER.indexOf(r.tier) < ticketCurrentIdx && r.event_tier_label !== null)
  .map(r => ({ tier: r.tier, costLow: Number(r.cost_low), costHigh: Number(r.cost_high), stepsFromCurrent: ticketCurrentIdx - TICKET_ORDER.indexOf(r.tier) }));
console.log("\nTicket current:", ticketCurrent.tier, ticketCurrent.event_tier_label, Number(ticketCurrent.cost_low), Number(ticketCurrent.cost_high));
console.log("Ticket cheaper options:", ticketCheaper);

// Now figure out restLow/restHigh from the SCREENSHOT numbers directly
// Screenshot showed: Flights 650-950, Local travel 240-360, Food 180-240
const restLow = 650 + 240 + 180;
const restHigh = 950 + 360 + 240;
console.log("\nRest (from screenshot):", restLow, restHigh);

// Hotel-only green scenario
const hotelGreen = hotelCheaper.find(o => o.stepsFromCurrent === 1);
const hotelOnlyHigh = restHigh + hotelGreen.costHigh + Number(ticketCurrent.cost_high);
console.log("\nHotel-only total high:", hotelOnlyHigh, "fits?", hotelOnlyHigh <= budgetMax);

// Ticket-only green scenario
const ticketGreen = ticketCheaper.find(o => o.stepsFromCurrent === 1);
const ticketOnlyHigh = restHigh + Number(hotelCurrent.cost_high)*days + ticketGreen.costHigh;
console.log("Ticket-only total high:", ticketOnlyHigh, "fits?", ticketOnlyHigh <= budgetMax);

await sql.end();

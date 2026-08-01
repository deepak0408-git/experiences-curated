import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
const sql = postgres(process.env.DIRECT_URL);

// Using screenshot's real numbers
const restLow = 650 + 240 + 180;
const restHigh = 950 + 360 + 240;
const budgetMax = 2500;

const hotelCurrentHigh = 1500, hotelCurrentLow = 900; // moderate x6
const hotelBudgetHigh = 780, hotelBudgetLow = 480; // budget x6
const ticketCurrentHigh = 280, ticketCurrentLow = 180; // silver
const ticketBronzeHigh = 130, ticketBronzeLow = 90; // bronze

// Hotel-only scenario
const hotelOnlyLow = restLow + hotelBudgetLow + ticketCurrentLow;
const hotelOnlyHigh = restHigh + hotelBudgetHigh + ticketCurrentHigh;
const hotelOnlyMid = (hotelOnlyLow + hotelOnlyHigh) / 2;
console.log("Hotel-only:", hotelOnlyLow, "-", hotelOnlyHigh, "mid:", hotelOnlyMid, "fits (mid)?", hotelOnlyMid <= budgetMax);

// Ticket-only scenario
const ticketOnlyLow = restLow + hotelCurrentLow + ticketBronzeLow;
const ticketOnlyHigh = restHigh + hotelCurrentHigh + ticketBronzeHigh;
const ticketOnlyMid = (ticketOnlyLow + ticketOnlyHigh) / 2;
console.log("Ticket-only:", ticketOnlyLow, "-", ticketOnlyHigh, "mid:", ticketOnlyMid, "fits (mid)?", ticketOnlyMid <= budgetMax);

await sql.end();

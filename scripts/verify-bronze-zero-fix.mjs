const restLow = 650 + 240 + 180;
const restHigh = 950 + 360 + 240;
const budgetMax = 2500;

const hotelCurrentLow = 900, hotelCurrentHigh = 1500; // moderate x6
const hotelBudgetLow = 480, hotelBudgetHigh = 780; // budget x6
const ticketCurrentLow = 180, ticketCurrentHigh = 300; // silver (note: screenshot shows 300 now, not 280 - real DB value)
const ticketBronzeLow = 0, ticketBronzeHigh = 0; // bronze, manually zeroed

// Hotel-only (green, 1 step)
const hotelOnlyLow = restLow + hotelBudgetLow + ticketCurrentLow;
const hotelOnlyHigh = restHigh + hotelBudgetHigh + ticketCurrentHigh;
const hotelOnlyMid = (hotelOnlyLow + hotelOnlyHigh) / 2;
console.log("Hotel-only green: mid =", hotelOnlyMid, "fits?", hotelOnlyMid <= budgetMax);

// Ticket-only (green, 1 step: Silver -> Bronze)
const ticketOnlyLow = restLow + hotelCurrentLow + ticketBronzeLow;
const ticketOnlyHigh = restHigh + hotelCurrentHigh + ticketBronzeHigh;
const ticketOnlyMid = (ticketOnlyLow + ticketOnlyHigh) / 2;
console.log("Ticket-only green: mid =", ticketOnlyMid, "fits?", ticketOnlyMid <= budgetMax);

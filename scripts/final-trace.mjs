const days = 6;
const budgetMax = 2500;
const flightLow = 650, flightHigh = 950;
const localLow = 40*days, localHigh = 60*days;
const foodLow = 30*days, foodHigh = 40*days;
const restLow = flightLow + localLow + foodLow;
const restHigh = flightHigh + localHigh + foodHigh;
console.log("Rest low-high:", restLow, restHigh);

const hotelCurrentLow = 150*days, hotelCurrentHigh = 250*days; // moderate
const hotelBudgetLow = 80*days, hotelBudgetHigh = 130*days; // budget
const ticketCurrentLow = 180, ticketCurrentHigh = 300; // silver
const ticketBronzeLow = 0, ticketBronzeHigh = 0; // bronze

const hotelOnlyLow = restLow + hotelBudgetLow + ticketCurrentLow;
const hotelOnlyHigh = restHigh + hotelBudgetHigh + ticketCurrentHigh;
const hotelOnlyMid = (hotelOnlyLow + hotelOnlyHigh) / 2;
console.log("Hotel-only:", hotelOnlyLow, "-", hotelOnlyHigh, "mid:", hotelOnlyMid, "fits?", hotelOnlyMid <= budgetMax);

const ticketOnlyLow = restLow + hotelCurrentLow + ticketBronzeLow;
const ticketOnlyHigh = restHigh + hotelCurrentHigh + ticketBronzeHigh;
const ticketOnlyMid = (ticketOnlyLow + ticketOnlyHigh) / 2;
console.log("Ticket-only:", ticketOnlyLow, "-", ticketOnlyHigh, "mid:", ticketOnlyMid, "fits?", ticketOnlyMid <= budgetMax);

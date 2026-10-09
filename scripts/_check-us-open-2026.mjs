import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, like } from "drizzle-orm";
import { sportingEvents, experiences, destinations, externalCalendarEvents,
  plannerFlightCost, plannerHotelTierCost, plannerTicketTierCost, plannerDestinationBands,
  sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const ev = await db.select().from(sportingEvents).where(like(sportingEvents.slug, "%us-open%"));
console.log("=== EVENT ROWS ===");
for (const e of ev) {
  console.log(JSON.stringify({
    id: e.id, name: e.name, slug: e.slug, sport: e.sport,
    startDate: e.startDate, endDate: e.endDate,
    destinationId: e.destinationId, packFormat: e.packFormat, packStatus: e.packStatus,
    isHidden: e.isHidden, packCurrency: e.packCurrency, seasonYear: e.seasonYear,
    venueName: e.venueName, venueAddress: e.venueAddress, ticketingUrl: e.ticketingUrl,
    editorialOverview: e.editorialOverview ? e.editorialOverview.slice(0, 200) + "..." : null,
    preTripBriefLines: e.preTripBriefLines,
    homepageSlot: e.homepageSlot, isTestEvent: e.isTestEvent,
  }, null, 2));
}

if (ev.length) {
  const event = ev[0];
  const id = event.id;
  const d = await db.select().from(destinations).where(eq(destinations.id, event.destinationId));
  console.log("=== DESTINATION ===");
  console.log(JSON.stringify(d[0], null, 2));

  const exps = await db.select().from(experiences).where(eq(experiences.sportingEventId, id));
  console.log(`=== EXPERIENCES (via sportingEventId FK): ${exps.length} ===`);
  for (const e of exps) {
    console.log(`${e.slug} | status=${e.status} | hero=${!!e.heroImageUrl} | rating=${e.googleMapsRating}`);
  }

  const joins = await db.select().from(sportingEventExperiences).where(eq(sportingEventExperiences.sportingEventId, id));
  console.log(`=== JOIN TABLE ROWS: ${joins.length} ===`);

  const cal = await db.select().from(externalCalendarEvents);
  const matched = cal.filter(c => c.matchedSportingEventId === id);
  console.log(`=== CALENDAR MATCHED: ${matched.length} ===`);
  for (const c of matched) console.log(JSON.stringify({ id: c.id, name: c.name, startDate: c.startDate, endDate: c.endDate }));

  const flights = await db.select().from(plannerFlightCost).where(eq(plannerFlightCost.destinationId, event.destinationId));
  const hotels = await db.select().from(plannerHotelTierCost).where(eq(plannerHotelTierCost.destinationId, event.destinationId));
  const bands = await db.select().from(plannerDestinationBands).where(eq(plannerDestinationBands.destinationId, event.destinationId));
  const tickets = await db.select().from(plannerTicketTierCost).where(eq(plannerTicketTierCost.sportingEventId, id));
  console.log(`=== PLANNER DATA === flights=${flights.length} hotels=${hotels.length} bands=${bands.length} tickets=${tickets.length}`);
}

process.exit(0);

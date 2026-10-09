import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, sql, like, or } from "drizzle-orm";
import { sportingEvents, experiences, destinations, externalCalendarEvents,
  plannerFlightCost, plannerHotelTierCost, plannerTicketTierCost, plannerDestinationBands } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const ev = await db.select().from(sportingEvents).where(like(sportingEvents.slug, "%border%"));
console.log("=== EVENT ROWS ===");
for (const e of ev) {
  console.log(JSON.stringify({
    id: e.id, name: e.name, slug: e.slug, sport: e.sport,
    startDate: e.startDate, endDate: e.endDate,
    destinationId: e.destinationId, packFormat: e.packFormat, packStatus: e.packStatus,
    isHidden: e.isHidden, packCurrency: e.packCurrency, seasonYear: e.seasonYear,
    venueName: e.venueName, venueAddress: e.venueAddress, ticketingUrl: e.ticketingUrl,
    tourCities: e.tourCities, recurrence: e.recurrence,
    earlyBirdDisplay: e.earlyBirdDisplay, standardDisplay: e.standardDisplay, earlyBirdCutoff: e.earlyBirdCutoff,
    homepageSlot: e.homepageSlot, isTestEvent: e.isTestEvent,
    preTripBriefLines: e.preTripBriefLines,
  }, null, 2));
}

if (ev.length) {
  const id = ev[0].id;
  const d = await db.select().from(destinations).where(eq(destinations.id, ev[0].destinationId));
  console.log("=== DESTINATION ===", JSON.stringify(d[0], null, 2));

  const joined = await db.execute(sql`
    select e.slug, e.status, e.experience_type, (e.hero_image_url is not null) as has_img, see.pack_rank
    from sporting_event_experiences see
    join experiences e on e.id = see.experience_id
    where see.sporting_event_id = ${id}
    order by see.pack_rank nulls last, e.title`);
  console.log("=== JOIN-TABLE EXPERIENCES:", joined.length, "===");
  for (const r of joined) console.log(` ${r.slug} | ${r.status} | rank=${r.pack_rank} | img=${r.has_img}`);

  const fk = await db.select({ slug: experiences.slug, status: experiences.status }).from(experiences).where(eq(experiences.sportingEventId, id));
  console.log("=== DIRECT FK EXPERIENCES:", fk.length, "===");

  const destId = ev[0].destinationId;
  console.log("planner flights:", (await db.select().from(plannerFlightCost).where(eq(plannerFlightCost.destinationId, destId))).length);
  console.log("planner hotels:", (await db.select().from(plannerHotelTierCost).where(eq(plannerHotelTierCost.destinationId, destId))).length);
  console.log("planner tickets:", (await db.select().from(plannerTicketTierCost).where(eq(plannerTicketTierCost.sportingEventId, id))).length);
  console.log("planner bands:", (await db.select().from(plannerDestinationBands).where(eq(plannerDestinationBands.destinationId, destId))).length);
}

const cal = await db.select({ id: externalCalendarEvents.id, name: externalCalendarEvents.name, startDate: externalCalendarEvents.startDate, isProvisional: externalCalendarEvents.isProvisional, matched: externalCalendarEvents.matchedSportingEventId })
  .from(externalCalendarEvents).where(or(like(externalCalendarEvents.name, "%Border%"), like(externalCalendarEvents.name, "%Gavaskar%"), like(externalCalendarEvents.name, "%Australia tour of India%")));
console.log("=== CALENDAR ROWS ===", JSON.stringify(cal, null, 2));

await client.end();

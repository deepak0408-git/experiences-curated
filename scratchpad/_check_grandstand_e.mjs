import { db } from "../lib/db.ts";
import { sql } from "drizzle-orm";

const seats = await db.execute(sql`SELECT seat_name, tier, price_usd, description, view_description, covered, single_day_available, linked_experience_id FROM circuit_seating_profile WHERE sporting_event_id = '020c6a95-1b15-4a63-8a55-853656b1fe8d' ORDER BY seat_name`);
console.log("SEATS:");
console.table(seats.rows);

const exp = await db.execute(sql`SELECT id, title, slug, status, "sportingEventId" FROM experiences WHERE slug = 'chinese-gp-ticket-guide-mud1pntb'`);
console.log("TICKET GUIDE EXP:");
console.log(JSON.stringify(exp.rows, null, 2));
process.exit(0);

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "a5b5a60e-8d24-42f1-a0e7-077e114d53fe"; // Gödöllő — A Quieter Base 10km from the Circuit

const bookingLinks = [
  {
    platform: "Hotel Erzsébet Királyné (Booking.com)",
    url: "https://www.booking.com/hotel/hu/erzsebet-kiralyne.hu.html?aid=319854&label=hotel-75477-hu-v7S%2A7KO_XewLwSnZZ6RTWQS295053324890%3Apl%3Ata%3Ap1%3Ap2%3Aac%3Aap%3Aneg%3Afi%3Atikwd-18099001851%3Alp9062215%3Ali%3Adec%3Adm%3Appccp%3DUmFuZG9tSVYkc2RlIyh9YUNMGHk8cZwoB0esNmU1BR4&sid=2f7dda1a3ed8c96947c6a99064bd7a3c&checkin=2026-07-23&checkout=2026-07-26&dest_id=-854459&dest_type=city&dist=0&group_adults=2&group_children=0&hapos=1&hpos=1&no_rooms=1&req_adults=2&req_children=0&room1=A%2CA&sb_price_type=total&soh=1&sr_order=popularity&srepoch=1783839776&srpvid=ff04318d5446072d&type=total&ucfs=1#no_availability_msg",
  },
];

const [result] = await db
  .update(experiences)
  .set({ bookingLinks })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Booking.com affiliate link added: ${result.title}`);

await client.end();

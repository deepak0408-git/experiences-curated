import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const ID = "ab56c73e-cbd6-47fb-802e-f92e6b150e90"; // where-to-stay-chennai-muecfeei

const [row] = await db.update(experiences)
  .set({
    practicalInfo: {
      hours: "Standard check-in 2pm, check-out 12pm — confirm with each property, as times can vary.",
      bookingMethod: "Book directly or through a major aggregator (Booking.com, MakeMyTrip) — expect rates to rise as the Test match date approaches, particularly in Mylapore and Alwarpet given their proximity to the ground.",
    },
  })
  .where(eq(experiences.id, ID))
  .returning({ slug: experiences.slug, practicalInfo: experiences.practicalInfo, status: experiences.status });

console.log(row);
process.exit(0);

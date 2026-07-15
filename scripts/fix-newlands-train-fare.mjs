import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "getting-to-newlands-mrlzm9wi";

const bookingMethod = "No ticket needed for the rideshare option — just set your pickup point to Newlands Swimming Pool, not the ground itself. The Southern Line single fare from Cape Town Station to Newlands is in the R7.50-R12 range depending on ticket class (Metro/economy vs. MetroPlus) — confirm the exact fare at the ticket window or via the PRASA fare calculator, since pricing has moved with recent hikes. If driving, reserved parking near Groote Schuur High School requires an advance ticket; unreserved lots at Groote Schuur Primary and Sans Souci Girls High School take cash on the day, roughly R50-R70.";

try {
  const [result] = await db.update(experiences)
    .set({
      practicalInfo: {
        hours: "Gates typically open 2-3 hours before play, varying by match day — confirm the exact time against the published schedule for each day of the Test",
        costRange: "Southern Line single fare: approx. R7.50-R12 depending on ticket class. Parking: reserved varies by lot (advance ticket), unreserved cash R50-R70 per vehicle",
        bookingMethod,
        website: "https://newlandscricket.com",
        reservationsRequired: false,
      },
    })
    .where(eq(experiences.slug, SLUG))
    .returning({ id: experiences.id, title: experiences.title });

  console.log("✓ Updated train fare info:", result.title, "|", result.id);
} catch (e) {
  console.error("✗ FAILED:", e.message);
} finally {
  await client.end();
}

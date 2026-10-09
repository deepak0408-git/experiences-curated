import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Museums — add real addresses for all 3 venues (previously only Queens Museum)
const [museums] = await db.update(experiences)
  .set({
    address: "Queens Museum: Flushing Meadows Corona Park, Queens, NY 11368; The Met: 1000 Fifth Avenue, New York, NY 10028; MoMA: 11 West 53rd Street, New York, NY 10019",
    bookingLinks: [
      {
        platform: "getyourguide",
        label: "The Met — Guided Tour with Skip-the-Line Entry",
        url: "https://www.getyourguide.com/new-york-city-l59/the-met-museum-guided-tour-with-skip-the-line-entry-t793895/?partner_id=HCNITTS&utm_medium=online_publisher",
      },
    ],
    lastVerifiedDate: "2026-10-05",
  })
  .where(eq(experiences.slug, "nyc-museums-day-trip-muverkw6"))
  .returning({ slug: experiences.slug, address: experiences.address });
console.log("✓ Museums updated:", museums);

// Atlantic City — add GYG affiliate link for Absecon Lighthouse
const [ac] = await db.update(experiences)
  .set({
    bookingLinks: [
      {
        platform: "getyourguide",
        label: "Absecon Lighthouse — Admission Ticket",
        url: "https://www.getyourguide.com/atlantic-city-l32632/atlantic-city-absecon-lighthouse-admission-ticket-t415979/?partner_id=HCNITTS&utm_medium=online_publisher",
      },
    ],
    lastVerifiedDate: "2026-10-05",
  })
  .where(eq(experiences.slug, "atlantic-city-day-trip-muv8opr2"))
  .returning({ slug: experiences.slug });
console.log("✓ Atlantic City updated:", ac);

await client.end();

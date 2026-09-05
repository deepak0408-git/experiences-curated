import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Real GetYourGuide affiliate URLs, supplied directly by the founder 5 Sep
// 2026 — never self-constructed, per standing rule.
const UPDATES = [
  {
    slug: "us-gp-hill-country-fredericksburg-mtns599e",
    bookingLinks: [
      {
        platform: "GetYourGuide",
        label: "From Austin: Half-Day Hill Country Wine Shuttle",
        url: "https://www.getyourguide.com/austin-l32477/from-austin-half-day-hill-country-wine-shuttle-t421399/?partner_id=HCNITTS&utm_medium=online_publisher",
      },
    ],
  },
  {
    slug: "us-gp-lady-bird-lake-mtns0w9a",
    bookingLinks: [
      {
        platform: "GetYourGuide",
        label: "Austin: Paddleboard Rental on Lady Bird Lake",
        url: "https://www.getyourguide.com/austin-l32477/austin-paddleboard-rental-on-lady-bird-lake-t1005286/?partner_id=HCNITTS&utm_medium=online_publisher",
      },
    ],
  },
  {
    slug: "us-gp-san-antonio-daytrip-mtns7igg",
    bookingLinks: [
      {
        platform: "GetYourGuide",
        label: "The Alamo: Exhibit Entry Ticket",
        url: "https://www.getyourguide.com/san-antonio-l892/the-alamo-exhibit-entry-ticket-t469524/?partner_id=HCNITTS&utm_medium=online_publisher",
      },
    ],
  },
];

for (const u of UPDATES) {
  const [row] = await db
    .select({ id: experiences.id })
    .from(experiences)
    .where(eq(experiences.slug, u.slug));

  if (!row) {
    console.log("✗ Not found:", u.slug);
    continue;
  }

  await db.update(experiences).set({ bookingLinks: u.bookingLinks }).where(eq(experiences.id, row.id));
  console.log("✓ Updated bookingLinks for", u.slug, "—", u.bookingLinks[0].label);
}

console.log("\n✓ Done — re-publish each row in /curator/review to clear the 1-hour cache.");
await client.end();

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq, like } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Placeholder affiliate links — replace with real tracked URLs before launch
const BOOKING_LINKS = [
  {
    titleMatch: "Centre Court",
    links: [{ platform: "Wimbledon Official", url: "https://www.wimbledon.com/en_GB/tickets/index.html" }],
  },
  {
    titleMatch: "No. 1 Court",
    links: [{ platform: "Wimbledon Official", url: "https://www.wimbledon.com/en_GB/tickets/index.html" }],
  },
  {
    titleMatch: "Traveling to the All England",
    links: [{ platform: "TfL Journey Planner", url: "https://tfl.gov.uk/plan-a-journey/" }],
  },
  {
    titleMatch: "Rose & Crown",
    links: [
      { platform: "Booking.com", url: "https://www.booking.com/hotel/gb/the-rose-and-crown-wimbledon.html" },
    ],
  },
  {
    titleMatch: "Cannizaro",
    links: [
      { platform: "Booking.com", url: "https://www.booking.com/hotel/gb/hotel-du-vin-wimbledon.html" },
    ],
  },
  {
    titleMatch: "Lawn Tennis Museum",
    links: [
      { platform: "Wimbledon Official", url: "https://www.wimbledon.com/en_GB/museum_and_tours/index.html" },
    ],
  },
  {
    titleMatch: "Eating at Wimbledon",
    links: [
      { platform: "Wimbledon Official", url: "https://www.wimbledon.com/en_GB/visiting/food_and_drink.html" },
    ],
  },
  {
    titleMatch: "Brixton Village",
    links: [
      { platform: "Official site", url: "https://brixtonmarket.net/" },
    ],
  },
];

for (const { titleMatch, links } of BOOKING_LINKS) {
  const result = await db
    .update(experiences)
    .set({ bookingLinks: links })
    .where(like(experiences.title, `%${titleMatch}%`));
  console.log(`Set booking links for "${titleMatch}"`);
}

console.log("Done seeding booking links");
await client.end();

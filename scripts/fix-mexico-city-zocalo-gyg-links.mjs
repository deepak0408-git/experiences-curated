import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "38723247-3610-4906-baa6-35d5839429fb";

const bookingLinks = [
  {
    platform: "GetYourGuide",
    label: "Metropolitan Cathedral",
    url: "https://www.getyourguide.com/catedral-metropolitana-de-mexico-l17000/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
  {
    platform: "GetYourGuide",
    label: "Templo Mayor Museum",
    url: "https://www.getyourguide.com/templo-mayor-museum-mexico-city-l4157/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
];

const [result] = await db
  .update(experiences)
  .set({ bookingLinks, lastVerifiedDate: "2026-09-07" })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Updated: ${result.title}`);
await client.end();

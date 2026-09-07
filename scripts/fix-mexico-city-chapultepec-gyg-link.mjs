import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "f4a8b4a0-a573-495f-9ab7-947789e136a8";

const bookingLinks = [
  {
    platform: "GetYourGuide",
    label: "Chapultepec Castle & Anthropology Museum",
    url: "https://www.getyourguide.com/mexico-city-l194/mexico-city-chapultepec-castle-anthropology-museum-t58106/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
];

const [result] = await db
  .update(experiences)
  .set({ bookingLinks, lastVerifiedDate: "2026-09-07" })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Updated: ${result.title}`);
await client.end();

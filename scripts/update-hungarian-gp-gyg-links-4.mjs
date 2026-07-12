import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "6a46f802-68a0-4ff3-8229-cbb279822d87"; // A Day in Budapest — Castle Hill to Parliament

const bookingLinks = [
  {
    platform: "Budapest Parliament Tour with Audio Guide (+ optional boat tour)",
    url: "https://www.getyourguide.com/budapest-l29/budapest-parlament-tour-with-audio-guide-opt-boat-tour-t731430/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
  {
    platform: "Buda Castle Walking Tour with a Historian",
    url: "https://www.getyourguide.com/budapest-l29/budapest-walking-tour-of-buda-castle-with-a-historian-t160547/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
  {
    platform: "Grand City Tour with Parliament Visit",
    url: "https://www.getyourguide.com/budapest-l29/grand-city-tour-with-parliament-visit-t737/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
];

try {
  const [result] = await db
    .update(experiences)
    .set({ bookingLinks })
    .where(eq(experiences.id, EXPERIENCE_ID))
    .returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

  console.log("✓ GYG affiliate links updated (3 total on this experience)");
  console.log("  Title:", result.title);
  console.log("  ID:   ", result.id);
  console.log("  Slug: ", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

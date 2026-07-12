import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "07205ca7-5528-470c-b9c3-05af68eab44b"; // Szimpla Kert

const bookingLinks = [
  {
    platform: "Budapest Past & Present: Jewish District Walk",
    url: "https://www.getyourguide.com/budapest-l29/budapest-past-present-jewish-district-walk-t1198931/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
];

try {
  const [result] = await db
    .update(experiences)
    .set({ bookingLinks })
    .where(eq(experiences.id, EXPERIENCE_ID))
    .returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

  console.log("✓ GYG affiliate link added");
  console.log("  Title:", result.title);
  console.log("  ID:   ", result.id);
  console.log("  Slug: ", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const newWhatToAvoid = "Don't bring a camera, phone, or any device out during the Penguin Parade itself — Phillip Island Nature Parks bans all photography in the viewing areas, not just flash, because even a phone screen's light can disorient the penguins as they cross the beach to their burrows. It's strictly enforced; if you want a photo, buy one from the visitor centre afterwards rather than risk being asked to put your phone away mid-parade. Don't attempt Phillip Island without a car or a booked tour with return transport — the public coach option leaves you stranded on the island after the parade ends at night.";

try {
  const [result] = await db.update(experiences)
    .set({ whatToAvoid: newWhatToAvoid })
    .where(eq(experiences.title, "Wildlife Down Under — Featherdale & Phillip Island"))
    .returning({ id: experiences.id, title: experiences.title, whatToAvoid: experiences.whatToAvoid });

  console.log("Updated:", result.title);
  console.log("\nWhat to avoid:\n", result.whatToAvoid);
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await client.end();
}

// Recategorize all 4 published "activity"-typed Melbourne experiences to
// fan_experience — founder-requested 1 Oct 2026, same pattern already
// applied to China Visas (Shanghai) and Twilight Race Packing (Abu Dhabi):
// packing/weather and first-timer etiquette guides are fan_experience, not
// activity.
import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { inArray } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slugs = [
  "first-timers-guide-etiquette-crowd-culture-fdp4b7",
  "melbourne-january-heat-what-to-pack-df5qwz",
  "melbourne-april-weather-what-to-pack-mu9c9btl",
  "first-timers-guide-albert-park-mu9cdxo6",
];

await db.update(experiences)
  .set({ experienceType: "fan_experience", updatedAt: new Date() })
  .where(inArray(experiences.slug, slugs));

console.log(`✓ ${slugs.length} Melbourne experiences updated to fan_experience`);
await client.end();

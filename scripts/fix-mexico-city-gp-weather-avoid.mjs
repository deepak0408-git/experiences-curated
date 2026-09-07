import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "a20d23d4-c007-4576-bf87-3914993167cb";

const whatToAvoid = `Don't drink heavily on your first night or two, especially if you're already feeling the altitude — alcohol interferes with your body's oxygen flow at this elevation, and hangover symptoms overlap so closely with altitude sickness (headache, nausea, fatigue) that it becomes genuinely hard to tell which one you're actually dealing with the next morning. Ease into race-weekend celebrations rather than starting hard on arrival night. And don't skip lip balm and hand lotion assuming a "warm" city won't dry you out — Mexico City's late-October air is genuinely dry at this altitude, and chapped lips and cracked skin are one of the most common, easily-avoided complaints from first-time visitors who packed for temperature but not for dryness.`;

const editorialNote = "Temperature and rainfall figures sourced from Weather-and-Climate.com's October/November Mexico City averages, cross-checked against AnEarthlyParadise.com's October weather guide, Sep 2026. Altitude/UV and adjustment advice sourced from Volaris Blog's Mexico City altitude guide. AccuWeather 10-day forecast URL confirmed via direct search results (location code 242560, consistent across multiple result pages) rather than guessed, per hub-and-spoke skill's standing rule on opaque location-ID URLs. What to Avoid rebuilt 6 Sep 2026 after both original avoids were found to restate bodyContent nearly verbatim — replaced with 2 genuinely new avoids: alcohol worsening altitude adjustment and masking altitude-sickness symptoms (sourced from LetsTravelToMexico.com's altitude sickness guide, 6 Sep 2026), and dry-climate skin/lip care (sourced from MexicoNewsDaily.com's dry-season guide, 6 Sep 2026) — neither previously mentioned in this experience.";

const [result] = await db
  .update(experiences)
  .set({ whatToAvoid, editorialNote, lastVerifiedDate: "2026-09-06" })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Updated: ${result.title}`);
await client.end();

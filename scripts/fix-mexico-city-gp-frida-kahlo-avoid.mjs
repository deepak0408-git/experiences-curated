import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "627fa5ef-4e9d-4943-a729-c75a9d3f6dbd";

const whatToAvoid = `Don't assume your regular admission ticket lets you photograph the interior — the museum sells photography as a separate add-on with its own small fee, purchasable online alongside your entry ticket or at the door, and taking photos inside without it (beyond the more relaxed courtyard/garden areas) risks a staff member asking you to stop. And don't take one of the pink-and-white taxis idling right outside the entrance — visitors have reported near-scam pricing from drivers specifically stationed there for tourists leaving the museum; walk a block or two and hail one independently, or use a rideshare app instead.`;

const editorialNote = "Booking mechanics (2-4 week standard window, 2-3 months for peak season, 15-minute entry tolerance, WhatsApp/email confirmation timing) sourced from StoriesBySoumya.com and TwoTravel's Frida Kahlo Museum ticket guides, and the official boletos.museofridakahlo.org.mx site description, Sep 2026. Google rating via Places API lookup same session: 4.5/45,085 reviews. What to Avoid rebuilt 6 Sep 2026 after both original avoids were found to restate bodyContent verbatim — replaced with 2 genuinely new avoids: the separate paid photography add-on (sourced from TwoTravel's ticket guide, 6 Sep 2026, not otherwise mentioned in this experience) and the pink-and-white taxi overcharging risk right outside the entrance (sourced from real Tripadvisor visitor reports, 6 Sep 2026).";

const [result] = await db
  .update(experiences)
  .set({ whatToAvoid, editorialNote, lastVerifiedDate: "2026-09-06" })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Updated: ${result.title}`);
await client.end();

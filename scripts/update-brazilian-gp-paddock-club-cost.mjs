import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, sql } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "ecf7a601-4d97-4de4-8f67-db068142fbb6"; // Paddock Club & Champions Club — Hospitality Tiers

const costRange = "F1® Experiences Live | Grandstand N, 3-day package: US$1,956 per person (confirmed F1 Experiences pricing). Paddock Club/Champions Club tiers themselves run from the low thousands (Champions Club) into the $6,000-8,000+ range per person on a 3-day basis — exact 2026 Brazil pricing for those two tiers was not published on official pages at time of research, both shown sold out.";

const [row] = await db
  .update(experiences)
  .set({
    practicalInfo: sql`jsonb_set(${experiences.practicalInfo}, '{costRange}', ${JSON.stringify(costRange)}::jsonb)`,
  })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ title: experiences.title, practicalInfo: experiences.practicalInfo });

console.log("✓", row.title, "→", row.practicalInfo.costRange);
await client.end();

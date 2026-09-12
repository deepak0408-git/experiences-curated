import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "c737f67b-c034-46bb-a418-9cd595a932cf"; // Hotel Emiliano — Jardins' Boutique Luxury Pick

const whyItsSpecial = `A hotel doesn't need to be the biggest or the flashiest to be the right one for a race weekend — it needs to get several things right at once: a location that doesn't add friction to your days, a level of service that holds up when the city is unusually busy with visiting fans and teams, and rooms that let you actually rest before an early gate time. Emiliano's small scale is what makes all three work together; a 57-room hotel can staff for genuine attentiveness in a way a 300-room tower can't, and its Jardins address puts you closer to São Paulo's best restaurants than to anything resembling a tourist strip.`;

const [row] = await db
  .update(experiences)
  .set({ whyItsSpecial })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ title: experiences.title, whyItsSpecial: experiences.whyItsSpecial });

console.log("✓", row.title, "→", row.whyItsSpecial);
await client.end();

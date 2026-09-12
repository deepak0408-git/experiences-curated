import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [row] = await db
  .update(experiences)
  .set({
    heroImageUrl: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/experiences/hero/mexico-city-gp-paddock-club.jpg",
    heroImageAlt: "Pit lane at a Formula 1 circuit",
    heroImageCredit: "Jason Puddephatt, CC BY 4.0",
  })
  .where(eq(experiences.id, "ecf7a601-4d97-4de4-8f67-db068142fbb6"))
  .returning({ title: experiences.title, heroImageUrl: experiences.heroImageUrl });

console.log("✓", row.title, "→", row.heroImageUrl);
await client.end();

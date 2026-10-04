import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-weather-mud24hlf";
const newSubtitle = "Mild spring, frequent light rain — what to actually pack for Shanghai in April, not just averages.";

console.log("Length:", newSubtitle.length);

await db.update(experiences)
  .set({ subtitle: newSubtitle })
  .where(eq(experiences.slug, SLUG));

console.log("Updated subtitle:", newSubtitle);

await client.end();

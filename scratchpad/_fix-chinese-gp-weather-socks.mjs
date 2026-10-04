import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-weather-mud24hlf";

const OLD = "Closed, comfortable walking shoes matter more than anything else — you're on your feet across a full session day, possibly on wet concrete.";
const NEW = "Closed, comfortable walking shoes matter more than anything else — you're on your feet across a full session day, possibly on wet concrete. Pack a few pairs of socks in different thicknesses too, so you can adjust for a cooler, damp morning versus a warmer, humid afternoon without changing shoes.";

const [row] = await db.select({ bodyContent: experiences.bodyContent })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

if (!row.bodyContent.includes(OLD)) {
  console.error("Target sentence not found — aborting");
  process.exit(1);
}

const newBody = row.bodyContent.replace(OLD, NEW);

await db.update(experiences)
  .set({ bodyContent: newBody })
  .where(eq(experiences.slug, SLUG));

console.log("Updated body with socks detail.");

await client.end();

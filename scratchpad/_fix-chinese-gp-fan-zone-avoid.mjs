import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-fan-zone-mud1r9kw";

const newWhatToAvoid = "Don't skip the Fan Zone assuming it's a minor add-on — Fountain Plaza is a real, built-out part of the weekend with simulators, merch, food, and a substantial music lineup, and skipping it on assumption means missing driver appearances that are a standing part of the programming. Don't treat the Music Carnival as background noise — with a lineup that's run close to 40 acts across multiple stages in recent years, showing up without checking the schedule means missing sets you'd actually have planned around if you'd known they were on.";

await db.update(experiences)
  .set({ whatToAvoid: newWhatToAvoid })
  .where(eq(experiences.slug, SLUG));

console.log("Updated whatToAvoid:\n", newWhatToAvoid);

await client.end();

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-upscale-dining-mud20jh1";

const newWhatToAvoid = "Don't order a la carte and skip the signature dishes by accident — the menu runs to roughly 250 items, so without steering toward the Long Short Rib Teriyaki, the Jumbo Shrimp in Citrus Jar, or the Lemon-and-Lemon Tart, it's easy to end up with a competent but forgettable meal instead of the dishes this kitchen is actually known for. Don't assume walk-in availability because you're visiting during a major event — this restaurant's demand comes from its own standing reputation in Shanghai's dining scene, not from Grand Prix tourism specifically, so book ahead regardless of race weekend timing.";

await db.update(experiences)
  .set({ whatToAvoid: newWhatToAvoid })
  .where(eq(experiences.slug, SLUG));

console.log("Updated whatToAvoid:\n", newWhatToAvoid);

await client.end();

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [exp] = await db.select({ id: experiences.id, title: experiences.title })
  .from(experiences)
  .where(eq(experiences.slug, "marche-president-wilson"));

if (!exp) {
  console.log("Not found — already deleted?");
} else {
  await db.delete(sportingEventExperiences).where(eq(sportingEventExperiences.experienceId, exp.id));
  await db.delete(experiences).where(eq(experiences.id, exp.id));
  console.log("✓ Deleted:", exp.title, exp.id);
}
await client.end();

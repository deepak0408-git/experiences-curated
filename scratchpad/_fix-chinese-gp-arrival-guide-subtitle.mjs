import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-arrival-guide-mud2316w";
const newSubtitle = "Passport registration is the real requirement here — plus why to arrive early at a 200,000-capacity circuit.";

console.log("Length:", newSubtitle.length);

await db.update(experiences)
  .set({ subtitle: newSubtitle })
  .where(eq(experiences.slug, SLUG));

console.log("Updated subtitle:", newSubtitle);

await client.end();

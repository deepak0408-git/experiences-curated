import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [result] = await db.update(experiences)
  .set({ title: "Where to Stay in Sandton, Johannesburg" })
  .where(eq(experiences.title, "Where to Stay in Sandton"))
  .returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

console.log("✓ Renamed:", result?.title, "|", result?.slug);
await client.end();

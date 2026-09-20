import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [row] = await db.select({ id: experiences.id, title: experiences.title, practicalInfo: experiences.practicalInfo, gettingThere: experiences.gettingThere })
  .from(experiences).where(eq(experiences.slug, "italian-gp-first-timer-guide-mu7ckouk"));
console.log(JSON.stringify(row, null, 2));
await client.end();

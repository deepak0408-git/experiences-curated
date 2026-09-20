import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [row] = await db.select({ id: experiences.id, title: experiences.title, slug: experiences.slug, heroImageUrl: experiences.heroImageUrl, heroImageCredit: experiences.heroImageCredit })
  .from(experiences).where(eq(experiences.slug, "italian-gp-grandstand-1-centrale-mu7cn5ry"));
console.log(row);
await client.end();

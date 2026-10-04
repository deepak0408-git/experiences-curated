import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [row] = await db.select().from(experiences).where(eq(experiences.slug, "chinese-gp-anting-old-street-mud1yyr2"));
console.log(JSON.stringify(row, null, 2));
await client.end();

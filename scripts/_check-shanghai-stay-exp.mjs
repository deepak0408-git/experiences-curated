import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);
const exp = await db.select().from(experiences).where(eq(experiences.id, "da680f94-8295-488f-97b4-173d1f266ed2"));
console.log(JSON.stringify(exp[0], null, 2));
await client.end();

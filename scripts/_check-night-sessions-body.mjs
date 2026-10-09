import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [r] = await db.select().from(experiences).where(eq(experiences.slug, "us-open-night-sessions-mq4wj388"));
console.log(r.bodyContent);
process.exit(0);

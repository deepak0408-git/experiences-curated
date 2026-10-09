import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [r] = await db.select().from(experiences).where(eq(experiences.slug, "nyc-museums-day-trip-muverkw6"));
console.log(JSON.stringify({ title: r.title, subtitle: r.subtitle, status: r.status, heroImageUrl: r.heroImageUrl }, null, 2));
process.exit(0);

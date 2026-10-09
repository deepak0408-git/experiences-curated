import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [r] = await db.select().from(experiences).where(eq(experiences.slug, "preparing-for-us-open-mq4wj388"));
console.log(JSON.stringify({ id: r.id, slug: r.slug, title: r.title, heroImageUrl: r.heroImageUrl, heroImageCredit: r.heroImageCredit, status: r.status }, null, 2));
process.exit(0);

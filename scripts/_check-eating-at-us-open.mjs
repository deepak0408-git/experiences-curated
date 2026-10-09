import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [r] = await db.select({ slug: experiences.slug, title: experiences.title, heroImageUrl: experiences.heroImageUrl, heroImageAlt: experiences.heroImageAlt, heroImageCredit: experiences.heroImageCredit }).from(experiences).where(eq(experiences.slug, "eating-at-the-us-open-mq4wj388"));
console.log(JSON.stringify(r, null, 2));
process.exit(0);

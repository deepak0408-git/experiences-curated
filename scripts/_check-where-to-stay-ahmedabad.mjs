import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [row] = await db.select({
  title: experiences.title,
  subtitle: experiences.subtitle,
  bodyContent: experiences.bodyContent,
  address: experiences.address,
  practicalInfo: experiences.practicalInfo,
  gettingThere: experiences.gettingThere,
  status: experiences.status,
}).from(experiences).where(eq(experiences.slug, "where-to-stay-ahmedabad-muecpb9t"));

console.log(JSON.stringify(row, null, 2));
process.exit(0);

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "ganguly-waugh-captaincy-rivalry";

const [result] = await db
  .update(blogArticles)
  .set({ status: "archived" })
  .where(eq(blogArticles.slug, SLUG))
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("Archived:", result?.title, "|", result?.id, "| status:", result?.status);

await client.end();

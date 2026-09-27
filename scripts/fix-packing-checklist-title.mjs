import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "ultimate-sports-travel-packing-checklist-f1-tennis-golf-cricket";

const [row] = await db
  .update(blogArticles)
  .set({ title: "The Ultimate Sports Travel Packing Checklist" })
  .where(eq(blogArticles.slug, slug))
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Title updated");
console.log("  Title: ", row?.title);
console.log("  Slug:  ", row?.slug, "|", row?.status);

await client.end();

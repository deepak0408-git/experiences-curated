import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const fixes = [
  { slug: "arthur-ashe-man-behind-tennis-biggest-stadium", publishedAt: new Date("2026-07-15T10:00:00Z") },
  { slug: "voices-you-hear-at-us-open-arent-real", publishedAt: new Date("2026-07-19T10:00:00Z") },
  { slug: "5-greatest-matches-us-open-history", publishedAt: new Date("2026-07-22T10:00:00Z") },
  { slug: "why-us-open-night-sessions-are-tennis-best-theater", publishedAt: new Date("2026-07-26T10:00:00Z") },
  { slug: "5-rookie-mistakes-first-time-us-open-visitors-make", publishedAt: new Date("2026-07-29T10:00:00Z") },
  { slug: "gender-equality-at-the-us-open", publishedAt: new Date("2026-08-01T10:00:00Z") },
];

for (const f of fixes) {
  const [result] = await db.update(blogArticles)
    .set({ publishedAt: f.publishedAt })
    .where(eq(blogArticles.slug, f.slug))
    .returning({ slug: blogArticles.slug, publishedAt: blogArticles.publishedAt });
  console.log("✓", result.slug, "→", result.publishedAt.toISOString());
}

await client.end();

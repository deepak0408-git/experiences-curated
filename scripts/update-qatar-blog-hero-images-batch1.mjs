import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const updates = [
  {
    slug: "lusail-built-for-motogp-not-f1-history",
    heroImageUrl: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/experiences/hero/qatar-gp-main-grandstand.png",
    heroImageAlt: "Grandstand at Lusail International Circuit, Qatar",
    heroImageCredit: null,
  },
  {
    slug: "qatar-abu-dhabi-bahrain-gulf-f1-rivalry",
    heroImageUrl: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/experiences/hero/qatar-gp-inside-lusail-circuit.jpg",
    heroImageAlt: "Spectators at Lusail International Circuit under floodlights, Qatar",
    heroImageCredit: "Trinidade / CC BY 3.0",
  },
];

for (const u of updates) {
  const [row] = await db
    .update(blogArticles)
    .set({ heroImageUrl: u.heroImageUrl, heroImageAlt: u.heroImageAlt, heroImageCredit: u.heroImageCredit, updatedAt: new Date() })
    .where(eq(blogArticles.slug, u.slug))
    .returning({ slug: blogArticles.slug, title: blogArticles.title, heroImageUrl: blogArticles.heroImageUrl, heroImageCredit: blogArticles.heroImageCredit });
  console.log("✓ Updated:", row.title);
  console.log("  Hero:  ", row.heroImageUrl);
  console.log("  Credit:", row.heroImageCredit);
}

await client.end();

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const introParagraph = `Australia's wildlife isn't just different from what you'll see elsewhere — most of it exists nowhere else at all. Over 80% of the country's native mammals are found only here, cut off from the rest of the world for millions of years and left to evolve on their own path. That's how you end up with marsupials as the norm rather than the exception, and with the platypus and echidna: the only two mammals on Earth that lay eggs. It's a real reason to build a proper visit around this, not just a stopover between cricket grounds.`;

try {
  const [row] = await db.select({ id: experiences.id, bodyContent: experiences.bodyContent })
    .from(experiences)
    .where(eq(experiences.title, "Wildlife Down Under — Featherdale & Phillip Island"));

  if (!row) throw new Error("Experience not found");

  const bodyContent = `${introParagraph}\n\n${row.bodyContent}`;

  const [result] = await db.update(experiences)
    .set({ bodyContent })
    .where(eq(experiences.id, row.id))
    .returning({ id: experiences.id, title: experiences.title, bodyContent: experiences.bodyContent });

  console.log("Updated:", result.title);
  console.log("\n--- New opening ---\n");
  console.log(result.bodyContent.split("\n\n").slice(0, 2).join("\n\n"));
  console.log(`\n--- Word count: ${result.bodyContent.split(/\s+/).length} ---`);
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await client.end();
}

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const oldIntro = `That's how kangaroos and koalas ended up as the norm rather than the exception, alongside the platypus and echidna — the only two mammals on Earth that lay eggs.`;

const newIntro = `That's how kangaroos, wallabies and koalas ended up as the norm rather than the exception, alongside the platypus and echidna — the only two mammals on Earth that lay eggs.`;

try {
  const [row] = await db.select({ id: experiences.id, bodyContent: experiences.bodyContent })
    .from(experiences)
    .where(eq(experiences.title, "Wildlife Down Under — Featherdale & Phillip Island"));

  if (!row) throw new Error("Experience not found");

  const bodyContent = row.bodyContent.replace(oldIntro, newIntro);
  if (bodyContent === row.bodyContent) throw new Error("Replacement did not match");

  const [result] = await db.update(experiences)
    .set({ bodyContent })
    .where(eq(experiences.id, row.id))
    .returning({ id: experiences.id, title: experiences.title, bodyContent: experiences.bodyContent });

  console.log("Updated:", result.title);
  console.log("\n--- New opening ---\n");
  console.log(result.bodyContent.split("\n\n")[0]);
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await client.end();
}

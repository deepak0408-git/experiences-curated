// Rename "Lord's — 3rd ODI" to "Lord's Cricket Ground" — founder-requested
// 1 Oct 2026 while reviewing the London destination page's new Sports
// Venues section. Title only; subtitle and body copy unchanged.
import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

await db.update(experiences)
  .set({ title: "Lord's Cricket Ground", updatedAt: new Date() })
  .where(eq(experiences.slug, "lord-s-mox8dq82"));

console.log("✓ lord-s-mox8dq82 title updated to \"Lord's Cricket Ground\"");
await client.end();

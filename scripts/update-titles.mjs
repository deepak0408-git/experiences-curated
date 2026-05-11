import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const renames = [
  { from: "Centre Court",        to: "Centre Court at Wimbledon" },
  { from: "The Practice Courts", to: "The Practice Courts at Wimbledon" },
  { from: "The Outer Courts",    to: "The Outer Courts at Wimbledon" },
  { from: "The Hill",            to: "The Hill at Wimbledon" },
  { from: "The Rose & Crown",    to: "The Rose & Crown Hotel" },
];

for (const { from, to } of renames) {
  const result = await db
    .update(experiences)
    .set({ title: to })
    .where(eq(experiences.title, from))
    .returning({ id: experiences.id, title: experiences.title });

  if (result.length > 0) {
    console.log(`✓ "${from}" → "${to}" (ID: ${result[0].id})`);
  } else {
    console.log(`✗ Not found: "${from}"`);
  }
}

await client.end();

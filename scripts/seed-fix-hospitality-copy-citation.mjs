import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [row] = await db
  .select({ bodyContent: experiences.bodyContent })
  .from(experiences)
  .where(eq(experiences.slug, "roland-garros-official-hospitality"));

const fixedBody = row.bodyContent.replace(
  "our own seeded event data puts the",
  "we put the"
);

await db.update(experiences)
  .set({ bodyContent: fixedBody })
  .where(eq(experiences.slug, "roland-garros-official-hospitality"));

console.log("✓ roland-garros-official-hospitality — internal citation removed from body copy");

await client.end();

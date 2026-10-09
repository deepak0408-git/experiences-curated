import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "marina-beach-kapaleeshwarar-mueci07c";

const OLD = `It's also close to Chepauk, which makes it an easy stop before or after a session rather than a dedicated excursion. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=11776789967826315927)`;

const NEW = `It's also close to Chepauk, which makes it an easy stop before or after a session rather than a dedicated excursion. [See live rating and reviews on Google Maps](https://maps.app.goo.gl/dxQmQC2V3MSG4VfG7)`;

const [row] = await db.select({ bodyContent: experiences.bodyContent }).from(experiences).where(eq(experiences.slug, SLUG));

if (!row.bodyContent.includes(OLD)) {
  console.error("OLD text not found verbatim — aborting without writing.");
  process.exit(1);
}

const updatedBody = row.bodyContent.replace(OLD, NEW);

const [result] = await db.update(experiences)
  .set({ bodyContent: updatedBody })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
process.exit(0);

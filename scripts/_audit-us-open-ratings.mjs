import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { like } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const rows = await db.select({
  slug: experiences.slug, title: experiences.title,
  googleMapsRating: experiences.googleMapsRating,
  googleMapsReviewCount: experiences.googleMapsReviewCount,
  googleMapsUrl: experiences.googleMapsUrl,
  address: experiences.address,
}).from(experiences).where(like(experiences.slug, "%mq4wj388%"));

const rows2 = await db.select({
  slug: experiences.slug, title: experiences.title,
  googleMapsRating: experiences.googleMapsRating,
  googleMapsReviewCount: experiences.googleMapsReviewCount,
  googleMapsUrl: experiences.googleMapsUrl,
  address: experiences.address,
}).from(experiences).where(like(experiences.slug, "muv8%"));

const rows3 = await db.select({
  slug: experiences.slug, title: experiences.title,
  googleMapsRating: experiences.googleMapsRating,
  googleMapsReviewCount: experiences.googleMapsReviewCount,
  googleMapsUrl: experiences.googleMapsUrl,
  address: experiences.address,
}).from(experiences).where(like(experiences.slug, "mq4wja5b"));

const rows4 = await db.select({
  slug: experiences.slug, title: experiences.title,
  googleMapsRating: experiences.googleMapsRating,
  googleMapsReviewCount: experiences.googleMapsReviewCount,
  googleMapsUrl: experiences.googleMapsUrl,
  address: experiences.address,
}).from(experiences).where(like(experiences.slug, "%muv8%"));

const all = [...rows, ...rows2, ...rows3, ...rows4];
const seen = new Set();
for (const r of all) {
  if (seen.has(r.slug)) continue;
  seen.add(r.slug);
  console.log(JSON.stringify(r));
}
process.exit(0);

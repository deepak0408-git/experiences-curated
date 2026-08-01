import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, destinations } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [exp] = await db.select({
  id: experiences.id,
  title: experiences.title,
  destinationId: experiences.destinationId,
}).from(experiences).where(eq(experiences.slug, "getting-to-newlands-mrlzm9wi"));

console.log("Experience:", exp);

const [dest] = await db.select().from(destinations).where(eq(destinations.id, exp.destinationId));
console.log("\nCurrent destination:", dest.name, "|", dest.id);

// Find the correct Cape Town destination
const capeTown = await db.select().from(destinations).where(eq(destinations.name, "Cape Town"));
console.log("\nCape Town destination(s) found:", capeTown);

await client.end();

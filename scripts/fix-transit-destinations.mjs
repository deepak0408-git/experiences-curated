import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, destinations } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [capeTown] = await db.select().from(destinations).where(eq(destinations.name, "Cape Town"));
const [durban] = await db.select().from(destinations).where(eq(destinations.name, "Durban"));
console.log("Cape Town:", capeTown.id, "| Durban:", durban.id);

const [newlandsResult] = await db.update(experiences)
  .set({ destinationId: capeTown.id })
  .where(eq(experiences.slug, "getting-to-newlands-mrlzm9wi"))
  .returning({ title: experiences.title });
console.log("✓ Fixed:", newlandsResult.title, "→ Cape Town");

const [kingsmeadResult] = await db.update(experiences)
  .set({ destinationId: durban.id })
  .where(eq(experiences.slug, "getting-to-kingsmead-mrlzazi9"))
  .returning({ title: experiences.title });
console.log("✓ Fixed:", kingsmeadResult.title, "→ Durban");

await client.end();

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-nanxiang-xiaolongbao-mud1x6t2";
const newAddress = "Nanxiang Old Town, Jiading District, Shanghai, China (multiple restaurants — Rihuaxuan and Changxinglou on/near Renmin Street, Guyi Garden Restaurant near the garden's south gate; see body for details)";

await db.update(experiences)
  .set({ address: newAddress })
  .where(eq(experiences.slug, SLUG));

console.log("Updated address:", newAddress);
await client.end();

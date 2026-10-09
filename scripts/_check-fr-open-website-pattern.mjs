import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [r] = await db.select().from(experiences).where(eq(experiences.slug, "french-open-luxury-dining-bois-de-boulogne"));
console.log("address:", r?.address);
console.log("website:", r?.practicalInfo?.website);
process.exit(0);

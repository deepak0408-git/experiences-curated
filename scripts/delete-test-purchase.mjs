import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { purchases } from "../schema/database.ts";
import { like } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

await db.delete(purchases).where(like(purchases.paddleOrderId, "test_order_%"));
console.log("Test purchase deleted");
await client.end();

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const newWhatToAvoid = "Don't try to combine this with a session day — the commute from Jiading plus a proper multi-course dinner realistically consumes an entire evening, and treating it as a quick pre- or post-session stop sets up a rushed, disappointing version of what should be a highlight meal. Don't assume walk-in availability because you're visiting during a major event — this restaurant's demand comes from its own standing reputation in Shanghai's dining scene, not from Grand Prix tourism specifically, so book ahead regardless of race weekend timing.";

console.log("Reverted, checking what I changed...");

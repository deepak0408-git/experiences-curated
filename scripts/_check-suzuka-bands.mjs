import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { plannerDestinationBands, destinations } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const rows = await db.select().from(plannerDestinationBands).where(eq(plannerDestinationBands.destinationId, "9a26a4f4-2d3b-4e68-9bc3-ce2b55bb15e9"));
console.log("Existing bands:", JSON.stringify(rows, null, 2));

await client.end();

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "ahmedabad-which-stand-muecmt5o";
const STADIUM_ADDRESS = "Narendra Modi Stadium, Motera, Ahmedabad, Gujarat 380005";

const [result] = await db.update(experiences)
  .set({ address: STADIUM_ADDRESS })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, address: experiences.address, status: experiences.status });

console.log(result);
process.exit(0);

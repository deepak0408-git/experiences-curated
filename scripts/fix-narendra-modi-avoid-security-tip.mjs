import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "narendra-modi-stadium-mueclmpw";

const NEW_AVOID = "Don't bring outside food, drinks, large bags, power banks, DSLRs, or lighters — security checks are thorough, and standard banned items also include bottles, cans, sharp objects, and musical instruments, so travel light and keep it to phone, wallet, and your printed e-ticket or QR code plus a valid photo ID. Don't underestimate the stadium's sheer size when planning your day — with 132,000 seats, sightline quality and distance from concessions/exits varies enormously by stand, so check your specific section's location relative to entrances before matchday, not after.";

const [result] = await db.update(experiences)
  .set({ whatToAvoid: NEW_AVOID })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, whatToAvoid: experiences.whatToAvoid, status: experiences.status });

console.log(result);
process.exit(0);

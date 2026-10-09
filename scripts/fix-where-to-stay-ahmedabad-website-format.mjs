import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "where-to-stay-ahmedabad-muecpb9t";

const [row] = await db.select({ practicalInfo: experiences.practicalInfo }).from(experiences).where(eq(experiences.slug, SLUG));

const [result] = await db.update(experiences)
  .set({
    practicalInfo: {
      ...row.practicalInfo,
      website: "Hyatt Regency: https://www.hyatt.com/hyatt-regency/en-US/amdhr-hyatt-regency-ahmedabad, Novotel: https://all.accor.com/hotel/8173/index.en.shtml, The House of MG: https://houseofmg.com/stay/house-of-mg/",
    },
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, practicalInfo: experiences.practicalInfo, status: experiences.status });

console.log(result);
process.exit(0);

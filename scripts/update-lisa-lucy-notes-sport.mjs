import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { businessPartners } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

try {
  const [lisa] = await db.update(businessPartners)
    .set({ notes: "Sport focus: Motorsport (Formula 1). Instagram collaboration outreach — motorsport content creator. Pitched Italian GP (Monza, 4-6 Sep), Bahrain GP (Sepang, Malaysia, 2-4 Oct), Singapore GP (Marina Bay, 9-11 Oct) as live guides to collaborate around." })
    .where(eq(businessPartners.contactEmail, "premereurlisa@gmail.com"))
    .returning({ organizationName: businessPartners.organizationName, notes: businessPartners.notes });

  const [lucy] = await db.update(businessPartners)
    .set({ notes: "Sport focus: Cricket. Instagram collaboration outreach — cricket content creator. Pitched Australia tour of South Africa (live), New Zealand tour of Australia, England tour of South Africa, and Border-Gavaskar Trophy 2026-27 as tours to collaborate around." })
    .where(eq(businessPartners.contactEmail, "lucyblitz2204@gmail.com"))
    .returning({ organizationName: businessPartners.organizationName, notes: businessPartners.notes });

  console.log("Lisa:", lisa.notes);
  console.log("\nLucy:", lucy.notes);
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await client.end();
}

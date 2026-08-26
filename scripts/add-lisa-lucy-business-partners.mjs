import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { businessPartners } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

try {
  const rows = await db.insert(businessPartners)
    .values([
      {
        organizationName: "Lisa (Motorsport Content Creator)",
        contactEmail: "premereurlisa@gmail.com",
        contactName: "Lisa",
        partnerType: "influencer",
        status: "contacted",
        notes: "Instagram collaboration outreach — motorsport content creator. Pitched Italian GP (Monza, 4-6 Sep), Bahrain GP (Sepang, Malaysia, 2-4 Oct), Singapore GP (Marina Bay, 9-11 Oct) as live guides to collaborate around.",
        firstContactedAt: new Date(),
        lastContactedAt: new Date(),
      },
      {
        organizationName: "Lucy (Cricket Content Creator)",
        contactEmail: "lucyblitz2204@gmail.com",
        contactName: "Lucy",
        partnerType: "influencer",
        status: "contacted",
        notes: "Instagram collaboration outreach — cricket content creator. Pitched Australia tour of South Africa (live), New Zealand tour of Australia, England tour of South Africa, and Border-Gavaskar Trophy 2026-27 as tours to collaborate around.",
        firstContactedAt: new Date(),
        lastContactedAt: new Date(),
      },
    ])
    .onConflictDoNothing()
    .returning({ id: businessPartners.id, organizationName: businessPartners.organizationName, partnerType: businessPartners.partnerType, contactEmail: businessPartners.contactEmail });

  console.log(`Inserted ${rows.length} row(s):`);
  for (const r of rows) console.log(`  ${r.organizationName} (${r.partnerType}) — ${r.contactEmail}`);
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await client.end();
}

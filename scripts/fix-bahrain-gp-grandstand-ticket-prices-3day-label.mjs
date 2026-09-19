import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, sql } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const updates = [
  { id: "960a4c4c-c65b-4bcb-9f35-af32a6c2d6f5", title: "Hill Stand (C2)", costRange: "US$200, 3-day ticket price" },
  { id: "72564dac-4c59-485d-bcd3-17754e5f5d0e", title: "K1 Grandstand", costRange: "US$320, 3-day ticket price" },
  { id: "b3965e92-30c1-4ebe-a1bd-6a0b55baae0d", title: "Grandstand F", costRange: "US$343, 3-day ticket price" },
  { id: "f33b1720-a12c-4ccc-b728-a7ca71e90b9a", title: "Main Grandstand", costRange: "US$516, 3-day ticket price" },
];

for (const u of updates) {
  await db
    .update(experiences)
    .set({
      practicalInfo: sql`jsonb_set(${experiences.practicalInfo}::jsonb, '{costRange}', to_jsonb(${u.costRange}::text))`,
      lastVerifiedDate: new Date().toISOString().slice(0, 10),
    })
    .where(eq(experiences.id, u.id));
  console.log(`Updated ${u.title} -> ${u.costRange}`);
}

await client.end();

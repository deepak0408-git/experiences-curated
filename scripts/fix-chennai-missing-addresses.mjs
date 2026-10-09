import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const STADIUM_ADDRESS = "M. A. Chidambaram Stadium, Wallajah Road, Chepauk, Chennai, Tamil Nadu 600005";

const ids = [
  "48d9ab54-ac8f-44cd-b361-e8fd0a076cf4", // Getting to Chepauk — Triplicane & Chennai Beach Station
  "46d07b2d-2b16-42dc-b4e8-1ab0558a8cce", // Chennai Test — Hospitality & Ticket Tiers
];

for (const id of ids) {
  const [row] = await db.update(experiences)
    .set({ address: STADIUM_ADDRESS })
    .where(eq(experiences.id, id))
    .returning({ slug: experiences.slug, address: experiences.address, status: experiences.status });
  console.log(row);
}

process.exit(0);

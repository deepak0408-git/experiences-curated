import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { inArray } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const titles = [
  "Chepauk — Cricket by the Bay of Bengal",
  "Chennai Test — Hospitality & Ticket Tiers",
  "Getting to Chepauk — Triplicane & Chennai Beach Station",
  "Where to Stay in Chennai for the Test",
  "Mahabalipuram — UNESCO Shore Temple Day Trip",
  "Marina Beach & Kapaleeshwarar Temple",
  "Chennai's Filter Coffee & Dosa Trail",
];

const rows = await db.select({
  slug: experiences.slug,
  title: experiences.title,
  status: experiences.status,
  address: experiences.address,
  practicalInfo: experiences.practicalInfo,
  openingHours: experiences.openingHours,
  budgetTier: experiences.budgetTier,
  budgetCurrency: experiences.budgetCurrency,
  budgetMinCost: experiences.budgetMinCost,
  budgetMaxCost: experiences.budgetMaxCost,
  gettingThere: experiences.gettingThere,
}).from(experiences).where(inArray(experiences.title, titles));

console.log(JSON.stringify(rows, null, 2));
process.exit(0);

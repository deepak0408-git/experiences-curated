import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// ─── 1. Eating at the US Open — Honey Deuce price $22 → $23+ ───
{
  const id = "3f082b9e-6a72-47af-9381-424bd553bd75";
  const [existing] = await db.select({ bodyContent: experiences.bodyContent, practicalInfo: experiences.practicalInfo }).from(experiences).where(eq(experiences.id, id));

  const bodyContent = existing.bodyContent
    .replace("It costs $22.", "It costs around $23, and the price has crept up most years.")
    .replace("It costs $22. It is thoroughly overpriced", "It costs around $23, and the price has crept up most years. It is thoroughly overpriced");

  const practicalInfo = { ...existing.practicalInfo, costRange: existing.practicalInfo.costRange.replace("Honey Deuce cocktail $22", "Honey Deuce cocktail ~$23") };

  await db.update(experiences).set({ bodyContent, practicalInfo }).where(eq(experiences.id, id));
  console.log("✓ Updated Honey Deuce price: Eating at the US Open");
}

// ─── 2. The 7 Train to Flushing — MetroCard framing (OMNY-only since Jan 2026) ───
{
  const id = "c76ef4a4-a397-4e07-9e4d-292cf04f3c5f";
  const [existing] = await db.select({ practicalInfo: experiences.practicalInfo }).from(experiences).where(eq(experiences.id, id));

  const practicalInfo = {
    ...existing.practicalInfo,
    bookingMethod: "No booking required — tap in with a contactless bank card or phone at any turnstile (OMNY). MetroCard is being phased out; as of early 2026 you can no longer buy or refill one, only transfer any remaining balance to OMNY, so plan on OMNY as the default.",
  };

  await db.update(experiences).set({ practicalInfo }).where(eq(experiences.id, id));
  console.log("✓ Updated MetroCard/OMNY framing: The 7 Train to Flushing");
}

// ─── 3. Morning at the Practice Facility — grounds pass price stale ───
{
  const id = "167a87cc-b7b0-467c-b2ab-553e3c6c3c3c";
  const [existing] = await db.select({ practicalInfo: experiences.practicalInfo }).from(experiences).where(eq(experiences.id, id));

  const practicalInfo = {
    ...existing.practicalInfo,
    costRange: "Covered by a grounds pass (from around $65, rising with demand and later rounds); no additional ticket required.",
  };

  await db.update(experiences).set({ practicalInfo }).where(eq(experiences.id, id));
  console.log("✓ Updated grounds pass price: Morning at the Practice Facility");
}

// ─── 4. A Morning in Queens Before the Tennis — Eat Your World tour price ───
{
  const id = "64ec24f3-4e80-4326-bf3e-5a3afda00603";
  const [existing] = await db.select({ bodyContent: experiences.bodyContent, practicalInfo: experiences.practicalInfo }).from(experiences).where(eq(experiences.id, id));

  const bodyContent = existing.bodyContent.replace(
    "roughly $100 to $150 per person for a private group of 4 to 6",
    "roughly $75 to $80 per person for the standard guided tour, with a cheaper self-guided option available"
  );

  const practicalInfo = {
    ...existing.practicalInfo,
    costRange: "Guided food tour: approx. $75-80 per person (standard); self-guided option cheaper, around $65. Eat Your World: contact laura@eatyourworld.com for current group pricing. Joe DiStefano: joedistefano.nyc/tours. Food costs at the Golden Mall: $8 to $15 per dish.",
  };

  await db.update(experiences).set({ bodyContent, practicalInfo }).where(eq(experiences.id, id));
  console.log("✓ Updated Eat Your World tour pricing: A Morning in Queens Before the Tennis");
}

await client.end();
console.log("\nAll price/framing fixes applied.");

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// ─── 1. Rooftop Dinner Then the Night Session — remove fabricated "official partner" claim ───
{
  const id = "f23f1f1d-08dd-44f0-a548-aa04ce071aef";
  const [existing] = await db.select({ bodyContent: experiences.bodyContent }).from(experiences).where(eq(experiences.id, id));

  const bodyContent = existing.bodyContent.replace(
    `For the dinner, Haven Rooftop at the Sanctuary Hotel (132 West 47th Street) is the official US Open cocktail partner — they run US Open specialty cocktails during the fortnight and show the day sessions on screens. More of a bar than a dinner venue, but good for a pre-match drink if you're coming from Midtown rather than the Seaport.`,
    `If you're coming from Midtown rather than the Seaport, Haven Rooftop at the Sanctuary Hotel (132 West 47th Street) is a solid pre-match option — a rooftop bar showing day sessions on screens, more suited to a drink before you head out than a full dinner. Grey Goose is the tournament's actual official cocktail partner, behind the Honey Deuce served courtside; Haven Rooftop runs its own separate seasonal menu, not an official tie-in.`
  );

  await db.update(experiences).set({ bodyContent }).where(eq(experiences.id, id));
  console.log("✓ Fixed fabricated 'official partner' claim: Rooftop Dinner Then the Night Session");
}

// ─── 2. Where to Stay for the US Open — remove non-existent AC Hotel ───
{
  const id = "38c57e06-4763-4e19-9ac5-3a7ad571e938";
  const [existing] = await db.select({ practicalInfo: experiences.practicalInfo }).from(experiences).where(eq(experiences.id, id));

  const howToBook = existing.practicalInfo.howToBook.replace(
    "Long Island City (AC Hotel, Boro Hotel, and Hilton Garden Inn LIC are the strongest options)",
    "Long Island City (Boro Hotel and Hilton Garden Inn LIC are the strongest options)"
  );

  await db.update(experiences)
    .set({ practicalInfo: { ...existing.practicalInfo, howToBook } })
    .where(eq(experiences.id, id));
  console.log("✓ Removed non-existent AC Hotel LIC reference: Where to Stay for the US Open");
}

// ─── 3. Flushing Meadows-Corona Park — fix Unisphere dimension error ───
{
  const id = "b1046f53-6f29-4716-b942-66b0ded24005";
  const [existing] = await db.select({ bodyContent: experiences.bodyContent }).from(experiences).where(eq(experiences.id, id));

  const bodyContent = existing.bodyContent.replace(
    "It's the largest representation of the Earth ever built — 140 feet in diameter, 700,000 pounds of stainless steel",
    "It's the largest representation of the Earth ever built — 140 feet tall, 120 feet in diameter, 700,000 pounds of stainless steel"
  );

  await db.update(experiences).set({ bodyContent }).where(eq(experiences.id, id));
  console.log("✓ Fixed Unisphere dimensions (140ft height, not diameter): Flushing Meadows-Corona Park");
}

// ─── 4. Jackson Heights — fix Dera's address ───
{
  const id = "153692ec-968f-44f6-84d9-27b09ffdacd6";
  const [existing] = await db.select({ bodyContent: experiences.bodyContent }).from(experiences).where(eq(experiences.id, id));

  const bodyContent = existing.bodyContent.replace(
    "Dera Restaurant on 74th Street serves North Indian food",
    "Dera Restaurant on 72-09 Broadway (a short walk from the 74th Street strip) serves North Indian food"
  );

  await db.update(experiences).set({ bodyContent }).where(eq(experiences.id, id));
  console.log("✓ Fixed Dera Restaurant address: Jackson Heights: The Food Mile");
}

// ─── 5. Preparing for Your US Open Visit — fix experienceType (was "transit", content is tickets/policy) ───
{
  const id = "ad53475e-d932-44af-803f-608cc6d51263";
  await db.update(experiences).set({ experienceType: "fan_experience" }).where(eq(experiences.id, id));
  console.log("✓ Fixed experienceType transit → fan_experience: Preparing for Your US Open Visit");
}

await client.end();
console.log("\nAll clear-bug fixes applied.");

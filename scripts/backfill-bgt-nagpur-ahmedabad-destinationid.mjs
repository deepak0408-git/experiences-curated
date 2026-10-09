import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, inArray } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

// Backfill destinationId for the 16 Border-Gavaskar Trophy 2027 experiences
// (confirmed via scripts/_check-bgt-all-destids.mjs) that were seeded
// pointing at Chennai's destinationId as a placeholder, since no Nagpur/
// Ahmedabad destinations rows existed at seed time. Run AFTER
// scripts/seed-destination-nagpur-ahmedabad.mjs.

const NAGPUR_ID = "578d1576-c9e1-4319-9ee8-eea30aace657";
const AHMEDABAD_ID = "d0efc070-e8fc-4421-9e5b-51a31163c939";

const NAGPUR_SLUGS = [
  "deekshabhoomi-muec81o8",
  "nagpur-saoji-food-muec9tvz",
  "tadoba-tiger-safari-muec6gu2",
  "vca-getting-there-muec2v47",
  "vca-stadium-jamtha-muebzzj6",
  "where-to-stay-nagpur-muec4r6c",
];

const AHMEDABAD_SLUGS = [
  "ahmedabad-old-city-muecs0y7",
  "ahmedabad-thali-manek-chowk-muectg5r",
  "ahmedabad-which-stand-muecmt5o",
  "gir-national-park-muecy99u",
  "kankaria-riverfront-muecv8t5",
  "motera-getting-there-muecny3h",
  "narendra-modi-stadium-mueclmpw",
  "sabarmati-ashram-muecqjmn",
  "statue-of-unity-muecwv9g",
  "where-to-stay-ahmedabad-muecpb9t",
];

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const nagpurResult = await db.update(experiences)
  .set({ destinationId: NAGPUR_ID })
  .where(inArray(experiences.slug, NAGPUR_SLUGS))
  .returning({ slug: experiences.slug });
console.log(`Nagpur: updated ${nagpurResult.length}/${NAGPUR_SLUGS.length}`, nagpurResult.map(r => r.slug));

const ahmedabadResult = await db.update(experiences)
  .set({ destinationId: AHMEDABAD_ID })
  .where(inArray(experiences.slug, AHMEDABAD_SLUGS))
  .returning({ slug: experiences.slug });
console.log(`Ahmedabad: updated ${ahmedabadResult.length}/${AHMEDABAD_SLUGS.length}`, ahmedabadResult.map(r => r.slug));

await client.end();

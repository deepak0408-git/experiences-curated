import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences } from "../schema/database.ts";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

async function uploadAndSet(experienceId, localPath, r2Key, heroImageAlt, heroImageCredit) {
  const file = readFileSync(localPath);
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: r2Key,
    Body: file,
    ContentType: "image/jpeg",
  }));
  const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;

  const [row] = await db
    .update(experiences)
    .set({ heroImageUrl, heroImageAlt, heroImageCredit })
    .where(eq(experiences.id, experienceId))
    .returning({ title: experiences.title, heroImageUrl: experiences.heroImageUrl });

  console.log("✓", row.title, "→", row.heroImageUrl);
}

// 1. Interlagos — Inside the Venue — Option 1 (2022 race weekend aerial)
await uploadAndSet(
  "fdb53b20-b879-4711-89b0-09758e904dca",
  "Images/Brazilian GP - Interlagos Aerial Race.jpg",
  "sporting-events/hero/brazilian-grand-prix-interlagos-venue.jpg",
  "Aerial view of the 2022 São Paulo Grand Prix at Interlagos",
  "Beto Issa / Governo do Estado de São Paulo (Wikimedia Commons, CC BY 2.0)"
);

// 15. Ibirapuera Park — Option 2 (Oca pavilion)
await uploadAndSet(
  "f47fbc77-a259-490f-98ef-6a4fb7ff3bea",
  "Images/Brazilian GP - Ibirapuera Oca Pavilion.jpg",
  "sporting-events/hero/brazilian-grand-prix-ibirapuera-oca.jpg",
  "The Oca pavilion in Ibirapuera Park, São Paulo",
  "Paul R. Burley (Wikimedia Commons, CC BY-SA 4.0)"
);

// 16. Avenida Paulista & MASP — Option 1 (MASP building)
await uploadAndSet(
  "3a0773fa-f561-43a5-a0f7-2d5ee7f35545",
  "Images/Brazilian GP - MASP Building.jpg",
  "sporting-events/hero/brazilian-grand-prix-masp.jpg",
  "MASP, the São Paulo Museum of Art, on Avenida Paulista",
  "Guilherme B Alves (Wikimedia Commons, CC BY-SA 4.0)"
);

// 18. Beco do Batman — Option 2 (mural)
await uploadAndSet(
  "402dc58f-0445-45ed-a266-aae87d2ade71",
  "Images/Brazilian GP - Beco do Batman Mural 2.jpg",
  "sporting-events/hero/brazilian-grand-prix-beco-do-batman.jpg",
  "Street art mural in Beco do Batman, Vila Madalena",
  "Diego Bravo / Somente Coisas Legais (Wikimedia Commons, CC BY-SA 4.0)"
);

// 21. Campos do Jordão — Option 1 (Pórtico entrance gate)
await uploadAndSet(
  "dce1e260-6764-4437-8804-c758bbf57607",
  "Images/Brazilian GP - Campos do Jordao Portico.jpg",
  "sporting-events/hero/brazilian-grand-prix-campos-do-jordao.jpg",
  "The entrance gate (pórtico) to Campos do Jordão",
  "Governo do Estado de São Paulo (Wikimedia Commons, CC BY 2.0)"
);

await client.end();

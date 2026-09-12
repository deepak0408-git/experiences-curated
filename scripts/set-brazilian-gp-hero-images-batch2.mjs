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

// 17. Feira da Liberdade Weekend Market — Option 2 (market street scene)
await uploadAndSet(
  "f0806574-316d-441e-b728-33a415d66e19",
  "Images/Brazilian GP - Feira da Liberdade Street.jpg",
  "sporting-events/hero/brazilian-grand-prix-feira-liberdade.jpg",
  "Feira da Liberdade street market, São Paulo",
  "Vitor Leite (Wikimedia Commons, CC BY-SA 3.0)"
);

// 14. Liberdade's Ramen Shops — Aska & Lamen Kazu — user-supplied image
await uploadAndSet(
  "0cef8047-9497-487f-8c71-0243e8e84796",
  "Images/Brazilian GP - Ramen Andy Li CC by 1.0.jpg",
  "sporting-events/hero/brazilian-grand-prix-liberdade-ramen.jpg",
  "Ramen in Liberdade, São Paulo",
  "Andy Li (CC BY 1.0)"
);

await client.end();

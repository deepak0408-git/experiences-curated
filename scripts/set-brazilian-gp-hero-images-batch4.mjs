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

// 20. Santos & Guarujá — Option 2 (Praia da Enseada beach)
await uploadAndSet(
  "c401f59f-9ce4-45b6-a728-d3d4472ea6f0",
  "Images/Brazilian GP - Praia da Enseada Guaruja.jpg",
  "sporting-events/hero/brazilian-grand-prix-santos-guaruja.jpg",
  "Praia da Enseada, Guarujá's most famous beach",
  "Boris Karpuk (Wikimedia Commons, CC BY-SA 3.0)"
);

// 23. First-Timer's Guide to São Paulo — user-supplied image
await uploadAndSet(
  "c47fb5d1-4117-4fe9-a792-c241772ce125",
  "Images/Brazilian GP - Sao Paolo Skyline Spicypepper999 CC by 1.0.jpg",
  "sporting-events/hero/brazilian-grand-prix-first-timer-guide.jpg",
  "São Paulo skyline",
  "Spicypepper999 (CC BY 1.0)"
);

await client.end();

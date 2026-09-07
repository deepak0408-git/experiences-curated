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

async function uploadLocal(localPath, r2Key) {
  const file = readFileSync(localPath);
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: r2Key,
    Body: file,
    ContentType: "image/jpeg",
  }));
  return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;
}

// Montmartre — replaces prior v2 image with CC BY 4.0 credited Sacré-Cœur photo
{
  const url = await uploadLocal(
    "Images/French Open - Sacre Couer Gillfoto CC 4.0.jpg",
    "experiences/hero/french-open-montmartre-v3.jpg"
  );
  await db.update(experiences)
    .set({
      heroImageUrl: url,
      heroImageAlt: "Sacré-Cœur Basilica, Montmartre",
      heroImageCredit: "Gillfoto, CC BY 4.0",
    })
    .where(eq(experiences.slug, "montmartre-neighborhood"));
  console.log(`✓ montmartre-neighborhood → ${url}`);
}

await client.end();

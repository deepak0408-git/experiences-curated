import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

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

// Replaces the existing Vettel Stand hero image with a real, licensed
// photo — CC BY 4.0 (Yu Chu Chin), 20 Sep 2026.
const SLUG = "vettel-stand-turns-11-12-mu9bzrti";
const localFile = "Images/Australian GP - Vettel Grandstand Yu Chu Chin CC BY 4.0.jpg";
const imageKey = "experiences/hero/vettel-stand-turns-11-12-mu9bzrti.jpg";

const file = readFileSync(localFile);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const [result] = await db
  .update(experiences)
  .set({ heroImageUrl })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, title: experiences.title, heroImageUrl: experiences.heroImageUrl });

console.log(`✓ ${result.slug}`);
console.log(`  hero_image_url: ${result.heroImageUrl}`);

await client.end();

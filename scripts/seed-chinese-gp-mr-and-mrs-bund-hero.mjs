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

const SLUG = "chinese-gp-upscale-dining-mud20jh1";
const FILE = "Images/Chinese GP - Mr and Mrs Bund ウィ貴公子 CC BY 4.0.jpg";
const KEY = "experiences/hero/chinese-gp-mr-and-mrs-bund.jpg";
const ALT = "Mr & Mrs Bund restaurant interior overlooking the Shanghai riverfront";
const CREDIT = "ウィ貴公子, CC BY 4.0";

const fileBuffer = readFileSync(FILE);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: KEY,
  Body: fileBuffer,
  ContentType: "image/jpeg",
}));

const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${KEY}`;
console.log("✓ Uploaded:", KEY);

const [result] = await db
  .update(experiences)
  .set({
    heroImageUrl,
    heroImageAlt: ALT,
    heroImageCredit: CREDIT,
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ title: experiences.title, slug: experiences.slug });

if (result) {
  console.log("✓ Updated hero image:", result.title, "→", heroImageUrl);
} else {
  console.error("✗ No experience found for slug:", SLUG);
}

await client.end();

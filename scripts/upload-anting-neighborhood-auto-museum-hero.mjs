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

const localPath = "Images/Chinese GP - Shanghai Auto Museum Morio CC By 4.0.jpg";
const r2Key = "experiences/hero/chinese-gp-anting-neighborhood.jpg";

const file = readFileSync(localPath);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: r2Key,
  Body: file,
  ContentType: "image/jpeg",
}));

const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;
console.log("✓ Uploaded:", publicUrl);

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-anting-neighborhood-mue5lzhx";

await db.update(experiences)
  .set({
    heroImageUrl: publicUrl,
    heroImageAlt: "Shanghai Auto Museum in Anting, Jiading District",
    heroImageCredit: "Morio, CC BY 4.0",
  })
  .where(eq(experiences.slug, SLUG));

console.log("✓ Updated hero image fields for", SLUG);

await client.end();

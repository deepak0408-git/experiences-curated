import { config } from "dotenv";
config({ path: ".env.local" });

import sharp from "sharp";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

async function processAndUpload(inputPath, r2Key, label) {
  console.log(`Processing ${label}...`);

  const processed = await sharp(inputPath)
    .modulate({ brightness: 1.15, saturation: 1.5 })
    .sharpen({ sigma: 1.2, m1: 1.5, m2: 0.7 })
    .jpeg({ quality: 92, mozjpeg: true })
    .toBuffer();

  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: r2Key,
    Body: processed,
    ContentType: "image/jpeg",
  }));

  console.log(`✓ ${label} uploaded to: ${r2Key}`);
}

await processAndUpload("Images/cricket-hero-image.jpg", "sports/cricket-v2.jpg", "Cricket");
await processAndUpload("Images/us-open-tennis.jpg", "sports/tennis-v2.jpg", "Tennis");

console.log("\n✓ Done.");

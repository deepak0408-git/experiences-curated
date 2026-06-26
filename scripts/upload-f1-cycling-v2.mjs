import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import sharp from "sharp";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

async function downloadFromR2(key) {
  const res = await r2.send(new GetObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: key,
  }));
  const chunks = [];
  for await (const chunk of res.Body) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function processAndUpload(sourceKey, destKey, label) {
  console.log(`Downloading ${label} from R2...`);
  const input = await downloadFromR2(sourceKey);

  console.log(`Processing ${label}...`);
  const processed = await sharp(input)
    .modulate({ brightness: 1.2, saturation: 1.6 })
    .sharpen({ sigma: 1.5, m1: 2.0, m2: 0.8 })
    .jpeg({ quality: 92, mozjpeg: true })
    .toBuffer();

  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: destKey,
    Body: processed,
    ContentType: "image/jpeg",
  }));

  console.log(`✓ ${label} uploaded to: ${destKey}`);
}

await processAndUpload(
  "experiences/hero/Circuit de Spa-Francorchamps Track Experiences and Driving Days.jpg",
  "sports/formula1-v2.jpg",
  "Formula 1"
);

await processAndUpload(
  "sports/cycling.jpg",
  "sports/cycling-v2.jpg",
  "Cycling"
);

console.log("\n✓ Done.");
console.log(`  ${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/sports/formula1-v2.jpg`);
console.log(`  ${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/sports/cycling-v2.jpg`);

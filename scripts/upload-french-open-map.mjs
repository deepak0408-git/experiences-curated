import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

// Official Roland-Garros grounds map, used as the Map spoke's static site-map
// image — same pattern as Wimbledon's grounds map (wimbledon.org credited
// inline). Replaced 7 Sep 2026 with a higher-resolution version (bilingual
// FR/EN legend, sharper detail) sourced from map-of-paris.com — v2 key so the
// original rolandgarros.com-credited upload isn't silently overwritten.
async function uploadLocal(localPath, r2Key, contentType) {
  const file = readFileSync(localPath);
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: r2Key,
    Body: file,
    ContentType: contentType,
  }));
  return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;
}

const url = await uploadLocal(
  "Images/French Open - Map1.JPG",
  "sporting-events/hero/french-open-grounds-map-v2.jpg",
  "image/jpeg"
);
console.log(`✓ French Open grounds map (v2, higher resolution) → ${url}`);

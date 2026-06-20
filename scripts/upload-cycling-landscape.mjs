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

const file = readFileSync("Images/Tour de France 1.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: "sports/cycling.jpg",
  Body: file,
  ContentType: "image/jpeg",
}));

const url = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/sports/cycling.jpg`;
console.log("✓ sports/cycling.jpg (landscape) uploaded");
console.log("  →", url);

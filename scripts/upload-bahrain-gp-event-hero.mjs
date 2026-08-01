import { config } from "dotenv";
config({ path: ".env.local" });

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync } from "fs";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const localFile = "Images/sepang-tribune-event-hero.jpg";
const r2Key = "sporting-events/hero/bahrain-grand-prix.jpg";

const body = readFileSync(localFile);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: r2Key,
  Body: body,
  ContentType: "image/jpeg",
}));

console.log(`Uploaded to: ${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${encodeURIComponent(r2Key).replace(/%2F/g, "/")}`);

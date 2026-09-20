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

// Cost Guide spoke image override for the Australian Grand Prix hub-and-spoke
// pack. Curator-supplied file, 20 Sep 2026, CC BY 2.0 (Tom Reynolds) —
// credit retained in filename per licence terms.
const localFile = "Images/Australian GP - Fangio Grandstand Tom Reynolds CC BY 2.0.jpg";
const imageKey = "sporting-events/hero/australian-grand-prix-cost-fangio-grandstand.jpg";

const file = readFileSync(localFile);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
const imageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

console.log(`✓ Uploaded`);
console.log(`  R2 key: ${imageKey}`);
console.log(`  URL: ${imageUrl}`);

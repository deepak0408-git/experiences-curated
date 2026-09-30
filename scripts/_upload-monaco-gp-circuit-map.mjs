import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Circuit de Monaco official 2027 map, credit acm.mc (Automobile Club de
// Monaco). Local file: "Images/Monaco GP - Circuit Map credit acm.mc.jpg" —
// full grandstand legend (A, B, K/K1-K6, L, N, O, P, T/T1-T3, V, X-PMR, Z,
// Secteur Rocher), transport, services, hospitality zones, and access
// gates. Confirmed real 2027 official ACM map (dated "03-06 JUIN" on the
// image itself), 2000x2400px. Uploaded 30 Sep 2026.

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const localPath = "Images/Monaco GP - Circuit Map credit acm.mc.jpg";
const r2Key = "sporting-events/hero/monaco-grand-prix-circuit-map.jpg";

const file = readFileSync(localPath);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: r2Key,
  Body: file,
  ContentType: "image/jpeg",
}));

const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;
console.log("✓ Uploaded:", publicUrl);

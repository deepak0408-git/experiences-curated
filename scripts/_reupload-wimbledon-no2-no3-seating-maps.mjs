import { config } from "dotenv";
config({ path: ".env.local" });
import fs from "node:fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Re-uploads the CORRECTED No.2/No.3 Court seating maps to the exact same
// R2 keys the app already references (via arenaMaps.ts's WIM2027_ARENA_MAPS
// constant) — no code/URL change needed, just a content overwrite.
//
// Fix: cropped to tight content bbox + evenly padded, to correct the
// oversized 768x1024 portrait canvas / large dead whitespace that made
// these two images render tiny and mis-proportioned next to Centre
// Court/No.1 Court's properly-framed images. Does NOT restore the
// "EAST END"/"WEST END" text partially clipped at the canvas edge in the
// original source PNGs — that pixel data was never rendered in the
// source asset and cannot be recovered by cropping; flagged separately.

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

async function uploadLocal(localPath, r2Key) {
  const file = fs.readFileSync(localPath);
  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: r2Key,
      Body: file,
      ContentType: "image/png",
    })
  );
  return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;
}

// Third pass, 25 Oct 2026: resized (via _sync-wimbledon-court23-aspect.mjs,
// sharp's "contain" fit — scales down then pads, never stretches) to
// Centre Court's exact 761x551 canvas, so all four seating-map images
// share identical frame dimensions in the app.
const jobs = [
  { local: "Images/Court 2 - synced.png", key: "tennis-ticket-intelligence/wimbledon/2027/arena-maps/WIM2027_no2-court_seating_map.png" },
  { local: "Images/Court 3 - synced.png", key: "tennis-ticket-intelligence/wimbledon/2027/arena-maps/WIM2027_no3-court_seating_map.png" },
];

for (const { local, key } of jobs) {
  const url = await uploadLocal(local, key);
  console.log(`${local} -> ${url}`);
}

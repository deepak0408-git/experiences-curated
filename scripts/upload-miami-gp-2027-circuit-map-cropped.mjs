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

// Replacement for the circuit map upload — the original source file had
// baked-in white margin around the actual track art (original 3840x1638
// vs. content bbox 3740x1487), which caused ZoomableImage's object-cover
// to crop into the circuit itself (right side cut off) since the declared
// aspectClassName didn't match the image's real content ratio. Cropped
// tight to content with sharp's .trim(), verified visually 28 Sep 2026 —
// all 19 turns now fully visible, no clipping.
const LOCAL = "Images/miami-gp-circuit-map-cropped.jpg";
const KEY = "sporting-events/hero/miami-grand-prix-2027-map.jpg"; // same key — overwrite

const body = readFileSync(LOCAL);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: KEY,
  Body: body,
  ContentType: "image/jpeg",
}));

const url = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${encodeURIComponent(KEY).replace(/%2F/g, "/")}`;
console.log(`Re-uploaded cropped circuit map: ${url}`);
console.log(`New content dimensions: 3740x1487 (ratio ${3740 / 1487})`);

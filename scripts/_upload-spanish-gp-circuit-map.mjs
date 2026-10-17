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

// Base map: CC0, Wikimedia Commons (Madring_(2026).svg). Grandstand/
// hospitality markers added by Experiences | Curated (17 Oct 2026),
// positioned against the base map's own switch-TurnN text-label
// coordinates and cross-referenced against the official 2026 Madring venue
// map (GA/GB/GC/GD/GE/GK stand-code system, founder-provided) — see
// circuit_seating_profile seed script for full sourcing. Original base
// map's own corner-name labels (Hortaleza, El Búnker, etc.) removed per
// founder direction, 17 Oct 2026, to reduce visual crowding — turn-number
// circles retained.
const localPath = "Images/Spanish GP - Madring Circuit Map with Stands (base CC0 Wikimedia).svg";
const r2Key = "sporting-events/hero/spanish-grand-prix-circuit-map.svg";

const file = readFileSync(localPath);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: r2Key,
  Body: file,
  ContentType: "image/svg+xml",
}));

const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;
console.log("✓ Uploaded:", publicUrl);

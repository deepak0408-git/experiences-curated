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

// Base map: CC BY-SA 4.0, HumanBodyPiloter5, via Wikimedia Commons
// (Spielberg_bare_map_numbers_contextless_2021_corner_names.svg). Grandstand
// markers added by Experiences | Curated (14 Oct 2026), positioned against
// the base map's own turn-number ellipse coordinates and validated against
// a founder-provided official Red Bull Ring zone map (Blue/Yellow/Green
// ticket zones) — see circuit_seating_profile seed script for full sourcing.
const localPath = "Images/Austrian GP - Red Bull Ring Circuit Map with Stands (base CC BY-SA 4.0 HumanBodyPiloter5).svg";
const r2Key = "sporting-events/hero/austrian-grand-prix-circuit-map.svg";

const file = readFileSync(localPath);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: r2Key,
  Body: file,
  ContentType: "image/svg+xml",
}));

const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;
console.log("✓ Uploaded:", publicUrl);

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

// Credit: Will Pittenger, CC BY-SA 3.0, via Wikimedia Commons
// (commons.wikimedia.org/wiki/File:Spa-Francorchamps_of_Belgium.svg).
// Founder-supplied — numbered 1-20 corner map matching the official
// circuit layout, used to verify grandstand/corner positions during
// circuit_seating_profile research (12 Oct 2026). File on disk is
// actually a WEBP raster (Wikimedia's thumb.wikimedia.org PNG-rendering
// of the SVG, saved locally with an .svg extension by mistake) — verified
// by inspecting the file's magic bytes before upload, uploaded with the
// correct image/webp content type rather than trusting the extension.
const file = readFileSync("Images/Spa-Francorchamps Circuit Map.svg");
const r2Key = "sporting-events/hero/belgian-grand-prix-circuit-map.webp";
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: r2Key,
  Body: file,
  ContentType: "image/webp",
}));
const url = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;
console.log("Uploaded:", url);

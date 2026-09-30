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

// Credit: Anthony Alessio Tralongo, CC BY 4.0. Local file: "Images/British
// GP - Silverstone_Circuit Map Anthony Alessio Tralongo CC BY 4.0.png" —
// clean labeled Silverstone layout, all 18 numbered corners plus named
// sections (Abbey, Farm, Arena, Copse, Maggotts, Becketts, Chapel, Hangar
// Straight, Stowe, Vale, Club, Woodcote, Luffield, Brooklands) marked.
// Verified visually 30 Sep 2026.
const file = readFileSync("Images/British GP - Silverstone_Circuit Map Anthony Alessio Tralongo CC BY 4.0.png");
const r2Key = "sporting-events/hero/british-grand-prix-circuit-map.png";
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: r2Key,
  Body: file,
  ContentType: "image/png",
}));
const url = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;
console.log("Uploaded:", url);

import { config } from "dotenv";
config({ path: ".env.local" });

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";
import https from "https";
import fs from "fs";

const EXPERIENCE_ID = "037780a7-2d9b-4ee9-84ac-b4bc094614f2";
const IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/d/dd/Milan_Porta_Garibaldi_Railway_Station.jpg";
const LOCAL_PATH = "Images/Getting to the Circuit Monza.jpg";
const R2_KEY = "experiences/hero/getting-to-the-circuit-monza.jpg";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Download image with Wikimedia-friendly User-Agent
console.log("Downloading image...");
await new Promise((resolve, reject) => {
  const file = fs.createWriteStream(LOCAL_PATH);
  https.get(IMAGE_URL, { headers: { "User-Agent": "ExperiencesCurated/1.0 (admin@experiences-curated.com)" } }, (res) => {
    if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
    res.pipe(file);
    file.on("finish", () => { file.close(); resolve(); });
  }).on("error", reject);
});
console.log("✓ Downloaded to", LOCAL_PATH);

// Upload to R2
const fileBuffer = fs.readFileSync(LOCAL_PATH);
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${R2_KEY}`;

await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: R2_KEY,
  Body: fileBuffer,
  ContentType: "image/jpeg",
}));
console.log("✓ Uploaded to R2:", heroImageUrl);

// Update DB
await db.update(experiences)
  .set({
    heroImageUrl,
    heroImageAlt: "A Trenord commuter train at Milano Porta Garibaldi station, the departure point for the Italian Grand Prix at Monza",
    heroImageCredit: "Ed Webster, CC BY 2.0",
  })
  .where(eq(experiences.id, EXPERIENCE_ID));

console.log("✓ DB updated");
console.log("→ Experience: http://localhost:3000/experience/getting-to-the-circuit-monza-mqz786l4");

await client.end();

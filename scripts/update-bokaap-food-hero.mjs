import { config } from "dotenv";
config({ path: ".env.local" });

import { writeFileSync, readFileSync } from "fs";
import https from "https";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences } from "../schema/database.ts";

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

const EXPERIENCE_ID = "08d1c882-6b89-45f4-b544-c9cee3d414b2";

function download(url, dest, attempt = 1) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode === 429 && attempt < 4) {
        res.resume();
        return setTimeout(() => download(url, dest, attempt + 1).then(resolve, reject), 3000 * attempt);
      }
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest, attempt).then(resolve, reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        writeFileSync(dest, Buffer.concat(chunks));
        resolve();
      });
    }).on("error", reject);
  });
}

try {
  const imagePath = "Images/Cape Town Bo-Kaap City Bowl Food Scene.jpg";
  await download(
    "https://images.pexels.com/photos/14731625/pexels-photo-14731625.jpeg?cs=srgb&dl=pexels-shameel-mukkath-3421394-14731625.jpg&fm=jpg",
    imagePath
  );
  console.log("✓ Downloaded food hero image");

  const imageKey = "experiences/hero/cape-town-bo-kaap-city-bowl-food-scene.jpg";
  const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: imageKey,
    Body: readFileSync(imagePath),
    ContentType: "image/jpeg",
  }));
  console.log("✓ Uploaded to R2:", heroImageUrl);

  const [result] = await db.update(experiences)
    .set({
      heroImageUrl,
      heroImageAlt: "Lamb biryani served on a decorative plate with fresh vegetables, a Cape Malay-style curry meal",
      heroImageCredit: "Shameel mukkath, Pexels Licence",
    })
    .where(eq(experiences.id, EXPERIENCE_ID))
    .returning({ id: experiences.id, title: experiences.title, heroImageUrl: experiences.heroImageUrl });

  console.log("✓ Updated experience:", result.title, "|", result.id);
} catch (e) {
  console.error("✗ FAILED:", e.message);
  if (e.cause) console.error("CAUSE:", e.cause);
} finally {
  await client.end();
}

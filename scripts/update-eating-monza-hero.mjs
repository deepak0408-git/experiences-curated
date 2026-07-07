import { config } from "dotenv";
config({ path: ".env.local" });

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";
import https from "https";
import fs from "fs";

const EXPERIENCE_ID = "581b601a-b614-4d53-9c24-8472b2dfd9bb";
const IMAGE_URL = "https://images.unsplash.com/photo-1533777324565-a040eb52facd?fm=jpg&q=80&w=3000&auto=format&fit=crop";
const LOCAL_PATH = "Images/Eating in Monza Risotto Luganega.jpg";
const R2_KEY = "experiences/hero/eating-in-monza-risotto-luganega.jpg";

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

console.log("Downloading replacement image...");
await new Promise((resolve, reject) => {
  const file = fs.createWriteStream(LOCAL_PATH);
  https.get(IMAGE_URL, { headers: { "User-Agent": "ExperiencesCurated/1.0 (admin@experiences-curated.com)" } }, (res) => {
    if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
    res.pipe(file);
    file.on("finish", () => { file.close(); resolve(); });
  }).on("error", reject);
});
console.log("✓ Downloaded to", LOCAL_PATH);

const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${R2_KEY}`;
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: R2_KEY,
  Body: fs.readFileSync(LOCAL_PATH),
  ContentType: "image/jpeg",
}));
console.log("✓ Uploaded to R2:", heroImageUrl);

await db.update(experiences)
  .set({
    heroImageUrl,
    heroImageAlt: "Overhead view of an Italian restaurant table with assorted pasta and pizza dishes",
    heroImageCredit: "Pablo Merchán Montes, Unsplash Licence",
  })
  .where(eq(experiences.id, EXPERIENCE_ID));

console.log("✓ DB updated");
console.log("→ Experience: http://localhost:3000/experience/eating-in-monza-risotto-luganega-mqzei8if");

await client.end();

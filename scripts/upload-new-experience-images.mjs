import { config } from "dotenv";
config({ path: ".env.local" });
import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences } from "../schema/database.ts";
import { like } from "drizzle-orm";

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

const IMAGES = [
  {
    localFile: "Images/crooked-billet.jpg",
    r2Key: "experiences/hero/crooked-billet.jpg",
    titleMatch: "Crooked Billet",
    credit: "Seyma Savascioglu / Pexels",
  },
  {
    localFile: "Images/light-house-wimbledon.jpg",
    r2Key: "experiences/hero/light-house-wimbledon.jpg",
    titleMatch: "Light House",
    credit: "Ivanna Lebediuk / Pexels",
  },
  {
    localFile: "Images/london-day-trip.jpg",
    r2Key: "experiences/hero/london-day-trip.jpg",
    titleMatch: "Rest Day",
    credit: "Tony Wu / Pexels",
  },
];

for (const { localFile, r2Key, titleMatch, credit } of IMAGES) {
  const file = readFileSync(localFile);
  const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;

  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: r2Key,
    Body: file,
    ContentType: "image/jpeg",
  }));
  console.log(`✓ Uploaded ${r2Key}`);

  await db
    .update(experiences)
    .set({ heroImageUrl: publicUrl, heroImageCredit: credit })
    .where(like(experiences.title, `%${titleMatch}%`));
  console.log(`✓ Updated DB for "${titleMatch}" → ${publicUrl}`);
}

console.log("\nAll images uploaded and DB updated.");
await client.end();

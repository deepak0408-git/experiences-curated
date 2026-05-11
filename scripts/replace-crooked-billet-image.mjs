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

const imageKey = "experiences/hero/crooked-billet.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: readFileSync("Images/crooked-billet-v2b.jpg"),
  ContentType: "image/jpeg",
}));
console.log("✓ Replaced image in R2");

await db
  .update(experiences)
  .set({ heroImageUrl, heroImageCredit: "Valeria Boltneva / Pexels" })
  .where(like(experiences.title, "%Crooked Billet%"));
console.log("✓ DB updated");

await client.end();

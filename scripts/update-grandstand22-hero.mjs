import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const EXPERIENCE_ID = "99540487-ee1b-47a2-a527-67d0857a2502";
const LOCAL_PATH = "Images/Parabola 22.jpg";
const R2_KEY = "experiences/hero/grandstand-22-parabolica-corner.jpg";

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

const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${R2_KEY}`;
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: R2_KEY,
  Body: readFileSync(LOCAL_PATH),
  ContentType: "image/jpeg",
}));
console.log("✓ Uploaded to R2:", heroImageUrl);

await db.update(experiences)
  .set({ heroImageUrl })
  .where(eq(experiences.id, EXPERIENCE_ID));

console.log("✓ DB updated");
console.log("→ Experience: http://localhost:3000/experience/grandstand-22-parabolica-corner-mqzgq262");

await client.end();

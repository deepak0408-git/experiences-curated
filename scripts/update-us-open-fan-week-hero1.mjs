import { config } from "dotenv";
config({ path: ".env.local" });

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";
import { readFileSync } from "fs";

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

const EXPERIENCE_ID = "45ef6fe0-3b98-482d-bf77-d6610c2913ac"; // US Open Fan Week
const LOCAL_PATH = "Images/us-open-fan-week1.jpg";
const R2_KEY = "experiences/hero/us-open-fan-week-free-grounds-access.jpg";

const file = readFileSync(LOCAL_PATH);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: R2_KEY,
  Body: file,
  ContentType: "image/jpeg",
}));

const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${R2_KEY}`;

const [result] = await db
  .update(experiences)
  .set({ heroImageUrl })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

console.log(`✓ ${result.title} -> ${heroImageUrl}`);
console.log(`  http://localhost:3000/experience/${result.slug}`);

await client.end();

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

const EXPERIENCE_ID = "1b2a72c8-cef1-4fef-bce7-bac7da5356f5"; // General Admission & Fan Zone
const LOCAL_FILE = "GA Fan Zone Hungaroring 2003.jpg";
const R2_KEY = "experiences/hero/general-admission-fan-zone-hungaroring.jpg";

const file = readFileSync(`Images/${LOCAL_FILE}`);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: R2_KEY,
  Body: file,
  ContentType: "image/jpeg",
}));
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${R2_KEY}`;

const [result] = await db
  .update(experiences)
  .set({
    heroImageUrl,
    heroImageAlt: "Fans on the racetrack after the 2003 Hungarian Grand Prix",
    heroImageCredit: "Mitja, Wikimedia Commons, CC BY 3.0",
  })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ ${result.title}`);

await client.end();

import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
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

const SLUG = "where-to-stay-us-open-mq4wj388";
const LOCAL_FILE = "Images/US Open 2026 - Hilton Garden Inn Long Island City.jpg";
const R2_KEY = "experiences/hero/us-open-hilton-garden-inn-lic.jpg";
const CREDIT = "Jim.henderson, CC BY 4.0";
const ALT = "Hilton Garden Inn at Queens Plaza, Long Island City";

const body = readFileSync(LOCAL_FILE);

await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: R2_KEY,
  Body: body,
  ContentType: "image/jpeg",
}));

const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${R2_KEY}`;

const result = await db
  .update(experiences)
  .set({ heroImageUrl: publicUrl, heroImageAlt: ALT, heroImageCredit: CREDIT })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug, heroImageUrl: experiences.heroImageUrl });

console.log("Updated:", result);
process.exit(0);

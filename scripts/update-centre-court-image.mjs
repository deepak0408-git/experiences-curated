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

const EXPERIENCE_ID = "f96e648d-d3a4-473a-9397-ac1061f76629";
const imageKey = "experiences/hero/wimbledon-centre-court.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/wimbledon-centre-court-2023-final.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ New hero image uploaded:", heroImageUrl);

await db
  .update(experiences)
  .set({
    heroImageAlt: "Centre Court at the All England Lawn Tennis Club during the 2023 Wimbledon Men's Singles Final, showing the packed stands and grass court",
    heroImageCredit: "Photo by Daniel Cooper, CC BY-SA 2.0",
  })
  .where(eq(experiences.id, EXPERIENCE_ID));

console.log("✓ DB record updated with new image credit");
console.log("  URL:", heroImageUrl);
await client.end();

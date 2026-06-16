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

const EXPERIENCE_ID = "97abf70a-0c40-4139-8bc8-a0bab4234e30";
const imageKey = "experiences/hero/The-18th-at-Royal-Birkdale.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

// Upload to R2
const file = readFileSync("Images/The 18th at Royal Birkdale.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// Update DB
const [result] = await db
  .update(experiences)
  .set({
    heroImageUrl,
    heroImageAlt: "Packed grandstands lining the 14th green at Royal Birkdale during The Senior Open Championship, with links dunes and championship sky behind",
    heroImageCredit: "Jonathan Palombo, CC BY 2.0",
  })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title, heroImageUrl: experiences.heroImageUrl });

console.log("\n✓ Experience updated:");
console.log("  ID:    ", result.id);
console.log("  Title: ", result.title);
console.log("  Image: ", result.heroImageUrl);

await client.end();

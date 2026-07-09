import { config } from "dotenv";
config({ path: ".env.local" });

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";
import fs from "fs";

const EXPERIENCE_ID = "217fd272-f8f4-40ea-889e-d7a9d51332bb";
const LOCAL_PATH = "Images/Eating in Milan Where Serious Italians Go.jpg";
const R2_KEY = "experiences/hero/eating-in-milan-serious-italians.jpg";

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
  Body: fs.readFileSync(LOCAL_PATH),
  ContentType: "image/jpeg",
}));
console.log("✓ Uploaded to R2:", heroImageUrl);

await db.update(experiences)
  .set({
    heroImageUrl,
    heroImageAlt: "A bowl of risotto garnished with herbs",
    heroImageCredit: "Julien Pianetti, Unsplash Licence",
  })
  .where(eq(experiences.id, EXPERIENCE_ID));

console.log("✓ DB updated");
console.log("→ Experience: http://localhost:3000/experience/eating-in-milan-serious-italians-mrbxw8xs");

await client.end();

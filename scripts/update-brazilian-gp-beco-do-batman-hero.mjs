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

const EXPERIENCE_ID = "402dc58f-0445-45ed-a266-aae87d2ade71"; // Beco do Batman — Vila Madalena's Street Art Alley

const file = readFileSync("Images/Brazilian GP - Beco do Batman Mural xiquinhosilva CC by 3.0.jpg");
const r2Key = "experiences/hero/brazilian-gp-beco-do-batman.jpg";
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: r2Key,
  Body: file,
  ContentType: "image/jpeg",
}));
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;

const [row] = await db
  .update(experiences)
  .set({
    heroImageUrl,
    heroImageAlt: "Beco do Batman street art alley, Vila Madalena, São Paulo",
    heroImageCredit: "xiquinhosilva, CC BY 3.0",
  })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ title: experiences.title, heroImageUrl: experiences.heroImageUrl });

console.log("✓", row.title, "→", row.heroImageUrl);
await client.end();

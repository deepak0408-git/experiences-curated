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

const file = readFileSync("Images/Brazilian GP - Feira_da_Liberdade ProtoplasmaKid CC by 4.0.jpg");
const r2Key = "sporting-events/hero/brazilian-grand-prix-feira-liberdade-v2.jpg";
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
    heroImageAlt: "Feira da Liberdade street market, São Paulo",
    heroImageCredit: "ProtoplasmaKid (CC BY 4.0)",
  })
  .where(eq(experiences.id, "f0806574-316d-441e-b728-33a415d66e19"))
  .returning({ title: experiences.title, heroImageUrl: experiences.heroImageUrl });

console.log("✓ Replaced:", row.title, "→", row.heroImageUrl);
await client.end();

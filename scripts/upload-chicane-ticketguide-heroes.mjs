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

const items = [
  {
    experienceId: "fcf7dbbb-a170-40a2-b4c5-ac7dbf134fc4", // The Chicane
    localFile: "The Chicane Hungaroring F1.jpg",
    r2Key: "experiences/hero/the-chicane-hungaroring.jpg",
    alt: "Formula 1 cars racing at the Long Beach Grand Prix",
    credit: "Brian McCall, Unsplash Licence",
  },
  {
    experienceId: "3d4dd55a-bd01-4d8c-8daa-6a5702ed35cf", // Ticket Guide
    localFile: "Ticket Guide F1 Car Closeup.jpg",
    r2Key: "experiences/hero/hungarian-gp-ticket-guide.jpg",
    alt: "Close-up of a Formula 1 race car on track",
    credit: "Jonathan Borba, Pexels Licence",
  },
];

for (const item of items) {
  const file = readFileSync(`Images/${item.localFile}`);
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: item.r2Key,
    Body: file,
    ContentType: "image/jpeg",
  }));
  const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${item.r2Key}`;

  const [result] = await db
    .update(experiences)
    .set({ heroImageUrl, heroImageAlt: item.alt, heroImageCredit: item.credit })
    .where(eq(experiences.id, item.experienceId))
    .returning({ id: experiences.id, title: experiences.title });

  console.log(`✓ ${result.title}`);
}

await client.end();

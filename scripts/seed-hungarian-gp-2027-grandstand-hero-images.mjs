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

const CREDIT = "Representative Image";

const ITEMS = [
  {
    slug: "grid-1-grandstand-starting-grid-view-mvay8pcm",
    localPath: "Images/Hungarian GP 2027 - Grid 1 Grandstand Representative Image.jpg",
    r2Key: "experiences/hero/hungarian-gp-2027-grid-1-grandstand.jpg",
  },
  {
    slug: "grid-2-grandstand-final-corner-view-mvay9sjk",
    localPath: "Images/Hungarian GP 2027 - Grid 2 Representative Image.jpg",
    r2Key: "experiences/hero/hungarian-gp-2027-grid-2.jpg",
  },
  {
    slug: "pit-exit-1-grandstand-mvayb3b6",
    localPath: "Images/Hungarian GP 2027 - Pit Exit 1 Representative Image.jpg",
    r2Key: "experiences/hero/hungarian-gp-2027-pit-exit-1.jpg",
  },
  {
    slug: "t1-grandstand-piquet-corner-mvay7kfz",
    localPath: "Images/Hungarian GP 2027 - T1 Grandstand Representative Image.jpg",
    r2Key: "experiences/hero/hungarian-gp-2027-t1-grandstand.jpg",
  },
  {
    slug: "hungaroring-grandstand-both-tiers-mvay5v2m",
    localPath: "Images/Hungarian GP 2027 - Hungaroring Grandstand Representative Image.jpg",
    r2Key: "experiences/hero/hungarian-gp-2027-hungaroring-grandstand.jpg",
  },
  {
    slug: "the-chicane-hungaroring-mrfbal2t",
    localPath: "Images/Hungarian GP 2027 - The Chicane Grandstand Representative Image.jpg",
    r2Key: "experiences/hero/hungarian-gp-2027-the-chicane-grandstand.jpg",
  },
];

try {
  for (const item of ITEMS) {
    const file = readFileSync(item.localPath);
    await r2.send(new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: item.r2Key,
      Body: file,
      ContentType: "image/jpeg",
    }));
    const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${item.r2Key}`;

    const [result] = await db
      .update(experiences)
      .set({ heroImageUrl, heroImageCredit: CREDIT })
      .where(eq(experiences.slug, item.slug))
      .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

    console.log("Updated:", result?.title, "|", result?.id, "|", result?.slug, "|", result?.status, "|", heroImageUrl);
  }
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

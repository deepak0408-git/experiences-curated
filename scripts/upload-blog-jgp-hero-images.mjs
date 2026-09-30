import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import postgres from "postgres";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const sql = postgres(process.env.DIRECT_URL);

const IMAGES = [
  {
    slug: "suzuka-collision-decided-the-title-two-years-running",
    file: "Images/Japanese GP - Suzuka Blog Senna Prost 1988 Hockenheim Suomi CC BY 4.0.jpg",
    alt: "Ayrton Senna at a 1988 Formula One Grand Prix",
    credit: "Suomi, CC BY 4.0",
  },
  {
    slug: "seventeenth-on-the-grid-first-at-the-flag",
    file: "Images/Japanese GP - Suzuka Blog Raikkonen 2005 Martin Lee CC BY 4.0.jpg",
    alt: "Kimi Räikkönen in the McLaren MP4-19B",
    credit: "Martin Lee, CC BY 4.0",
  },
  {
    slug: "the-track-that-crosses-itself",
    file: "Images/Japanese GP - Suzuka Aerial carloshonda CC BY 3.0.jpg",
    alt: "Aerial view of Suzuka Circuit's figure-eight layout",
    credit: "carloshonda, CC BY 3.0",
  },
  {
    slug: "the-race-track-honda-built-before-a-grand-prix",
    file: "Images/Japanese GP - Suzuka_Circuit_Final_Corner ata0929 CC BY 4.0.jpg",
    alt: "Suzuka Circuit's final corner",
    credit: "ata0929, CC BY 4.0",
  },
  {
    slug: "why-japanese-f1-fans-are-on-another-level",
    file: "Images/Japanese GP - Suzuka_Blog_Fans BWard 1997 CC BY 4.0.jpg",
    alt: "Fans in the grandstands at Suzuka Circuit",
    credit: "BWard 1997, CC BY 4.0",
  },
];

for (const img of IMAGES) {
  try {
    const file = readFileSync(img.file);
    const imageKey = `blog/hero/${img.slug}.jpg`;
    await r2.send(new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: imageKey,
      Body: file,
      ContentType: "image/jpeg",
    }));
    const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

    const [result] = await sql`
      UPDATE blog_articles
      SET hero_image_url = ${heroImageUrl}, hero_image_alt = ${img.alt}, hero_image_credit = ${img.credit}
      WHERE slug = ${img.slug}
      RETURNING slug, hero_image_url, status
    `;

    if (!result) {
      console.error(`✗ No blog article found for slug ${img.slug}`);
      continue;
    }
    console.log(`✓ ${result.slug} (${result.status})`);
    console.log(`  ${result.hero_image_url}`);
  } catch (e) {
    console.error(`✗ ${img.slug}: ${e.message}`);
  }
}

await sql.end();

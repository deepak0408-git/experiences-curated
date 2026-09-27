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
    slug: "albert-park-tried-to-host-a-grand-prix-twice-before-it-worked",
    file: "Images/Australian GP - Albert Park Circuit — Inside the Track Tom Reynolds CC BY 2.0.jpg",
    alt: "Albert Park Grand Prix Circuit, Melbourne",
    credit: "Tom Reynolds, CC BY 2.0",
  },
  {
    slug: "deal-mclaren-made-before-melbourne-even-started",
    file: "Images/Australian GP - Blog McLaren Team Orders Darren Teagles CC BY 2.0.jpg",
    alt: "The 1998 McLaren MP4/13, driven by Hakkinen and Coulthard",
    credit: "Darren Teagles, CC BY 2.0",
  },
  {
    slug: "grand-prix-that-got-cancelled-at-the-gates",
    file: "Images/Australian GP - Hero Image Tom Reynolds CC BY 2.0.jpg",
    alt: "Albert Park Grand Prix Circuit, Melbourne",
    credit: "Tom Reynolds, CC BY 2.0",
  },
  {
    slug: "why-2027-is-the-year-to-see-a-sprint-weekend-at-albert-park",
    file: "Images/Australian GP - Blog 2027 Yu Chu Chin CC BY 4.0.jpg",
    alt: "Albert Park circuit and lake, Melbourne",
    credit: "Yu Chu Chin, CC BY 4.0",
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

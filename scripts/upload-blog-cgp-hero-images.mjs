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
    slug: "the-circuit-built-in-18-months-and-the-lap-record-that-still-hasnt-fallen",
    file: "Images/Chinese GP - Shanghai_F1_Circui_01 Emily Walker CC by 2.0.jpg",
    alt: "Shanghai International Circuit",
    credit: "Emily Walker, CC BY 2.0",
  },
  {
    slug: "the-circuit-shaped-like-a-chinese-character",
    file: "Images/Shanghai_International_Circuit Snail Planet Labs, Inc CC BY 4.0.jpg",
    alt: "Satellite view of Shanghai International Circuit's snail-shell layout",
    credit: "Planet Labs, Inc, CC BY 4.0",
  },
  {
    slug: "the-rookie-title-lost-in-a-gravel-trap",
    file: "Images/Lewis_Hamilton_-_McLaren_Mercedes kevinmcgill CC BY 2.0.jpg",
    alt: "Lewis Hamilton in the McLaren-Mercedes",
    credit: "kevinmcgill, CC BY 2.0",
  },
  {
    slug: "the-home-race-that-took-twenty-years-to-happen",
    file: "Images/Zhou_Guanyu_2024_Chinese_GP Liauzh CC BY 4.0.jpg",
    alt: "Zhou Guanyu at the 2024 Chinese Grand Prix",
    credit: "Liauzh, CC BY 4.0",
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

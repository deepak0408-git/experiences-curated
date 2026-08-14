import { config } from "dotenv";
config({ path: ".env.local" });

import { writeFileSync, readFileSync, existsSync } from "fs";
import https from "https";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { blogArticles } from "../schema/database.ts";

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

function download(url, dest, attempt = 1) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "ExperiencesCuratedBot/1.0 (contact: hello@experiences-curated.com)" } }, (res) => {
      if (res.statusCode === 429 && attempt < 4) {
        res.resume();
        return setTimeout(() => download(url, dest, attempt + 1).then(resolve, reject), 3000 * attempt);
      }
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest, attempt).then(resolve, reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => { writeFileSync(dest, Buffer.concat(chunks)); resolve(); });
    }).on("error", reject);
  });
}

const items = [
  {
    slug: "arthur-ashe-man-behind-tennis-biggest-stadium",
    localPath: "Images/US Open Blog Arthur Ashe 1964.jpg",
    downloadUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Arthur_Ashe_1964.jpg",
    imageKey: "blog/hero/arthur-ashe-man-behind-tennis-biggest-stadium.jpg",
    heroImageAlt: "Arthur Ashe playing a backhand volley, UCLA, 1964",
    heroImageCredit: "Art Rogers, Los Angeles Times / UCLA Library — CC BY 4.0",
  },
  {
    slug: "voices-you-hear-at-us-open-arent-real",
    localPath: "Images/Blog Umpire_Carlos_(40022124053).jpg",
    downloadUrl: null, // user-supplied, already local
    imageKey: "blog/hero/voices-you-hear-at-us-open-arent-real.jpg",
    heroImageAlt: "Chair umpire at the US Open",
    heroImageCredit: null, // user-supplied — never a placeholder string, per standing rule
  },
  {
    slug: "5-greatest-matches-us-open-history",
    localPath: "Images/Alcaraz Sinner.jpg",
    downloadUrl: null, // user-supplied, already local
    imageKey: "blog/hero/5-greatest-matches-us-open-history.jpg",
    heroImageAlt: "Carlos Alcaraz and Jannik Sinner",
    heroImageCredit: null, // user-supplied
  },
  {
    slug: "why-us-open-night-sessions-are-tennis-best-theater",
    localPath: "Images/Arthur_Ashe_Stadium_with_the_roof_closed_(32938595438).jpg",
    downloadUrl: null, // user-supplied, already local
    imageKey: "blog/hero/why-us-open-night-sessions-are-tennis-best-theater.jpg",
    heroImageAlt: "Arthur Ashe Stadium with the roof closed",
    heroImageCredit: null, // user-supplied
  },
  {
    slug: "gender-equality-at-the-us-open",
    localPath: "Images/US Open Blog National Tennis Center Grounds.jpg",
    downloadUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3f/National_Tennis_Center_outside_courts_and_stadium.jpg",
    imageKey: "blog/hero/gender-equality-at-the-us-open.jpg",
    heroImageAlt: "USTA Billie Jean King National Tennis Center grounds",
    heroImageCredit: "Darylsam — CC BY-SA 4.0",
  },
  {
    slug: "5-rookie-mistakes-first-time-us-open-visitors-make",
    localPath: "Images/US Open Blog Grounds Unisphere.jpg",
    downloadUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bd/US_Open_Ground.JPG",
    imageKey: "blog/hero/5-rookie-mistakes-first-time-us-open-visitors-make.jpg",
    heroImageAlt: "US Open grounds with the Unisphere visible",
    heroImageCredit: "Alexisrael — CC BY-SA 4.0",
  },
];

for (const item of items) {
  try {
    if (item.downloadUrl) {
      if (!existsSync(item.localPath)) {
        await download(item.downloadUrl, item.localPath);
      }
      console.log(`✓ Downloaded/confirmed local: ${item.localPath}`);
    } else {
      if (!existsSync(item.localPath)) {
        throw new Error(`Expected user-supplied file not found: ${item.localPath}`);
      }
      console.log(`✓ Using user-supplied local file: ${item.localPath}`);
    }

    const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${item.imageKey}`;
    await r2.send(new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: item.imageKey,
      Body: readFileSync(item.localPath),
      ContentType: "image/jpeg",
    }));
    console.log(`✓ Uploaded to R2: ${heroImageUrl}`);

    const [result] = await db.update(blogArticles).set({
      heroImageUrl,
      heroImageAlt: item.heroImageAlt,
      heroImageCredit: item.heroImageCredit,
    }).where(eq(blogArticles.slug, item.slug)).returning({ title: blogArticles.title });

    console.log(`✓ Updated: ${result.title}\n`);
  } catch (e) {
    console.error(`✗ FAILED for ${item.slug}:`, e.message);
  }
}

await client.end();

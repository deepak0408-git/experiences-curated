import { config } from "dotenv";
config({ path: ".env.local" });

import { writeFileSync, readFileSync } from "fs";
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

const jobs = [
  {
    slug: "ben-stokes-258-at-newlands",
    sourceUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Newlands_Cricket_New_Floodlights_Sunset.jpg",
    localPath: "Images/England in South Africa - Newlands Floodlights Sunset.jpg",
    r2Key: "blog/hero/ben-stokes-258-at-newlands.jpg",
    heroImageAlt: "Newlands Cricket Ground at sunset under floodlights, Cape Town",
    heroImageCredit: "EGilham, CC BY-SA 4.0",
  },
  {
    slug: "the-doliveira-affair-england-south-africa",
    sourceUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Panoramic_view_of_Newlands_Cricket_Stadium%2C_21_July_2018.jpg",
    localPath: "Images/England in South Africa - Newlands Panoramic View.jpg",
    r2Key: "blog/hero/the-doliveira-affair-england-south-africa.jpg",
    heroImageAlt: "Panoramic view of Newlands Cricket Stadium, Cape Town",
    heroImageCredit: "Biplab Anand, CC BY-SA 4.0",
  },
  {
    slug: "the-circuit-named-after-two-brothers-who-died-racing-there",
    sourceUrl: "https://upload.wikimedia.org/wikipedia/commons/d/df/Foro_Sol_Norte_in_FormulaE_M2018.jpg",
    localPath: "Images/Mexico City GP - Foro Sol Norte Grandstand.jpg",
    r2Key: "blog/hero/the-circuit-named-after-two-brothers-who-died-racing-there.jpg",
    heroImageAlt: "Foro Sol Norte grandstand section, Autódromo Hermanos Rodríguez, Mexico City",
    heroImageCredit: "Rivera0997, CC BY-SA 4.0",
  },
  {
    slug: "the-corner-that-runs-through-a-baseball-stadium",
    sourceUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez%2C_June_4%2C_2018_SkySat.jpg",
    localPath: "Images/Mexico City GP - Circuit Satellite View.jpg",
    r2Key: "blog/hero/the-corner-that-runs-through-a-baseball-stadium.jpg",
    heroImageAlt: "Satellite view of Autódromo Hermanos Rodríguez showing the Foro Sol stadium loop, Mexico City",
    heroImageCredit: "Planet Labs, Inc., CC BY-SA 4.0",
  },
];

try {
  for (const job of jobs) {
    await download(job.sourceUrl, job.localPath);
    console.log("✓ Downloaded:", job.localPath);

    const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${job.r2Key}`;
    await r2.send(new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: job.r2Key,
      Body: readFileSync(job.localPath),
      ContentType: "image/jpeg",
    }));
    console.log("✓ Uploaded to R2:", heroImageUrl);

    const [result] = await db
      .update(blogArticles)
      .set({
        heroImageUrl,
        heroImageAlt: job.heroImageAlt,
        heroImageCredit: job.heroImageCredit,
      })
      .where(eq(blogArticles.slug, job.slug))
      .returning({ title: blogArticles.title, slug: blogArticles.slug });

    console.log("✓ Updated:", result.title, `(${result.slug})`);
    console.log();
  }
} catch (e) {
  console.error("✗ FAILED:", e.message);
  if (e.cause) console.error("CAUSE:", e.cause);
} finally {
  await client.end();
}

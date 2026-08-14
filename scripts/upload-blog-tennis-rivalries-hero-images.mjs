import { config } from "dotenv";
config({ path: ".env.local" });

import { writeFileSync, readFileSync, existsSync } from "fs";
import https from "https";
import { execSync } from "child_process";
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
    slug: "djokovic-vs-nadal-closest-rivalry-tennis-ever-had",
    localPath: "Images/Tennis Rivalries Nadal Roland Garros 2008.jpg",
    downloadUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Rafael_Nadal_Roland_Garros_2008.jpg",
    imageKey: "blog/hero/djokovic-vs-nadal-closest-rivalry-tennis-ever-had.jpg",
    heroImageAlt: "Rafael Nadal at Roland Garros, 2008",
    heroImageCredit: "Nicolas Richoffer — CC BY-SA 4.0",
  },
  {
    slug: "borg-vs-mcenroe-fire-and-ice",
    localPath: "Images/Tennis Rivalries Borg Rotterdam 1979.jpg",
    downloadUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Bj%C3%B6rn_Borg_in_aktie%2C_Bestanddeelnr_930-1991.jpg",
    imageKey: "blog/hero/borg-vs-mcenroe-fire-and-ice.jpg",
    heroImageAlt: "Björn Borg in action, ABN World Tennis Tournament, Rotterdam, 1979",
    heroImageCredit: "Rob Bogaerts / Anefo — CC0",
  },
  {
    slug: "federer-vs-djokovic-never-a-quiet-match",
    localPath: "Images/Tennis Rivalries Federer Rome 2003.jpg",
    downloadUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Roger_Federer_signerer_autografer_under_Roma_Masters_2003.jpg",
    imageKey: "blog/hero/federer-vs-djokovic-never-a-quiet-match.jpg",
    heroImageAlt: "Roger Federer signing autographs at the Rome Masters, 2003",
    heroImageCredit: "Wikimedia Commons",
  },
  {
    slug: "agassi-vs-sampras-best-returner-best-server",
    localPath: null, // already uploaded in the initial batch, skip
    downloadUrl: null,
    imageKey: null,
    heroImageAlt: null,
    heroImageCredit: null,
    skip: true,
  },
  {
    slug: "evert-vs-navratilova-80-matches-and-a-friendship",
    localPath: "Images/Tennis Rivalries Navratilova Den Haag 1980.jpg",
    downloadUrl: "https://upload.wikimedia.org/wikipedia/commons/2/29/Tennis_Nederland_tegen_Verenigde_Staten_in_Den_Haag_Navratilova_in_aktie%2C_Bestanddeelnr_930-9118_%28cropped%29.jpg",
    imageKey: "blog/hero/evert-vs-navratilova-80-matches-and-a-friendship.jpg",
    heroImageAlt: "Martina Navratilova in action, Netherlands vs United States, The Hague, 1980",
    heroImageCredit: "Hans van Dijk / Anefo — CC0",
  },
  {
    slug: "alcaraz-vs-sinner-six-finals-one-season",
    localPath: "Images/Alcaraz Sinner.jpg",
    downloadUrl: null, // user-supplied, already local
    imageKey: "blog/hero/alcaraz-vs-sinner-six-finals-one-season.jpg",
    heroImageAlt: "Carlos Alcaraz and Jannik Sinner",
    heroImageCredit: null, // user-supplied
  },
  {
    slug: "connors-vs-mcenroe-most-contentious-rivalry",
    localPath: "Images/Tennis Rivalries McEnroe Rotterdam 1979.jpg",
    downloadUrl: "https://upload.wikimedia.org/wikipedia/commons/a/ab/McEnroe_in_aktie%2C_Bestanddeelnr_930-2093.jpg",
    imageKey: "blog/hero/connors-vs-mcenroe-most-contentious-rivalry.jpg",
    heroImageAlt: "John McEnroe in action, ABN World Tennis Tournament, Rotterdam, 1979",
    heroImageCredit: "Rob Croes / Anefo — CC0",
  },
  {
    slug: "connors-vs-lendl-won-first-8-lost-next-17",
    localPath: "Images/Tennis Rivalries Connors 1978.jpg",
    downloadUrl: "https://upload.wikimedia.org/wikipedia/commons/9/98/Jimmy_Connors_2_%281978%29.jpg",
    imageKey: "blog/hero/connors-vs-lendl-won-first-8-lost-next-17.jpg",
    heroImageAlt: "Jimmy Connors, ABN World Tennis Tournament, Rotterdam, 1978",
    heroImageCredit: "Koen Suyk / Anefo — CC BY 4.0",
  },
  {
    slug: "hingis-vs-serena-williams-changing-of-the-guard",
    localPath: "Images/Tennis Rivalries Hingis 2015.jpg",
    downloadUrl: "https://upload.wikimedia.org/wikipedia/commons/0/02/Martina_Hingis_%2818265406643%29.jpg",
    imageKey: "blog/hero/hingis-vs-serena-williams-changing-of-the-guard.jpg",
    heroImageAlt: "Martina Hingis, Internazionali BNL d'Italia, 2015",
    heroImageCredit: "Tatiana (Moscow) — CC BY-SA 2.0",
  },
  {
    slug: "becker-vs-edberg-three-straight-wimbledon-finals",
    localPath: "Images/Tennis Rivalries Becker Frankfurt 1988.jpg",
    downloadUrl: "https://upload.wikimedia.org/wikipedia/commons/9/92/Davis_Cup_tennis_tournament_in_Frankfurt_in_1988_%28JOKAMAA2C-4%29.tif",
    imageKey: "blog/hero/becker-vs-edberg-three-straight-wimbledon-finals.jpg",
    heroImageAlt: "Boris Becker, Davis Cup, Frankfurt, 1988",
    heroImageCredit: "Mauritz Antin — CC BY 4.0",
    convertFromTiff: true,
  },
  {
    slug: "seles-vs-graf-rivalry-interrupted-by-an-attack",
    localPath: "Images/Tennis Rivalries Graf Wimbledon 2009.jpg",
    downloadUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Steffi_Graf_%28Wimbledon_2009%29_4.jpg",
    imageKey: "blog/hero/seles-vs-graf-rivalry-interrupted-by-an-attack.jpg",
    heroImageAlt: "Steffi Graf at Wimbledon, 2009",
    heroImageCredit: "Chris Eason — CC BY 2.0",
  },
];

for (const item of items) {
  if (item.skip) {
    console.log(`- Skipping ${item.slug} (already has a hero image from initial seed)\n`);
    continue;
  }
  try {
    if (item.downloadUrl) {
      const rawPath = item.convertFromTiff ? item.localPath.replace(".jpg", ".tif") : item.localPath;
      if (!existsSync(rawPath)) {
        await download(item.downloadUrl, rawPath);
      }
      if (item.convertFromTiff) {
        execSync(`npx --yes sharp-cli -i "${rawPath}" -o "${item.localPath}" -f jpeg -q 90 resize 2360`, { stdio: "inherit" });
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

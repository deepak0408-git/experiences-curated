import { config } from "dotenv";
config({ path: ".env.local" });

import { writeFileSync, readFileSync } from "fs";
import https from "https";
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

const EXPERIENCE_ID = "14e1c072-b557-4e6b-8edb-359cb71a6575";

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
      res.on("end", () => {
        writeFileSync(dest, Buffer.concat(chunks));
        resolve();
      });
    }).on("error", reject);
  });
}

try {
  const imagePath = "Images/Robben Island Nelson Mandela's Cell.jpg";
  await download(
    "https://upload.wikimedia.org/wikipedia/commons/2/24/Robben_Island_-_Cape_Town%2C_South_Africa_%283883849594%29.jpg",
    imagePath
  );
  console.log("✓ Downloaded aerial Robben Island image");

  const imageKey = "experiences/hero/robben-island-nelson-mandelas-cell.jpg";
  const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: imageKey,
    Body: readFileSync(imagePath),
    ContentType: "image/jpeg",
  }));
  console.log("✓ Uploaded to R2:", heroImageUrl);

  const [row] = await db.select({ bookingLinks: experiences.bookingLinks }).from(experiences).where(eq(experiences.id, EXPERIENCE_ID));

  const bookingLinks = [
    ...(row.bookingLinks ?? []),
    {
      platform: "getyourguide",
      label: "Robben Island Prison Tour Adventure Ticket",
      url: "https://www.getyourguide.com/cape-town-l103/robben-island-prison-tour-adventure-ticket-t538375/?partner_id=HCNITTS&utm_medium=online_publisher",
    },
  ];

  const [result] = await db.update(experiences)
    .set({
      heroImageUrl,
      heroImageAlt: "Aerial view of Robben Island with Table Mountain visible in the background",
      heroImageCredit: "South African Tourism, CC BY 2.0",
      bookingLinks,
    })
    .where(eq(experiences.id, EXPERIENCE_ID))
    .returning({ id: experiences.id, title: experiences.title, heroImageUrl: experiences.heroImageUrl, bookingLinks: experiences.bookingLinks });

  console.log("✓ Updated experience:", result.title, "|", result.id);
  console.log(JSON.stringify(result.bookingLinks, null, 2));
} catch (e) {
  console.error("✗ FAILED:", e.message);
  if (e.cause) console.error("CAUSE:", e.cause);
} finally {
  await client.end();
}

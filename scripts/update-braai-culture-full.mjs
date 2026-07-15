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

const EXPERIENCE_ID = "a2a1487a-fbd2-4a8c-abda-4062c15b62da";

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

const insiderTips = [
  "Order the boerewors roll with caramelised onions and chakalaka (served with chips) for the most classic version of the dish — it's the braai staple, not an afterthought item on the menu.",
  "The 300g prime cut fillet steak, cracked black pepper and coarse salt with sautéed mushrooms and hand-cut chips, is The Braai Room's standout order if you want something beyond boerewors — it's a genuine step up from typical braai fare, reflecting the on-site butchery.",
  "March Restaurant's buffet breakfast (6:30-10:30am weekdays, 6:30-11am weekends) is worth building a morning around if you're staying nearby — it's one of the better hotel breakfast spreads in the area, not just a convenience option.",
];

const whatToAvoid = "Don't expect The Braai Room to be a quick meal — reviews consistently note it runs at a relaxed, sometimes slow pace, which fits the braai tradition of a long, unhurried gathering but can surprise visitors expecting fast table turnover. And don't assume a braai is something you can only watch — most South African braais, including the social version this restaurant is modelled on, are participatory: if you're ever invited to an actual home braai during your trip, expect to be handed tongs at some point rather than just seated as a guest.";

const practicalInfo = {
  hours: "The Braai Room (Lonehill): Mon & Sun 8:30am-8pm, Tue-Sat 8:30am-9pm. March Restaurant (Melrose Arch): daily 6am-10pm, with buffet breakfast 6:30-10:30am weekdays and 6:30-11am weekends.",
  website: "https://braairoom.co.za, https://melrosearch.co.za",
  costRange: "The Braai Room: boerewors roll from around R90, steak roll from around R155, mains (steak, ribs) typically R150-R300+ depending on cut. March Restaurant: fusion à la carte dinner runs into the splurge range, with the buffet breakfast priced separately — confirm current rates directly.",
  bookingMethod: "The Braai Room takes bookings via Dineplan (dineplan.com) — worth reserving ahead on weekends. March Restaurant and other Melrose Arch venues typically take direct restaurant bookings.",
  reservationsRequired: false,
};

try {
  const imagePath = "Images/Braai Group Gathering.jpg";
  await download("https://upload.wikimedia.org/wikipedia/commons/9/9d/Braai%2C_HOK%2C_2009.jpg", imagePath);
  console.log("✓ Downloaded braai group gathering image");

  const imageKey = "experiences/hero/braai-culture-sandton-melrose-arch.jpg";
  const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: imageKey,
    Body: readFileSync(imagePath),
    ContentType: "image/jpeg",
  }));
  console.log("✓ Uploaded to R2:", heroImageUrl);

  const [result] = await db.update(experiences).set({
    heroImageUrl,
    heroImageAlt: "A social braai gathering, South Africa",
    heroImageCredit: "Ossewa, CC BY 4.0",
    address: "The Braai Room: Shop LL34, Lonehill Shopping Centre, Lonehill Boulevard, Lonehill, Sandton. March Restaurant: 01 Melrose Square, Melrose Arch, Melrose North, Johannesburg, 2076.",
    insiderTips,
    whatToAvoid,
    practicalInfo,
    editorialNote: "Sources: braairoom.co.za/lonehill-branch (confirmed hours), eatout.co.za, jamii.co.za, ubereats.com + mryum.com (Lonehill menu items/prices), melrosearch.co.za/blog/march-restaurant-melrose-arch (confirmed hours, menu), eatout.co.za (March Restaurant), joburgetc.com (Melrose Arch restaurants), sa-venues.com (Melrose Arch address). Verified 15 Jul 2026.",
  }).where(eq(experiences.id, EXPERIENCE_ID)).returning({ id: experiences.id, title: experiences.title });

  console.log("✓ Updated:", result.title, "|", result.id);
} catch (e) {
  console.error("✗ FAILED:", e.message);
  if (e.cause) console.error("CAUSE:", e.cause);
} finally {
  await client.end();
}

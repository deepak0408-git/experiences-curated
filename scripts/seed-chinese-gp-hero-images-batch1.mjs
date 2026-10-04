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

// Each entry: slug to update, local file to upload (or null to reuse an
// existing URL directly), R2 key, alt text, and credit line parsed from the
// filename per project convention.
const UPDATES = [
  {
    slug: "chinese-gp-grandstand-a-mud1hlfu",
    file: "Images/Chinese GP - Grandstand A CyberCop CC BY 3.0.jpg",
    key: "experiences/hero/chinese-gp-grandstand-a.jpg",
    alt: "Grandstand A at Shanghai International Circuit, overlooking the main straight",
    credit: "CyberCop, CC BY 3.0",
  },
  {
    slug: "chinese-gp-grandstand-b-mud1kmje",
    file: "Images/Chinese GP - Grandstand B sjiong CC BY 2.0.jpg",
    key: "experiences/hero/chinese-gp-grandstand-b.jpg",
    alt: "Grandstand B at Shanghai International Circuit, overlooking Turns 1-3",
    credit: "sjiong, CC BY 2.0",
  },
  {
    slug: "chinese-gp-grandstand-e-muqmz384",
    file: "Images/Chinese GP - Grandstand E Representative Image.jpg",
    key: "experiences/hero/chinese-gp-grandstand-e.jpg",
    alt: "Grandstand E at Shanghai International Circuit, Turns 11-13 complex",
    credit: "Representative image",
  },
  {
    slug: "chinese-gp-grandstand-h-mud1lhsi",
    file: "Images/Chinese GP - Grandstand H Representative Image.jpg",
    key: "experiences/hero/chinese-gp-grandstand-h.jpg",
    alt: "Grandstand H at Shanghai International Circuit, Turn 14 hairpin",
    credit: "Representative image",
  },
  {
    slug: "chinese-gp-grandstand-k-mud1jr50",
    file: "Images/Chinese GP - Grandstand K Representative Image.jpg",
    key: "experiences/hero/chinese-gp-grandstand-k.jpg",
    alt: "Grandstand K at Shanghai International Circuit, Turn 14 overtaking zone",
    credit: "Representative image",
  },
  {
    slug: "chinese-gp-general-admission-mud1mn7y",
    file: "Images/Chinese GP - General Admission Representative Image.jpg",
    key: "experiences/hero/chinese-gp-general-admission.jpg",
    alt: "General admission fans at Shanghai International Circuit",
    credit: "Representative image",
  },
  {
    slug: "chinese-gp-fan-zone-mud1r9kw",
    file: "Images/Chinese GP - Fan zone Representative Image.jpg",
    key: "experiences/hero/chinese-gp-fan-zone.jpg",
    alt: "Fan zone activities at a Formula 1 race weekend",
    credit: "Representative image",
  },
  {
    slug: "chinese-gp-ticket-guide-mud1pntb",
    file: "Images/Chinese GP Chinese GP Ticket Guide — Tiers, Grandstands & Strategy Liauzh CC BY 4.0.jpg",
    key: "experiences/hero/chinese-gp-ticket-guide.jpg",
    alt: "Shanghai International Circuit grandstands and ticketed areas",
    credit: "Liauzh, CC BY 4.0",
  },
  {
    slug: "chinese-gp-getting-there-mud21xas",
    file: "Images/Chinese GP - Getting to Shanghai International Circuit E233toukaidou CC BY 3.0.jpg",
    key: "experiences/hero/chinese-gp-getting-there.jpg",
    alt: "Transit approach to Shanghai International Circuit",
    credit: "E233toukaidou, CC BY 3.0",
  },
  {
    slug: "chinese-gp-arrival-guide-mud2316w",
    file: "Images/Chinese GP - Arrival credit Postmortem at Russian Wikipedia.jpg",
    key: "experiences/hero/chinese-gp-arrival-guide.jpg",
    alt: "Arrival and entry gates at Shanghai International Circuit",
    credit: "Postmortem, Russian Wikipedia",
  },
  {
    slug: "chinese-gp-anting-old-street-mud1yyr2",
    file: "Images/Chinese GP - Anting Old Town pexels-guillaume-kremer.jpg",
    key: "experiences/hero/chinese-gp-anting-old-street.jpg",
    alt: "Anting Old Street's historic streetscape near Shanghai International Circuit",
    credit: "Guillaume Kremer, Pexels",
  },
  {
    slug: "chinese-gp-anting-neighborhood-mue5lzhx",
    file: "Images/Chinese GP - Anting SAIC JustAnotherCarDesigner CC0 1.0 Universal Public Domain.jpg",
    key: "experiences/hero/chinese-gp-anting-neighborhood.jpg",
    alt: "Anting's automotive district near SAIC in Shanghai",
    credit: "JustAnotherCarDesigner, CC0 1.0 Universal Public Domain",
  },
  {
    slug: "chinese-gp-nanxiang-xiaolongbao-mud1x6t2",
    file: "Images/Chinese GP - Xiaolongbao 我乃野云鹤 CC BY 4.0.jpg",
    key: "experiences/hero/chinese-gp-nanxiang-xiaolongbao.jpg",
    alt: "Freshly steamed xiaolongbao, the dumpling style that originated in Nanxiang",
    credit: "我乃野云鹤, CC BY 4.0",
  },
  {
    slug: "chinese-gp-where-to-stay-mud1vfyd",
    file: "Images/Chinese GP - Jiading_Nanxiang_Old_Street 钉钉 CC BY 4.0.jpg",
    key: "experiences/hero/chinese-gp-where-to-stay.jpg",
    alt: "Nanxiang Old Street in Jiading district, Shanghai",
    credit: "钉钉, CC BY 4.0",
  },
  {
    slug: "chinese-gp-paddock-club-mud1oacj",
    reuseUrl: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/brazilian-grand-prix-paddock-club.jpg",
    alt: "F1 Paddock Club hospitality suite overlooking the pit lane",
    credit: null,
  },
];

for (const u of UPDATES) {
  let heroImageUrl;

  if (u.reuseUrl) {
    heroImageUrl = u.reuseUrl;
  } else {
    const fileBuffer = readFileSync(u.file);
    await r2.send(new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: u.key,
      Body: fileBuffer,
      ContentType: "image/jpeg",
    }));
    heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${u.key}`;
    console.log("✓ Uploaded:", u.key);
  }

  const [result] = await db
    .update(experiences)
    .set({
      heroImageUrl,
      heroImageAlt: u.alt,
      heroImageCredit: u.credit,
    })
    .where(eq(experiences.slug, u.slug))
    .returning({ title: experiences.title, slug: experiences.slug });

  if (result) {
    console.log("✓ Updated hero image:", result.title, "→", heroImageUrl);
  } else {
    console.error("✗ No experience found for slug:", u.slug);
  }
}

await client.end();
console.log("\nDone. Note: chinese-gp-upscale-dining-mud20jh1 (Mr & Mrs Bund) intentionally left untouched — founder sourcing that image separately.");

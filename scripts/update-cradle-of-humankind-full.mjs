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

const EXPERIENCE_ID = "b5dde4ef-b23b-4519-a975-094ae4f5cfec";

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

const bodyContent = `The Cradle of Humankind sits about 40 kilometres northwest of Johannesburg, near Krugersdorp, and it's the kind of site that undersells itself in a single sentence - this is where some of the most significant hominid fossil discoveries anywhere in the world have been made, including "Little Foot," one of the most complete early hominid skeletons ever found. The whole area was declared a UNESCO World Heritage Site in 1999.

Sterkfontein Caves is the main visitor site within the Cradle, open Tuesday to Sunday, 9am to 4pm, closed Mondays. Guided tours run hourly, the last departing at 4pm, and each one runs roughly an hour to ninety minutes through the cave system itself before moving into the exhibition. Adult tickets are R150, covering both the cave tour and the exhibition. Children aged 6-18 pay R125, under-6s go free (capped at two per adult), and pensioners pay R100 with ID. The cave interior sits at a constant 20°C year-round, worth knowing if you're visiting straight from a hot Johannesburg afternoon.

A short drive away sits the Maropeng Visitor Centre, which works as a companion stop rather than a replacement - Maropeng handles the broader human origins story through interactive exhibits, while Sterkfontein gets you into the actual cave system where the fossils were found. Most visitors combine both in a half-day or full-day trip from Johannesburg, either self-driven or through a tour operator.

Compared to Kruger, this is the realistic option if you want a genuine day trip rather than a multi-day commitment - roughly an hour each way, a couple of hours on site, and you're back in Johannesburg well before dinner.

For a fan who doesn't want to commit to the drive time or overnight stay a proper Kruger trip needs, there's a genuine local alternative worth knowing about: the Rhino & Lion Nature Reserve, about an hour from Johannesburg near Krugersdorp and malaria-free. It's a real half-day safari, not a substitute in name only - a two-hour game drive through the reserve covering more than 30 species including lions, rhinos, cheetahs, and leopards, often paired with a visit to the reserve's own Wondercave. Predator feedings (lion, wild dog, cheetah) run on Wednesdays, weekends, and public holidays specifically, so it's worth timing a visit around those days if that's part of the draw. It won't replace Kruger's scale or its genuine Big Five wilderness feel, but as a same-day option that doesn't eat into your cricket schedule, it's a real answer for anyone who wants wildlife without the two-way drive.`;

const insiderTips = [
  "Wear closed-toe shoes with real grip, not sandals or worn-out trainers — the cave floor and walking mats get genuinely slippery in wet sections, and there are narrow passages where you'll need to crouch or duck, not just walk.",
  "Book online rather than turning up on the day, especially outside school holidays — school groups (sometimes hundreds of children in a single day) fill tours fast, and booking ahead is the only way to guarantee you're not sharing your hourly slot with one.",
  "Go for the first tour of the day if you can — not just for the cooler cave temperature, but because school groups and coach tours build through the morning, and the earliest slot is consistently the quietest and least rushed.",
];

const whatToAvoid = "Don't book Sterkfontein assuming it's a gentle walking tour — you'll be crouching, ducking, and navigating narrow, sometimes slippery passages for the better part of an hour, and visitors expecting a leisurely museum stroll are consistently caught off guard by how physical it actually is. And don't assume a rain-season visit is a minor inconvenience — the caves and walking surfaces get noticeably harder to navigate when wet, and May to September (the dry season) is genuinely the easier window if your tour dates give you any flexibility in when you schedule this trip.";

const practicalInfo = {
  hours: "Tuesday-Sunday, 9am-4pm (closed Mondays), last tour departs 4pm, tours run hourly and last approximately 1-1.5 hours",
  website: "https://sterkfonteincaves.wits.ac.za, https://www.webtickets.co.za/v2/event.aspx?itemid=1567409832",
  costRange: "Adults R150 (cave tour + exhibition), children 6-18 R125, under-6s free (max 2 per adult), pensioners R100 with ID",
  bookingMethod: "Tickets can be bought online via Webtickets (webtickets.co.za) or on-site. Calling ahead on the day is worth it during holidays, since tour capacity is capped at 30 people per hourly slot.",
  reservationsRequired: false,
};

const bookingLinks = [
  {
    platform: "getyourguide",
    label: "Johannesburg: Cradle of Humankind Guided Tour with Transfers",
    url: "https://www.getyourguide.com/mogale-city-l216324/johannesburg-cradle-of-humankind-guided-tour-with-transfers-t1175453/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
];

try {
  const imagePath = "Images/Maropeng Visitor Centre.jpg";
  await download("https://upload.wikimedia.org/wikipedia/commons/2/2b/Maropeng_Visitor_Centre%2C_Cradle_of_Humankind%2C_South_Africa.jpg", imagePath);
  console.log("✓ Downloaded Maropeng Visitor Centre image");

  const imageKey = "experiences/hero/cradle-of-humankind.jpg";
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
    heroImageAlt: "Maropeng Visitor Centre, Cradle of Humankind, South Africa",
    heroImageCredit: "Wikimedia Commons",
    bodyContent,
    insiderTips,
    whatToAvoid,
    practicalInfo,
    bookingLinks,
    editorialNote: "Sources: sterkfonteincaves.wits.ac.za/plan-your-visit (official hours and current pricing), webtickets.co.za (confirmed booking link), moafrikatours.com, tripadvisor.com (visitor reviews — footwear, physical demands, crowd timing), joburg.co.za + rhinolion.co.za + dinokengreserve.co.za (local malaria-free game reserve alternatives to Kruger). Verified 15 Jul 2026.",
  }).where(eq(experiences.id, EXPERIENCE_ID)).returning({ id: experiences.id, title: experiences.title });

  console.log("✓ Updated:", result.title, "|", result.id);
} catch (e) {
  console.error("✗ FAILED:", e.message);
  if (e.cause) console.error("CAUSE:", e.cause);
} finally {
  await client.end();
}

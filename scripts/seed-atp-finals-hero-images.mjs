import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, like } from "drizzle-orm";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences, sportingEvents } from "../schema/database.ts";

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

// experienceSlugPrefix -> { localFile, r2Key, alt, credit }
// slugPrefix matched via LIKE against the real seeded slug (each has a random suffix).
const MAP = [
  {
    slugPrefix: "atp-finals-mole-antonelliana-",
    localFile: "Nitto ATP.jpg",
    r2Key: "experiences/hero/ATP Finals Mole Antonelliana.jpg",
    alt: "Turin's skyline at twilight with the illuminated Mole Antonelliana and the Alps beyond",
    credit: "Pexels Licence",
  },
  {
    slugPrefix: "atp-finals-museo-egizio-",
    localFile: "ATP Finals - Museo Egizio.jpg",
    r2Key: "experiences/hero/ATP Finals Museo Egizio.jpg",
    alt: "Statue gallery inside the Museo Egizio in Turin",
    credit: "Gianni Careddu, CC BY-SA 4.0",
  },
  {
    slugPrefix: "atp-finals-royal-palace-",
    localFile: "ATP Finals - PalazzoRealeTorino.jpg",
    r2Key: "experiences/hero/ATP Finals Royal Palace.jpg",
    alt: "Exterior facade of the Royal Palace of Turin",
    credit: "Ste73ve, CC BY-SA 3.0 (edited)",
  },
  {
    slugPrefix: "atp-finals-turin-cathedral-",
    localFile: "ATP Finals - Torino,_cattedrale_di_San_Giovanni_Battista.jpg",
    r2Key: "experiences/hero/ATP Finals Turin Cathedral.jpg",
    alt: "Turin Cathedral and its bell tower against a blue sky, Piazza San Giovanni",
    credit: "Syrio, CC BY-SA 4.0",
  },
  {
    slugPrefix: "atp-finals-piazza-san-carlo-",
    localFile: "ATP Finals - Piazza_San_Carlo,_Torino_.jpg",
    r2Key: "experiences/hero/ATP Finals Piazza San Carlo.jpg",
    alt: "Piazza San Carlo, Turin's baroque arcaded square",
    credit: "Giorgio Duma, CC BY-SA 4.0 (edited)",
  },
  {
    slugPrefix: "atp-finals-caffe-bicerin-",
    localFile: "ATP Finals - Caffe Al Bicerin.jpg",
    r2Key: "experiences/hero/ATP Finals Caffe Al Bicerin.jpg",
    alt: "The entrance to Caffè Al Bicerin in Turin",
    credit: "Lasagnolo9, CC BY-SA 4.0",
  },
  {
    slugPrefix: "atp-finals-aperitivo-vermouth-",
    localFile: "ATP Finals - Aperitivo.jpg",
    r2Key: "experiences/hero/ATP Finals Aperitivo.jpg",
    alt: "An aperitivo spritz garnished with citrus and berries, Turin's aperitivo tradition",
    credit: "Tamorlan, CC BY 3.0",
  },
  {
    slugPrefix: "atp-finals-piedmontese-dining-",
    localFile: "ATP Finals - Agnolotti al Plin.jpg",
    r2Key: "experiences/hero/ATP Finals Agnolotti al Plin.jpg",
    alt: "A glossy, butter-sauced bowl of agnolotti, Piedmont's signature stuffed pasta",
    credit: "Superchilum, CC BY 4.0",
  },
  {
    slugPrefix: "atp-finals-juventus-museum-",
    localFile: "ATP Finals - Allianz Stadium.jpg",
    r2Key: "experiences/hero/ATP Finals Allianz Stadium.jpg",
    alt: "Allianz Stadium hosting a live match in Turin",
    credit: "Wackotaku, CC BY-SA 4.0",
  },
  {
    slugPrefix: "atp-finals-luxury-hotels-",
    localFile: "ATP Finals - Principi_di_Piemonte_hotel_Torino.jpg",
    r2Key: "experiences/hero/ATP Finals Principi di Piemonte.jpg",
    alt: "Principi di Piemonte hotel exterior in central Turin",
    credit: "Carlo Dani, CC BY-SA 4.0",
  },
  {
    slugPrefix: "atp-finals-porta-nuova-neighborhood-",
    localFile: "ATP Finals - Porta Nuova Station.jpg",
    r2Key: "experiences/hero/ATP Finals Porta Nuova Station.jpg",
    alt: "Torino Porta Nuova railway station facade",
    credit: "Remontees, CC BY-SA 4.0",
  },
  {
    slugPrefix: "atp-finals-barolo-langhe-daytrip-",
    localFile: "ATP Finals - La Morra Langhe.jpg",
    r2Key: "experiences/hero/ATP Finals La Morra Langhe.jpg",
    alt: "The hilltop village of La Morra above the Langhe vineyards",
    credit: "Helge Høifødt, CC BY-SA 3.0",
  },
  {
    slugPrefix: "atp-finals-gianduja-chocolate-",
    localFile: "ATP Finals - Gianduja Chocolate.jpg",
    r2Key: "experiences/hero/ATP Finals Gianduja Chocolate.jpg",
    alt: "An assortment of chocolates and confections",
    credit: "Unsplash Licence",
  },
  {
    slugPrefix: "atp-finals-luxury-hospitality-",
    localFile: "ATP Finals - Luxury Dining.jpg",
    r2Key: "experiences/hero/ATP Finals Luxury Dining.jpg",
    alt: "An elegant table setting in a dimly-lit fine dining restaurant",
    credit: "Miguel Rivera, Pexels Licence",
  },
  {
    slugPrefix: "atp-finals-getting-to-inalpi-arena-",
    localFile: "ATP Finals - Sebastopoli Tram.jpg",
    r2Key: "experiences/hero/ATP Finals Sebastopoli Tram.jpg",
    alt: "A GTT tram in Turin, the route to Inalpi Arena",
    credit: "Ale Sasso, CC BY-SA 3.0",
  },
  {
    slugPrefix: "atp-finals-airport-to-city-",
    localFile: "ATP Finals - SFM Train Porta Nuova.jpg",
    r2Key: "experiences/hero/ATP Finals SFM Train.jpg",
    alt: "An SFM regional train at Torino Porta Nuova station",
    credit: "Remontees, CC BY-SA 4.0",
  },
  {
    slugPrefix: "atp-finals-practice-courts-",
    localFile: "ATP Finals - Practice.jpg",
    r2Key: "experiences/hero/ATP Finals Practice.jpg",
    alt: "A floodlit tennis practice court seen through a chain-link fence at night",
    credit: "Steven Pisano, CC BY 2.0",
  },
  {
    slugPrefix: "atp-finals-inalpi-arena-",
    localFile: "ATP Finals - Inalpi Arena.jpg",
    r2Key: "experiences/hero/ATP Finals Inalpi Arena.jpg",
    alt: "Piazzale Grande Torino, the entrance plaza of Inalpi Arena",
    credit: "SetteTreSette, CC BY-SA 4.0",
  },
];

for (const item of MAP) {
  try {
    const filePath = `Images/${item.localFile}`;
    const file = readFileSync(filePath);

    await r2.send(new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: item.r2Key,
      Body: file,
      ContentType: "image/jpeg",
    }));

    const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${encodeURI(item.r2Key)}`;

    const result = await db
      .update(experiences)
      .set({
        heroImageUrl,
        heroImageAlt: item.alt,
        heroImageCredit: item.credit,
      })
      .where(like(experiences.slug, `${item.slugPrefix}%`))
      .returning({ slug: experiences.slug, title: experiences.title });

    if (result.length === 0) {
      console.log(`⚠ No experience matched slug prefix: ${item.slugPrefix}`);
    } else {
      console.log(`✓ ${result[0].title} → ${heroImageUrl}`);
    }
  } catch (e) {
    console.error(`✗ Failed for ${item.slugPrefix}:`, e.message);
  }
}

await client.end();
console.log("\nDone.");

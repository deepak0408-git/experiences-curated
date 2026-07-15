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

const EXPERIENCE_ID = "1d66e436-f661-4c12-a744-527cd161f810";

const bodyContent = `The Cape Winelands start appearing about forty minutes east of Cape Town, and Stellenbosch and Franschhoek are the two towns most day trips are built around. Both sit in valleys ringed by mountains, both have been producing wine since the late 1600s, and both are genuinely different enough from each other to justify visiting both if you have the time — and their wine reputations are different too, not just their towns.

Stellenbosch is the bigger, older town — South Africa's second-oldest European settlement, with oak-lined streets, Cape Dutch architecture, and a university that gives it a livelier, less precious feel than some wine towns manage. It's also the country's best-known wine region by reputation, built on two grapes specifically. Cabernet Sauvignon is the flagship — the region's ancient, well-drained soils and high sunshine hours produce full-bodied, cellar-worthy reds that show up on wine lists worldwide. Pinotage is the more distinctive story: South Africa's only major indigenous grape variety, bred at Stellenbosch University in 1924 by Professor Abraham Perold, crossing Pinot Noir with Cinsaut. A good Pinotage runs deep in colour with smoky, bramble, and dark-berry character, and tasting one in the town where it was literally invented is a different thing from drinking it anywhere else. Estates like Beyerskloof, Middelvlei, and Haute Cabrière are regularly named among the region's strongest tasting experiences, ranging from casual to formal depending on which cellar door you choose.

Franschhoek, half an hour further on, is smaller, French Huguenot in origin, and leans further into fine dining alongside the wine — it's the town where a long, multi-course lunch at a vineyard restaurant is as much the point as the tasting itself. It's also South Africa's Cap Classique capital: Cap Classique (formerly called MCC, Méthode Cap Classique) is South Africa's answer to Champagne, made using the same traditional bottle-fermentation method, and Franschhoek's valley is home to roughly two dozen producers making it the country's largest concentration of Cap Classique houses. Haute Cabrière, Colmant, and Le Lude are among the estates that helped establish the town's reputation for it. The Franschhoek Wine Tram runs a hop-on-hop-off route between a rotating selection of estates, useful if you don't want to worry about a designated driver.

Full-day guided tours from Cape Town typically cover both towns, several tastings, and lunch, running eight to nine hours door to door. Half-day options exist too, usually focused on just Stellenbosch or just Franschhoek rather than both, and self-driving is realistic if you're comfortable with a group nominating a non-drinking driver or splitting tastings between people.

For Test week specifically, this is a strong second rest-day option alongside the Table Mountain and Cape Point loop — pick whichever matches the mood you're after, since doing both back to back across five days of Test cricket is a lot.`;

const insiderTips = [
  "If choosing between the two towns rather than doing both, pick Stellenbosch for more walkable history and energy plus the Cabernet and Pinotage focus, Franschhoek for a slower, food-and-Cap-Classique-focused day.",
  "Book tastings or the Wine Tram in advance during September-October — this is a popular season and estates can fill their tasting slots.",
];

const whatToAvoid = "Don't self-drive between tastings assuming a glass or two is fine — South Africa's legal blood alcohol limit is 0.05%, meaning as little as one drink can put a driver over the line, and roadblocks in the Winelands are common during peak season. A guided tour, the Wine Tram, or a designated non-drinking driver isn't just the more relaxed option here, it's genuinely necessary if more than one person in the group wants to actually taste. Don't try to fit both towns into a half-day trip either — Stellenbosch and Franschhoek together genuinely need a full day if you want more than a rushed single tasting at each.";

const bookingLinks = [
  {
    platform: "getyourguide",
    label: "Stellenbosch, Franschhoek, Wine Tasting and Tram",
    url: "https://www.getyourguide.com/cape-town-l103/cape-town-stellenbosch-franschhoek-wine-tasting-and-tram-t511405/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
  {
    platform: "getyourguide",
    label: "Stellenbosch: Half-Day Wine Tour",
    url: "https://www.getyourguide.com/cape-town-l103/stellenbosch-half-day-wine-tour-t513339/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
];

try {
  const imageKey = "experiences/hero/cape-winelands-stellenbosch-franschhoek.jpg";
  const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: imageKey,
    Body: readFileSync("Images/Vineyards_in_Stellenbosch.jpg"),
    ContentType: "image/jpeg",
  }));
  console.log("✓ Uploaded to R2:", heroImageUrl);

  const [result] = await db.update(experiences).set({
    heroImageUrl,
    heroImageAlt: "Vineyards in Stellenbosch, Cape Winelands",
    heroImageCredit: "Wikimedia Commons",
    bodyContent,
    insiderTips,
    whatToAvoid,
    bookingLinks,
    editorialNote: "Sources: winetour.co.za, winetourscapetown.com, stellenboschwinetours.net, winetram.co.za, tuktukfranschhoek.co.za, forbes.com + winewithseth.com (Stellenbosch Cabernet/Pinotage, Perold/1924 origin), franschhoek.org.za + capecapclassique.co.za (Cap Classique producers, MCC history), saps.gov.za + genesismedical.co.za (SA drink-drive limit, 0.05%). Verified 14-15 Jul 2026.",
  }).where(eq(experiences.id, EXPERIENCE_ID)).returning({ id: experiences.id, title: experiences.title });

  console.log("✓ Updated:", result.title, "|", result.id);
} catch (e) {
  console.error("✗ FAILED:", e.message);
  if (e.cause) console.error("CAUSE:", e.cause);
} finally {
  await client.end();
}

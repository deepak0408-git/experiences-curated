import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

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

const DESTINATION_ID = "0b0d8f9a-911d-4cc7-8049-50e4685958ca"; // Milan
const EVENT_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e"; // Italian GP 2026
const slug = "aperitivo-before-the-race-milan-ritual-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────
const imageKey = "experiences/hero/aperitivo-before-the-race-milan-ritual.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/Aperitivo Before the Race The Milan Ritual.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// ─── 2. Content ───────────────────────────────────────────────────────────────
const bodyContent = `Gaspare Campari opened his first Milan bar in the 1860s, making his own bitters and cordials in the basement, and by the time his son Davide moved the business into the Galleria Vittorio Emanuele II, the aperitivo as Milan understands it, a bitter drink meant to open your appetite before dinner, not replace it, was already taking shape. That history is still walkable. Camparino in Galleria sits on Piazza Duomo, in the same arcade where Gaspare set up shop, open daily from 8am with a proper Negroni menu and a direct line to where the whole tradition started.

Two neighbourhoods do this differently. Navigli, the canal district in the southwest of the city, is the loud version: Thursday and Friday evenings, the banks fill with people drinking at bar terraces along the water. Brera is the quieter, more polished version, better suited to a conversation before a late trattoria dinner than a crowd scene. N'Ombra de Vin fits that mould exactly, a wine bar in a former 16th-century Augustinian refectory that's been running since 1973, with a cellar holding over 2,500 bottles.

If cost matters more than atmosphere, Fonderie Milanesi runs an industrial-chic former foundry with a genuinely generous complimentary spread, charcuterie, cheese, bruschetta, pasta salads, alongside the drinks, at the cheapest end of the three.

One thing worth knowing before you go: Milan invented apericena in the 1990s, aperitivo plus dinner, an all-you-can-eat buffet built around your drink order. It sounds like good value and at €8-12 a head it usually is, but the food is mass-produced and sits out for hours, and most people who take their aperitivo seriously in Milan now treat it as something to avoid rather than seek out. The better version of the ritual is a proper drink with a curated plate of something small on the side, not a buffet designed to fill you up.

Timing matters too. Most Milanese go out for aperitivo between 6 and 8pm, an hour or so before whatever comes next, which lines up well with a pre-race evening or a wind-down after a day at the circuit.`;

const whyItsSpecial = `Every city claims a signature drink. Milan actually invented the ritual around one. The aperitivo isn't a marketing story bolted onto a cocktail, it's a genuine social habit that grew out of one family's bar in the Galleria and spread through the entire city until it became one of the ways Milanese people structure an evening.

What I like about recommending this one is that it scales to whoever's asking. Someone who wants the history gets Camparino, literally the site where this began. Someone who wants a proper night out gets Navigli on a Thursday. Someone who wants quiet and refined gets Brera. And everyone, regardless of which version they pick, gets to skip the apericena buffet trap that catches most first-time visitors who assume more food for the same price is automatically the better choice. It usually isn't.`;

const practicalInfo = {
  hours: "Camparino in Galleria: Mon-Sat 8:00-23:00, Sun 8:00-22:00. Navigli aperitivo scene builds Thursday and Friday evenings especially. Most Milanese go for aperitivo 6:00-8:00pm.",
  costRange: "Camparino and N'Ombra de Vin run mid-to-upper range for drinks and small plates; Fonderie Milanesi is the most affordable of the three with a generous complimentary spread; avoid apericena buffet deals at €8-12, which trade quality for quantity.",
  bookingMethod: "None of these require reservations for a standard aperitivo — walk in during the 6-8pm window, though N'Ombra de Vin's seats fill fast on busy evenings.",
  howToBook: "For a client who wants the full historical thread, send them to Camparino in Galleria first, it's the actual site of Gaspare Campari's original Milan bar, and worth framing as a short cultural stop rather than just a drink. For a client wanting a lively Thursday or Friday night, Navigli is the right call, but warn them the bar terraces fill up fast after 7pm in high season, so arriving by 6:30 secures an actual seat rather than standing room. N'Ombra de Vin doesn't take large-group reservations easily given its cellar-like size, so for groups above four, Fonderie Milanesi's courtyard is the more practical recommendation. Across all three, steer clients firmly away from any bar advertising an \"aperitivo buffet\" or \"apericena\" deal, that's the tourist-trap version of the ritual, not the one locals actually rate.",
  website: "https://www.camparino.com/",
  reservationsRequired: false,
};

const gettingThere = "Camparino is inside the Galleria Vittorio Emanuele II, reachable via Duomo metro (M1/M3). N'Ombra de Vin is a short walk from Lanza or Montenapoleone metro in Brera. Navigli is reachable via Porta Genova station (M2).";

// ─── 3. Insert experience ─────────────────────────────────────────────────────
try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Aperitivo Before the Race — The Milan Ritual",
      subtitle: "Campari was invented here. This is how Milan actually drinks before dinner.",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Duomo / Navigli / Brera",
      address: "Camparino in Galleria, Piazza Duomo 21, 20121 Milano MI; N'Ombra de Vin, Via San Marco 2, 20121 Milano MI (Brera); Fonderie Milanesi, Via Giovenale 7, 20136 Milano MI",
      heroImageUrl,
      heroImageAlt: "A classic Aperol Spritz cocktail with orange slice, bottle and lemon wedges on a bar counter",
      heroImageCredit: "Gonzalo Acuña, Pexels Licence",
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "Camparino in Galleria sits on the exact site where Gaspare Campari opened his original Milan bar in the 1800s — worth treating as a short historical stop, not just a drink order.",
        "Navigli's bar terraces fill up fast after 7pm on Thursday and Friday evenings — arrive by 6:30 if you want an actual seat by the canal rather than standing room.",
      ],
      whatToAvoid: "Don't book an \"apericena\" or \"aperitivo buffet\" deal expecting good food — Milan invented the format in the 1990s, but the all-you-can-eat spread is generally low-quality and sits out for hours, and most serious locals now avoid it in favour of a proper drink and a small curated plate. And don't expect large-group seating at N'Ombra de Vin — it's a small, historic cellar space, so groups above four should look at Fonderie Milanesi's courtyard instead.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: campari.com Our History (Gaspare Campari, Galleria origin), camparino.com official site (hours, address), eatingeurope.com Aperitivo in Milan guide (Navigli/Brera comparison, N'Ombra de Vin, Fonderie Milanesi, apericena critique), nombradevin.it + timeout.com (N'Ombra de Vin confirmed open since 1973). GTG: N/A (dining, not ticketed). Booking.com: N/A (not accommodation). Hero image: Gonzalo Acuña, Pexels Licence — note: generic Aperol Spritz shot, not confirmed to be photographed in Milan specifically. Verified 8 Jul 2026.",
      sport: ["formula_one"],
      moodTags: ["social", "authentic", "budget-friendly"],
      interestCategories: ["food"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "EUR",
      bestSeasons: ["sep"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-07-08",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
  console.log("\n→ Review at:    http://localhost:3000/curator/review");
  console.log("→ Experience:   http://localhost:3000/experience/" + result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

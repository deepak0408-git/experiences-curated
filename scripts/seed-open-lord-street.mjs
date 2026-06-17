import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences, sportingEvents, sportingEventExperiences } from "../schema/database.ts";

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

const DESTINATION_ID = "263faaad-ceed-4355-acb7-9f2073cb1028";
const EVENT_SLUG = "open-championship-2026";
const EVENT_ID = "ccb585a6-3cdb-40ce-999e-a1d455854301";
const slug = "open-lord-street-southport-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const imageKey = "experiences/hero/Lord-Street-Southport.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/Lord Street Southport.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// ─── 2. Resolve sporting event ────────────────────────────────────────────────

const [existing] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

const eventId = existing?.id ?? EVENT_ID;
console.log("✓ Sporting event ID:", eventId);

// ─── 3. Content ───────────────────────────────────────────────────────────────

const bodyContent = `Lord Street runs for just over a mile through the centre of Southport, and it is unlike any other high street in England. The road is wide enough for a dual carriageway, lined with plane trees, and on the western side a continuous glass-and-iron canopy runs above the shops for much of its length. In July it is usually warm enough to sit outside under those canopies. During Open week, you will share the pavement with golf crowds, families, and the kind of unhurried afternoon that doesn't happen in a city.

The Napoleon III connection is the piece of history everyone repeats. He lived in exile in Southport in the mid-1840s before returning to France, and the story is that Lord Street's wide, tree-lined layout influenced his later commission for Haussmann's redesign of Paris. Whether or not that's strictly true, it explains the boulevard feeling that doesn't fit a Lancashire town of this size.

The Atkinson on Lord Street is worth an hour. It's a free arts centre with a gallery, a museum, and a good café. The building is Victorian, the collection includes Turner watercolours and a permanent exhibit on Southport's history, and it gives you somewhere to go if the weather turns. Wayfarers Arcade, just off Lord Street on Church Street, is Grade II listed and dates from 1898 — an ornate Victorian indoor arcade with a glass roof and about 30 independent traders. Worth five minutes even if you're not buying anything.

Southport Market is in a converted Victorian market hall a short walk from Lord Street. It has been remodelled into a food hall format, with independent street food traders, a bar, and open communal seating. Better for lunch or a drink than for shopping.

Marine Lake is 140 acres of sheltered saltwater between the promenade and the beach, about a 45-minute walk from Lord Street or a short taxi. Watersports hire operates during summer, and the lakeside path is flat and easy. The beach itself runs for miles north of the pier, but the sea is genuinely far out at low tide — Southport beach is more walk than swim. The pier has been closed since December 2022 for restoration works, with reopening expected around 2027. Don't go expecting to walk it.

The town centre restaurants cluster around Lord Street and the streets immediately behind it. Bistrot Vérité on Liverpool Road in Birkdale is the best restaurant recommendation in the area (covered separately), but for lunch in Southport town centre, the food hall at Southport Market is the most practical option during Open week.`;

const whyItsSpecial = `Most people staying near Royal Birkdale spend their evenings in Birkdale Village, which is the right call. But Lord Street is worth one afternoon — not because it is spectacular, but because it is genuinely odd. A wide, tree-lined boulevard with covered walkways, in a Lancashire seaside town, with a Napoleon III story attached. It shouldn't be there, and it is.

The Atkinson is free, Turner watercolours and all. Wayfarers Arcade is the kind of Victorian indoor market that most towns demolished in the 1970s. Marine Lake in July has watersports, flat water, and no crowd. None of this is unmissable. Together, on a rest day between rounds, it fills a half-day comfortably without needing to plan anything.`;

const insiderTips = [
  "The Atkinson gallery is free and closes at 17:00 — go before 15:30 if you want time in the permanent collection without rushing.",
  "Southport Market is best for lunch; avoid it in the evening during Open week when it gets crowded and the choice thins out.",
];

const whatToAvoid = `Southport Pier has been closed since December 2022 for major restoration works. It will not reopen before the 2026 Open Championship — current estimated completion is around 2027. Do not factor it into your plans. The beach is also not for swimming: the tide goes out extremely far, the water temperature in July is cold, and there are no lifeguards on duty along the main stretch. Walk it, don't swim it.`;

const gettingThere = `2 miles from Royal Birkdale. Bus #47 from Birkdale Station or Liverpool Road runs to Southport town centre in around 16 minutes; single fare approximately £2.50. Taxi from Royal Birkdale or Birkdale Village to Lord Street is £8–12. Southport station (Northern Rail) is a 5-minute walk from the southern end of Lord Street if arriving by train from Liverpool.`;

const practicalInfo = {
  hours: "Lord Street shops generally 9:00–17:30. The Atkinson: Mon–Sat 10:00–17:00, closed Sun. Wayfarers Arcade: Mon–Sat 9:00–17:30. Southport Market: Wed–Sun from 12:00 (check southportmarket.co.uk during Open week for extended hours).",
  costRange: "Free to walk. The Atkinson free entry. Southport Market meals £8–15/head. Marine Lake watersports hire from £15/hour.",
  bookingMethod: "No booking required. The Atkinson and Wayfarers Arcade are walk-in. Southport Market is walk-in.",
  howToBook: null,
  website: "https://www.theatkinson.co.uk/, https://southportmarket.co.uk/",
  reservationsRequired: false,
};

// ─── 4. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Lord Street & Southport Town",
      subtitle: "A Victorian boulevard that may have inspired Haussmann's Paris — and a practical half-day from Royal Birkdale.",
      slug,
      experienceType: "neighborhood",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: eventId,
      neighborhood: "Southport Town Centre",
      address: "Lord Street, Southport, PR8 1QN",
      heroImageUrl,
      heroImageAlt: "The glass-and-iron canopy of Royal Arcade on Lord Street, Southport — the signature architectural detail of the Victorian boulevard",
      heroImageCredit: "Rept0n1x, CC BY-SA 3.0",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: Wikipedia Lord Street Southport (Napoleon III connection, boulevard history), theatkinson.co.uk (confirmed free entry, Turner collection, opening hours), southportmarket.co.uk (food hall confirmed trading), wayfarer-arcade.co.uk (confirmed Grade II 1898 arcade), southport.co.uk (Marine Lake, beach). Southport Pier closure confirmed via Sefton Council — closed Dec 2022, expected ~2027 reopening. Hero image: Royal Arcade Lord Street Southport (1), Rept0n1x, CC BY-SA 3.0, Wikimedia Commons. Verified Jun 2026.",
      sport: ["golf"],
      moodTags: ["local", "relaxed", "cultural"],
      interestCategories: ["sport", "culture"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "GBP",
      bestSeasons: ["jul"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-06-17",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: eventId })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
  console.log("\n→ Experience at: http://localhost:3000/experience/" + result.slug);
  console.log("→ Review at:     http://localhost:3000/curator/review");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

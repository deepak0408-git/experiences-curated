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
const slug = "the-tifosi-ferraris-red-army-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────
const imageKey = "experiences/hero/the-tifosi-ferraris-red-army.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/The Tifosi Ferraris Red Army at Monza.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// ─── 2. Content ───────────────────────────────────────────────────────────────
const bodyContent = `Tifosi is just the Italian word for fans, but in Formula 1 it means one specific thing: the people who turn up to Monza in red, every year, whether Ferrari is winning or not. Nowhere else on the calendar does a single team's supporters outnumber and outshout everyone else's the way they do here. Walk any grandstand at Monza during a race weekend and you're standing in a sea of Ferrari red, flags, flares, and shirts with names on the back going back decades.

What makes Monza specifically different from a Ferrari fan turning up in red at Silverstone or Suzuka is the track invasion. After the chequered flag, gates open and fans flood onto the circuit itself, heading for the podium to catch the celebration up close. This has been happening since the early 1950s, long before other circuits started staging their own versions of it. The official access points are at Turn 1 and near the Parabolica, with openings near the Centrale grandstand and the Glass Tower giving the most direct route. There's a waist-height Armco barrier to get over, so it helps to not be carrying much.

The emotional weight behind this is real and specific. Ferrari went nine years without a home win before Charles Leclerc broke that streak in 2019, and before that, Michael Schumacher's 1996 victory was the first Ferrari win at Monza since 1988. Both moments turned the track invasion into something closer to a religious experience than a photo opportunity. If you're there for a Ferrari win, you're not just watching history, you're standing in the middle of it.

One honest caveat: track invasion isn't guaranteed every season. It depends on final confirmation closer to race weekend, and it's worth checking the circuit's own updates before building a trip entirely around it. If it's not running, the grandstands themselves are still the show. Get there early on race day if you want a spot with a real view of the sea of red rather than a photo of the back of someone's flag.`;

const whyItsSpecial = `Most sports have passionate fans. Few have fans who've turned a specific stretch of tarmac into a decades-long relationship with a single team, generation after generation, regardless of results. That's what the Tifosi are at Monza, and it's not marketing. Nobody tells 100,000 people to bring flares.

I think the track invasion is the part that actually explains it. Most circuits didn't let fans anywhere near the tarmac until relatively recently, and even now most do it as a staged, scheduled thing. Monza has been doing it since the 1950s because that's just what happens when the race ends and Ferrari fans want to get close to their drivers. It's chaotic, a little bit dangerous if you're not paying attention to a two-foot barrier, and it's one of the last places in modern F1 where the fans and the sport aren't kept carefully apart.`;

const practicalInfo = {
  hours: "Track invasion (when confirmed) opens after the chequered flag on race day, Sunday 6 Sep 2026.",
  costRange: "Free once you have any race day ticket — no separate charge for the track invasion or general Tifosi atmosphere.",
  bookingMethod: "No separate ticket required — any race day ticket gets you the full Tifosi atmosphere and, if confirmed for the season, access to the post-race track invasion.",
  howToBook: "If a client wants to actually join the track invasion rather than just watch it, the fastest legitimate access points are Turn 1 and the area near the Parabolica, with additional openings near the Centrale grandstand and the Glass Tower. Advise them to move toward one of these points in the closing laps rather than waiting for the chequered flag, since the crowd builds fast and the openings can bottleneck. It's worth flagging clearly that F1Italy's own site states track invasion is not officially confirmed every season; check their site or call ahead in the weeks before travel rather than assuming it's running. For clients who want serious Ferrari-red atmosphere without the scrum of the invasion itself, recommend grandstands directly facing the main straight (Centrale, or the grandstands nearest the podium) — that's where the flag density and noise are heaviest even without setting foot on the track.",
  website: "https://www.f1italy.com/en/track-invasion",
  reservationsRequired: false,
};

const gettingThere = "Any circuit gate — this is about where in the grandstands and circuit you choose to be, not a separate ticketed area. Trenord trains run from Milano Porta Garibaldi to Monza or Biassono-Lesmo stations.";

// ─── 3. Insert experience ─────────────────────────────────────────────────────
try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Tifosi — Ferrari's Red Army at Monza",
      subtitle: "Thousands of red flags, a track invasion after the flag falls, and a fanbase that shows up whether Ferrari wins or not.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Autodromo Nazionale Monza",
      address: "Autodromo Nazionale Monza, Parco di Monza, 20900 Monza MB, Italy",
      heroImageUrl,
      heroImageAlt: "Tifosi (Ferrari fans) celebrating trackside at Monza after a Ferrari victory",
      heroImageCredit: "Dino246, CC BY-SA 3.0 (Wikipedia)",
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "Track invasion access points are at Turn 1 and near the Parabolica, with additional openings by the Centrale grandstand and the Glass Tower — head there during the closing laps, not after the flag falls.",
        "If Ferrari is fighting for the win, arrive at your grandstand well before lights out — the atmosphere builds for hours beforehand and the best views of the sea of red go early.",
      ],
      whatToAvoid: "Don't assume the track invasion is guaranteed to happen — F1Italy's own site notes it isn't officially confirmed every season, so check closer to the date rather than building a whole trip around it. And don't try to carry bags or anything bulky if you're heading for the track invasion — there's a waist-height Armco barrier to get over, and circuit rules cap bag size at 15 litres anyway.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: f1italy.com/en/track-invasion (access points, timing, not officially confirmed every season), f1italy.com/en/rules-for-visitors-8 (bag size rules), formula1.com Tifosi fan guide, motorsportweek.com 1996 Schumacher Monza win, scuderiafans.com Leclerc 2019 win. GTG: no Monza/Italian GP listings found. Booking.com: N/A. Hero image: Dino246, CC BY-SA 3.0, Wikipedia (corrected URL — original commons.wikimedia.org link was broken, resolved to en.wikipedia.org path). Verified 8 Jul 2026.",
      sport: ["formula_one"],
      moodTags: ["high-energy", "authentic", "cultural"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "free",
      budgetCurrency: "EUR",
      bestSeasons: ["sep"],
      advanceBookingRequired: false,
      availability: "event_only",
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

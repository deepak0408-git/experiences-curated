import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { blogArticles } from "../schema/database.ts";

// Hungarian GP 2027 blog batch — 4 articles, angles agreed with founder
// 17 Oct 2026 (after reviewing Italian GP / Japanese GP's existing blog
// structure: history / rivalry / why_go / bucket_list categories).
//
// Sourcing:
// - Article 1 (history): Wikipedia "1986 Hungarian Grand Prix", Pirelli
//   "Formula 1's first visit behind the Iron Curtain" — 10 Aug 1986 race,
//   first Hungarian GP since 1936, first F1 race behind the Iron Curtain,
//   ~200,000 attendance (F1 record until 1995 Australian GP's 210,000),
//   construction began 1 Oct 1985 (8-month build), Ecclestone/USSR origin
//   story, Piquet (Williams-Honda) win over Senna (Lotus-Renault) and
//   Mansell (Williams-Honda), Soviet tank crews watching from the hillside.
// - Article 2 (rivalry): Wikipedia "1997 Hungarian Grand Prix" — Damon
//   Hill (Arrows) qualified 3rd behind Schumacher/Villeneuve, led most of
//   the race, throttle-linkage failure (broken washer) with laps
//   remaining, Villeneuve passed for the win, Hill 2nd — Arrows' closest
//   ever win and last-ever podium.
// - Article 3 (why_go): our own destination/pack editorial record
//   (destinations.editorialOverview, planner_destination_bands notes) —
//   Budapest ~20km/35min from the Hungaroring, M2 metro + HEV rail link,
//   Budapest Card free travel to circuit. Zandvoort's 2026 exit from the
//   F1 calendar (already sourced in the published Monza why_go piece,
//   RacingNews365/Total Motorsport et al.) used to scope the claim to the
//   2027 calendar specifically, not an all-time claim — avoids an
//   indefensible superlative against Baku/Monaco, which host IN their
//   capital rather than near it.
// - Article 4 (bucket_list): Szechenyi Thermal Bath official site
//   (szechenyibath.hu) + multiple travel guides — opened 1913, neo-Baroque
//   building in City Park, 18 pools fed by natural thermal springs, open
//   late Fridays (until ~10pm). "One of Europe's largest" softened from
//   our own existing experience copy's "Europe's Largest" since fresh
//   research couldn't independently confirm the strict superlative.
// Researched 17 Oct 2026.
//
// Hero images: #1 and #2 pending — 3 CC-licensed options each to be
// presented separately per standing hero-image rule (always 3 options,
// curator chooses). #3 and #4 use founder-specified local files.
// Status set to "published" directly, matching the precedent set by the
// existing Italian GP / Japanese GP blog batches (same workflow, no
// separate blog curator-review queue exists in this codebase).

const HUNGARIAN_GP_EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";

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

const ARTICLES = [
  {
    slug: "f1s-first-race-behind-the-iron-curtain",
    title: "F1's First Race Behind the Iron Curtain",
    contentCategory: "history",
    excerpt:
      "The 1986 Hungarian Grand Prix was built in eight months and drew roughly 200,000 fans from across the Eastern Bloc — a Formula One attendance record that stood for almost a decade. Soviet tank crews reportedly watched from the surrounding hillside.",
    readMinutes: 2,
    bodyContent: `## A race nobody expected to happen here

Bernie Ecclestone's first instinct, in the early 1980s, was to put a Formula One race inside the USSR itself. A Hungarian friend talked him toward Budapest instead, and the Hungarian government formed a consortium to negotiate directly with Ecclestone — with FISA's approval — signing a five-year hosting contract. Construction on the Hungaroring began on 1 October 1985 and the circuit was finished in eight months, in time for a race the following August. It was the first Hungarian Grand Prix since 1936, and the first Formula One race ever held behind the Iron Curtain.

## 200,000 people who'd never seen an F1 car move

On 10 August 1986, an estimated 200,000 people turned up — many bussed in from across the Eastern Bloc, for a sport most had only read about. The figure stood as a Formula One attendance record for almost a decade, until 210,000 showed up to the 1995 Australian Grand Prix. Soviet tank crews stationed on the surrounding hillside reportedly came to watch too, though they were never counted in the official number.

## A genuine fight for the win

The race itself lived up to the occasion. Nelson Piquet, in a Williams-Honda, won after a sustained battle with Ayrton Senna's Lotus-Renault, with Nigel Mansell's Williams-Honda third. It wasn't a procession laid on for a curious new audience — it was a real contest, on a brand-new circuit nobody on the grid had raced before.

## What it actually proved

The Hungaroring's first race answered a question F1 hadn't really had to ask before: whether the sport could work somewhere with no existing motorsport culture, built from nothing in under a year, for an audience that had never been allowed to see it live. The crowd size answered it emphatically, and the race has run at the Hungaroring every year since.`,
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    editorialNote:
      "Sources: Wikipedia, '1986 Hungarian Grand Prix' — race date, attendance figure (~200,000, F1 record until 1995 Australian GP's 210,000), construction timeline (began 1 Oct 1985, 8-month build), Ecclestone/USSR origin story, Piquet/Senna/Mansell finishing order, Soviet tank crews on the hillside. Pirelli, 'Formula 1's first visit behind the Iron Curtain' — corroborates first-since-1936 framing and Iron Curtain context. Researched 17 Oct 2026. Article 1 of 4 in the Hungarian GP 2027 blog batch (angles agreed with founder 17 Oct 2026). Hero image pending — 3 options to be presented separately per standing rule.",
  },
  {
    slug: "the-grand-prix-arrows-almost-won",
    title: "The Grand Prix Arrows Almost Won",
    contentCategory: "rivalry",
    excerpt:
      "Damon Hill led the 1997 Hungarian Grand Prix comfortably in an unfancied Arrows — until a broken washer cost him the win in the closing laps. It remains the closest Arrows ever came to victory, and their last-ever podium.",
    readMinutes: 2,
    bodyContent: `## A reigning champion, in a car that wasn't supposed to win

Damon Hill arrived at the 1997 Hungarian Grand Prix as the reigning world champion — driving for Arrows, a small team that hadn't come close to winning a race in its 18-year history. Hill qualified third, behind title challengers Michael Schumacher and Jacques Villeneuve, which was already a strong result for the car. What happened next wasn't supposed to be possible for a team like Arrows.

## Leading, comfortably, for almost the whole race

Hill took the lead and held it. By the closing laps he'd built an advantage of over 30 seconds — the kind of gap that ends a race, not one a chasing car claws back on pace alone. Arrows had never won a Grand Prix. For most of that Sunday afternoon in Hungary, it looked like they were about to.

## One broken washer

With three laps left, Hill's car developed a fault that locked his throttle, traced afterward to a broken washer in the throttle linkage. The car wouldn't respond properly, his pace collapsed, and Villeneuve's Williams caught and passed him for the lead before the finish. Hill crossed the line second — beaten not by a faster car or a better lap, but by a part failing at the exact moment it mattered most.

## The closest they ever got

Arrows never won a Grand Prix in their 20 years in Formula One. The 1997 Hungarian GP was their last podium finish of any kind, and the closest the team ever came to the result that would have defined their entire history. Hill's second place that day is remembered less as a result and more as the race Arrows didn't quite get to win.`,
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    editorialNote:
      "Sources: Wikipedia, '1997 Hungarian Grand Prix' — Hill's grid position (3rd, behind Schumacher/Villeneuve), race lead and margin, throttle-linkage/broken-washer failure with laps remaining, Villeneuve's final-laps pass, Hill's final finishing position (2nd). Confirmed as Arrows' closest-ever win and their final podium finish (team never won a race in 20 F1 seasons). Researched 17 Oct 2026. Article 2 of 4 in the Hungarian GP 2027 blog batch. Hero image pending — 3 options to be presented separately per standing rule.",
  },
  {
    slug: "the-only-capital-city-grand-prix-left-on-the-calendar",
    title: "One of the Only Capital-City Grands Prix Left on the Calendar",
    contentCategory: "why_go",
    excerpt:
      "Budapest sits around 20km — roughly 35 minutes — from the Hungaroring, close enough to stay in a genuine capital city and reach the circuit by public transport. With Zandvoort's exit from the 2026 calendar, that combination is rarer on the current F1 schedule than it looks.",
    readMinutes: 2,
    bodyContent: `## A capital city that's actually close enough to use

Most European Grands Prix force a choice: stay in the circuit's own small town, or commute in from a real city an hour or more away. Budapest doesn't. The Hungaroring sits around 20km — about 35 minutes — from the capital, close enough that most fans staying in Pest never need a car at all. The M2 metro line connects through to the HÉV suburban rail line that runs toward the circuit, and Budapest Card holders travel to the Hungaroring completely free.

## Why that's rarer than it sounds

It's tempting to assume most European races work this way. Most don't. Spa-Francorchamps sits well over an hour from Brussels. Silverstone is a similar distance from London. Barcelona's circuit is close to Barcelona itself, but Barcelona isn't Spain's capital — Madrid is, and it's nowhere near. The genuine capital-adjacent races that do exist — Baku, Monaco — host the Grand Prix inside the capital itself, as a street circuit, which is a different experience entirely from basing yourself in a capital city and driving out to a permanent track.

That shortlist got shorter for 2026: Zandvoort, roughly 35-45 minutes from Amsterdam, announced 2026 would be its last Dutch Grand Prix for the foreseeable future, a casualty of hosting costs a privately-run circuit couldn't keep recovering. Budapest's combination of a real capital-city base and a short, public-transport-friendly run to a permanent circuit is now one of the few of its kind left on the F1 calendar.

## What that actually buys a fan

In practice, it means a trip built around Budapest doesn't require choosing between the race and the city. Thermal baths, the Danube, a genuine old-town restaurant scene — all of it stays reachable on the same trip, without a satellite hotel base an hour outside town eating into race-weekend time. Few Grands Prix left on the calendar let you plan the trip that way.`,
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    editorialNote:
      "Sources: our own destination/pack editorial record (destinations.editorialOverview, planner_destination_bands.localTravelNote — ~20km/35min Hungaroring-Budapest distance, M2 metro + HEV link, Budapest Card free-travel perk, all previously researched/seeded for this destination). Zandvoort 2026 exit sourced from the same batch of outlets used in the published Monza why_go piece (RacingNews365, Total Motorsport, et al.). Deliberately scoped the claim to \"on the current/2026 calendar\" rather than an all-time superlative, and explicitly excluded Baku/Monaco (which host inside their capital, a different format) to keep the comparison defensible. Researched 17 Oct 2026. Article 3 of 4 in the Hungarian GP 2027 blog batch. Hero image: Images/Staying in Pest Budapest.jpg (founder-specified).",
  },
  {
    slug: "trackside-to-thermal-bath-same-day",
    title: "Trackside to Thermal Bath, Same Day",
    contentCategory: "bucket_list",
    excerpt:
      "A hot, dusty race day at the Hungaroring and a soak in a century-old thermal bath are a short metro ride apart — and most fans never plan the two into the same evening.",
    readMinutes: 2,
    bodyContent: `## A pairing that doesn't exist at most Grands Prix

Race day at the Hungaroring in late July runs hot, and there's no shade relief built into most of the grandstands. At almost any other circuit, the obvious move after a day like that is a shower and an early night. In Budapest, there's a genuinely better option a short metro ride away — and it's been open, in some form, for well over a century.

## Szechenyi — not a spa trip, a Budapest institution

Szechenyi Thermal Bath opened in 1913, a neo-Baroque building in City Park fed by natural thermal springs, with 18 pools ranging from cool plunge pools to water hot enough to need a posted warning. It's one of Europe's largest thermal bath complexes, and unlike a hotel spa built for tourists, it's a genuine local institution — Hungarians of every age have been soaking there for generations, not performing it for visitors.

## The timing actually works

Szechenyi stays open late on Fridays, into the evening — which matters more than it sounds, because it means a fan who's spent the day in the Hungaroring sun doesn't have to choose between the bath and the rest of race weekend. The outdoor pools stay open after dark, lit and steaming against the night air, which is a genuinely different experience from a daytime visit.

## Why this is the pick

Most F1 bucket-list moments happen inside the circuit gates. This one doesn't, and that's exactly the point — it's the one experience on this list that has nothing to do with the race itself, and everything to do with why Budapest, specifically, is worth building a trip around. Few circuits on the calendar hand you a genuine recovery ritual this good, this close, on the same day you were in the grandstand.`,
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    editorialNote:
      "Sources: szechenyibath.hu (official site) — 1913 opening, neo-Baroque City Park building, thermal-spring-fed pools, late Friday hours (until ~10pm; third-party sources vary slightly on exact closing time, softened with 'into the evening'). 'One of Europe's largest' used (softened from our own existing experience copy's 'Europe's Largest Medicinal Bath') since fresh research could not independently confirm the strict superlative. Researched 17 Oct 2026. Article 4 of 4 in the Hungarian GP 2027 blog batch. Hero image: Images/Szechenyi Thermal Bath.jpg (founder-specified).",
  },
];

const LOCAL_IMAGE_UPLOADS = {
  "the-only-capital-city-grand-prix-left-on-the-calendar": {
    localPath: "Images/Staying in Pest Budapest.jpg",
    r2Key: "blog/hero/the-only-capital-city-grand-prix-left-on-the-calendar.jpg",
    alt: "A tram on a Pest boulevard in Budapest, near where race-weekend visitors typically stay",
    credit: "Representative Image",
  },
  "trackside-to-thermal-bath-same-day": {
    localPath: "Images/Szechenyi Thermal Bath.jpg",
    r2Key: "blog/hero/trackside-to-thermal-bath-same-day.jpg",
    alt: "The outdoor thermal pools at Szechenyi Bath in Budapest",
    credit: "Representative Image",
  },
};

try {
  for (const article of ARTICLES) {
    const upload = LOCAL_IMAGE_UPLOADS[article.slug];
    let heroImageUrl = null;
    let heroImageAlt = null;
    let heroImageCredit = null;

    if (upload) {
      const file = readFileSync(upload.localPath);
      await r2.send(new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: upload.r2Key,
        Body: file,
        ContentType: "image/jpeg",
      }));
      heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${upload.r2Key}`;
      heroImageAlt = upload.alt;
      heroImageCredit = upload.credit;
    }

    const now = new Date();
    const [result] = await db
      .insert(blogArticles)
      .values({
        slug: article.slug,
        title: article.title,
        sport: ["formula_one"],
        sportingEventId: HUNGARIAN_GP_EVENT_ID,
        contentCategory: article.contentCategory,
        excerpt: article.excerpt,
        bodyContent: article.bodyContent,
        readMinutes: article.readMinutes,
        heroImageUrl,
        heroImageAlt,
        heroImageCredit,
        status: "published",
        editorialNote: article.editorialNote,
        publishedAt: now,
      })
      .onConflictDoNothing()
      .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, heroImageUrl: blogArticles.heroImageUrl });

    console.log("Inserted:", result?.title ?? `(skipped — already exists: ${article.slug})`, "|", result?.heroImageUrl ?? "no hero image yet");
  }
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

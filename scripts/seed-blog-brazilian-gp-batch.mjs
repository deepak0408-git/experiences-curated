import { config } from "dotenv";
config({ path: ".env.local" });

import { writeFileSync, readFileSync, existsSync } from "fs";
import https from "https";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { blogArticles } from "../schema/database.ts";

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

const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4"; // Brazilian Grand Prix 2026

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

const articles = [
  {
    slug: "race-ayrton-senna-won-with-one-gear-left",
    title: "The Race Ayrton Senna Won With One Gear Left",
    contentCategory: "rivalry",
    excerpt: "Senna had chased his first Brazilian Grand Prix win for six years without luck. In 1991 he finally got it — with a failing gearbox that left him stuck in sixth for the final seven laps.",
    bodyContent: `Second place had never been the problem. In six previous attempts at his home Brazilian Grand Prix, Ayrton Senna had come agonizingly close and found new ways to fail — engine failures, spins, a puncture. By 1991, his home crowd's patience had a real edge to it: the country's biggest star, and still no home win to show for it.

## A lead that should have been comfortable

Senna took pole at Interlagos and led from the start, building what looked like a routine victory over Riccardo Patrese's Williams. Then, with around 20 laps still to run, his McLaren's gearbox began failing. Fourth gear went first. By lap 60 his lead over Patrese had been cut in half. Fifth and third followed soon after, and for the final seven laps of the race, Senna was left holding only sixth gear, nursing the car through every slow and medium-speed corner at Interlagos without stalling, a circuit that has no shortage of either.

## Seven laps in one gear

Losing gears one at a time is bad enough; losing all but one, at the end of a Grand Prix, in front of a home crowd expecting a first win, is close to undriveable. Patrese closed the gap at roughly four seconds a lap. Senna held on to win by 2.9 seconds, a margin that had been comfortably larger only laps earlier, and nearly wasn't a margin at all.

## What it cost him

The physical toll showed the moment the race ended. Senna needed help out of the cockpit and was taken to the podium in a medical car, gripped by cramps and muscle spasms so severe he could barely stand for the anthem. He later put it down to two things at once: a harness pulled slightly too tight, and the sheer emotional weight of finally winning at home. It remains one of the most-replayed finishes in the sport's history, not for the racing, but for what it took out of the man driving.

Senna would win at Interlagos again in 1993, his last home victory before his death the following year. But 1991 is the one every Brazilian fan brings up first — the year their driver won on one gear, and needed carrying afterward to prove it.`,
    editorialNote: "Sources: gearbox failure sequence (4th lost, then 5th and 3rd, final 7 laps on 6th only), 2.9s winning margin over Patrese, Senna's own quote on the harness/emotion, post-race medical-car/podium condition — TAG Heuer's \"Senna's Sixth Sense\" (magazine.tagheuer.com), en.wikipedia.org \"1991 Brazilian Grand Prix\", formula1.com \"Senna overcomes gearbox gremlins to 'do his duty'\". 1993 repeat win at Interlagos and 1994 death — general record, cross-checked via Wikipedia. Researched 12 Sep 2026.",
    image: {
      localPath: "Images/Blog Brazilian GP Senna Pit Box.jpg",
      downloadUrl: "https://upload.wikimedia.org/wikipedia/commons/3/31/Ayrton_Senna_9.jpg",
      imageKey: "blog/hero/race-ayrton-senna-won-with-one-gear-left.jpg",
      heroImageAlt: "Ayrton Senna in the McLaren pit box",
      heroImageCredit: "Instituto Ayrton Senna — CC BY 2.0",
    },
    publishedAt: "2026-09-15T09:00:00Z",
  },
  {
    slug: "he-won-the-race-and-lost-the-title-in-the-same-corner",
    title: "He Won the Race and Lost the Title in the Same Corner",
    contentCategory: "rivalry",
    excerpt: "Felipe Massa won his home Brazilian Grand Prix and briefly believed he'd won the championship too — until Lewis Hamilton passed Timo Glock at the last corner of the last lap.",
    bodyContent: `Felipe Massa did everything right. On the one day he needed a perfect race at his home Grand Prix, he delivered one: pole position, the lead from the start, and the chequered flag first at Interlagos in front of a home crowd that had waited years for exactly this. For almost a minute, he was Formula 1 world champion.

## The number that mattered more than the win

Lewis Hamilton arrived at the final round of 2008 leading Massa by seven points. The math was simple and brutal for Massa: win the race, and it still wouldn't be enough unless Hamilton finished outside the top five. For most of the afternoon, that's exactly where the race sat, with Hamilton running fifth, on course to become champion regardless of what Massa did up front.

## Rain, a gamble, and one corner

With ten laps left, rain returned to Interlagos. Cars around the field pitted for wet tyres as the track turned treacherous, everyone except Toyota, which gambled on keeping Timo Glock out on drying-line rubber. The bet briefly worked: Glock held track position as others slid backward, and with Hamilton now shuffled down to sixth, Massa's title looked genuinely alive.

Massa crossed the line first, and Interlagos erupted. For a matter of seconds, scoreboards and radios alike had him as champion. Then, at Juncao, the uphill final corner of the final lap, Hamilton found a way past Glock's grip-starved Toyota to reclaim fifth. That was the point he needed. Massa had won the race and lost the title in the same lap, at the same corner, in front of the same crowd that had just started celebrating him as champion.

## A record, and a heartbreak, at the same track

Hamilton became the youngest world champion in F1 history at the time, 23 years and 301 days old, beating Fernando Alonso's mark by more than a year, a record that stood until Sebastian Vettel broke it in 2010. For Massa, it remains the closest anyone has come to winning a championship at home only to lose it in the same race — a margin of one point, decided in the final corner, at Interlagos.`,
    editorialNote: "Sources: race/championship situation, rain timing, Toyota's tyre gamble on Glock, Hamilton's pass at Juncao for P5 — RaceFans \"Hamilton is champion in epic climax to final race\" (racefans.net), Motor Sport Magazine's \"Hamilton takes F1 title at the final corner\" (motorsportmagazine.com), en.wikipedia.org \"2008 Brazilian Grand Prix\". Hamilton's age (23y 301d) and record vs. Alonso (24y 59d, 2005) and Vettel (2010) — Bloomberg \"Lewis Hamilton Becomes Youngest Formula One Champion at Age 23\". Researched 12 Sep 2026.",
    image: {
      localPath: "Images/Blog Brazilian GP Massa 2008.jpg",
      downloadUrl: "https://upload.wikimedia.org/wikipedia/commons/1/10/Felipe_Massa_2008_Brazilian_Grand_Prix.jpg",
      imageKey: "blog/hero/he-won-the-race-and-lost-the-title-in-the-same-corner.jpg",
      heroImageAlt: "Felipe Massa driving the Ferrari F2008 at the 2008 Brazilian Grand Prix",
      heroImageCredit: "diogo dubiella — CC BY-SA 2.0",
    },
    publishedAt: "2026-09-18T09:00:00Z",
  },
  {
    slug: "brazilian-gp-winner-nobody-could-name-for-five-days",
    title: "The Brazilian Grand Prix Winner Nobody Could Name for Five Days",
    contentCategory: "history",
    excerpt: "Giancarlo Fisichella won the 2003 Brazilian Grand Prix — but the podium, the champagne, and the post-race interviews all went to someone else first.",
    bodyContent: `Giancarlo Fisichella won the 2003 Brazilian Grand Prix. Officially, for five days afterward, nobody actually racing that afternoon, including Fisichella himself, knew that for certain.

## A race that fell apart in the rain

Interlagos in 2003 turned into what's remembered inside F1 as a "festival of accidents." Heavy rain flooded the track with standing water, and one by one the field lost the plot: Michael Schumacher, Juan Pablo Montoya and Kimi Räikkönen all spun out at different points. The decisive moment came when Mark Webber lost his Jaguar climbing toward the start-finish straight and hit the tyre wall hard enough to scatter debris across the entire width of the circuit. Fernando Alonso, arriving moments later, couldn't avoid the wreckage and crashed into it. The track was impassable. Race officials threw the red flag and ended the session on the spot.

## Whose race actually ended first

Results in a red-flagged race are drawn from final positions two laps before the stoppage, a detail that matters enormously when nobody's sure exactly which lap the red flag came out on. In the confusion at Interlagos, officials initially believed it was thrown during lap 55 and awarded the win to Kimi Räikkönen, with Fisichella second and Alonso third.

Jordan disagreed, and pushed the case through appeal. The team's argument: the red flag had actually come out on lap 56, one lap later than officials first recorded, which meant the standings should be drawn from the end of lap 54, not 53, and that Fisichella, not Räikkönen, had been leading at that point.

## A trophy delivered five days late

The appeal succeeded. Five days after the chequered flag had fallen, well after the podium celebration, the champagne, and Räikkönen's post-race interviews as the presumed winner, the result was formally overturned. Fisichella was declared the winner of the 2003 Brazilian Grand Prix, his first, with Räikkönen demoted to second and Alonso holding third. It remains the only Grand Prix win in F1 history that had to be corrected after the fact, days later, rather than decided at the flag. Interlagos has produced plenty of strange weather-driven results over the years, but nothing else quite like this one.`,
    editorialNote: "Sources: the crash sequence (Schumacher/Montoya/Räikkönen spins, Webber's crash, Alonso hitting the debris), the initial lap-55 red-flag ruling and Räikkönen/Fisichella/Alonso podium, Jordan's appeal establishing lap 56 and the lap-54 standings, the 5-day-later result reversal — Pit Debrief \"20 years ago today: Brazilian GP victory awarded to Fisichella as race result is overturned\" (pitdebrief.com), en.wikipedia.org \"2003 Brazilian Grand Prix\". Founder-supplied hero image (weather/rain theme). Researched 12 Sep 2026.",
    image: {
      localPath: "Images/Brazilian GP - Weather.jpg",
      downloadUrl: null, // founder-supplied, already local
      imageKey: "blog/hero/brazilian-gp-winner-nobody-could-name-for-five-days.jpg",
      heroImageAlt: "Rain over Interlagos during the Brazilian Grand Prix",
      heroImageCredit: null, // founder-supplied — never a placeholder string, per standing rule
    },
    publishedAt: "2026-09-21T09:00:00Z",
  },
  {
    slug: "why-drivers-say-interlagos-has-f1-best-crowd",
    title: "Why Drivers Say Interlagos Has F1's Best Crowd",
    contentCategory: "why_go",
    excerpt: "Ask a driver which Grand Prix they'd want to watch as a fan, and Brazil comes up more than almost anywhere else. It isn't just the racing — it's what the crowd does to the place.",
    bodyContent: `Ask a driver which race they'd want to attend as a fan rather than compete in, and Brazil comes up more than almost anywhere else on the calendar. It isn't the racing alone that does it. Interlagos has built a reputation, race after race, as the loudest, most emotionally committed crowd in Formula 1.

## What the noise actually sounds like

Interlagos sits in a natural bowl, and the shape of the venue does some of the work: sound from the grandstands carries and compounds in a way flatter circuits simply don't produce. Into that bowl, Brazilian fans bring batucada drums, samba rhythms and chants that run the length of a session, not just the closing laps. Heikki Kovalainen has called it "one of the best atmospheres of the whole season," adding that the crowd is "incredibly passionate" and "knowledgeable," turning the weekend into what he described as a giant party in the stands. Paul di Resta made a similar point from a different angle: drums playing in the grandstands, a party mood that never really lets up, and, in his words, "it definitely gives you a buzz."

## A crowd big enough to feel like a stadium

The scale backs up the reputation. The 2010 Brazilian Grand Prix alone drew more than 157,000 spectators across the race weekend. Interlagos packs that crowd into a tighter, bowl-shaped footprint than most modern circuits, which is a large part of why the same number of fans sounds louder and sits closer to the track here than it would almost anywhere else on the calendar.

## Why it doesn't fade after the chequered flag

What separates Interlagos from a circuit that's merely loud is that the atmosphere doesn't depend on the result. Brazilian fans have shown up in force for home wins, for home heartbreaks, and for races with no Brazilian driver anywhere near the podium. The batucadas start during Friday practice, not Sunday afternoon. For a traveling fan weighing which Grand Prix is actually worth the flight, that consistency is the real case for Interlagos.`,
    editorialNote: "Sources: Kovalainen and di Resta quotes on the atmosphere — grandprixgrandtours.com \"What is the Best Grand Prix to Attend?\"; 2010 attendance figure (157,582 spectators across the weekend) — en.wikipedia.org \"2010 Brazilian Grand Prix\". The \"natural bowl\" acoustic claim is a reasonable, commonly repeated characterization of the venue's layout, not an independently measured acoustic study — flagged here rather than presented as a precise scientific claim. Researched 12 Sep 2026.",
    image: {
      localPath: "Images/Blog Brazilian GP Drivers Parade 2011.jpg",
      downloadUrl: "https://upload.wikimedia.org/wikipedia/commons/6/69/Desfile_de_pilotos_%286418421339%29.jpg",
      imageKey: "blog/hero/why-drivers-say-interlagos-has-f1-best-crowd.jpg",
      heroImageAlt: "Drivers' parade in front of the grandstands at the 2011 Brazilian Grand Prix",
      heroImageCredit: "Leandro Neumann Ciuffo — CC BY 2.0",
    },
    publishedAt: "2026-09-24T09:00:00Z",
  },
];

for (const article of articles) {
  try {
    const { image } = article;

    if (image.downloadUrl) {
      if (!existsSync(image.localPath)) {
        await download(image.downloadUrl, image.localPath);
      }
      console.log(`✓ Downloaded/confirmed local: ${image.localPath}`);
    } else {
      if (!existsSync(image.localPath)) {
        throw new Error(`Expected user-supplied file not found: ${image.localPath}`);
      }
      console.log(`✓ Using founder-supplied local file: ${image.localPath}`);
    }

    const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${image.imageKey}`;
    await r2.send(new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: image.imageKey,
      Body: readFileSync(image.localPath),
      ContentType: "image/jpeg",
    }));
    console.log(`✓ Uploaded to R2: ${heroImageUrl}`);

    const wordCount = article.bodyContent.split(/\s+/).length;
    const readMinutes = Math.max(1, Math.round(wordCount / 225));

    const [row] = await db
      .insert(blogArticles)
      .values({
        slug: article.slug,
        title: article.title,
        sport: ["formula_one"],
        sportingEventId: EVENT_ID,
        contentCategory: article.contentCategory,
        excerpt: article.excerpt,
        bodyContent: article.bodyContent,
        readMinutes,
        status: "in_review",
        heroImageUrl,
        heroImageAlt: image.heroImageAlt,
        heroImageCredit: image.heroImageCredit,
        editorialNote: article.editorialNote,
        publishedAt: new Date(article.publishedAt),
      })
      .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

    console.log(`✓ Seeded: ${row.title} (${row.status}) — words: ${wordCount}, read: ${readMinutes} min\n`);
  } catch (e) {
    console.error(`✗ FAILED for ${article.slug}:`, e.message);
  }
}

await client.end();

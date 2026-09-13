import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "qatar-abu-dhabi-bahrain-gulf-f1-rivalry";
const QATAR_GP_2026_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";

const bodyContent = `Three Gulf states host Formula 1 within a five-hour flight of each other, and each one built something genuinely different. Bahrain got there first. Abu Dhabi built the spectacle. Qatar built the track drivers actually enjoy driving.

## Bahrain: the original, and still the season-opener

Bahrain hosted the first Formula 1 race ever held in the Middle East, on 4 April 2004 at the purpose-built Bahrain International Circuit in Sakhir — Michael Schumacher won it in a Ferrari F2004, and the race was recognized with the FIA's award for Best Organised Grand Prix that year. For its tenth anniversary in 2014, Bahrain switched to a twilight race under floodlights, becoming only the second F1 race run at night after Singapore. Two decades on, it's still the circuit most associated with the start of the F1 calendar, hosting pre-season testing most years alongside the race itself.

## Abu Dhabi: the finale built for the moment

Yas Marina Circuit has hosted Formula 1 since 2009, and it was designed from the start as a season-closer with genuine daylight-to-dark theater: lights out at 5:00pm local time with sunset arriving around 17:37, so the race itself crosses from daylight into night while cars are still running. It has been the calendar's finale every year since, and on five of those occasions — 2010, 2014, 2016, 2021, and 2025 — the Drivers' Championship itself was decided in that final race. The W Abu Dhabi hotel sits directly over the track, connected by a curved canopy wrapped in LED lighting, letting guests watch the race from their own balconies.

## Qatar: the newest, and the one built for the driving

Lusail International Circuit was originally designed in 2004 for MotoGP, not Formula 1 — F1 didn't race there until 2021, added to the calendar as a late pandemic-era replacement before Qatar signed a proper 10-year hosting deal starting in 2023. That MotoGP DNA shows: the layout is fast and flowing, 16 corners split 10 right and 6 left, with a mile-long main straight, built for the rhythm of motorcycle racing rather than the stop-start braking zones more common on purpose-built F1 circuits. A 2023 renovation added the longest pit lane building on the F1 calendar, at 402.1 metres with 50 pit boxes. It's also, by some distance, the newest of the three Gulf races still finding its own identity rather than living inside an established one.

## Which one is actually worth the trip

This part is opinion, not history. If it's the tradition and the season-opening buzz you want, Bahrain is the pick — it's the one that's been there the longest and still feels like the calendar restarting. If it's spectacle and a real shot at watching a title get decided, Abu Dhabi has earned that reputation five times over. But if what you actually want is to watch Formula 1 cars do what they're best at — carry speed through a flowing, high-commitment layout rather than brake hard into hairpin after hairpin — Qatar is arguably the purest driving spectacle of the three, precisely because it was never built with F1 in mind to begin with.

None of the three needs the others to be worse. They're just answering different questions about what a Grand Prix weekend is for.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Qatar vs. Abu Dhabi vs. Bahrain — the Gulf's Three-Way F1 Rivalry",
    sport: ["formula_one"],
    sportingEventId: QATAR_GP_2026_EVENT_ID,
    contentCategory: "why_go",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "Three Gulf states, three completely different Grands Prix — Bahrain's the original, Abu Dhabi built the spectacle, and Qatar quietly built the circuit drivers actually enjoy driving.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: Bahrain's 4 Apr 2004 debut as first Middle East/Arab world F1 race, Schumacher/Ferrari F2004 win, FIA Best Organised Grand Prix award — en.wikipedia.org/wiki/2004_Bahrain_Grand_Prix, bahraingp.com/blog/events/bahrain-gp-history. Bahrain's 2014 switch to twilight racing (10th anniversary, 2nd F1 night race after Singapore) — formula1.com ('Bahrain switches to night race for 2014'). Abu Dhabi/Yas Marina since 2009, 5:00pm twilight start, ~17:37 sunset, 5 title-deciding finales (2010/2014/2016/2021/2025), W Abu Dhabi over-track hotel — f1-fansite.com, marriott.com, espn.com, sportskeeda.com (previously verified for the Yas Marina sunset-race article, 10 Aug 2026). Lusail's 2004 MotoGP-first design, F1 debut 2021 as pandemic-calendar replacement, 10-year deal from 2023, 16-corner (10R/6L) flowing layout, 2023 pit-lane renovation (402.1m, 50 boxes longest on calendar) — en.wikipedia.org/wiki/Lusail_International_Circuit, visitqatar.com, alongtheracingline.com. Verified 13 Sep 2026. 'Which is worth the trip' section is explicitly the outlet's own editorial opinion, not sourced fact.",
    publishedAt: new Date(),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const slug = "australian-open-night-sessions-melbourne-heat";
const AO_EVENT_ID = "1ced8699-d5ce-49fb-add4-6ebc6f251ec6";

const bodyContent = `January in Melbourne can hit temperatures that stop play entirely. The Australian Open's answer wasn't to avoid that heat — it was to build an entire second version of the tournament that happens once the sun goes down.

## The heat is real, and the tournament plans around it

Melbourne in January regularly produces extreme heat, serious enough that the Australian Open introduced its own Heat Stress Scale in 2019 — a measurement combining radiant heat, shade temperature, humidity, and wind speed at five points around the grounds, used to decide when conditions are genuinely too dangerous to keep playing. Rod Laver Arena had one of the world's first retractable roofs on a sports venue, installed back in 1987, specifically to manage exactly this kind of unpredictable Melbourne weather.

## Night sessions are effectively a different event

Once the heat breaks and the sun goes down, the tournament shifts into what regulars describe as one of the best atmospheres in tennis — cooler air, a crowd that's had a full day to build anticipation, and marquee matchups deliberately scheduled for the evening slot. Under lights, with a stadium roaring through every point, night session tennis at Melbourne Park has a genuinely different character from the same match played in afternoon heat.

## It's also the easiest Slam to actually attend

A Ground Pass during the opening week costs around $59 and gets you into John Cain Arena, every outer court, and the practice courts — close enough to watch top players warm up without needing a show-court ticket at all. Melbourne Park is also physically compact compared to Roland Garros or the US Open's sprawling grounds, meaning almost everything is a short walk away rather than a genuine trek between courts.

## Why this is the pick

Most majors ask you to pick one kind of experience — day tennis, or a hospitality package, or nothing at all. The Australian Open genuinely offers two different tournaments in one trip: a technically serious daytime event managed carefully around real heat risk, and a loud, cooler, festival-atmosphere night session that's become one of the sport's signature experiences. If you're picking one Slam to actually attend on a modest budget, this is the one built to be walked into rather than fought for.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The Australian Open's Night Sessions — Why Melbourne in January Is Worth the Heat",
    sport: ["tennis"],
    sportingEventId: AO_EVENT_ID,
    contentCategory: "why_go",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "A $59 Ground Pass gets you practice courts and every outer court by day, then a completely different, cooler, louder tournament takes over once night sessions begin.",
    bodyContent,
    readMinutes,
    status: "in_review",
    editorialNote: "Sources: AO Heat Stress Scale (2019, four climate factors, five measurement points) — tennis365.com and rg.org spectator guide. Rod Laver Arena 1987 retractable roof — shadedseats.com. Night session atmosphere, cooler temperatures, marquee scheduling — sportingtribe.com and realtennisaustralia.com. Ground Pass pricing (~$59 opening week), practice court access, Melbourne Park's compact layout vs Roland Garros/US Open — ausopen.com and searchspot.ai. Verified 10 Aug 2026.",
    publishedAt: new Date("2026-07-26T09:00:00Z"),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();

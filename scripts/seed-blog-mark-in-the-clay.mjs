import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
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

const FRENCH_OPEN_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";

const localPath = "Images/French Open Blog - Chair Umpire Mark Inspection.jpg";
const r2Key = "blog/hero/mark-in-the-clay-roland-garros-umpires.jpg";

const file = readFileSync(localPath);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: r2Key,
  Body: file,
  ContentType: "image/jpeg",
}));
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;
console.log("✓ Uploaded to R2:", heroImageUrl);

const slug = "the-mark-in-the-clay-roland-garros-wont-trust-a-machine";

const bodyContent = `Every other Grand Slam settled this years ago. The Australian Open dropped line judges for good in 2021. The US Open went fully electronic in 2022. Wimbledon, 147 years of human line judges, switched to Hawk-Eye Live in 2025. Roland-Garros still hasn't, and as of the 2026 tournament, the director in charge says it isn't ready to yet.

## What actually happens when a call is questioned

There's no camera system making the final decision here. When a player disputes a call, they walk to the net and point at a mark on the court. The chair umpire can climb down from the chair and look at it — a real, physical smudge left in the clay by the ball on impact — and rule based on what they see. It's the only Grand Slam where a disputed point can still be settled by a person walking over and looking at the ground.

That system produced a real controversy in 2026. Casper Ruud was playing João Fonseca in a second-set tiebreak when a shot that looked out was called in after the umpire checked the mark. Electronic replay later showed the ball had actually landed out — but since Roland-Garros doesn't run that system live, the umpire's call on the mark stood. Ruud lost the set, then the match.

Iga Swiatek had her own version of the same problem in her semifinal loss to Aryna Sabalenka. She asked chair umpire Kader Nouni to come down and check a mark; he didn't, and later explained he felt she'd waited too long to ask and pointed to the wrong spot. Hawk-Eye data afterward confirmed the ball had been out. Swiatek's response was blunt: "I don't think that was fair, especially when he came down, like, every time Aryna asked him to."

## Why the tournament is still holding out

Amélie Mauresmo, the tournament director, has given the actual reason directly: "What we observed at the clay-court tournaments leading up to Roland Garros is that the reliability of this system is not absolute. As of today, the machine is not 100 percent reliable, so we continue to place our confidence in human officials." Clay is genuinely harder for electronic tracking than a hard court or grass — dust, irregular bounce, and a surface that changes shape point by point all make it a different technical problem than the one Hawk-Eye already solved everywhere else.

Mauresmo left the door open, but not much more than that: "We've made that choice for 2026. As for 2027, we'll see." Nobody, including the tournament itself, is promising anything different by the time the 2027 edition comes around.

## What it means if you're in the stands

This is the one moment at Roland-Garros that can't happen at any other Slam. Watch enough tennis here and you'll eventually see it: a player pointing at a spot on the clay, an umpire stepping down from the chair, a genuine argument settled by two people looking at a mark on the ground instead of a screen. It's slower, it's occasionally wrong, and it's produced real controversy in back-to-back years. It's also the last place in Grand Slam tennis where a line call still comes down to a human being's own eyes.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "The Mark in the Clay — Why Roland-Garros Still Won't Trust a Machine",
    sport: ["tennis"],
    sportingEventId: FRENCH_OPEN_EVENT_ID,
    contentCategory: "why_go",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "Every other Grand Slam has gone fully electronic on line calls. Roland-Garros still settles disputes the old way — a chair umpire climbing down to inspect a real mark in the clay — and 2026 gave two reasons why that's still controversial.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl,
    heroImageAlt: "Chair umpire at Roland-Garros, 2025",
    heroImageCredit: "Like tears in rain (Wikimedia Commons, CC BY-SA 4.0)",
    editorialNote: "Sources, checked directly 8 Sep 2026: other 3 Slams' electronic line-calling adoption dates (Australian Open 2021, US Open 2022, Wimbledon 2025) — corroborated across SVG Europe, Sport Resolutions, and ESPN coverage. Casper Ruud/João Fonseca 2026 controversy (2nd-set tiebreak, ball mark call, electronic replay later showing the ball out) — Bleacher Report 'Roland-Garros Director Addresses Controversy from Casper Ruud's Loss', fetched directly. Amélie Mauresmo's direct quotes on ELC reliability ('not 100 percent reliable... we continue to place our confidence in human officials') and 2027 being an open question ('We've made that choice for 2026. As for 2027, we'll see') — same Bleacher Report source, fetched directly. Iga Swiatek/Aryna Sabalenka semifinal incident (umpire Kader Nouni's refusal to inspect, Hawk-Eye later confirming the ball was out, Swiatek's direct quote) — corroborated across ESPN, NBC Sports, and Yahoo Sports coverage. The mark-inspection mechanism itself (player points at net, umpire may climb down to inspect) — corroborated via tennis.com's ELC/officiating column. Hero image: Wikimedia Commons, a real chair umpire photographed at Roland-Garros 2025, CC BY-SA 4.0, downloaded to Images/ before R2 upload per standing rule.",
    publishedAt: new Date(),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();

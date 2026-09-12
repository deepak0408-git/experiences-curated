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

const localPath = "Images/French Open Blog - Clay Court Surface.jpg";
const r2Key = "blog/hero/why-clay-changes-everything.jpg";

const file = readFileSync(localPath);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: r2Key,
  Body: file,
  ContentType: "image/jpeg",
}));
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;
console.log("✓ Uploaded to R2:", heroImageUrl);

const slug = "why-clay-is-the-one-surface-that-changes-everything";

const bodyContent = `Roland-Garros uses about 20 tons of crushed brick a year. Not for the whole court, just the top layer, 1 to 2 millimeters of it, spread over 20 courts. Scrape that away and clay tennis stops looking anything like clay tennis.

Roland-Garros is the only one of the four Grand Slams played on clay. Wimbledon has grass, the US Open and Australian Open have hard courts, and clay is the odd one out — slower, weirder, and built almost entirely from crushed rock rather than anything resembling actual clay.

## What's actually under your feet

The court is five layers deep. Big stones at the bottom, about a foot of crushed gravel above that, four inches of crushed coal residue on top of the gravel, three inches of porous white limestone above that, and then the red layer everyone associates with the tournament: 1 to 2 millimeters of crushed brick powder, supplied by the same company for 50 years running. It's not clay in the geological sense at all. It's brick dust on top of a very carefully engineered drainage system.

That thin red layer is doing almost all the work. It's what gives the surface its grip, its color, and its entire personality as a place to play tennis.

## Why the ball behaves differently here

A shot that crosses the net at 67 mph loses something like 35 to 40 percent of its speed on the bounce here — a hard court barely touches it by comparison. The clay grabs the ball, the bounce comes up higher, and a rally that would end in three shots on a hard court can run to fifteen or twenty on clay. Players generate 20 to 25 percent more topspin here too, because the higher bounce gives them more time to load up on the shot before it arrives.

Put simply: clay takes away the shortcuts. A big serve alone doesn't win points the way it can at Wimbledon. Neither does raw power off the ground. What wins on clay is patience, movement, and the ability to construct a point over ten or fifteen shots instead of ending it in three.

## The one skill you can only learn here

Clay is also the only surface where sliding into a shot is standard technique rather than a mistake. On a hard court, sliding into the ball usually means you're out of position and about to lose the point. On clay, it's how the best players in the world move — wide stance, outside leg driving across the body, the shoe collecting a streak of red dust as the player slides into contact, stays low, then pushes off the planted foot to recover for the next shot. It isn't something you can practice on any other surface and bring here. It only exists on clay, and it takes real time to learn.

## What this means for two weeks in Paris

Watch a full match at Roland-Garros and the rallies alone tell you you're somewhere different. Points build instead of ending in a flash, players are constantly sliding into wide balls rather than sprinting and stopping, and the red dust kicked up on every point is doing real, measurable work on how the ball moves. It's the one Grand Slam where the surface itself is as much a part of the story as whoever's playing on it.`;

const wordCount = bodyContent.split(/\s+/).length;
const readMinutes = Math.max(1, Math.round(wordCount / 225));

const [row] = await db
  .insert(blogArticles)
  .values({
    slug,
    title: "Why Clay Is the One Surface That Changes Everything",
    sport: ["tennis"],
    sportingEventId: FRENCH_OPEN_EVENT_ID,
    contentCategory: "why_go",
    seriesSlug: null,
    seriesPosition: null,
    excerpt: "Roland-Garros is the only Grand Slam played on clay — a surface built from 20 tons of crushed brick a year that slows the ball, extends rallies, and demands a sliding technique you can't learn anywhere else.",
    bodyContent,
    readMinutes,
    status: "in_review",
    heroImageUrl,
    heroImageAlt: "Red clay court surface during a match on Court Philippe-Chatrier, Roland-Garros",
    heroImageCredit: "Remi Mathis (Wikimedia Commons, CC BY-SA 4.0)",
    editorialNote: "Sources, checked directly 8 Sep 2026: 5-layer court construction (large stones, ~1ft crushed gravel, 4in crushed coal residue/clinker, 3in porous white limestone, 1-2mm crushed red brick powder), the ~20 tons of crushed brick per tournament across 20 courts, and the 50-year Supersol supplier detail — tennisnerd.net 'Preparations for the 2026 Roland Garros - Secrets about the Red Clay', fetched directly. Ball speed loss on bounce (35-40%) and rally-length/topspin effects (20-25% more RPM on clay vs hard courts) — corroborated across multiple tennis-physics sources (ambelievable.com, tennisexpress.com, forwardpathway.us). Sliding as a clay-exclusive technique not transferable from other surfaces — corroborated via sirolatrainingsystems.com and thetennisbros.com coaching sources. Roland-Garros being the only clay Grand Slam is a well-established, uncontested fact across all sourcing. Hero image: Wikimedia Commons, Court Philippe-Chatrier during the actual 2023 tournament showing the red clay surface directly, CC BY-SA 4.0, downloaded to Images/ before R2 upload per standing rule.",
    publishedAt: new Date(),
  })
  .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title, status: blogArticles.status });

console.log("✓ Blog article seeded");
console.log("  Title: ", row.title);
console.log("  ID:    ", row.id);
console.log("  Words: ", wordCount, "| Read:", readMinutes, "min");

await client.end();

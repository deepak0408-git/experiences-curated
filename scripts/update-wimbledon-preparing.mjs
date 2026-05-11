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

const EXPERIENCE_ID = "b8464205-9b52-43c2-b1d5-528ac1800ec0";

// ─── 1. Upload hero image ────────────────────────────────────────────────────

const imageKey = "experiences/hero/wimbledon-queue.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/wimbledon-queue.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// ─── 2. Updated content ──────────────────────────────────────────────────────

const bodyContent = `Wimbledon is an event you prepare for differently depending on where you're coming from. For visitors making the trip from abroad, a few practical things to sort in advance will change the quality of your trip substantially. For everyone, a few things about the tournament itself — the etiquette, the traditions, the unwritten expectations — are worth knowing before you walk through the gate.

What to wear and what to pack

The outer courts involve more walking than most people expect. From the gate to the far outer courts and back via Henman Hill is well over a kilometre at a casual pace; on a full day, you may cover considerably more. The ground's pathways are grass, gravel, and paved surfaces — manageable, but not kind to unsuitable footwear. Good walking shoes or trainers are the right call. Flip-flops are impractical; heels are a poor idea for the outer courts; smart trainers or boat shoes sit at the right intersection of comfort and looking like you've made an effort.

The dress code for spectators has no strict rules, but the atmosphere is smart casual — a level above weekend casual without approaching formal. Light trousers or a summer dress rather than shorts and a vest is the read of the room. Hospitality areas may carry a stricter expectation. The all-white rule applies only to the players.

Layers are non-negotiable. London in late June and early July is reliably unpredictable. The same day can start at 15°C and reach 26°C; it can rain for 40 minutes and then clear completely. A waterproof jacket that compresses into a bag earns its place every year. Rain doesn't stop play on covered courts; on the outer courts it can, and the Henman Hill atmosphere during a rain delay is worth experiencing at least once.

Food and drink from outside are permitted within limits: no alcohol, no glass containers. Bringing a picnic is actively encouraged by the club. The ground's own food is fine but expensive; eating on the grass near the outer courts is not only cheaper but genuinely more pleasant.

Tournament traditions

Wimbledon runs on small rituals that experienced visitors take for granted and first-timers often miss. Strawberries and cream are the default snack — approximately 30,000 portions during the fortnight, and the ritual is worth doing once regardless of whether you particularly like strawberries. Pimm's is the unofficial tournament drink, available throughout the grounds.

Tennis crowd etiquette here is taken seriously. Points are played in silence; applause comes after, not during a rally. Mobile phones are permitted but calls during play draw sharp looks. The Wimbledon crowd's relationship with Henman Hill is less formal — the hill runs on its own logic, and the atmosphere there during a close match is unlike anything else on the grounds.

The scent of freshly cut grass in week one is immediately recognisable to anyone who's been. It fades through the fortnight as the courts are played in. Week two smells different.

Apps and getting around London

The Wimbledon app is the most useful thing to download before you arrive. It carries the real-time order of play, court information, live scores, and the day's weather forecast for the ground. Updates as schedules shift are immediate — checking the app is faster than looking for a scoreboard anywhere on the site.

For getting around London, Citymapper is the most useful navigation app — it integrates all transport modes, real-time disruptions, and departure boards more reliably than Google Maps. TfL Go is the official Transport for London app and useful for checking tube line status. Both are free. For weather specifically, BBC Weather and AccuWeather both carry reliable London forecasts; the Wimbledon app has its own ground-specific forecast built in.

For international visitors

The United Kingdom uses Type G plugs — three rectangular pins in a triangular configuration, different from EU (Type C/E/F), US (Type A/B), and most other international standards. A universal travel adaptor is the reliable answer; hotels carry a limited supply at reception but bringing your own is safer. Standard UK voltage is 230V at 50Hz. Most modern electronics — phones, laptops, camera chargers — are dual-voltage (check for "100–240V" on the charger label), in which case a simple adaptor is all you need.

Visa requirements depend on your nationality and change more frequently than travel guides keep up with. The UK government's own visa checker is the authoritative starting point — it handles exceptions and recent changes, including the Electronic Travel Authorisation (ETA) requirement introduced for some nationalities that previously visited without one.

On payments: contactless card payments are accepted almost universally in London, including for small purchases. Carrying some cash for markets, small cafés, and tips is still sensible. ATMs are available near Wimbledon station and throughout central London.`;

const whyItsSpecial = `What makes Wimbledon different from other major sporting events isn't the tennis alone — it's the preparation culture that surrounds it. The traditions here are specific: the queue, the strawberries, the silence between points, the way the Hill fills up when it rains. Understanding these in advance transforms the experience from attending an event to being part of one. This entry covers the practical and the cultural in equal measure, because at Wimbledon the two are harder to separate than at almost any other tournament.`;

const insiderTips = [
  "Good walking shoes matter more than you'd expect. The outer courts and grounds add up to well over a kilometre across a full day — trainers or comfortable leather shoes beat anything with a heel.",
  "Download the Wimbledon app before you arrive. It carries the live order of play, court updates, and scores in real time. It's faster than any scoreboard on the grounds.",
  "For getting around London, Citymapper beats Google Maps for public transport — it knows about delays in real time and handles multi-mode routes more cleanly.",
  "UK plugs are Type G (three rectangular pins, 230V). Bring a universal adaptor if you're arriving from outside the UK — hotels carry them but the supply is limited.",
  "Check your visa requirements at gov.uk/check-uk-visa before booking. Some nationalities now need an Electronic Travel Authorisation (ETA) that didn't previously require one.",
];

// ─── 3. Update experience ────────────────────────────────────────────────────

await db
  .update(experiences)
  .set({ bodyContent, whyItsSpecial, insiderTips, heroImageUrl })
  .where(eq(experiences.id, EXPERIENCE_ID));

console.log("✓ Experience updated:", EXPERIENCE_ID);
await client.end();

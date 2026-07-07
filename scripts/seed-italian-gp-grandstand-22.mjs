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
const slug = "grandstand-22-parabolica-corner-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────
const imageKey = "experiences/hero/grandstand-22-parabolica-corner.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/Parabola 22.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// ─── 2. Content ───────────────────────────────────────────────────────────────
const bodyContent = `The Parabolica is where the lap ends. After the long blast down the back straight, cars arrive at Turn 11 carrying 335km/h, then brake hard — you can see the nose dip, the body compress — and sweep right through a long, curving arc that opens onto the pit straight. At Grandstand 22 you're on the outside of that corner, slightly elevated, watching the whole sequence unfold.

What makes this different from Grandstand 26 at the pit lane is the type of action. There's no podium here, no start-line spectacle. What you get instead is cars doing what Monza demands of them: carrying maximum speed through a corner that hasn't really changed since 1948. The Parabolica has been taken by Fangio, Senna, Schumacher. In 2026 the same tarmac, the same radius. That continuity is part of what you feel when you're sitting here.

From row H upward you're fully under the roof, which matters. September at Monza can produce sharp afternoon showers — the kind that arrive quickly and soak the uncovered sections. Rows at the front are partly exposed under the roof overhang. If you're buying early and can choose, request row H or above. On seat numbers: the lower the number (left side of stand), the more of the corner exit you see and the better the angle on the TV screen, which sits across the circuit to the right.

Overtaking at the Parabolica itself is rare. This is not a braking-zone-pass corner like Turn 1. What happens here instead is slipstream positioning — cars jostling for line before the straight so they can draft past on the pit straight or into the Variante del Rettifilo at Turn 1 next lap. If you know to look for that, the whole of qualifying and race day reads differently. Every position around the Parabolica is a setup for what comes next.

The Fan Zone is about five minutes on foot from Gate G, which is the entry point for this grandstand. If you want to split the session — grandstand in the morning, Fan Zone at lunch — it's an easy circuit. The Blue and Red car parks are also closest to this end of the circuit.

Tickets for Grandstand 22 are 3-day packages only at €789. Single-day tickets are not available here. Buy via the official f1italy.com — do not use resellers as a first option; tickets at this end of the circuit tend to hold availability longer than Grandstand 26.`;

const whyItsSpecial = `Grandstand 26 is the prestige choice at Monza — pit lane, podium, the start. Grandstand 22 is the technical choice. What you see here is F1 at its most purely mechanical: a car carrying as much speed as physics allows into a corner that has no margin for error. The Parabolica has been reprofiled slightly over the decades, the run-off tarmacked, but the fundamental demand is unchanged. Arrive fast, brake late, trust the downforce.

Most visitors to Monza who sit at the Parabolica are not the ones who bought a hospitality package or spent weeks researching grandstands. They're people who wanted to be close to the racing and chose the covered stand nearest the final corner. What they find is that the Parabolica tells you something about why Monza is still on the calendar when circuits with twice the facilities aren't. It's not a complicated circuit. It's a fast one. And from Grandstand 22, you're watching the fastest part of it.`;

const practicalInfo = {
  hours: "Gates open 08:00 daily. Practice Friday, Qualifying Saturday, Race Sunday (4–7 Sep 2026).",
  costRange: "€789 for a 3-day ticket (all sessions, reserved seat). No single-day option.",
  bookingMethod: "Buy directly at f1italy.com — tickets delivered as print-at-home PDF within 48 hours.",
  howToBook: "Grandstand 22 sells slower than Grandstand 26 but does sell out, typically by June for September. Check f1italy.com/en/ticket-info/grandstand-22 now — if 3-day tickets are live, buy immediately. For group bookings, f1italy.com guarantees adjacent seating automatically. If official tickets are sold out, check tickets.gp as a secondary market — they aggregate legitimate resellers and usually have inventory at face value or close to it. Avoid ViaGoGo as a first choice; pricing inflates significantly when stock is low. For hospitality above the grandstand tier — Champions Club (open bar, driver Q&A, grid walk) or Paddock Club (pit lane access, unlimited F&B) — contact F1 Experiences directly at f1experiences.com; these sell 6–8 months out.",
  website: "https://www.f1italy.com/en/ticket-info/grandstand-22",
  reservationsRequired: true,
};

const gettingThere = "Take the S8/S9/S11 from Milano Porta Garibaldi to Biassono-Lesmo Parco station (20 mins), then the Black Line shuttle or a 20-minute walk through Parco di Monza. Gate G is the closest entry point for Grandstand 22. The Blue and Red car parks are at this end of the circuit.";

// ─── 3. Insert experience ─────────────────────────────────────────────────────
try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Grandstand 22 — The Parabolica Corner",
      subtitle: "Covered seats at Monza's final corner. Cars brake from 335km/h into the right-hander that feeds the main straight.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Autodromo Nazionale Monza",
      address: "Autodromo Nazionale di Monza, Vedano al Lambro, 20900 Monza MB, Italy",
      heroImageUrl,
      heroImageAlt: "Formula 1 car racing on circuit with spectators and green parkland landscape surrounding the track",
      heroImageCredit: "Alexandros Milidakis, Pexels Licence",
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "Rows H and above are fully under the roof — the front rows have partial exposure. If buying early with a group booking, request row H or higher to guarantee cover from afternoon showers.",
        "Seat numbers below 30 (left side of the stand) give a better view of the corner exit and the TV screen. Lower seat numbers = more of the Parabolica arc visible.",
      ],
      whatToAvoid: "Don't buy expecting single-day tickets — Grandstand 22 is 3-day packages only at €789. If you only want race day, look at general admission (Interno Parabolica, uncovered bench seating). And don't expect wheel-to-wheel overtaking at the corner itself — the Parabolica is a braking-and-sweeping corner, not a passing zone. Moves set up here resolve on the pit straight.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: f1italy.com/en/ticket-info/grandstand-22 (3-day price €789, seating rows A–M, seats 1–164, covered, confirmed Jun 2026), oversteer48.com/monza-grandstand-22-parabolica/ (seat recommendations, TV screen position), motorsporttickets.com grandstand guide (view description, atmosphere). Speed figures from f1chronicle.com Parabolica corner guide. GTG: check f1experiences.com for Champions Club/Paddock Club. Booking.com: N/A. Hero image: Alexandros Milidakis, Pexels Licence.",
      moodTags: ["high-energy", "authentic", "immersive"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "EUR",
      bestSeasons: ["sep"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-06-29",
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

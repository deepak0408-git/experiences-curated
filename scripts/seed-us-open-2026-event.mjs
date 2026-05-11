import { config } from "dotenv";
config({ path: ".env.local" });
import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { sportingEvents } from "../schema/database.ts";

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

const imageKey = "sporting-events/hero/us-open-2026.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: readFileSync("Images/us-open-blue-court.jpg"),
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

const NEW_YORK_ID = "fb782de2-bbe6-410f-b466-2a4e628cda10";

const [event] = await db
  .insert(sportingEvents)
  .values({
    name: "US Open 2026",
    slug: "us-open-2026",
    sport: "tennis",
    tournamentSeries: "US Open",
    editionYear: 2026,
    destinationId: NEW_YORK_ID,
    venueName: "USTA Billie Jean King National Tennis Center",
    venueAddress: "Flushing Meadows-Corona Park, Queens, NY 11368",
    startDate: "2026-08-25",
    endDate: "2026-09-07",
    recurrence: "annual",
    ticketingUrl: "https://www.usopen.org/tickets",
    heroImageUrl,
    editorialOverview: "Two weeks in August heat in Queens, New York. The night sessions under the lights of Arthur Ashe Stadium. Grounds passes that get you within arm's reach of the world's best players on the outer courts. The 7 train, the Golden Mall, Jackson Heights. The US Open is more accessible than you'd expect and wilder than you'd plan for — this pack covers how to do it properly.",
  })
  .returning({ id: sportingEvents.id, name: sportingEvents.name });

console.log(`✓ Seeded: ${event.name} (${event.id})`);
await client.end();

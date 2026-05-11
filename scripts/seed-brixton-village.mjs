import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
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

const LONDON_ID = "75758888-28b9-4e09-82ba-f05681ecc904";
const slug = "brixton-village-market-row-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const imageKey = "experiences/hero/brixton-village.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/brixton-village.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// ─── 2. Content ───────────────────────────────────────────────────────────────

const bodyContent = `Granville Arcade opened in May 1937. Market Row, adjacent, opened in 1928. Together they form what's now marketed as Brixton Village — two covered Victorian and Interwar arcades running between Coldharbour Lane, Atlantic Road, and Electric Lane, five minutes' walk from Brixton tube.

For most of the post-war period, these arcades were the commercial heart of London's Afro-Caribbean community. Caribbean food, fabric shops, barbers, record stalls. After the area's rebranding as Brixton Village in 2009, the character shifted. Trendy restaurants and bars replaced the older traders. Ownership transferred to a Texas-based property company in 2018, rents rose, and several long-standing tenants were forced out. The Dogstar — a Brixton music institution since 1992 — closed permanently in October 2024.

Knowing this is part of visiting honestly. Brixton Village is an excellent food market and a genuinely interesting place to spend time. It is also a site of ongoing displacement, and the two things coexist.

What it's good for: eating, particularly around lunch and on Thursday–Saturday evenings. The vendor mix is genuinely global rather than manufactured-global. Okan does Osaka-style okonomiyaki — savoury egg-and-cabbage pancakes — with no obvious reason to exist in SW9 except that the person running it knows how to make them properly. House of Momo does Nepalese dumplings. Club Mexicana (in Market Row) does vegan tacos that have been notable for years. Fish, Wings & Tings is exactly what it sounds like and does it well. The range runs from Jamaican to Venezuelan to Japanese, and it's worth looking around before deciding rather than arriving with a plan.

The covered arcade structure helps. High ceilings, concrete pillars, mid-century commercial design — both arcades are Grade II listed, which means they've survived long enough to be protected. Borough Market is the obvious comparison: good, professionally managed, touristy in a way the best markets aren't. Brixton Village is scruffier, cheaper, and feels like it belongs to somewhere specific. Most vendors are counter or self-seat. No hosts, no queuing systems, no wristbands.

Weekday lunchtimes — roughly 11am to 2pm — are the right time if you want to move between traders without fighting for space. The market runs until 11:30pm Tuesday through Sunday. Evenings, particularly Thursday through Saturday, are when it has the strongest atmosphere: several cuisines cooking simultaneously, the bars doing business, the passages between arcades genuinely busy.

Market Row and Brixton Village are physically connected but not signposted internally. First-time visitors often cover one half and miss the other. The passage between them is there; it takes a bit of navigating.

Getting here from central London: Victoria Line to Brixton, Zone 2, 6 minutes from Victoria station. From the tube: left on Brixton Road, first left on Electric Avenue, right on Electric Lane — entrance immediately on the left, about two minutes' walk. From Wimbledon: District Line to Stockwell (7 minutes), change southbound one stop to Brixton. It works as the evening destination on a match day if you're spending time in South London.`;

const whyItsSpecial = `Borough Market has 1,000 years of documented operation. It also has professional photographers, guided tours, and a tourist infrastructure refined over two decades. You are clearly a visitor there, and the market knows it.

Brixton Village doesn't have any of that. What it has is a more legible story about how London actually works: who moves to a neighbourhood, who gets displaced, who builds something in the space left behind. The best food markets in any city tend to be the ones that still feel slightly accidental — where the traders are there because of what they know how to cook rather than because someone selected them to complete a curated range. Brixton Village is still largely that, despite the pressures.

The vendor diversity is real, not cosmetic. The prices haven't caught up with central London. The atmosphere on a Thursday evening has nothing to do with tourism. And for someone visiting London from elsewhere — for Wimbledon, for a Test match at the Oval nearby, for any reason — Brixton is also a reason to go south of the river, which many visitors never do. Taking the Victoria Line to Brixton, spending two hours in the Village, and walking through the Atlantic Road market stalls on the way back to the tube is a half-day that shows you a version of London the usual circuit doesn't.`;

const insiderTips = [
  "Electric Lane off Electric Avenue is the most direct entrance from the tube — about 2 minutes from Brixton station, right off Brixton Road.",
  "Okan (Osaka-style okonomiyaki) and House of Momo (Nepalese dumplings) are the strongest vendor recommendations; both sit in Brixton Village proper rather than Market Row.",
  "Club Mexicana is in Market Row, accessed via the internal passage between the two arcades — first-time visitors regularly miss it.",
  "Thursday to Saturday evenings are the most atmospheric: all traders open, the bars running, and the passages busy from around 7pm.",
  "Monday is reduced trading — most food vendors close for their rest day; not the right time to visit for the full market experience.",
  "Walk Atlantic Road on the way in or out: the open street market here is the older Brixton, with Caribbean produce and fabric shops that predate the 2009 rebranding.",
  "Several vendors allow BYOB for drinks bought at the off-licences on Brixton Road — worth asking at the counter before you order.",
];

const whatToAvoid = `Don't visit on a Monday expecting the food market — most traders are closed. Don't arrive with a rigid plan; deciding what to eat after looking around the arcades is better than committing before you've seen what's on. Don't mistake Brixton Village for just one arcade: Market Row is connected via an internal passage and most first-time visitors miss half the market. Don't skip Atlantic Road if you have 10 minutes — the older street market outside the covered arcades gives the Village context that's hard to get otherwise.`;

const practicalInfo = {
  hours: "Tue–Sun 8am–11:30pm. Mon 8am–6pm (reduced trading — most food vendors closed). Best window: weekday 10am–2pm for calm; Thu–Sat from 6pm for evening atmosphere.",
  costRange: "Lunch £10–20. Evening meal with drinks £20–35 per person. Cheaper than Borough Market equivalents.",
  bookingMethod: "Walk-in only. No booking required or accepted at most vendors.",
  reservationsRequired: false,
  website: "https://brixtonvillage.com",
};

const gettingThere = `Victoria Line to Brixton (Zone 2). From Brixton station: left on Brixton Road, first left on Electric Avenue, right on Electric Lane — entrance immediately on the left. Approximately 2 minutes' walk. From Victoria station: 6 minutes by tube. From Wimbledon: District Line to Stockwell (7 minutes), change southbound one stop to Brixton — convenient as the evening destination on a match day.`;

// ─── 3. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Brixton Village & Market Row",
      subtitle: "Two covered 1930s arcades off Brixton High Street: global food, honest prices, and more character than Borough Market",
      slug,
      experienceType: "neighborhood",
      status: "in_review",
      destinationId: LONDON_ID,
      sportingEventId: null,
      neighborhood: "Brixton, SW9",
      address: "Brixton Village, Coldharbour Lane, London SW9 8PS",
      heroImageUrl,
      heroImageAlt: "Inside Brixton Village, the covered market arcade in SW9, looking down the central passage",
      heroImageCredit: "Photo by Matt Brown, CC BY 2.0",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "History sourced from Historic England listing (Grade II, 2010) and Brixton Village official site. Vendor list current as of April 2026 via brixtonvillage.com tenant directory and Time Out London. Dogstar closure confirmed October 2024 via Brixton Culture Capital. Gentrification and Hondo Enterprises context from Metropolitics and Brixton Buzz. Sources checked April 2026.",
      moodTags: ["authentic", "social", "electric"],
      interestCategories: ["food", "culture"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "GBP",
      budgetMinCost: "10",
      budgetMaxCost: "35",
      bestSeasons: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-04-25",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
  console.log("\n→ Ready to review at: http://localhost:3000/curator/review");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

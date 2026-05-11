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
const slug = "wimbledon-lawn-tennis-museum-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const imageKey = "experiences/hero/wimbledon-lawn-tennis-museum.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/wimbledon-lawn-tennis-museum.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// ─── 3. Content ───────────────────────────────────────────────────────────────

const bodyContent = `The Wimbledon Lawn Tennis Museum is open most of the year, which is the first thing to understand about it. The Championships run for two weeks. The museum runs for most of the rest. If you want to know why Wimbledon is what it is, you don't have to be there in July.

The museum sits within the AELTC grounds, adjacent to Centre Court. The 90-minute guided tour covers both the exhibition and the grounds themselves. A Blue Badge guide leads you through the concourse around Centre Court, into player areas closed to the public during the year, and through spaces that make the architecture of the place readable in a way the Championships themselves don't allow. When 40,000 people are using the grounds for two weeks, the spatial logic is compressed and obscured. On a quiet Thursday in February, the scale and arrangement of it all becomes clear.

The museum covers roughly 140 years of tennis — from the garden-party game of the 1870s through the amateur era, Open Era from 1968, and the current professional circuit. It's unusual among sports museums in that it doesn't restrict itself to trophies and highlight footage. There's real attention to the social history of the sport: who was allowed to play, when the rules changed, how equipment evolved, what the relationship was between the AELTC and the wider game. There are periods in tennis history that are complicated, and the museum doesn't flatten them.

The centrepiece of the tour is access to areas you can't otherwise enter: a recreated Victorian dressing room of the kind that would have been used when the tournament was still a social occasion rather than a televised global event, and a 200-degree cinema that recreates the view from the baseline on Centre Court. The cinema experience is disorienting in the specific way that scale changes perception. The height of the stands, projected that large, tells you something about what the players are actually seeing and doing that a broadcast seat never reveals.

Trophy replicas are displayed throughout the museum, including the Gentlemen's and Ladies' Singles trophies. The Venus Rosewater Dish — the Ladies' Singles trophy, awarded since 1886 — is displayed alongside its history in a way that makes the continuity of the thing legible. It has been presented at the same club, in the same general location, for 140 years. That fact reads differently when you're standing next to it.

The museum closes during The Championships fortnight when the grounds are in tournament use. It typically reopens in mid-July. Outside the Championships window, it's one of the better standalone sports attractions in London — not only for tennis fans. The 90-minute guided tour and the physical access to Centre Court's interior make it a more complete experience than most comparable venues offer.

Practical note on the gift shop: it's at the end of the tour, it's well-stocked, and it's designed for people who have just spent 90 minutes becoming more interested in Wimbledon than they were before they arrived. Budget accordingly.`;

const whyItsSpecial = `Most sports museums are trophy cabinets with explanatory text. The player who won the thing, the year they won it, a photograph. This is necessary information and it's not the point.

The Wimbledon Museum works differently because the AELTC has kept its records seriously, and because the building gives the exhibition a physical relationship to what it documents. You are standing inside the venue where these events happened. The artefacts aren't behind glass in a building three miles from the action — they're inside the fence, a few metres from the courts where the trophies were presented.

The guided tour earns its price because a Blue Badge guide carries context that the labels don't. How this particular club became the permanent host of a major. What changed in 1968 when Open Era began and amateurs competed alongside professionals for the first time. Why the grass courts were maintained at exactly 8mm for most of the tournament's history, and when that changed. None of this is on the signs. A good guide knows which details open the rest of it up.

For tennis fans who can't get tournament tickets — or who find themselves in London outside the Championships window — this is a full experience, not a consolation. Two hours here explains the game and the place better than most things I know.`;

const insiderTips = [
  "Book the guided tour online in advance at bookings.wimbledon.com — it sells out on weekends and during school holidays, particularly in spring and early summer.",
  "The museum closes during The Championships (typically late June to mid-July) and reopens in mid-July; check the current dates on the official website before travelling.",
  "Adult guided tour (90 min, includes museum and Centre Court concourse access) is £32; the museum-only option is cheaper but the grounds access in the guided version is the most distinctive part.",
  "The 200-degree Centre Court cinema experience is included in the guided tour and worth arriving slightly early for to get a central position.",
  "Thursday to Sunday are the opening days; Monday to Wednesday the museum is closed, so plan accordingly.",
  "Combine the museum visit with a walk through Wimbledon Village (15-20 minutes on foot from the AELTC entrance) for a full half-day in SW19.",
  "Photography is permitted in most areas of the museum; restrictions are posted at the entrance and are minimal.",
];

const whatToAvoid = `Don't arrive without a booked ticket on a weekend — the guided tours have limited places and walk-in availability is unreliable. Don't plan the visit during The Championships fortnight (typically late June to mid-July) as the grounds and museum are inaccessible. Don't skip the guided tour in favour of the museum-only option if you have the time — the access to Centre Court's interior and closed areas is what makes this visit unlike anything else in sports tourism.`;

const practicalInfo = {
  hours: "Thursday to Sunday, 10am-5pm (10am-5:30pm April to September). Last admission 4:30pm. Closed Monday-Wednesday and during The Championships (late June to mid-July).",
  costRange: "Guided tour (90 min, includes museum and grounds): Adults £32, Children £22. Museum-only admission available at a lower price. Booking required.",
  bookingMethod: "Online booking required at bookings.wimbledon.com. Walk-in availability is limited and unreliable.",
  reservationsRequired: true,
  website: "https://bookings.wimbledon.com/stadiumtours/booking/default.htm",
};

const gettingThere = `Wimbledon station (District Line Zone 3, or overground from Waterloo), then bus 493 directly to the AELTC main entrance on Church Road, or a 20-minute walk uphill. The museum entrance is signposted from the Church Road gate. Alternatively, Southfields District Line station is a 12-minute walk from the grounds — a slightly quieter approach than via Wimbledon station on busy days.`;

// ─── 4. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Lawn Tennis Museum",
      subtitle: "How a Victorian garden game became tennis's most storied slam — the full story in 90 minutes at the AELTC",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: LONDON_ID,
      sportingEventId: null,
      neighborhood: "SW19, Wimbledon",
      address: "Museum Road, All England Lawn Tennis Club, Church Road, Wimbledon, London SW19 5AE",
      heroImageUrl,
      heroImageAlt: "The entrance to the Wimbledon Lawn Tennis Museum at the All England Club",
      heroImageCredit: "Photo by ozziebackpacker, CC BY 2.0",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Verified against official AELTC museum and tours page (wimbledon.com/museum_and_tours) and Visit London's museum listing. Pricing confirmed at £32 adults / £22 children for guided tour. Opening hours confirmed Thursday-Sunday. Closure during Championships fortnight is standard policy. Sources checked April 2026.",
      moodTags: ["curious", "intimate", "authentic"],
      interestCategories: ["sports", "culture", "history"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "GBP",
      budgetMinCost: "22",
      budgetMaxCost: "32",
      bestSeasons: ["jan", "feb", "mar", "apr", "may", "aug", "sep", "oct", "nov", "dec"],
      advanceBookingRequired: true,
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

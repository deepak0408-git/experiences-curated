import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync } from "fs";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const BELGIAN_ARDENNES_ID = "101b815a-ba64-4484-aad6-63721a44ed85";
const BELGIAN_GP_EVENT_ID = "b1816396-6d71-4693-a53f-05bccb2d8a8e";
const slug = "belgian-gp-ticket-guide-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const imageFilename = "Your Belgian GP Ticket Guide What to Buy and When.jpg";
const r2Key = `experiences/hero/${imageFilename}`;
const imageBuffer = readFileSync(`Images/${imageFilename}`);

await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: r2Key,
  Body: imageBuffer,
  ContentType: "image/jpeg",
}));

console.log("✓ Hero image uploaded to R2");

const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/experiences/hero/${encodeURIComponent(imageFilename)}`;

// ─── 2. Content ───────────────────────────────────────────────────────────────

const bodyContent = `Spa sells tickets in three tiers: Bronze (General Admission), Silver (reserved grandstand), and Gold (reserved grandstand, premium locations). The tier names tell you roughly where you sit in the pecking order, but they do not tell you what you will actually see. That is what this guide is for.

The circuit runs 7km through the Ardennes hills. Because the terrain is so uneven, Bronze at Spa is different from GA at most other F1 circuits — there are natural grass banks and elevated mounds throughout that give real sightlines, not just a view of the barrier. A Bronze ticket is not a consolation prize here. It is a legitimate choice if you want to move around.

The main action concentrates in two places: the Eau Rouge/Raidillon complex at the bottom of the circuit, and La Source hairpin at the top. Everything else is secondary.

Bronze — General Admission (€305, 3-day)

Bronze gives you access to the banks alongside Kemmel Straight, the Bruxelles and Fagnes sections, and the Blanchimont approach. What it does not give you is a seat, and at Spa that matters: you will cover 10,000 to 15,000 steps per session, much of it on uneven ground. In wet conditions — which Spa delivers regularly — Bronze is exhausting in a way that a grandstand seat is not. Go Bronze if you want to spend Friday walking the full circuit, Saturday picking your two favourite spots, and Sunday planted at the one that felt right. Go Silver or Gold if any of that sounds unappealing.

Children under 5 enter Bronze free. Children 5–12 get discounted tickets.

Silver 3 — Pouhon (€565, 3-day)

Pouhon is a long, fast double-left at the back of the circuit. Cars enter at around 240 km/h. Silver 3 is the grandstand on the inside of that corner, now covered for 2026 — it was open previously, which in Ardennes weather was a gamble. The atmosphere around Silver 3 is generally better than the other Silver stands because it sits surrounded by Bronze GA areas; the fans on the nearby mounds create more movement and noise than you get at a fixed grandstand in isolation. Good choice for someone who wants a seat at a technical corner, does not need the podium view, and is not willing to pay Gold prices.

Gold 3 — Eau Rouge (sold out for 2026, 3-day weekend)

Gold 3 is directly at the Eau Rouge complex — mid-corner, looking up toward Raidillon. It is the most discussed grandstand at Spa and it sold out for the full weekend before most buyers checked availability. Single-day tickets (Saturday or Sunday only) may still exist but sell quickly. If you have not yet bought for the 2026 race, do not hold out for Gold 3. It is gone or close to it.

Gold 8 — La Source (sells out approximately one year in advance)

Gold 8 sits at La Source, the first corner after the start. It has the best view of first-lap drama — the grid acceleration down the pit straight, the braking into Turn 1, the pile-ups that happen at La Source on race Sunday more than anywhere else on the calendar. Gold 8 is covered, has backed seats, and carries a big screen. It also sells out approximately one year in advance. 2026 availability was limited from the first week of sales; Gold 7, the adjacent grandstand, tends to have inventory slightly longer.

Gold 1 — Pit Straight (covered, podium views)

Gold 1 is the only grandstand at Spa where you can see the podium. It sits on the start-finish straight with views of the pit lane, the grid formation, and the post-race celebrations. The front rows can catch spray in heavy rain despite the cover. If the podium matters to you, Gold 1 is the one to book.

When to buy

Tickets for the following year typically go on sale in July, shortly after the current year's race. The 2026 race is 17–19 July, so 2027 tickets will likely appear in July 2026 and the best seats will sell within weeks. For 2026 now: Bronze and most Silver stands still have inventory. Gold 3 weekend is sold out. Gold 8 availability is extremely limited. Gold 1 and Gold 2 may still have single-day options. Do not wait.

Day ticket strategy

Saturday is qualifying — the single fastest lap per session and typically the best on-track action relative to crowd size. Sunday is the race but also the biggest crowd, worst traffic, and most expensive single-day ticket. A Saturday-only Silver 3 ticket is the best value single-day option if you can only attend one day.

Where to buy

The official F1 ticketing platform (tickets.formula1.com) is the primary official channel. The circuit also sells direct at spagrandprix.com. Official reseller agents — Grand Prix Tickets, Motorsport Tickets, Gootickets — operate at face value. StubHub carries secondary market tickets for sold-out grandstands; prices there run 2–3x face value. Three-day ticket holders typically receive free pit walk access (Thursday or Friday before race weekend) — confirm at purchase as it is not always shown prominently at checkout.`;

const whyItsSpecial = `Most circuit guides tell you which grandstand has the best view. This one tries to answer a different question: given the money you have and the weekend you want, what is the right ticket?

The honest answer at Spa is that the circuit is unusual enough that Bronze is genuinely good — better than GA at most F1 circuits because the terrain does the work. It is also the most physically demanding option and requires a willingness to move rather than sit. If you are travelling from outside Belgium, have children, or will be attending for multiple days, a covered grandstand is not an indulgence.

Gold 3 and Gold 8 represent the two things Spa does best: Eau Rouge, which is unique in motor racing, and La Source, which produces more first-lap incidents than anywhere else on the calendar. Both sell out early and for good reason. For anyone not yet booked for 2026, that window has likely closed. The practical choice is between Silver 3 Pouhon — a genuinely good mid-range seat — and Gold 1 if the podium view matters.

The 2026 race runs 17–19 July. The Belgian Ardennes in July can produce 25°C sunshine and a cold driving downpour within the same afternoon. Any uncovered grandstand is a gamble here in a way that it is not at Silverstone or Barcelona. A covered seat costs more. At Spa it is worth more than the price difference suggests.`;

const insiderTips = [
  "Gold 3 3-day weekend is sold out for 2026 — if a third-party site offers it at face value, check availability at spagrandprix.com first before paying; the official site is the definitive inventory check.",
  "A Saturday-only Silver 3 ticket is the best single-day value at Spa — you get the full qualifying session (typically the most intense on-track action per hour), a covered seat at Pouhon, and lower crowd density than race Sunday.",
];

const whatToAvoid = `Don't buy uncovered grandstand tickets for Spa without factoring in the weather — Blanchimont, Silver 5, Silver 6, and Speed Corner are all open to the sky, and the Ardennes can produce two hours of driving rain in July without warning. Don't hold out for Gold 3 or Gold 8 for 2026 — those seats are gone and anyone offering full-weekend face-value tickets for those grandstands through unofficial channels should be verified carefully.`;

const practicalInfo = {
  hours: "Race weekend 17–19 July 2026. Gates open from 06:00 each day.",
  costRange: "Bronze (3-day) from €305. Silver 3 from €565. Gold from €699. Gold 3 weekend sold out; Gold 8 extremely limited.",
  bookingMethod: "Buy direct at tickets.formula1.com or through official agents including spagrandprix.com/en/tickets and motorsporttickets.com. For 2026: Gold 3 3-day weekend is sold out; Gold 8 3-day is extremely limited. Gold 1 and Silver 3 still have availability but Saturday/Sunday single-day tickets sell faster than full weekend passes. The free pit walk is typically included with 3-day tickets and runs Thursday or Friday — confirm at checkout as it is not always shown by default. For 2027, set a calendar reminder for July 2026 immediately after the 2026 race — Gold 8 sells out within the first two weeks of sales opening, Gold 3 typically within the first month. If buying for a group through Grand Prix Tickets (the official direct-from-promoter agent), buying in a single transaction guarantees adjacent seats. StubHub secondary market is available for sold-out grandstands but expect 2–3x face value; use only as last resort. Children under 5 free in Bronze; 5–12 discounted across all tiers — confirm current discount brackets at spagrandprix.com before purchasing.",
  howToBook: "Buy direct at tickets.formula1.com or through official agents including spagrandprix.com/en/tickets and motorsporttickets.com.",
  website: "https://tickets.formula1.com/en/f1-3286-belgium",
  reservationsRequired: true,
};

const gettingThere = `Circuit de Spa-Francorchamps, Route du Circuit 55, 4970 Stavelot. For transport options on race weekend see the Getting to the Circuit experience — shuttles, driving, and parking details are covered there.`;

// ─── 3. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Your Belgian GP Ticket Guide",
      subtitle: "Bronze GA, Silver 3 Pouhon, Gold 3 Eau Rouge, Gold 8 La Source — which ticket fits your weekend",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: BELGIAN_ARDENNES_ID,
      sportingEventId: BELGIAN_GP_EVENT_ID,
      neighborhood: "Francorchamps",
      address: "Circuit de Spa-Francorchamps, Route du Circuit 55, 4970 Stavelot, Belgium",
      heroImageUrl,
      heroImageAlt: "Aerial satellite view of Circuit de Spa-Francorchamps in the Ardennes hills",
      heroImageCredit: "Planet Labs, Inc. / SkySat (CC BY-SA 4.0)",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      bookingLinks: [],
      editorialNote: "Ticket types, grandstand descriptions, and sell-out status from gpdestinations.com (2026 Belgian GP ticket guide, verified June 2026) and motorsporttickets.com seating guide. Prices from global-tickets.com (3-day weekend, June 2026). Gold 3 sold-out status confirmed via gpdestinations.com. Gold 8 sell-out timeline from motorsporttickets.com. Official ticketing at tickets.formula1.com and spagrandprix.com. Hero image: Circuit de Spa-Francorchamps SkySat April 2018, Planet Labs Inc., CC BY-SA 4.0, Wikimedia Commons. Verified June 2026.",
      sport: ["formula_one"],
      moodTags: ["adventure", "social"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "EUR",
      budgetMinCost: "305",
      budgetMaxCost: "1125",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-06-14",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: BELGIAN_GP_EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
  console.log("  → Join row inserted into sporting_event_experiences");
  console.log("\n→ Ready to review at: http://localhost:3000/curator/review");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

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
const slug = "camping-at-the-circuit-belgian-gp-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const imageFilename = "Camping at the Circuit On-site Race Weekend Camping.jpg";
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

const bodyContent = `The circuit campsite is not a festival afterthought. Circuit de Spa-Francorchamps built its on-site camping to hold tens of thousands of people across four zones, each with its own character and its own relationship to the track. Getting this choice right is the difference between a race weekend that flows and one where every trip to the grandstand feels like a logistics exercise.

Green Zone sits closest to the circuit, a 5 to 10 minute walk from the Combes entrance. This is where Dutch fans plant their flags — orange everywhere, music running late into Thursday and Friday nights, and a collective noise at race start that carries across the hill. Yellow Zone is quieter by design, aimed at families, also 5 to 10 minutes from La Source. The site is flatter and somewhat better organised, with more space between pitches. Young Village runs for ticket holders aged 17 to 27 only — a dedicated DJ stage, bar, and about 500 metres to the Stavelot gate. Masta Zone is the overflow option, further out and shuttle-served; fine if the others are sold out, but it is the last choice for a reason.

The base camping ticket covers the pitch and campsite access. It does not include circuit entry. You need both — a camping ticket for the site and a race ticket for the grandstands. Book both at the same time at spagrandprix.com when circuit tickets go on sale, because Green Zone fills first.

The full camping period runs from Thursday 16 July at 08:00 to Monday 20 July at 11:00. You can arrive from Thursday and leave any time Monday morning. One hard restriction: no departures from the campsite on Sunday between 16:30 and 19:30 while the race is running and the roads around the circuit are locked.

For those who want to camp without sleeping in a tent they carried on a plane, the premium options are worth knowing. GPtents operates within the Green Zone — pre-erected tents with electricity, hot showers on site, and a restaurant. Last availability for 2026 was visible in May; check gptents.com. IntentsGP runs a private compound with bell tents and yurts, breakfast included, priced from £949 to £1,439 per tent for the weekend. Glamping Green offers similar pre-erected tents at approximately €1,150 per unit.

The site bans glass entirely — decant wine and spirits before you arrive. Wellies are not optional in the Ardennes in July; the campsite turns fast in rain and the hill paths to the circuit become difficult. BBQs are permitted in contained holders only, not directly on the grass.

Showers and toilets are on site across all zones, though the queues on Saturday morning before qualifying run long. The campsite has food vendors, but options narrow late at night. Stock a few basics at a supermarket in Liège or Verviers on the way in.`;

const whyItsSpecial = `Most F1 circuits do not let you sleep inside the race venue. Spa does. That fact alone changes what race weekend feels like.

Waking up on Saturday to the sound of support series cars running through Eau Rouge — before most ticket holders have left their hotels in Spa town — is an experience that no grandstand upgrade can replicate. The campsite is inside the fence. You walk to the circuit. The race comes to you.

The Green Zone crowd is a specific thing. Dutch F1 fans travel in organised groups and they commit to the experience in a way that most other nationalities don't. The atmosphere on Thursday and Friday nights is genuine — not the manufactured noise of a concert add-on, but people who have been planning this trip since the previous October. If you want to understand what F1 fandom looks like at full intensity, Green Zone is the place to see it.

The practical argument also holds. A mid-range Ardennes hotel on race weekend costs €300 to €500 per night. Four nights in a tent at the circuit costs a fraction of that. The premium options — GPtents, IntentsGP — blur the line between camping and glamping while still delivering the inside-the-fence experience. They also solve the logistics problem: no tent to transport, no sleeping mat, no waking up cold.

The reason this experience matters is that a lot of first-timers book a hotel in Spa or Liège, spend an hour each way getting in and out of the circuit, and spend the whole weekend managing transport. Camping at the circuit eliminates that problem entirely. The trade-off is comfort; the reward is proximity. For most people who try it once, it becomes the only way they want to do Spa.`;

const insiderTips = [
  "Green Zone pitches facing the circuit sell out first — book as soon as tickets go on sale at spagrandprix.com, not when you book your grandstand.",
  "Decant all wine, spirits, and beer from glass into plastic bottles or cans before arriving at the campsite gate — glass is banned and security does check.",
  "Bring wellies even if the forecast looks dry: the campsite paths run downhill to a valley floor and one rain shower turns them into a slide.",
];

const whatToAvoid = `Don't book Masta Zone unless Green and Yellow are sold out — the shuttle adds 20 minutes each way to every circuit visit and removes the main reason to camp on site. Don't plan to drive out on Sunday between 16:30 and 19:30; the campsite locks vehicular access during the race finish window, and any departure attempt before 19:30 will be turned back. Don't assume the camping ticket includes circuit entry — it covers the campsite only, and your grandstand ticket is a separate purchase.`;

const practicalInfo = {
  hours: "Campsite opens Thu 16 Jul 08:00; closes Mon 20 Jul 11:00. No vehicle departures Sun 16:30–19:30.",
  costRange: "Standard camping pitch from approx. €80–120 for the weekend (zone-dependent); GPtents from approx. €450+; IntentsGP £949–£1,439/tent; Glamping Green approx. €1,150/tent",
  bookingMethod: "Book at spagrandprix.com — camping tickets sold alongside grandstand tickets. GPtents at gptents.com. IntentsGP at intentsgp.com.",
  howToBook: "Go to spagrandprix.com the day grandstand tickets go on sale (typically January–February for the July race). Camping zones and grandstand tickets are sold together; Green Zone pitches facing the circuit fill fastest, often within hours of opening. For GPtents: book directly at gptents.com — availability runs out by April/May. For IntentsGP: register interest at intentsgp.com early in the year; their private compound has limited capacity and sells by allocation. For Glamping Green: check spagrandprix.com alongside standard camping options. Note: a camping ticket and a circuit ticket are two separate purchases — you need both.",
  website: "https://www.spagrandprix.com/en/accomodations",
  reservationsRequired: true,
};

const gettingThere = `The circuit campsite is at Route du Circuit, 4970 Stavelot. Green Zone: 5–10 min walk to Combes entrance. Yellow Zone: 5–10 min walk to La Source entrance. Young Village: approx. 500m to Stavelot gate. Masta Zone: shuttle-served from campsite. If arriving by car, follow N62 from Spa or Liège toward Francorchamps — campsite vehicle entrance is signed from the N62. Parking for campsite arrivals is included with camping tickets. City Shuttle buses do not serve the campsite directly — take the shuttle to the circuit entrance and walk through.`;

// ─── 3. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Camping at the Circuit — On-site Race Weekend",
      subtitle: "Sleep inside the fence at Spa — where Dutch fans, dawn engine noise, and race atmosphere begin Thursday",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: BELGIAN_ARDENNES_ID,
      sportingEventId: BELGIAN_GP_EVENT_ID,
      neighborhood: "Francorchamps",
      address: "Route du Circuit, 4970 Stavelot, Belgium",
      heroImageUrl,
      heroImageAlt: "Rows of tents at a large outdoor festival campsite under blue skies",
      heroImageCredit: "Dan Kamminga / Flickr (CC BY 2.0)",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      bookingLinks: [],
      editorialNote: "Camping zones, periods, and pricing from spagrandprix.com official camping pages. GPtents verified at gptents.com. IntentsGP verified at intentsgp.com. Glamping Green from spagrandprix.com listing. Glass ban and BBQ rules from official circuit camping FAQ. No-departure window (Sun 16:30–19:30) from spagrandprix.com camping terms. Verified June 2026.",
      sport: ["formula_one"],
      moodTags: ["adventure", "social", "budget"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "budget",
      budgetCurrency: "EUR",
      budgetMinCost: "80",
      budgetMaxCost: "1439",
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

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

const PARIS_ID = "488adb47-5327-43e2-8206-d40480301962";
const FRENCH_OPEN_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";
const slug = "court-philippe-chatrier-suzanne-lenglen";

const imageKey = "experiences/hero/french-open-court-chatrier-lenglen.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
const file = readFileSync("Images/French Open 2027 - Court Philippe Chatrier.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

const bodyContent = `Roland-Garros has two show courts, and they don't feel like siblings. Court Philippe-Chatrier is the one everyone means when they say "Center Court" here: 15,225 seats, red clay that's been raked in this same corner of the 16th arrondissement since 1928, and a bowl that was almost entirely rebuilt between 2018 and 2020. It carried a plainer name for most of its life, Court Central, until 2001, when the FFT renamed it for Philippe Chatrier, the federation president who spent the 1970s and 80s fighting to get tennis back into the Olympics. He won that fight in 1988. The court named for him now closes with a roof.

That roof is the real story of the last renovation. Eleven steel trusses, 330 tonnes apiece, slide shut in about 15 minutes when the Paris sky does what it usually does in late May. Before 2020, rain meant a dead afternoon and a rescheduled match. Now Chatrier keeps playing, and something about watching clay-court tennis under an enclosed roof, muffled crowd noise bouncing off steel instead of open sky, changes the atmosphere in a way that's hard to predict until you're sitting in it.

Suzanne-Lenglen sits a short walk away and plays a different role entirely. Built in 1994 as "Court A" before earning Lenglen's name, it holds 10,068 people across an upper and lower circle and got its own retractable roof in the same 2020 project, the second court at Roland-Garros to have one. Lenglen won six Wimbledon titles and six French Championships in the 1920s, dominant enough that the French called her La Divine, and the surface named for her tends to produce the tournament's best second-tier matches: seeded players not yet at Chatrier level, former champions on the way down, the ones fighting hardest to be somewhere else next year.

Ticket categories map directly onto how close you sit to the baseline. On Chatrier and Lenglen, Category Gold and Category 1 run along the lower rows nearest the court, Category 2 climbs into the mid-tier, and outside courts like Simonne-Mathieu sit in their own cheaper bracket entirely. A single day on Chatrier or Lenglen runs somewhere in the €75-198 range depending on category and which day of the tournament, climbing sharply for the final weekend. Hospitality packages through the FFT's own Sodexo Live!-run tiers, Le Pavillon, La Mezzanine, L'Orangerie, sit well above that, with lunch and lounge access built into the price.

Buy through the official Roland-Garros ticketing site first. The FFT runs its own resale marketplace for tickets people can no longer use, sold back at face value, and that's the only resale channel worth trusting. Everything outside it, however official-sounding the name, is a gamble you don't need to take for a ticket this easy to get legitimately.`;

const whyItsSpecial = `Wimbledon has its lawns and its dress code. The US Open has Ashe and its noise. Roland-Garros has clay, and clay changes everything about how these two courts play. The ball sits up higher, rallies run longer, and a five-set match on Chatrier in the tournament's second week can turn into a three-and-a-half-hour war of attrition that a hard court would have settled in half the time. Sitting in Chatrier for that kind of match, in a roofed bowl that didn't exist in this form eight years ago, is watching tennis's slowest, most demanding surface staged in one of its newest arenas.

Lenglen is the better watch for anyone who actually wants to see tennis rather than be seen at it. Smaller, cheaper, and named for a player whose dominance in the 1920s makes modern win streaks look ordinary by comparison, it's where you catch a match that might not make the highlight reel but will be closer, stranger, and more human than whatever's happening next door. I'd rather sit in Lenglen for an entertaining four-set match than fight the Chatrier crowds for a straight-sets blowout on the main show court. Both rooms are the tournament. Only one of them tells you that on the way in.`;

const insiderTips = [
  "Category Gold and Category 1 seats sit in the lower rows on both Chatrier and Lenglen — closest to the clay, but the cheaper Category 2 tier in the upper bowl often gives a better full-court sightline for following rallies rather than just the baseline action in front of you.",
  "The roof closes in around 15 minutes once rain starts — if play is suspended, stay in your seat rather than heading for cover elsewhere in the grounds; the restart is usually faster than people expect once the trusses are shut.",
  "Lenglen's ticket prices run noticeably below Chatrier's for the same day of the tournament, and the standard of tennis in the second week is frequently just as high — a genuinely good-value alternative if Chatrier is sold out or over budget.",
];

const whatToAvoid = `Don't buy from a resale site just because it uses official-sounding branding or shows the Roland-Garros logo — the only sanctioned resale channel is the FFT's own marketplace, which resells returned tickets at face value; anything else carries real counterfeit risk for a ticket this replaceable through legitimate means. And don't assume a Chatrier ticket automatically means better tennis than a Lenglen one on the same day: schedules are set by the tournament based on player status and TV slots, not court quality, so a Lenglen day session can easily outclass a Chatrier one depending on who's drawn where that afternoon.`;

const practicalInfo = {
  address: "2 Avenue Gordon Bennett, 75016 Paris, France",
  website: "https://www.rolandgarros.com, https://tickets.rolandgarros.com",
  hours: "Gates typically open around 09:00-10:00 on match days; check the daily order of play for specific session times",
  costRange: "Cat. 3 (Simonne-Mathieu/outside courts) from €75; Cat. 1-2 (Chatrier/Lenglen) €95-198 for a single day, rising sharply for the final weekend; Hospitality (Le Pavillon/L'Orangerie) €917-1,428/day",
  bookingMethod: "Buy directly via tickets.rolandgarros.com. If sold out, use the FFT's own official resale marketplace on the same site — tickets returned by other buyers, resold at face value. Never buy from a third-party resale site not directly linked from the official domain.",
  reservationsRequired: true,
};

const gettingThere = `Stade Roland-Garros sits in the 16th arrondissement, at the southern edge of the Bois de Boulogne. The closest Métro stop is Porte d'Auteuil (Line 9), a 10-minute walk from the main gates. Porte de Saint-Cloud (Line 9) and Michel-Ange–Molitor (Lines 9 and 10) are both realistic 15-20 minute walk alternatives if Porte d'Auteuil is jammed with match-day crowds. Tournament organisers run additional shuttle buses from nearby Métro stations during peak sessions — check the official site closer to the date for the exact 2027 shuttle points.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Court Philippe-Chatrier & Suzanne-Lenglen",
      subtitle: "Roland-Garros's two show courts — one roofed icon, one clay classic",
      slug,
      experienceType: "sports_venue",
      status: "in_review",
      destinationId: PARIS_ID,
      sportingEventId: FRENCH_OPEN_EVENT_ID,
      neighborhood: "16th arrondissement / Porte d'Auteuil",
      address: "2 Avenue Gordon Bennett, 75016 Paris, France",
      heroImageUrl,
      heroImageAlt: "Court Philippe-Chatrier during a 2023 French Open match, showing the red clay surface and full stadium bowl",
      heroImageCredit: "Remi Mathis, CC BY-SA 4.0",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Court history/capacity from Wikipedia (Stade Roland Garros), worldstadia.com, stade.rolandgarros.com. Ticket categories/pricing from official rolandgarros.com ticketing pages and cross-referenced goaltickets.com pricing guide, 2026 season as proxy for 2027 (not yet on sale). Roof spec (11 trusses, 330t, ~15min close) from rolandgarros.com roof explainer and CNN coverage. Google rating verified via Places API lookup, 4 Sep 2026.",
      googleMapsRating: "4.8",
      googleMapsReviewCount: 2202,
      googleMapsUrl: "https://maps.google.com/?cid=17479968147953352117",
      moodTags: ["iconic", "electric", "classic"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "EUR",
      budgetMinCost: "75",
      budgetMaxCost: "198",
      bestSeasons: ["may"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-04",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: FRENCH_OPEN_EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created:", result.title, "→", result.slug, `(${result.status})`);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

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
const slug = "roland-garros-grounds-pass-tickets";

const imageKey = "experiences/hero/french-open-grounds-pass.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
const file = readFileSync("Images/French Open 2027 - Grounds Pass Simonne Mathieu.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

const bodyContent = `Most first-time Roland-Garros visitors overthink the ticket question. You don't need Chatrier. The Grounds Pass, officially the "Billet Annexe," gets you into every outside court on the grounds plus Court Simonne-Mathieu, and on any given day of the first week that's where half the interesting tennis is actually happening.

Simonne-Mathieu itself is worth the pass alone. Completed in 2019 and built into the adjoining Jardin des Serres d'Auteuil, the court sits four metres below ground level with greenhouses wrapped around all four sides, blending into the botanical garden's existing glasshouses rather than looking like a stadium dropped into a park. It seats 5,000 and it's the most photographed court at the tournament that isn't Chatrier. The court is named for Simonne Mathieu, who won the French Championships in 1938 and 1939 before leading a battalion of the Free French Forces during the war — one of the more remarkable namesakes in tennis.

The Grounds Pass itself doesn't guarantee seats anywhere. Outside-court seating is first-come, general admission, so arriving when gates open gets you an actual seat rather than standing room three rows back. What the pass buys you instead is movement: junior matches, wheelchair tennis, legends exhibitions, qualifying rounds early in the tournament, and the freedom to wander from court to court chasing whichever match has the better crowd reaction that hour. It's the closest Roland-Garros gets to a festival ticket.

Getting one requires patience with the FFT's system, which runs on a ballot rather than first-come-first-served. Registration for the general public draw typically opens in early December and closes mid-month; if you're selected, you're emailed a purchase window in the second half of February, though selection only guarantees a shot at buying, not a specific ticket. A second sales phase, first-come-first-served, opens in late March for Opening Week and outside-court tickets covering the second week. Tickets are digital-only through the official Roland-Garros app — there's no print-at-home option and no physical ticket to carry.

The FFT sells through exactly four official channels: tickets.rolandgarros.com, travel.rolandgarros.com, hospitality.rolandgarros.com, and the tournament's named official agencies. Everything else claiming to sell Roland-Garros tickets, however convincing the branding, sits outside that list.`;

const whyItsSpecial = `The Grounds Pass is the honest way to experience a Grand Slam. Chatrier and Lenglen give you the marquee matches and reserved seating, which is its own kind of good, but it's a fixed, formal experience — you sit down, you watch one match, you leave. The Grounds Pass is the opposite: you're on your feet, moving between courts, deciding for yourself which match is worth staying for based on the noise coming from three courts over.

I'd argue the tennis is genuinely better here more often than people expect. First-week outside-court matches include seeded players who haven't yet earned a slot on Chatrier, former champions playing their way back from injury, and qualifiers who've just fought through three rounds to get here and are playing like it. None of that shows up on a highlights reel, but it's tennis with something real at stake, watched from ten rows back instead of two hundred.

Simonne-Mathieu alone justifies the pass. A tennis court sunk into a working botanical garden, wrapped in greenhouses, is not a design decision any other Grand Slam has made or would make. You could buy a pass just to sit there for an afternoon and it would still be worth it.`;

const insiderTips = [
  "Register for the general public ballot as soon as it opens (typically early December) — selection only grants a purchase window, not a guaranteed ticket, so being in the pool from day one matters more than showing up on the last day of registration.",
  "A second, first-come-first-served sales phase opens in late March specifically for Opening Week and outside-court tickets — if the December ballot doesn't work out, this is a genuine second chance, not a rumor.",
  "Outside-court seating is unreserved — arrive at gate opening rather than mid-morning if you want an actual seat at Simonne-Mathieu or the more popular annex courts rather than standing at the back.",
];

const whatToAvoid = `Don't buy from any site outside the FFT's four official channels (tickets.rolandgarros.com, travel.rolandgarros.com, hospitality.rolandgarros.com, and named official agencies) — Roland-Garros has published its own fraud warnings about counterfeit and black-market resale sites using convincing branding, and a Grounds Pass is affordable enough through legitimate channels that there's no reason to gamble on one. And don't assume a Grounds Pass gets you anywhere near Chatrier or Lenglen even for standing room — those two show courts are entirely separate ticketed products, and Grounds Pass holders cannot enter them under any circumstance, including empty seats mid-match.`;

const practicalInfo = {
  address: "2 Avenue Gordon Bennett, 75016 Paris, France",
  website: "https://tickets.rolandgarros.com",
  hours: "Gates typically open around 09:00-10:00 on match days",
  costRange: "Approx. €45-75 for a single-day Grounds Pass depending on the day of the tournament (2026 reference pricing; 2027 not yet published)",
  bookingMethod: "Register for the general public ballot at tickets.rolandgarros.com, typically open early-to-mid December for the following year's tournament. If not selected, a first-come-first-served sales phase for Opening Week and outside courts opens in late March. Tickets are digital-only via the official Roland-Garros app.",
  reservationsRequired: true,
};

const gettingThere = `Stade Roland-Garros sits in the 16th arrondissement at the edge of the Bois de Boulogne. Porte d'Auteuil (Métro Line 9) is the closest stop, a 10-minute walk from the main entrance. Porte de Saint-Cloud and Michel-Ange–Molitor (both Line 9, the latter also Line 10) are realistic alternatives when the nearest stop is jammed on peak match days.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Roland-Garros Grounds Pass & Match Tickets",
      subtitle: "General admission to every outside court, plus the greenhouse-wrapped Simonne-Mathieu",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: PARIS_ID,
      sportingEventId: FRENCH_OPEN_EVENT_ID,
      neighborhood: "16th arrondissement / Porte d'Auteuil",
      address: "2 Avenue Gordon Bennett, 75016 Paris, France",
      heroImageUrl,
      heroImageAlt: "Court Simonne-Mathieu at Roland-Garros, built into the Jardin des Serres d'Auteuil with greenhouses wrapped around the stadium",
      heroImageCredit: "Jean-Christophe Windland, CC BY-SA 4.0",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Ballot/sale process from rolandgarros.com official ticketing articles (2025/2026 draw explainer). Simonne-Mathieu history from Wikipedia (Court Simonne Mathieu) and rolandgarros.com insider's guide. Fraud-warning sourcing from rolandgarros.com's own 'beware of fraudulent websites' article. Planner ticket tier data (tier1, Ground Pass, USD $53) cross-checked, roughly consistent with cited EUR range. Verified 4 Sep 2026.",
      moodTags: ["energetic", "authentic", "social"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "EUR",
      budgetMinCost: "45",
      budgetMaxCost: "75",
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

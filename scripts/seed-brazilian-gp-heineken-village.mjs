import { config } from "dotenv";
config({ path: ".env.local" });
import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb";
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const slug = "brazilian-gp-heineken-village-" + Date.now().toString(36);

const bodyContent = `Heineken Village sits inside Interlagos itself, in the infield between Bico de Pato, Mergulho, Junção and Subida do Café — the sequence of corners on the circuit's back section. It opened to the public in 2022 and has run every year since as a standalone ticketed zone, separate from the grandstands. You get inside the track boundary here, not just close to it: 30 metres from the cars at points, with sightlines a seated grandstand ticket doesn't offer.

There are two sectors, and they're genuinely different products, not just a price split. The Lawn (Gramado) is open grass with big screens for the parts of the track you can't see directly — food and drink are sold separately, cashless payment only. The Star (Estrela) is a built platform with an open bar (Heineken draft, soft drinks, water) and a finger-food service running through the day, including breakfast. It's also the only part of Heineken Village with ramp access, so it's the sector to book if step-free entry matters.

Both sectors run as a single three-day pass covering the full Friday-to-Sunday programme — first and second practice on Friday, final practice and qualifying Saturday, the race itself Sunday. There's no day-specific ticket. Entry is through the dedicated Heineken Village gate off Avenida Interlagos, next to Gate T, and admission is restricted to 18 and over — Heineken runs this as an adult, drinking-culture space, not a family fan zone, and ID is checked at the gate.

Whichever sector you buy, plan for a full day of open-air exposure. There's some covered structure in the Star sector, but neither sector is a sheltered venue — Interlagos in November swings between hard sun and sudden rain, and the organisers themselves warn attendees to come prepared for both.

Past editions have leaned hard into entertainment on top of the racing: DJ sets running through the weekend, and in 2025 a zipline crossing the lawn plus driver-reflex-style attractions built around F1 minutiae (a Reaction Machine, a mocked-up Pit Board and Pit Wall). The exact line-up of extras changes year to year — Heineken treats it as a rotating festival build, not a fixed installation — but the format (music, games, a crowd that's there as much for the atmosphere as the racing) has held since it opened.

Tickets go on sale through eventim.com.br/f1saopaulo, typically in late November following the prior edition's race weekend — for the 2026 event, sales opened 25 November. This is also, per the official race organiser, one of the sectors most likely to sell out ahead of the weekend itself.`;

const whyItsSpecial = `Most trackside hospitality at a Grand Prix is built around being seen — a suite, a branded lounge, a seat with your name on it. Heineken Village inverts that. It's standing room on grass inside the actual circuit, and it works precisely because it doesn't try to be a grandstand. You're there for proximity to the cars and for the version of race-weekend Brazil that isn't watching from a fixed seat — moving between the DJ stage and the fence, catching a session standing up because you want to, not because you're stuck. The Star sector's open bar gives you a reason to stay put if you want one; the Lawn gives you the freedom not to. Either way, this is Interlagos's own answer to what a fan zone should feel like at a circuit that's always had more atmosphere than most — loud, close to the cars, unmistakably a party as much as a motor race.`;

const insiderTips = [
  "Ticket sales for the following year's Heineken Village typically open in late November, right after that year's race weekend wraps — if you specifically want the Star sector, which has no half-price option and less capacity relative to the Lawn, that opening window is the moment to buy, not closer to November the following year.",
  "If step-free access matters, the Star sector is the one to book — it's the only part of Heineken Village with ramp access; the Lawn is open grass with no built accessible entry.",
];

const whatToAvoid = `Don't assume "Village" means shelter — most of the space, including the entire Lawn sector, is open-air with no guaranteed cover from sun or rain across a full day; bring sun protection and something waterproof regardless of forecast. And don't wait to buy at the gate hoping for last-minute availability — daily capacity is capped, and Heineken Village has sold out ahead of race weekend in past editions before the gates ever opened.`;

const practicalInfo = {
  hours: "Gates open ahead of Friday's first practice session; runs across all three days of the race weekend (exact daily gate times published closer to race week)",
  costRange: "Lawn (Gramado): R$2,480 full price / R$1,240 half-price, 3-day pass, food and drink sold separately. Star (Estrela): R$4,960 flat, 3-day pass, no half-price option, includes open bar and finger food.",
  bookingMethod: "Three-day pass only, no single-day ticket — buy via eventim.com.br/f1saopaulo. 2026 tickets went on sale 25 November 2025; the Star sector has no half-price option and both sectors have sold out ahead of the race weekend in past editions. 18+ only, ID checked at the gate.",
  website: "https://grandepremiosp.f1saopaulo.com.br/heinekenvillage, https://eventim.com.br/f1saopaulo",
};

const gettingThere = "Same circuit access as any Interlagos ticket — Metrô Line 9 to Autódromo, or the F1 Express shuttle — then to the dedicated Heineken Village gate off Avenida Interlagos, next to Gate T.";

try {
  const heroFile = readFileSync("Images/Brazilian GP - Heineken Village pexels-jonathanborba-34835641.jpg");
  const r2Key = "sporting-events/hero/brazilian-grand-prix-heineken-village.jpg";
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: r2Key,
    Body: heroFile,
    ContentType: "image/jpeg",
  }));
  const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;

  const [result] = await db
    .insert(experiences)
    .values({
      title: "Heineken Village",
      subtitle: "A festival zone inside the circuit, 30 metres from the track, open bar in the Star sector",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Interlagos",
      address: "Heineken Village gate, Autódromo José Carlos Pace, Avenida Interlagos, next to Gate T, São Paulo, Brazil",
      heroImageUrl,
      heroImageAlt: "Heineken Village festival zone atmosphere, Brazilian Grand Prix",
      heroImageCredit: "Jonathan Borba, Pexels Licence",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from brasilf1.com's official ticket-info page, f1saopaulo.com.br's official 'Heineken Village' pages (English + 2026 Portuguese edition), and cross-checked 2026 Lawn/Star pricing (R$2,480/R$1,240 half; R$4,960 flat) against two independent dated articles (Grande Prêmio and Band, both 25 Nov 2025) — both agree. No seeded planner_ticket_tier_cost row exists yet for this event, so this pricing was freshly sourced rather than pulled from planner data (flagged to founder as a gap to seed separately if wanted in the Cost spoke). Google Maps rating left empty after a real lookup + retry: the only close-matching listing ('Camarote Heineken Fórmula 1') is a different product (a corporate hospitality box) with just 8 reviews, and the circuit's own 4.6/39,228 rating belongs to Autódromo José Carlos Pace as a whole, already used elsewhere in the pack — not this specific fan zone. Not Concierge-worthy (standard public 3-day pass, no VIP tier/named contact/lead-time trap beyond 'buy at sale opening,' which lives in the public bookingMethod). No GTG/Booking.com affiliate opportunity identified. Added to the confirmed Brazilian GP experience list as #25 on founder confirmation, 12 Sep 2026 — mapped to the 'tickets' spoke.",
      sport: ["formula_one"],
      moodTags: ["energetic", "social"],
      interestCategories: ["sport", "nightlife"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "splurge",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-12",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #25 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

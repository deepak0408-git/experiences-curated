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

const EXPERIENCE_ID = "5e01fae6-a555-421a-aee6-fd3e5a999cae";

const bodyContent = `The Wanderers Stadium sits in Illovo, a short drive south of Sandton, and everyone in South African cricket calls it the Bullring. The nickname isn't decoration. The stadium's steep, close-in stands were built to funnel crowd noise back down onto the pitch, and touring teams have talked for decades about how much louder and more claustrophobic it feels here than at most other Test grounds.

The current stadium dates to 1956, replacing the Old Wanderers ground that used to sit where Johannesburg's main railway station is now. After South Africa's return to international cricket in 1991, the ground went through a serious rebuild, and in 1996 five new floodlight towers, each 65 metres tall, went up to allow day-night cricket. Capacity is reported differently depending on the source — official listings put it around 34,000, though some seating counts land closer to 28,000-30,000 depending on how temporary stands are configured for a given match.

The ground plays a specific way, and it's worth understanding before you sit down. The Wanderers sits at roughly 1,750 metres above sea level, among the highest international grounds anywhere, and the thin air genuinely changes the cricket — the ball carries further off the bat, so even mistimed shots can clear the rope, and this is consistently one of the highest-scoring venues on the calendar. The pitch itself gives fast bowlers real pace and steep bounce, especially with the new ball under overcast skies, when humidity and cloud cover bring proper swing and the Bullring turns into a genuine bowler's minefield. On a hot, sunny day, though, the same surface flattens out fast and becomes a batter's ground. The honest read: check the sky before you predict the cricket, not just the team sheets.

This ground has hosted two finals that matter well beyond South African cricket. The 2003 Cricket World Cup final was played here, Australia beating India comfortably to complete an unbeaten tournament. Four years later, the Wanderers hosted the first-ever T20 World Cup final, India against Pakistan, decided by five runs in one of the format's defining early moments — a full generation of cricket ago now, worth remembering as history rather than a recent highlight. More relevant to the ground's actual character are two records from ODI cricket. On 12 March 2006, South Africa chased down 434 to beat Australia by scoring 438 for 9, still the highest successful run chase in ODI history, with Herschelle Gibbs making 175 off 111 balls in a game widely rated the greatest ODI ever played. Nine years later, on this same square during a 2015 Pink Day fixture, AB de Villiers scored the fastest century in ODI history at the time — 100 off 31 balls, finishing on 149 off just 44 — an innings that's become as central to the Wanderers' identity as the 438 chase.

For the Australia tour in September 2026, the Wanderers hosts the second ODI of the series on 27 September — and this fixture is Pink Day, Cricket South Africa's annual breast cancer awareness match. The tradition began in 2011 during a Test against Australia at this exact ground, inspired by the Sydney Cricket Ground's Jane McGrath Day, and the first Pink Day ODI followed in 2013. The Proteas play in pink kit instead of green and gold, funds raised go to the Charlotte Maxeke Johannesburg Academic Hospital's Breast Care Clinic, and the event has raised in the region of R10 million over its history. It's one of the more genuinely moving fixtures on South Africa's cricket calendar, not just a novelty strip — and it's the same occasion, ten years on, that produced de Villiers' record-breaking innings.

Sandton sits close enough that most visitors base themselves there and treat the Wanderers as a short trip rather than a destination in its own right.`;

const whyItsSpecial = `Most stadiums that claim an intimidating atmosphere are trading on reputation more than physical reality. The Bullring earns it structurally. The stands are close and steep by design, so crowd noise doesn't dissipate, it gets thrown straight back at the players. Touring sides have said as much for years.

What I find genuinely compelling is that the ground's two biggest global moments, the 2003 and 2007 World Cup finals, are now the least representative of what actually makes it special. The real character is in the altitude and the conditions — a ground where the sky decides whether you're watching a bowling masterclass or a run-fest — and in the two ODI records that sit on the same square: the 438 chase in 2006, and de Villiers' 149 off 44 on Pink Day in 2015. One venue, one square, both extremes of what limited-overs cricket can do.`;

const insiderTips = [
  "The Wanderers hosts the 2nd ODI (27 Sep 2026), a day-night fixture — expect an afternoon start running into the evening under lights. This is also Pink Day, Cricket South Africa's breast cancer awareness match, so expect a pink-kitted Proteas side and a fuller, more occasion-driven atmosphere than a standard ODI.",
  "Memorial Stand (Level 2/3) is fully covered and the safest bet if you want shade all day; Memorial Ground Level gets morning sun with afternoon shade. If you're in a western-facing stand for a late-afternoon session, the setting sun can be genuinely blinding — check which side you're booking, not just which tier.",
  "The food at the Wanderers goes well beyond standard stadium fare — look for the Indian food stand specifically, the samosas are consistently rated among the best things to eat on the ground, alongside the more expected burgers, boerewors, and pap-and-braai stalls.",
];

const whatToAvoid = "Don't drive into Sandton during the standard weekday rush windows (7-9am, 4-7pm) expecting normal travel times — Sandton's traffic is genuinely bad at those hours, and a 27 September Saturday ODI mostly avoids this, but check the exact kickoff time against local traffic patterns if you're travelling from further out. Don't underestimate the sun either: Johannesburg sits at 1,700m and September's UV index regularly hits 8-10, a genuine health hazard without protection, and the thin air that helps sixes carry does nothing to soften the sun on an exposed seat for a full afternoon session — sunscreen and a hat aren't optional. And don't treat the 2003/2007 World Cup finals as this ground's current relevant history — both are now roughly two decades old; if you want a genuine sense of what the Wanderers produces today, the 2006 438 chase and de Villiers' 2015 Pink Day century are the more useful reference points.";

const practicalInfo = {
  hours: "2nd ODI: Sunday 27 September 2026, day-night fixture starting 10am local time per official ticketing, running into the evening session under lights. Gates typically open 2-3 hours before the toss.",
  website: "https://www.wanderersclub.co.za, https://tickets.cricket.co.za",
  costRange: "Tickets are on sale now via TicketPro, from ZAR 150 for general admission — grandstand and premium seating tiers priced higher, confirm current tiers on TicketPro as the match approaches.",
  bookingMethod: "Tickets are on sale now through Cricket South Africa's official partner, TicketPro (tickets.cricket.co.za) — search 'South Africa vs Australia - Pink Day' directly. Note: reported ground capacity varies by source (28,000-34,000) depending on stand configuration for the match, which can affect how early a popular fixture like this sells out.",
  reservationsRequired: true,
};

try {
  const imageKey = "experiences/hero/the-bullring-wanderers-test.jpg";
  const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: imageKey,
    Body: readFileSync("Images/Wanderers_Stadium.jpg"),
    ContentType: "image/jpeg",
  }));
  console.log("✓ Uploaded to R2:", heroImageUrl);

  const [result] = await db.update(experiences).set({
    title: "The Bullring — Pink Day ODI at the Wanderers",
    subtitle: "Johannesburg's cricket ground earns its nickname from a design built to amplify noise and pressure",
    heroImageUrl,
    heroImageAlt: "DP World Wanderers Stadium, Johannesburg",
    heroImageCredit: "Wikimedia Commons",
    bodyContent,
    whyItsSpecial,
    insiderTips,
    whatToAvoid,
    practicalInfo,
    editorialNote: "Sources: Wikipedia (Wanderers Stadium, 2007 World Twenty20 final), ESPNcricinfo, thecricscope.com, sa-venues.com, sportsf1.com/thetopbookies.com/fantasykhiladi.com (pitch reports, altitude effect), lionscricket.co.za (seating plan, food offering), wicketstories.com + sportsboom.com (438 chase, 2006), cricket.co.za/pink-day + cricketnews.com + en.wikipedia.org/Pink_ODI (Pink Day history, AB de Villiers 2015 innings), joburgetc.com/sandton-info.co.za (Sandton traffic/safety), climatestotravel.com/weather-atlas.com (September weather, UV index), tickets.cricket.co.za (confirmed live listing, ZAR 150 starting price, 27 Sep 10am kickoff). Verified 15 Jul 2026.",
  }).where(eq(experiences.id, EXPERIENCE_ID)).returning({ id: experiences.id, title: experiences.title });

  console.log("✓ Updated:", result.title, "|", result.id);
} catch (e) {
  console.error("✗ FAILED:", e.message);
  if (e.cause) console.error("CAUSE:", e.cause);
} finally {
  await client.end();
}

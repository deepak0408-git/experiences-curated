import { config } from "dotenv";
config({ path: ".env.local" });

import { writeFileSync } from "fs";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, and, asc } from "drizzle-orm";
import { createElement as h } from "react";
import { renderToBuffer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences, sportingEvents, sportingEventExperiences, sportingEventArchives } from "../schema/database.ts";

// One-off archive snapshot (migrate-from-classic-to-hub-spoke skill §1 step 3),
// run before Hungarian GP's sportingEvents row is renamed to the evergreen
// slug "hungarian-grand-prix" and rolled forward to its 2027 edition.
// Modeled directly on scripts/archive-italian-gp-2026.mjs / archive-wimbledon-2026.mjs.
//
// PACK_EDITORIAL/TOURNAMENT_RHYTHM/INSIDER_TIPS are NOT imported from
// lib/pack-content.ts here — that file has no "hungarian-gp-2026" entry (it
// only covers a handful of events, confirmed empty for Italian GP's own
// archive too, a pre-existing gap in that file, not this script). The real
// classic-pack content lives as private, unexported consts inside
// app/event-pack/[slug]/_components/PackView.tsx (a .tsx file that
// --experimental-strip-types can't parse directly), so the real content is
// inlined below, copied verbatim from that file's "hungarian-gp-2026" keys
// as they stood immediately before this migration (16 Oct 2026).
const PACK_EDITORIAL_HUNGARY = {
  brief:
    "The Hungarian Grand Prix is the calendar's affordability outlier, and once you're standing in the natural bowl the Hungaroring sits in, you understand why that matters more here than it would anywhere else. This is a tight, technical circuit outside Budapest, one reliable overtaking corner at Turn 1, a slow chicane at Turns 6-7 that quietly separates clean laps from scrappy ones, and terrain shaped like an amphitheatre that makes General Admission genuinely good rather than a fallback for people who couldn't afford a seat.\n\nThis pack is built around one idea: Hungary rewards people who don't over-plan the seating question. A General Admission ticket here costs a fraction of what the same tier runs at Spa or Monza, and the hillside gives real sightlines across multiple corners without a fixed seat. Grandstand options exist too — T1 for the corner where overtakes actually happen, the covered Hungaroring Grandstand for shelter and a pit-straight view — but they're an upgrade on a strong base, not a rescue from a weak one. The Ticket Guide experience walks through the full tier comparison; the Where to Sit experience compares the specific stands.\n\nA few things worth knowing before you commit to a plan. Budapest sits 25 minutes from the circuit, close enough that basing there and commuting by metro and suburban rail is not just viable but genuinely the default choice most visitors make. Late July in Hungary runs hot, regularly past 30°C, with afternoon storms that don't always announce themselves. And because prices here are so much lower than the rest of the calendar, it's easy to assume availability holds longer than it actually does — the covered grandstand and the popular corners sell out weeks ahead even while General Admission tickets remain available right up to the gates. The sections here follow the shape of the weekend — what to sort before you travel, where to watch from, where to stay, and what Budapest itself offers beyond the circuit.",
  sectionIntros: {
    "Before you go":
      "Tickets are the first thing to sort, and Hungary's reputation for being the calendar's cheapest weekend means people underestimate how fast the popular options move. The Hungaroring Grandstand, the only covered stand at the circuit, sells out well ahead of race weekend precisely because shelter matters in a Hungarian July. General Admission is the one tier that survives, remaining available closer to race weekend than anywhere else on the calendar. For transport, the M2 metro plus HÉV suburban rail plus a free circuit shuttle from Kerepes is the standard route from Budapest — no booking required beyond a standard BKK ticket. Download the F1 app before you arrive for session timing and any weather-driven schedule changes.",
    "On the grounds":
      "The Hungaroring's natural bowl means General Admission genuinely competes with a grandstand seat here, which isn't true at most circuits. The strategic question is less about picking one fixed spot and more about deciding how much comfort you want to add on top of a strong free-roaming base. T1 is the corner where overtaking reliably happens; the Chicane at Turns 6-7 is where laps quietly fall apart under pressure; the covered Hungaroring Grandstand trades corner-specific drama for pit-straight visibility and shelter from the heat. The Where to Sit and Ticket Guide experiences here cover the comparison in full — read those before booking a specific tier.",
    "Where to stay":
      "Budapest is close enough, 25 minutes by metro and suburban rail, that basing in the city rather than near the circuit is the default choice for most visitors, and Pest specifically, District V, VI, or VII near an M2 stop, is the practical base. The Four Seasons Gresham Palace is the standout if budget allows, a genuine five-star stay on the Danube. Gödöllő, a small town 10km from the circuit, is the practical alternative if a shorter race-day commute and an easier trip home matter more than city-centre nightlife. Zengo Camping, right behind the final corner, is the cheapest and closest option of all for anyone happy to trade comfort for proximity.",
    "Where to eat":
      "Budapest does the heavy lifting here, the circuit itself has limited food options beyond the Fan Zone stalls. Gettó Gulyás in the Jewish Quarter does traditional Hungarian goulash properly, tender beef and real paprika rather than a tourist shortcut. Stand25 Bisztró, across the river in Buda, earned a Michelin Bib Gourmand for freestyle Hungarian cooking with a Mediterranean edge, worth the detour for one exceptional meal. Both need a reservation, especially on weekend evenings during race week.",
    "The neighbourhood":
      "Budapest itself is worth building real time around, not just an evening after each day's session. Széchenyi Thermal Bath, Europe's largest medicinal bath complex, is the genuine antidote to three days of circuit heat and crowds. Szimpla Kert, the original Budapest ruin bar, anchors the Jewish Quarter's nightlife in a converted, once-condemned stove factory. And Castle Hill, on the Buda side, Fisherman's Bastion, Buda Castle, the funicular, and the Hungarian Parliament, is a full day trip in its own right if you're extending the visit beyond race weekend.",
  },
  localInfo: [
    { label: "Address", value: "Hungaroring, 2146 Mogyoród, Hungary", href: "https://maps.app.goo.gl/PejpqtEjRyMwv5gJ7", linkLabel: "Open in Maps" },
    { label: "Official site", value: "formula1.com/en/racing/2026/hungary", href: "https://www.formula1.com/en/racing/2026/hungary", linkLabel: "Visit" },
    { label: "Ticketing", value: "Official tickets via Formula 1 or f1hungary.com — the calendar's most affordable weekend, GA from approx. €72/3-day. The covered Hungaroring Grandstand sells out first.", href: "https://tickets.formula1.com/en/f1-3277-hungary", linkLabel: "Buy tickets" },
    { label: "Getting to the circuit", value: "M2 metro to Örs vezér tere, then HÉV suburban rail toward Kerepes, then a free shuttle bus to Gate 3. Standard BKK public transport ticket covers the metro and HÉV legs.", href: "https://bkk.hu", linkLabel: "BKK transport info" },
    { label: "Gates", value: "Typically open around 8am on race weekend days. Shuttle bus operating hours vary by day — confirm current times via f1hungary.com closer to race weekend." },
    { label: "What to bring", value: "Sun protection and water — most of the natural bowl has limited shade. A light waterproof for the chance of a Hungarian July storm. Comfortable shoes if you're planning to roam the General Admission hillside." },
    { label: "Weather", value: "Late July regularly pushes past 30°C, with afternoon storms that can arrive without much warning.", href: "https://www.accuweather.com/en/hu/budapest/187423/weather-forecast/187423", linkLabel: "AccuWeather forecast" },
    { label: "Emergencies", value: "Emergency services: 112 · Nearest major hospital: Péterfy Sándor Utcai Hospital and Trauma Center, Péterfy Sándor utca 8-20, Budapest" },
  ],
  experienceOrder: {
    "On the grounds": ["Where to Sit", "F1 Fan Lounge", "Your Hungarian GP Ticket Guide", "The Chicane", "General Admission", "Paddock Club"],
  },
};

const TOURNAMENT_RHYTHM_HUNGARY = [
  {
    label: "Friday 24 Jul — Practice 1 & 2",
    body: "A standard weekend, no sprint format, two practice sessions on Friday and the quietest day on circuit. This is the day to walk the natural bowl and work out which part of the General Admission hillside actually suits you, the terrain shifts the sightlines more than you'd expect from a flat map. If you're weighing a grandstand for the rest of the weekend, use Friday to stand where you're considering booking and see how it actually feels before committing.",
  },
  {
    label: "Saturday 25 Jul — Practice 3 & Qualifying",
    body: "FP3 in the morning is the last real setup window before parc ferme rules apply. Qualifying in the afternoon is the session most Hungaroring regulars prioritise given the choice, single-lap efforts expose the technical differences between drivers through the chicane and T1 far more clearly than race laps with traffic in the mix. If you can only justify a grandstand ticket for one session, make it qualifying.",
  },
  {
    label: "Sunday 26 Jul — Race Day",
    body: "Race start is 15:00 local time. Arrive early if you're on General Admission, the best hillside positions near T1 and the final corner fill through the morning. This circuit is one of the hardest on the calendar to pass on, which makes the opening laps and any Turn 1 action disproportionately important, most positions don't change hands again until late-race strategy plays out. Budget extra time after the flag if you're heading back to Budapest, the M2 and HÉV both carry a heavy crowd surge in the hour after the race, and the shuttle queues from Gate 3 build fast.",
  },
];

const INSIDER_TIPS_HUNGARY = {
  "Where to Sit": [
    "If you can only book one grandstand, T1 gives the highest chance of seeing an actual overtake, it's the circuit's one reliable passing zone.",
    "Weather-check your dates before booking an uncovered stand — if any forecast shows rain risk, the Hungaroring Grandstand is worth the premium purely for the roof.",
    "Apex 1 keeps cars in view onto the main straight; Apex 2 sits further back and loses the sightline right at the corner exit, check the seat plan before choosing.",
  ],
  "F1 Fan Lounge": [
    "Use the lounge's air conditioning strategically, retreat there between sessions rather than sitting in the grandstand heat all day.",
    "The Fan Lounge includes a fixed Hungaroring Grandstand seat, check the seat plan so you know which part of the main straight you'll actually be watching from.",
  ],
  "Ticket Guide": [
    "Book the Hungaroring Grandstand (the only covered stand) as early as you can if weather cover matters, it sells out faster than its price tier would suggest.",
    "General Admission here is genuinely strong rather than a fallback, the natural bowl terrain gives real sightlines that GA doesn't offer at flatter circuits.",
  ],
  "The Chicane": [
    "If you want the widest view of the section, book Chicane 3, it sits highest and takes in the run from Turn 5 through the chicane in one sightline.",
    "Watch Turn 5 as cars set up for the chicane, not just the chicane itself, a bad line into Turn 5 is usually what causes the visible mistake at Turns 6-7.",
  ],
  "General Admission": [
    "Arrive as early as gates allow on race day if you want a hillside spot near T1 or the final corner, the most popular natural viewing areas fill up hours before lights out.",
    "Bring a portable stool or blanket, most GA viewing areas are grass banking rather than paved standing room, and race weekend regularly hits 30°C plus.",
  ],
  "Paddock Club — Above": [
    "Book the Aramco Pit Lane Walk time slot as early in your first day as you can, it's a fixed daily window and easy to miss if you arrive late from Budapest.",
    "Ask specifically whether your package includes a named team suite or the shared F1 Experiences suite, the atmosphere and access differ.",
    "Parking passes are issued one per four guests, coordinate who's driving before race morning if you're travelling as a group.",
  ],
  "Four Seasons Gresham Palace": [
    "Ask for a river-facing room specifically when booking, and ask about the Royal Suite if the trip is a genuine splurge.",
    "Book a treatment at the spa even for a short stay, the Touch of the Earth experience uses Omorovicza, a Hungarian brand most guests haven't encountered before.",
  ],
  "Camping at the Circuit": [
    "Bring your own shade, the field has none, and race weekend temperatures regularly exceed 30°C during the day.",
    "Budget separately for electricity (€15/night) and the per-person visitor's tax if you want power for a fridge or fan.",
  ],
  "Gödöllő": [
    "Confirm the shuttle bus drop-off point (Gödöllő Railway Station) is genuinely walking distance from your specific hotel before booking.",
    "If you want a rest day away from the circuit, the Grassalkovich Palace and its grounds are a short walk from the hotel.",
  ],
  "A Day in Budapest": [
    "Book Hungarian Parliament tickets online before you arrive, independent visits aren't allowed and same-day tickets routinely sell out in July.",
    "Visit Fisherman's Bastion before 9am if possible, it's free and largely empty at that hour before the tour groups arrive.",
  ],
  "Staying in Pest": [
    "If you can't decide, default to District VI (Terézváros), it's the balance point between District V's formality and District VII's noise.",
    "Search specifically for hotels within walking distance of an M2 metro stop, this single filter does more for your race-day morning than almost any other accommodation decision.",
  ],
  "Szimpla Kert": [
    "Go on a Sunday morning if you can fit it in, the farmers' market inside Szimpla is a genuinely different experience from the nightly bar crowd.",
    "Budget more time than you think, the venue's maze of rooms and courtyards means a quick one drink stop rarely stays quick.",
  ],
  "Széchenyi Thermal Bath": [
    "Buy a skip-the-line ticket online in advance via szechenyibath.hu, the entrance queue on a summer weekend can run long during race week.",
    "Bring a padlock for the lockers if you have one, and expect a deposit-and-return system for towels if you don't bring your own.",
  ],
  "Gettó Gulyás": [
    "Call ahead (+36 20 376 4480) rather than walking in, especially on weekend evenings when the Jewish Quarter crowd is out in force.",
    "Save room for the túrógombóc, it's listed as the house specialty for a reason and easy to skip if you fill up on the goulash portions first.",
  ],
  "Getting to the Hungaroring": [
    "Note the free shuttle only runs from Kerepes station on the way out, but from Gate 3 to Gödöllő station on the way back, these are two different stations.",
    "Build in slack for the shuttle bus queue after the race finishes, tens of thousands of people are trying to leave at once.",
  ],
  "Stand25": [
    "Confirm the Buda location (Attila út 10) before heading out, if you're used to the old Downtown Market stall reputation, it's easy to assume it's still on the Pest side.",
    "Because it's fixed-menu only with no à la carte, check the current course options online before booking if you have dietary restrictions.",
  ],
};

const BUDGET_LABELS = { free: "Free", budget: "Budget", moderate: "Mid-range", splurge: "Splurge", luxury: "Luxury" };
const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", backgroundColor: "#FFFFFF", padding: 48, color: "#171717" },
  brand: { fontSize: 8, fontFamily: "Helvetica-Bold", letterSpacing: 2, textTransform: "uppercase", color: "#A3A3A3", marginBottom: 32 },
  eventName: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "#171717", marginBottom: 4 },
  dateLabel: { fontSize: 11, color: "#6A6A6A", marginBottom: 32 },
  divider: { borderBottom: "1 solid #E5E5E5", marginBottom: 24 },
  sectionHeading: { fontSize: 8, fontFamily: "Helvetica-Bold", letterSpacing: 1.5, textTransform: "uppercase", color: "#A3A3A3", marginBottom: 8, borderBottom: "1 solid #E5E5E5", paddingBottom: 5 },
  overviewText: { fontSize: 11, color: "#525252", lineHeight: 1.7, marginBottom: 20 },
  briefLine: { fontSize: 11, color: "#525252", lineHeight: 1.6, marginBottom: 5 },
  localInfoRow: { flexDirection: "row", paddingVertical: 5, borderBottom: "1 solid #F0F0F0" },
  localInfoLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#525252", width: 110, flexShrink: 0 },
  localInfoValue: { fontSize: 9, color: "#525252", lineHeight: 1.5, flex: 1 },
  rhythmEntry: { marginBottom: 10 },
  rhythmLabel: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#171717", marginBottom: 3 },
  rhythmBody: { fontSize: 10, color: "#525252", lineHeight: 1.6 },
  expCard: { marginBottom: 14, paddingBottom: 14, borderBottom: "1 solid #F0F0F0" },
  expTitle: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#171717", marginBottom: 3 },
  expSubtitle: { fontSize: 10, color: "#525252", marginBottom: 4, lineHeight: 1.5 },
  expMeta: { fontSize: 9, color: "#A3A3A3", marginBottom: 4 },
  expBody: { fontSize: 10, color: "#525252", lineHeight: 1.6, marginBottom: 4 },
  tipLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#A3A3A3", letterSpacing: 1, textTransform: "uppercase", marginTop: 4, marginBottom: 2 },
  tipText: { fontSize: 9, color: "#525252", lineHeight: 1.5 },
  footer: { position: "absolute", bottom: 28, left: 48, right: 48, fontSize: 7, color: "#A3A3A3", textAlign: "center" },
});
function splitParas(text) {
  if (!text) return [];
  return text.split(/\n+/).filter(Boolean);
}

function buildPackPdfDocument({ eventName, editorialOverview, preTripBriefLines, preTripBriefLiveAt, sections, isBrief, userEmail, dateStr, localInfo, rhythmEntries }) {
  const children = [
    h(Text, { key: "brand", style: styles.brand }, "Experiences | Curated"),
    h(Text, { key: "eventName", style: styles.eventName }, eventName),
    h(Text, { key: "dateLabel", style: styles.dateLabel }, `${isBrief ? "Travel Brief" : "Full Pack"} · Downloaded ${dateStr}`),
    h(View, { key: "divider", style: styles.divider }),
  ];

  if (editorialOverview) {
    children.push(h(View, { key: "overview", style: { marginBottom: 20 } },
      h(Text, { style: styles.sectionHeading }, "Overview"),
      h(Text, { style: styles.overviewText }, editorialOverview)
    ));
  }

  if (preTripBriefLiveAt && preTripBriefLines && preTripBriefLines.length > 0) {
    children.push(h(View, { key: "brief", style: { marginBottom: 24 } }, [
      h(Text, { key: "h", style: styles.sectionHeading }, "Pre-Trip Brief"),
      ...preTripBriefLines.map((line, i) => h(Text, { key: i, style: styles.briefLine }, `• ${line}`)),
    ]));
  }

  if (localInfo.length > 0) {
    children.push(h(View, { key: "localInfo", style: { marginBottom: 24 } }, [
      h(Text, { key: "h", style: styles.sectionHeading }, "Quick Reference"),
      ...localInfo.filter((row) => !["Best transport", "Weather"].includes(row.label)).map((row, i) =>
        h(View, { key: i, style: styles.localInfoRow }, [
          h(Text, { key: "l", style: styles.localInfoLabel }, row.label),
          h(Text, { key: "v", style: styles.localInfoValue }, row.value),
        ])
      ),
    ]));
  }

  if (!isBrief && rhythmEntries.length > 0) {
    children.push(h(View, { key: "rhythm", style: { marginBottom: 24 } }, [
      h(Text, { key: "h", style: styles.sectionHeading }, "How It Unfolds"),
      ...rhythmEntries.map((entry, i) => h(View, { key: i, style: styles.rhythmEntry }, [
        h(Text, { key: "l", style: styles.rhythmLabel }, entry.label),
        h(Text, { key: "b", style: styles.rhythmBody }, entry.body),
      ])),
    ]));
  }

  sections.forEach((section) => {
    children.push(h(View, { key: section.name }, [
      h(Text, { key: "h", style: [styles.sectionHeading, { marginTop: 20 }] }, section.name),
      ...section.items.map((exp) => {
        const tips = Array.isArray(exp.insiderTips) ? exp.insiderTips : [];
        const info = exp.practicalInfo;
        const budget = exp.budgetTier ? (BUDGET_LABELS[exp.budgetTier] ?? exp.budgetTier) : null;
        const meta = [exp.neighborhood, budget].filter(Boolean).join("  ·  ");
        const cardChildren = [
          h(Text, { key: "title", style: styles.expTitle }, exp.title),
        ];
        if (exp.subtitle) cardChildren.push(h(Text, { key: "subtitle", style: styles.expSubtitle }, exp.subtitle));
        if (meta) cardChildren.push(h(Text, { key: "meta", style: styles.expMeta }, meta));
        if (!isBrief && exp.bodyContent) {
          splitParas(exp.bodyContent).slice(0, 3).forEach((para, i) => cardChildren.push(h(Text, { key: `body${i}`, style: styles.expBody }, para)));
        }
        if (tips.length > 0) {
          cardChildren.push(h(View, { key: "tips", style: { marginTop: 4 } }, [
            h(Text, { key: "label", style: styles.tipLabel }, "Worth knowing"),
            ...tips.map((tip, i) => h(Text, { key: i, style: styles.tipText }, `· ${tip}`)),
          ]));
        }
        if (info?.hours) cardChildren.push(h(Text, { key: "hours", style: [styles.tipText, { marginTop: 3 }] }, `Hours: ${info.hours}`));
        return h(View, { key: exp.id, style: styles.expCard }, cardChildren);
      }),
    ]));
  });

  children.push(h(Text, { key: "footer", style: styles.footer }, `experiences-curated.com · For personal use only · Downloaded by ${userEmail}`));

  return h(Document, { title: isBrief ? `${eventName} — Travel Brief` : `${eventName} — Full Pack`, author: "Experiences | Curated" },
    h(Page, { size: "A4", style: styles.page }, children)
  );
}

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
const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

const HUNGARIAN_GP_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const ARCHIVE_SLUG = "hungarian-gp-2026"; // the real, dated slug this edition traded under
const SEASON_YEAR = 2026;

const SECTION_MAP = {
  transit: "Before you go",
  fan_experience: "On the grounds",
  sports_venue: "On the grounds",
  event: "On the grounds",
  accommodation: "Where to stay",
  dining: "Where to eat",
  neighborhood: "The neighbourhood",
  day_trip: "The neighbourhood",
  activity: "The neighbourhood",
  cultural_site: "The neighbourhood",
  multi_day: "The neighbourhood",
  natural_wonder: "The neighbourhood",
};
const SECTION_ORDER = ["Before you go", "On the grounds", "Where to stay", "Where to eat", "The neighbourhood"];

const [event] = await db.select().from(sportingEvents).where(eq(sportingEvents.id, HUNGARIAN_GP_ID));
if (!event) throw new Error("Hungarian GP event row not found");
if (event.slug !== "hungarian-gp-2026") {
  console.warn(`⚠ Current live slug is "${event.slug}", not "hungarian-gp-2026" — continuing anyway, archive is keyed by ID + seasonYear, not slug.`);
}

console.log("Archiving:", { id: event.id, name: event.name, seasonYear: event.seasonYear, startDate: event.startDate, endDate: event.endDate });

// --- 1. PDF (full pack, classic-format content) ---
const exps = await db
  .select({
    id: experiences.id,
    title: experiences.title,
    subtitle: experiences.subtitle,
    experienceType: experiences.experienceType,
    budgetTier: experiences.budgetTier,
    neighborhood: experiences.neighborhood,
    whyItsSpecial: experiences.whyItsSpecial,
    bodyContent: experiences.bodyContent,
    insiderTips: experiences.insiderTips,
    practicalInfo: experiences.practicalInfo,
    packRank: sportingEventExperiences.packRank,
  })
  .from(experiences)
  .innerJoin(sportingEventExperiences, and(eq(sportingEventExperiences.experienceId, experiences.id), eq(sportingEventExperiences.sportingEventId, event.id)))
  .where(eq(experiences.status, "published"))
  .orderBy(asc(sportingEventExperiences.packRank));

const sections = SECTION_ORDER.map((name) => ({
  name,
  items: exps.filter((e) => SECTION_MAP[e.experienceType] === name),
})).filter((s) => s.items.length > 0);

const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
const editorial = PACK_EDITORIAL_HUNGARY;
const localInfo = editorial?.localInfo ?? [];
const rhythmEntries = TOURNAMENT_RHYTHM_HUNGARY ?? [];

const docElement = buildPackPdfDocument({
  eventName: event.name,
  editorialOverview: event.editorialOverview,
  preTripBriefLines: event.preTripBriefLines,
  preTripBriefLiveAt: event.preTripBriefLiveAt,
  sections,
  isBrief: false,
  userEmail: "archive@internal",
  dateStr,
  localInfo,
  rhythmEntries,
});

const pdfBuffer = await renderToBuffer(docElement);
console.log(`✓ PDF rendered: ${(pdfBuffer.length / 1024).toFixed(0)} KB`);

const pdfKey = `sporting-events/archive/hungarian-gp-${SEASON_YEAR}.pdf`;
await r2.send(new PutObjectCommand({ Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME, Key: pdfKey, Body: pdfBuffer, ContentType: "application/pdf" }));
const pdfUrl = `${R2_PUBLIC_URL}/${pdfKey}`;
console.log("✓ PDF uploaded:", pdfUrl);

// --- 2. JSON (structured record — event row + full experience content + pricing) ---
const jsonPayload = {
  archivedAt: new Date().toISOString(),
  seasonYear: SEASON_YEAR,
  event: {
    id: event.id,
    name: event.name,
    slug: event.slug,
    tournamentSeries: event.tournamentSeries,
    editionYear: event.editionYear,
    seasonYear: event.seasonYear,
    startDate: event.startDate,
    endDate: event.endDate,
    venueName: event.venueName,
    venueAddress: event.venueAddress,
    packCurrency: event.packCurrency,
    packFormat: event.packFormat,
    editorialOverview: event.editorialOverview,
  },
  pricing: {
    note: "Real display prices at time of archive — see PACK_PRICING (classic, lib/packPricing.ts) for hungarian-gp-2026",
    earlyBirdDisplay: event.earlyBirdDisplay,
    standardDisplay: event.standardDisplay,
  },
  experiences: exps.map((e) => ({
    id: e.id,
    title: e.title,
    subtitle: e.subtitle,
    experienceType: e.experienceType,
    budgetTier: e.budgetTier,
    neighborhood: e.neighborhood,
    packRank: e.packRank,
    whyItsSpecial: e.whyItsSpecial,
    bodyContent: e.bodyContent,
    insiderTips: e.insiderTips,
    practicalInfo: e.practicalInfo,
  })),
  editorial,
  tournamentRhythm: rhythmEntries,
  insiderTips: INSIDER_TIPS_HUNGARY,
};

const jsonBuffer = Buffer.from(JSON.stringify(jsonPayload, null, 2));
const jsonKey = `sporting-events/archive/hungarian-gp-${SEASON_YEAR}.json`;
await r2.send(new PutObjectCommand({ Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME, Key: jsonKey, Body: jsonBuffer, ContentType: "application/json" }));
const jsonUrl = `${R2_PUBLIC_URL}/${jsonKey}`;
console.log("✓ JSON uploaded:", jsonUrl);

writeFileSync(`scratch-hungarian-gp-${SEASON_YEAR}-archive.json`, jsonBuffer);

// --- 3. Record the archive row ---
const [archiveRow] = await db
  .insert(sportingEventArchives)
  .values({ sportingEventId: event.id, seasonYear: SEASON_YEAR, pdfUrl, jsonUrl })
  .onConflictDoUpdate({
    target: [sportingEventArchives.sportingEventId, sportingEventArchives.seasonYear],
    set: { pdfUrl, jsonUrl, archivedAt: new Date() },
  })
  .returning();

console.log("✓ Archive row recorded:", archiveRow);

await client.end();

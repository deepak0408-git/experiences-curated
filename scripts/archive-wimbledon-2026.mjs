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
import { PACK_EDITORIAL, TOURNAMENT_RHYTHM } from "../lib/pack-content.ts";

// PackPdfDocument.tsx can't be imported directly here (--experimental-strip-types
// doesn't parse JSX), so its layout is rebuilt with createElement calls below —
// same styles/structure/field mapping as app/api/pack/pdf/PackPdfDocument.tsx,
// kept in sync by hand since this is a one-off script, not a shared module.
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

// One-off year-end archive snapshot (Operations Checklist T2 #3), run
// manually right before Wimbledon's sportingEvents row is reused/updated
// for the 2027 edition. Mirrors app/api/pack/pdf/route.ts's "full" mode
// query and PDF assembly directly (no HTTP/auth context needed for a
// script) — same SECTION_MAP/SECTION_ORDER, same PACK_EDITORIAL/
// TOURNAMENT_RHYTHM source keyed on the OLD "wimbledon-2026" slug (still
// intact in lib/pack-content.ts, preserved deliberately). Captures the
// classic-pack edition, since that's the real format 2026 buyers
// experienced — packFormat has not gone live as hub_and_spoke for any real
// purchaser as of this snapshot.
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

const WIMBLEDON_ID = "8bb7090e-1ec7-4c3f-b4e2-7fd6bf9942cf";
const ARCHIVE_SLUG = "wimbledon-2026"; // the real, dated slug this edition traded under — the PACK_EDITORIAL/TOURNAMENT_RHYTHM key
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

const [event] = await db.select().from(sportingEvents).where(eq(sportingEvents.id, WIMBLEDON_ID));
if (!event) throw new Error("Wimbledon event row not found");
if (event.slug !== "wimbledon") {
  console.warn(`⚠ Current live slug is "${event.slug}", not "wimbledon" — continuing anyway, archive is keyed by ID + seasonYear, not slug.`);
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
const editorial = PACK_EDITORIAL[ARCHIVE_SLUG];
const localInfo = editorial?.localInfo ?? [];
const rhythmEntries = TOURNAMENT_RHYTHM[ARCHIVE_SLUG] ?? [];

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

const pdfKey = `sporting-events/archive/wimbledon-${SEASON_YEAR}.pdf`;
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
    note: "Real display prices at time of archive — see PACK_PRICING (classic, lib/packPricing.ts) for wimbledon-2026",
    earlyBirdDisplay: "US$15",
    standardDisplay: "US$25",
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
};

const jsonBuffer = Buffer.from(JSON.stringify(jsonPayload, null, 2));
const jsonKey = `sporting-events/archive/wimbledon-${SEASON_YEAR}.json`;
await r2.send(new PutObjectCommand({ Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME, Key: jsonKey, Body: jsonBuffer, ContentType: "application/json" }));
const jsonUrl = `${R2_PUBLIC_URL}/${jsonKey}`;
console.log("✓ JSON uploaded:", jsonUrl);

// Also keep a local copy for immediate inspection
writeFileSync(`scratch-wimbledon-${SEASON_YEAR}-archive.json`, jsonBuffer);

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

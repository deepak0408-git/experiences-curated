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

// rollover-event-into-next-year skill, §1. Run BEFORE Mexico City GP's
// sportingEvents row is rolled forward from 2026 to 2027. Zero purchases
// exist for this event, same as US GP — archived anyway for a consistent
// audit trail. Modeled on scripts/archive-singapore-gp-2026.mjs /
// scripts/archive-us-grand-prix-2026.mjs.
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

function buildPackPdfDocument({ eventName, editorialOverview, preTripBriefLines, preTripBriefLiveAt, sections, userEmail, dateStr }) {
  const children = [
    h(Text, { key: "brand", style: styles.brand }, "Experiences | Curated"),
    h(Text, { key: "eventName", style: styles.eventName }, eventName),
    h(Text, { key: "dateLabel", style: styles.dateLabel }, `Full Pack · Downloaded ${dateStr}`),
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
        if (exp.bodyContent) {
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

  return h(Document, { title: `${eventName} — Full Pack`, author: "Experiences | Curated" },
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

const MEXICO_CITY_GP_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a";
const SEASON_YEAR = 2026;

const [event] = await db.select().from(sportingEvents).where(eq(sportingEvents.id, MEXICO_CITY_GP_ID));
if (!event) throw new Error("Mexico City GP event row not found");
if (event.editionYear !== 2026) {
  throw new Error(`Refusing to archive — editionYear is already ${event.editionYear}, expected 2026. Row may have already been rolled forward; archive must run BEFORE rollover.`);
}

console.log("Archiving (read live off the row, pre-rollover):", { id: event.id, name: event.name, editionYear: event.editionYear, startDate: event.startDate, endDate: event.endDate });

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

const exps = await db
  .select({
    id: experiences.id,
    slug: experiences.slug,
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

console.log(`✓ ${exps.length} published experiences linked for the 2026 edition`);

const sections = SECTION_ORDER.map((name) => ({
  name,
  items: exps.filter((e) => SECTION_MAP[e.experienceType] === name),
})).filter((s) => s.items.length > 0);

const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

const docElement = buildPackPdfDocument({
  eventName: event.name,
  editorialOverview: event.editorialOverview,
  preTripBriefLines: event.preTripBriefLines,
  preTripBriefLiveAt: event.preTripBriefLiveAt,
  sections,
  userEmail: "archive@internal",
  dateStr,
});

const pdfBuffer = await renderToBuffer(docElement);
console.log(`✓ PDF rendered: ${(pdfBuffer.length / 1024).toFixed(0)} KB`);

const pdfKey = `sporting-events/archive/mexico-city-grand-prix-${SEASON_YEAR}.pdf`;
await r2.send(new PutObjectCommand({ Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME, Key: pdfKey, Body: pdfBuffer, ContentType: "application/pdf" }));
const pdfUrl = `${R2_PUBLIC_URL}/${pdfKey}`;
console.log("✓ PDF uploaded:", pdfUrl);

const jsonPayload = {
  archivedAt: new Date().toISOString(),
  seasonYear: SEASON_YEAR,
  note: "Archived BEFORE rollover (correct order) — event fields below read live off the row, not hardcoded from memory. Zero purchases existed for this event at archive time; archived anyway for a consistent audit trail.",
  event: {
    id: event.id,
    name: event.name,
    slug: event.slug,
    editionYear: event.editionYear,
    startDate: event.startDate,
    endDate: event.endDate,
    venueName: event.venueName,
    venueAddress: event.venueAddress,
    packCurrency: event.packCurrency,
    packFormat: event.packFormat,
    editorialOverview: event.editorialOverview,
    earlyBirdDisplay: event.earlyBirdDisplay,
    standardDisplay: event.standardDisplay,
  },
  experiences: exps.map((e) => ({
    id: e.id,
    slug: e.slug,
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
};

const jsonBuffer = Buffer.from(JSON.stringify(jsonPayload, null, 2));
const jsonKey = `sporting-events/archive/mexico-city-grand-prix-${SEASON_YEAR}.json`;
await r2.send(new PutObjectCommand({ Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME, Key: jsonKey, Body: jsonBuffer, ContentType: "application/json" }));
const jsonUrl = `${R2_PUBLIC_URL}/${jsonKey}`;
console.log("✓ JSON uploaded:", jsonUrl);

writeFileSync(`scratch-mexico-city-grand-prix-${SEASON_YEAR}-archive.json`, jsonBuffer);

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

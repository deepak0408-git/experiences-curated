import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const BUDGET_LABELS: Record<string, string> = {
  free: "Free",
  budget: "Budget",
  moderate: "Mid-range",
  splurge: "Splurge",
  luxury: "Luxury",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
    padding: 48,
    color: "#171717",
  },
  brand: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#A3A3A3",
    marginBottom: 32,
  },
  eventName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#171717",
    marginBottom: 4,
  },
  dateLabel: {
    fontSize: 11,
    color: "#6A6A6A",
    marginBottom: 32,
  },
  divider: {
    borderBottom: "1 solid #E5E5E5",
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#A3A3A3",
    marginBottom: 8,
    borderBottom: "1 solid #E5E5E5",
    paddingBottom: 5,
  },
  overviewText: {
    fontSize: 11,
    color: "#525252",
    lineHeight: 1.7,
    marginBottom: 20,
  },
  briefLine: {
    fontSize: 11,
    color: "#525252",
    lineHeight: 1.6,
    marginBottom: 5,
  },
  expCard: {
    marginBottom: 14,
    paddingBottom: 14,
    borderBottom: "1 solid #F0F0F0",
  },
  expTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#171717",
    marginBottom: 3,
  },
  expSubtitle: {
    fontSize: 10,
    color: "#525252",
    marginBottom: 4,
    lineHeight: 1.5,
  },
  expMeta: {
    fontSize: 9,
    color: "#A3A3A3",
    marginBottom: 4,
  },
  expBody: {
    fontSize: 10,
    color: "#525252",
    lineHeight: 1.6,
    marginBottom: 4,
  },
  tipLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#A3A3A3",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 4,
    marginBottom: 2,
  },
  tipText: {
    fontSize: 9,
    color: "#525252",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 48,
    right: 48,
    fontSize: 7,
    color: "#A3A3A3",
    textAlign: "center",
  },
});

function truncate(str: string | null | undefined, max: number): string {
  if (!str) return "";
  return str.length > max ? str.slice(0, max) + "…" : str;
}

function splitParas(text: string | null | undefined): string[] {
  if (!text) return [];
  return text.split(/\n+/).filter(Boolean);
}

type Experience = {
  id: string;
  title: string;
  subtitle: string | null;
  experienceType: string;
  budgetTier: string | null;
  neighborhood: string | null;
  whyItsSpecial: string | null;
  bodyContent: string | null;
  insiderTips: unknown;
  practicalInfo: unknown;
};

type Section = { name: string; items: Experience[] };

type Props = {
  eventName: string;
  editorialOverview: string | null;
  preTripBriefLines: string[] | null;
  preTripBriefLiveAt: Date | null;
  sections: Section[];
  isBrief: boolean;
  userEmail: string;
  dateStr: string;
};

export function PackPdfDocument({
  eventName,
  editorialOverview,
  preTripBriefLines,
  preTripBriefLiveAt,
  sections,
  isBrief,
  userEmail,
  dateStr,
}: Props) {
  return (
    <Document
      title={isBrief ? `${eventName} — Travel Brief` : `${eventName} — Full Pack`}
      author="Experiences | Curated"
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>Experiences | Curated</Text>
        <Text style={styles.eventName}>{eventName}</Text>
        <Text style={styles.dateLabel}>
          {isBrief ? "Travel Brief" : "Full Pack"} · Downloaded {dateStr}
        </Text>
        <View style={styles.divider} />

        {editorialOverview ? (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.sectionHeading}>Overview</Text>
            <Text style={styles.overviewText}>{editorialOverview}</Text>
          </View>
        ) : null}

        {preTripBriefLiveAt && preTripBriefLines && preTripBriefLines.length > 0 ? (
          <View style={{ marginBottom: 24 }}>
            <Text style={styles.sectionHeading}>Pre-Trip Brief</Text>
            {preTripBriefLines.map((line, i) => (
              <Text key={i} style={styles.briefLine}>• {line}</Text>
            ))}
          </View>
        ) : null}

        {sections.map((section) => (
          <View key={section.name}>
            <Text style={[styles.sectionHeading, { marginTop: 20 }]}>{section.name}</Text>
            {section.items.map((exp) => {
              const tips = Array.isArray(exp.insiderTips) ? exp.insiderTips as string[] : [];
              const info = exp.practicalInfo as Record<string, string> | null;
              const budget = exp.budgetTier ? (BUDGET_LABELS[exp.budgetTier] ?? exp.budgetTier) : null;
              const meta = [exp.neighborhood, budget].filter(Boolean).join("  ·  ");
              return (
                <View key={exp.id} style={styles.expCard}>
                  <Text style={styles.expTitle}>{exp.title}</Text>
                  {exp.subtitle ? <Text style={styles.expSubtitle}>{exp.subtitle}</Text> : null}
                  {meta ? <Text style={styles.expMeta}>{meta}</Text> : null}
                  {!isBrief && exp.bodyContent
                    ? splitParas(exp.bodyContent).slice(0, 3).map((para, i) => (
                        <Text key={i} style={styles.expBody}>{para}</Text>
                      ))
                    : null}
                  {isBrief && exp.whyItsSpecial
                    ? <Text style={styles.expBody}>{truncate(exp.whyItsSpecial, 280)}</Text>
                    : null}
                  {tips.length > 0 ? (
                    <View style={{ marginTop: 4 }}>
                      <Text style={styles.tipLabel}>Worth knowing</Text>
                      {tips.slice(0, isBrief ? 1 : 3).map((tip, i) => (
                        <Text key={i} style={styles.tipText}>· {tip}</Text>
                      ))}
                    </View>
                  ) : null}
                  {info?.hours ? (
                    <Text style={[styles.tipText, { marginTop: 3 }]}>Hours: {info.hours}</Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        ))}

        <Text style={styles.footer}>
          experiences-curated.com · For personal use only · Downloaded by {userEmail}
        </Text>
      </Page>
    </Document>
  );
}

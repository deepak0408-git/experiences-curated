import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Travel Brief — scoped 27 Aug 2026: a genuinely separate, short reference
// document, NOT a trimmed-down Full Pack. Hub intro + Quick Reference +
// Pre-Trip Brief only, no spoke content at all. Styling matches the
// classic pack's PackPdfDocument.tsx / the hub-and-spoke Cost-spoke pilot
// (SpokePdfDocument.tsx) so all pack PDFs read as one visual family.

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
  venueLine: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#171717",
    lineHeight: 1.5,
    marginBottom: 12,
  },
  introText: {
    fontSize: 10,
    color: "#525252",
    lineHeight: 1.7,
    marginBottom: 6,
  },
  sectionHeading: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#A3A3A3",
    marginBottom: 8,
    marginTop: 24,
    borderBottom: "1 solid #E5E5E5",
    paddingBottom: 5,
  },
  qrRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottom: "1 solid #F0F0F0",
  },
  qrLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#171717",
    width: 130,
    flexShrink: 0,
  },
  qrValue: {
    fontSize: 9,
    color: "#525252",
    lineHeight: 1.5,
    flex: 1,
  },
  qrLink: {
    fontSize: 8,
    color: "#0D7A00",
    marginTop: 2,
  },
  briefBox: {
    border: "1 solid #C7E8B8",
    backgroundColor: "#F3FAF0",
    padding: 12,
    marginTop: 8,
  },
  briefLine: {
    fontSize: 10,
    color: "#525252",
    lineHeight: 1.6,
    marginBottom: 4,
  },
  briefUpdated: {
    fontSize: 8,
    color: "#A3A3A3",
    marginTop: 6,
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

function splitParas(text: string): string[] {
  return text.split(/\n+/).filter(Boolean);
}

type QuickReferenceRow = { label: string; value: string; href?: string; linkLabel?: string };

type Props = {
  displayName: string;
  venueLine: string;
  introText: string;
  dateStr: string;
  userEmail: string;
  quickReference: QuickReferenceRow[];
  preTripBriefLines: string[] | null;
  preTripBriefLiveAt: Date | null;
  preTripBriefUpdatedAt: Date | null;
};

export function TravelBriefPdfDocument({
  displayName,
  venueLine,
  introText,
  dateStr,
  userEmail,
  quickReference,
  preTripBriefLines,
  preTripBriefLiveAt,
  preTripBriefUpdatedAt,
}: Props) {
  return (
    <Document title={`${displayName} — Travel Brief`} author="Experiences | Curated">
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>Experiences | Curated</Text>
        <Text style={styles.eventName}>{displayName}</Text>
        <Text style={styles.dateLabel}>Travel Brief · Downloaded {dateStr}</Text>
        <View style={styles.divider} />

        <Text style={styles.venueLine}>{venueLine}</Text>
        {splitParas(introText).map((para, i) => (
          <Text key={i} style={styles.introText}>{para}</Text>
        ))}

        {quickReference.length > 0 && (
          <View>
            <Text style={styles.sectionHeading}>Quick Reference</Text>
            {quickReference.map((row, i) => (
              <View key={i} style={styles.qrRow}>
                <Text style={styles.qrLabel}>{row.label}</Text>
                <Text style={styles.qrValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        )}

        {preTripBriefLines && preTripBriefLines.length > 0 && (
          <View>
            <Text style={styles.sectionHeading}>
              {preTripBriefLiveAt ? "Pre-Trip Brief" : "Pre-Trip Brief (preview — not yet live)"}
            </Text>
            <View style={styles.briefBox}>
              {preTripBriefLines.map((line, i) => (
                <Text key={i} style={styles.briefLine}>• {line}</Text>
              ))}
              {preTripBriefUpdatedAt && (
                <Text style={styles.briefUpdated}>
                  Updated {preTripBriefUpdatedAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </Text>
              )}
            </View>
          </View>
        )}

        <Text style={styles.footer}>
          experiences-curated.com · For personal use only · Downloaded by {userEmail}
        </Text>
      </Page>
    </Document>
  );
}

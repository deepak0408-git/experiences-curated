import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// PILOT ONLY — styling deliberately mirrors app/api/pack/pdf/PackPdfDocument.tsx
// (the classic pack's proven PDF component) so a reviewer can compare
// output quality directly against the working classic-pack PDF.

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
  bodyText: {
    fontSize: 11,
    color: "#525252",
    lineHeight: 1.7,
    marginBottom: 16,
  },
  headline: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#171717",
    marginBottom: 4,
  },
  headlineNote: {
    fontSize: 9,
    color: "#A3A3A3",
    marginBottom: 20,
  },
  cardsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  card: {
    // Fixed % width (2 cards per row) instead of flex:1 across 4 columns —
    // "US$4,363–US$8,831"-length values were clipping against the card
    // edge in a 4-across layout. Two-per-row leaves real breathing room.
    width: "48%",
    border: "1 solid #E5E5E5",
    padding: 10,
  },
  cardLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#171717",
    marginBottom: 3,
  },
  cardValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#0D7A00",
    marginBottom: 4,
    // Explicit wrap safety net — react-pdf's Yoga layout can otherwise let
    // a long unbroken numeric string overflow its container's bounds
    // rather than wrap, since there's no natural word-break character in
    // "US$4,363–US$8,831".
    flexWrap: "wrap",
  },
  cardNote: {
    fontSize: 8,
    color: "#A3A3A3",
    marginBottom: 1,
  },
  calloutBox: {
    border: "1 solid #C7E8B8",
    backgroundColor: "#F3FAF0",
    padding: 12,
    marginBottom: 16,
  },
  calloutLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#0D7A00",
    marginBottom: 4,
  },
  calloutBody: {
    fontSize: 10,
    color: "#525252",
    lineHeight: 1.6,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    border: "1 solid #F0F0F0",
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#171717",
  },
  categoryValue: {
    fontSize: 10,
    color: "#525252",
  },
  crossLink: {
    fontSize: 9,
    color: "#525252",
    lineHeight: 1.6,
    marginBottom: 6,
  },
  verdictLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#171717",
    marginTop: 16,
    marginBottom: 4,
  },
  verdictBody: {
    fontSize: 10,
    color: "#525252",
    lineHeight: 1.6,
  },
  proBadge: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#0D7A00",
    marginTop: 20,
    marginBottom: 4,
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

function money(low: number, high: number) {
  return low === high ? `US$${low.toLocaleString()}` : `US$${low.toLocaleString()}–US$${high.toLocaleString()}`;
}

type Profile = { label: string; total: { low: number; high: number } | null; hotelNote: string; ticketNote: string };
type CategoryRow = { label: string; low: number; high: number; unit: string };

type Props = {
  eventName: string;
  dateStr: string;
  userEmail: string;
  isBrief: boolean;
  intro: string;
  moderateTotal: { low: number; high: number } | null;
  tripNights: number;
  profiles: Profile[];
  categoryRows: CategoryRow[];
  bookingTimingTrap: { label: string; body: string };
  flightRange: { low: number; high: number } | null;
  flightsNote: string;
  crossLinks: { hotels: string; tickets: string };
  verdicts: { label: string; body: string }[];
};

export function SpokePdfDocument({
  eventName,
  dateStr,
  userEmail,
  isBrief,
  intro,
  moderateTotal,
  tripNights,
  profiles,
  categoryRows,
  bookingTimingTrap,
  flightRange,
  flightsNote,
  crossLinks,
  verdicts,
}: Props) {
  return (
    <Document title={`${eventName} — Cost Guide (${isBrief ? "Travel Brief" : "Full Pack"})`} author="Experiences | Curated">
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>Experiences | Curated</Text>
        <Text style={styles.eventName}>{eventName}</Text>
        <Text style={styles.dateLabel}>
          Cost Guide · {isBrief ? "Travel Brief" : "Full Pack"} · Downloaded {dateStr}
        </Text>
        <View style={styles.divider} />

        <Text style={styles.bodyText}>{intro}</Text>

        {moderateTotal && (
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.headline}>{money(moderateTotal.low, moderateTotal.high)}</Text>
            <Text style={styles.headlineNote}>
              Typical {tripNights}-night trip — a 3-star hotel, food, local transport, and a Show Courts ticket. Excludes flights.
            </Text>
          </View>
        )}

        {profiles.length > 0 && (
          <View style={{ marginBottom: 4 }}>
            <Text style={styles.sectionHeading}>Four ways to do this trip</Text>
            <View style={styles.cardsRow}>
              {profiles.map((p) => (
                <View key={p.label} style={styles.card}>
                  <Text style={styles.cardLabel}>{p.label}</Text>
                  <Text style={styles.cardValue}>{p.total ? money(p.total.low, p.total.high) : "—"}</Text>
                  <Text style={styles.cardNote}>{p.hotelNote}</Text>
                  <Text style={styles.cardNote}>{p.ticketNote}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ marginBottom: 20, marginTop: 12 }}>
          <Text style={styles.sectionHeading}>Where the money goes</Text>
          {categoryRows.map((row) => (
            <View key={row.label} style={styles.categoryRow}>
              <Text style={styles.categoryLabel}>{row.label}</Text>
              <Text style={styles.categoryValue}>{money(row.low, row.high)} {row.unit}</Text>
            </View>
          ))}
        </View>

        <View style={styles.calloutBox}>
          <Text style={styles.calloutLabel}>{bookingTimingTrap.label}</Text>
          <Text style={styles.calloutBody}>{bookingTimingTrap.body}</Text>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={styles.sectionHeading}>What about flights?</Text>
          {flightRange && (
            <Text style={[styles.bodyText, { marginBottom: 4, fontFamily: "Helvetica-Bold", color: "#171717" }]}>
              Roughly {money(flightRange.low, flightRange.high)} round-trip, economy, if you&apos;re traveling from within Europe.
            </Text>
          )}
          <Text style={styles.crossLink}>{flightsNote}</Text>
        </View>

        <Text style={styles.crossLink}>{crossLinks.hotels}</Text>
        <Text style={styles.crossLink}>{crossLinks.tickets}</Text>

        {!isBrief && verdicts.length > 0 && (
          <View>
            <Text style={styles.proBadge}>Pro — unlocked verdict</Text>
            {verdicts.map((v) => (
              <View key={v.label}>
                <Text style={styles.verdictLabel}>{v.label}</Text>
                <Text style={styles.verdictBody}>{v.body}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.footer}>
          experiences-curated.com · For personal use only · Downloaded by {userEmail}
        </Text>
      </Page>
    </Document>
  );
}

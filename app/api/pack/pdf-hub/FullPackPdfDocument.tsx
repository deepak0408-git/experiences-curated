import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Full Pack PDF — generic across every hub-and-spoke event (moved out of
// the pdf-spoke-pilot directory 27 Aug 2026 once the multi-event registry
// pattern was proven). Building out section-by-section per founder
// direction: Cost, Tickets, Hotels first (in real spoke order), 9 more to
// follow. Each section is hand-composed to match its own content module's
// real shape (fact tables, route comparisons, experience cards, verdicts)
// rather than forced through one generic renderer — the 12 spokes have
// genuinely different content shapes (see the extraction report for
// Wimbledon), so a single generic layout would either lose real structure
// or need to be so flexible it stops being simpler than hand-composing
// each section. This component itself is already event-agnostic — it
// just renders whatever content bundle the route hands it, looked up by
// slug from pdfContentRegistry.ts. This file grows by one section at a
// time as each spoke is built and reviewed.

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
  spokeHeading: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#171717",
    marginBottom: 4,
  },
  spokeSubheading: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#0D7A00",
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#A3A3A3",
    marginBottom: 8,
    marginTop: 18,
    borderBottom: "1 solid #E5E5E5",
    paddingBottom: 5,
  },
  bodyText: {
    fontSize: 10,
    color: "#525252",
    lineHeight: 1.7,
    marginBottom: 12,
  },
  headline: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#171717",
    marginBottom: 4,
  },
  headlineNote: {
    fontSize: 9,
    color: "#A3A3A3",
    marginBottom: 16,
  },
  cardsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  card: {
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
    marginBottom: 12,
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
    marginBottom: 4,
  },
  verdictLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#171717",
    marginTop: 12,
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
    marginTop: 16,
    marginBottom: 4,
  },
  // Route comparison table (Tickets)
  table: {
    marginBottom: 8,
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottom: "1 solid #171717",
    paddingBottom: 4,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #F0F0F0",
    paddingVertical: 5,
  },
  tableColName: {
    width: "18%",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#171717",
  },
  tableColOther: {
    width: "20.5%",
    fontSize: 7.5,
    color: "#525252",
    lineHeight: 1.4,
    paddingRight: 4,
  },
  tableHeaderText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    color: "#A3A3A3",
  },
  subLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#171717",
    marginTop: 10,
    marginBottom: 4,
  },
  routeRow: {
    marginBottom: 8,
  },
  routeRowLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#171717",
    marginBottom: 2,
  },
  routeRowDetail: {
    fontSize: 9,
    color: "#525252",
    lineHeight: 1.5,
  },
  sourcesFooter: {
    fontSize: 7,
    color: "#A3A3A3",
    lineHeight: 1.4,
    marginTop: 8,
    marginBottom: 4,
  },
  // Experience card (Hotels)
  expCard: {
    border: "1 solid #E5E5E5",
    padding: 10,
    marginBottom: 8,
    width: "48%",
  },
  expCardsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  expTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#171717",
    marginBottom: 2,
  },
  expSubtitle: {
    fontSize: 8,
    color: "#525252",
    lineHeight: 1.4,
    marginBottom: 4,
  },
  expMeta: {
    fontSize: 7,
    color: "#A3A3A3",
  },
  expWhyItsSpecial: {
    fontSize: 8,
    color: "#525252",
    lineHeight: 1.4,
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
  // Fact row (Weather/Map site facts, Getting There factRow)
  factRow: {
    flexDirection: "row",
    borderBottom: "1 solid #F0F0F0",
    paddingVertical: 6,
  },
  factLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#171717",
    width: 140,
    flexShrink: 0,
  },
  factValue: {
    fontSize: 9,
    color: "#525252",
    lineHeight: 1.5,
    flex: 1,
  },
  // Day card (Itinerary "shape of the Fortnight", DayTrips)
  dayCard: {
    marginBottom: 10,
  },
  dayLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#171717",
    marginBottom: 2,
  },
  dayDetail: {
    fontSize: 9,
    color: "#525252",
    lineHeight: 1.5,
  },
  // Itinerary hour-by-hour table
  itinDayHeading: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#171717",
    marginTop: 14,
    marginBottom: 6,
  },
  itinRow: {
    flexDirection: "row",
    borderBottom: "1 solid #F0F0F0",
    paddingVertical: 5,
  },
  itinTime: {
    width: "16%",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#171717",
  },
  itinLocation: {
    width: "28%",
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#0D7A00",
    paddingRight: 4,
  },
  itinActivity: {
    width: "56%",
    fontSize: 7.5,
    color: "#525252",
    lineHeight: 1.4,
  },
  // First-Timer traditions list
  traditionItem: {
    marginBottom: 8,
  },
  traditionLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#171717",
    marginBottom: 2,
  },
  traditionBody: {
    fontSize: 9,
    color: "#525252",
    lineHeight: 1.5,
  },
  // Hospitality package card (Luxury)
  pkgCard: {
    border: "1 solid #E5E5E5",
    padding: 10,
    marginBottom: 8,
  },
  pkgHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  pkgName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#171717",
  },
  pkgPrice: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#0D7A00",
  },
  pkgSoldOut: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    color: "#A3A3A3",
    marginLeft: 4,
  },
  pkgDetail: {
    fontSize: 8,
    color: "#525252",
    lineHeight: 1.4,
  },
  ratingLine: {
    fontSize: 8,
    color: "#525252",
    marginBottom: 4,
  },
  // Hub section (venue intro + Quick Reference + Pre-Trip Brief) — styles
  // mirror TravelBriefPdfDocument.tsx so the hub content reads identically
  // whether it's standalone (Travel Brief) or the lead section of the
  // Full Pack.
  venueLine: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#171717",
    lineHeight: 1.5,
    marginBottom: 12,
  },
  hubIntroText: {
    fontSize: 10,
    color: "#525252",
    lineHeight: 1.7,
    marginBottom: 6,
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
});

function money(low: number, high: number) {
  return low === high ? `US$${low.toLocaleString()}` : `US$${low.toLocaleString()}–US$${high.toLocaleString()}`;
}

function splitParas(text: string): string[] {
  return text.split(/\n+/).filter(Boolean);
}

// --- Hub (venue intro, Quick Reference, Pre-Trip Brief) — the lead
// section before the 12 spokes. Fixed 28 Aug 2026: the Full Pack was
// missing this entirely, jumping straight into spoke content with no
// venue intro/address/emergencies/pre-trip info at all — a real gap
// flagged directly by the founder, not a deliberate scope decision.
// Content and layout mirror TravelBriefPdfDocument.tsx exactly.
type QuickReferenceRow = { label: string; value: string; href?: string; linkLabel?: string };

type HubSectionProps = {
  venueLine: string;
  introText: string;
  quickReference: QuickReferenceRow[];
  preTripBriefLines: string[] | null;
  preTripBriefLiveAt: Date | null;
  preTripBriefUpdatedAt: Date | null;
};

function HubSection({ venueLine, introText, quickReference, preTripBriefLines, preTripBriefLiveAt, preTripBriefUpdatedAt }: HubSectionProps) {
  return (
    <View>
      <Text style={styles.venueLine}>{venueLine}</Text>
      {splitParas(introText).map((para, i) => (
        <Text key={i} style={styles.hubIntroText}>{para}</Text>
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
    </View>
  );
}

type Profile = { label: string; total: { low: number; high: number } | null; hotelNote: string; ticketNote: string };
type CategoryRow = { label: string; low: number; high: number; unit: string };
type Verdict = { label: string; body: string };
type ExpCard = {
  title: string;
  subtitle: string | null;
  whyItsSpecial: string | null;
  neighborhood: string | null;
  googleMapsRating: string | null;
  googleMapsReviewCount: number | null;
};

type CostSectionProps = {
  intro: string;
  moderateTotal: { low: number; high: number } | null;
  tripNights: number;
  profiles: Profile[];
  categoryRows: CategoryRow[];
  bookingTimingTrap: { label: string; body: string };
  flightRange: { low: number; high: number } | null;
  flightRegionLabel: string;
  flightsNote: string;
  crossLinks: { hotels: string; tickets: string };
  verdicts: Verdict[];
  // Overrides the "Section N of 12" label — required for a document with
  // fewer than 12 sections (e.g. Travel Brief's 5), so it never implies a
  // spoke count that document doesn't have. Defaults to the real Full
  // Pack position when omitted.
  sectionLabel?: string;
};

function CostSection({
  intro, moderateTotal, tripNights, profiles, categoryRows, bookingTimingTrap, flightRange, flightRegionLabel, flightsNote, verdicts, sectionLabel,
}: CostSectionProps) {
  return (
    <View break>
      <Text style={styles.spokeSubheading}>{sectionLabel ?? "Section 1 of 12"}</Text>
      <Text style={styles.spokeHeading}>Cost Guide</Text>
      <View style={styles.divider} />

      <Text style={styles.bodyText}>{intro}</Text>

      {moderateTotal && (
        <View style={{ marginBottom: 4 }}>
          <Text style={styles.headline}>{money(moderateTotal.low, moderateTotal.high)}</Text>
          <Text style={styles.headlineNote}>
            Typical {tripNights}-night trip — a 3-star hotel, food, local transport, and a Show Courts ticket. Excludes flights.
          </Text>
        </View>
      )}

      {profiles.length > 0 && (
        <View>
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

      <Text style={styles.sectionHeading}>Where the money goes</Text>
      {categoryRows.map((row) => (
        <View key={row.label} style={styles.categoryRow}>
          <Text style={styles.categoryLabel}>{row.label}</Text>
          <Text style={styles.categoryValue}>{money(row.low, row.high)} {row.unit}</Text>
        </View>
      ))}

      <View style={[styles.calloutBox, { marginTop: 12 }]}>
        <Text style={styles.calloutLabel}>{bookingTimingTrap.label}</Text>
        <Text style={styles.calloutBody}>{bookingTimingTrap.body}</Text>
      </View>

      <Text style={styles.sectionHeading}>What about flights?</Text>
      {flightRange && (
        <Text style={[styles.bodyText, { marginBottom: 4, fontFamily: "Helvetica-Bold", color: "#171717" }]}>
          {`Roughly ${money(flightRange.low, flightRange.high)} round-trip, economy, if you're traveling from ${flightRegionLabel}.`}
        </Text>
      )}
      <Text style={styles.crossLink}>{flightsNote}</Text>

      {verdicts.length > 0 && (
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
    </View>
  );
}

type TicketsSectionProps = {
  intro: string;
  routeComparisonTable: { label: string; columns: string[]; rows: { name: string; cost: string; control: string; leadTime: string; odds: string }[] };
  route1Ballot: { label: string; body: string };
  route2Queue: {
    label: string;
    intro: string;
    rows: { label: string; detail: string }[];
    resaleQueueBox: { label: string; body: string };
  };
  route3Debentures: { label: string; body: string };
  sourcesFooter: string;
  verdicts: Verdict[];
  sectionLabel?: string;
};

function TicketsSection({
  intro, routeComparisonTable, route1Ballot, route2Queue, route3Debentures, sourcesFooter, verdicts, sectionLabel,
}: TicketsSectionProps) {
  return (
    <View break>
      <Text style={styles.spokeSubheading}>{sectionLabel ?? "Section 2 of 12"}</Text>
      <Text style={styles.spokeHeading}>Ticket Guide</Text>
      <View style={styles.divider} />

      <Text style={styles.bodyText}>{intro}</Text>

      <Text style={styles.sectionHeading}>{routeComparisonTable.label}</Text>
      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          {routeComparisonTable.columns.map((col) => (
            <Text key={col} style={col === "Route" ? [styles.tableColName, styles.tableHeaderText] : [styles.tableColOther, styles.tableHeaderText]}>{col}</Text>
          ))}
        </View>
        {routeComparisonTable.rows.map((row) => (
          <View key={row.name} style={styles.tableRow}>
            <Text style={styles.tableColName}>{row.name}</Text>
            <Text style={styles.tableColOther}>{row.cost}</Text>
            <Text style={styles.tableColOther}>{row.control}</Text>
            <Text style={styles.tableColOther}>{row.leadTime}</Text>
            <Text style={styles.tableColOther}>{row.odds}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.subLabel}>{route1Ballot.label}</Text>
      <Text style={styles.bodyText}>{route1Ballot.body}</Text>

      <Text style={styles.subLabel}>{route2Queue.label}</Text>
      <Text style={styles.bodyText}>{route2Queue.intro}</Text>
      {route2Queue.rows.map((row) => (
        <View key={row.label} style={styles.routeRow}>
          <Text style={styles.routeRowLabel}>{row.label}</Text>
          <Text style={styles.routeRowDetail}>{row.detail}</Text>
        </View>
      ))}
      <View style={styles.calloutBox}>
        <Text style={styles.calloutLabel}>{route2Queue.resaleQueueBox.label}</Text>
        <Text style={styles.calloutBody}>{route2Queue.resaleQueueBox.body}</Text>
      </View>

      <Text style={styles.subLabel}>{route3Debentures.label}</Text>
      <Text style={styles.bodyText}>{route3Debentures.body}</Text>

      <Text style={styles.sourcesFooter}>{sourcesFooter}</Text>

      {verdicts.length > 0 && (
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
    </View>
  );
}

type HotelsSectionProps = {
  intro: string;
  villageAtmosphere: { label: string; body: string };
  sw19Picks: { label: string };
  sw19Experiences: ExpCard[];
  centralLondonPicks: { label: string; intro: string; crossLink: string };
  centralLondonExperiences: ExpCard[];
  verdicts: Verdict[];
};

function ExperienceCardPdf({ exp }: { exp: ExpCard }) {
  return (
    <View style={styles.expCard}>
      <Text style={styles.expTitle}>{exp.title}</Text>
      {exp.googleMapsRating && (
        <Text style={styles.ratingLine}>
          ★ {exp.googleMapsRating}{exp.googleMapsReviewCount ? ` (${exp.googleMapsReviewCount.toLocaleString()} Google reviews)` : ""}
        </Text>
      )}
      {exp.subtitle ? <Text style={styles.expSubtitle}>{exp.subtitle}</Text> : null}
      {exp.whyItsSpecial ? <Text style={styles.expWhyItsSpecial}>{exp.whyItsSpecial}</Text> : null}
      {exp.neighborhood ? <Text style={styles.expMeta}>{exp.neighborhood}</Text> : null}
    </View>
  );
}

function HotelsSection({
  intro, villageAtmosphere, sw19Picks, sw19Experiences, centralLondonPicks, centralLondonExperiences, verdicts,
}: HotelsSectionProps) {
  return (
    <View break>
      <Text style={styles.spokeSubheading}>Section 3 of 12</Text>
      <Text style={styles.spokeHeading}>Where to Stay</Text>
      <View style={styles.divider} />

      <Text style={styles.bodyText}>{intro}</Text>

      <View style={styles.calloutBox}>
        <Text style={styles.calloutLabel}>{villageAtmosphere.label}</Text>
        <Text style={styles.calloutBody}>{villageAtmosphere.body}</Text>
      </View>

      <Text style={styles.sectionHeading}>{sw19Picks.label}</Text>
      <View style={styles.expCardsRow}>
        {sw19Experiences.map((exp) => <ExperienceCardPdf key={exp.title} exp={exp} />)}
      </View>

      <Text style={styles.sectionHeading}>{centralLondonPicks.label}</Text>
      <Text style={styles.bodyText}>{centralLondonPicks.intro}</Text>
      <View style={styles.expCardsRow}>
        {centralLondonExperiences.map((exp) => <ExperienceCardPdf key={exp.title} exp={exp} />)}
      </View>

      {verdicts.length > 0 && (
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
    </View>
  );
}

// --- Getting There (Section 4) ---
type GettingThereSectionProps = {
  intro: string;
  trainRoute: { label: string; body: string; factRow: { label: string; value: string } };
  bus: { label: string; body: string };
  taxi: { label: string; body: string };
  driving: { label: string; body: string };
  planYourJourneyBox: { label: string; body: string };
  sourcesFooter: string;
  experiences: ExpCard[];
  sectionLabel?: string;
};

function GettingThereSection({ intro, trainRoute, bus, taxi, driving, planYourJourneyBox, sourcesFooter, experiences, sectionLabel }: GettingThereSectionProps) {
  return (
    <View break>
      <Text style={styles.spokeSubheading}>{sectionLabel ?? "Section 4 of 12"}</Text>
      <Text style={styles.spokeHeading}>Getting There</Text>
      <View style={styles.divider} />
      <Text style={styles.bodyText}>{intro}</Text>

      <Text style={styles.subLabel}>{trainRoute.label}</Text>
      <Text style={styles.bodyText}>{trainRoute.body}</Text>
      <View style={styles.factRow}>
        <Text style={styles.factLabel}>{trainRoute.factRow.label}</Text>
        <Text style={styles.factValue}>{trainRoute.factRow.value}</Text>
      </View>

      <Text style={styles.subLabel}>{bus.label}</Text>
      <Text style={styles.bodyText}>{bus.body}</Text>

      <Text style={styles.subLabel}>{taxi.label}</Text>
      <Text style={styles.bodyText}>{taxi.body}</Text>

      <Text style={styles.subLabel}>{driving.label}</Text>
      <Text style={styles.bodyText}>{driving.body}</Text>

      <View style={styles.calloutBox}>
        <Text style={styles.calloutLabel}>{planYourJourneyBox.label}</Text>
        <Text style={styles.calloutBody}>{planYourJourneyBox.body}</Text>
      </View>

      {experiences.length > 0 && (
        <View style={styles.expCardsRow}>
          {experiences.map((exp) => <ExperienceCardPdf key={exp.title} exp={exp} />)}
        </View>
      )}

      <Text style={styles.sourcesFooter}>{sourcesFooter}</Text>
    </View>
  );
}

// --- Weather (Section 5) ---
type WeatherSectionProps = {
  intro: string;
  typicalConditions: { label: string; rows: { label: string; value: string }[] };
  whenItRains: { label: string; body: string };
  whatToPack: {
    label: string;
    clothing: { label: string; body: string };
    wetWeather: { label: string; body: string };
    onTheGrounds: { label: string; body: string };
    queueSpecific: { label: string; body: string };
  };
  forecastBox: { body: string };
  sourcesFooter: string;
  experiences: ExpCard[];
  sectionLabel?: string;
};

function WeatherSection({ intro, typicalConditions, whenItRains, whatToPack, forecastBox, sourcesFooter, experiences, sectionLabel }: WeatherSectionProps) {
  return (
    <View break>
      <Text style={styles.spokeSubheading}>{sectionLabel ?? "Section 5 of 12"}</Text>
      <Text style={styles.spokeHeading}>Weather &amp; What to Pack</Text>
      <View style={styles.divider} />
      <Text style={styles.bodyText}>{intro}</Text>

      <Text style={styles.sectionHeading}>{typicalConditions.label}</Text>
      {typicalConditions.rows.map((row) => (
        <View key={row.label} style={styles.factRow}>
          <Text style={styles.factLabel}>{row.label}</Text>
          <Text style={styles.factValue}>{row.value}</Text>
        </View>
      ))}

      <Text style={styles.subLabel}>{whenItRains.label}</Text>
      <Text style={styles.bodyText}>{whenItRains.body}</Text>

      <Text style={styles.sectionHeading}>{whatToPack.label}</Text>
      <Text style={styles.subLabel}>{whatToPack.clothing.label}</Text>
      <Text style={styles.bodyText}>{whatToPack.clothing.body}</Text>
      <Text style={styles.subLabel}>{whatToPack.wetWeather.label}</Text>
      <Text style={styles.bodyText}>{whatToPack.wetWeather.body}</Text>
      <Text style={styles.subLabel}>{whatToPack.onTheGrounds.label}</Text>
      <Text style={styles.bodyText}>{whatToPack.onTheGrounds.body}</Text>
      <Text style={styles.subLabel}>{whatToPack.queueSpecific.label}</Text>
      <Text style={styles.bodyText}>{whatToPack.queueSpecific.body}</Text>

      <View style={styles.calloutBox}>
        <Text style={styles.calloutBody}>{forecastBox.body}</Text>
      </View>

      {experiences.length > 0 && (
        <View style={styles.expCardsRow}>
          {experiences.map((exp) => <ExperienceCardPdf key={exp.title} exp={exp} />)}
        </View>
      )}

      <Text style={styles.sourcesFooter}>{sourcesFooter}</Text>
    </View>
  );
}

// --- First-Timer's Guide (Section 6) ---
type FirstTimerGuideSectionProps = {
  intro: string;
  traditions: { label: string; items: { label: string; body: string }[] };
  mistakesBox: { label: string; body: string };
  gateRules: { label: string; body: string };
  gatesOpen: { label: string; body: string };
  worthKnowingBox: { label: string; body: string };
  sourcesFooter: string;
  experiences: ExpCard[];
};

function FirstTimerGuideSection({ intro, traditions, mistakesBox, gateRules, gatesOpen, worthKnowingBox, sourcesFooter, experiences }: FirstTimerGuideSectionProps) {
  return (
    <View break>
      <Text style={styles.spokeSubheading}>Section 6 of 12</Text>
      <Text style={styles.spokeHeading}>First-Timer&apos;s Guide</Text>
      <View style={styles.divider} />
      <Text style={styles.bodyText}>{intro}</Text>

      <Text style={styles.sectionHeading}>{traditions.label}</Text>
      {traditions.items.map((item) => (
        <View key={item.label} style={styles.traditionItem}>
          <Text style={styles.traditionLabel}>{item.label}</Text>
          <Text style={styles.traditionBody}>{item.body}</Text>
        </View>
      ))}

      <View style={styles.calloutBox}>
        <Text style={styles.calloutLabel}>{mistakesBox.label}</Text>
        <Text style={styles.calloutBody}>{mistakesBox.body}</Text>
      </View>

      <Text style={styles.subLabel}>{gateRules.label}</Text>
      <Text style={styles.bodyText}>{gateRules.body}</Text>

      <Text style={styles.subLabel}>{gatesOpen.label}</Text>
      <Text style={styles.bodyText}>{gatesOpen.body}</Text>

      <View style={styles.calloutBox}>
        <Text style={styles.calloutLabel}>{worthKnowingBox.label}</Text>
        <Text style={styles.calloutBody}>{worthKnowingBox.body}</Text>
      </View>

      {experiences.length > 0 && (
        <View style={styles.expCardsRow}>
          {experiences.map((exp) => <ExperienceCardPdf key={exp.title} exp={exp} />)}
        </View>
      )}

      <Text style={styles.sourcesFooter}>{sourcesFooter}</Text>
    </View>
  );
}

// --- Where to Eat (Section 7) ---
type WhereToEatSectionProps = {
  intro: string;
  onGroundsTactics: {
    label: string;
    shortestQueue: { label: string; body: string };
    henmanHill: { label: string; body: string };
  };
  pimms: { label: string; body: string };
  villagePicksLabel: string;
  sourcesFooter: string;
  verdicts: Verdict[];
  onGroundsExperiences: ExpCard[];
  villageExperiences: ExpCard[];
};

function WhereToEatSection({ intro, onGroundsTactics, pimms, villagePicksLabel, sourcesFooter, verdicts, onGroundsExperiences, villageExperiences }: WhereToEatSectionProps) {
  return (
    <View break>
      <Text style={styles.spokeSubheading}>Section 7 of 12</Text>
      <Text style={styles.spokeHeading}>Where to Eat</Text>
      <View style={styles.divider} />
      <Text style={styles.bodyText}>{intro}</Text>

      <Text style={styles.sectionHeading}>{onGroundsTactics.label}</Text>
      <Text style={styles.subLabel}>{onGroundsTactics.shortestQueue.label}</Text>
      <Text style={styles.bodyText}>{onGroundsTactics.shortestQueue.body}</Text>
      <Text style={styles.subLabel}>{onGroundsTactics.henmanHill.label}</Text>
      <Text style={styles.bodyText}>{onGroundsTactics.henmanHill.body}</Text>

      {onGroundsExperiences.length > 0 && (
        <View style={styles.expCardsRow}>
          {onGroundsExperiences.map((exp) => <ExperienceCardPdf key={exp.title} exp={exp} />)}
        </View>
      )}

      <Text style={styles.subLabel}>{pimms.label}</Text>
      <Text style={styles.bodyText}>{pimms.body}</Text>

      <Text style={styles.sectionHeading}>{villagePicksLabel}</Text>
      {villageExperiences.length > 0 && (
        <View style={styles.expCardsRow}>
          {villageExperiences.map((exp) => <ExperienceCardPdf key={exp.title} exp={exp} />)}
        </View>
      )}

      <Text style={styles.sourcesFooter}>{sourcesFooter}</Text>

      {verdicts.length > 0 && (
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
    </View>
  );
}

// --- Day Trips (Section 8) ---
type DayTripsSectionProps = {
  intro: string;
  windsorEton: { label: string; body: string };
  restDay: { label: string; body: string };
  sourcesFooter: string;
  verdicts: Verdict[];
  windsorEtonExperiences: ExpCard[];
  restDayExperiences: ExpCard[];
};

function DayTripsSection({ intro, windsorEton, restDay, sourcesFooter, verdicts, windsorEtonExperiences, restDayExperiences }: DayTripsSectionProps) {
  return (
    <View break>
      <Text style={styles.spokeSubheading}>Section 8 of 12</Text>
      <Text style={styles.spokeHeading}>Day Trips</Text>
      <View style={styles.divider} />
      <Text style={styles.bodyText}>{intro}</Text>

      <Text style={styles.subLabel}>{windsorEton.label}</Text>
      <Text style={styles.bodyText}>{windsorEton.body}</Text>
      {windsorEtonExperiences.length > 0 && (
        <View style={styles.expCardsRow}>
          {windsorEtonExperiences.map((exp) => <ExperienceCardPdf key={exp.title} exp={exp} />)}
        </View>
      )}

      <Text style={styles.subLabel}>{restDay.label}</Text>
      <Text style={styles.bodyText}>{restDay.body}</Text>
      {restDayExperiences.length > 0 && (
        <View style={styles.expCardsRow}>
          {restDayExperiences.map((exp) => <ExperienceCardPdf key={exp.title} exp={exp} />)}
        </View>
      )}

      <Text style={styles.sourcesFooter}>{sourcesFooter}</Text>

      {verdicts.length > 0 && (
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
    </View>
  );
}

// --- Itinerary (Section 9) ---
type ItinerarySectionProps = {
  intro: string;
  shapeOfTheFortnight: { label: string; days: { day: string; detail: string }[] };
  sourcesFooter: string;
  verdicts: Verdict[];
  hourByHourItinerary: {
    label: string;
    intro: string;
    days: { day: string; rows: { time: string; location: string; activity: string }[] }[];
  };
  experiences: ExpCard[];
};

function ItinerarySection({ intro, shapeOfTheFortnight, sourcesFooter, verdicts, hourByHourItinerary, experiences }: ItinerarySectionProps) {
  return (
    <View break>
      <Text style={styles.spokeSubheading}>Section 9 of 12</Text>
      <Text style={styles.spokeHeading}>Trip Schedule</Text>
      <View style={styles.divider} />
      <Text style={styles.bodyText}>{intro}</Text>

      <Text style={styles.sectionHeading}>{shapeOfTheFortnight.label}</Text>
      {shapeOfTheFortnight.days.map((d) => (
        <View key={d.day} style={styles.dayCard}>
          <Text style={styles.dayLabel}>{d.day}</Text>
          <Text style={styles.dayDetail}>{d.detail}</Text>
        </View>
      ))}

      {experiences.length > 0 && (
        <View style={styles.expCardsRow}>
          {experiences.map((exp) => <ExperienceCardPdf key={exp.title} exp={exp} />)}
        </View>
      )}

      <Text style={styles.sourcesFooter}>{sourcesFooter}</Text>

      {verdicts.length > 0 && (
        <View>
          <Text style={styles.proBadge}>Pro — unlocked verdict</Text>
          {verdicts.map((v) => (
            <View key={v.label}>
              <Text style={styles.verdictLabel}>{v.label}</Text>
              <Text style={styles.verdictBody}>{v.body}</Text>
            </View>
          ))}

          <Text style={[styles.subLabel, { marginTop: 16 }]}>{hourByHourItinerary.label}</Text>
          <Text style={styles.bodyText}>{hourByHourItinerary.intro}</Text>
          {hourByHourItinerary.days.map((d) => (
            <View key={d.day}>
              <Text style={styles.itinDayHeading}>{d.day}</Text>
              {d.rows.map((row, i) => (
                <View key={i} style={styles.itinRow}>
                  <Text style={styles.itinTime}>{row.time}</Text>
                  <Text style={styles.itinLocation}>{row.location}</Text>
                  <Text style={styles.itinActivity}>{row.activity}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// --- Arrival (Section 10) ---
type ArrivalSectionProps = {
  intro: string;
  whenToArrive: {
    label: string;
    centreCourt: { label: string; body: string };
    groundsPass: { label: string; body: string };
  };
  gatesOpenBox: { label: string; body: string };
  sourcesFooter: string;
  experiences: ExpCard[];
  sectionLabel?: string;
};

function ArrivalSection({ intro, whenToArrive, gatesOpenBox, sourcesFooter, experiences, sectionLabel }: ArrivalSectionProps) {
  return (
    <View break>
      <Text style={styles.spokeSubheading}>{sectionLabel ?? "Section 10 of 12"}</Text>
      <Text style={styles.spokeHeading}>Arrival &amp; Queue Guide</Text>
      <View style={styles.divider} />
      <Text style={styles.bodyText}>{intro}</Text>

      <Text style={styles.sectionHeading}>{whenToArrive.label}</Text>
      <Text style={styles.subLabel}>{whenToArrive.centreCourt.label}</Text>
      <Text style={styles.bodyText}>{whenToArrive.centreCourt.body}</Text>
      <Text style={styles.subLabel}>{whenToArrive.groundsPass.label}</Text>
      <Text style={styles.bodyText}>{whenToArrive.groundsPass.body}</Text>

      <View style={styles.calloutBox}>
        <Text style={styles.calloutLabel}>{gatesOpenBox.label}</Text>
        <Text style={styles.calloutBody}>{gatesOpenBox.body}</Text>
      </View>

      {experiences.length > 0 && (
        <View style={styles.expCardsRow}>
          {experiences.map((exp) => <ExperienceCardPdf key={exp.title} exp={exp} />)}
        </View>
      )}

      <Text style={styles.sourcesFooter}>{sourcesFooter}</Text>
    </View>
  );
}

// --- Map (Section 11) ---
type MapSectionProps = {
  intro: string;
  siteFacts: { label: string; rows: { label: string; value: string }[] };
  watchingOuterCourtTennis: { label: string; body: string };
  aorangiParkPracticeCourts: { label: string; body: string };
  facilitiesAccessibility: { label: string; items: { label: string; body: string }[] };
  centreCourtToursBox: { label: string; body: string };
  sourcesFooter: string;
  outerCourtExperiences: ExpCard[];
  practiceCourtExperiences: ExpCard[];
  museumExperiences: ExpCard[];
};

function MapSection({ intro, siteFacts, watchingOuterCourtTennis, aorangiParkPracticeCourts, facilitiesAccessibility, centreCourtToursBox, sourcesFooter, outerCourtExperiences, practiceCourtExperiences, museumExperiences }: MapSectionProps) {
  return (
    <View break>
      <Text style={styles.spokeSubheading}>Section 11 of 12</Text>
      <Text style={styles.spokeHeading}>Venue Map</Text>
      <View style={styles.divider} />
      <Text style={styles.bodyText}>{intro}</Text>

      <Text style={styles.sectionHeading}>{siteFacts.label}</Text>
      {siteFacts.rows.map((row) => (
        <View key={row.label} style={styles.factRow}>
          <Text style={styles.factLabel}>{row.label}</Text>
          <Text style={styles.factValue}>{row.value}</Text>
        </View>
      ))}

      <Text style={styles.subLabel}>{watchingOuterCourtTennis.label}</Text>
      <Text style={styles.bodyText}>{watchingOuterCourtTennis.body}</Text>
      {outerCourtExperiences.length > 0 && (
        <View style={styles.expCardsRow}>
          {outerCourtExperiences.map((exp) => <ExperienceCardPdf key={exp.title} exp={exp} />)}
        </View>
      )}

      <Text style={styles.subLabel}>{aorangiParkPracticeCourts.label}</Text>
      <Text style={styles.bodyText}>{aorangiParkPracticeCourts.body}</Text>
      {practiceCourtExperiences.length > 0 && (
        <View style={styles.expCardsRow}>
          {practiceCourtExperiences.map((exp) => <ExperienceCardPdf key={exp.title} exp={exp} />)}
        </View>
      )}

      <Text style={styles.sectionHeading}>{facilitiesAccessibility.label}</Text>
      {facilitiesAccessibility.items.map((item) => (
        <View key={item.label} style={styles.traditionItem}>
          <Text style={styles.traditionLabel}>{item.label}</Text>
          <Text style={styles.traditionBody}>{item.body}</Text>
        </View>
      ))}

      <View style={styles.calloutBox}>
        <Text style={styles.calloutLabel}>{centreCourtToursBox.label}</Text>
        <Text style={styles.calloutBody}>{centreCourtToursBox.body}</Text>
      </View>
      {museumExperiences.length > 0 && (
        <View style={styles.expCardsRow}>
          {museumExperiences.map((exp) => <ExperienceCardPdf key={exp.title} exp={exp} />)}
        </View>
      )}

      <Text style={styles.sourcesFooter}>{sourcesFooter}</Text>
    </View>
  );
}

// --- Luxury (Section 12) ---
type LuxurySectionProps = {
  intro: string;
  premiumTransit: { label: string; body: string };
  offVenueLuxury: { label: string; name: string; rating: { value: string; reviewCount: string }; body: string };
  hospitalityPackages: {
    label: string;
    priceNote: string;
    packages: { name: string; price: string; status: string; detail: string }[];
  };
  bookEarlyBox: { label: string; body: string };
  premiumStayLabel: string;
  sourcesFooter: string;
  verdicts: Verdict[];
  theLawnExperience: ExpCard[];
  premiumStayExperience: ExpCard[];
};

function LuxurySection({ intro, premiumTransit, offVenueLuxury, hospitalityPackages, bookEarlyBox, premiumStayLabel, sourcesFooter, verdicts, theLawnExperience, premiumStayExperience }: LuxurySectionProps) {
  return (
    <View break>
      <Text style={styles.spokeSubheading}>Section 12 of 12</Text>
      <Text style={styles.spokeHeading}>Luxury Guide</Text>
      <View style={styles.divider} />
      <Text style={styles.bodyText}>{intro}</Text>

      <Text style={styles.subLabel}>{premiumTransit.label}</Text>
      <Text style={styles.bodyText}>{premiumTransit.body}</Text>

      <Text style={styles.sectionHeading}>{offVenueLuxury.label}</Text>
      <Text style={styles.subLabel}>{offVenueLuxury.name}</Text>
      <Text style={styles.ratingLine}>★ {offVenueLuxury.rating.value} ({offVenueLuxury.rating.reviewCount})</Text>
      <Text style={styles.bodyText}>{offVenueLuxury.body}</Text>

      <Text style={styles.sectionHeading}>{hospitalityPackages.label}</Text>
      {hospitalityPackages.packages.map((pkg) => (
        <View key={pkg.name} style={styles.pkgCard}>
          <View style={styles.pkgHeaderRow}>
            <Text style={styles.pkgName}>{pkg.name}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.pkgPrice}>from {pkg.price}</Text>
              {pkg.status === "sold out" && <Text style={styles.pkgSoldOut}>Sold out</Text>}
            </View>
          </View>
          <Text style={styles.pkgDetail}>{pkg.detail}</Text>
        </View>
      ))}
      <Text style={styles.sourcesFooter}>{hospitalityPackages.priceNote}</Text>
      {theLawnExperience.length > 0 && (
        <View style={styles.expCardsRow}>
          {theLawnExperience.map((exp) => <ExperienceCardPdf key={exp.title} exp={exp} />)}
        </View>
      )}

      <View style={styles.calloutBox}>
        <Text style={styles.calloutLabel}>{bookEarlyBox.label}</Text>
        <Text style={styles.calloutBody}>{bookEarlyBox.body}</Text>
      </View>

      <Text style={styles.sectionHeading}>{premiumStayLabel}</Text>
      {premiumStayExperience.length > 0 && (
        <View style={styles.expCardsRow}>
          {premiumStayExperience.map((exp) => <ExperienceCardPdf key={exp.title} exp={exp} />)}
        </View>
      )}

      <Text style={styles.sourcesFooter}>{sourcesFooter}</Text>

      {verdicts.length > 0 && (
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
    </View>
  );
}

// --- Generic block renderer ---------------------------------------------
// Wimbledon's 12 section components above are typed to Wimbledon's exact
// field names (trainRoute/bus/taxi/driving, villageAtmosphere/sw19Picks,
// windsorEton/restDay, etc.) — genuinely Wimbledon-specific structure, not
// a generic template, even though the visual language (prose, fact rows,
// callout boxes, experience cards, verdicts) repeats across every spoke.
// Bahrain GP's real content (KLIA transit, KL-vs-airport hotels, 3 day
// trips not 2, Sepang facilities) doesn't fit those field names without
// either mangling the content or writing another 12 one-off components —
// so this is a genuine second renderer, not scope creep: a single spoke
// section expressed as an ordered list of typed content blocks, reusing
// every existing style. Any future event whose content doesn't match
// Wimbledon's exact shape should use this rather than force-fit.
export type Block =
  | { kind: "prose"; text: string }
  | { kind: "subheading"; label: string; body?: string }
  | { kind: "sectionHeading"; label: string; body?: string }
  | { kind: "factRows"; label?: string; rows: { label: string; value: string }[] }
  | { kind: "callout"; label: string; body: string }
  | { kind: "experiences"; label?: string; items: ExpCard[] }
  | { kind: "list"; label?: string; items: string[] }
  | { kind: "links"; items: { label: string; url: string }[] }
  | { kind: "sourcesFooter"; text: string };

export type GenericSectionProps = {
  heading: string;
  sectionLabel: string;
  blocks: Block[];
  verdicts?: Verdict[];
};

function GenericSection({ heading, sectionLabel, blocks, verdicts }: GenericSectionProps) {
  return (
    <View break>
      <Text style={styles.spokeSubheading}>{sectionLabel}</Text>
      <Text style={styles.spokeHeading}>{heading}</Text>
      <View style={styles.divider} />
      {blocks.map((block, i) => {
        if (block.kind === "prose") {
          return <Text key={i} style={styles.bodyText}>{block.text}</Text>;
        }
        if (block.kind === "subheading") {
          return (
            <View key={i}>
              <Text style={styles.subLabel}>{block.label}</Text>
              {block.body && <Text style={styles.bodyText}>{block.body}</Text>}
            </View>
          );
        }
        if (block.kind === "sectionHeading") {
          return (
            <View key={i}>
              <Text style={styles.sectionHeading}>{block.label}</Text>
              {block.body && <Text style={styles.bodyText}>{block.body}</Text>}
            </View>
          );
        }
        if (block.kind === "factRows") {
          return (
            <View key={i}>
              {block.label && <Text style={styles.sectionHeading}>{block.label}</Text>}
              {block.rows.map((row) => (
                <View key={row.label} style={styles.factRow}>
                  <Text style={styles.factLabel}>{row.label}</Text>
                  <Text style={styles.factValue}>{row.value}</Text>
                </View>
              ))}
            </View>
          );
        }
        if (block.kind === "callout") {
          return (
            <View key={i} style={styles.calloutBox}>
              <Text style={styles.calloutLabel}>{block.label}</Text>
              <Text style={styles.calloutBody}>{block.body}</Text>
            </View>
          );
        }
        if (block.kind === "experiences") {
          if (block.items.length === 0) return null;
          return (
            <View key={i}>
              {block.label && <Text style={styles.sectionHeading}>{block.label}</Text>}
              <View style={styles.expCardsRow}>
                {block.items.map((exp) => <ExperienceCardPdf key={exp.title} exp={exp} />)}
              </View>
            </View>
          );
        }
        if (block.kind === "list") {
          return (
            <View key={i}>
              {block.label && <Text style={styles.sectionHeading}>{block.label}</Text>}
              {block.items.map((item, j) => (
                <Text key={j} style={styles.bodyText}>• {item}</Text>
              ))}
            </View>
          );
        }
        if (block.kind === "links") {
          return (
            <View key={i} style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
              {block.items.map((link) => (
                <Text key={link.label} style={styles.crossLink}>{link.label}</Text>
              ))}
            </View>
          );
        }
        if (block.kind === "sourcesFooter") {
          return <Text key={i} style={styles.sourcesFooter}>{block.text}</Text>;
        }
        return null;
      })}
      {verdicts && verdicts.length > 0 && (
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
    </View>
  );
}

type Props = {
  eventName: string;
  dateStr: string;
  userEmail: string;
  hub: HubSectionProps | null;
  cost: CostSectionProps | null;
  tickets: TicketsSectionProps | null;
  hotels: HotelsSectionProps | null;
  gettingThere: GettingThereSectionProps | null;
  weather: WeatherSectionProps | null;
  firstTimerGuide: FirstTimerGuideSectionProps | null;
  whereToEat: WhereToEatSectionProps | null;
  dayTrips: DayTripsSectionProps | null;
  itinerary: ItinerarySectionProps | null;
  arrival: ArrivalSectionProps | null;
  map: MapSectionProps | null;
  luxury: LuxurySectionProps | null;
  // Generic-block sections (see GenericSection above) — used for events
  // whose real content doesn't fit Wimbledon's exact field shapes. Keyed
  // by spoke id so any subset can be populated independently.
  genericSections?: Partial<Record<
    "cost" | "tickets" | "hotels" | "gettingThere" | "weather" | "firstTimerGuide" | "whereToEat" | "dayTrips" | "itinerary" | "arrival" | "map" | "luxury",
    GenericSectionProps
  >>;
  // Document-level overrides for a non-Full-Pack document (e.g. Travel
  // Brief) that reuses these same section components — without this, the
  // header/title would read "Full Pack (5 of 12 sections)... still being
  // built out," which is wrong for a document that's deliberately and
  // permanently 5 sections, not a work-in-progress Full Pack.
  documentLabel?: string;
  hideBuildingOutNote?: boolean;
};

export function FullPackPdfDocument({
  eventName, dateStr, userEmail, hub, cost, tickets, hotels, gettingThere, weather, firstTimerGuide, whereToEat, dayTrips, itinerary, arrival, map, luxury,
  genericSections, documentLabel, hideBuildingOutNote,
}: Props) {
  const gs = genericSections ?? {};
  const spokeCount = [
    cost ?? gs.cost, tickets ?? gs.tickets, hotels ?? gs.hotels, gettingThere ?? gs.gettingThere,
    weather ?? gs.weather, firstTimerGuide ?? gs.firstTimerGuide, whereToEat ?? gs.whereToEat,
    dayTrips ?? gs.dayTrips, itinerary ?? gs.itinerary, arrival ?? gs.arrival, map ?? gs.map, luxury ?? gs.luxury,
  ].filter(Boolean).length;
  const label = documentLabel ?? "Full Pack";
  return (
    <Document title={`${eventName} — ${label}`} author="Experiences | Curated">
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>Experiences | Curated</Text>
        <Text style={styles.eventName}>{eventName}</Text>
        <Text style={styles.dateLabel}>{label} · Downloaded {dateStr}</Text>
        <View style={styles.divider} />
        {spokeCount < 12 && !hideBuildingOutNote && (
          <Text style={styles.bodyText}>
            This event&apos;s Full Pack is still being built out — {spokeCount} of 12 sections are included below,
            with the rest to follow.
          </Text>
        )}

        {hub && <HubSection {...hub} />}

        {cost ? <CostSection {...cost} /> : gs.cost && <GenericSection {...gs.cost} />}
        {tickets ? <TicketsSection {...tickets} /> : gs.tickets && <GenericSection {...gs.tickets} />}
        {hotels ? <HotelsSection {...hotels} /> : gs.hotels && <GenericSection {...gs.hotels} />}
        {gettingThere ? <GettingThereSection {...gettingThere} /> : gs.gettingThere && <GenericSection {...gs.gettingThere} />}
        {weather ? <WeatherSection {...weather} /> : gs.weather && <GenericSection {...gs.weather} />}
        {firstTimerGuide ? <FirstTimerGuideSection {...firstTimerGuide} /> : gs.firstTimerGuide && <GenericSection {...gs.firstTimerGuide} />}
        {whereToEat ? <WhereToEatSection {...whereToEat} /> : gs.whereToEat && <GenericSection {...gs.whereToEat} />}
        {dayTrips ? <DayTripsSection {...dayTrips} /> : gs.dayTrips && <GenericSection {...gs.dayTrips} />}
        {itinerary ? <ItinerarySection {...itinerary} /> : gs.itinerary && <GenericSection {...gs.itinerary} />}
        {arrival ? <ArrivalSection {...arrival} /> : gs.arrival && <GenericSection {...gs.arrival} />}
        {map ? <MapSection {...map} /> : gs.map && <GenericSection {...gs.map} />}
        {luxury ? <LuxurySection {...luxury} /> : gs.luxury && <GenericSection {...gs.luxury} />}

        <Text style={styles.footer} fixed>
          experiences-curated.com · For personal use only · Downloaded by {userEmail}
        </Text>
      </Page>
    </Document>
  );
}

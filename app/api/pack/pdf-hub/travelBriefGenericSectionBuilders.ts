import type { GenericSectionProps } from "./FullPackPdfDocument";

// Per-event Travel Brief builders — the 3-spoke (Getting There, Weather,
// Arrival) equivalent of full/genericSectionBuilders.ts. Same reasoning:
// events whose content doesn't match Wimbledon's typed section-component
// field shapes go through the generic block renderer, built here per
// event and registered by slug, so route.ts doesn't grow an if/else chain
// as more events are added. Uses the BARE experience-card lookup (title/
// subtitle only) — never the enriched Full Pack version.
type LookupBareMany = (slugs: string[]) => Array<{
  title: string;
  subtitle: string | null;
  whyItsSpecial: null;
  neighborhood: null;
  googleMapsRating: null;
  googleMapsReviewCount: null;
}>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ContentBundle = Record<string, any>;

type TravelBriefGenericResult = {
  gettingThere?: GenericSectionProps;
  weather?: GenericSectionProps;
  arrival?: GenericSectionProps;
};

function buildBahrainGrandPrix(content: ContentBundle, lookupBareMany: LookupBareMany): TravelBriefGenericResult {
  const g = content.gettingThere;
  const w = content.weather;
  const a = content.arrival;
  return {
    gettingThere: g
      ? {
          heading: "Getting There",
          sectionLabel: "Section 1 of 3",
          blocks: [
            { kind: "prose", text: g.intro },
            { kind: "subheading", label: g.klexRow.label, body: g.klexRow.detail },
            { kind: "subheading", label: g.terminalWarning.label, body: g.terminalWarning.body },
            { kind: "experiences", items: lookupBareMany(["getting-to-sepang-circuit-klia"]) },
          ],
        }
      : undefined,
    weather: w
      ? {
          heading: "Weather",
          sectionLabel: "Section 2 of 3",
          blocks: [
            { kind: "prose", text: w.intro },
            { kind: "callout", label: w.historicalCallout.label, body: w.historicalCallout.body },
            { kind: "list", label: w.packList.label, items: w.packList.items },
            { kind: "experiences", items: lookupBareMany(["sepang-circuit-history"]) },
          ],
        }
      : undefined,
    arrival: a
      ? {
          heading: "Arrival & Grandstand Guide",
          sectionLabel: "Section 3 of 3",
          blocks: [
            { kind: "prose", text: a.intro },
            { kind: "subheading", label: a.arrivalStrategy.label, body: a.arrivalStrategy.body },
            { kind: "callout", label: a.honestGapNote.label, body: a.honestGapNote.body },
            { kind: "experiences", items: lookupBareMany(["hill-stand-c2"]) },
          ],
        }
      : undefined,
  };
}

function buildShanghaiMasters(content: ContentBundle, lookupBareMany: LookupBareMany): TravelBriefGenericResult {
  const g = content.gettingThere;
  const w = content.weather;
  const a = content.arrival;
  return {
    gettingThere: g
      ? {
          heading: "Getting There",
          sectionLabel: "Section 1 of 3",
          blocks: [
            { kind: "prose", text: g.intro },
            { kind: "sectionHeading", label: g.metroShuttle.label, body: g.metroShuttle.body },
            { kind: "subheading", label: g.didi.label, body: g.didi.body },
            { kind: "experiences", items: lookupBareMany(["getting-to-qizhong-shanghai-masters"]) },
          ],
        }
      : undefined,
    weather: w
      ? {
          heading: "Weather",
          sectionLabel: "Section 2 of 3",
          blocks: [
            { kind: "prose", text: w.intro },
            { kind: "factRows", label: w.typicalConditions.label, rows: w.typicalConditions.rows },
            { kind: "callout", label: w.historicalCallout.label, body: w.historicalCallout.body },
          ],
        }
      : undefined,
    arrival: a
      ? {
          heading: "Arrival & Venue Guide",
          sectionLabel: "Section 3 of 3",
          blocks: [
            { kind: "prose", text: a.intro },
            { kind: "factRows", label: a.airports.label, rows: a.airports.rows },
            { kind: "subheading", label: a.venueEntry.label, body: a.venueEntry.body },
            { kind: "experiences", items: lookupBareMany(["shanghai-maglev-airport-question"]) },
          ],
        }
      : undefined,
  };
}

function buildSingaporeGrandPrix(content: ContentBundle, lookupBareMany: LookupBareMany): TravelBriefGenericResult {
  const g = content.gettingThere;
  const w = content.weather;
  const a = content.arrival;
  return {
    gettingThere: g
      ? {
          heading: "Getting There",
          sectionLabel: "Section 1 of 3",
          blocks: [
            { kind: "prose", text: g.intro },
            { kind: "factRows", label: g.stations.label, rows: g.stations.rows },
            { kind: "callout", label: g.grabWarning.label, body: g.grabWarning.body },
          ],
        }
      : undefined,
    weather: w
      ? {
          heading: "Weather",
          sectionLabel: "Section 2 of 3",
          blocks: [
            { kind: "prose", text: w.intro },
            { kind: "subheading", label: w.realNumbers.label, body: w.realNumbers.body },
            { kind: "callout", label: w.grandstandExposure.label, body: w.grandstandExposure.body },
          ],
        }
      : undefined,
    arrival: a
      ? {
          heading: "Arrival & Gate Guide",
          sectionLabel: "Section 3 of 3",
          blocks: [
            { kind: "prose", text: a.intro },
            { kind: "factRows", label: a.gates.label, rows: a.gates.rows.map((gate: { name: string; landmark: string; mrt: string }) => ({ label: gate.name, value: `${gate.landmark} — nearest MRT: ${gate.mrt}` })) },
            { kind: "subheading", label: a.sessionTiming.label, body: a.sessionTiming.body },
          ],
        }
      : undefined,
  };
}

function buildAtpFinals(content: ContentBundle, lookupBareMany: LookupBareMany): TravelBriefGenericResult {
  const g = content.gettingThere;
  const w = content.weather;
  const a = content.arrival;
  return {
    gettingThere: g
      ? {
          heading: "Getting There",
          sectionLabel: "Section 1 of 3",
          blocks: [
            { kind: "prose", text: g.intro },
            { kind: "prose", text: g.airportAndTram },
            { kind: "callout", label: g.sessionDaysNote.label, body: g.sessionDaysNote.body },
          ],
        }
      : undefined,
    weather: w
      ? {
          heading: "Weather",
          sectionLabel: "Section 2 of 3",
          blocks: [
            { kind: "prose", text: w.intro },
            { kind: "factRows", label: w.whatToExpect.label, rows: w.whatToExpect.rows },
            { kind: "callout", label: w.indoorsNote.label, body: w.indoorsNote.body },
          ],
        }
      : undefined,
    arrival: a
      ? {
          heading: "Arrival — Inalpi Arena",
          sectionLabel: "Section 3 of 3",
          blocks: [
            { kind: "prose", text: a.intro },
            { kind: "subheading", label: a.twoEntrances.label, body: a.twoEntrances.body },
            { kind: "callout", label: a.gateOpeningNote.label, body: a.gateOpeningNote.body },
          ],
        }
      : undefined,
  };
}

function buildNzAustralia(content: ContentBundle, lookupBareMany: LookupBareMany): TravelBriefGenericResult {
  const g = content.gettingThere;
  const w = content.weather;
  const a = content.arrival;
  return {
    gettingThere: g
      ? {
          heading: "Getting There",
          sectionLabel: "Section 1 of 3",
          blocks: [
            { kind: "prose", text: g.intro },
            { kind: "factRows", label: g.fourLegs.label, rows: g.fourLegs.rows.map((r: { route: string; detail: string }) => ({ label: r.route, value: r.detail })) },
            { kind: "callout", label: g.ruledOutNote.label, body: g.ruledOutNote.body },
          ],
        }
      : undefined,
    weather: w
      ? {
          heading: "Weather",
          sectionLabel: "Section 2 of 3",
          blocks: [
            { kind: "prose", text: w.intro },
            { kind: "factRows", label: "City by city", rows: w.cityWeather.map((c: { city: string; detail: string }) => ({ label: c.city, value: c.detail })) },
          ],
        }
      : undefined,
    arrival: a
      ? {
          heading: "Arrival — Four Grounds",
          sectionLabel: "Section 3 of 3",
          blocks: [
            { kind: "prose", text: a.intro },
            { kind: "callout", label: a.boxingDayNote.label, body: a.boxingDayNote.body },
            { kind: "subheading", label: a.gateOpeningNote.label, body: a.gateOpeningNote.body },
          ],
        }
      : undefined,
  };
}

function buildAustralianOpen(content: ContentBundle, lookupBareMany: LookupBareMany): TravelBriefGenericResult {
  const g = content.gettingThere;
  const w = content.weather;
  const a = content.arrival;
  return {
    gettingThere: g
      ? {
          heading: "Getting There",
          sectionLabel: "Section 1 of 3",
          blocks: [
            { kind: "prose", text: g.intro },
            { kind: "subheading", label: g.onFoot.label, body: g.onFoot.body },
            { kind: "sectionHeading", label: g.freeTram.label, body: g.freeTram.body },
          ],
        }
      : undefined,
    weather: w
      ? {
          heading: "Weather",
          sectionLabel: "Section 2 of 3",
          blocks: [
            { kind: "prose", text: w.intro },
            { kind: "factRows", label: w.typicalConditions.label, rows: w.typicalConditions.rows },
            { kind: "callout", label: w.outdoorCourtsNote.label, body: w.outdoorCourtsNote.body },
          ],
        }
      : undefined,
    arrival: a
      ? {
          heading: "Arrival — Melbourne Park",
          sectionLabel: "Section 3 of 3",
          blocks: [
            { kind: "prose", text: a.intro },
            { kind: "subheading", label: a.groundPassNote.label, body: a.groundPassNote.body },
            { kind: "subheading", label: a.reservedSeatNote.label, body: a.reservedSeatNote.body },
          ],
        }
      : undefined,
  };
}

function buildLasVegasGrandPrix(content: ContentBundle, lookupBareMany: LookupBareMany): TravelBriefGenericResult {
  const g = content.gettingThere;
  const w = content.weather;
  const a = content.arrival;
  return {
    gettingThere: g
      ? {
          heading: "Getting There",
          sectionLabel: "Section 1 of 3",
          blocks: [
            { kind: "prose", text: g.intro },
            { kind: "factRows", label: g.transitOptionsTable.label, rows: g.transitOptionsTable.rows.map((r: { title: string; detail: string }) => ({ label: r.title, value: r.detail })) },
            { kind: "subheading", label: g.monorailFareBox.label, body: g.monorailFareBox.body },
            { kind: "callout", label: g.rideshareCallout.label, body: g.rideshareCallout.body },
            { kind: "experiences", items: lookupBareMany(["las-vegas-gp-getting-around"]) },
          ],
        }
      : undefined,
    weather: w
      ? {
          heading: "Weather",
          sectionLabel: "Section 2 of 3",
          blocks: [
            { kind: "prose", text: w.intro },
            { kind: "subheading", label: w.realNumbersCallout.label, body: w.realNumbersCallout.body },
            { kind: "subheading", label: w.standExposureCallout.label, body: w.standExposureCallout.body },
            { kind: "factRows", label: w.packList.label, rows: w.packList.items.map((i: { title: string; detail: string }) => ({ label: i.title, value: i.detail })) },
            { kind: "callout", label: w.cashlessCallout.label, body: w.cashlessCallout.body },
          ],
        }
      : undefined,
    arrival: a
      ? {
          heading: "Arrival & Grandstand Guide",
          sectionLabel: "Section 3 of 3",
          blocks: [
            { kind: "prose", text: a.intro },
            { kind: "factRows", label: a.whatToExpectTable.label, rows: a.whatToExpectTable.rows.map((r: { title: string; detail: string }) => ({ label: r.title, value: r.detail })) },
            { kind: "factRows", label: a.arrivalStrategyByTier.label, rows: a.arrivalStrategyByTier.rows.map((r: { title: string; detail: string }) => ({ label: r.title, value: r.detail })) },
            { kind: "experiences", label: "What General Admission gets you", items: lookupBareMany(["las-vegas-gp-flamingo-ga"]) },
          ],
        }
      : undefined,
  };
}

function buildAbuDhabiGrandPrix(content: ContentBundle, lookupBareMany: LookupBareMany): TravelBriefGenericResult {
  const g = content.gettingThere;
  const w = content.weather;
  const a = content.arrival;
  return {
    gettingThere: g
      ? {
          heading: "Getting There",
          sectionLabel: "Section 1 of 3",
          blocks: [
            { kind: "prose", text: g.intro },
            { kind: "subheading", label: g.auhRow.label, body: g.auhRow.headline },
            { kind: "subheading", label: g.dxbRow.label, body: g.dxbRow.body },
            { kind: "callout", label: g.honestFramingCallout.label, body: g.honestFramingCallout.body },
            { kind: "experiences", items: lookupBareMany(["auh-vs-dxb-getting-there"]) },
          ],
        }
      : undefined,
    weather: w
      ? {
          heading: "Weather",
          sectionLabel: "Section 2 of 3",
          blocks: [
            { kind: "prose", text: w.intro },
            { kind: "callout", label: w.honestTakeawayCallout.label, body: w.honestTakeawayCallout.body },
            { kind: "experiences", items: lookupBareMany(["twilight-race-packing-guide"]) },
          ],
        }
      : undefined,
    arrival: a
      ? {
          heading: "Arrival & Traffic Guide",
          sectionLabel: "Section 3 of 3",
          blocks: [
            { kind: "prose", text: a.intro },
            { kind: "subheading", label: a.trafficPeaks.label, body: a.trafficPeaks.body },
            { kind: "callout", label: a.honestGapNote.label, body: a.honestGapNote.body },
            { kind: "experiences", items: lookupBareMany(["getting-around-yas-island-race-day"]) },
          ],
        }
      : undefined,
  };
}

export const TRAVEL_BRIEF_GENERIC_SECTION_BUILDERS: Record<string, (content: ContentBundle, lookupBareMany: LookupBareMany) => TravelBriefGenericResult> = {
  "bahrain-grand-prix": buildBahrainGrandPrix,
  "abu-dhabi-grand-prix": buildAbuDhabiGrandPrix,
  "las-vegas-grand-prix": buildLasVegasGrandPrix,
  "shanghai-masters": buildShanghaiMasters,
  "singapore-grand-prix": buildSingaporeGrandPrix,
  "atp-finals": buildAtpFinals,
  "new-zealand-in-australia-cricket-2026-27": buildNzAustralia,
  "australian-open": buildAustralianOpen,
};

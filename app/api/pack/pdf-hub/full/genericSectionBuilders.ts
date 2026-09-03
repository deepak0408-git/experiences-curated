import type { GenericSectionProps } from "../FullPackPdfDocument";

// Per-event builders for events whose content doesn't fit Wimbledon's
// typed section-component field shapes (see FullPackPdfDocument.tsx's
// "Generic block renderer" comment for why this split exists). Each
// builder takes that event's already-looked-up content bundle plus the
// shared lookupMany experience-card helper, and returns the 9
// non-Cost/Tickets/Hotels-typed sections as GenericSectionProps (Tickets
// and Hotels also go through here per event since their shapes diverge
// too — only Cost is genuinely shared math across every event so far).
//
// Registered by slug in GENERIC_SECTION_BUILDERS at the bottom — add a new
// event by adding one function + one registry entry, not by growing an
// if/else chain in full/route.ts itself.
type LookupMany = (slugs: string[]) => Array<{
  title: string;
  subtitle: string | null;
  whyItsSpecial: string | null;
  neighborhood: string | null;
  googleMapsRating: string | null;
  googleMapsReviewCount: number | null;
}>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ContentBundle = Record<string, any>;

type GenericSectionsResult = Partial<Record<
  "tickets" | "hotels" | "gettingThere" | "weather" | "firstTimerGuide" | "whereToEat" | "dayTrips" | "itinerary" | "arrival" | "map" | "luxury",
  GenericSectionProps
>>;

function buildBahrainGrandPrix(content: ContentBundle, lookupMany: LookupMany): GenericSectionsResult {
  const result: GenericSectionsResult = {};

  if (content.tickets) {
    const t = content.tickets;
    result.tickets = {
      heading: "Tickets",
      sectionLabel: "Section 2 of 12",
      blocks: [
        { kind: "factRows", label: t.standsTable.label, rows: t.standsTable.rows.map((r: { name: string; shows: string; seating: string; exposure: string }) => ({ label: r.name, value: `${r.shows} — ${r.seating}, ${r.exposure}` })) },
        { kind: "callout", label: t.buyOfficialOnlyWarning.label, body: t.buyOfficialOnlyWarning.body },
        { kind: "subheading", label: t.k1BlockTip.label, body: t.k1BlockTip.body },
        { kind: "experiences", label: "The 4 grandstands", items: lookupMany(["main-grandstand-sepang-start-finish", "k1-grandstand-sepang-turn-1", "grandstand-f-sepang-panoramic", "hill-stand-c2-sepang-general-admission"]) },
      ],
      verdicts: t.verdicts,
    };
  }

  if (content.hotels) {
    const h = content.hotels;
    result.hotels = {
      heading: "Hotels",
      sectionLabel: "Section 3 of 12",
      blocks: [
        { kind: "prose", text: h.intro },
        { kind: "sectionHeading", label: h.klNeighborhood.label, body: h.klNeighborhood.body },
        { kind: "experiences", items: lookupMany(["staying-in-kuala-lumpur"]) },
        { kind: "sectionHeading", label: h.airbnbAlternative.label, body: h.airbnbAlternative.body },
        { kind: "sectionHeading", label: "Sama-Sama (airport)", body: "" },
        { kind: "experiences", items: lookupMany(["sama-sama-hotel"]) },
        { kind: "sourcesFooter", text: h.sourcesFooter },
      ],
      verdicts: h.verdicts,
    };
  }

  if (content.gettingThere) {
    const g = content.gettingThere;
    result.gettingThere = {
      heading: "Getting There",
      sectionLabel: "Section 4 of 12",
      blocks: [
        { kind: "prose", text: g.intro },
        { kind: "subheading", label: g.klexRow.label, body: g.klexRow.detail },
        { kind: "subheading", label: g.appsRow.label, body: g.appsRow.detail },
        { kind: "subheading", label: g.raceDayShuttleRow.label, body: g.raceDayShuttleRow.detail },
        { kind: "subheading", label: g.drivingParkingRow.label, body: g.drivingParkingRow.detail },
        { kind: "callout", label: g.terminalWarning.label, body: g.terminalWarning.body },
        { kind: "experiences", items: lookupMany(["getting-to-sepang-circuit-klia"]) },
        { kind: "sourcesFooter", text: g.sourcesFooter },
      ],
    };
  }

  if (content.weather) {
    const w = content.weather;
    result.weather = {
      heading: "Weather",
      sectionLabel: "Section 5 of 12",
      blocks: [
        { kind: "prose", text: w.intro },
        { kind: "callout", label: w.historicalCallout.label, body: w.historicalCallout.body },
        { kind: "list", label: w.packList.label, items: w.packList.items },
        { kind: "factRows", label: w.standCoverage.label, rows: w.standCoverage.rows },
        { kind: "experiences", items: lookupMany(["sepang-circuit-history"]) },
        { kind: "sourcesFooter", text: w.sourcesFooter },
      ],
    };
  }

  if (content.firstTimerGuide) {
    const f = content.firstTimerGuide;
    result.firstTimerGuide = {
      heading: "First-Timer's Guide",
      sectionLabel: "Section 6 of 12",
      blocks: [
        { kind: "prose", text: f.intro },
        ...f.mistakes.map((m: { number: number; label: string; body: string }) => ({ kind: "subheading" as const, label: `${m.number}. ${m.label}`, body: m.body })),
        { kind: "experiences", items: lookupMany(["sepang-circuit-history", "malaysia-f1-fans-nostalgia"]) },
        { kind: "sectionHeading", label: f.practicalEssentials.label },
        { kind: "subheading", label: f.practicalEssentials.essentialApps.label, body: f.practicalEssentials.essentialApps.items.join(", ") },
        { kind: "subheading", label: f.practicalEssentials.accessibility.label, body: f.practicalEssentials.accessibility.body },
        { kind: "subheading", label: f.practicalEssentials.gettingOutAfterward.label, body: f.practicalEssentials.gettingOutAfterward.body },
        { kind: "sectionHeading", label: f.cityBeyondCircuit.label },
        { kind: "experiences", items: lookupMany(["petronas-twin-towers"]) },
        { kind: "sourcesFooter", text: f.sourcesFooter },
      ],
    };
  }

  if (content.whereToEat) {
    const w = content.whereToEat;
    result.whereToEat = {
      heading: "Where to Eat",
      sectionLabel: "Section 7 of 12",
      blocks: [
        { kind: "prose", text: w.intro },
        { kind: "subheading", label: w.jalanAlor.label, body: w.jalanAlor.body },
        { kind: "experiences", items: lookupMany(["jalan-alor"]) },
        { kind: "subheading", label: w.oldChinaCafe.label, body: w.oldChinaCafe.body },
        { kind: "experiences", items: lookupMany(["old-china-cafe"]) },
        { kind: "callout", label: w.bookingTimingNote.label, body: w.bookingTimingNote.body },
      ],
      verdicts: w.verdicts,
    };
  }

  if (content.dayTrips) {
    const d = content.dayTrips;
    result.dayTrips = {
      heading: "Day Trips",
      sectionLabel: "Section 8 of 12",
      blocks: [
        { kind: "subheading", label: d.gentingHighlands.label, body: d.gentingHighlands.body },
        { kind: "experiences", items: lookupMany(["genting-highlands"]) },
        { kind: "subheading", label: d.putrajaya.label, body: d.putrajaya.body },
        { kind: "experiences", items: lookupMany(["putrajaya"]) },
        { kind: "subheading", label: d.batuCaves.label, body: d.batuCaves.body },
        { kind: "experiences", items: lookupMany(["batu-caves"]) },
      ],
      verdicts: d.verdicts,
    };
  }

  if (content.itinerary) {
    const it = content.itinerary;
    result.itinerary = {
      heading: "Trip Schedule",
      sectionLabel: "Section 9 of 12",
      blocks: [
        { kind: "callout", label: it.sessionTimesNote.label, body: it.sessionTimesNote.body },
        { kind: "factRows", label: "The shape of the weekend", rows: it.days.map((d: { label: string; summary: string }) => ({ label: d.label, value: d.summary })) },
      ],
    };
  }

  if (content.arrival) {
    const a = content.arrival;
    result.arrival = {
      heading: "Arrival & Grandstand Guide",
      sectionLabel: "Section 10 of 12",
      blocks: [
        { kind: "prose", text: a.intro },
        { kind: "subheading", label: a.arrivalStrategy.label, body: a.arrivalStrategy.body },
        { kind: "subheading", label: a.facilitiesHub.label, body: a.facilitiesHub.body },
        { kind: "subheading", label: a.midSessionBreak.label, body: a.midSessionBreak.body },
        { kind: "callout", label: a.honestGapNote.label, body: a.honestGapNote.body },
        { kind: "experiences", items: lookupMany(["hill-stand-c2"]) },
      ],
    };
  }

  if (content.map) {
    const m = content.map;
    result.map = {
      heading: "Venue Map",
      sectionLabel: "Section 11 of 12",
      blocks: [
        { kind: "factRows", label: "Circuit facilities", rows: m.facilities.map((f: { label: string; body: string }) => ({ label: f.label, value: f.body })) },
        { kind: "callout", label: m.perimeterWalkNote.label, body: m.perimeterWalkNote.body },
        { kind: "experiences", label: "The 4 grandstands", items: lookupMany(["main-grandstand-sepang-start-finish", "k1-grandstand-sepang-turn-1", "grandstand-f-sepang-panoramic", "hill-stand-c2-sepang-general-admission"]) },
      ],
    };
  }

  if (content.luxury) {
    const lx = content.luxury;
    result.luxury = {
      heading: "Luxury Guide",
      sectionLabel: "Section 12 of 12",
      blocks: [
        { kind: "prose", text: lx.intro },
        { kind: "subheading", label: lx.corporateSuites.label, body: lx.corporateSuites.body },
        { kind: "subheading", label: lx.privateTransit.label, body: lx.privateTransit.body },
        { kind: "subheading", label: lx.skylineVenue.label, body: lx.skylineVenue.body },
        { kind: "sectionHeading", label: lx.paddockClub.label, body: lx.paddockClub.intro },
        { kind: "experiences", items: lookupMany(["f1-paddock-club"]) },
        { kind: "factRows", label: "What's included", rows: lx.paddockClub.included.map((i: { label: string; detail: string }) => ({ label: i.label, value: i.detail })) },
        { kind: "subheading", label: "Price", body: lx.paddockClub.priceNote },
        { kind: "prose", text: lx.paddockClub.closingLine },
      ],
      verdicts: lx.verdicts,
    };
  }

  return result;
}

function buildShanghaiMasters(content: ContentBundle, lookupMany: LookupMany): GenericSectionsResult {
  const result: GenericSectionsResult = {};

  if (content.tickets) {
    const t = content.tickets;
    result.tickets = {
      heading: "Tickets",
      sectionLabel: "Section 2 of 12",
      blocks: [
        { kind: "prose", text: t.intro },
        { kind: "factRows", label: t.ticketTypes.label, rows: t.ticketTypes.rows.map((r: { fallbackLabel: string; detail: string }) => ({ label: r.fallbackLabel, value: r.detail })) },
        { kind: "callout", label: t.oneTicketBothSessions.label, body: t.oneTicketBothSessions.body },
        { kind: "callout", label: t.court17Note.label, body: t.court17Note.body },
        { kind: "experiences", items: lookupMany(["shanghai-masters-ticket-guide", "qizhong-center-court"]) },
        { kind: "sourcesFooter", text: t.sourcesFooter },
      ],
      verdicts: t.verdicts,
    };
  }

  if (content.hotels) {
    const h = content.hotels;
    result.hotels = {
      heading: "Hotels",
      sectionLabel: "Section 3 of 12",
      blocks: [
        { kind: "prose", text: h.intro },
        { kind: "experiences", items: lookupMany(["where-to-stay-shanghai-masters"]) },
        { kind: "subheading", label: h.moderateHotelNote.label, body: h.moderateHotelNote.body },
        { kind: "callout", label: h.goldenWeekTrap.label, body: h.goldenWeekTrap.body },
        { kind: "sectionHeading", label: h.splurgeNote.label },
        { kind: "experiences", items: lookupMany(["luxury-shanghai-peninsula-bulgari"]) },
        { kind: "sourcesFooter", text: h.sourcesFooter },
      ],
      verdicts: h.verdicts,
    };
  }

  if (content.gettingThere) {
    const g = content.gettingThere;
    result.gettingThere = {
      heading: "Getting There",
      sectionLabel: "Section 4 of 12",
      blocks: [
        { kind: "prose", text: g.intro },
        { kind: "sectionHeading", label: g.metroShuttle.label, body: g.metroShuttle.body },
        { kind: "factRows", rows: g.metroShuttle.facts },
        { kind: "subheading", label: g.didi.label, body: g.didi.body },
        { kind: "callout", label: g.setupTip.label, body: g.setupTip.body },
        { kind: "experiences", items: lookupMany(["getting-to-qizhong-shanghai-masters"]) },
        { kind: "sourcesFooter", text: g.sourcesFooter },
      ],
    };
  }

  if (content.weather) {
    const w = content.weather;
    result.weather = {
      heading: "Weather",
      sectionLabel: "Section 5 of 12",
      blocks: [
        { kind: "prose", text: w.intro },
        { kind: "factRows", label: w.typicalConditions.label, rows: w.typicalConditions.rows },
        { kind: "callout", label: w.historicalCallout.label, body: w.historicalCallout.body },
        { kind: "list", label: w.packList.label, items: w.packList.items },
        { kind: "subheading", label: w.crowdFactorNote.label, body: w.crowdFactorNote.body },
        { kind: "sourcesFooter", text: w.sourcesFooter },
      ],
    };
  }

  if (content.firstTimerGuide) {
    const f = content.firstTimerGuide;
    result.firstTimerGuide = {
      heading: "First-Timer's Guide",
      sectionLabel: "Section 6 of 12",
      blocks: [
        { kind: "prose", text: f.intro },
        { kind: "sectionHeading", label: f.fourThings.label },
        ...f.fourThings.items.map((i: { label: string; body: string }) => ({ kind: "subheading" as const, label: i.label, body: i.body })),
        { kind: "experiences", items: lookupMany(["china-visa-apps-payments-guide"]) },
        { kind: "subheading", label: f.gateRules.label, body: f.gateRules.body },
        { kind: "callout", label: f.cityBeyondTennis.label, body: f.cityBeyondTennis.body },
        { kind: "sourcesFooter", text: f.sourcesFooter },
      ],
    };
  }

  if (content.whereToEat) {
    const w = content.whereToEat;
    result.whereToEat = {
      heading: "Where to Eat",
      sectionLabel: "Section 7 of 12",
      blocks: [
        { kind: "prose", text: w.intro },
        { kind: "experiences", items: lookupMany(["xiaolongbao-shanghai-guide", "french-concession-dining-shanghai"]) },
        { kind: "sourcesFooter", text: w.sourcesFooter },
      ],
      verdicts: w.verdicts,
    };
  }

  if (content.dayTrips) {
    const d = content.dayTrips;
    result.dayTrips = {
      heading: "Day Trips",
      sectionLabel: "Section 8 of 12",
      blocks: [
        { kind: "prose", text: d.intro },
        { kind: "experiences", label: "In the city", items: lookupMany(d.inCitySlugs) },
        { kind: "experiences", label: "Out of the city (bullet train)", items: lookupMany(d.outOfCitySlugs) },
      ],
      verdicts: d.verdicts,
    };
  }

  if (content.itinerary) {
    const it = content.itinerary;
    result.itinerary = {
      heading: "Trip Schedule",
      sectionLabel: "Section 9 of 12",
      blocks: [
        { kind: "prose", text: it.eventRhythmIntro },
        { kind: "prose", text: it.federerNote },
        { kind: "experiences", items: lookupMany(["roger-friends-federer-exhibition"]) },
        { kind: "factRows", label: it.tentativeWeek.label, rows: it.tentativeWeek.days.map((d: { day: string; detail: string }) => ({ label: d.day, value: d.detail })) },
        { kind: "callout", label: it.sessionTimesNote.label, body: it.sessionTimesNote.body },
        { kind: "prose", text: it.crowdsIntro },
        { kind: "experiences", items: lookupMany(["shanghai-masters-crowds-atmosphere"]) },
        { kind: "prose", text: it.liNaZhengIntro },
        { kind: "experiences", items: lookupMany(["li-na-zheng-qinwen-generations"]) },
        // Full hour-by-hour itinerary is real, confirmed content (not
        // Bahrain-GP-style uncertain) — render every day's rows as a
        // fact-table under the Pro-gated section via a synthetic verdict
        // block below, since GenericSection only supports one verdicts
        // list, not a separate "locked" block group. Presented as a
        // labelled block instead, matching the source's own gating
        // ({isUnlocked && ...} wraps the whole hour-by-hour block).
        ...(it.hourByHourItinerary
          ? [
              { kind: "sectionHeading" as const, label: it.hourByHourItinerary.label, body: it.hourByHourItinerary.intro },
              ...it.hourByHourItinerary.days.flatMap((day: { day: string; rows: { time: string; location: string; activity: string }[] }) => [
                { kind: "subheading" as const, label: day.day },
                { kind: "factRows" as const, rows: day.rows.map((r) => ({ label: `${r.time} — ${r.location}`, value: r.activity })) },
              ]),
            ]
          : []),
      ],
    };
  }

  if (content.arrival) {
    const a = content.arrival;
    result.arrival = {
      heading: "Arrival & Venue Guide",
      sectionLabel: "Section 10 of 12",
      blocks: [
        { kind: "prose", text: a.intro },
        { kind: "factRows", label: a.airports.label, rows: a.airports.rows },
        { kind: "experiences", items: lookupMany(["shanghai-maglev-airport-question"]) },
        { kind: "subheading", label: a.venueEntry.label, body: a.venueEntry.body },
        { kind: "subheading", label: a.arrivalStrategy.label, body: a.arrivalStrategy.body },
        { kind: "callout", label: a.honestGapNote.label, body: a.honestGapNote.body },
        { kind: "sourcesFooter", text: a.sourcesFooter },
      ],
    };
  }

  if (content.map) {
    const m = content.map;
    result.map = {
      heading: "Venue Map",
      sectionLabel: "Section 11 of 12",
      blocks: [
        { kind: "prose", text: m.intro },
        { kind: "subheading", label: m.roofNote.label, body: m.roofNote.body },
        { kind: "factRows", label: m.siteLayout.label, rows: m.siteLayout.rows },
        { kind: "experiences", items: lookupMany(["qizhong-center-court", "qizhong-forest-sports-city-arena"]) },
        { kind: "sectionHeading", label: m.facilities.label },
        { kind: "subheading", label: m.facilities.foodAndDrink.label, body: m.facilities.foodAndDrink.body },
        { kind: "subheading", label: m.facilities.accessibility.label, body: m.facilities.accessibility.body },
        { kind: "callout", label: m.awardNote.label, body: m.awardNote.body },
        { kind: "sourcesFooter", text: m.sourcesFooter },
      ],
    };
  }

  if (content.luxury) {
    const lx = content.luxury;
    result.luxury = {
      heading: "Luxury Guide",
      sectionLabel: "Section 12 of 12",
      blocks: [
        { kind: "prose", text: lx.intro },
        { kind: "subheading", label: lx.premiumTransit.label, body: lx.premiumTransit.body },
        { kind: "sectionHeading", label: lx.offVenueLuxury.label, body: `${lx.offVenueLuxury.name} — ★ ${lx.offVenueLuxury.rating.value} (${lx.offVenueLuxury.rating.reviewCount})\n${lx.offVenueLuxury.body}` },
        { kind: "prose", text: lx.peninsulaBulgariNote },
        { kind: "experiences", items: lookupMany(["luxury-shanghai-peninsula-bulgari"]) },
        { kind: "sectionHeading", label: lx.hospitalityPackage.label },
        { kind: "factRows", rows: [{ label: lx.hospitalityPackage.name, value: lx.hospitalityPackage.price }] },
        { kind: "subheading", label: "Details", body: lx.hospitalityPackage.detail },
        { kind: "callout", label: "Pricing note", body: lx.hospitalityPackage.priceNote },
        { kind: "sourcesFooter", text: lx.sourcesFooter },
      ],
      verdicts: lx.verdicts,
    };
  }

  return result;
}

function buildSingaporeGrandPrix(content: ContentBundle, lookupMany: LookupMany): GenericSectionsResult {
  const result: GenericSectionsResult = {};

  if (content.tickets) {
    const t = content.tickets;
    result.tickets = {
      heading: "Tickets",
      sectionLabel: "Section 2 of 12",
      blocks: [
        { kind: "prose", text: t.intro },
        { kind: "factRows", label: t.standsTable.label, rows: t.standsTable.rows.map((r: { name: string; shows: string; seating: string; exposure: string; priceBand: string }) => ({ label: r.name, value: `${r.shows} — ${r.seating}, ${r.exposure}, ${r.priceBand}` })) },
        { kind: "callout", label: t.buyOfficialOnlyWarning.label, body: t.buyOfficialOnlyWarning.body },
        { kind: "experiences", items: lookupMany(["singapore-gp-turn1-grandstand", "singapore-gp-stamford-grandstand", "singapore-gp-padang-grandstand", "singapore-gp-zone4-walkabout"]) },
      ],
      verdicts: t.verdicts,
    };
  }

  if (content.hotels) {
    const h = content.hotels;
    result.hotels = {
      heading: "Hotels",
      sectionLabel: "Section 3 of 12",
      blocks: [
        { kind: "prose", text: h.intro },
        { kind: "experiences", items: lookupMany(["singapore-gp-trackside-hotels", "singapore-gp-clarke-quay-stay", "singapore-gp-chinatown-stay"]) },
        { kind: "sectionHeading", label: h.bookingWindows.label },
        { kind: "factRows", rows: h.bookingWindows.hotels.map((hh: { name: string; note: string }) => ({ label: hh.name, value: hh.note })) },
        { kind: "sourcesFooter", text: h.sourcesFooter },
      ],
      verdicts: h.verdicts,
    };
  }

  if (content.gettingThere) {
    const g = content.gettingThere;
    result.gettingThere = {
      heading: "Getting There",
      sectionLabel: "Section 4 of 12",
      blocks: [
        { kind: "prose", text: g.intro },
        { kind: "factRows", label: g.stations.label, rows: g.stations.rows },
        { kind: "factRows", label: g.payment.label, rows: g.payment.options.map((o: { label: string; body: string }) => ({ label: o.label, value: o.body })) },
        { kind: "subheading", label: g.busBackup.label, body: g.busBackup.body },
        { kind: "callout", label: g.grabWarning.label, body: g.grabWarning.body },
        { kind: "sourcesFooter", text: g.sourcesFooter },
      ],
    };
  }

  if (content.weather) {
    const w = content.weather;
    result.weather = {
      heading: "Weather",
      sectionLabel: "Section 5 of 12",
      blocks: [
        { kind: "prose", text: w.intro },
        { kind: "subheading", label: w.realNumbers.label, body: w.realNumbers.body },
        { kind: "callout", label: w.grandstandExposure.label, body: w.grandstandExposure.body },
        { kind: "list", label: w.packList.label, items: w.packList.items.map((i: { label: string; body: string }) => `${i.label}: ${i.body}`) },
        { kind: "sourcesFooter", text: w.sourcesFooter },
      ],
    };
  }

  if (content.firstTimerGuide) {
    const f = content.firstTimerGuide;
    result.firstTimerGuide = {
      heading: "First-Timer's Guide",
      sectionLabel: "Section 6 of 12",
      blocks: [
        { kind: "prose", text: f.intro },
        ...f.mistakes.map((m: { number: number; label: string; body: string }) => ({ kind: "subheading" as const, label: `${m.number}. ${m.label}`, body: m.body })),
        { kind: "experiences", items: lookupMany(["singapore-gp-padang-stage-concerts"]) },
        { kind: "sectionHeading", label: f.practicalEssentials.label },
        { kind: "subheading", label: f.practicalEssentials.gateRules.label, body: f.practicalEssentials.gateRules.body },
        { kind: "subheading", label: f.practicalEssentials.accessibility.label, body: f.practicalEssentials.accessibility.body },
        { kind: "subheading", label: f.practicalEssentials.gettingOutAfterward.label, body: f.practicalEssentials.gettingOutAfterward.body },
        { kind: "sourcesFooter", text: f.sourcesFooter },
      ],
    };
  }

  if (content.whereToEat) {
    const w = content.whereToEat;
    result.whereToEat = {
      heading: "Where to Eat",
      sectionLabel: "Section 7 of 12",
      blocks: [
        { kind: "prose", text: w.intro },
        { kind: "experiences", items: lookupMany(["singapore-gp-maxwell-food-centre", "singapore-gp-lau-pa-sat", "singapore-gp-bayfront-hawkers"]) },
        { kind: "sourcesFooter", text: w.sourcesFooter },
      ],
      verdicts: w.verdicts,
    };
  }

  if (content.dayTrips) {
    const d = content.dayTrips;
    result.dayTrips = {
      heading: "Day Trips",
      sectionLabel: "Section 8 of 12",
      blocks: [
        { kind: "prose", text: d.intro },
        { kind: "experiences", items: lookupMany(["singapore-gp-waterfront-walk", "singapore-gp-sentosa", "singapore-gp-gardens-by-the-bay"]) },
        { kind: "sourcesFooter", text: d.sourcesFooter },
      ],
      verdicts: d.verdicts,
    };
  }

  if (content.itinerary) {
    const it = content.itinerary;
    result.itinerary = {
      heading: "Trip Schedule",
      sectionLabel: "Section 9 of 12",
      blocks: [
        { kind: "prose", text: it.eventRhythmIntro },
        { kind: "prose", text: it.daytimeNote },
        { kind: "factRows", label: "The week's shape", rows: it.weekShape.days.map((d: { day: string; summary: string }) => ({ label: d.day, value: d.summary })) },
        ...(it.hourByHourItinerary
          ? it.hourByHourItinerary.days.flatMap((day: { day: string; rows: { time: string; location: string; activity: string }[] }) => [
              { kind: "subheading" as const, label: day.day },
              { kind: "factRows" as const, rows: day.rows.map((r) => ({ label: `${r.time} — ${r.location}`, value: r.activity })) },
            ])
          : []),
        { kind: "sourcesFooter", text: it.sourcesFooter },
      ],
    };
  }

  if (content.arrival) {
    const a = content.arrival;
    result.arrival = {
      heading: "Arrival & Gate Guide",
      sectionLabel: "Section 10 of 12",
      blocks: [
        { kind: "prose", text: a.intro },
        { kind: "factRows", label: a.gates.label, rows: a.gates.rows.map((g: { name: string; landmark: string; mrt: string }) => ({ label: g.name, value: `${g.landmark} — nearest MRT: ${g.mrt}` })) },
        { kind: "subheading", label: a.sessionTiming.label, body: a.sessionTiming.body },
        ...a.arrivalStrategyByStand.map((s: { label: string; body: string }) => ({ kind: "subheading" as const, label: s.label, body: s.body })),
        { kind: "callout", label: a.securityTip.label, body: a.securityTip.body },
        { kind: "sourcesFooter", text: a.sourcesFooter },
      ],
      verdicts: a.verdicts,
    };
  }

  if (content.map) {
    const m = content.map;
    result.map = {
      heading: "Venue Map",
      sectionLabel: "Section 11 of 12",
      blocks: [
        { kind: "prose", text: m.intro },
        { kind: "sectionHeading", label: m.zones.label },
        ...m.zones.items.map((z: { label: string; body: string }) => ({ kind: "subheading" as const, label: z.label, body: z.body })),
        { kind: "sectionHeading", label: m.facilities.label },
        ...m.facilities.items.map((f: { label: string; body: string }) => ({ kind: "subheading" as const, label: f.label, body: f.body })),
        { kind: "subheading", label: m.wayfindingNote.label, body: m.wayfindingNote.body },
        { kind: "experiences", items: lookupMany(["singapore-gp-turn1-grandstand", "singapore-gp-stamford-grandstand", "singapore-gp-padang-grandstand", "singapore-gp-zone4-walkabout"]) },
        { kind: "sourcesFooter", text: m.sourcesFooter },
      ],
    };
  }

  if (content.luxury) {
    const lx = content.luxury;
    result.luxury = {
      heading: "Luxury Guide",
      sectionLabel: "Section 12 of 12",
      blocks: [
        { kind: "prose", text: lx.intro },
        { kind: "subheading", label: lx.hospitalityTiers.label, body: lx.hospitalityTiers.body },
        { kind: "subheading", label: lx.privateTransit.label, body: lx.privateTransit.body },
        { kind: "sectionHeading", label: lx.afterParties.label },
        ...lx.afterParties.venues.map((v: { name: string; body: string }) => ({ kind: "subheading" as const, label: v.name, body: v.body })),
        { kind: "subheading", label: lx.luxuryHotelsNote.label, body: lx.luxuryHotelsNote.body },
        { kind: "sectionHeading", label: lx.paddockClub.label, body: lx.paddockClub.intro },
        { kind: "experiences", items: lookupMany(["singapore-gp-paddock-club"]) },
        { kind: "factRows", label: "What's included", rows: lx.paddockClub.included.map((i: { label: string; detail: string }) => ({ label: i.label, value: i.detail })) },
        { kind: "callout", label: lx.paddockClub.pricingNote.label, body: lx.paddockClub.pricingNote.body },
        { kind: "sourcesFooter", text: lx.sourcesFooter },
      ],
      verdicts: lx.verdicts,
    };
  }

  return result;
}

function buildAtpFinals(content: ContentBundle, lookupMany: LookupMany): GenericSectionsResult {
  const result: GenericSectionsResult = {};

  if (content.tickets) {
    const t = content.tickets;
    result.tickets = {
      heading: "Tickets",
      sectionLabel: "Section 2 of 12",
      blocks: [
        { kind: "prose", text: t.intro },
        { kind: "callout", label: t.whyPricesVary.label, body: t.whyPricesVary.body },
        { kind: "experiences", items: lookupMany(["atp-finals-ticket-guide"]) },
      ],
      verdicts: t.verdicts,
    };
  }

  if (content.hotels) {
    const h = content.hotels;
    result.hotels = {
      heading: "Hotels",
      sectionLabel: "Section 3 of 12",
      blocks: [
        { kind: "prose", text: h.intro },
        { kind: "experiences", items: lookupMany(["atp-finals-luxury-hotels", "atp-finals-porta-nuova-neighborhood"]) },
        { kind: "callout", label: h.tramConnectionNote.label, body: h.tramConnectionNote.body },
      ],
      verdicts: h.verdicts,
    };
  }

  if (content.gettingThere) {
    const g = content.gettingThere;
    result.gettingThere = {
      heading: "Getting There",
      sectionLabel: "Section 4 of 12",
      blocks: [
        { kind: "prose", text: g.intro },
        { kind: "prose", text: g.airportAndTram },
        { kind: "experiences", items: lookupMany(["atp-finals-airport-to-city", "atp-finals-getting-to-inalpi-arena"]) },
        { kind: "subheading", label: g.aroundTheCity.label, body: g.aroundTheCity.body },
        { kind: "callout", label: g.sessionDaysNote.label, body: g.sessionDaysNote.body },
      ],
    };
  }

  if (content.weather) {
    const w = content.weather;
    result.weather = {
      heading: "Weather",
      sectionLabel: "Section 5 of 12",
      blocks: [
        { kind: "prose", text: w.intro },
        { kind: "factRows", label: w.whatToExpect.label, rows: w.whatToExpect.rows },
        { kind: "subheading", label: w.whatToPack.label, body: w.whatToPack.body },
        { kind: "callout", label: w.indoorsNote.label, body: w.indoorsNote.body },
        { kind: "sourcesFooter", text: w.sourcesFooter },
      ],
    };
  }

  if (content.firstTimerGuide) {
    const f = content.firstTimerGuide;
    result.firstTimerGuide = {
      heading: "First-Timer's Guide",
      sectionLabel: "Section 6 of 12",
      blocks: [
        { kind: "prose", text: f.intro },
        { kind: "subheading", label: f.format.label, body: f.format.body },
        { kind: "sectionHeading", label: f.essentialApps.label },
        ...f.essentialApps.items.map((i: { label: string; body: string }) => ({ kind: "subheading" as const, label: i.label, body: i.body })),
        { kind: "subheading", label: f.practicalEssentials.label, body: f.practicalEssentials.body },
        { kind: "subheading", label: f.gateRules.label, body: f.gateRules.body },
        { kind: "subheading", label: f.accessibility.label, body: f.accessibility.body },
        { kind: "callout", label: f.cityBeyondTennis.label, body: f.cityBeyondTennis.body },
        { kind: "experiences", label: "Five sights worth the walk", items: lookupMany(["atp-finals-mole-antonelliana", "atp-finals-museo-egizio", "atp-finals-royal-palace", "atp-finals-turin-cathedral", "atp-finals-piazza-san-carlo"]) },
        { kind: "sourcesFooter", text: f.sourcesFooter },
      ],
    };
  }

  if (content.whereToEat) {
    const w = content.whereToEat;
    result.whereToEat = {
      heading: "Where to Eat",
      sectionLabel: "Section 7 of 12",
      blocks: [
        { kind: "prose", text: w.intro },
        { kind: "experiences", items: lookupMany(["atp-finals-piedmontese-dining", "atp-finals-caffe-bicerin", "atp-finals-aperitivo-vermouth", "atp-finals-gianduja-chocolate"]) },
      ],
      verdicts: w.verdicts,
    };
  }

  if (content.dayTrips) {
    const d = content.dayTrips;
    result.dayTrips = {
      heading: "Day Trips",
      sectionLabel: "Section 8 of 12",
      blocks: [
        { kind: "prose", text: d.intro },
        { kind: "experiences", items: lookupMany(["atp-finals-barolo-langhe-daytrip", "atp-finals-juventus-museum"]) },
      ],
      verdicts: d.verdicts,
    };
  }

  if (content.itinerary) {
    const it = content.itinerary;
    result.itinerary = {
      heading: "Trip Schedule",
      sectionLabel: "Section 9 of 12",
      blocks: [
        { kind: "prose", text: it.eventRhythmIntro },
        { kind: "prose", text: it.laterRoundsNote },
        { kind: "factRows", label: "The week's shape", rows: it.weekShape.days.map((d: { day: string; detail: string }) => ({ label: d.day, value: d.detail })) },
        { kind: "callout", label: it.timesNotFixedNote.label, body: it.timesNotFixedNote.body },
        ...(it.hourByHourItinerary
          ? [
              { kind: "prose" as const, text: it.hourByHourItinerary.intro },
              ...it.hourByHourItinerary.days.flatMap((day: { day: string; rows: { time: string; location: string; activity: string }[] }) => [
                { kind: "subheading" as const, label: day.day },
                { kind: "factRows" as const, rows: day.rows.map((r) => ({ label: `${r.time} — ${r.location}`, value: r.activity })) },
              ]),
            ]
          : []),
      ],
    };
  }

  if (content.arrival) {
    const a = content.arrival;
    result.arrival = {
      heading: "Arrival — Inalpi Arena",
      sectionLabel: "Section 10 of 12",
      blocks: [
        { kind: "prose", text: a.intro },
        { kind: "subheading", label: a.twoEntrances.label, body: a.twoEntrances.body },
        { kind: "experiences", items: lookupMany(["atp-finals-inalpi-arena"]) },
        { kind: "subheading", label: a.arrivalTiming.label, body: a.arrivalTiming.body },
        { kind: "callout", label: a.gateOpeningNote.label, body: a.gateOpeningNote.body },
      ],
    };
  }

  if (content.map) {
    const m = content.map;
    result.map = {
      heading: "Venue Map",
      sectionLabel: "Section 11 of 12",
      blocks: [
        { kind: "prose", text: m.intro },
        { kind: "sectionHeading", label: m.siteLayout.label },
        ...m.siteLayout.items.map((i: { label: string; body: string }) => ({ kind: "subheading" as const, label: i.label, body: i.body })),
        { kind: "sectionHeading", label: m.facilities.label },
        ...m.facilities.items.map((i: { label: string; body: string }) => ({ kind: "subheading" as const, label: i.label, body: i.body })),
        { kind: "callout", label: m.reEntryNote.label, body: m.reEntryNote.body },
        { kind: "experiences", items: lookupMany(["atp-finals-practice-courts"]) },
        { kind: "callout", label: m.sustainabilityNote.label, body: m.sustainabilityNote.body },
        { kind: "sourcesFooter", text: m.sourcesFooter },
      ],
    };
  }

  if (content.luxury) {
    const lx = content.luxury;
    result.luxury = {
      heading: "Luxury Guide",
      sectionLabel: "Section 12 of 12",
      blocks: [
        { kind: "prose", text: lx.intro },
        { kind: "subheading", label: lx.premiumTransit.label, body: lx.premiumTransit.body },
        { kind: "sectionHeading", label: lx.offCircuitVenues.label },
        ...lx.offCircuitVenues.venues.map((v: { name: string; body: string }) => ({ kind: "subheading" as const, label: v.name, body: v.body })),
        { kind: "prose", text: lx.luxuryHotelsNote },
        { kind: "experiences", items: lookupMany(["atp-finals-luxury-hotels", "atp-finals-luxury-hospitality"]) },
        { kind: "factRows", label: lx.hospitalityTiers.label, rows: lx.hospitalityTiers.rows.map((r: { tier: string; includes: string; price: string }) => ({ label: r.tier, value: `${r.includes} — ${r.price}` })) },
        { kind: "sourcesFooter", text: lx.hospitalityTiers.priceNote },
        { kind: "sourcesFooter", text: lx.sourcesFooter },
      ],
      verdicts: lx.verdicts,
    };
  }

  return result;
}

function buildNzAustralia(content: ContentBundle, lookupMany: LookupMany): GenericSectionsResult {
  const result: GenericSectionsResult = {};

  if (content.tickets) {
    const t = content.tickets;
    result.tickets = {
      heading: "Tickets",
      sectionLabel: "Section 2 of 12",
      blocks: [
        { kind: "prose", text: t.intro },
        { kind: "prose", text: t.groundComparisonIntro },
        { kind: "experiences", items: lookupMany(["nz-australia-series-ticket-guide", "mcg-boxing-day-seating-comparison", "adelaide-oval-hill-vs-reserve"]) },
        { kind: "factRows", label: t.tierPicksTable.label, rows: t.tierPicksTable.rows.map((r: { ground: string; day: string; pick: string; why: string }) => ({ label: `${r.ground} — ${r.day}`, value: `${r.pick}: ${r.why}` })) },
        { kind: "sourcesFooter", text: t.sourcesFooter },
      ],
      verdicts: t.verdicts,
    };
  }

  if (content.hotels) {
    const h = content.hotels;
    result.hotels = {
      heading: "Hotels",
      sectionLabel: "Section 3 of 12",
      blocks: [
        { kind: "prose", text: h.intro },
        { kind: "experiences", items: lookupMany(["where-to-stay-perth-first-test", "where-to-stay-adelaide-city-vs-north", "where-to-stay-melbourne-boxing-day", "where-to-stay-sydney-fourth-test"]) },
      ],
      verdicts: h.verdicts,
    };
  }

  if (content.gettingThere) {
    const g = content.gettingThere;
    result.gettingThere = {
      heading: "Getting There",
      sectionLabel: "Section 4 of 12",
      blocks: [
        { kind: "prose", text: g.intro },
        { kind: "factRows", label: g.fourLegs.label, rows: g.fourLegs.rows.map((r: { route: string; detail: string }) => ({ label: r.route, value: r.detail })) },
        { kind: "callout", label: g.ruledOutNote.label, body: g.ruledOutNote.body },
        { kind: "experiences", items: lookupMany(["getting-between-four-cities-flights-not-trains"]) },
        { kind: "factRows", label: g.essentialApps.label, rows: g.essentialApps.items },
        { kind: "callout", label: g.bookingTip.label, body: g.bookingTip.body },
        { kind: "sourcesFooter", text: g.sourcesFooter },
      ],
    };
  }

  if (content.weather) {
    const w = content.weather;
    result.weather = {
      heading: "Weather",
      sectionLabel: "Section 5 of 12",
      blocks: [
        { kind: "prose", text: w.intro },
        { kind: "factRows", label: "City by city", rows: w.cityWeather.map((c: { city: string; detail: string }) => ({ label: c.city, value: c.detail })) },
        { kind: "sectionHeading", label: w.packList.label },
        ...w.packList.items.map((i: { label: string; body: string }) => ({ kind: "subheading" as const, label: i.label, body: i.body })),
        { kind: "sourcesFooter", text: w.sourcesFooter },
      ],
    };
  }

  if (content.firstTimerGuide) {
    const f = content.firstTimerGuide;
    result.firstTimerGuide = {
      heading: "First-Timer's Guide",
      sectionLabel: "Section 6 of 12",
      blocks: [
        { kind: "prose", text: f.intro },
        { kind: "sectionHeading", label: f.rivalryFacts.label },
        ...f.rivalryFacts.items.map((i: { title: string; detail: string }) => ({ kind: "subheading" as const, label: i.title, body: i.detail })),
        { kind: "sectionHeading", label: f.traditions.label },
        ...f.traditions.items.map((i: { title: string; detail: string }) => ({ kind: "subheading" as const, label: i.title, body: i.detail })),
        { kind: "experiences", items: lookupMany(["beige-brigade-nz-traveling-support"]) },
        { kind: "sectionHeading", label: f.mistakes.label },
        ...f.mistakes.items.map((i: { title: string; detail: string }) => ({ kind: "subheading" as const, label: i.title, body: i.detail })),
        { kind: "callout", label: f.tourInNumbers.label, body: f.tourInNumbers.body },
        { kind: "sourcesFooter", text: f.sourcesFooter },
      ],
    };
  }

  if (content.whereToEat) {
    const w = content.whereToEat;
    result.whereToEat = {
      heading: "Where to Eat",
      sectionLabel: "Section 7 of 12",
      blocks: [
        { kind: "prose", text: w.intro },
        { kind: "experiences", items: lookupMany(["where-nz-fans-actually-eat-city-guide"]) },
        { kind: "sourcesFooter", text: w.sourcesFooter },
      ],
      verdicts: w.verdicts,
    };
  }

  if (content.dayTrips) {
    const d = content.dayTrips;
    result.dayTrips = {
      heading: "Day Trips",
      sectionLabel: "Section 8 of 12",
      blocks: [
        { kind: "prose", text: d.intro },
        { kind: "experiences", items: lookupMany(d.experienceSlugs) },
        { kind: "sectionHeading", label: d.cityStayAlternative.label, body: d.cityStayAlternative.intro },
        { kind: "list", label: "Melbourne", items: d.cityStayAlternative.melbourne },
        { kind: "list", label: "Sydney", items: d.cityStayAlternative.sydney },
      ],
      verdicts: d.verdicts,
    };
  }

  if (content.itinerary) {
    const it = content.itinerary;
    result.itinerary = {
      heading: "Trip Schedule",
      sectionLabel: "Section 9 of 12",
      blocks: [
        { kind: "prose", text: it.intro },
        { kind: "factRows", label: it.schedule.label, rows: it.schedule.rows.map((r: { date: string; type: string; venue: string; city: string }) => ({ label: r.date, value: `${r.type} — ${r.venue}, ${r.city}` })) },
        { kind: "factRows", label: it.gaps.label, rows: it.gaps.items },
        { kind: "sectionHeading", label: it.elevenDayItinerary.label, body: it.elevenDayItinerary.intro },
        ...it.elevenDayItinerary.blocks.flatMap((b: { title: string; rows: { day: string; activity: string }[] }) => [
          { kind: "subheading" as const, label: b.title },
          { kind: "factRows" as const, rows: b.rows.map((r) => ({ label: r.day, value: r.activity })) },
        ]),
        { kind: "sourcesFooter", text: it.sourcesFooter },
      ],
      verdicts: it.verdicts,
    };
  }

  if (content.arrival) {
    const a = content.arrival;
    result.arrival = {
      heading: "Arrival — Four Grounds",
      sectionLabel: "Section 10 of 12",
      blocks: [
        { kind: "prose", text: a.intro },
        { kind: "experiences", items: lookupMany(["perth-stadium-series-opener", "adelaide-oval-most-beautiful-ground", "mcg-boxing-day-test", "scg-fourth-test-sydney-summer"]) },
        { kind: "callout", label: a.boxingDayNote.label, body: a.boxingDayNote.body },
        { kind: "subheading", label: a.gateOpeningNote.label, body: a.gateOpeningNote.body },
        { kind: "sourcesFooter", text: a.sourcesFooter },
      ],
    };
  }

  if (content.map) {
    const m = content.map;
    result.map = {
      heading: "Venue Map",
      sectionLabel: "Section 11 of 12",
      blocks: [
        { kind: "prose", text: m.intro },
        ...m.venues.map((v: { name: string; body: string }) => ({ kind: "subheading" as const, label: v.name, body: v.body })),
        { kind: "experiences", items: lookupMany(["perth-stadium-series-opener", "adelaide-oval-most-beautiful-ground", "mcg-boxing-day-test", "scg-fourth-test-sydney-summer"]) },
        { kind: "sectionHeading", label: m.accessibility.label },
        ...m.accessibility.venues.map((v: { name: string; body: string }) => ({ kind: "subheading" as const, label: v.name, body: v.body })),
        { kind: "sourcesFooter", text: m.sourcesFooter },
      ],
    };
  }

  if (content.luxury) {
    const lx = content.luxury;
    result.luxury = {
      heading: "Luxury Guide",
      sectionLabel: "Section 12 of 12",
      blocks: [
        { kind: "prose", text: lx.intro },
        { kind: "experiences", items: lookupMany(["mcg-corporate-boxes-boxing-day", "adelaide-oval-stadium-club-deck", "scg-luxury-invincibles-lounge-members-pavilion"]) },
        { kind: "callout", label: lx.perthGapNote.label, body: lx.perthGapNote.body },
        { kind: "subheading", label: lx.premiumHotelNote.label, body: lx.premiumHotelNote.body },
        { kind: "sourcesFooter", text: lx.sourcesFooter },
      ],
      verdicts: lx.verdicts,
    };
  }

  return result;
}

function buildAustralianOpen(content: ContentBundle, lookupMany: LookupMany): GenericSectionsResult {
  const result: GenericSectionsResult = {};

  if (content.tickets) {
    const t = content.tickets;
    result.tickets = {
      heading: "Tickets",
      sectionLabel: "Section 2 of 12",
      blocks: [
        { kind: "prose", text: t.intro },
        { kind: "factRows", label: t.ticketTypes.label, rows: t.ticketTypes.rows.map((r: { fallbackLabel: string; detail: string }) => ({ label: r.fallbackLabel, value: r.detail })) },
        { kind: "callout", label: t.presaleWindows.label, body: t.presaleWindows.body },
        { kind: "experiences", items: lookupMany(["ao-ticket-guide-grounds-session-finals", "outside-courts-grounds-pass-strategy"]) },
      ],
      verdicts: t.verdicts,
    };
  }

  if (content.hotels) {
    const h = content.hotels;
    result.hotels = {
      heading: "Hotels",
      sectionLabel: "Section 3 of 12",
      blocks: [
        { kind: "prose", text: h.intro },
        { kind: "experiences", items: lookupMany(["where-to-stay-melbourne-boxing-day"]) },
        { kind: "subheading", label: h.moderateHotelNote.label, body: h.moderateHotelNote.body },
        { kind: "callout", label: h.pricingTrap.label, body: h.pricingTrap.body },
      ],
      verdicts: h.verdicts,
    };
  }

  if (content.gettingThere) {
    const g = content.gettingThere;
    result.gettingThere = {
      heading: "Getting There",
      sectionLabel: "Section 4 of 12",
      blocks: [
        { kind: "prose", text: g.intro },
        { kind: "subheading", label: g.onFoot.label, body: g.onFoot.body },
        { kind: "sectionHeading", label: g.freeTram.label, body: g.freeTram.body },
        { kind: "factRows", rows: g.freeTram.facts },
        { kind: "subheading", label: g.byTrain.label, body: g.byTrain.body },
        { kind: "subheading", label: g.taxiRideshare.label, body: g.taxiRideshare.body },
        { kind: "sectionHeading", label: g.drivingParking.label, body: g.drivingParking.body },
        { kind: "factRows", rows: g.drivingParking.facts },
        { kind: "experiences", items: lookupMany(["getting-to-melbourne-park-transit"]) },
        { kind: "sourcesFooter", text: g.sourcesFooter },
      ],
    };
  }

  if (content.weather) {
    const w = content.weather;
    result.weather = {
      heading: "Weather",
      sectionLabel: "Section 5 of 12",
      blocks: [
        { kind: "prose", text: w.intro },
        { kind: "factRows", label: w.typicalConditions.label, rows: w.typicalConditions.rows },
        { kind: "callout", label: w.outdoorCourtsNote.label, body: w.outdoorCourtsNote.body },
        { kind: "experiences", items: lookupMany(["melbourne-january-heat-what-to-pack"]) },
        { kind: "sectionHeading", label: "What to pack" },
        ...w.whatToPack.map((i: { label: string; body: string }) => ({ kind: "subheading" as const, label: i.label, body: i.body })),
      ],
    };
  }

  if (content.firstTimerGuide) {
    const f = content.firstTimerGuide;
    result.firstTimerGuide = {
      heading: "First-Timer's Guide",
      sectionLabel: "Section 6 of 12",
      blocks: [
        { kind: "prose", text: f.intro },
        { kind: "experiences", items: lookupMany(["first-timers-guide-etiquette-crowd-culture"]) },
        { kind: "sectionHeading", label: f.dayVsNight.label },
        { kind: "subheading", label: "Day session", body: f.dayVsNight.day },
        { kind: "subheading", label: "Night session", body: f.dayVsNight.night },
        { kind: "subheading", label: f.gateOpeningNote.label, body: f.gateOpeningNote.body },
        { kind: "callout", label: f.mistakesNote.label, body: f.mistakesNote.body },
        { kind: "sectionHeading", label: "Essential apps" },
        ...f.essentialApps.map((i: { label: string; body: string }) => ({ kind: "subheading" as const, label: i.label, body: i.body })),
        { kind: "prose", text: f.aoLiveNote },
        { kind: "experiences", items: lookupMany(["grand-slam-oval-party-live-music"]) },
        { kind: "subheading", label: f.whatToCarryNote.label, body: f.whatToCarryNote.body },
      ],
    };
  }

  if (content.whereToEat) {
    const w = content.whereToEat;
    result.whereToEat = {
      heading: "Where to Eat",
      sectionLabel: "Section 7 of 12",
      blocks: [
        { kind: "prose", text: w.intro },
        { kind: "experiences", items: lookupMany(["grand-slam-oval-food-village"]) },
        { kind: "prose", text: w.coffeeIntro },
        { kind: "experiences", items: lookupMany(["melbourne-coffee-food-culture-guide"]) },
      ],
      verdicts: w.verdicts,
    };
  }

  if (content.dayTrips) {
    const d = content.dayTrips;
    result.dayTrips = {
      heading: "Day Trips",
      sectionLabel: "Section 8 of 12",
      blocks: [
        { kind: "prose", text: d.intro },
        { kind: "experiences", items: lookupMany(d.experienceSlugs) },
      ],
      verdicts: d.verdicts,
    };
  }

  if (content.itinerary) {
    const it = content.itinerary;
    result.itinerary = {
      heading: "Trip Schedule",
      sectionLabel: "Section 9 of 12",
      blocks: [
        { kind: "prose", text: it.eventRhythmIntro },
        { kind: "prose", text: it.practiceWeekIntro },
        { kind: "experiences", items: lookupMany(["practice-week-national-tennis-centre"]) },
        { kind: "factRows", label: it.fortnightShape.label, rows: it.fortnightShape.days.map((d: { day: string; detail: string }) => ({ label: d.day, value: d.detail })) },
        { kind: "prose", text: it.lateNightNote },
        { kind: "experiences", items: lookupMany(["late-night-melbourne-park-midnight-finishes"]) },
        { kind: "callout", label: it.timesNotFixedNote.label, body: it.timesNotFixedNote.body },
        ...(it.hourByHourItinerary
          ? [
              { kind: "prose" as const, text: it.hourByHourItinerary.intro },
              ...it.hourByHourItinerary.days.flatMap((day: { day: string; rows: { time: string; location: string; activity: string }[] }) => [
                { kind: "subheading" as const, label: day.day },
                { kind: "factRows" as const, rows: day.rows.map((r) => ({ label: `${r.time} — ${r.location}`, value: r.activity })) },
              ]),
            ]
          : []),
        { kind: "sourcesFooter", text: it.sourcesFooter },
      ],
    };
  }

  if (content.arrival) {
    const a = content.arrival;
    result.arrival = {
      heading: "Arrival — Melbourne Park",
      sectionLabel: "Section 10 of 12",
      blocks: [
        { kind: "prose", text: a.intro },
        { kind: "subheading", label: a.groundPassNote.label, body: a.groundPassNote.body },
        { kind: "experiences", items: lookupMany(["outside-courts-grounds-pass-strategy"]) },
        { kind: "subheading", label: a.reservedSeatNote.label, body: a.reservedSeatNote.body },
        { kind: "callout", label: a.gateOpeningNote.label, body: a.gateOpeningNote.body },
      ],
    };
  }

  if (content.map) {
    const m = content.map;
    result.map = {
      heading: "Venue Map",
      sectionLabel: "Section 11 of 12",
      blocks: [
        { kind: "prose", text: m.intro },
        { kind: "factRows", label: m.siteLayout.label, rows: m.siteLayout.rows },
        { kind: "experiences", items: lookupMany(["rod-laver-arena-inside-main-court", "margaret-court-john-cain-arenas"]) },
        { kind: "sectionHeading", label: "Facilities" },
        ...m.facilities.map((f: { label: string; body: string }) => ({ kind: "subheading" as const, label: f.label, body: f.body })),
        { kind: "callout", label: m.outsideCourtsNote.label, body: m.outsideCourtsNote.body },
        { kind: "sectionHeading", label: m.accessibility.label },
        ...m.accessibility.items.map((i: { label: string; body: string }) => ({ kind: "subheading" as const, label: i.label, body: i.body })),
        { kind: "sourcesFooter", text: m.sourcesFooter },
      ],
    };
  }

  if (content.luxury) {
    const lx = content.luxury;
    result.luxury = {
      heading: "Luxury Guide",
      sectionLabel: "Section 12 of 12",
      blocks: [
        { kind: "prose", text: lx.intro },
        { kind: "sectionHeading", label: lx.aoReserveIntro.label, body: lx.aoReserveIntro.body },
        { kind: "experiences", items: lookupMany(["corporate-hospitality-premium-suites"]) },
        { kind: "subheading", label: lx.premiumTransit.label, body: lx.premiumTransit.body },
        { kind: "sectionHeading", label: lx.offVenueLuxury.label },
        { kind: "subheading", label: `${lx.offVenueLuxury.hotel.name} — ★ ${lx.offVenueLuxury.hotel.rating.value} (${lx.offVenueLuxury.hotel.rating.source})`, body: lx.offVenueLuxury.hotel.body },
        { kind: "subheading", label: `${lx.offVenueLuxury.venue.name} — ★ ${lx.offVenueLuxury.venue.rating.value} (${lx.offVenueLuxury.venue.rating.source})`, body: lx.offVenueLuxury.venue.body },
        { kind: "factRows", label: "AO Reserve — dining rooms (book online)", rows: lx.diningRoomPackages.map((p: { name: string; venue: string; price: string; laterPrice: string | null; detail: string }) => ({ label: `${p.name} — from ${p.price}${p.laterPrice ? `, later: ${p.laterPrice}` : ""}`, value: `${p.venue} — ${p.detail}` })) },
        { kind: "factRows", label: "AO Reserve — inquiry-only", rows: lx.inquiryPackages.map((p: { name: string; venue: string; price: string; detail: string }) => ({ label: `${p.name} — from ${p.price}`, value: `${p.venue} — ${p.detail}` })) },
        { kind: "sourcesFooter", text: lx.packagesPriceNote },
      ],
      verdicts: lx.verdicts,
    };
  }

  return result;
}

function buildLasVegasGrandPrix(content: ContentBundle, lookupMany: LookupMany): GenericSectionsResult {
  const result: GenericSectionsResult = {};

  if (content.tickets) {
    const t = content.tickets;
    result.tickets = {
      heading: "Tickets",
      sectionLabel: "Section 2 of 12",
      blocks: [
        { kind: "prose", text: t.intro },
        { kind: "callout", label: t.officialVsResellerCallout.label, body: t.officialVsResellerCallout.body },
        { kind: "factRows", label: t.tiersTable.label, rows: t.tiersTable.rows.map((r: { name: string; note: string }) => ({ label: r.name, value: r.note })) },
        { kind: "experiences", label: "Every grandstand and zone, in detail", items: lookupMany(["las-vegas-gp-main-grandstand", "las-vegas-gp-turn3-grandstand", "las-vegas-gp-west-harmon-grandstand", "las-vegas-gp-flamingo-ga", "las-vegas-gp-tmobile-sphere", "las-vegas-gp-practice-qualifying-tickets"]) },
      ],
      verdicts: t.verdicts,
    };
  }

  if (content.hotels) {
    const h = content.hotels;
    result.hotels = {
      heading: "Hotels",
      sectionLabel: "Section 3 of 12",
      blocks: [
        { kind: "prose", text: h.intro },
        { kind: "experiences", items: lookupMany(["las-vegas-gp-trackside-hotels", "las-vegas-gp-off-strip-hotels"]) },
        { kind: "factRows", label: h.neighborhoodsTable.label, rows: h.neighborhoodsTable.rows.map((r: { name: string; detail: string; transit: string }) => ({ label: r.name, value: `${r.detail} ${r.transit}` })) },
        { kind: "sectionHeading", label: "Booking windows & contacts" },
        ...h.bookingCards.map((c: { name: string; url: string; note: string }) => ({ kind: "subheading" as const, label: c.name, body: c.note })),
        { kind: "sourcesFooter", text: h.sourcesFooter },
      ],
      verdicts: h.verdicts,
    };
  }

  if (content.gettingThere) {
    const g = content.gettingThere;
    result.gettingThere = {
      heading: "Getting There",
      sectionLabel: "Section 4 of 12",
      blocks: [
        { kind: "prose", text: g.intro },
        { kind: "factRows", label: g.transitOptionsTable.label, rows: g.transitOptionsTable.rows.map((r: { title: string; detail: string }) => ({ label: r.title, value: r.detail })) },
        { kind: "subheading", label: g.monorailFareBox.label, body: g.monorailFareBox.body },
        { kind: "callout", label: g.rideshareCallout.label, body: g.rideshareCallout.body },
        { kind: "callout", label: g.appDownloadCallout.label, body: g.appDownloadCallout.body },
        { kind: "experiences", items: lookupMany(["las-vegas-gp-getting-around"]) },
        { kind: "subheading", label: g.routeWeWouldPlan.label, body: g.routeWeWouldPlan.body },
        { kind: "sourcesFooter", text: g.sourcesFooter },
      ],
    };
  }

  if (content.weather) {
    const w = content.weather;
    result.weather = {
      heading: "Weather",
      sectionLabel: "Section 5 of 12",
      blocks: [
        { kind: "prose", text: w.intro },
        { kind: "subheading", label: w.realNumbersCallout.label, body: w.realNumbersCallout.body },
        { kind: "subheading", label: w.standExposureCallout.label, body: w.standExposureCallout.body },
        { kind: "factRows", label: w.packList.label, rows: w.packList.items.map((i: { title: string; detail: string }) => ({ label: i.title, value: i.detail })) },
        { kind: "callout", label: w.cashlessCallout.label, body: w.cashlessCallout.body },
        { kind: "sourcesFooter", text: w.sourcesFooter },
      ],
    };
  }

  if (content.firstTimerGuide) {
    const f = content.firstTimerGuide;
    result.firstTimerGuide = {
      heading: "First-Timer's Guide",
      sectionLabel: "Section 6 of 12",
      blocks: [
        { kind: "prose", text: f.intro },
        ...f.mistakes.map((m: { number: number; label: string; body: string }) => ({ kind: "subheading" as const, label: `${m.number}. ${m.label}`, body: m.body })),
        { kind: "experiences", items: lookupMany(["las-vegas-gp-first-timer-orientation"]) },
        { kind: "sectionHeading", label: f.freeSideOfWeekendLabel },
        { kind: "experiences", items: lookupMany(["las-vegas-gp-race-week-free", "las-vegas-gp-sportsbook-watch"]) },
        { kind: "sectionHeading", label: f.practicalEssentials.label },
        { kind: "subheading", label: f.practicalEssentials.apps.label, body: f.practicalEssentials.apps.rows.map((r: { name: string; detail: string }) => `${r.name}: ${r.detail}`).join(" ") },
        { kind: "subheading", label: f.practicalEssentials.accessibility.label, body: f.practicalEssentials.accessibility.body },
        { kind: "subheading", label: f.practicalEssentials.gettingOutAfterward.label, body: f.practicalEssentials.gettingOutAfterward.body },
        { kind: "sourcesFooter", text: f.sourcesFooter },
      ],
    };
  }

  if (content.whereToEat) {
    const w = content.whereToEat;
    result.whereToEat = {
      heading: "Where to Eat",
      sectionLabel: "Section 7 of 12",
      blocks: [
        { kind: "prose", text: w.intro },
        { kind: "experiences", items: lookupMany(["las-vegas-gp-bellagio-caesars-dining", "las-vegas-gp-fremont-downtown-dining"]) },
      ],
      verdicts: w.verdicts,
    };
  }

  if (content.dayTrips) {
    const d = content.dayTrips;
    result.dayTrips = {
      heading: "Day Trips",
      sectionLabel: "Section 8 of 12",
      blocks: [
        { kind: "prose", text: d.intro },
        { kind: "experiences", items: lookupMany(["las-vegas-gp-red-rock-canyon", "las-vegas-gp-hoover-dam"]) },
      ],
      verdicts: d.verdicts,
    };
  }

  if (content.itinerary) {
    const it = content.itinerary;
    result.itinerary = {
      heading: "Trip Schedule",
      sectionLabel: "Section 9 of 12",
      blocks: [
        { kind: "prose", text: it.intro },
        { kind: "factRows", label: it.eventRhythm.label, rows: it.eventRhythm.days.map((d: { label: string; detail: string }) => ({ label: d.label, value: d.detail })) },
        { kind: "sourcesFooter", text: it.eventRhythm.timezoneNote },
        { kind: "experiences", label: "The circuit's own landmarks", items: lookupMany(["las-vegas-gp-fountains-sphere", "las-vegas-gp-strip-at-night"]) },
      ],
      verdicts: it.verdicts.map((v: { label: string; days: Array<{ day: string; rows: Array<{ time: string; location: string; activity: string }> }>; closingNote: { label: string; body: string } }) => ({
        label: v.label,
        body: [
          ...v.days.flatMap((d) => [
            `${d.day}:`,
            ...d.rows.map((r) => `${r.time} — ${r.location}: ${r.activity}`),
          ]),
          `${v.closingNote.label}: ${v.closingNote.body}`,
        ].join(" "),
      })),
    };
  }

  if (content.arrival) {
    const a = content.arrival;
    result.arrival = {
      heading: "Arrival & Grandstand Guide",
      sectionLabel: "Section 10 of 12",
      blocks: [
        { kind: "prose", text: a.intro },
        { kind: "factRows", label: a.whatToExpectTable.label, rows: a.whatToExpectTable.rows.map((r: { title: string; detail: string }) => ({ label: r.title, value: r.detail })) },
        { kind: "factRows", label: a.arrivalStrategyByTier.label, rows: a.arrivalStrategyByTier.rows.map((r: { title: string; detail: string }) => ({ label: r.title, value: r.detail })) },
        { kind: "callout", label: a.appCallout.label, body: a.appCallout.body },
        { kind: "experiences", label: "What General Admission gets you", items: lookupMany(["las-vegas-gp-flamingo-ga"]) },
        { kind: "subheading", label: a.timingWeWouldPlan.label, body: a.timingWeWouldPlan.body },
        { kind: "sourcesFooter", text: a.sourcesFooter },
      ],
    };
  }

  if (content.map) {
    const m = content.map;
    result.map = {
      heading: "Venue Map",
      sectionLabel: "Section 11 of 12",
      blocks: [
        { kind: "prose", text: m.intro },
        { kind: "experiences", label: "The landmarks the circuit runs past", items: lookupMany(["las-vegas-gp-fountains-sphere", "las-vegas-gp-strip-casinos"]) },
        { kind: "factRows", label: "Facilities across the circuit", rows: m.facilities.map((f: { label: string; body: string }) => ({ label: f.label, value: f.body })) },
        { kind: "factRows", label: "Turn by turn", rows: m.turnByTurn.map((t: { zone: string; turns: string }) => ({ label: t.zone, value: t.turns })) },
        { kind: "sourcesFooter", text: m.turnByTurnCaption },
        { kind: "factRows", label: m.zoneStrategy.label, rows: m.zoneStrategy.rows.map((r: { title: string; detail: string }) => ({ label: r.title, value: r.detail })) },
        { kind: "sourcesFooter", text: m.sourcesFooter },
      ],
    };
  }

  if (content.luxury) {
    const lx = content.luxury;
    result.luxury = {
      heading: "Luxury Guide",
      sectionLabel: "Section 12 of 12",
      blocks: [
        { kind: "prose", text: lx.intro },
        { kind: "factRows", label: lx.hospitalityTiers.label, rows: lx.hospitalityTiers.rows.map((r: { title: string; detail: string }) => ({ label: r.title, value: r.detail })) },
        { kind: "subheading", label: lx.premiumTransitCallout.label, body: lx.premiumTransitCallout.body },
        { kind: "subheading", label: lx.afterSessionCallout.label, body: lx.afterSessionCallout.body },
        { kind: "subheading", label: lx.luxuryHotelFactCallout.label, body: lx.luxuryHotelFactCallout.body },
        { kind: "sectionHeading", label: lx.biggestDecisionLabel },
        { kind: "experiences", items: lookupMany(["las-vegas-gp-paddock-club"]) },
        { kind: "sourcesFooter", text: lx.sourcesFooter },
      ],
      verdicts: lx.verdicts,
    };
  }

  return result;
}

export const GENERIC_SECTION_BUILDERS: Record<string, (content: ContentBundle, lookupMany: LookupMany) => GenericSectionsResult> = {
  "bahrain-grand-prix": buildBahrainGrandPrix,
  "las-vegas-grand-prix": buildLasVegasGrandPrix,
  "shanghai-masters": buildShanghaiMasters,
  "singapore-grand-prix": buildSingaporeGrandPrix,
  "atp-finals": buildAtpFinals,
  "new-zealand-in-australia-cricket-2026-27": buildNzAustralia,
  "australian-open": buildAustralianOpen,
};

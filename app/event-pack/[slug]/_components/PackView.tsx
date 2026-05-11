import { db } from "@/lib/db";
import { experiences } from "@/schema/database";
import { eq, and } from "drizzle-orm";
import Link from "next/link";
import SignOutButton from "./SignOutButton";
import { AddAllToBoard, AddOneToBoard } from "./AddToBoard";
import HowToBook from "./HowToBook";
import HomepageNav from "@/app/_components/HomepageNav";

// transit → "Before you go" covers both planning and getting there.
// If a clean "Arriving" split is needed, add a packSection field to experiences.
const SECTION_MAP: Record<string, string> = {
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

const SECTION_ORDER = [
  "Before you go",
  "On the grounds",
  "Where to stay",
  "Where to eat",
  "The neighbourhood",
];

const ARCHETYPE_SECTION_ORDER: Record<string, string[]> = {
  pilgrim: [
    "Before you go",
    "On the grounds",
    "Where to stay",
    "Where to eat",
    "The neighbourhood",
  ],
  first_pilgrim: [
    "Before you go",
    "On the grounds",
    "Where to stay",
    "Where to eat",
    "The neighbourhood",
  ],
  connoisseur: [
    "Before you go",
    "Where to stay",
    "Where to eat",
    "On the grounds",
    "The neighbourhood",
  ],
  immersionist: [
    "Before you go",
    "The neighbourhood",
    "Where to eat",
    "On the grounds",
    "Where to stay",
  ],
};

const TYPE_LABELS: Record<string, string> = {
  fan_experience: "Fan experience",
  sports_venue: "Venue",
  accommodation: "Stay",
  dining: "Dining",
  activity: "Activity",
  cultural_site: "Cultural site",
  transit: "Getting there",
  neighborhood: "Neighbourhood",
  day_trip: "Day trip",
  multi_day: "Multi-day",
  natural_wonder: "Nature",
  event: "Event",
};

const BUDGET_LABELS: Record<string, string> = {
  free: "Free",
  budget: "Budget",
  moderate: "Mid-range",
  splurge: "Splurge",
  luxury: "Luxury",
};

interface PreTripBrief {
  updatedAt: string;
  live: boolean;
  lines: string[];
}

const PRE_TRIP_BRIEF: Record<string, PreTripBrief> = {
  "wimbledon-2026": {
    updatedAt: "2026-05-01",
    live: true,
    lines: [
      "This brief will be updated in the week before the tournament opens — check back from 22 June for transport news, weather, and any last-minute tips.",
    ],
  },
  "us-open-2026": {
    updatedAt: "2026-08-23",
    live: true,
    lines: [
      "This brief will be updated in the week before the tournament opens — check back from 23 August for transport news, weather, and any last-minute tips.",
    ],
  },
};

interface PackEditorial {
  brief: string;
  sectionIntros: Record<string, string>;
  localInfo: Array<{ label: string; value: string; href?: string; linkLabel?: string }>;
  experienceOrder: Record<string, string[]>;
}

const PACK_EDITORIAL: Record<string, PackEditorial> = {
  "wimbledon-2026": {
    brief:
      "Wimbledon runs for two weeks in late June and early July, but the experience of it — the bit worth paying for — starts before you get on the train. The queue culture, the strawberry ritual, the SW19 neighbourhood that treats its famous visitor with relaxed familiarity: none of it is accidental, and none of it is in the official guide.\n\nThis pack is built around one idea: that the best version of Wimbledon isn't on Centre Court. It's a picnic on Henman Hill when a match has just turned, a pre-match breakfast on the village high street, a quiet pint in the local pub after the day's last result. The experiences here were chosen because they're the difference between attending a tennis tournament and actually experiencing one.\n\nA few things worth knowing upfront. Centre Court tickets are harder than the ballot suggests — accept it early and you'll have a better trip. Queue camping is worth doing once. SW19 is a better base than central London. Read this as briefing notes from someone who's been going for years, not a category list. The sections follow the shape of your trip.",
    sectionIntros: {
      "Before you go":
        "The logistics of Wimbledon are half the experience, and almost entirely manageable if you know a few things before you arrive. The queue — the overnight camping line for day tickets — fills to hundreds by the early hours but runs in organised, friendly fashion; people who've done it describe it as one of the highlights of the trip. The other thing that trips most people up is transport. There's received wisdom about the District line that's mostly wrong, and a simpler route most guides don't mention. This section covers what to sort before you set off: how to get there without losing time on the wrong connection, what to bring that the official site won't tell you, and how to work the day-ticket system if you're going in without a ground pass.",
      "On the grounds":
        "Inside the All England Club you'll find 18 courts, a queue culture of its own, and about forty years of compressed tradition. What's less obvious from the outside is how accessible it actually is once you know how to move around. Henman Hill fills quickly on big match days but arrives manageable if you're through the gates before midday. Courts 2 and 3 are where the better matches often happen — the ones with the atmosphere that Centre Court sometimes lacks because everyone's watching too carefully. The picks here are the experiences worth planning around: the things that are genuinely Wimbledon-only, and a few that are quietly better than their reputation suggests.",
      "Where to stay":
        "Two honest options: SW19 and central London. The case for SW19 is straightforward — you're 15 minutes from the gates, the village has decent food and pubs, and you pick up the local atmosphere that makes the trip feel like more than a day out. The case for central London is that it works better if you're using Wimbledon as one day in a longer trip and don't mind the commute each way. The picks here cover both, with honest verdicts on the tradeoffs. One thing worth knowing: Wimbledon village — the quiet high street above the town — is a different proposition from the station area, and a noticeably better base.",
      "Where to eat":
        "The strawberries first: yes, get them. The Wimbledon strawberries-and-cream ritual is worth doing once for the ritual alone, queue included. After that, the real food question is how to eat well around the tournament without overpaying or ending at a chain on the Broadway. The neighbourhood has options the tournament crowd mostly walks past, and the village has a few places worth booking ahead. This section covers pre-match spots worth knowing, where to go after the last match, and what's genuinely good versus what's trading on proximity to the courts.",
      "The neighbourhood":
        "SW19 treats its annual guest with relaxed pride. For two weeks the whole area shifts gear: restaurants put up match menus, the park fills with picnics, the queue along Church Road becomes a neighbourhood fixture. The picks here are about the area rather than the event — what to do on a rest day, where to walk when you want to step away from tennis for a few hours, what Wimbledon is like as a place rather than a venue. Some of it has nothing to do with sport, which is exactly the point.",
    },
    localInfo: [
      { label: "Address", value: "Church Road, Wimbledon, London SW19 5AE", href: "https://maps.google.com/?q=All+England+Lawn+Tennis+Club+Church+Road+Wimbledon+SW19", linkLabel: "Open in Maps" },
      { label: "Official site", value: "wimbledon.com", href: "https://www.wimbledon.com", linkLabel: "Visit" },
      { label: "Best transport", value: "SWR train from London Waterloo → Wimbledon (21 min). District line terminates same station but slower from most of London.", href: "https://tfl.gov.uk/plan-a-journey/", linkLabel: "Plan your journey" },
      { label: "Queue gates open", value: "10:30am daily. Queue cards issued from mid-afternoon the day before." },
      { label: "What to bring", value: "Layers — London June weather swings 15°C–28°C. Waterproof. Good walking shoes. Picnic food (no alcohol, no glass). No large camera lenses." },
      { label: "Weather", value: "Variable. Rain likely. Centre Court and No. 1 Court roofs close automatically; outer courts may pause.", href: "https://www.accuweather.com/en/gb/wimbledon/sw19-4/weather-forecast/323341", linkLabel: "AccuWeather forecast" },
      { label: "Emergencies", value: "Emergency services: 999 · Non-emergency police: 101 · NHS urgent (non-emergency): 111 · Nearest A&E: St George's Hospital, Tooting SW17 0QT" },
    ],
    experienceOrder: {
      "On the grounds": ["Centre Court", "The Hill", "Eating", "No. 1 Court", "Practice Courts", "Outer Courts", "When It Rains"],
    },
  },

  "us-open-2026": {
    brief:
      "The US Open is two weeks in August heat, and it runs nothing like Wimbledon. Arthur Ashe Stadium holds 23,771 people and gets louder as the evening goes on. The night sessions — prime matches starting at 7pm under lights — are the event's signature, and there's nothing else in tennis that sounds or feels like them. If you're only making one trip, it's an evening session.\n\nThe rest of the tournament is more accessible than you'd expect. A grounds pass (around $50 in the first week) gets you onto every practice court and outer court, and you can be ten rows from a top-20 player on Court 7 at 11am before the stadium sessions have started. Bring water. Bring sunscreen. August in Queens runs hot, and the USTA has an extreme heat policy that can pause outdoor play — but knowing that in advance means it doesn't catch you off-guard.\n\nFlushing changes what this trip can be. The 7 train puts you in Queens, which means the food situation before and after the tournament is genuinely excellent. Flushing's Golden Mall is fifteen minutes from the gates. Jackson Heights is twenty-five. The neighbourhood has been feeding New York for decades and does not charge tournament prices. A few things to sort before you arrive: book night session tickets before anything else — they sell out months ahead. A hat and a refillable water bottle are not optional in August. The sections here follow the shape of the trip.",
    sectionIntros: {
      "Before you go":
        "The US Open is more accessible than most Slams. Day session grounds passes — around $50 in the first week — get you through the gates and onto every outer court and the practice facility without a reserved seat. Night sessions are a different category: reserved seating in Arthur Ashe Stadium, starting at 7pm, with the best matches of the tournament typically scheduled for prime time. Book those before your hotel if you can. The heat is the other thing to prepare for: August in Queens runs between 28°C and 38°C with genuine humidity, and the USTA has an extreme heat policy that can pause outdoor play when conditions exceed thresholds. Arthur Ashe and Louis Armstrong both have retractable roofs now, but getting between them in the afternoon is not trivial. The 7 train from Manhattan is the correct way to arrive: 40 minutes from Times Square or Grand Central, no transfers, drops you at Mets-Willets Point with a 10-minute walk to the gates.",
      "On the grounds":
        "The USTA Billie Jean King National Tennis Center covers 46.5 acres and runs 22 courts across the two-week tournament. Arthur Ashe Stadium is the largest tennis stadium in the world, and the quality of it in the evening — lights on, full house — is unlike anything else in the sport. The outer courts in the first week are worth as much time as the main stadiums: grounds passes cover all of them, and the access to top players is closer than at any other Slam. The food inside the grounds is more diverse than you'd expect for a tennis tournament, because this is New York and the catering reflects it. Plan the day around what you actually want to see.",
      "Where to stay":
        "Two honest options. Flushing puts you walking distance from the gates and inside the food ecosystem that makes this tournament different — the hotels are functional rather than characterful, but the convenience and neighbourhood access are real. Long Island City is the compromise: two stops on the 7 from Flushing, newer hotels, often better value than equivalent Midtown options, and a direct line to the courts with no changes. Manhattan works if you're combining the US Open with a broader New York trip, but the 40-minute commute each way adds up across a full tournament day plus night session.",
      "Where to eat":
        "The food around the US Open is one of the things that makes it different from every other major tennis event. Flushing has one of the most concentrated Chinese food scenes in the country — the Golden Mall basement, the hand-pulled noodle shops on Main Street, the Sichuan and Shanghainese restaurants a block off Roosevelt. Jackson Heights is 20 minutes further on the 7 and covers, within about six blocks of the elevated tracks, Mexican, Colombian, Tibetan, Nepali, and Bangladeshi food at prices that reflect what the neighbourhood pays. Both are covered here with enough specifics to navigate without research time when you arrive.",
      "The neighbourhood":
        "Flushing Meadows-Corona Park — the 1,255-acre park that contains the USTA facility — is worth time in its own right: the Unisphere, the Queens Museum, the park population in August that is as New York as it gets. The borough beyond it earns a day of its own: Astoria, Long Island City, the elevated tram to Roosevelt Island, the food under the 7 train elevated tracks in Jackson Heights. Queens is not just where the tournament happens. It's one of the most genuinely interesting boroughs in the city, and the US Open is a good reason to actually explore it.",
    },
    localInfo: [
      { label: "Address", value: "Flushing Meadows-Corona Park, Queens, NY 11368", href: "https://maps.google.com/?q=USTA+Billie+Jean+King+National+Tennis+Center+Flushing+Queens+NY", linkLabel: "Open in Maps" },
      { label: "Official site", value: "usopen.org", href: "https://www.usopen.org", linkLabel: "Visit" },
      { label: "Best transport", value: "7 train (Flushing line) from Manhattan → Mets-Willets Point station. 40 min from Times Square or Grand Central. 10-min walk to gates.", href: "https://www.mta.info/", linkLabel: "MTA trip planner" },
      { label: "Gates open", value: "Day sessions: grounds passes from 11am. Night sessions: from 7pm (separate tickets — book in advance)." },
      { label: "What to bring", value: "Sunscreen and a hat (non-negotiable in August heat). Refillable water bottle — free water stations on grounds. Layers for evening sessions. Soft-sided bag max 12×16×8 inches." },
      { label: "Weather", value: "Hot and humid. August highs 28–38°C. USTA extreme heat policy may pause outdoor play. Arthur Ashe and Louis Armstrong have retractable roofs.", href: "https://www.accuweather.com/en/us/flushing-meadows-corona-park/11367/weather-forecast/2627464?type=locality", linkLabel: "AccuWeather forecast" },
      { label: "Emergencies", value: "Emergency services: 911 · Non-emergency: 311 · Nearest hospital: NY-Presbyterian Queens, 56-45 Main St, Flushing NY 11355" },
    ],
    experienceOrder: {
      "On the grounds": ["Arthur Ashe", "Night Sessions", "Louis Armstrong", "Practice Facility", "Food Concourse", "When Play Stops"],
    },
  },
};

function orderItems<T extends { title: string; curationTier: string }>(
  items: T[],
  sectionName: string,
  eventSlug: string
): T[] {
  const order = PACK_EDITORIAL[eventSlug]?.experienceOrder[sectionName];
  if (order) {
    return [...items].sort((a, b) => {
      const ai = order.findIndex((kw) => a.title.includes(kw));
      const bi = order.findIndex((kw) => b.title.includes(kw));
      return (ai === -1 ? order.length : ai) - (bi === -1 ? order.length : bi);
    });
  }
  return [
    ...items.filter((e) => e.curationTier === "editorial"),
    ...items.filter((e) => e.curationTier !== "editorial"),
  ];
}

const INSIDER_TIPS: Record<string, Record<string, string[]>> = {
  "wimbledon-2026": {
    "Queue": [
      "For Centre Court, join the Queue by midday the day before and camp overnight — Queue cards are issued from mid-afternoon, one per person present",
      "For a grounds pass only, arriving by 5–6am on the morning is usually enough — the line moves steadily once gates open at 10:30am",
      "Bring layers, a waterproof, and something to sit on — the Queue is well-organised and friendly, but it's a long wait regardless",
    ],
    "Centre Court": [
      "Day tickets are released to queuers at 9:30am — for Centre Court, you realistically need to join the Queue by midday the day before and camp overnight",
      "After 3pm, returned tickets resell via the virtual queue on the myWimbledon app at the Ticket Resale station above Court 18 — often just £15",
      "Dress up; Centre Court has an expectation that the outer courts don't",
    ],
    "The Hill": [
      "Gets to standing room by midday on big match days — head there first if you want grass to sit on",
      "Grounds pass is all you need, no ticket upgrade required",
      "Bring your own food; no glass or alcohol from outside the grounds",
    ],
    "No. 1 Court": [
      "More intimate than Centre Court (12,345 seats vs 14,979) and the sightlines are better for most seats",
      "Has its own retractable roof since 2019 — play isn't stopped by rain",
      "East-side seats shade earlier in the day; west side later in the afternoon",
    ],
    "Practice Courts": [
      "Aorangi Park, north end of the grounds — walk up and watch, no reserved spots or upgrade needed",
      "Best access in the first few days, when top seeds are still warming up before their early-round matches",
      "Grounds open at 10am but practice can start before that — worth arriving early if you want to catch a specific player",
    ],
    "Outer Courts": [
      "Courts 3, 12, and 18 are the best grounds-pass courts — Court 3 most often draws a seeded player in the first week",
      "Think match competitiveness over names: a seeded player in a tight early-round match beats watching a big name cruise",
      "Check the Order of Play each morning at wimbledon.com before you arrive — it goes up the night before",
    ],
    "When It Rains": [
      "Centre Court and No. 1 Court roofs close automatically; outer courts pause — most delays are 30–60 minutes, rarely a full cancellation",
      "Head to Henman Hill with an umbrella to watch show courts on the big screen while you wait",
      "Rain delays are actually a good time for the 3pm resale queue — fewer people are thinking about it",
    ],
    "Eating": [
      "Strawberries and cream: £2.50 for 10 berries, picked before dawn — the queue is part of the ritual, do it once",
      "Pimm's has been a Wimbledon fixture since 1971; the official stalls are scattered across the grounds",
      "No glass and no alcohol from outside — but you can bring your own food for the Hill",
    ],
    "Wimbledon Museum & Private Tour": [
      "Tours of Centre Court are not available during the Championships — book for the week before (closes mid-June) or after the tournament ends in mid-July",
    ],
    "The Lawn at Wimbledon": [
      "Finals weekend and semi-final days sell out by January — book as soon as the Championships date is confirmed, not when you decide to go",
    ],
  },
  "us-open-2026": {
    "Arthur Ashe": [
      "Baseline corners (sections 1–9 and 60–67) are the sweet spot — you track the ball without turning your head",
      "Upper deck front rows are surprisingly close; the stadium is steep enough that sightlines hold up",
      "Mid-upper sections are a long way from the court in a 23,700-seat venue — you'll be watching the screen",
    ],
    "Night Sessions": [
      "Gates open at 6pm, first ball at 7pm — arrive by 6:15, the concourse fills fast",
      "Two matches per session; the second can start around 9:30pm and run past midnight",
      "Bring layers — Ashe gets cold once the sun goes down, even in August",
    ],
    "Louis Armstrong": [
      "14,053 seats and noticeably more intimate than Ashe — lower level is reserved, upper level general admission",
      "An Armstrong ticket doesn't include Ashe access, and vice versa — buy for the court you actually want",
      "Often has better tennis than Ashe in the first week, when top players play early rounds there",
    ],
    "Practice Facility": [
      "Check the official US Open app the night before for the practice schedule — it updates from the referee's office",
      "Courts P6–P17 are outside the main gates in Flushing Meadows-Corona Park — free to watch, no ticket needed",
      "Best player access of any Grand Slam; you can be a few rows from a top-10 player at 10am",
    ],
    "When Play Stops": [
      "Ashe and Louis Armstrong both have retractable roofs — reserved seats there are rain insurance",
      "The official US Open app has direct info from the referee's office; don't trust a generic weather app",
      "Extreme heat policy kicks in at a Heat Stress Index of 86.2°F — a 10-min break is added between sets",
    ],
    "Food Concourse": [
      "The Food Village clears out at night — best time to eat without queuing",
      "Poke Yachty and the Oyster Bar behind the Grandstand both have quick-moving lines",
      "You can bring your own food in a soft-sided bag no bigger than 12\"×12\"×16\"",
    ],
    "Rooftop Dinner Then the Night Session": [
      "Pier 17's Dinner and a Match packages are date-specific — book the dinner and the night session ticket on the same day so the timings align",
    ],
    "A Foodie Morning in Queens Before the Tennis": [
      "Morning tour + day session is the move — Queens at its quietest, then courts from 11am before the crowds build",
    ],
  },
};

function getInsiderTips(title: string, eventSlug: string): string[] | null {
  const eventTips = INSIDER_TIPS[eventSlug];
  if (!eventTips) return null;
  const key = Object.keys(eventTips).find((k) => title.includes(k));
  return key ? eventTips[key] : null;
}

interface RhythmEntry {
  label: string;
  body: string;
}

const TOURNAMENT_RHYTHM: Record<string, RhythmEntry[]> = {
  "wimbledon-2026": [
    {
      label: "Opening Monday",
      body: "The day the grounds feel genuinely electric — and genuinely overwhelming. Top seeds are on Centre Court and No. 1 Court from day one, but the outer courts are where the draw opens up — players ranked 60 to 120 on courts you can walk right up to. Get in before 11am. The gates flood. Roam and watch breadth.",
    },
    {
      label: "Early-round weekdays (Tue–Thu, Week 1)",
      body: "Quietly the best days to be there. The corporate groups clear out, the proper fans stay, and a grounds pass covers everything that matters. Wednesday and Thursday especially — fewer people, more access, and you can drop in and out of four matches in an afternoon without jostling for standing room.",
    },
    {
      label: "Middle Saturday (4 July)",
      body: "Every local knows this one. Third round done, 32 players left, and the tennis quality has genuinely jumped. The grounds are full but the energy earns it. Centre Court tickets are essentially gone unless you planned months ahead; Henman Hill and the outer courts on this day are a better story anyway.",
    },
    {
      label: "Week 2 weekdays (Mon–Thu)",
      body: "The draw thins to 16, then 8. Outer courts go quiet — fewer matches, bigger gaps in the schedule. What you get instead is actual seats, actual calm, and the best tennis of the tournament. Different kind of day. Not worse, just different.",
    },
    {
      label: "Semi-finals (Thu–Fri)",
      body: "Thursday is the Ladies' semis, Friday the Men's. The formality of the place tightens noticeably. Most of the crowd watches from pubs while the grounds go quiet. If you want pure tennis with no distraction, these are your days. If you came for the full Wimbledon feeling, it peaked around the quarterfinals.",
    },
    {
      label: "Finals Weekend (11–12 July)",
      body: "Saturday is the Ladies' Singles final and Men's Doubles. Sunday is the Men's Singles final and Ladies' Doubles. The trophy presentations are part of the event. Worth doing once — but it's also the most formal, least spontaneous version of Wimbledon. The tournament worth travelling for is the one with roaming outer courts and unexpected results. That ended a few days earlier.",
    },
  ],

  "us-open-2026": [
    {
      label: "Opening Sunday–Monday (Aug 30–31)",
      body: "Still 128 players in, the facility still navigable, day session tickets at their cheapest. You can watch three matches on three courts in a single afternoon. Night sessions are the introduction to what makes this tournament different — Ashe under lights with a full house sounds and feels like nothing else in tennis.",
    },
    {
      label: "First-week weekdays (Tue–Fri, Sep 1–4)",
      body: "The value window. Day sessions are genuinely quiet. Find a show court with open seats and stay. The breadth of the draw means surprises happen constantly. Night sessions build across the week: early matches at 7pm are still manageable, the second match starting around 9:30pm is something else entirely.",
    },
    {
      label: "Labor Day weekend (Sat Sep 5 – Mon Sep 7)",
      body: "Peak intensity. Labor Day falls on Monday Sep 7, and the whole weekend around it is the tournament's loudest stretch. Night session tickets are expensive for a reason — 23,000 people in Ashe Stadium on a US holiday weekend is closer to a World Cup final than a tennis match. Day sessions are calmer and the tennis quality has jumped (Round of 16, quarters). If you want to watch tennis, go during the day. If you want the experience, go at night.",
    },
    {
      label: "Semi-finals (Thu–Fri, Sep 10–11)",
      body: "Women's semis Thursday, Men's semis Friday. The contrast here is one of the stranger things about this tournament. A day quarterfinal in Ashe draws maybe 8,000 people in a 23,000-seat stadium. A night semi-final is sold out, wall of sound. The semi-finals are the loudest Ashe gets outside a final — and the best tennis of the fortnight.",
    },
    {
      label: "Finals weekend (Sat–Sun, Sep 12–13)",
      body: "Women's Final on Saturday Sep 12, Men's Final on Sunday Sep 13. The grounds become a proper street festival — Fan Fest, big screens, DJs in the secondary stadiums. Finals tickets are expensive and scarce; watching on screens in the park with 20,000 other people has its own thing going on. After the Men's trophy presentation, the tournament ends like a light switch. No gradual wind-down.",
    },
  ],
};

function toAnchor(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

interface PackViewProps {
  eventId: string;
  eventSlug: string;
  eventName: string;
  userEmail: string;
  heroImageUrl: string | null;
  dateRange: string;
  editorialOverview: string | null;
  sportLabel: string;
  isPro: boolean;
  archetype?: string | null;
}

export default async function PackView({
  eventId,
  eventSlug,
  eventName,
  userEmail,
  heroImageUrl,
  dateRange,
  editorialOverview,
  sportLabel,
  isPro,
  archetype,
}: PackViewProps) {
  const editorial = PACK_EDITORIAL[eventSlug] ?? PACK_EDITORIAL["wimbledon-2026"];
  const sectionOrder = (archetype && ARCHETYPE_SECTION_ORDER[archetype]) ?? SECTION_ORDER;

  const exps = await db
    .select({
      id: experiences.id,
      title: experiences.title,
      subtitle: experiences.subtitle,
      slug: experiences.slug,
      heroImageUrl: experiences.heroImageUrl,
      experienceType: experiences.experienceType,
      budgetTier: experiences.budgetTier,
      neighborhood: experiences.neighborhood,
      curationTier: experiences.curationTier,
      whyItsSpecial: experiences.whyItsSpecial,
      practicalInfo: experiences.practicalInfo,
    })
    .from(experiences)
    .where(
      and(
        eq(experiences.sportingEventId, eventId),
        eq(experiences.status, "published")
      )
    );

  const sections = sectionOrder.map((name) => {
    const raw = exps.filter((e) => SECTION_MAP[e.experienceType] === name);
    const ordered = orderItems(raw, name, eventSlug);
    const editorsPick = ordered[0] ?? null;
    const rest = ordered.slice(1);
    return { name, editorsPick, rest };
  }).filter((s) => s.editorsPick !== null);

  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <HomepageNav email={userEmail} />

      {/* Masthead — hero image + event info */}
      <div className="relative h-[40vh] min-h-[260px] overflow-hidden bg-neutral-900">
        {heroImageUrl && (
          <img
            src={heroImageUrl}
            alt={eventName}
            className="w-full h-full object-cover opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

        {/* Event info — bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-8 pb-8">
          <div className="max-w-5xl mx-auto">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-white bg-black/50 px-3 py-1 rounded-full mb-3">
              {sportLabel} · Event Pack
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              {eventName}
            </h1>
            <p className="mt-1.5 text-white/70 text-sm">{dateRange}</p>
          </div>
        </div>
      </div>

      {/* Pack bar — experience count + add all to board */}
      <div className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-4 flex items-center gap-4">
          <p className="text-sm text-neutral-500">
            {exps.length} experience{exps.length !== 1 ? "s" : ""}
          </p>
          <AddAllToBoard experienceIds={exps.map((e) => e.id)} />
        </div>
      </div>

      {/* Pre-trip brief */}
      {PRE_TRIP_BRIEF[eventSlug] &&
        (PRE_TRIP_BRIEF[eventSlug].live ? (
          <div className="border-b border-amber-200 bg-amber-50">
            <div className="max-w-5xl mx-auto px-6 sm:px-8 py-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold tracking-widest uppercase text-amber-600">
                  Pre-trip brief
                </p>
                <p className="text-xs text-amber-400">
                  Updated{" "}
                  {new Date(PRE_TRIP_BRIEF[eventSlug].updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <ul className="space-y-2">
                {PRE_TRIP_BRIEF[eventSlug].lines.map((line, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-amber-900 leading-6">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-amber-400" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="border-b border-neutral-100 bg-neutral-50">
            <div className="max-w-5xl mx-auto px-6 sm:px-8 py-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400">
                  Pre-trip brief
                </p>
                <p className="text-xs text-neutral-400">
                  Updated{" "}
                  {new Date(PRE_TRIP_BRIEF[eventSlug].updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <ul className="space-y-2">
                {PRE_TRIP_BRIEF[eventSlug].lines.map((line, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-neutral-500 leading-6">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-neutral-300" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

      {/* Editorial overview (from event record) */}
      {editorialOverview && (
        <div className="border-b border-neutral-100">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8">
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-3">
              The Pack
            </p>
            <p className="text-base font-semibold text-neutral-900 leading-snug mb-3">
              {exps.length} curated experiences — hand-picked by local experts
            </p>
            <p className="text-sm text-neutral-600 leading-7 max-w-2xl">
              {editorialOverview}
            </p>
          </div>
        </div>
      )}

      {/* Section quick-jump nav */}
      {sections.length > 1 && (
        <div className="border-b border-neutral-100 overflow-x-auto">
          <div className="max-w-5xl mx-auto px-6 sm:px-8">
            <div className="flex gap-6 py-3">
              {TOURNAMENT_RHYTHM[eventSlug] && (
                <a
                  href="#how-it-unfolds"
                  className="text-xs font-semibold tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors whitespace-nowrap"
                >
                  How it unfolds
                </a>
              )}
              {sections.map((s) => (
                <a
                  key={s.name}
                  href={`#${toAnchor(s.name)}`}
                  className="text-xs font-semibold tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors whitespace-nowrap"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* The Brief — editorial pack opener */}
      <div className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-6">
            The Brief
          </p>
          <div className="max-w-2xl">
            {editorial.brief.split("\n\n").map((para: string, i: number) => (
              <p
                key={i}
                className="text-neutral-700 leading-8 text-[15px] mb-5 last:mb-0"
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* How the tournament unfolds — rhythm guide */}
      {TOURNAMENT_RHYTHM[eventSlug] && (
        <div id="how-it-unfolds" className="border-b border-neutral-100">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-6">
              How the tournament unfolds
            </p>
            <div className="max-w-2xl space-y-6">
              {TOURNAMENT_RHYTHM[eventSlug].map((entry) => (
                <div key={entry.label}>
                  <p className="text-sm font-semibold text-neutral-900 mb-1.5">{entry.label}</p>
                  <p className="text-[15px] text-neutral-600 leading-7">{entry.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick reference — useful local info */}
      <div className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-6">
            Quick reference
          </p>
          <div className="rounded-xl border border-neutral-200 divide-y divide-neutral-100">
            {editorial.localInfo.map((row) => (
              <div
                key={row.label}
                className="flex gap-4 px-5 py-4 sm:items-start"
              >
                <dt className="w-32 flex-shrink-0 text-xs font-semibold text-neutral-500 pt-0.5">
                  {row.label}
                </dt>
                <dd className="text-sm text-neutral-700 leading-6 flex-1">
                  {row.value}
                  {row.href && (
                    <a
                      href={row.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-xs text-neutral-400 underline hover:text-neutral-700 transition-colors"
                    >
                      {row.linkLabel} ↗
                    </a>
                  )}
                </dd>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Journey-stage sections */}
      <div className="divide-y divide-neutral-100">
        {sections.map((section) => (
          <div
            key={section.name}
            id={toAnchor(section.name)}
            className="max-w-5xl mx-auto px-6 sm:px-8 py-14"
          >
            {/* Section heading + intro */}
            <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4">
              {section.name}
            </h2>
            {editorial.sectionIntros[section.name] && (
              <p className="text-neutral-600 text-[15px] leading-8 max-w-2xl mb-10">
                {editorial.sectionIntros[section.name]}
              </p>
            )}

            {/* Editor's Pick — feature card */}
            {section.editorsPick && (
              <Link
                href={`/experience/${section.editorsPick.slug}`}
                className="group block rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-400 transition-colors mb-5"
              >
                {section.editorsPick.heroImageUrl && (
                  <div className="h-60 overflow-hidden bg-neutral-100">
                    <img
                      src={section.editorsPick.heroImageUrl}
                      alt={section.editorsPick.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    {(section.editorsPick.practicalInfo as { howToBook?: string } | null)?.howToBook ? (
                      <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                        Concierge pick
                      </span>
                    ) : (
                      <span className="text-xs font-semibold uppercase tracking-widest bg-neutral-900 text-white px-2.5 py-1 rounded-full">
                        Editor&apos;s pick
                      </span>
                    )}
                    {section.editorsPick.budgetTier && (
                      <span className="text-xs text-neutral-400">
                        {BUDGET_LABELS[section.editorsPick.budgetTier] ??
                          section.editorsPick.budgetTier}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 leading-snug group-hover:text-neutral-600 transition-colors">
                    {section.editorsPick.title}
                  </h3>
                  {section.editorsPick.subtitle && (
                    <p className="mt-1.5 text-sm text-neutral-600 leading-6">
                      {section.editorsPick.subtitle}
                    </p>
                  )}
                  {section.editorsPick.whyItsSpecial && (
                    <p className="mt-3 text-sm text-neutral-500 italic leading-6 line-clamp-2">
                      {section.editorsPick.whyItsSpecial.split("\n\n")[0]}
                    </p>
                  )}
                  {section.editorsPick.neighborhood && (
                    <p className="mt-3 text-xs text-neutral-400">
                      {section.editorsPick.neighborhood}
                    </p>
                  )}
                  {(() => {
                    const tips = getInsiderTips(section.editorsPick.title, eventSlug);
                    return tips ? (
                      <div className="mt-4 pt-3 border-t border-neutral-100">
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-2">Worth knowing</p>
                        <ul className="space-y-1">
                          {tips.map((tip, i) => (
                            <li key={i} className="flex gap-2 text-xs text-neutral-600 leading-5">
                              <span className="text-neutral-300 flex-shrink-0">—</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null;
                  })()}
                  {(section.editorsPick.practicalInfo as { howToBook?: string } | null)?.howToBook && (
                    <HowToBook
                      howToBook={(section.editorsPick.practicalInfo as { howToBook: string }).howToBook}
                      isPro={isPro}
                      eventSlug={eventSlug}
                    />
                  )}
                  <div className="mt-4 pt-3 border-t border-neutral-100">
                    <AddOneToBoard experienceId={section.editorsPick.id} />
                  </div>
                </div>
              </Link>
            )}

            {/* Remaining picks — 2-column grid */}
            {section.rest.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {section.rest.map((exp) => (
                  <Link
                    key={exp.id}
                    href={`/experience/${exp.slug}`}
                    className="group rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-400 transition-colors"
                  >
                    <div className="h-36 overflow-hidden bg-neutral-100">
                      {exp.heroImageUrl ? (
                        <img
                          src={exp.heroImageUrl}
                          alt={exp.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-200" />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        {(exp.practicalInfo as { howToBook?: string } | null)?.howToBook ? (
                          <span className="text-xs font-semibold tracking-widest uppercase text-amber-600">
                            Concierge pick
                          </span>
                        ) : (
                          <span className="text-xs font-semibold tracking-widest uppercase text-neutral-400">
                            {TYPE_LABELS[exp.experienceType] ?? exp.experienceType}
                          </span>
                        )}
                        {exp.budgetTier && (
                          <span className="text-xs text-neutral-400">
                            {BUDGET_LABELS[exp.budgetTier] ?? exp.budgetTier}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-neutral-900 leading-snug group-hover:text-neutral-600 transition-colors">
                        {exp.title}
                      </h3>
                      {exp.subtitle && (
                        <p className="mt-1 text-xs text-neutral-500 line-clamp-2 leading-5">
                          {exp.subtitle}
                        </p>
                      )}
                      {exp.neighborhood && (
                        <p className="mt-2 text-xs text-neutral-400">
                          {exp.neighborhood}
                        </p>
                      )}
                      {(() => {
                        const tips = getInsiderTips(exp.title, eventSlug);
                        return tips ? (
                          <div className="mt-3 pt-2 border-t border-neutral-100">
                            <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-2">Worth knowing</p>
                            <ul className="space-y-1">
                              {tips.map((tip, i) => (
                                <li key={i} className="flex gap-2 text-xs text-neutral-600 leading-5">
                                  <span className="text-neutral-300 flex-shrink-0">—</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null;
                      })()}
                      {(exp.practicalInfo as { howToBook?: string } | null)?.howToBook && (
                        <HowToBook
                          howToBook={(exp.practicalInfo as { howToBook: string }).howToBook}
                          isPro={isPro}
                          eventSlug={eventSlug}
                        />
                      )}
                      <div className="mt-3 pt-2 border-t border-neutral-100">
                        <AddOneToBoard experienceId={exp.id} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pro upsell — non-Pro users only */}
      {!isPro && (
        <div className="border-t border-neutral-100 bg-neutral-50">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12">
            <div className="max-w-xl">
              <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-3">
                Pro
              </p>
              <h2 className="text-lg font-bold text-neutral-900 mb-6">
                Go deeper with this pack
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex gap-3">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-neutral-900 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                      <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">How to book the concierge picks</p>
                    <p className="text-xs text-neutral-500 mt-0.5 leading-5">Specific operator contacts, lead times, and exactly what to ask — not just a name and a link.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-neutral-900 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                      <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">Sell-out reminders</p>
                    <p className="text-xs text-neutral-500 mt-0.5 leading-5">Timed alerts before the high-demand experiences in this pack close their books.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-neutral-900 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                      <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">Unlimited Trip Boards</p>
                    <p className="text-xs text-neutral-500 mt-0.5 leading-5">Plan and save across as many trips as you like — not just this one.</p>
                  </div>
                </div>
              </div>
              <Link
                href="/pro"
                className="inline-flex items-center px-6 py-3 rounded-full bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-700 transition-colors"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

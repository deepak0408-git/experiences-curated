import { db } from "@/lib/db";
import { experiences, sportingEventExperiences } from "@/schema/database";
import { eq, and, asc } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { AddAllToBoard, AddOneToBoard } from "./AddToBoard";
import HowToBook from "./HowToBook";
import AskCuratorForm from "./AskCuratorForm";
import PackDownload from "./PackDownload";
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


interface TourMatch {
  date: string;
  type: string;
  venue: string;
  city: string;
}

interface PackEditorial {
  brief: string;
  sectionIntros: Record<string, string>;
  localInfo: Array<{ label: string; value: string; href?: string; linkLabel?: string }>;
  experienceOrder: Record<string, string[]>;
  tourItinerary?: TourMatch[];
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

  "india-in-england-cricket-2026": {
    brief:
      "This is not a Test series. Five T20Is and three ODIs across three weeks in July — Birmingham, Nottingham, London, and back again. The format means big crowds, loud atmospheres, and India playing in front of what are effectively home crowds wherever they go. Edgbaston on 14 July is the centrepiece: the ground fills with blue shirts, the Bharat Army takes over entire stands, and a city with one of the largest British-Indian communities in the country treats an away fixture like a home one.\n\nLord's on 19 July is the other anchor. The ODI at cricket's most famous ground, the Grace Gates, the Long Room, the Lord's Tavern. It's a different kind of atmosphere — more reverent, more traditional — but equally worth doing if you can get tickets.\n\nThe pack is built around both grounds, with specific guidance on pre-match rituals, the fan community you can join rather than just watch, and where to eat and stay near each venue. The itinerary below gives you the full schedule so you can plan around the fixtures that matter most.",
    sectionIntros: {
      "Before you go": "Tickets for the India fixtures sell fast — the Edgbaston T20 and Lord's ODI in particular. Check the ECB website (ecb.co.uk/tickets) and set alerts. The Bharat Army (bharatarmy.com) also organises group travel and tickets for Indian fans. For Birmingham, New Street station is 15 minutes from the ground by taxi or 25 minutes on foot through Edgbaston. For Lord's, St John's Wood tube (Jubilee line) is a 10-minute walk to the Grace Gates.",
      "On the grounds": "Both Edgbaston and Lord's are worth arriving early for. Edgbaston opens its gates 90 minutes before play — use that time at the Twelfth Man across the road before heading in. Lord's has the Long Room, the MCC Museum, and the Tavern inside the gates. Neither ground is somewhere to rush.",
      "Where to stay": "For Edgbaston: the Edgbaston Park Hotel is closest and the most considered option. For Lord's: anywhere in St John's Wood or Marylebone puts you within walking distance. The Landmark London on Marylebone Road is the best of the nearby hotels.",
      "Where to eat": "Birmingham's Balti Triangle is 10 minutes from Edgbaston and worth the trip regardless of cricket. Shababs on Ladypool Road is the standard-bearer. For Lord's, the Tavern itself handles pre-match well, and Soutine on St John's Wood High Street is the best sit-down option nearby.",
      "The neighbourhood": "Moseley village — 20 minutes from Edgbaston — is where Birmingham actually lives. Victorian terraces, independent cafés, the farmers' market on the last Saturday of the month. St John's Wood around Lord's is quieter and more prosperous: the high street, the Abbey Road crossing, Regent's Park a 10-minute walk north.",
    },
    localInfo: [
      { label: "Tickets", value: "ecb.co.uk/tickets/england", href: "https://www.ecb.co.uk/tickets/england", linkLabel: "ECB ticketing" },
      { label: "Bharat Army", value: "bharatarmy.com — official India touring fan group", href: "https://www.bharatarmy.com", linkLabel: "Visit" },
      { label: "Edgbaston transport", value: "Birmingham New Street → taxi 15 min or walk 25 min through Edgbaston village", href: "https://maps.google.com/?q=Edgbaston+Stadium,+Edgbaston+Road,+Birmingham+B5+7QU", linkLabel: "Open in Maps" },
      { label: "Lord's transport", value: "St John's Wood (Jubilee line) → 10-min walk to Grace Gates", href: "https://maps.google.com/?q=Lord%27s+Cricket+Ground,+St+John%27s+Wood+Road,+London+NW8+8QN", linkLabel: "Open in Maps" },
      { label: "Emergencies", value: "Emergency services: 999 · NHS urgent (non-emergency): 111 · Birmingham A&E: Queen Elizabeth Hospital, Mindelsohn Way, B15 2GW · London A&E: UCLH, 235 Euston Rd, NW1 2BU" },
    ],
    experienceOrder: {},
    tourItinerary: [
      { date: "1 Jul", type: "1st T20I", venue: "Riverside Ground", city: "Chester-le-Street" },
      { date: "4 Jul", type: "2nd T20I", venue: "Old Trafford", city: "Manchester" },
      { date: "7 Jul", type: "3rd T20I", venue: "Trent Bridge", city: "Nottingham" },
      { date: "9 Jul", type: "4th T20I", venue: "County Ground", city: "Bristol" },
      { date: "11 Jul", type: "5th T20I", venue: "Rose Bowl", city: "Southampton" },
      { date: "14 Jul", type: "1st ODI", venue: "Edgbaston", city: "Birmingham" },
      { date: "16 Jul", type: "2nd ODI", venue: "Sophia Gardens", city: "Cardiff" },
      { date: "19 Jul", type: "3rd ODI", venue: "Lord's", city: "London" },
    ],
  },

  "open-championship-2026": {
    brief:
      "The Open is four days in July on a links course in Southport that is simultaneously the most famous golf tournament in the world and one of the most accessible major sports events on the UK calendar. The championship field is the best in golf. The course is public. The dunes are free to climb. If you go once and do it right, it is one of the most purely enjoyable days in sport.\n\nThe event runs Thursday 16 to Sunday 19 July 2026 at Royal Birkdale Golf Club. The full sequence starts Sunday 12 July with the first practice day and builds across a week — Last-Chance Qualifier on Monday, the full field on Tuesday, the Heroes Classic on Wednesday, and then four championship days. General admission is the foundation: it unlocks the whole course, the Spectator Village, and everything in the dunes. The hospitality tiers — Ticket Plus at £270–300, Platinum from £1,632, Signature from £2,574 — layer on top for those who want a fixed base and a reserved seat.\n\nA few things to sort before you arrive. General admission championship days are sold out. Practice day tickets (Sunday through Wednesday, from £30) still have availability as of mid-June 2026. Transport is simple: Merseyrail Northern Line to Birkdale station, 40 minutes from Liverpool Central, 8 minutes' walk to the gates. Do not drive on championship days — road closures around Royal Birkdale are extensive and parking is hospitality-only. The sections here follow the shape of the trip: how to get there, what to do on the course, where to stay in Southport, where to eat in Birkdale village, and how the wider area fits a longer trip.",
    sectionIntros: {
      "Before you go":
        "General admission championship day tickets are sold out across all four days. Practice day tickets remain — Sunday 12 July from £30, Wednesday 15 July around £75. Ticket Plus (£270–300) adds a private zone near the 4th green and a covered grandstand platform; it sells fast for Saturday and Sunday. Platinum and Signature hospitality (from £1,632) are available for Wednesday and selected championship days. Transport: Merseyrail Northern Line, Liverpool Central to Birkdale, 40 minutes, then an 8-minute walk. Book at theopen.com. The R&A Experience Team on +44 (0)1334 460090 can advise on availability not visible online.",
      "On the grounds":
        "Royal Birkdale runs in a figure-of-eight through sandhills. Each hole sits in its own dune corridor — self-contained, navigable, quieter than the grandstands suggest. The strategic question is whether to follow a group or commit to a specific hole. Most experienced Birkdale spectators do both: follow on the first walk, then settle at the 11th dune or the 18th grandstand once they've found their spots. General admission covers the whole course. The Links zone near the 4th is Ticket Plus only. Grandstands at the 2nd, 9th, and 18th are included in general admission; the 18th on Sunday fills early.",
      "Where to stay":
        "Southport is 2 miles from Royal Birkdale and the right base for the week. Lord Street — Southport's covered Victorian shopping street — has the town's best hotels within walking distance of cafés and restaurants. Birkdale village is quieter and closer to the gates. Liverpool is 40 minutes by train and worth considering if you want a city base and the commute is no inconvenience.",
      "Where to eat":
        "Birkdale village has the best eating in the immediate area. Bistrot Vérité is the standard-bearer — a neighbourhood bistro that punches well above its postcode. The village pubs handle the pre- and post-match crowd reliably during Open week. Lord Street in Southport town is the wider option for a sit-down dinner away from the tournament crowd.",
      "The neighbourhood":
        "Southport is a Victorian seaside town with a serious main street, a wide beach, and a pace that makes it a genuine rest-day destination. Liverpool is 40 minutes away and worth at least a day: the docks, the two cathedrals, Albert Dock, the food scene. The contrast between a morning in Liverpool and an afternoon at the world's oldest major is one of the stranger and better things you can do in British sport.",
    },
    localInfo: [
      { label: "Address", value: "Waterloo Road, Southport PR8 2LX", href: "https://maps.google.com/?q=Royal+Birkdale+Golf+Club+Waterloo+Road+Southport+PR8+2LX", linkLabel: "Open in Maps" },
      { label: "Official site", value: "theopen.com", href: "https://www.theopen.com", linkLabel: "Visit" },
      { label: "Tickets", value: "Practice days still available from £30. Championship days sold out; hospitality via R&A Experience Team.", href: "https://www.theopen.com/tickets-and-hospitality/2026", linkLabel: "Book tickets" },
      { label: "Best transport", value: "Merseyrail Northern Line, Liverpool Central → Birkdale (40 min). 8-min walk to gates. No driving on championship days.", href: "https://www.merseyrail.org/plan-your-journey/", linkLabel: "Plan journey" },
      { label: "Gates open", value: "Championship days: 2 hrs before first tee. Practice days Sun 12–Wed 15 Jul from approx. 7:30am. Cashless payments only." },
      { label: "What to bring", value: "Layers (14–24°C in July). Waterproof. Good walking shoes. Card only — no cash on site. No glass." },
      { label: "Weather", value: "Mild to warm with sea breeze. Rain possible on any day.", href: "https://www.accuweather.com/en/gb/southport/pr8-5/weather-forecast/330516?type=locality", linkLabel: "AccuWeather forecast" },
      { label: "Emergencies", value: "Emergency services: 999 · NHS urgent: 111 · Nearest A&E: Southport & Ormskirk Hospital, Town Lane, Southport PR8 6PN" },
    ],
    experienceOrder: {
      "On the grounds": ["18th at Royal Birkdale", "Links", "Practice Day", "Dunes", "Signature", "Royal Birkdale Golf Club"],
    },
  },

  "bmw-pga-championship-2026": {
    brief:
      "The BMW PGA Championship is four days at Wentworth Club, and Wentworth is not a course you can simply decide to play. It's fully private — no green fees, no public booking, guest-of-member only — which makes tournament week the one time most people will ever get close to the West Course at all. That's the thing to understand before anything else: this isn't a golf weekend where the venue happens to be exclusive, the exclusivity is the whole shape of the trip.\n\nWhat you get instead of a course you can walk any day is a genuinely different kind of golf week. This is the DP World Tour's own flagship event — a Rolex Series tournament with a 2026 field that includes Rory McIlroy, Aaron Rai, and the last three champions of the event. It's also billed, accurately, as the Festival of Golf: a Celebrity Pro-Am on the Wednesday before, live concerts on the Show Stage through the weekend (The Kooks confirmed to headline Saturday 19 September), and a Championship Village built around BMW and MINI as much as around golf. You're not choosing between watching a tournament and having a day out. Wentworth built both into the same ticket.\n\nA few things worth knowing before you commit to a plan. This is a London day trip, not a multi-night expedition — Wentworth sits roughly 46 minutes from London Waterloo by direct train, which means you can genuinely do this without booking anywhere to stay, though Windsor Castle and Eton sitting a few miles away make a strong case for turning it into more than one day. Hospitality here runs in real tiers with real differences, not just pricier seats: Treetops on the 14th, The Approach beside the 18th fairway, and 72 Lounge/Green on 18 inside the Championship Pavilion each give you a genuinely different day, not the same day with better catering. The sections here follow the shape of the week: what to sort before you go, what's actually on the grounds, where to stay if you make a trip of it, where to eat, and what Windsor and Eton add if you have the time.",
    sectionIntros: {
      "Before you go":
        "General admission and hospitality packages go on sale well ahead of the 17–20 September week — Rolex Series demand means the Celebrity Pro-Am (Wednesday) and the weekend rounds sell fastest. Hospitality tiers range from 72 Lounge (£370pp) through Green on 18 (£750pp) and The Approach by James Tanner (from £540pp) up to Treetops on the 14th. Transport is simple: direct South Western Railway service from London Waterloo to Longcross (~46 min) or Virginia Water (~58 min), both a short walk or shuttle from the gates. There is no way to book a round at Wentworth itself as a member of the public — tournament week general admission is the realistic way to see the West Course in person.",
      "On the grounds":
        "Wentworth's West Course rewards knowing where to plant yourself. The 18th green sits in a natural amphitheatre and is where recent tournaments have actually been decided — Billy Horschel's 2024 playoff eagle happened here. The 10th is a deceptively hard par 3 on a hillside shelf, and the 7th has a grandstand positioned to show both the tee shot and the green, a rare double sightline. Horschel Hill, between the 1st and 18th tees, is the free, unreserved big-screen spot if you don't want a fixed seat all day. Beyond the golf, the Championship Village and Show Stage run concerts through the weekend, and premium hospitality (Treetops, 72 Lounge, Green on 18, The Approach) sits at genuinely different price and format points worth understanding before you book.",
      "Where to stay":
        "This can be a single London day trip with no accommodation booked at all, given the ~46-minute train from Waterloo. If you want to make a proper trip of it, Coworth Park in Ascot is the luxury anchor — a 5-star Dorchester Collection estate with its own polo fields and a Michelin-starred restaurant, a short drive from Wentworth. The Wheatsheaf Hotel, 0.7 miles from the club, is the accessible-price alternative — a straightforward, well-kept coaching inn rather than a resort.",
      "Where to eat":
        "The Fat Duck in nearby Bray has held three Michelin stars for 21 consecutive years — Heston Blumenthal's restaurant is a genuine detour, best kept for a clear evening rather than squeezed between tournament sessions. Closer to the course, Piccolino in Virginia Water village is the sensible, no-fuss dinner option — currently the top-rated restaurant in the village, with an all-weather terrace and live entertainment on weekend nights.",
      "The neighbourhood":
        "Windsor Castle, the world's oldest inhabited castle and a working royal residence, sits a few miles from Wentworth — genuinely close enough to combine with a golf day rather than needing its own separate trip. The Long Walk, a 2.5-mile tree-lined avenue, is one of the more grand approaches to any building in England. Eton, a five-minute walk across Windsor Bridge, adds a genuinely old high street and a 580-year-old school to the same outing. Virginia Water Lake and Savill Garden, inside Windsor Great Park, are the pack's slower-paced counterpart to a full tournament day — a walk, a Georgian cascade waterfall, and 35 acres of seasonal gardens.",
    },
    localInfo: [
      { label: "Address", value: "Wentworth Dr, Virginia Water, Surrey GU25 4LS", href: "https://maps.app.goo.gl/HEuUvKjLGiFWoTNM8", linkLabel: "Open in Maps" },
      { label: "Official site", value: "europeantour.com/dpworld-tour/bmw-pga-championship-2026", href: "https://www.europeantour.com/dpworld-tour/bmw-pga-championship-2026/", linkLabel: "Visit" },
      { label: "Tickets", value: "Book via the official DP World Tour ticketing page — Wednesday Pro-Am and weekend rounds sell fastest.", href: "https://www.europeantour.com/dpworld-tour/bmw-pga-championship-2026/tickets-packages/", linkLabel: "Buy tickets" },
      { label: "Best transport", value: "Direct South Western Railway, London Waterloo → Longcross (~46 min) or Virginia Water (~58 min). No car needed.", href: "https://www.southwesternrailway.com/train-times/london-waterloo-to-virginia-water", linkLabel: "Plan journey" },
      { label: "Gates open", value: "Championship days: gates typically open several hours before first tee. Wednesday Pro-Am: shotgun starts 8:00am and 1:30pm BST." },
      { label: "What to bring", value: "Layers (mid-to-high teens °C in September, cooler mornings). Waterproof. Comfortable walking shoes — the West Course is a genuine walk between holes." },
      { label: "Weather", value: "September in Surrey typically runs mild, cooler mornings, rain possible on any day — pack a light waterproof.", href: "https://www.accuweather.com/en/gb/virginia-water/gu25-4/weather-forecast/330996", linkLabel: "AccuWeather forecast" },
      { label: "Emergencies", value: "Emergency services: 999 · NHS urgent: 111 · Nearest A&E: Frimley Park Hospital, Portsmouth Rd, Frimley, Camberley GU16 7UJ" },
    ],
    experienceOrder: {
      "On the grounds": ["18th at Wentworth", "72 Lounge", "The Approach", "Treetops", "7th", "Championship Village", "Celebrity Pro-Am", "Horschel Hill", "Course You Can't Play"],
    },
  },

  "belgian-gp-2026": {
    brief:
      "The Belgian Grand Prix is three days in the Ardennes forest, and the forest is the point. Circuit de Spa-Francorchamps is 7 kilometres of road that climbs and drops through trees, with corners named after the villages they pass through and a weather system that changes within the hour. It is the circuit most F1 drivers cite as their favourite, and after a lap in a road car you understand why — the elevation changes alone are unlike anything else on the calendar.\n\nThis pack is built around one idea: Spa is not a single experience. It is a circuit you roam. A Bronze general admission ticket unlocks most of it — the Kemmel Straight bank, the Pouhon mound, the Fan Zone at the base of Raidillon, and 7 kilometres of forest trackside. Grandstand tickets — Gold 3 at Raidillon, Silver 3 at Pouhon — give you a fixed seat and cover. The choice between them shapes what kind of weekend this is.\n\nA few things worth knowing before you arrive. July in the Ardennes is unpredictable — the same afternoon can run 28 degrees and then a downpour within the hour, and it matters when you're standing on a grassy bank. Day return shuttles run from 14 cities across Belgium and the Netherlands — sales close 26 June, so book early. Parking on-site on race Sunday takes two hours to clear. Plan your exit before race day. The sections here follow the shape of the weekend — what to do on each day, where to watch from, and how to make the most of a circuit that rewards movement over sitting still.",
    sectionIntros: {
      "Before you go":
        "Tickets are the first thing to sort and the thing most people leave too late. Gold 3 at Raidillon — the covered grandstand at the top of Eau Rouge — is the first to sell out, typically in the autumn the year before. Silver 3 at Pouhon goes next. Bronze general admission is the last to go but the circuit shuttle booking fills before the tickets do — buy early to unlock the shuttle reservation. For transport: day return shuttles run from 14 cities including Brussels, Liège, Namur and Antwerp — sales close 26 June, book early. On-site parking is pre-booked only and Sunday exit queues run two hours — most regulars take the shuttle. Download the official Belgian GP app before you arrive; it carries the stage schedule, session updates, and circuit maps.",
      "On the grounds":
        "The circuit is 7 kilometres long and a Bronze ticket covers most of it. The strategic question is whether to pick a position and commit or spend the weekend roaming. Most experienced Spa visitors do both: Friday roaming to find their preferred spots, Saturday qualifying from a fixed position — grandstand or bankside — and Sunday race at the spot that worked best on Friday. The experiences here cover the main decision points: Gold 3 at Raidillon for the most famous corner sequence on the calendar, the Kemmel Straight for flat-out speed, Pouhon for sustained lateral load, and the Fan Zone for the social side of the weekend.",
      "Where to stay":
        "Three honest options: Spa town (13km from circuit, good restaurants and hotels, shuttle access), Stavelot (5km, smaller, quieter, closest to circuit entrances), and Malmedy (6km, mid-size, better accommodation range than Stavelot). Liège is 50km but has the best hotel selection and a direct shuttle. Camping on the circuit itself is the fourth option — the camping areas fill with a regulars community that treats the weekend as a festival rather than a race visit. Most first-timers stay in Spa or Malmedy and wish they'd camped.",
      "Where to eat":
        "The Fan Zone at Raidillon has the best food at the circuit — Belgian frites, stoofvlees, proper bar areas. Quality is better than most F1 circuits manage. Off-circuit, Spa town has a good range: brasseries, Belgian gastropubs, and the kind of places that stay open late on qualifying Saturday. Stavelot's main square has two or three restaurants worth the 10-minute detour. Book anything in Spa town for Saturday evening — the town fills on qualifying weekend and walk-ins become unreliable by 8pm.",
      "The neighbourhood":
        "The Belgian Ardennes is worth time beyond the circuit. The Ardennes is a forested plateau that runs across southeastern Belgium and into Luxembourg and Germany — river valleys, medieval towns, and the kind of landscape that feels genuinely different from the rest of Western Europe. La Roche-en-Ardenne is 30 minutes from Spa and worth a Friday morning if you arrive the day before. The Cave de Han (Han-sur-Lesse) — natural caves in a river gorge — is 50 minutes away and one of the more extraordinary natural sites in Belgium. Durbuy, 40 minutes north, bills itself as the smallest city in the world and earns that description.",
    },
    localInfo: [
      { label: "Address", value: "Route du Circuit 55, 4970 Stavelot, Belgium", href: "https://maps.google.com/?q=Circuit+de+Spa-Francorchamps+Route+du+Circuit+55+Stavelot+Belgium", linkLabel: "Open in Maps" },
      { label: "Official site", value: "formula1.com/en/racing/2026/belgium", href: "https://www.formula1.com/en/racing/2026/belgium", linkLabel: "Visit" },
      { label: "Ticketing", value: "Official tickets via Formula 1 — Gold 3 sells out first (autumn the year before). Bronze GA widely available but buy early to unlock circuit shuttle reservations.", href: "https://tickets.formula1.com/en/f1-3286-belgium", linkLabel: "Buy tickets" },
      { label: "Shuttles", value: "Day return coaches from 14 cities including Brussels, Liège, Namur and Antwerp — approx. €65–75 per day. Sales close 26 Jun. Book via spagrandprix.com.", href: "https://www.spagrandprix.com/en/tickets-city-shuttle", linkLabel: "Book shuttles" },
      { label: "Circuit opens", value: "Gates from 06:00 each race day. Fan Zone and grandstands accessible throughout all sessions. Check the Belgian GP app for confirmed daily timings." },
      { label: "What to bring", value: "Waterproof jacket (non-negotiable — July Ardennes weather changes fast). Fold-up chair if GA. Ear defenders. Sunscreen. The circuit has no cover outside the paid grandstands." },
      { label: "Weather", value: "Unpredictable. July highs 18–28°C, with sudden downpours common. The Ardennes micro-climate means it can be dry at La Source and raining at Pouhon.", href: "https://www.accuweather.com/en/be/spa/29281/weather-forecast/29281?type=locality&city=spa", linkLabel: "AccuWeather forecast" },
      { label: "Emergencies", value: "Emergency services: 112 · Police non-emergency: 101 · Nearest hospital: CHR de Verviers, Rue du Palais 211, 4800 Verviers" },
    ],
    experienceOrder: {
      "On the grounds": ["Eau Rouge", "Kemmel", "Pouhon", "Fan Zone"],
    },
  },

  "hungarian-gp-2026": {
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
  },

  "italian-gp-2026": {
    brief:
      "Monza is the fastest circuit on the F1 calendar, and it's also the only one where the cheapest ticket puts you closer to full speed than at almost any other race. This is a 5.8km lap through royal parkland just north of Milan, a layout that predates modern circuit design by decades, and it shows: long straights, heavy braking zones, and a first corner where cars arrive well past 300km/h.\n\nThis pack is built around one idea: Monza rewards people who understand its two faces. There's the racing itself — Curva Grande, the Lesmo curves, the Parabolica, all of it walkable on a General Admission ticket for less than a grandstand seat costs anywhere else. And there's the Tifosi, Ferrari's home crowd, who turn this into the loudest weekend of the season regardless of who's winning. You can watch the race from a covered grandstand at the Parabolica, or you can stand on grass in the trees at Curva Grande with a folding chair and the same view teams have used to judge braking points for a hundred years.\n\nA few things worth knowing before you commit to a plan. Monza itself is a small town — most people base in Milan and take the 9-minute direct train from Milano Centrale, which is a genuinely better trip than trying to find a hotel room in Monza during race week. Tickets went on sale September 2025, with American Express cardholders getting early access before general sale opened. General Admission sells out, but it sells out last, which means it's usually still available closer to race weekend than the grandstands are. The sections here follow the actual shape of a Monza trip: what to sort before you travel, what to do at the circuit, where to stay and eat, and what's worth seeing beyond the track.",
    sectionIntros: {
      "Before you go":
        "Tickets went on sale September 2025, with an early access window for American Express cardholders before the general sale opened. Grandstand tickets, especially anything near the main straight or the Parabolica, sell out well ahead of race weekend — General Admission is the one that survives longest, since it's the budget option and Monza's General Admission genuinely gets you closer to the track than most circuits allow. This is a standard race weekend, not a sprint: two Friday practice sessions, one Saturday practice plus qualifying, and the race itself on Sunday at 15:00 local time. Download the F1 app for session timing changes — weather and red flags shift things more at Monza than at some circuits, since so much of the track is exposed.",
      "On the grounds":
        "Monza's layout means you're choosing between speed and comfort more than at most circuits. Curva Grande and the general admission parkland areas get you standing distance from cars at full throttle, no cover, bring a chair. The Parabolica grandstands put you under a roof with a view of the corner that decides most of the lap. The Fan Zone between Ascari and the Parabolica is where the non-track parts of the weekend happen — simulators, driver appearances, a genuinely good food setup. And if a client's budget allows for more, Monza runs three real hospitality tiers above a standard ticket, each a meaningfully different product, not just a pricier seat.",
      "Where to stay":
        "Monza the town has a small hotel stock that fills fast and prices up hard for race weekend. Most experienced visitors base in Milan instead — the direct train to Monza takes 9 minutes, which makes the extra half hour of city living an easy trade for a much better range of hotels, restaurants, and an actual nightlife scene once the day session ends. Lake Como is the third option, genuinely scenic but a longer, more complicated commute best suited to people extending the trip into a proper holiday rather than squeezing three tight circuit days into a weekend.",
      "Where to eat":
        "Milan does the heavy lifting here — Monza itself is a quiet town outside race hours. A fourth-generation Milanese trattoria sits a short taxi from most Milan hotels, and Carlo Cracco's Michelin-starred restaurant inside the Galleria Vittorio Emanuele II is the other end of the spectrum entirely. The Milan aperitivo ritual — Campari was invented here — is worth doing at least once before a race weekend, ideally somewhere in Navigli or Brera rather than at an all-you-can-eat apericena buffet, which locals mostly avoid.",
      "The neighbourhood":
        "Monza's own history is worth an afternoon on a non-race day: the abandoned 1955 banked oval still stands, free to walk, a genuinely unsettling piece of motorsport history left mostly as it was when Formula 1 stopped using it. Monza town itself has a royal villa and a real historic centre beyond the circuit gates. And twelve kilometres from the track, the Alfa Romeo Museum in Arese holds the actual car Fangio drove to the 1951 World Championship, a direct physical link back to the era this circuit comes from.",
    },
    localInfo: [
      { label: "Address", value: "Autodromo Nazionale Monza, Parco di Monza, 20900 Monza MB, Italy", href: "https://maps.google.com/?q=Autodromo+Nazionale+Monza", linkLabel: "Open in Maps" },
      { label: "Official site", value: "formula1.com/en/racing/2026/italy", href: "https://www.formula1.com/en/racing/2026/italy", linkLabel: "Visit" },
      { label: "Ticketing", value: "Official tickets via monzanet.it or f1italy.com — sales opened September 2025 with early access for American Express cardholders. General Admission is the last tier to sell out.", href: "https://www.monzanet.it/en/tickets/", linkLabel: "Buy tickets" },
      { label: "Getting to Monza", value: "Trenord direct train, Milano Centrale to Monza, 9 minutes, roughly hourly 05:25–23:22.", href: "https://www.trenord.it/en/routes-and-timetables/most-searched-lines/milano-centrale-monza/", linkLabel: "Train times" },
      { label: "Circuit gates", value: "Gates typically open around 07:30 on race weekend days. Standard weekend format: FP1/FP2 Friday, FP3 and qualifying Saturday, race Sunday 15:00 local time." },
      { label: "What to bring", value: "Folding chair or blanket for General Admission (grass, no seating). Sunscreen — most of the parkland has patchy shade, not deep cover. Ear protection if you'll be trackside for long stretches." },
      { label: "Weather", value: "September highs typically 22–27°C, generally dry but with occasional afternoon showers — pack a light waterproof just in case.", href: "https://www.accuweather.com/en/it/monza/214047/weather-forecast/214047?type=locality&city=monza", linkLabel: "AccuWeather forecast" },
      { label: "Emergencies", value: "Emergency services: 112 · Nearest hospital: Ospedale San Gerardo, Via Giovanni Battista Pergolesi 33, 20900 Monza" },
    ],
    experienceOrder: {
      "On the grounds": ["Curva Grande", "Grandstand 22", "Grandstand 26", "Fan Zone", "Paddock Club", "Tifosi"],
    },
  },
};

function orderItems<T extends { packRank: number | null }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (a.packRank === null && b.packRank === null) return 0;
    if (a.packRank === null) return 1;
    if (b.packRank === null) return -1;
    return a.packRank - b.packRank;
  });
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
    "Eating at the US Open": [
      "The Food Village clears out at night — best time to eat without queuing",
      "Poke Yachty and the Oyster Bar behind the Grandstand both have quick-moving lines",
      "You can bring your own food in a soft-sided bag no bigger than 12\"×12\"×16\"",
    ],
    "Rooftop Dinner Then the Night Session": [
      "Pier 17's Dinner and a Match packages are date-specific — book the dinner and the night session ticket on the same day so the timings align",
    ],
    "A Morning in Queens Before the Tennis": [
      "Morning tour + day session is the move — Queens at its quietest, then courts from 11am before the crowds build",
    ],
    "Jackson Heights: The Food Mile": [
      "Birria-Landia opens at 5pm on weekdays — arriving at opening means no queue and the freshest consommé; by 7pm on session days there's a 15-minute wait",
      "At Himalayan Yak, order the beef momos and thukpa noodle soup as a baseline",
    ],
    "The 7 Train to Flushing": [
      "The 7 runs express during rush hours, skipping several Queens stations but not Mets-Willets Point — look for the diamond symbol on the front of the train",
      "Tap in with a contactless card or phone (OMNY) rather than buying a MetroCard — no machine queues, and the fare cap applies automatically",
    ],
    "Where to Stay for the US Open": [
      "Long Island City hotels often have better room quality than equivalent Flushing options at similar prices — check Boro Hotel and Hilton Garden Inn LIC before defaulting to Flushing",
      "Book the moment your session tickets are confirmed — Flushing hotel inventory for the second week (quarterfinals onward) disappears months in advance",
    ],
    "Queens: A Day Beyond the Courts": [
      "MoMA PS1's Warm Up series runs Saturdays in August — outdoor music in the museum courtyard, free with admission",
      "Astoria Park's waterfront gives the best ground-level view of the Hell Gate Bridge — go in the morning before the heat builds",
    ],
    "Flushing Meadows-Corona Park": [
      "The Unisphere fountains run during park hours in summer — go in the morning before the tournament crowds arrive for the best photos",
      "The Queens Museum's Panorama of the City of New York is updated periodically — allow at least 45 minutes",
    ],
    "Flushing's Golden Mall": [
      "Order the lamb skewers and the Xi'an cold noodles with chili oil as a baseline, then add one soup dumpling order from whichever Shanghainese stall has the shorter queue",
      "Bring small bills — a couple of the older vendors are cash-only, and the basement ATM charges a fee",
    ],
    "Preparing for Your US Open Visit": [
      "Download the US Open app before you arrive — real-time court assignments, match scores, and delay notifications",
      "Bring a refillable water bottle — free filling stations are distributed throughout the grounds",
    ],
  },
  "india-in-england-cricket-2026": {
    "Edgbaston": [
      "Gates open 90 minutes before play — arrive early enough to walk the concourse and pick a spot on the family-friendly Raglan Stand before it fills",
      "The Hollies Stand is the loudest and most flag-heavy section — if you want the Bharat Army atmosphere, that's where it lives",
      "Carry cash for the independent food stalls outside the ground; card-only inside",
    ],
    "Lord's": [
      "The Grace Gates open 90 minutes before play — use the extra time to visit the MCC Museum and the Long Room before the match crowd arrives",
      "The Tavern Stand and Mound Stand are the most atmosphere-heavy for India fixtures; the Warner Stand offers better sightlines but a quieter crowd",
      "Tickets show which gate to use — Gate A (Grace Gates end) and Gate D (Wellington Road) are the main entry points; don't confuse them",
    ],
    "Trent Bridge": [
      "Radcliffe Road End is where the touring fan sections tend to congregate for India fixtures — arrive early and check the allocation when you collect your ticket",
      "The ground is compact and every seat has a decent view; upper tiers in the Larwood and Voce Stand put you above the sightscreen for a clean angle on the pitch",
      "West Bridgford village — a 10-minute walk from the ground — has better pre-match food options than the immediate stadium area",
    ],
    "Bharat Army": [
      "Membership isn't required to join sections on the day — introduce yourself, the community is genuinely welcoming",
      "The organised group travel packages include ticket bundles; worth checking bharatarmy.com before buying tickets separately if you're travelling from India",
      "Bring a blue India shirt — the fan sections have a clear dress code expectation even if it's not enforced",
    ],
    "Moseley": [
      "The farmers' market runs on the last Saturday of each month — the Edgbaston T20 is on 14 July, so if you're in Birmingham that weekend, the market won't be on",
      "St Mary's Row is the main strip; arrive before 9am if you want a table at the busier cafés on a match day",
    ],
    "London in a day": [
      "Start from St John's Wood and walk south through Regent's Park to the Inner Circle — the café there opens at 8am and the park is at its quietest before 10am",
      "Abbey Road crossing is busiest mid-morning; photographers queue for the shot, but the crossing itself takes seconds and the studio facade is worth seeing",
      "If the Lord's match runs long, the day trip compresses naturally — Regent's Park and St John's Wood village alone fill a morning without rushing",
    ],
  },
  "open-championship-2026": {
    "18th at Royal Birkdale": [
      "The grandstand at 18 fills from mid-morning on championship days — arrive at gate open if you want a front-row position without a reserved hospitality seat",
      "The hole plays differently in the wind: a following breeze makes it reachable in two for the long hitters, a headwind makes it a genuine three-shot hole — ask the stewards which way it's playing when you arrive",
      "Sunday afternoon: the crowd starts gathering at the 18th from around 1pm regardless of where the leaders are — if you want the atmosphere of the closing holes without being crushed, position yourself by 2pm at the latest",
    ],
    "Links — Festival Hub": [
      "The Links zone is Ticket Plus only — your wristband is checked at the entrance near the 4th green; the grandstand platform inside gives you a fixed seat with a clear view of approach shots",
      "The food trucks inside The Links are a separate offering from the main Spectator Village — worth using as your lunch base rather than queuing at the main village stalls",
      "The covered grandstand platform at the 4th is the best shelter on the course if the weather turns — a useful fallback position on a wet championship day",
    ],
    "Practice Day": [
      "The Last-Chance Qualifier on Monday 13 July: pick up the pairings sheet at the gate, choose a group near the bubble line, and follow them for the back nine — the tension on individual holes is unlike anything in the main championship",
      "Tuesday's Heroes Classic runs alongside normal practice — check the R&A timetable on the day, as the Champions play a short stretch of holes and the schedule shifts around regular practice groups",
      "Arrive at gates open on any practice day and walk straight to the 18th grandstand — you will have free choice of seating and a clear view of groups coming in; by mid-morning the good spots are gone",
    ],
    "Dunes — Walking": [
      "The 11th hole dune gives a bird's-eye view of the green that no grandstand at Royal Birkdale matches — head there before the 10am groups arrive for the best position",
      "Pick one group and follow it for nine holes rather than hopping between holes — you see the strategy develop across a stretch of the course, and on a busy day it's far less stressful than fighting through crowds at each hole",
      "The 6th tee box gives simultaneous sightlines to the 5th green and the 6th tee — you can watch a hole finish and the next begin without moving; useful on a crowded afternoon when moving between holes is slow",
    ],
    "Signature Hospitality": [
      "The Retreat at the 7th is best in the morning — by afternoon, Signature guests cluster at Clarets for the back-nine drama; use the morning to claim the best position at the 7th green before it fills",
      "Your parking pass is valid from gates-open time — arriving two hours before first tee means easy parking and first choice of tables at breakfast in Dunes House",
    ],
    "Royal Birkdale Golf Club — Play": [
      "Tee times book out months ahead — contact the club directly on +44 (0)1704 567920 or via royalbirkdale.com for the earliest available slots, as third-party tee time sites rarely have access to the full allocation",
      "The course plays significantly differently from the spectator experience — the dune corridors that look wide from the dune tops are tight driving tests from the tee; ask the caddie master for a yardage book on arrival",
      "If you're playing around Open week, the club hosts a ballot for non-member tee times in the weeks surrounding the championship — check royalbirkdale.com for the application window, which opens in the autumn before",
    ],
  },

  "bmw-pga-championship-2026": {
    "18th at Wentworth": [
      "Get to the 18th grandstand at least 30-45 minutes before the final groups are due to putt — it's first-come and fills from early afternoon on the weekend.",
      "If you want to see the whole hole play out from tee to green rather than just the approach, the grandstand's higher tiers give you the better sightline over the dogleg.",
      "This is the single most contested viewing spot on the course once the tournament comes down to the wire — don't expect a late-Sunday walk-in.",
    ],
    "7th": [
      "Arrive well before the first tee times if you want a seat with a view of both the tee and the green — this grandstand fills earlier than most others.",
      "The two-tiered green means a short approach can trickle back a good three feet — watch for players misjudging distance on the front tier.",
    ],
    "Championship Village": [
      "The Kooks are confirmed to headline the Show Stage on Saturday, September 19, 2026 — build your day around being near the stage by early evening if that matters to you.",
      "Live music runs through the week in the Fan Village beyond the Saturday headline slot, so there's still something to catch on the quieter practice days.",
    ],
    Treetops: [
      "Use the fast-track bag check and priority entry from your very first arrival of the day — it saves real time on a busy tournament morning.",
      "The included meal voucher (up to £15) and two drink vouchers are only valid within the package — plan to eat and drink here rather than buying elsewhere first.",
    ],
    "The Approach": [
      "The format is flexible rather than scheduled — duck out to watch a group finish on 18, then come back to the food stations.",
      "Tables for larger groups (6 or 8 guests) tend to sell out first — book early if you're planning a group outing.",
    ],
    "72 Lounge": [
      "72 Lounge only debuted in 2025 and demand has grown fast since — don't assume it's an easy last-minute booking.",
      "Green on 18's covered terrace is the real differentiator from the indoor dining area — ask for it specifically when booking.",
    ],
    "Celebrity Pro-Am": [
      "The shotgun start means groups are spread across the entire course simultaneously — check the published tee sheet on the day rather than waiting at one spot.",
      "Pro-Am general admission has sold out in recent years alongside the tournament days — buy your Wednesday ticket as early as the rest.",
    ],
    "Horschel Hill": [
      "Use Horschel Hill as your group's meeting point if you're planning to split up and watch different holes during the day.",
      "This is the most relaxed viewing spot on the course — bring a picnic blanket or portable chair if you want to settle in.",
    ],
    "Course You Can't Play": [
      "Don't bother searching for a way to book a round as a member of the public — it genuinely doesn't exist without a member's invitation.",
      "If playing a Harry Colt course matters to you and Wentworth itself is out of reach, look into other Colt designs in the area as a genuine alternative.",
    ],
    "Getting to Wentworth": [
      "Longcross station is closer to Wentworth Club than Virginia Water station — use it as your default unless a specific connection makes Virginia Water more convenient.",
      "Check the last train back to Waterloo before committing to a full day's play — tournament crowds make evening trains busier than usual.",
    ],
    "Coworth Park": [
      "Book a table at Woven by Adam Smith (the hotel's Michelin-starred restaurant) at the same time as your room — it fills fast during tournament week.",
      "Ask about the on-site polo fields and equestrian centre if you're not golfing yourself — a genuinely distinctive way to spend a day here.",
    ],
    "Wheatsheaf Hotel": [
      "One of the closest walkable options to Wentworth — factor that in against slightly cheaper alternatives further from Virginia Water.",
      "Book ahead specifically for tournament week — its proximity to Wentworth means it fills faster than everyday pricing might suggest.",
    ],
    "Fat Duck": [
      "Book well ahead — reservations require full payment upfront, and availability for popular dates fills fast.",
      "Plan a clear evening around this meal rather than squeezing it between tournament sessions — the tasting menu format runs for hours.",
    ],
    Piccolino: [
      "Book ahead for Friday or Saturday evenings during tournament week — the village sees more visitors than usual.",
      "The all-weather terrace is worth requesting specifically if you want to eat outside.",
    ],
    "Windsor Castle": [
      "Book tickets in advance online — it's cheaper and guarantees entry on your chosen date rather than risking a sold-out day.",
      "Time your visit around the Changing of the Guard (roughly 11am, Tue/Thu/Sat year-round, daily except Sundays Apr-Jul) if the ceremony matters to you.",
    ],
    "Virginia Water Lake": [
      "The Cascade is free to visit and requires no booking — a good low-commitment addition if you don't have time for the full Savill Garden.",
      "Savill Garden's £40 entry includes car parking for the day — factor that into cost comparisons if you're driving.",
    ],
    Eton: [
      "Treat this as a one-to-two-hour add-on to a Windsor Castle visit rather than a separate outing — the walk itself is only five minutes.",
      "Look for the Cockpit Inn on the first stretch of the High Street, a genuine 1420s timber-framed building.",
    ],
  },

  "belgian-gp-2026": {
    "Eau Rouge": [
      "Blocks B or C, rows 18–22 — fully under the roof, best angle down Raidillon, with a partial sightline to the Bus Stop Chicane across the circuit",
      "Saturday qualifying is the session most Spa regulars choose for Gold 3: single-lap effort, no race traffic, and the corner differences between drivers are starkly visible",
      "Gold 3 sells out faster than any other grandstand — monitor belgium.gp from September the year before and sign up for the newsletter for the release date",
    ],
    "Kemmel Straight": [
      "Mid-straight on the mound, roughly level with the two large screens, is the sweet spot — high enough to see over the barrier, close enough to both ends to watch DRS battles develop before Les Combes",
      "Arrive before 07:00 on race Sunday for any fence-side position; by 09:30 the entire bank is full and you'll be standing behind other people for the rest of the day",
      "Spend Friday roaming the full circuit — Bronze gives you access almost everywhere, and you'll find your preferred spots before committing on Saturday qualifying",
    ],
    "Pouhon Corner": [
      "Sections A or B, rows 10–15 — directly opposite the first apex, high enough to see over the fence, with a clear view of both the entry commitment and exit load",
      "Saturday qualifying is the session that justifies this grandstand: each car attacks Pouhon individually and the differences between drivers through the double-left are stark without race traffic masking them",
      "Silver 3 is the last Silver grandstand to sell out — if Gold 3 is gone, check Silver 3 before giving up on assigned seating entirely",
    ],
    "Fan Zone": [
      "Check the stage schedule on the Belgian GP app the evening before each day — driver interview times shift based on session overruns and the confirmed slot appears there before it's posted anywhere else",
      "Friday morning is the best time for simulators and the pit stop challenge — queues are 10–20 minutes versus 45–60 minutes on race Sunday",
      "Eat before 11:00 or after 14:30 on race Sunday — the food queue at peak mid-morning runs 20+ minutes and frites sell out at two of the three stalls by early afternoon",
    ],
  },

  "hungarian-gp-2026": {
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
  },

  "italian-gp-2026": {
    "Curva Grande": [
      "Park in the Green lot near Gate D rather than the more obvious central lots — it's the most direct walk to Curva Grande and the Lesmo bends without fighting the crowds heading to the main straight",
      "Use Friday practice, when crowds are thinnest, to walk the full inside loop of the park and mark your spot for Saturday and Sunday before the good ground is taken",
      "Grandstands 8 and 9 overlook this same stretch of track if you want a reserved seat instead of General Admission grass",
    ],
    "Grandstand 22": [
      "Request row H or higher if buying early — those rows are fully under the roof, while the front rows have partial exposure to afternoon showers",
      "Seat numbers below 30 (left side of the stand) give the better view of the corner exit and the TV screen positioned across the circuit",
      "This is a 3-day ticket only, no single-day option — if you only want race day, look at General Admission instead",
    ],
    "Grandstand 26": [
      "This grandstand covers the pit lane, grid formation, and podium in one sightline — the closest thing at Monza to seeing the whole raceday ceremony from one seat",
      "Arrive early on race day; grid walk viewing fills the front rows well before the formation lap",
    ],
    "Fan Zone — Ascari": [
      "Thursday afternoon (roughly 13:00–20:00) the Fan Zone opens free to the public through Gate G, no race ticket required — a good way to get a feel for the event before committing to a full ticket",
      "Driver appearances on the Fan Zone stage tend to happen Friday or Saturday morning rather than race day itself",
      "Mornings before the first session of the day are quieter for the simulators — queues build fast once each day's session finishes",
    ],
    "Paddock Club": [
      "Champions Club Centrale is the more forgiving booking window of the three hospitality tiers — a sensible fallback if Paddock Club sells out",
      "House 44, the Lewis Hamilton and Soho House collaboration, sold out for 2026 well ahead of race weekend — if you want it for a future season, move as soon as the general Paddock Club on-sale opens",
      "Don't expect a driver appearance to be guaranteed on any tier — the paddock tour and grid walk are confirmed, but which drivers show up is never published in advance",
    ],
    "Tifosi": [
      "Track invasion access points are at Turn 1 and near the Parabolica, with additional openings by the Centrale grandstand and the Glass Tower — head there during the closing laps, not after the flag falls",
      "Track invasion isn't officially confirmed every season — check f1italy.com closer to race weekend rather than assuming it's running",
      "If Ferrari is fighting for the win, get to your grandstand well before lights out — the atmosphere builds for hours and the best views of the sea of red go early",
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
      label: "Opening Monday (29 Jun)",
      body: "The day the grounds feel genuinely electric — and genuinely overwhelming. Top seeds are on Centre Court and No. 1 Court from day one, but the outer courts are where the draw opens up — players ranked 60 to 120 on courts you can walk right up to. Get in before 11am. The gates flood. Roam and watch breadth.",
    },
    {
      label: "Early-round weekdays (Tue–Thu, 30 Jun–2 Jul)",
      body: "Quietly the best days to be there. The corporate groups clear out, the proper fans stay, and a grounds pass covers everything that matters. Wednesday and Thursday especially — fewer people, more access, and you can drop in and out of four matches in an afternoon without jostling for standing room.",
    },
    {
      label: "Middle Saturday (4 Jul)",
      body: "Every local knows this one. Third round done, 32 players left, and the tennis quality has genuinely jumped. The grounds are full but the energy earns it. Centre Court tickets are essentially gone unless you planned months ahead; Henman Hill and the outer courts on this day are a better story anyway.",
    },
    {
      label: "Week 2 weekdays (Mon–Thu, 6–9 Jul)",
      body: "The draw thins to 16, then 8. Outer courts go quiet — fewer matches, bigger gaps in the schedule. What you get instead is actual seats, actual calm, and the best tennis of the tournament. Different kind of day. Not worse, just different.",
    },
    {
      label: "Semi-finals (Thu–Fri, 9–10 Jul)",
      body: "Thursday is the Ladies' semis, Friday the Men's. The formality of the place tightens noticeably. Most of the crowd watches from pubs while the grounds go quiet. If you want pure tennis with no distraction, these are your days. If you came for the full Wimbledon feeling, it peaked around the quarterfinals.",
    },
    {
      label: "Finals Weekend (11–12 Jul)",
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

  "open-championship-2026": [
    {
      label: "Sunday 12 Jul — First practice day",
      body: "The quietest of the eight days. The Spectator Village opens, the course is free to roam, and the field hasn't arrived yet. Right for people who want to walk Royal Birkdale without a crowd — all 18 holes, at your own pace, with the infrastructure running but the pressure off. Wimbledon broadcasts on the big screens.",
    },
    {
      label: "Monday 13 Jul — Last-Chance Qualifier",
      body: "12 players compete for the final Open spot in a full-day strokeplay event. These are not household names, but the stakes are everything — one bad hole and it's over. Less well-known than the championship days and genuinely compelling. Follow a group from hole to hole; you can be front-row on any dune.",
    },
    {
      label: "Tuesday 14 Jul — Full field + Heroes Classic",
      body: "The busiest practice day and the one to book if you want maximum player access. The full 156-man field is on the course working pre-championship routines. The Heroes Classic runs simultaneously — past Champion Golfers in a fun-format challenge, relaxed and unguarded in a way you won't see during the tournament.",
    },
    {
      label: "Wednesday 15 Jul — The Eve",
      body: "Last session before the championship. Players are tighter, focused, working specific holes and specific shots. The warmth of Monday and Tuesday is gone; what you get instead is concentration. Best day for serious golf watchers who want to see how the field is approaching the course.",
    },
    {
      label: "Thursday 16 Jul — Round 1",
      body: "The best value championship day for course walkers. The dunes are quieter than Friday and Saturday, the full 156-man field is playing, and you can follow a group for nine holes without fighting through crowds at each hole. General admission is sold out but Ticket Plus may still have availability.",
    },
    {
      label: "Friday 17 Jul — Round 2 (cut day)",
      body: "The full field plays in the morning; the cut falls in the afternoon and the field thins. If you're inside the gates when the cut falls, you'll see the emotional range of the tournament in a single session — players making the cut celebrating, others walking off the 18th for the last time. The afternoon quiets considerably.",
    },
    {
      label: "Saturday 18 Jul — Round 3",
      body: "The busiest and loudest day of the championship. 70 players, real leaderboard drama, the grandstands full. The 18th fills early — if you don't have a reserved seat, commit to your dune position by mid-morning. The Signature grandstand seat earns its price on Saturday.",
    },
    {
      label: "Sunday 19 Jul — Final round",
      body: "The closing round. The 18th grandstand is claimed hours before the leaders arrive — standing positions go by early afternoon, reserved Signature seats are the only guarantee. The rest of the course empties relative to Saturday as everyone migrates toward the closing stretch. If you want to watch golf rather than a crowd, the 11th dune on Sunday morning is one of the better places to be.",
    },
  ],

  "bmw-pga-championship-2026": [
    {
      label: "Tuesday 15 Sep — Practice",
      body: "The quietest day of the week. The field is on the course working pre-tournament routines, the Championship Village is open, and general admission gets you close without the Pro-Am's energy or the weekend's crowds. Right for anyone who wants to walk the West Course's viewing spots — the 18th, the 10th, the 7th — and find their preferred positions before committing on the busier days ahead.",
    },
    {
      label: "Wednesday 16 Sep — Celebrity Pro-Am",
      body: "The traditional curtain-raiser: DP World Tour professionals paired with names from sport and entertainment, played as two shotgun starts (8:00am and 1:30pm). Looser and considerably less serious than the championship rounds that follow — general admission has sold out in recent years, so this isn't a day to leave until last. The whole West Course fills with groups simultaneously rather than the usual staggered tee times.",
    },
    {
      label: "Thursday 17 Sep — Round 1",
      body: "The tournament proper begins. The full field is out, the course hasn't yet settled into a leaderboard shape, and this is generally the best value day for course walkers — quieter than the weekend, full field variety on show. A good day to follow a group for a full nine holes rather than planting at one spot.",
    },
    {
      label: "Friday 18 Sep — Round 2 (cut day)",
      body: "The field plays through the morning and the cut falls in the afternoon — the emotional range of the tournament shows up in a single session, players making the cut relieved, others walking off for the week. The Show Stage and Fan Village entertainment starts building through the evening ahead of the weekend.",
    },
    {
      label: "Saturday 19 Sep — Round 3 + Show Stage headline",
      body: "The busiest and loudest day of the week. The leaderboard has real shape by now, the grandstands fill early, and The Kooks headline the Show Stage in the evening — meaning this is genuinely a full day rather than a golf morning followed by a quiet afternoon. Commit to your 18th position by mid-morning if you want a view of the tournament's business end.",
    },
    {
      label: "Sunday 20 Sep — Final round",
      body: "The closing day. The 18th green — where recent tournaments have actually been decided, including Billy Horschel's 2024 playoff eagle — is claimed well before the leaders arrive. Standing positions go by early afternoon. If you want to watch golf rather than a crowd, the 10th or the 7th earlier in the day are calmer, genuinely tactical viewing before the tournament narrows to its final stretch.",
    },
  ],

  "belgian-gp-2026": [
    {
      label: "Friday (17 Jul) — Practice 1",
      body: "The best day to roam — 2026 is a sprint weekend, so Friday has only one practice session (FP1, ~13:30 local). That makes it the quietest day on circuit and the right time to walk the full 7 kilometres and find your spots for the rest of the weekend: the Kemmel mound, the Pouhon bank, the angle from Blanchimont. Fan Zone queues are shortest on Friday morning. Engineers are still tuning setups, which means you see real variation between cars at the same corner — more technically interesting than most people expect.",
    },
    {
      label: "Saturday (18 Jul) — Sprint Qualifying, Sprint Race & Grand Prix Qualifying",
      body: "The busiest day of the weekend. Sprint Qualifying in the morning sets the grid for the Sprint Race; the Sprint Race itself runs mid-afternoon (100km, no pitstops mandatory); then Grand Prix Qualifying in the evening determines the Sunday grid. Three separate sessions, each with a different character. Pick one position and stay — moving between grandstands during changeovers is possible but the circuit fills fast. Grand Prix Qualifying at Spa is the session to prioritise: single laps, the full Spa atmosphere, and the corner differences between drivers are starkly visible.",
    },
    {
      label: "Sunday (19 Jul) — Race Day",
      body: "Race start is 14:00 local time. The circuit fills from 07:00 and fence-side positions on the Kemmel Straight are gone by 09:30. If you have a grandstand ticket, arrive with time to spare — the forest paths are slower on race morning than any other day. The opening lap through Eau Rouge and Raidillon is 44 seconds into the race and worth the entire trip. The DRS zone on the Kemmel Straight produces the most overtaking moves of the weekend. After the podium ceremony — worth staying for — plan your exit before the crowd clears: the single-carriageway roads around the circuit take two hours to clear on Sunday evening. Take the shuttle, or walk to Stavelot and let it pass.",
    },
  ],

  "hungarian-gp-2026": [
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
  ],

  "italian-gp-2026": [
    {
      label: "Friday 4 Sep — Practice 1 & 2",
      body: "A standard weekend, no sprint format, which means two practice sessions on Friday and a quieter circuit than Saturday or Sunday. This is the day to walk the full loop before committing to a spot — the General Admission areas at Curva Grande, the Lesmo curves, and the run to Ascari are all open, and Friday is when you find out which patch of grass actually gives you the view you want. Fan Zone queues for simulators and the pit stop challenge are shortest today, and driver appearances at the stage tend to land on Friday or Saturday morning rather than race day.",
    },
    {
      label: "Saturday 5 Sep — Practice 3 & Qualifying",
      body: "FP3 in the morning is the last chance for teams to tune the car before parc ferme rules kick in. Qualifying in the afternoon is the session most Monza regulars prioritise if they can only pick one — single-lap efforts with no race traffic mean the differences between cars through Curva Grande and the Parabolica are stark in a way race laps don't show. If you're choosing between practice and qualifying for a grandstand session, qualifying is the better use of a ticket.",
    },
    {
      label: "Sunday 6 Sep — Race Day",
      body: "Race start is 15:00 local time. Arrive early if you're General Admission — the good ground at Curva Grande and the Lesmo bends fills through the morning, and by mid-morning you're choosing between what's left rather than what you scouted on Friday. The Tifosi build the atmosphere for hours before lights out, so being in your spot well ahead of the grid formation matters more here than at most circuits. After the flag, track invasion (when it runs — check closer to the date, as it isn't confirmed every season) sends the crowd toward the podium via Turn 1 and the Parabolica. If you're not joining that, plan your exit early: the roads around Monza and the trains back to Milan get heavily loaded in the hour after the race finishes.",
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
  isAnnual?: boolean;
  archetype?: string | null;
  preTripBriefLiveAt: Date | null;
  preTripBriefLines: string[] | null;
  preTripBriefUpdatedAt: Date | null;
  endDate: string;
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
  isAnnual = false,
  archetype,
  preTripBriefLiveAt,
  preTripBriefLines,
  preTripBriefUpdatedAt,
  endDate,
}: PackViewProps) {
  const isEventPast = new Date() > new Date(endDate);
  const hideProCtas = process.env.HIDE_PRO === "true";
  const editorial = PACK_EDITORIAL[eventSlug] ?? PACK_EDITORIAL["wimbledon-2026"];
  const sectionOrder = (archetype ? ARCHETYPE_SECTION_ORDER[archetype] : undefined) ?? SECTION_ORDER;

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
      packRank: sportingEventExperiences.packRank,
    })
    .from(experiences)
    .innerJoin(
      sportingEventExperiences,
      and(
        eq(sportingEventExperiences.experienceId, experiences.id),
        eq(sportingEventExperiences.sportingEventId, eventId)
      )
    )
    .where(eq(experiences.status, "published"))
    .orderBy(asc(sportingEventExperiences.packRank));

  const sections = sectionOrder.map((name) => {
    const raw = exps.filter((e) => SECTION_MAP[e.experienceType] === name);
    const ordered = orderItems(raw);
    const editorsPick = ordered[0] ?? null;
    const rest = ordered.slice(1);
    return { name, editorsPick, rest };
  }).filter((s) => s.editorsPick !== null);

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      {/* Nav */}
      <HomepageNav email={userEmail} />

      {/* Masthead — hero image + event info */}
      <div className="relative h-[40vh] min-h-[260px] overflow-hidden bg-[#141414]">
        {heroImageUrl && (
          <Image
            src={heroImageUrl}
            alt={eventName}
            fill
            className="object-cover opacity-90"
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Event info — bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-8 pb-8">
          <div className="max-w-5xl mx-auto">
            <span className="inline-block text-xs font-black tracking-widest uppercase text-black bg-[#AAFF00] px-3 py-1 rounded-sm mb-3">
              {sportLabel} · Event Pack
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              {eventName}
            </h1>
            <p className="mt-1.5 text-white/70 text-sm">{dateRange}</p>
            {eventSlug === "india-in-england-cricket-2026" && (
              <p className="mt-0.5 text-white/50 text-xs">Birmingham · London · Nottingham · Manchester · more</p>
            )}
          </div>
        </div>
      </div>

      {/* Pack bar — experience count + add all to board */}
      <div>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-4 flex items-center gap-4">
          <p className="text-sm text-[#6A6A6A]">
            {exps.length} experience{exps.length !== 1 ? "s" : ""}
          </p>
          <AddAllToBoard experienceIds={exps.map((e) => e.id)} />
        </div>
      </div>

      {/* Post-event banner */}
      {isEventPast && (
        <div className="bg-[#141414]">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 py-4 flex items-center gap-3">
            <span className="inline-block px-2.5 py-0.5 rounded-sm bg-[#2A2A2A] text-[#6A6A6A] text-xs font-semibold tracking-widest uppercase">
              Event ended
            </span>
            <p className="text-sm text-[#6A6A6A]">
              This event has now passed — your pack is still here for reference.
            </p>
          </div>
        </div>
      )}

      {/* Pre-trip brief */}
      {preTripBriefLines && preTripBriefLines.length > 0 &&
        (preTripBriefLiveAt ? (
          <div className="bg-amber-400/5">
            <div className="max-w-5xl mx-auto px-6 sm:px-8 py-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold tracking-widest uppercase text-amber-400">
                  Pre-trip brief
                </p>
                {preTripBriefUpdatedAt && (
                  <p className="text-xs text-amber-400/60">
                    Updated{" "}
                    {preTripBriefUpdatedAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}
              </div>
              <ul className="space-y-2">
                {preTripBriefLines.map((line, i) => (
                  <li key={i} className="flex gap-2.5 text-[15px] text-amber-200 leading-8">
                    <span className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-amber-400" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-[#141414]">
            <div className="max-w-5xl mx-auto px-6 sm:px-8 py-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00]">
                  Pre-trip brief
                </p>
                {preTripBriefUpdatedAt && (
                  <p className="text-xs text-[#6A6A6A]">
                    Updated{" "}
                    {preTripBriefUpdatedAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}
              </div>
              <ul className="space-y-2">
                {preTripBriefLines.map((line, i) => (
                  <li key={i} className="flex gap-2.5 text-[15px] text-[#A3A3A3] leading-8">
                    <span className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#6A6A6A]" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

      {/* Editorial overview (from event record) */}
      {editorialOverview && (
        <div>
          <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">
              The Pack
            </p>
            <p className="text-base font-black text-white leading-snug mb-3">
              {exps.length} curated experiences — hand-picked by local experts
            </p>
            <p className="text-sm text-[#A3A3A3] leading-7 max-w-2xl">
              {editorialOverview}
            </p>
          </div>
        </div>
      )}

      {/* Tour itinerary — cricket only */}
      {/* Section quick-jump nav */}
      {sections.length > 1 && (
        <div className="overflow-x-auto">
          <div className="max-w-5xl mx-auto px-6 sm:px-8">
            <div className="flex gap-6 py-3">
              {TOURNAMENT_RHYTHM[eventSlug] && (
                <a
                  href="#how-it-unfolds"
                  className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] hover:text-white transition-colors whitespace-nowrap"
                >
                  How it unfolds
                </a>
              )}
              {sections.map((s) => (
                <a
                  key={s.name}
                  href={`#${toAnchor(s.name)}`}
                  className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] hover:text-white transition-colors whitespace-nowrap"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* The Brief — editorial pack opener */}
      <div>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-6">
            The Brief
          </p>
          <div className="max-w-2xl">
            {editorial.brief.split("\n\n").map((para: string, i: number) => (
              <p
                key={i}
                className="text-[#A3A3A3] leading-8 text-[15px] mb-5 last:mb-0"
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* How the event unfolds — rhythm guide */}
      {TOURNAMENT_RHYTHM[eventSlug] && (
        <div id="how-it-unfolds">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-6">
              How the event unfolds
            </p>
            <div className="max-w-2xl space-y-6">
              {TOURNAMENT_RHYTHM[eventSlug].map((entry) => (
                <div key={entry.label}>
                  <p className="text-sm font-black text-white mb-1.5">{entry.label}</p>
                  <p className="text-[15px] text-[#A3A3A3] leading-7">{entry.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tour itinerary — cricket only */}
      {editorial.tourItinerary && editorial.tourItinerary.length > 0 && (() => {
        const t20s = editorial.tourItinerary!.filter(m => m.type.includes("T20"));
        const odis = editorial.tourItinerary!.filter(m => m.type.includes("ODI"));
        const MatchBlock = ({ matches, label }: { matches: typeof t20s; label: string }) => (
          <div className="rounded-sm border border-[#2A2A2A] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[#2A2A2A] bg-[#141414]">
              <span className="text-xs font-semibold tracking-widest uppercase text-[#6A6A6A]">{label}</span>
            </div>
            <div className="divide-y divide-[#2A2A2A]">
              {matches.map((match, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3 bg-[#0A0A0A]">
                  <span className="w-12 text-xs font-semibold text-[#6A6A6A] shrink-0">{match.date}</span>
                  <span className="flex-1 text-sm text-white">{match.venue}</span>
                  <span className="text-sm text-[#6A6A6A] text-right shrink-0">{match.city}</span>
                </div>
              ))}
            </div>
          </div>
        );
        return (
          <div>
            <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8">
              <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-4">
                Tour schedule
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {t20s.length > 0 && <div className="flex-1"><MatchBlock matches={t20s} label="T20 Internationals" /></div>}
                {odis.length > 0 && <div className="flex-1"><MatchBlock matches={odis} label="One Day Internationals" /></div>}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Quick reference — useful local info */}
      <div>
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-6">
            Quick reference
          </p>
          <div className="rounded-sm border border-[#2A2A2A] divide-y divide-[#2A2A2A]">
            {editorial.localInfo.map((row) => (
              <div
                key={row.label}
                className="flex gap-4 px-5 py-4 sm:items-start"
              >
                <dt className="w-[30%] sm:w-32 flex-shrink-0 text-xs font-semibold text-[#6A6A6A] pt-0.5">
                  {row.label}
                </dt>
                <dd className="text-sm text-[#A3A3A3] leading-6 flex-1 break-words min-w-0">
                  {row.value}
                  {row.href && (
                    <a
                      href={row.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-xs text-[#AAFF00] underline hover:text-white transition-colors"
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
      <div>
        {sections.map((section) => (
          <div
            key={section.name}
            id={toAnchor(section.name)}
            className="max-w-5xl mx-auto px-6 sm:px-8 py-14"
          >
            {/* Section heading + intro */}
            <h2 className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-4">
              {section.name}
            </h2>
            {editorial.sectionIntros[section.name] && (
              <p className="text-[#A3A3A3] text-[15px] leading-8 max-w-2xl mb-10">
                {editorial.sectionIntros[section.name]}
              </p>
            )}

            {/* Editor's Pick — feature card */}
            {section.editorsPick && (
              <div className="group rounded-sm border border-[#2A2A2A] bg-[#141414] overflow-hidden hover:border-[#AAFF00] transition-colors mb-5">
                <Link href={`/experience/${section.editorsPick.slug}`} className="block">
                {section.editorsPick.heroImageUrl && (
                  <div className="relative h-60 overflow-hidden bg-[#1A1A1A]">
                    <Image
                      src={section.editorsPick.heroImageUrl}
                      alt={section.editorsPick.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  </div>
                )}
                <div className="p-6 pb-0">
                  <div className="flex items-center gap-3 mb-3">
                    {(section.editorsPick.practicalInfo as { howToBook?: string } | null)?.howToBook ? (
                      <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                        Concierge pick
                      </span>
                    ) : (
                      <span className="text-xs font-black uppercase tracking-widest bg-[#AAFF00] text-black px-2.5 py-1 rounded-sm">
                        Editor&apos;s pick
                      </span>
                    )}
                    {section.editorsPick.budgetTier && (
                      <span className="text-xs text-[#6A6A6A]">
                        {BUDGET_LABELS[section.editorsPick.budgetTier] ??
                          section.editorsPick.budgetTier}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-white leading-snug group-hover:text-[#AAFF00] transition-colors">
                    {section.editorsPick.title}
                  </h3>
                  {section.editorsPick.subtitle && (
                    <p className="mt-1.5 text-sm text-[#A3A3A3] leading-6">
                      {section.editorsPick.subtitle}
                    </p>
                  )}
                  {section.editorsPick.whyItsSpecial && (
                    <p className="mt-3 text-sm text-[#6A6A6A] italic leading-6 line-clamp-2">
                      {section.editorsPick.whyItsSpecial.split("\n\n")[0]}
                    </p>
                  )}
                  {section.editorsPick.neighborhood && (
                    <p className="mt-3 text-xs text-[#6A6A6A]">
                      {section.editorsPick.neighborhood}
                    </p>
                  )}
                  {(() => {
                    const tips = getInsiderTips(section.editorsPick.title, eventSlug);
                    return tips ? (
                      <div className="mt-4 pt-3 border-t border-[#2A2A2A]">
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-[#AAFF00] mb-2">Worth knowing</p>
                        <ul className="space-y-1">
                          {tips.map((tip, i) => (
                            <li key={i} className="flex gap-2 text-xs text-[#A3A3A3] leading-5">
                              <span className="text-[#AAFF00] flex-shrink-0">—</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null;
                  })()}
                </div>
              </Link>
              <div className="px-6 pb-6">
                {(section.editorsPick.practicalInfo as { howToBook?: string } | null)?.howToBook && (
                  <HowToBook
                    howToBook={(section.editorsPick.practicalInfo as { howToBook: string }).howToBook}
                    isPro={isPro}
                    eventSlug={eventSlug}
                    hideProCtas={hideProCtas}
                  />
                )}
                <div className="mt-4 pt-3 border-t border-[#2A2A2A]">
                  <AddOneToBoard experienceId={section.editorsPick.id} />
                </div>
              </div>
            </div>
            )}

            {/* Remaining picks — 2-column grid */}
            {section.rest.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {section.rest.map((exp) => (
                  <div
                    key={exp.id}
                    className="group rounded-sm border border-[#2A2A2A] bg-[#141414] overflow-hidden hover:border-[#AAFF00] transition-colors"
                  >
                    <Link href={`/experience/${exp.slug}`} className="block">
                      <div className="relative h-36 overflow-hidden bg-[#1A1A1A]">
                        {exp.heroImageUrl ? (
                          <Image
                            src={exp.heroImageUrl}
                            alt={exp.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#2A2A2A]" />
                        )}
                      </div>
                    </Link>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        {(exp.practicalInfo as { howToBook?: string } | null)?.howToBook ? (
                          <span className="text-xs font-semibold tracking-widest uppercase text-amber-400">
                            Concierge pick
                          </span>
                        ) : (
                          <span className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00]">
                            {TYPE_LABELS[exp.experienceType] ?? exp.experienceType}
                          </span>
                        )}
                        {exp.budgetTier && (
                          <span className="text-xs text-[#6A6A6A]">
                            {BUDGET_LABELS[exp.budgetTier] ?? exp.budgetTier}
                          </span>
                        )}
                      </div>
                      <Link href={`/experience/${exp.slug}`}>
                        <h3 className="text-sm font-black text-white leading-snug group-hover:text-[#AAFF00] transition-colors">
                          {exp.title}
                        </h3>
                      </Link>
                      {exp.subtitle && (
                        <p className="mt-1 text-xs text-[#6A6A6A] line-clamp-2 leading-5">
                          {exp.subtitle}
                        </p>
                      )}
                      {exp.neighborhood && (
                        <p className="mt-2 text-xs text-[#6A6A6A]">
                          {exp.neighborhood}
                        </p>
                      )}
                      {(() => {
                        const tips = getInsiderTips(exp.title, eventSlug);
                        return tips ? (
                          <div className="mt-3 pt-2 border-t border-[#2A2A2A]">
                            <p className="text-[10px] font-semibold tracking-widest uppercase text-[#AAFF00] mb-2">Worth knowing</p>
                            <ul className="space-y-1">
                              {tips.map((tip, i) => (
                                <li key={i} className="flex gap-2 text-xs text-[#A3A3A3] leading-5">
                                  <span className="text-[#AAFF00] flex-shrink-0">—</span>
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
                          hideProCtas={hideProCtas}
                        />
                      )}
                      <div className="mt-3 pt-2 border-t border-[#2A2A2A]">
                        <AddOneToBoard experienceId={exp.id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pro-only features — Download + Ask the Curator */}
      {isPro && !hideProCtas && (
        <div className="bg-[#0A0A0A] border-t border-[#2A2A2A]">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12 space-y-12">

            {/* Download */}
            <div className="max-w-xl">
              <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">
                Pro
              </p>
              <h2 className="text-lg font-black text-white mb-2">
                Take it offline
              </h2>
              <p className="text-sm text-[#A3A3A3] mb-6 leading-relaxed">
                Download the pack as a PDF — for the plane, inside the stadium, or anywhere without signal. Travel Brief is a quick-reference digest. Full Pack includes everything.
              </p>
              <PackDownload eventSlug={eventSlug} />
            </div>

            {/* Divider */}
            <div className="border-t border-[#2A2A2A]" />

            {/* Ask the Curator */}
            <div className="max-w-xl">
              <h2 className="text-lg font-black text-white mb-2">
                Ask the curator
              </h2>
              <p className="text-sm text-[#A3A3A3] mb-6 leading-relaxed">
                Something not covered in the pack? Ask anything — a specific venue, a logistics question, what&apos;s actually worth it. A human reply within 48 hours.
              </p>
              <AskCuratorForm eventName={eventName} />
            </div>

          </div>
        </div>
      )}

      {/* Monthly Pro → Annual upgrade nudge */}
      {isPro && !isAnnual && !hideProCtas && (
        <div className="bg-[#0A0A0A] border-t border-[#2A2A2A]">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 max-w-xl">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-1">
                  Annual Pro
                </p>
                <p className="text-sm font-black text-white">
                  Upgrade and future packs are included — no separate purchase.
                </p>
                <p className="mt-1 text-xs text-[#6A6A6A] leading-5">
                  You're on monthly Pro. Switch to annual (£59/yr) and every pack we publish is part of your subscription.
                </p>
              </div>
              <Link
                href="/pro"
                className="flex-shrink-0 inline-flex items-center justify-center px-5 py-2.5 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors whitespace-nowrap"
              >
                Upgrade to annual →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Pro upsell — non-Pro users only */}
      {!isPro && !hideProCtas && (
        <div className="bg-[#0A0A0A] border-t border-[#2A2A2A]">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12">
            <div className="max-w-xl">
              <p className="text-xs font-semibold tracking-widest uppercase text-[#6A6A6A] mb-3">
                Pro
              </p>
              <h2 className="text-lg font-black text-white mb-6">
                Go deeper with this pack
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex gap-3">
                  <span className="mt-0.5 w-4 h-4 rounded-sm bg-[#AAFF00] flex-shrink-0 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 10 8">
                      <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">How to book the concierge picks</p>
                    <p className="text-xs text-[#6A6A6A] mt-0.5 leading-5">Specific operator contacts, lead times, and exactly what to ask — not just a name and a link.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 w-4 h-4 rounded-sm bg-[#AAFF00] flex-shrink-0 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 10 8">
                      <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Sell-out reminders</p>
                    <p className="text-xs text-[#6A6A6A] mt-0.5 leading-5">Timed alerts before the high-demand experiences in this pack close their books.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 w-4 h-4 rounded-sm bg-[#AAFF00] flex-shrink-0 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 10 8">
                      <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Unlimited Trip Boards</p>
                    <p className="text-xs text-[#6A6A6A] mt-0.5 leading-5">Plan and save across as many trips as you like — not just this one.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 w-4 h-4 rounded-sm bg-[#AAFF00] flex-shrink-0 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 10 8">
                      <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Download for offline — Travel Brief or Full Pack PDF</p>
                    <p className="text-xs text-[#6A6A6A] mt-0.5 leading-5">Take the pack on the plane, into the stadium, anywhere without signal.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 w-4 h-4 rounded-sm bg-[#AAFF00] flex-shrink-0 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 10 8">
                      <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Ask the curator — human reply within 48 hrs</p>
                    <p className="text-xs text-[#6A6A6A] mt-0.5 leading-5">A specific question about any venue, experience, or logistics — answered by a person, not an algorithm.</p>
                  </div>
                </div>
              </div>
              {!hideProCtas && (
                <Link
                  href="/pro"
                  className="inline-flex items-center px-6 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
                >
                  Upgrade to Pro
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export interface TourMatch {
  date: string;
  type: string;
  venue: string;
  city: string;
}

export interface LocalInfoRow {
  label: string;
  value: string;
  href?: string;
  linkLabel?: string;
}

export interface PackEditorial {
  brief: string;
  sectionIntros: Record<string, string>;
  localInfo: LocalInfoRow[];
  experienceOrder: Record<string, string[]>;
  tourItinerary?: TourMatch[];
}

export interface RhythmEntry {
  label: string;
  body: string;
}

export const PACK_EDITORIAL: Record<string, PackEditorial> = {
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
      { label: "Address", value: "Church Road, Wimbledon, London SW19 5AE", href: "https://maps.google.com/?q=All+England+Lawn+Tennis+Club", linkLabel: "Open in Maps" },
      { label: "Official site", value: "wimbledon.com", href: "https://www.wimbledon.com", linkLabel: "Visit" },
      { label: "Best transport", value: "SWR train from London Waterloo → Wimbledon (21 min). District line terminates same station but slower from most of London.", href: "https://tfl.gov.uk/plan-a-journey/", linkLabel: "Plan your journey" },
      { label: "Queue gates open", value: "10:30am daily. Queue cards issued from mid-afternoon the day before." },
      { label: "What to bring", value: "Layers — London June weather swings 15°C–28°C. Waterproof. Good walking shoes. Picnic food (no alcohol, no glass). No large camera lenses." },
      { label: "Weather", value: "Variable. Rain likely. Centre Court and No. 1 Court roofs close automatically; outer courts may pause.", href: "https://www.accuweather.com/en/gb/wimbledon/sw19-4/weather-forecast/323341", linkLabel: "AccuWeather forecast" },
      { label: "Emergencies", value: "Emergency services: 999 · Non-emergency police: 101 · NHS urgent: 111 · Nearest A&E: St George's Hospital, Tooting SW17 0QT" },
    ],
    experienceOrder: {
      "On the grounds": ["Centre Court", "The Hill", "Eating", "No. 1 Court", "Practice Courts", "Outer Courts", "When It Rains"],
    },
  },

  "us-open-2026": {
    brief:
      "The US Open is two weeks in August heat, and it runs nothing like Wimbledon. Arthur Ashe Stadium holds 23,771 people and gets louder as the evening goes on. The night sessions — prime matches starting at 7pm under lights — are the event's signature, and there's nothing else in tennis that sounds or feels like them. If you're only making one trip, it's an evening session.\n\nThe rest of the tournament is more accessible than you'd expect. A grounds pass (around $50 in the first week) gets you onto every practice court and outer court, and you can be ten rows from a top-20 player on Court 7 at 11am before the stadium sessions have started. Bring water. Bring sunscreen. August in Queens runs hot, and the USTA has an extreme heat policy that can pause outdoor play — but knowing that in advance means it doesn't catch you off-guard.\n\nFlushing changes what this trip can be. The 7 train puts you in Queens, which means the food situation before and after the tournament is genuinely excellent. Flushing's Golden Mall is fifteen minutes from the gates. Jackson Heights is twenty-five. The neighbourhood has been feeding New York for decades and does not charge tournament prices. A few things to sort before you arrive: book night session tickets before anything else — they sell out months ahead. A hat and a refillable water bottle are not optional in August. The sections here follow the shape of the trip.",
    sectionIntros: {
      "Before you go": "The US Open is more accessible than most Slams. Day session grounds passes — around $50 in the first week — get you through the gates and onto every outer court and the practice facility without a reserved seat. Night sessions are a different category: reserved seating in Arthur Ashe Stadium, starting at 7pm, with the best matches of the tournament typically scheduled for prime time. Book those before your hotel if you can. The heat is the other thing to prepare for: August in Queens runs between 28°C and 38°C with genuine humidity. The 7 train from Manhattan is the correct way to arrive: 40 minutes from Times Square or Grand Central, no transfers, drops you at Mets-Willets Point with a 10-minute walk to the gates.",
      "On the grounds": "The USTA Billie Jean King National Tennis Center covers 46.5 acres and runs 22 courts across the two-week tournament. Arthur Ashe Stadium is the largest tennis stadium in the world, and the quality of it in the evening — lights on, full house — is unlike anything else in the sport. The outer courts in the first week are worth as much time as the main stadiums.",
      "Where to stay": "Two honest options. Flushing puts you walking distance from the gates. Long Island City is the compromise: two stops on the 7 from Flushing, newer hotels, often better value than equivalent Midtown options. Manhattan works if you're combining the US Open with a broader New York trip.",
      "Where to eat": "The food around the US Open is one of the things that makes it different from every other major tennis event. Flushing has one of the most concentrated Chinese food scenes in the country. Jackson Heights covers, within about six blocks, Mexican, Colombian, Tibetan, Nepali, and Bangladeshi food at prices that reflect what the neighbourhood pays.",
      "The neighbourhood": "Flushing Meadows-Corona Park is worth time in its own right. The borough beyond it earns a day of its own: Astoria, Long Island City, the elevated tram to Roosevelt Island, the food under the 7 train elevated tracks in Jackson Heights.",
    },
    localInfo: [
      { label: "Address", value: "Flushing Meadows-Corona Park, Queens, NY 11368", href: "https://maps.google.com/?q=USTA+Billie+Jean+King+National+Tennis+Center", linkLabel: "Open in Maps" },
      { label: "Official site", value: "usopen.org", href: "https://www.usopen.org", linkLabel: "Visit" },
      { label: "Best transport", value: "7 train (Flushing line) from Manhattan → Mets-Willets Point. 40 min from Times Square or Grand Central. 10-min walk to gates.", href: "https://www.mta.info/", linkLabel: "MTA trip planner" },
      { label: "Gates open", value: "Day sessions: grounds passes from 11am. Night sessions: from 7pm (separate tickets — book in advance)." },
      { label: "What to bring", value: "Sunscreen and a hat (non-negotiable in August heat). Refillable water bottle. Layers for evening sessions. Soft-sided bag max 12×16×8 inches." },
      { label: "Weather", value: "Hot and humid. August highs 28–38°C. USTA extreme heat policy may pause outdoor play. Arthur Ashe and Louis Armstrong have retractable roofs.", href: "https://www.accuweather.com/en/us/flushing-meadows-corona-park/11367/weather-forecast/2627464", linkLabel: "AccuWeather forecast" },
      { label: "Emergencies", value: "Emergency services: 911 · Non-emergency: 311 · Nearest hospital: NY-Presbyterian Queens, 56-45 Main St, Flushing NY 11355" },
    ],
    experienceOrder: {
      "On the grounds": ["Arthur Ashe", "Night Sessions", "Louis Armstrong", "Practice Facility", "Food Concourse", "When Play Stops"],
    },
  },

  "india-in-england-cricket-2026": {
    brief:
      "This is not a Test series. Five T20Is and three ODIs across three weeks in July — Birmingham, Nottingham, London, and back again. The format means big crowds, loud atmospheres, and India playing in front of what are effectively home crowds wherever they go. Edgbaston on 14 July is the centrepiece: the ground fills with blue shirts, the Bharat Army takes over entire stands, and a city with one of the largest British-Indian communities in the country treats an away fixture like a home one.\n\nLord's on 19 July is the other anchor. The ODI at cricket's most famous ground, the Grace Gates, the Long Room, the Lord's Tavern. It's a different kind of atmosphere — more reverent, more traditional — but equally worth doing if you can get tickets.",
    sectionIntros: {
      "Before you go": "Tickets for the India fixtures sell fast — the Edgbaston T20 and Lord's ODI in particular. Check the ECB website (ecb.co.uk/tickets) and set alerts. The Bharat Army (bharatarmy.com) also organises group travel and tickets for Indian fans.",
      "On the grounds": "Both Edgbaston and Lord's are worth arriving early for. Edgbaston opens its gates 90 minutes before play. Lord's has the Long Room, the MCC Museum, and the Tavern inside the gates.",
      "Where to stay": "For Edgbaston: the Edgbaston Park Hotel is closest. For Lord's: anywhere in St John's Wood or Marylebone puts you within walking distance.",
      "Where to eat": "Birmingham's Balti Triangle is 10 minutes from Edgbaston. Shababs on Ladypool Road is the standard-bearer. For Lord's, Soutine on St John's Wood High Street is the best sit-down option nearby.",
      "The neighbourhood": "Moseley village — 20 minutes from Edgbaston — is where Birmingham actually lives. St John's Wood around Lord's is quieter and more prosperous: the high street, the Abbey Road crossing, Regent's Park a 10-minute walk north.",
    },
    localInfo: [
      { label: "Tickets", value: "ecb.co.uk/tickets/england", href: "https://www.ecb.co.uk/tickets/england", linkLabel: "ECB ticketing" },
      { label: "Bharat Army", value: "bharatarmy.com — official India touring fan group", href: "https://www.bharatarmy.com", linkLabel: "Visit" },
      { label: "Edgbaston transport", value: "Birmingham New Street → taxi 15 min or walk 25 min through Edgbaston village", href: "https://maps.google.com/?q=Edgbaston+Stadium", linkLabel: "Open in Maps" },
      { label: "Lord's transport", value: "St John's Wood (Jubilee line) → 10-min walk to Grace Gates", href: "https://maps.google.com/?q=Lord%27s+Cricket+Ground", linkLabel: "Open in Maps" },
      { label: "Emergencies", value: "Emergency services: 999 · NHS urgent: 111 · Birmingham A&E: Queen Elizabeth Hospital, B15 2GW · London A&E: UCLH, NW1 2BU" },
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
      "The Open is four days in July on a links course in Southport that is simultaneously the most famous golf tournament in the world and one of the most accessible major sports events on the UK calendar. The championship field is the best in golf. The course is public. The dunes are free to climb. If you go once and do it right, it is one of the most purely enjoyable days in sport.\n\nThe event runs Thursday 16 to Sunday 19 July 2026 at Royal Birkdale Golf Club. General admission is the foundation: it unlocks the whole course, the Spectator Village, and everything in the dunes. Transport is simple: Merseyrail Northern Line to Birkdale station, 40 minutes from Liverpool Central, 8 minutes' walk to the gates.",
    sectionIntros: {
      "Before you go": "General admission championship day tickets are sold out across all four days. Practice day tickets remain — Sunday 12 July from £30, Wednesday 15 July around £75. Ticket Plus (£270–300) adds a private zone near the 4th green and a covered grandstand platform. Transport: Merseyrail Northern Line, Liverpool Central to Birkdale, 40 minutes, then an 8-minute walk.",
      "On the grounds": "Royal Birkdale runs in a figure-of-eight through sandhills. Each hole sits in its own dune corridor. The strategic question is whether to follow a group or commit to a specific hole. General admission covers the whole course. The Links zone near the 4th is Ticket Plus only.",
      "Where to stay": "Southport is 2 miles from Royal Birkdale and the right base for the week. Birkdale village is quieter and closer to the gates. Liverpool is 40 minutes by train.",
      "Where to eat": "Birkdale village has the best eating in the immediate area. Bistrot Vérité is the standard-bearer. Lord Street in Southport town is the wider option for a sit-down dinner.",
      "The neighbourhood": "Southport is a Victorian seaside town with a serious main street, a wide beach. Liverpool is 40 minutes away and worth at least a day: the docks, the two cathedrals, Albert Dock, the food scene.",
    },
    localInfo: [
      { label: "Address", value: "Waterloo Road, Southport PR8 2LX", href: "https://maps.google.com/?q=Royal+Birkdale+Golf+Club", linkLabel: "Open in Maps" },
      { label: "Official site", value: "theopen.com", href: "https://www.theopen.com", linkLabel: "Visit" },
      { label: "Tickets", value: "Practice days from £30. Championship days sold out; hospitality via R&A Experience Team.", href: "https://www.theopen.com/tickets-and-hospitality/2026", linkLabel: "Book tickets" },
      { label: "Best transport", value: "Merseyrail Northern Line, Liverpool Central → Birkdale (40 min). 8-min walk to gates. No driving on championship days.", href: "https://www.merseyrail.org/plan-your-journey/", linkLabel: "Plan journey" },
      { label: "Gates open", value: "Championship days: 2 hrs before first tee. Practice days Sun 12–Wed 15 Jul from approx. 7:30am. Cashless payments only." },
      { label: "What to bring", value: "Layers (14–24°C in July). Waterproof. Good walking shoes. Card only — no cash on site. No glass." },
      { label: "Weather", value: "Mild to warm with sea breeze. Rain possible on any day.", href: "https://www.accuweather.com/en/gb/southport/pr8-5/weather-forecast/330516", linkLabel: "AccuWeather forecast" },
      { label: "Emergencies", value: "Emergency services: 999 · NHS urgent: 111 · Nearest A&E: Southport & Ormskirk Hospital, PR8 6PN" },
    ],
    experienceOrder: {
      "On the grounds": ["18th at Royal Birkdale", "Links", "Practice Day", "Dunes", "Signature", "Royal Birkdale Golf Club"],
    },
  },

  "belgian-gp-2026": {
    brief:
      "The Belgian Grand Prix is three days in the Ardennes forest, and the forest is the point. Circuit de Spa-Francorchamps is 7 kilometres of road that climbs and drops through trees, with corners named after the villages they pass through and a weather system that changes within the hour. It is the circuit most F1 drivers cite as their favourite.\n\nThis pack is built around one idea: Spa is not a single experience. It is a circuit you roam. A Bronze general admission ticket unlocks most of it. Grandstand tickets — Gold 3 at Raidillon, Silver 3 at Pouhon — give you a fixed seat and cover.",
    sectionIntros: {
      "Before you go": "Tickets are the first thing to sort. Gold 3 at Raidillon is the first to sell out, typically in the autumn the year before. For transport: day return shuttles run from 14 cities including Brussels, Liège, Namur and Antwerp — sales close 26 June, book early.",
      "On the grounds": "The circuit is 7 kilometres long and a Bronze ticket covers most of it. Friday roaming to find your preferred spots, Saturday qualifying from a fixed position, and Sunday race at the spot that worked best on Friday.",
      "Where to stay": "Three honest options: Spa town (13km from circuit), Stavelot (5km, closest to circuit entrances), and Malmedy (6km, better accommodation range). Camping on the circuit itself is the fourth option.",
      "Where to eat": "The Fan Zone at Raidillon has the best food at the circuit — Belgian frites, stoofvlees, proper bar areas. Off-circuit, Spa town has a good range of brasseries and Belgian gastropubs.",
      "The neighbourhood": "The Belgian Ardennes is worth time beyond the circuit. La Roche-en-Ardenne is 30 minutes from Spa and worth a Friday morning. The Cave de Han is 50 minutes away.",
    },
    localInfo: [
      { label: "Address", value: "Route du Circuit 55, 4970 Stavelot, Belgium", href: "https://maps.google.com/?q=Circuit+de+Spa-Francorchamps", linkLabel: "Open in Maps" },
      { label: "Official site", value: "formula1.com/en/racing/2026/belgium", href: "https://www.formula1.com/en/racing/2026/belgium", linkLabel: "Visit" },
      { label: "Ticketing", value: "Official tickets via Formula 1 — Gold 3 sells out first. Bronze GA widely available but buy early to unlock shuttle reservations.", href: "https://tickets.formula1.com/en/f1-3286-belgium", linkLabel: "Buy tickets" },
      { label: "Shuttles", value: "Day return coaches from 14 cities — approx. €65–75 per day. Sales close 26 Jun. Book via spagrandprix.com.", href: "https://www.spagrandprix.com/en/tickets-city-shuttle", linkLabel: "Book shuttles" },
      { label: "Circuit opens", value: "Gates from 06:00 each race day. Check the Belgian GP app for confirmed daily timings." },
      { label: "What to bring", value: "Waterproof jacket (non-negotiable). Fold-up chair if GA. Ear defenders. Sunscreen. No cover outside paid grandstands." },
      { label: "Weather", value: "Unpredictable. July highs 18–28°C, with sudden downpours common.", href: "https://www.accuweather.com/en/be/spa/29281/weather-forecast/29281", linkLabel: "AccuWeather forecast" },
      { label: "Emergencies", value: "Emergency services: 112 · Police non-emergency: 101 · Nearest hospital: CHR de Verviers, Rue du Palais 211, 4800 Verviers" },
    ],
    experienceOrder: {
      "On the grounds": ["Eau Rouge", "Kemmel", "Pouhon", "Fan Zone"],
    },
  },
};

export const TOURNAMENT_RHYTHM: Record<string, RhythmEntry[]> = {
  "wimbledon-2026": [
    { label: "Opening Monday (29 Jun)", body: "The day the grounds feel genuinely electric — and genuinely overwhelming. Top seeds are on Centre Court and No. 1 Court from day one, but the outer courts are where the draw opens up — players ranked 60 to 120 on courts you can walk right up to. Get in before 11am. The gates flood. Roam and watch breadth." },
    { label: "Early-round weekdays (Tue–Thu, 30 Jun–2 Jul)", body: "Quietly the best days to be there. The corporate groups clear out, the proper fans stay, and a grounds pass covers everything that matters. Wednesday and Thursday especially — fewer people, more access, and you can drop in and out of four matches in an afternoon without jostling for standing room." },
    { label: "Middle Saturday (4 Jul)", body: "Every local knows this one. Third round done, 32 players left, and the tennis quality has genuinely jumped. The grounds are full but the energy earns it. Centre Court tickets are essentially gone unless you planned months ahead; Henman Hill and the outer courts on this day are a better story anyway." },
    { label: "Week 2 weekdays (Mon–Thu, 6–9 Jul)", body: "The draw thins to 16, then 8. Outer courts go quiet — fewer matches, bigger gaps in the schedule. What you get instead is actual seats, actual calm, and the best tennis of the tournament. Different kind of day. Not worse, just different." },
    { label: "Semi-finals (Thu–Fri, 9–10 Jul)", body: "Thursday is the Ladies' semis, Friday the Men's. If you want pure tennis with no distraction, these are your days. If you came for the full Wimbledon feeling, it peaked around the quarterfinals." },
    { label: "Finals Weekend (11–12 Jul)", body: "Saturday is the Ladies' Singles final and Men's Doubles. Sunday is the Men's Singles final and Ladies' Doubles. Worth doing once — but it's also the most formal, least spontaneous version of Wimbledon. The tournament worth travelling for is the one with roaming outer courts and unexpected results." },
  ],
  "us-open-2026": [
    { label: "Opening Sunday–Monday (Aug 30–31)", body: "Still 128 players in, the facility still navigable, day session tickets at their cheapest. You can watch three matches on three courts in a single afternoon. Night sessions are the introduction to what makes this tournament different — Ashe under lights with a full house sounds and feels like nothing else in tennis." },
    { label: "First-week weekdays (Tue–Fri, Sep 1–4)", body: "The value window. Day sessions are genuinely quiet. Find a show court with open seats and stay. Night sessions build across the week: the second match starting around 9:30pm is something else entirely." },
    { label: "Labor Day weekend (Sat Sep 5 – Mon Sep 7)", body: "Peak intensity. Night session tickets are expensive for a reason — 23,000 people in Ashe Stadium on a US holiday weekend is closer to a World Cup final than a tennis match. Day sessions are calmer and the tennis quality has jumped (Round of 16, quarters)." },
    { label: "Semi-finals (Thu–Fri, Sep 10–11)", body: "Women's semis Thursday, Men's semis Friday. The semi-finals are the loudest Ashe gets outside a final — and the best tennis of the fortnight." },
    { label: "Finals weekend (Sat–Sun, Sep 12–13)", body: "Women's Final on Saturday Sep 12, Men's Final on Sunday Sep 13. Finals tickets are expensive and scarce; watching on screens in the park with 20,000 other people has its own thing going on." },
  ],
  "open-championship-2026": [
    { label: "Sunday 12 Jul — First practice day", body: "The quietest of the eight days. The Spectator Village opens, the course is free to roam, and the field hasn't arrived yet. Right for people who want to walk Royal Birkdale without a crowd." },
    { label: "Monday 13 Jul — Last-Chance Qualifier", body: "12 players compete for the final Open spot in a full-day strokeplay event. The stakes are everything — one bad hole and it's over. Follow a group from hole to hole; you can be front-row on any dune." },
    { label: "Tuesday 14 Jul — Full field + Heroes Classic", body: "The busiest practice day and the one to book if you want maximum player access. The full 156-man field is on the course. The Heroes Classic runs simultaneously — past Champion Golfers in a fun-format challenge." },
    { label: "Wednesday 15 Jul — The Eve", body: "Last session before the championship. Players are tighter, focused, working specific holes and specific shots. Best day for serious golf watchers who want to see how the field is approaching the course." },
    { label: "Thursday 16 Jul — Round 1", body: "The best value championship day for course walkers. The dunes are quieter than Friday and Saturday, the full 156-man field is playing, and you can follow a group for nine holes without fighting through crowds." },
    { label: "Friday 17 Jul — Round 2 (cut day)", body: "The full field plays in the morning; the cut falls in the afternoon and the field thins. If you're inside the gates when the cut falls, you'll see the emotional range of the tournament in a single session." },
    { label: "Saturday 18 Jul — Round 3", body: "The busiest and loudest day of the championship. 70 players, real leaderboard drama, the grandstands full. The 18th fills early — if you don't have a reserved seat, commit to your dune position by mid-morning." },
    { label: "Sunday 19 Jul — Final round", body: "The closing round. The 18th grandstand is claimed hours before the leaders arrive. If you want to watch golf rather than a crowd, the 11th dune on Sunday morning is one of the better places to be." },
  ],
  "belgian-gp-2026": [
    { label: "Friday (17 Jul) — Practice 1", body: "The best day to roam — 2026 is a sprint weekend, so Friday has only one practice session (FP1, ~13:30 local). That makes it the quietest day on circuit and the right time to walk the full 7 kilometres and find your spots for the rest of the weekend." },
    { label: "Saturday (18 Jul) — Sprint Qualifying, Sprint Race & GP Qualifying", body: "The busiest day of the weekend. Three separate sessions, each with a different character. Grand Prix Qualifying at Spa is the session to prioritise: single laps, the full Spa atmosphere, and the corner differences between drivers are starkly visible." },
    { label: "Sunday (19 Jul) — Race Day", body: "Race start is 14:00 local time. The circuit fills from 07:00 and fence-side positions on the Kemmel Straight are gone by 09:30. The opening lap through Eau Rouge and Raidillon is 44 seconds into the race and worth the entire trip." },
  ],
};

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const LONDON_ID = "75758888-28b9-4e09-82ba-f05681ecc904";
const BIRMINGHAM_ID = "92f27375-7aa2-44dc-b83f-6da3eb974bd4";
const NEW_YORK_ID = "fb782de2-bbe6-410f-b466-2a4e628cda10";
const CRICKET_EVENT_ID = "2bab697d-9d2b-45ff-9b46-9fbfc3a0a40b";
const US_OPEN_EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9";

const rows = [
  {
    id: "e2b3c3a6-34f4-4c52-bf90-08a7d3b9b283",
    title: "The Lord's Tavern — Drinking Inside Cricket's Cathedral",
    slug: "the-lord-s-tavern-drinking-inside-cricket-s-cathedral-mp1e2nj4",
    subtitle: "The pub inside Lord's Cricket Ground, next to the Grace Gates",
    destinationId: LONDON_ID,
    sportingEventId: CRICKET_EVENT_ID,
    experienceType: "dining",
    budgetTier: "moderate",
    curationTier: "editorial",
    status: "published",
    heroImageUrl: "https://pub-54336f49677b40e28b803aeff2aca3c2.r2.dev/experiences/hero/1778515660599-swcas94jyl.jpg",
    bodyContent: `Most pubs near cricket grounds are outside cricket grounds. The Lord's Tavern is inside one. Sit on the front terrace and you're on Lord's property, Grace Gates ten metres away, the Tavern Stand directly overhead.

There's been a pub on this site since the 19th century. The original was a hotel funded by a gin magnate. The current building dates from 1967, and the Tavern Stand was built on top of it, which means on match days the separation between pub and ground disappears entirely. The noise comes from above. The cricket is right there.

The food is wider than you'd expect. Welsh rarebit and pork pies alongside jerk chicken wings and Sri Lankan curry. A burger and pint is about £12, which is reasonable for this postcode. The kitchen works seasonally.

For the India ODI the pub fills early. Book the terrace if the weather cooperates — there's a screen outside and you can watch the first few overs before heading to your seat. Opens at 11am. Cashless. Reservations at tavern@mcc.org.uk.`,
    whyItsSpecial: `This is the pub that has been inside the most important cricket ground on earth for the better part of a century. Not across the road. Inside. On an India match day, when the ground is full and the Tavern terrace is three deep and blue shirts are everywhere — there is nowhere else in London quite like it.`,
    insiderTips: [
      "The Tavern fills up fast on match days, especially during the lunch interval. If you want a table rather than standing room at the bar, get there by 12:30 at the latest. The regulars know this; the tourists find out the hard way.",
      "Ask for a table on the ground floor rather than upstairs. The ceiling is lower up there and it gets loud. Ground floor has a bit more breathing room and you can hear yourself think between overs.",
      "The hot food can be slow when the bar is packed. If you're eating between innings, order early or you'll still be waiting when play resumes.",
      "Don't bother arriving before 11am expecting a quiet pre-match pint. The Tavern doesn't open until 11, and the queue forms outside even before the doors do on big match days.",
    ],
    practicalInfo: {
      hours: "11am (12pm on Sundays)",
      website: "www.lords.org/lords/lord-s-experience/lord-s-tavern",
      costRange: "",
      howToBook: "Book directly with The Lord's Tavern — they don't take reservations through third-party platforms. Call 020 7616 8689 or email tavern@mcc.org.uk as soon as you have your match tickets; Lord's ODIs sell out and the Tavern fills fast.\nThe pub is open to all ticketed attendees, not just MCC members. If you want a proper seated dining experience rather than bar service, contact the Match Day Hospitality team separately: cmdh@mcc.org.uk or 020 7616 8698.",
      bookingMethod: "",
      reservationsRequired: false,
    },
    gettingThere: "Lord's Tavern is very close to the centre of London — just 1.5 miles from Marble Arch. St John's Wood is the closest tube station (approximately 5 minutes' walk), and Warwick Avenue, Marylebone, Edgware Road and Baker Street are all within 15 minutes' walk.",
    editorialNote: "The only pub physically inside Lord's Cricket Ground. Moderate pricing for central London. Book terrace in advance for the ODI. Pairs with The Lord's ODI experience. Cashless only.",
    publishedAt: new Date("2026-06-06T12:03:16.245Z"),
    createdAt: new Date("2026-05-11T16:01:13.533Z"),
    updatedAt: new Date("2026-06-06T12:03:01.557Z"),
  },
  {
    id: "65d0bec3-4a7d-459c-bd88-2713b61f1d6b",
    title: "A Foodie Morning in Queens Before the Tennis",
    slug: "us-open-queens-food-tour-morc8jxw",
    subtitle: "Private food tour through Flushing and Jackson Heights — the food reason the US Open is different from every other Slam",
    destinationId: NEW_YORK_ID,
    sportingEventId: US_OPEN_EVENT_ID,
    experienceType: "fan_experience",
    budgetTier: "splurge",
    curationTier: "editorial",
    status: "published",
    heroImageUrl: "https://pub-54336f49677b40e28b803aeff2aca3c2.r2.dev/experiences/hero/1777908833074-6moc5pjujz5.jpg",
    bodyContent: `The US Open is in Queens. This is the single biggest thing that separates it from the other three Grand Slams — not the stadium, not the night sessions, not the noise. The food situation around this tournament is genuinely world-class, and most people attending never leave the USTA grounds to find it.

Flushing's Golden Mall is the right starting point. The basement food court at 41-28 Main Street, about 15 minutes on foot from the tournament gates, is one of the most concentrated regional Chinese food environments in the United States. Hand-pulled noodles, Sichuan cold dishes, Shanghainese soup dumplings, Fujianese rice dishes — each stall run by people from a specific part of China cooking what they actually eat. The price point is $8 to $15 per dish. The atmosphere is not designed for tourists.

Jackson Heights is 20 minutes further on the 7 train, under the elevated tracks on Roosevelt Avenue. Within six blocks: Colombian bakeries, Tibetan momos, Nepali thali, Bangladeshi biryani, Mexican tacos from the food carts under the elevated line. The Arepa Lady — Gloria Campos, who sold arepas from a cart on this street for years before her sons opened a brick-and-mortar — is at 77-17 37th Avenue and worth the trip alone.

A private guide turns this from a navigation exercise into something easier. Eat Your World runs private food tours of both Flushing and Jackson Heights; Laura Siciliano-Rosen has guided Jackson Heights since 2008 and knows which stalls are worth visiting and which have turned over. Joe DiStefano (joedistefano.nyc) runs private Flushing tours with a focus on the food court vendors specifically — he's been writing about Queens food for 20 years and the tours reflect that depth.

The practical format: a morning or afternoon tour (3 to 4 hours, 8 to 10 stops, roughly $100 to $150 per person for a private group of 4 to 6) followed by a day session at the tournament. The grounds pass from 11am gives you outer court access for the afternoon; combine with a food tour from 8am and you have a full day without setting foot in a tourist restaurant.

The food inside the USTA grounds is not bad by tournament standards — more diverse than any other Slam because the catering reflects its location. But it charges tournament prices. The Golden Mall charges what the food is worth.`,
    whyItsSpecial: `Every Grand Slam has a food story. Wimbledon has strawberries and cream and a few good SW19 restaurants. Roland-Garros is in Paris. Melbourne has the food village. The US Open is in Queens, and Queens has a food culture that no other tennis tournament venue comes close to matching.

This is not incidental. The neighbourhood around the USTA facility is one of the most diverse food environments in the world — Flushing has one of the largest Chinese populations outside China, Jackson Heights is where South Asian and Latin American New York overlaps under an elevated subway line. These are not food destinations that exist because of the tournament. They predate it by decades and would be worth visiting regardless.

The private tour format works because navigation is genuinely the main obstacle. The Golden Mall basement is not signposted for outsiders. The Roosevelt Avenue food carts have no fixed addresses. A guide who knows which stall makes the best hand-pulled noodles on a given week, and who speaks enough Mandarin to order the unlisted dishes, changes what you get to eat considerably.`,
    insiderTips: [
      "Book Eat Your World (eatyourworld.com) or Joe DiStefano (joedistefano.nyc) at least 2 weeks ahead — both run small group private tours that fill quickly during the Open fortnight",
      "Flushing Golden Mall is cash only at most stalls — bring $50 to $80 per person in small bills",
      "Schedule the food tour for the morning before a day session: grounds passes are valid from 11am, giving you 3 to 4 hours in Queens before heading to the courts",
    ],
    practicalInfo: {
      hours: "Morning tours typically 8am to 12pm. Afternoon tours available. Day session grounds passes valid from 11am.",
      website: "https://eatyourworld.com/food-tours/",
      costRange: "Private food tour: $100 to $150 per person (group of 4 to 6). Food costs at the Golden Mall: $8 to $15 per dish.",
      howToBook: "Email laura@eatyourworld.com for a private Flushing or Jackson Heights tour, specifying your preferred date, group size, and start time. Alternatively, book through Joe DiStefano at joedistefano.nyc/tours for a Flushing-focused private tour. Both guides ask about dietary restrictions in advance. If private tours are full, Eat Your World also publishes self-guided tour PDFs for both Flushing and Jackson Heights at eatyourworld.com.",
      bookingMethod: "Eat Your World: eatyourworld.com or laura@eatyourworld.com. Joe DiStefano: joedistefano.nyc/tours. Both accept private group bookings with 2 weeks minimum notice.",
      reservationsRequired: true,
    },
    gettingThere: "Golden Mall: 41-28 Main Street, Flushing, Queens, NY 11355. Take the 7 train to Flushing-Main Street (end of the line), 3-minute walk south on Main Street. From the USTA Billie Jean King National Tennis Center, it's a 15-minute walk or a short cab. Jackson Heights: 7 train to 74th Street–Broadway, Roosevelt Avenue exit. The food carts are directly under the elevated line; the Arepa Lady is at 77-17 37th Avenue, one block south.",
    editorialNote: "Eat Your World confirmed via eatyourworld.com — Laura Siciliano-Rosen has run Jackson Heights tours since 2008, private tours available on request. Joe DiStefano confirmed at joedistefano.nyc/tours — 20 years writing about Queens food. Golden Mall at 41-28 Main Street confirmed as the correct address for the basement food court. Arepa Lady address confirmed at 77-17 37th Avenue. Cash-only policy at most Golden Mall stalls confirmed via multiple visitor reports.",
    lastVerifiedDate: "2026-05-04",
    publishedAt: new Date("2026-05-04T15:34:13.023Z"),
    createdAt: new Date("2026-05-04T15:12:08.678Z"),
    updatedAt: new Date("2026-05-04T15:34:01.645Z"),
  },
  {
    id: "976a5707-3600-4fb0-8949-b916e7930472",
    title: "Edgbaston — 1st ODI",
    slug: "edgbaston-on-india-cricket-match-day-mox4nnge",
    subtitle: "Birmingham turns blue with noise closer to a subcontinental game than anything you will find at a neutral English ground",
    destinationId: BIRMINGHAM_ID,
    sportingEventId: CRICKET_EVENT_ID,
    experienceType: "fan_experience",
    budgetTier: "budget",
    curationTier: "editorial",
    status: "published",
    heroImageUrl: "https://pub-54336f49677b40e28b803aeff2aca3c2.r2.dev/experiences/hero/1778257551777-fk3csimxtqd.jpg",
    bodyContent: `There are grounds in England where India play away fixtures. And then there is Edgbaston in July.

About 31 percent of Birmingham's population identifies as South Asian. The Indian-heritage community alone numbers close to 67,000 — the second-largest in the country outside London. Those are census figures. What they mean in practice, on a match day when India are in town, is that you walk to the ground past people in blue jerseys who have been waiting for this since the fixtures came out. Not casual fans who thought they might go. People who planned around it.

The Bharat Army have been travelling with India since 1999. They now count over 160,000 members across 23 countries, carry BCCI recognition, and travel with dhol drummers, Bollywood-tuned trumpets, tricolour flags, and enough organised noise to shift the character of any ground they're in. At most venues in England, they are a visiting presence. At Edgbaston, they are not visitors. They occupy Block 22 of the Eric Hollies Stand — the stand already considered the loudest in the ground — and they fill it with something that sounds, at full volume, less like an away end and more like a home stadium somewhere in Maharashtra.

Ben Stokes, ahead of the 2025 Edgbaston Test, described the India-England fixture there as "slight 50-50 with the support." That is the England captain conceding, straightforwardly, that his team does not fully own the crowd. No other ground in England would prompt that admission.

The 2022 Fifth Test offers the clearest picture of what this looks like at full intensity. India set England 378 to win. England chased it down in 76 overs — the match that announced the Bazball era. Even in defeat, the Bharat Army were still there on the final day, dhols going, chanting Jai Hind, singing Kal Ho Na Ho and Kuch Kuch Hota Hai with the same volume they'd brought when India were batting. The Wisden Almanack called the atmosphere that day "blissful." A packed ground, two sets of supporters, and a result that had gone the other way — and still nobody went home early.

The ODI on 14 July 2026 is a day match, starting at 11am. Gates open two hours before play. The pre-match street scene on Pershore Road — the main approach from the city centre — is part of the experience. Food stalls, jerseys, flags, groups of fans from across the country and beyond who have converged on a Tuesday in Birmingham to watch a cricket match. It does not look like a midweek county fixture. It looks like something that matters.

Getting there from Birmingham New Street is a walk of about 40 minutes if you go on foot down Edgbaston Road — a useful way to arrive already inside the atmosphere. The buses on routes 45 and 47 run from the city centre to Pershore Road, a two-minute walk from the gates. Match-day shuttle buses also run directly from New Street. A taxi takes about ten minutes.

The Eric Hollies Stand is the one to be in if you want the full version of this. Not the quieter ends. Not the corporate suites. Block 22, where you'll find the drums and the flags and the particular kind of joy that comes from watching your team play on foreign soil with 25,000 people treating it as anything but.`,
    whyItsSpecial: `Most grounds in England have an away end. A small section, ticketed separately, where visiting fans congregate. Tolerated. Contained. Edgbaston in July is not that arrangement.

What makes this worth being at — and worth travelling for — is that the demographic reality of Birmingham has quietly transformed what an India fixture means at this ground. The city's South Asian population is not a recent arrival. It spans three generations. Second and third-generation British Indians who grew up supporting India as their team, who have been to Edgbaston before, who know which stand to buy in and where to meet before the gates open. The Bharat Army provides the organised core. The city provides the rest.

The effect, at its best, is a kind of double atmosphere. England's Barmy Army are present, they are loud, and they are good at this. But the Bharat Army in the Eric Hollies Stand are doing something different — dhols rather than brass, Bollywood rather than sea shanties, a whole different sonic texture running alongside the other. Two fan cultures, both taking it seriously, in the same bowl of a ground.

I find it hard to think of another international fixture in England where you feel this clearly that the match belongs equally to both sets of fans. At most grounds, the home crowd absorbs everything. Here, from the first hour, it is genuinely, audibly, visibly contested — and the result, whatever it turns out to be, is a better day of cricket for it.

It's possibly also the last time that one would see Kohli and Rohit playing for India in England. Extra special.`,
    insiderTips: [
      "Buy in Block 22 of the Eric Hollies Stand — that is where the Bharat Army drums are, and it is where the atmosphere is at its highest concentration",
      "This fixture sold out faster than any white-ball game in Edgbaston's history — primary tickets are gone; check Seat Unique or StubHub for secondary market",
      "Arrive an hour before gates open — the Pershore Road approach is active long before play starts and the walk in is part of the experience",
      "Tuesday means a committed crowd rather than a casual one — this is not a weekend day-out fixture, it is full of people who specifically arranged to be here",
    ],
    whatToAvoid: "Don't buy in the quieter ends of the ground if atmosphere is what you're there for. The pavilion end and the City End have better sightlines for the cricket but they are not where this match lives. Avoid arriving at the last minute — Pershore Road gets thick with people in the final 30 minutes before play and the queues at the gates slow considerably. And do not rely on walking from New Street without allowing time; 40 minutes is the honest estimate and it underestimates it if you stop, as you will.",
    practicalInfo: {
      hours: "Tuesday 14 July 2026; Gates open 9am (2 hours before 11am start)",
      website: "www.edgbaston.com",
      costRange: "Secondary market tickets; face value was £30–£95 depending on stand — expect premium above that",
      howToBook: "General admission is sold out — hospitality is your route in. Contact Edgbaston's own team first: hospitality@edgbaston.com or 0121 446 3604. Third-party allocations exist through Keith Prowse (0208 843 7699) and Seat Unique (support@seatunique.com) — worth calling for last-minute availability. For the India series, register interest now even if 2026 packages are gone; cancellations do release. Book hospitality 6–12 months out for future fixtures.",
      bookingMethod: "Seat Unique (official secondary partner), StubHub UK",
      reservationsRequired: false,
    },
    gettingThere: "Birmingham New Street → 40 min walk via Edgbaston Road, or routes 45/47 bus to Pershore Road, or match-day shuttle from New Street",
    publishedAt: new Date("2026-06-06T12:12:38.658Z"),
    createdAt: new Date("2026-05-08T16:26:33.824Z"),
    updatedAt: new Date("2026-06-06T12:12:32.067Z"),
  },
  {
    id: "9e6f3156-a04f-4962-bbd8-9e9560863115",
    title: "Trent Bridge — 3rd T20I",
    slug: "trent-bridge-t20-game-mp19kj0y",
    subtitle: "An evening match under the floodlights at a 17,500-capacity ground that has been playing cricket since 1838",
    destinationId: LONDON_ID,
    sportingEventId: CRICKET_EVENT_ID,
    experienceType: "sports_venue",
    budgetTier: "budget",
    curationTier: "editorial",
    status: "published",
    heroImageUrl: "https://pub-54336f49677b40e28b803aeff2aca3c2.r2.dev/experiences/hero/1778507699889-ao9tsduew5e.jpg",
    bodyContent: `There is a pub called the Trent Bridge Inn that sits on Radcliffe Road in West Bridgford, directly beside the cricket ground. It was there before the ground was. In 1837, a Nottinghamshire cricketer named William Clarke married the widowed landlady and saw an opportunity in the land behind the inn. The following spring he had it enclosed and a cricket ground laid out. The first recorded match was played there in May 1838.

The pub is still there. The ground is still there. The Trent Bridge Inn is now a Wetherspoon with five bars, and Trent Bridge holds 17,500 people and has permanent floodlights. Some continuities are more poetic than others.

The 3rd T20I on Tuesday 7 July starts at 18:30. That timing matters. You arrive in daylight, the match begins in late-afternoon sun, and then — somewhere in the middle of the second innings — the lights take over and the ground shifts register. The six floodlight masts at Trent Bridge were installed in 2008, making it one of the first England grounds with a permanent setup. They were designed by Maber Architects in Nottingham, built to carry up to 64 units each, and they give the ground its particular nighttime silhouette: low, curved heads on tall masts, the floodlights ringing the stands.

Trent Bridge holds 17,500 people. Lord's holds 31,000. Edgbaston holds 25,000. The difference is audible. A full house here creates a concentrated noise that bigger grounds absorb and dissipate. In July 2022, India played England in a T20 here — England won by 17 runs after posting 215 — and Suryakumar Yadav scored 117 off 55 balls in a reply that, according to ESPNcricinfo, left the ground on its feet even as India lost. The intimacy of the venue was part of what made that innings feel the way it did. You were close enough to read the footwork.

The Bharat Army were founded in June 1999 at Old Trafford in Manchester, about 80 miles northwest of here. The North and Midlands of England has always been where the founding energy of that organisation lives, and Trent Bridge draws from the same community. On a T20 evening with India in town, expect blue in the stands, expect dhols, and expect the kind of crowd that has been looking forward to this specific Tuesday since the fixtures were announced.

West Bridgford itself is worth arriving early for. It is a residential suburb with a genuinely good high street — independent cafes, decent bars, a few restaurants that are not purely match-day operations. The walk from Nottingham city centre takes about 20 minutes on foot, south from the station or Market Square, across the Trent Bridge road bridge, and the ground is immediately visible on the left after you cross the river. You walk past the Trent Bridge Inn on the way in.

A T20 is three hours of cricket. Plan for an evening, not a day.`,
    whyItsSpecial: `Trent Bridge is the ground I would take someone to if I wanted them to understand what makes English cricket different from the global version of the game.

It is not the largest ground or the most famous. What it has is a sense of place that the purpose-built stadiums don't — a ground that grew from a pub garden, that has been adding stands and subtracting them for almost 200 years, that sits in a suburb of 37,000 people who treat it as part of their neighbourhood because it is. On match days the West Bridgford high street changes character. The pubs fill up. People walk to the ground from their houses.

For a T20 under the floodlights in July, that combination of intimacy and setting produces something specific. The format rewards the smaller ground — every boundary carries, every wicket lands. And with India in town, the evening crowd at a ground this size has a different quality to the diffused atmosphere of the big venues. There is nowhere for the noise to go. It just builds.

The 2022 T20 here, when Suryakumar Yadav played an innings that most of the crowd will still talk about, confirmed something that anyone who has been to this ground on a big evening probably already knew: Trent Bridge at night, with a full crowd, is one of the better places to watch cricket in England.`,
    insiderTips: [
      "Walk from Nottingham city centre across Trent Bridge road bridge to the ground — about 20 minutes from the station, flat the entire way, and the approach from the river is the best view of the ground.",
      "The Trent Bridge Inn (Wetherspoon, 2 Radcliffe Road) is directly adjacent to the gates — arrive 90 minutes before the start before it fills up completely on match evenings.",
      "Gates open approximately 90 minutes before the 18:30 start — check the specific matchday guide at trentbridge.co.uk closer to the date for the confirmed time.",
      "Some tickets remained available through trentbridge.co.uk at time of writing — check the fixture page directly as availability can reappear closer to the match.",
    ],
    whatToAvoid: "Don't drive. West Bridgford has limited parking and the streets fill up early on match evenings — the walk from the city centre or a taxi from Nottingham station are both better options. Don't arrive expecting to find a seat in the Trent Bridge Inn in the last 30 minutes before the match — it is small relative to the crowd it serves and it fills well in advance. And a T20 is a 3-hour event; if you plan to eat at the ground rather than beforehand, the food queues at the breaks are long and the options are limited.",
    practicalInfo: {
      hours: "Date: Tuesday 7 July 2026, 18:30 BST (3rd T20I, England v India)",
      website: "https://www.trentbridge.co.uk",
      costRange: "From £70 adult; check trentbridge.co.uk",
      howToBook: "Tickets still appear available via tickets.trentbridge.co.uk (up to 6 per booking). For hospitality — private boxes and shared suites — call 0115 982 3002 or email questions@trentbridge.co.uk. Eventmasters (0121 233 6500) also holds allocation and is worth a call. T20Is against India go fast; secure hospitality 3–6 months ahead.",
      bookingMethod: "www.trentbridge.co.uk",
      reservationsRequired: true,
    },
    gettingThere: "Nottingham train station to the ground: 20 minutes on foot heading south, over the Trent Bridge road bridge — the ground is immediately left after crossing the river. Trams run from the city centre to Nottingham Station; buses also run to West Bridgford. No public parking at the ground.",
    publishedAt: new Date("2026-06-06T12:13:10.447Z"),
    createdAt: new Date("2026-05-11T13:55:09.202Z"),
    updatedAt: new Date("2026-06-06T12:13:04.758Z"),
  },
];

// The remaining 11 experiences need their content from the Japan DB export.
// They are inserted with placeholder content below — update after confirming data.
const remainingIds = [
  { id: "placeholder-moseley", title: "A morning in Moseley Village before the match", destinationId: BIRMINGHAM_ID, sportingEventId: CRICKET_EVENT_ID },
  { id: "placeholder-lords-odi", title: "Lord's — 3rd ODI", destinationId: LONDON_ID, sportingEventId: CRICKET_EVENT_ID },
  { id: "placeholder-lords-travel", title: "Getting to Edgbaston and Lord's on match day", destinationId: LONDON_ID, sportingEventId: CRICKET_EVENT_ID },
  { id: "placeholder-bharat-army", title: "Joining the Bharat Army", destinationId: LONDON_ID, sportingEventId: CRICKET_EVENT_ID },
  { id: "placeholder-london-day", title: "London in a day — the walk that covers it all", destinationId: LONDON_ID, sportingEventId: null },
  { id: "placeholder-soutine", title: "Lunch at Soutine before the Lord's ODI", destinationId: LONDON_ID, sportingEventId: CRICKET_EVENT_ID },
  { id: "placeholder-practice", title: "Morning at the Practice Facility", destinationId: LONDON_ID, sportingEventId: CRICKET_EVENT_ID },
  { id: "placeholder-shababs", title: "Shababs — The Balti Triangle's Standard-Bearer", destinationId: BIRMINGHAM_ID, sportingEventId: CRICKET_EVENT_ID },
  { id: "placeholder-edgbaston-hotel", title: "Stay on Campus, Walk to the Ground — Edgbaston Park Hotel", destinationId: BIRMINGHAM_ID, sportingEventId: CRICKET_EVENT_ID },
  { id: "placeholder-landmark", title: "The Landmark London for the Lord's ODI", destinationId: LONDON_ID, sportingEventId: CRICKET_EVENT_ID },
  { id: "placeholder-twelfth-man", title: "The Twelfth Man — Pre-Match at Edgbaston's Front Door", destinationId: BIRMINGHAM_ID, sportingEventId: CRICKET_EVENT_ID },
];

let inserted = 0;
let skipped = 0;

for (const row of rows) {
  try {
    await db.insert(experiences).values(row).onConflictDoNothing();
    console.log(`✓ ${row.title}`);
    inserted++;
  } catch (err) {
    console.error(`✗ ${row.title}: ${err.message}`);
    skipped++;
  }
}

console.log(`\nDone. ${inserted} inserted, ${skipped} failed.`);
console.log(`\nNote: ${remainingIds.length} experiences still need full content from Japan DB export.`);
console.log("Titles still needed:");
remainingIds.forEach(r => console.log(`  - ${r.title}`));

await client.end();

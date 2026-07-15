import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "046c4eba-87f3-4b40-a020-560f605e4d7d"; // Cape Town
const EVENT_ID = "be8e1129-6e53-4e45-a574-931250988806"; // Australia in South Africa 2026

async function seed(exp) {
  const slug = exp.slugBase + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  try {
    const [result] = await db
      .insert(experiences)
      .values({
        title: exp.title,
        subtitle: exp.subtitle,
        slug,
        experienceType: exp.experienceType,
        status: "in_review",
        destinationId: DESTINATION_ID,
        sportingEventId: EVENT_ID,
        neighborhood: exp.neighborhood,
        address: exp.address,
        heroImageUrl: null,
        bodyContent: exp.bodyContent,
        whyItsSpecial: exp.whyItsSpecial,
        insiderTips: exp.insiderTips,
        whatToAvoid: exp.whatToAvoid,
        practicalInfo: exp.practicalInfo,
        gettingThere: exp.gettingThere,
        editorialNote: exp.editorialNote,
        sport: ["cricket"],
        moodTags: exp.moodTags,
        interestCategories: exp.interestCategories,
        pace: exp.pace,
        physicalIntensity: exp.physicalIntensity,
        budgetTier: exp.budgetTier,
        budgetCurrency: "ZAR",
        bestSeasons: exp.bestSeasons,
        advanceBookingRequired: exp.advanceBookingRequired,
        availability: exp.availability,
        curationTier: "editorial",
        lastVerifiedDate: "2026-07-14",
      })
      .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

    await db.insert(sportingEventExperiences)
      .values({ experienceId: result.id, sportingEventId: EVENT_ID })
      .onConflictDoNothing();

    console.log("✓", result.title, "|", result.id, "|", result.slug);
  } catch (e) {
    console.error("✗ FAILED:", exp.title, "-", e.message);
  }
}

const experiencesList = [
  {
    slugBase: "newlands-table-mountain-ground",
    title: "Newlands — Table Mountain's Cricket Ground",
    subtitle: "Test cricket with Table Mountain rising behind the stands — one of the game's great settings",
    experienceType: "fan_experience",
    neighborhood: "Newlands",
    address: "146 Campground Road, Newlands, Cape Town, 7700",
    bodyContent: `Newlands has staged cricket since January 1888, when the Western Province Cricket Club leased a plot of farmland from Lydia Letterstedt, daughter of the Cape Town brewer who'd bought the site decades earlier. That brewing history isn't a footnote. The ground draws on the same spring water that still feeds Newlands Brewery next door, Africa's oldest working brewery. England won the venue's first Test here in March 1889, by an innings and 202 runs, and Newlands has been a fixture on the international calendar ever since.

What sets it apart from South Africa's other grounds is obvious the moment you're inside. Table Mountain rises directly behind one end, with Devil's Peak alongside it, and the cricket can start to feel almost secondary to the view. No other Test venue anywhere has a backdrop doing that much work, and it changes by the hour: sharp and clear at nine in the morning, capped by the "tablecloth" of cloud by lunch, hazy gold by the time shadows stretch across the outfield in the evening session.

Capacity sits at 25,000 now, down from the ground's old sprawl of open grass banks. A redevelopment between 1991 and 1997 replaced much of that grass with permanent stands, and further building work since has continued the trade-off. Cape Town regulars will tell you something's been lost, but what's left still carries more character than most stadiums built from scratch.

The crowd matches the setting. Test cricket here draws serious support without ever getting precious about itself, and England's Barmy Army in particular have turned Newlands into something close to a second home ground during tours here. In January 2019, Ben Stokes bowled England to a famous final-day win here in front of a packed, loud ground.

The Australia Test in October 2026 closes out the tour, the third and final match after Durban and Gqeberha. It's also one of the earliest men's Tests Newlands has hosted on the calendar, played while Cape Town is still cool and green rather than deep into its dry summer.`,
    whyItsSpecial: `I've sat through plenty of Test cricket at grounds that pride themselves on history and give you very little to actually look at beyond the pitch. Newlands solves that by accident of geography. You don't need to know anything about cricket to understand why this ground matters. Turn around during a lunch break and Table Mountain is right there.

But the mountain isn't the whole argument. Newlands earns its reputation because the crowd shows up for it too. Test tickets here sold out before general sale even opened for the January 2027 England series, and the atmosphere on a good day gets loud in a way cricket doesn't always manage.

For a first-time visitor to a Test in Cape Town, this is the one non-negotiable booking. Everything else sits around it.`,
    practicalInfo: {
      hours: "Gates typically open 2-3 hours before play; for the October 2026 Test, play begins 10:00am local time",
      costRange: "General grounds/grandstand access around R420-R500 per day; grass embankment tickets cheaper than seated stands",
      bookingMethod: "Tickets go on sale through Cricket South Africa's official partner, TicketPro (tickets.cricket.co.za). Recent Newlands Tests have sold out same-day, so book the moment tickets are announced.",
      website: "https://newlandscricket.com",
      reservationsRequired: true,
    },
    gettingThere: "Newlands train station (Southern Line from Cape Town Station, about 20 minutes) is a two-minute walk from the ground. MyCiTi buses run to the Newlands stop via the Claremont route. Matchday parking is limited — public transport is the more reliable option.",
    editorialNote: "Sources: newlandscricket.com, Wikipedia (Newlands Cricket Ground), thesouthafrican.com, ESPNcricinfo, EWN (ticket sellout report). Verified 14 Jul 2026.",
    insiderTips: [
      "The outfield slopes from the Wynberg End down to the Kelvin Grove End, which affects both drainage and how the ball moves off the seam.",
      "The President's Pavilion / South West Stand is the best spot for shade from around midday onward.",
    ],
    whatToAvoid: "Don't assume you can buy a ticket at the gate on the day. Cape Town Tests have a track record of selling out well in advance — check TicketPro regularly rather than leaving it to travel week.",
    moodTags: ["iconic", "electric-atmosphere", "scenic"],
    interestCategories: ["sport", "sightseeing"],
    pace: "moderate",
    physicalIntensity: 2,
    budgetTier: "moderate",
    bestSeasons: ["sep", "oct"],
    advanceBookingRequired: true,
    availability: "event_only",
  },
  {
    slugBase: "newlands-where-to-sit",
    title: "Where to Sit: Newlands Comparison",
    subtitle: "North Stand, the Oaks embankment, or the members' side — how each changes your day at Newlands",
    experienceType: "fan_experience",
    neighborhood: "Newlands",
    address: "146 Campground Road, Newlands, Cape Town, 7700",
    bodyContent: `Newlands doesn't have a single "best seat," because the three main viewing options are built for genuinely different days out.

The North Stand sits near the Kelvin Grove End and is the ground's main seated block: proper seats, decent sightlines, and cover if the weather turns. It's the sensible choice if you want a clear view without thinking too hard about it.

The Oaks is the open grass embankment beneath the scoreboard. It takes its name from oak trees planted here before the Australians' 1902 tour. This is where the atmosphere lives — unreserved, general-admission grass, roughly half the price of a stand seat, with a younger, louder crowd. Bring a picnic blanket, and get there early, because good spots go fast.

North West Grass, just to the other side of the North Stand, is where England's travelling Barmy Army traditionally congregates — the loudest, most sing-song corner of the ground.

For something more sheltered, the President's Pavilion and the Members' area toward the south west catch shade from around midday, which matters more than people expect on a five-day Test. The Railway Stand, on the opposite side, also holds shade and gives a good angle on the fast bowlers running in.

None of these is objectively the best seat. A first-time visitor who wants to actually watch the cricket in comfort should book the North Stand or Railway side. Anyone who wants the day to feel like an event should head for the Oaks.`,
    whyItsSpecial: `Most grandstand comparisons at other venues are really about sightlines. Newlands is different because where you sit changes the entire tone of your day. The Oaks and the North Stand are basically two different events happening at the same ground at the same time.

I'd argue most first-timers under-value the grass. It's cheaper, unreserved so you can move around, and it's where the ground's reputation for atmosphere gets made. The seated stands are perfectly good, but the Oaks is the version of Newlands you can only get here.

The practical trade-off is real: no guaranteed spot, no real shelter if it rains. Know which trade-off you're making before you buy.`,
    practicalInfo: {
      hours: "Gates open 2-3 hours before play; for the October 2026 Test, play starts 10:00am local time",
      costRange: "Grass embankment tickets roughly half the price of a seated stand ticket; North Stand and Railway Stand seats around R420-R500 per day",
      bookingMethod: "Ticket categories are selected at the point of purchase through TicketPro (tickets.cricket.co.za) — grass and seated tickets are separate categories, not general admission.",
      website: "https://newlandscricket.com",
      reservationsRequired: true,
    },
    gettingThere: "Newlands station (Southern Line) is a two-minute walk. The ground has multiple gates zoned to specific stands — check which entrance matches your ticketed area before arriving.",
    editorialNote: "Sources: thesouthafrican.com (Newlands seating guide), Wikipedia, stadiumsguide.com, wpcc.co.za. Verified 14 Jul 2026.",
    insiderTips: [
      "If buying grass tickets for a full day, get to the gate at least 45 minutes before it opens on high-demand days.",
      "The North Stand and Railway Stand both offer more shade than the grass areas as the afternoon wears on.",
    ],
    whatToAvoid: "Don't buy Oaks or grass tickets expecting proper cover if it rains — there's little to no shelter on the embankments, unlike the roofed sections of the North Stand.",
    moodTags: ["insider-knowledge", "electric-atmosphere", "practical"],
    interestCategories: ["sport"],
    pace: "moderate",
    physicalIntensity: 2,
    budgetTier: "moderate",
    bestSeasons: ["sep", "oct"],
    advanceBookingRequired: true,
    availability: "event_only",
  },
  {
    slugBase: "newlands-hospitality-tiers",
    title: "Newlands Grounds Pass & Hospitality Tiers",
    subtitle: "From a grass embankment ticket to a private suite — what each tier at Newlands actually gets you",
    experienceType: "fan_experience",
    neighborhood: "Newlands",
    address: "The Oaks Pavilion, 3rd Floor, World Sports Betting Newlands, 146 Campground Road, Newlands, Cape Town, 7700",
    bodyContent: `Newlands sells cricket at three distinct levels, and they're worth understanding before you book.

At the base is the grounds pass: a grass embankment ticket, unreserved, roughly half the price of a stand ticket. You bring a blanket, find a spot, and you're part of the loudest section of the ground.

Above that sits general seated admission in the North Stand or Railway Stand — a reserved seat with cover from the weather and a clean view of the pitch.

Then there's hospitality. Newlands' Members' Pavilion has private suites on the third and fourth floors accommodating up to 24 guests each, with private balcony seating overlooking the ground. As of 2026, six of the pavilion's fourteen suites are available to rent for events, and the Boardroom Suites on the fourth floor are a smaller-format option for private groups. For comparable South African cricket hospitality, pricing has run around ZAR 2,590 plus VAT per person per day, typically with a minimum multi-day booking — a useful benchmark, though Newlands' own current rates should be confirmed directly.

The person to speak to is Glenda Julie in the WPCA's hospitality office — 021 657 2051 or 083 534 6255, glendaj@cricket.co.za — who handles suite bookings and corporate hospitality at Newlands directly.

The lead-time trap is real. The most recent Newlands Test on general sale sold out before the public sale window even opened. For a five-day Test against Australia, the tour's marquee final match, hospitality inventory will not last. If a private suite or boardroom package is what you want, the call needs to happen months out, not weeks.`,
    whyItsSpecial: `Most "hospitality" write-ups for cricket grounds are vague on purpose. Newlands isn't. There's a real building, a named contact, a real phone number, and a genuine gap between a grounds pass and a private suite on the Members' Pavilion's balcony.

What makes this worth attention specifically is timing. Everyone who's followed South African cricket recently has seen a Newlands Test sell out its general tickets in minutes. Hospitality inventory moves on its own slower clock, but it is not infinite, and for the tour's final Test, it will not sit unsold for long. Knowing exactly who to call, and calling early, is the entire value of this piece.`,
    practicalInfo: {
      hours: "Hospitality office operates standard business hours, Monday-Friday",
      costRange: "Grass passes roughly half of stand tickets (around R420-R500/day); hospitality packages run into the thousands of Rand per person per day — confirm current rates directly",
      bookingMethod: "Grounds passes and general seated tickets go through TicketPro (tickets.cricket.co.za). For hospitality, contact the WPCA hospitality office directly.",
      howToBook: "If you want hospitality for the Australia Test, call or email Glenda Julie in the WPCA's hospitality office now, not after general sale opens: 021 657 2051 / 083 534 6255 / glendaj@cricket.co.za. Ask specifically about the Members' Pavilion suites (24-person capacity, private balcony) versus the smaller Boardroom Suites. Newlands' most recent Test on general sale sold out before public sale even opened, so treat hospitality inventory for the Australia Test the same way — this is a months-out call. If suites for the Test itself are gone, ask about single-day hospitality packages, which sometimes remain available.",
      website: "https://newlandscricket.com/hospitality-and-venues-for-hire/",
      reservationsRequired: true,
    },
    gettingThere: "Newlands station (Southern Line) is a two-minute walk from the main gates; hospitality guests typically have a dedicated entrance — confirm with the hospitality office when booking.",
    editorialNote: "Sources: newlandscricket.com/hospitality-and-venues-for-hire, wpcc.co.za/suites, EWN sellout report, sportstravel.co.za (comparable hospitality pricing benchmark). Verified 14 Jul 2026. Hospitality pricing is a benchmark from comparable SA cricket hospitality, not a confirmed Newlands rate — howToBook correctly tells subscriber to confirm directly.",
    insiderTips: [
      "Ask specifically whether the quoted hospitality rate is per person per day or a flat suite rate.",
      "If booking a grounds pass instead of hospitality, buy it the moment tickets go on sale.",
    ],
    whatToAvoid: "Don't wait for hospitality pricing to be published online before enquiring. Newlands hospitality is largely sold through direct contact with the WPCA office rather than public rate cards.",
    moodTags: ["exclusive", "insider-knowledge", "premium"],
    interestCategories: ["sport", "luxury"],
    pace: "slow",
    physicalIntensity: 1,
    budgetTier: "luxury",
    bestSeasons: ["sep", "oct"],
    advanceBookingRequired: true,
    availability: "event_only",
  },
  {
    slugBase: "where-to-stay-cape-town-test",
    title: "Where to Stay in Cape Town for the Test",
    subtitle: "V&A Waterfront, City Bowl, or Newlands-adjacent — three real neighbourhoods, three different Test-week trips",
    experienceType: "accommodation",
    neighborhood: "V&A Waterfront / City Bowl / Newlands",
    address: "Cape Grace — West Quay Road, V&A Waterfront, Cape Town, 8001",
    bodyContent: `Where you base yourself for the Cape Town Test changes more than your commute. Cape Town's three obvious neighbourhoods for visiting cricket fans each set a genuinely different tone for the week.

The V&A Waterfront is the tourist-friendly, does-everything option: harbour views, restaurants and shops on your doorstep, and the ferry to Robben Island a short walk away. Cape Grace, a Fairmont-managed hotel on its own private quay, is the standout: five-star, 112 rooms, open since 1996. The trade-off is distance from the ground — roughly 20-25 minutes by car, longer in matchday traffic.

The City Bowl, around Bree Street, Kloof Street, and Long Street, puts you closer to the city's best restaurant scene and the Bo-Kaap. Taj Cape Town, in a converted 1930s bank building on Wale Street, is the pick here: five-star, centrally located, with nearly every room offering a Table Mountain view.

Newlands itself, or neighbouring Claremont and Rondebosch, is the option for people who want to walk to the cricket. The Vineyard Hotel sits on the banks of the Liesbeek River, roughly a kilometre — a 12-15 minute walk — from the ground. Four-star, 175 rooms, its own spa and gardens.

None of these is definitively better. The Waterfront wins on evening options. The City Bowl wins on food and culture. Newlands wins on not having to think about matchday transport at all.`,
    whyItsSpecial: `Where you sleep matters more for a five-day Test than for almost any other kind of sports travel, because you're not doing this once, you're doing it five times in a row.

The Waterfront is the safe, comfortable choice, and it's genuinely good if this is your first trip to Cape Town. The City Bowl is for people who care more about dinner than the highlights package. Newlands is for people who've done a five-day Test before and know that walking distance to the ground, on day four when everyone's tired, is worth a premium.

Pick based on what kind of week you actually want.`,
    practicalInfo: {
      hours: "Standard hotel check-in/out",
      costRange: "Cape Grace from ~$675-$1,000+/night · Taj Cape Town from ~$100-$225/night · Vineyard Hotel from ~$145-$210/night — all subject to significant Test-week surge pricing",
      bookingMethod: "Book directly with each hotel or via Booking.com — expect Test week rates well above the ranges quoted, so book as early as possible.",
      website: "capegrace.com / tajhotels.com / vineyard.co.za",
      reservationsRequired: true,
    },
    gettingThere: "Cape Grace and Taj Cape Town are both a 20-25 minute drive from Newlands depending on traffic; Vineyard Hotel is roughly 1km, a 12-15 minute walk, from Newlands Cricket Ground.",
    editorialNote: "Sources: capegrace.com, tajhotels.com, vineyard.co.za, kayak.com (hotels near Newlands). Verified 14 Jul 2026. Booking.com affiliate candidates flagged, not yet linked: Cape Grace, Taj Cape Town, Vineyard Hotel.",
    insiderTips: [
      "If staying at the Vineyard to walk to the ground, confirm the walking route in daylight before matchday.",
      "The Cape Town Edition, a new luxury property, is slated to open in the Waterfront in 2026 — check its opening status closer to travel dates.",
    ],
    whatToAvoid: "Don't book a City Bowl or Waterfront hotel assuming a 20-minute drive to Newlands will hold on matchday. Traffic builds well before the toss and after close of play.",
    moodTags: ["comfort", "practical", "premium"],
    interestCategories: ["accommodation", "sport"],
    pace: "slow",
    physicalIntensity: 1,
    budgetTier: "splurge",
    bestSeasons: ["sep", "oct"],
    advanceBookingRequired: true,
    availability: "event_only",
  },
  {
    slugBase: "cape-town-bo-kaap-city-bowl-food",
    title: "Cape Town's Bo-Kaap & City Bowl Food Scene",
    subtitle: "Cape Malay curries in Bo-Kaap, then the City Bowl's restaurant strips after dark",
    experienceType: "dining",
    neighborhood: "Bo-Kaap / City Bowl",
    address: "Bo-Kaap Museum, 71 Wale Street, Bo-Kaap, Cape Town",
    bodyContent: `Bo-Kaap is the small, steep neighbourhood on the slope below Signal Hill where Cape Town's Cape Malay community has lived since the 1760s. The houses are famous for their colour, but the reason isn't decorative tradition — it's history. While residents leased the properties, the houses had to stay white. When the lease rule lifted and residents could buy the homes they'd been living in, they painted them in bold colour as a visible act of freedom.

The food follows the same lineage. Cape Malay cooking blends Indonesian, Indian, and Cape Dutch influences into dishes like bobotie, denningvleis, and bright yellow curries built on turmeric, cinnamon, and dried chilli. Biesmiellah, on Wale Street, has served halaal Cape Malay dishes for decades. Bo-Kaap Kombuis, run by Yusuf and Nazli, sits higher up the hill with views over the rooftops. For a more hands-on visit, Andulela runs Cape Malay cooking experiences combining a neighbourhood walk, a spice shop stop, and a cooking session ending with the meal you made.

The Bo-Kaap Museum on Wale Street, in one of the neighbourhood's oldest houses, gives useful context — a quick visit, free entry on Fridays.

Once evening comes, the City Bowl's Bree Street and Kloof Street take over. Bree Street has become Cape Town's most talked-about restaurant strip, more than sixty bars and restaurants along one stretch, from wine bars to wood-fired pizza to Liam Tomlin's Chef's Warehouse. Kloof Street runs a similar scene with a slightly more neighbourhood feel.`,
    whyItsSpecial: `The colour in Bo-Kaap gets photographed constantly and explained rarely. Once you know the houses were white by law and only turned bright after emancipation, the neighbourhood stops being a backdrop and starts being a story you're walking through. The food carries the same weight — Cape Malay cuisine exists because people brought here against their will held onto their cooking as one of the few things that couldn't be taken from them.

Pairing that with the City Bowl's restaurant scene at night gives the day real shape: heritage cooking in daylight, contemporary Cape Town cuisine after dark.`,
    practicalInfo: {
      hours: "Bo-Kaap Museum 9am-5pm Mon-Sat (free Fridays); Biesmiellah Mon-Fri 9am-10pm, Sat 10:30am-10pm; Bo-Kaap Kombuis lunch Tue-Sun, dinner Tue-Sat",
      costRange: "Bo-Kaap Museum R20 adults; Cape Malay meals mid-range per person; Andulela cooking experiences priced as a half-day guided activity",
      bookingMethod: "Bo-Kaap Museum and restaurants are walk-in, though Biesmiellah gets busy on weekend evenings. Andulela's cooking experiences should be booked in advance directly.",
      website: "bokaapkombuis.co.za / biesmiellah.co.za / andulela.com",
      reservationsRequired: false,
    },
    gettingThere: "Bo-Kaap is a 10-15 minute walk uphill from central Cape Town, or a short taxi/rideshare from the City Bowl or Waterfront. Bree Street is centrally located, walkable from most City Bowl accommodation.",
    editorialNote: "Sources: Wikipedia (Bo-Kaap), sahistory.org.za, iziko.org.za, bokaapkombuis.co.za, biesmiellah.co.za, breestreet.online. Verified 14 Jul 2026.",
    insiderTips: [
      "Visit Bo-Kaap in the morning if photography matters — the steep streets get harsh light by early afternoon.",
      "Bo-Kaap is a residential neighbourhood, not an open-air museum — be respectful photographing homes with people visible.",
    ],
    whatToAvoid: "Don't expect alcohol at Bo-Kaap's Cape Malay restaurants — the neighbourhood is historically Muslim and most restaurants, including Biesmiellah, are halaal and don't serve alcohol.",
    moodTags: ["cultural", "culinary", "historic"],
    interestCategories: ["food", "culture"],
    pace: "moderate",
    physicalIntensity: 2,
    budgetTier: "moderate",
    bestSeasons: ["sep", "oct"],
    advanceBookingRequired: false,
    availability: "perennial",
  },
  {
    slugBase: "table-mountain-cape-point",
    title: "Table Mountain & Cape Point",
    subtitle: "The classic Cape Peninsula day — cable car, penguins, and the point where two oceans meet",
    experienceType: "day_trip",
    neighborhood: "Cape Peninsula",
    address: "Table Mountain Aerial Cableway, Tafelberg Road, Gardens, Cape Town, 8001",
    bodyContent: `This is the day almost every visitor to Cape Town ends up doing in some form. The loop covers Table Mountain's cableway, the drive down the peninsula via Chapman's Peak, Boulders Beach's African penguin colony, and Cape Point itself.

Table Mountain's cableway runs from a base station with rotating cars giving a 360-degree view on the way up. In shoulder season, cars run 8:30am to 7pm, last car up at 6pm — worth building your morning around, since the mountain is frequently capped by cloud (the "tablecloth") later in the day.

From the mountain, the drive south runs through Hout Bay onto Chapman's Peak Drive, a spectacular nine-kilometre stretch cut into the cliffside with 114 curves. Continue to Boulders Beach near Simon's Town, home to African penguins nesting right on the sand and boardwalks, then finish at Cape Point Nature Reserve, where Atlantic and Indian Ocean currents meet. A funicular, the Flying Dutchman, runs up to the old lighthouse.

The full loop runs roughly 150 kilometres. Most first-time visitors do better on a guided day tour — no navigating unfamiliar coastal roads, no hunting for parking, a guide who can tell you what you're looking at. Full-day guided tours typically run 8-9 hours door to door.

For Test week specifically, this is the obvious rest-day plan between sessions — ideally scheduled for a non-match day.`,
    whyItsSpecial: `Chapman's Peak actually earns the "most dramatic coastal road" claim — not because it's the longest, but because the ocean is right there, close enough that the road feels balanced on the edge of something.

What makes the full day work as a unit is the range: Table Mountain gives you scale, Boulders gives you something genuinely funny and unexpected, and Cape Point gives you the geographic full stop. Few single days pack in that much variety without feeling rushed, provided you start early.`,
    practicalInfo: {
      hours: "Cableway (shoulder season): 8:30am-7pm, last car up 6pm — check tablemountain.net for exact hours",
      costRange: "Cableway return R450/adult online (R490 at office); Cape Point entry R515/international adult; Boulders Beach R245/international adult; Flying Dutchman funicular +R115",
      bookingMethod: "Book Table Mountain cableway tickets online in advance at tablemountain.net. Cape Point and Boulders Beach entry fees are paid at the gate (card only at Boulders). Full-day guided tours can be booked via City Sightseeing, GetYourGuide, or Viator.",
      website: "tablemountain.net / sanparks.org",
      reservationsRequired: false,
    },
    gettingThere: "Free MyCiTi shuttle buses connect Civic Centre to the Lower Cableway station via Kloof Nek, roughly every 15-20 minutes, 7:30am-7pm daily. Cape Point and Boulders Beach are only realistically reached by car or organised tour.",
    editorialNote: "Sources: tablemountaincablecar.com, tablemountain.net, SANParks official conservation fees PDF (2025/26), thecapetownblog.com, johnnyafrica.com. Verified 14 Jul 2026. Used SANParks' own official rate PDF for pricing over lower aggregator figures.",
    insiderTips: [
      "Book the cableway for the earliest slot you can get, ideally before 9:30am — cloud cover builds through the day.",
      "If self-driving, fill up on fuel before leaving central Cape Town — limited fuel availability deep into the peninsula loop.",
    ],
    whatToAvoid: "Don't schedule this for a Test match day, even a rest day right before one — a full peninsula loop realistically takes 8-9 hours.",
    moodTags: ["scenic", "classic", "outdoors"],
    interestCategories: ["sightseeing", "nature"],
    pace: "active",
    physicalIntensity: 3,
    budgetTier: "moderate",
    bestSeasons: ["sep", "oct"],
    advanceBookingRequired: false,
    availability: "perennial",
  },
  {
    slugBase: "robben-island-mandela-cell",
    title: "Robben Island — Nelson Mandela's Cell",
    subtitle: "The ferry crossing to the prison where Mandela spent 18 of his 27 years, led by former inmates",
    experienceType: "cultural_site",
    neighborhood: "V&A Waterfront (departure) / Robben Island",
    address: "Nelson Mandela Gateway, Clock Tower Precinct, V&A Waterfront, Cape Town, 8001",
    bodyContent: `Robben Island sits around 11 kilometres off Cape Town's coast, and for the second half of the twentieth century, it was where the apartheid government sent its political prisoners. Nelson Mandela spent 18 of his 27 years of imprisonment here, in a cell in B Section that measures roughly 2.4 by 2.1 metres.

The only way to reach the island is by ferry from the Nelson Mandela Gateway at the V&A Waterfront's Clock Tower. Ferries run at fixed times through the day, typically 9am, 11am, 1pm, and 3pm, with the crossing taking 30 to 60 minutes depending on conditions.

Once on the island, the tour runs in two parts. A bus takes you around the island's wider sites — the lime quarry where prisoners were forced to labour, the leper graveyard, the staff settlement — before a walking tour through the maximum-security prison itself, led by a former political prisoner. Robben Island's guides are, genuinely, people who were incarcerated there. The full experience runs roughly three and a half to four hours.

Tickets are only available in advance, through the official Robben Island Museum website. There's no walk-up sales at the ferry departure point, and this is one of Cape Town's most consistently booked-out experiences.`,
    whyItsSpecial: `There's a particular kind of history experience that stays abstract no matter how well it's explained, and then there's the kind that becomes real the moment you're standing in the actual space. Robben Island is the second kind. Reading that Mandela's cell measured 2.4 by 2.1 metres is one thing. Standing in the corridor outside it, with a guide who served time in the same prison, is different entirely.

Cape Town has spectacular scenery and excellent food, and neither explains why this island, more than almost anywhere else in the country, is where the story of modern South Africa actually gets told.`,
    practicalInfo: {
      hours: "Ferries typically depart 9am, 11am, 1pm, and 3pm daily, weather permitting; full tour approximately 3.5-4 hours",
      costRange: "Standard guided tour approximately R620/adult (R310 for children 4-17); some sources quote R400 for SA citizens/residents — confirm current pricing on the official site",
      bookingMethod: "Book only through the official Robben Island Museum website (robben-island.org.za) — no walk-up ticket sales at the departure point, and it sells out regularly.",
      website: "https://www.robben-island.org.za",
      reservationsRequired: true,
    },
    gettingThere: "The Nelson Mandela Gateway is inside the V&A Waterfront, walkable from most Waterfront accommodation and a short taxi/rideshare from the City Bowl.",
    editorialNote: "Sources: robben-island.org.za, waterfront.co.za, machupicchu.org (Robben Island tour guide), ticketsntour.com. Verified 14 Jul 2026. Pricing discrepancy (R620 vs R400) flagged directly in copy rather than picking one arbitrarily.",
    insiderTips: [
      "Book for the morning if you can — the 9am or 11am crossings tend to have calmer water.",
      "Wear real shoes, not sandals — the walking tour covers uneven ground including the old quarry.",
    ],
    whatToAvoid: "Don't book this for the day you land in Cape Town if arriving on a long-haul flight — the ferry crossing can be rough, and doing it on limited sleep isn't ideal.",
    moodTags: ["historic", "moving", "must-book"],
    interestCategories: ["history", "culture"],
    pace: "moderate",
    physicalIntensity: 2,
    budgetTier: "moderate",
    bestSeasons: ["sep", "oct"],
    advanceBookingRequired: true,
    availability: "perennial",
  },
];

for (const exp of experiencesList) {
  await seed(exp);
}

await client.end();
console.log("\nAll Cape Town experiences seeded.");

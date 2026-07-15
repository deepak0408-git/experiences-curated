import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const CAPE_TOWN_ID = "046c4eba-87f3-4b40-a020-560f605e4d7d";
const JOHANNESBURG_ID = "de40345a-9fbc-4b77-9833-dafed8189e40"; // ticket guide spans all venues; anchored to Johannesburg as the tour's gateway destination
const EVENT_ID = "be8e1129-6e53-4e45-a574-931250988806";

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
        destinationId: exp.destinationId,
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
    slugBase: "aus-sa-ticket-guide",
    title: "Your Australia in South Africa Ticket Guide",
    subtitle: "Three venues, two formats, one tour — how to actually plan which matches to buy tickets for",
    experienceType: "fan_experience",
    destinationId: JOHANNESBURG_ID,
    neighborhood: "Multiple venues",
    address: null,
    bodyContent: `The Australia tour of South Africa 2026-27 runs from 24 September to 31 October, three ODIs followed by three Tests, spread across five cities. For a fan planning a trip rather than a single match, the geography matters as much as the cricket.

The ODI leg opens at Kingsmead in Durban on 24 September, moves to the DP World Wanderers Stadium in Johannesburg for the second match on 27 September, then to JB Marks Oval in Potchefstroom for the third on 30 September. The Test series that follows is the tour's centrepiece: the first Test returns to Kingsmead from 9-13 October, the second moves to Dafabet St George's Park in Gqeberha from 18-22 October, and the third and final Test closes the tour at Newlands in Cape Town from 27-31 October. This is Australia's first Test tour of South Africa since the 2018 ball-tampering scandal, against the reigning World Test Championship holders, with real WTC points on the line.

Tickets are sold through Cricket South Africa's official partner, TicketPro (tickets.cricket.co.za), with the 2026-27 international season's sales window opening well ahead of the tour. Newlands pricing for comparable recent Tests has run R420-R500 per day for general grounds access, with a five-day package around R990 — a useful benchmark, though Kingsmead and Wanderers pricing for this specific series hadn't been separately confirmed at the time of writing. Check TicketPro directly for the exact numbers as they're published.

For a fan covering all three of our featured cities — Durban, Johannesburg, Cape Town — the realistic itinerary is: Durban for the 1st ODI and 1st Test (same ground, three weeks apart, so either stay the whole window or make two separate Durban trips), Johannesburg for the 2nd ODI, then Cape Town for the 3rd Test at the very end of the tour. Gqeberha and Potchefstroom are real stops on the tour but sit outside this pack's three-city focus.

Newlands' recent history of selling out before general sale even opens is the clearest signal on this tour: the tickets that will move fastest are the Cape Town Test, both because it's the series finale and because Newlands specifically has a track record of selling out early.`,
    whyItsSpecial: `Most tour previews list dates and venues and leave you to do the planning work yourself. The actual planning problem here is sequencing — Durban hosts two different formats three weeks apart, which means either committing to a long single stay or accepting two separate trips to the same city, and that decision shapes everything else about how you'd plan a South Africa trip around this tour.

I think the smart move for most travelling fans is picking one leg rather than trying to do the whole tour. The ODI leg is quicker and cheaper to attend. The Test leg, especially the Cape Town finale, is the higher-stakes cricket and the harder ticket to get.`,
    practicalInfo: {
      hours: "Tour runs 24 September - 31 October 2026",
      costRange: "Newlands general grounds access has run R420-R500/day on comparable recent Tests, with 5-day packages around R990 — a benchmark only; confirm current pricing for each specific match on TicketPro",
      bookingMethod: "All tickets sold through Cricket South Africa's official partner, TicketPro (tickets.cricket.co.za). The CSA mobile app also carries ticket sales for the 2026-27 international season.",
      website: "https://tickets.cricket.co.za",
      reservationsRequired: true,
    },
    gettingThere: "Each city's specific getting-there details are covered in that city's own experiences — see the Newlands, Kingsmead, and Wanderers pieces for venue-specific transport.",
    editorialNote: "Sources: ESPNcricinfo (Australia tour of South Africa 2026-27 fixtures), ICC.com (WTC series schedule), cricket.co.za (CSA ticket sales announcements), quicket.co.za, clubcricket.co.za. Verified 14 Jul 2026 via two independent sources on the schedule, one initial conflicting search result traced to a different Bangladesh series and ruled out. Kingsmead/Wanderers-specific pricing not yet confirmed at time of writing — Newlands pricing used as an explicit benchmark only, not presented as this series' actual price.",
    insiderTips: [
      "If you can only commit to one leg of the tour, the Cape Town Test (27-31 Oct) is the highest-stakes cricket and the hardest ticket — Newlands has a track record of selling out before general sale even opens.",
      "Durban hosts both the 1st ODI (24 Sep) and 1st Test (9-13 Oct) at the same ground three weeks apart — decide early whether you're doing one long stay or two separate trips.",
    ],
    whatToAvoid: "Don't wait to buy Cape Town Test tickets closer to October — recent Newlands Tests have sold out before public sale even opened, and this is the tour's marquee closing match against Australia.",
    moodTags: ["strategic", "planning", "comprehensive"],
    interestCategories: ["sport"],
    pace: "moderate",
    physicalIntensity: 1,
    budgetTier: "moderate",
    bestSeasons: ["sep", "oct"],
    advanceBookingRequired: true,
    availability: "event_only",
  },
  {
    slugBase: "cape-winelands-stellenbosch-franschhoek",
    title: "Cape Winelands — Stellenbosch & Franschhoek",
    subtitle: "Vineyards, mountains, and lunch that runs long — forty minutes from Cape Town's city centre",
    experienceType: "day_trip",
    destinationId: CAPE_TOWN_ID,
    neighborhood: "Stellenbosch / Franschhoek",
    address: "Stellenbosch, Western Cape",
    bodyContent: `The Cape Winelands start appearing about forty minutes east of Cape Town, and Stellenbosch and Franschhoek are the two towns most day trips are built around. Both sit in valleys ringed by mountains, both have been producing wine since the late 1600s, and both are genuinely different enough from each other to justify visiting both if you have the time.

Stellenbosch is the bigger, older town — South Africa's second-oldest European settlement, with oak-lined streets, Cape Dutch architecture, and a university that gives it a livelier, less precious feel than some wine towns manage. Estates like Beyerskloof, Middelvlei, and Haute Cabrière are regularly named among the region's strongest tasting experiences, ranging from casual to formal depending on which cellar door you choose.

Franschhoek, half an hour further on, is smaller, French Huguenot in origin, and leans further into fine dining alongside the wine — it's the town where a long, multi-course lunch at a vineyard restaurant is as much the point as the tasting itself. The Franschhoek Wine Tram runs a hop-on-hop-off route between a rotating selection of estates, useful if you don't want to worry about a designated driver.

Full-day guided tours from Cape Town typically cover both towns, several tastings, and lunch, running eight to nine hours door to door. Half-day options exist too, usually focused on just Stellenbosch or just Franschhoek rather than both, and self-driving is realistic if you're comfortable with a group nominating a non-drinking driver or splitting tastings between people.

For Test week specifically, this is a strong second rest-day option alongside the Table Mountain and Cape Point loop — pick whichever matches the mood you're after, since doing both back to back across five days of Test cricket is a lot.`,
    whyItsSpecial: `What I like about the Winelands as a rest-day option is the pacing. Table Mountain and Cape Point is an active, cover-a-lot-of-ground kind of day. The Winelands is the opposite — long lunches, unhurried tastings, mountains as a backdrop rather than a destination you're climbing.

Stellenbosch and Franschhoek genuinely feel different from each other, not just two versions of the same wine-town formula. Stellenbosch has more energy and history you can walk through. Franschhoek is quieter and more focused on the table. Which one suits you says something about what kind of day off you actually want during a five-day Test.`,
    practicalInfo: {
      hours: "Most estates open for tastings 9am-5pm; specific hours vary by cellar door",
      costRange: "Half-day tuk-tuk or tram tours from around R300/person; full-day guided tours with multiple tastings and lunch typically run higher, priced per operator",
      bookingMethod: "Full-day and half-day tours can be booked through operators like Wine Tour Co, Wine Tours Cape Town, or the Franschhoek Wine Tram. Self-driving is realistic with a designated non-drinking driver.",
      website: "winetour.co.za / winetram.co.za",
      reservationsRequired: false,
    },
    gettingThere: "Stellenbosch is roughly 40-45 minutes from central Cape Town by car; Franschhoek is around 15-20 minutes further. No direct public transport route — a rental car, guided tour, or private transfer is the realistic way to get there.",
    editorialNote: "Sources: winetour.co.za, winetourscapetown.com, stellenboschwinetours.net, winetram.co.za, tuktukfranschhoek.co.za. Verified 14 Jul 2026.",
    insiderTips: [
      "If choosing between the two towns rather than doing both, pick Stellenbosch for more walkable history and energy, Franschhoek for a slower, food-focused day.",
      "Book tastings or the Wine Tram in advance during September-October — this is a popular season and estates can fill their tasting slots.",
    ],
    whatToAvoid: "Don't try to fit both towns into a half-day trip — Stellenbosch and Franschhoek together genuinely need a full day if you want more than a rushed single tasting at each.",
    moodTags: ["relaxed", "scenic", "culinary"],
    interestCategories: ["food", "sightseeing"],
    pace: "slow",
    physicalIntensity: 1,
    budgetTier: "moderate",
    bestSeasons: ["sep", "oct"],
    advanceBookingRequired: false,
    availability: "perennial",
  },
];

for (const exp of experiencesList) {
  await seed(exp);
}

await client.end();
console.log("\nFinal 2 experiences seeded — all 21 now in the DB.");

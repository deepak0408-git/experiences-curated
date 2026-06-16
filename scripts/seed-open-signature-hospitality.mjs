import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "263faaad-ceed-4355-acb7-9f2073cb1028";
const EVENT_ID = "ccb585a6-3cdb-40ce-999e-a1d455854301";
const slug = "open-signature-hospitality-" + Date.now().toString(36);

// ─── Content ──────────────────────────────────────────────────────────────────

const bodyContent = `The word "hospitality" at a major golf championship usually means the same thing: a marquee with carpet, branded tablecloths, and a view of a giant screen rather than the hole itself. Dunes House and The Retreat at Royal Birkdale are different. Not because the food is better, though it is. Because the R&A built them into the course rather than alongside it.

Dunes House is a triple-deck structure overlooking the 15th green and 16th tee, positioned in the sandhills that define Birkdale's character. From the upper balcony you have an elevated view of two holes simultaneously — the approach to 15, the drama around the green, and the tee shot on 16 starting directly below. This is not the sort of view you get from a public grandstand. You're above the action, outdoors when you choose, with a full bar behind you and no obligation to stand.

The Retreat is a champagne lounge adjacent to the par-3 7th green. It is genuinely intimate. The 7th is one of Birkdale's most underrated holes — a short iron into a well-bunkered green with dunes on three sides — and The Retreat positions you alongside the green at eye level, close enough to watch players read the putts. Between groups, you go back inside. Charcuterie and champagne service runs all day.

Signature hospitality gives access to all four on-course venues: Dunes House, The Retreat, Clarets (overlooking the 17th green), and Links (near the 4th). It also includes a reserved grandstand seat at the 18th green for the closing holes. Clarets is where most Signature guests settle for the tense final stretch. The 18th seat is the guaranteed position you don't have to fight for at the end of a long day.

Platinum is the adjacent tier: Dunes House, The Retreat, and Links — but not Clarets and not the 18th reserved seat. Pricing starts at £1,632 per person (Thursday, ex-VAT), rising to £1,872 on Sunday. Signature starts at £2,574 on Thursday and £3,234 on Sunday. Friday Platinum is already sold out; Signature sold out on Thursday through Sunday, with limited Wednesday availability remaining.

The logistics matter. Every hospitality tier includes a parking pass — a meaningful advantage when road closures around Royal Birkdale make getting in and out of Southport by car genuinely difficult on championship days. Breakfast, lunch, afternoon snacks, and an open bar are included throughout. Private toilets at each venue are a practical bonus when public queues run long. Platinum and Signature guests also have access to a Toptracer simulator bay, fast-track shop access, and player Q&A sessions. Signature adds a Claret Jug photo opportunity — the kind of access that doesn't exist outside the hospitality tiers.

Who is this for? Not for the person who wants to walk the dunes and feel the course. That's what general admission is for, and it's excellent. This is for the person who wants to watch The Open from a position of total comfort, see specific holes from close up, and have the 18th grandstand locked down for Sunday.`;

const whyItsSpecial = `Most golf hospitality exists to sell a day out to corporate clients who will watch maybe three holes before retreating to lunch. The R&A's hospitality at The Open has historically been better than this, partly because the company is serious about golf, and partly because Birkdale's layout makes it possible to design hospitality that sits on the course rather than next to it.

Dunes House is the proof. The 15th and 16th at Birkdale are two of the most dramatic holes on the back nine — a long par-3 over rough and a sweeping dogleg — and the triple-deck structure overlooking them gives a multi-angle view that the public areas don't replicate. The Retreat at the 7th is smaller and quieter: a champagne lounge next to a par-3 green, close enough that you don't need binoculars to follow the putts.

What sets the Signature tier apart is the 18th green reserved seat. On Sunday, when the championship is decided, having a guaranteed position at the closing hole is worth something concrete. The public crowd at the 18th by Sunday afternoon is 10,000 people, and standing positions are claimed hours before the leaders arrive. The Signature grandstand seat removes that calculation entirely.

The price is high. But measured against what it actually buys — four on-course venues, a full day of food and open bar, a parking pass, and a seat at the most famous closing hole in championship golf — this is the rational choice for the person who wants to watch The Open once, properly, and not spend Sunday afternoon six rows back from the 18th rope.`;

const insiderTips = [
  "The Retreat at the 7th is best in the morning when the first groups are still fresh and the bar is quieter — by afternoon, Signature guests cluster at Clarets for the back-nine drama, so use the morning to claim the best spot at the 7th green.",
  "Your parking pass is valid from gates-open time — arriving two hours before first tee means easy parking and first choice of tables at breakfast in Dunes House before the course fills.",
];

const whatToAvoid = `Don't book Platinum expecting the same experience as Signature — the absence of Clarets (the 17th lounge) and the reserved 18th grandstand seat is the practical difference on Sunday when the championship is being won and lost. And don't assume the waiting list for sold-out days is inactive: corporate bookings do fall away in the weeks before the event, and the R&A team can add you to a real list rather than a web form.`;

const gettingThere = `A parking pass is included with all hospitality tiers — follow The Open signage from the M57/A570. Merseyrail Northern Line from Liverpool Central to Birkdale station (approximately 40 minutes) is also available, with an 8-minute walk to the gates. Do not attempt to park near the course without a pass on championship days.`;

const practicalInfo = {
  hours: "Gates open 2 hours before first tee time. Championship days: Thursday 16 – Sunday 19 July 2026.",
  costRange: "Platinum from £1,632/person (Thu) to £1,872/person (Sun), ex-VAT. Signature from £2,574/person (Thu) to £3,234/person (Sun), ex-VAT.",
  bookingMethod: "Book via theopen.com/tickets-and-hospitality/2026/signature or call +44 (0)1334 460090.",
  howToBook: "Signature and Platinum sell in a specific pattern: Sunday goes first, then Saturday, then Thursday. Friday Platinum is already sold out as of mid-June 2026. Call the R&A Experience Team directly on +44 (0)1334 460090 or email experiences@theopen.com — the team has visibility of remaining allocations and can advise on waiting lists for sold-out days, which do clear as corporate bookings are cancelled or reduced. Limited Wednesday Signature availability remained as of mid-June 2026; if you're flexible on the day, Wednesday gives the same access for less pressure on the grandstand. For groups of 10 or more, contact the corporate hospitality team separately — group pricing and dedicated concierge arrangements are available but not listed on the public booking page. Destination packages combining Platinum or Signature with accommodation in Southport or Liverpool are listed at theopen.com/tickets-and-hospitality/2026/destination-packages; these can represent better overall value once match-week hotel rates are factored in.",
  website: "https://www.theopen.com/tickets-and-hospitality/2026/signature",
  reservationsRequired: true,
};

// ─── Insert ───────────────────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Signature Hospitality — Dunes House & The Retreat",
      subtitle: "Four on-course venues, a reserved 18th grandstand seat, and a Champagne lounge at the 7th — The Open's top hospitality.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Royal Birkdale",
      address: "Royal Birkdale Golf Club, Waterloo Road, Southport, PR8 2LX",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: theopen.com/tickets-and-hospitality/2026/signature (Signature tier details), theopen.com/tickets-and-hospitality/2026/platinum (Platinum tier details), theopen.com/tickets-and-hospitality/2026/exclusive-bases (Dunes House and The Retreat venue details), golfbusinessnews.com pricing article (per-day per-person pricing ex-VAT). Verified 16 Jun 2026. No suitable CC hero image found — try R&A press contact: mediaenquiries@randa.org.",
      moodTags: ["luxury", "insider"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "luxury",
      budgetCurrency: "GBP",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-06-16",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
  console.log("\n→ Ready to review at: http://localhost:3000/curator/review");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}

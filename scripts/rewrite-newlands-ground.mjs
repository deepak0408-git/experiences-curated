import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "63c4df8e-a149-46f9-b13d-3ad4bfc6fb45";

const bodyContent = `Newlands has staged cricket since January 1888, when the Western Province Cricket Club leased a plot of farmland from Lydia Letterstedt, daughter of the Cape Town brewer who'd bought the site decades earlier. That brewing history isn't a footnote. The ground draws on the same spring water that still feeds Newlands Brewery next door, Africa's oldest working brewery. England won the venue's first Test here in March 1889, by an innings and 202 runs, and Newlands has been a fixture on the international calendar ever since.

What sets it apart from South Africa's other grounds is obvious the moment you're inside. Table Mountain rises directly behind one end, with Devil's Peak alongside it, and the cricket can start to feel almost secondary to the view. No other Test venue anywhere has a backdrop doing that much work, and it changes by the hour: sharp and clear at nine in the morning, capped by the "tablecloth" of cloud by lunch, hazy gold by the time shadows stretch across the outfield in the evening session.

The pitch itself has a clear character, and it's a fair one to know before you sit down for a full day. Early on, especially with a new ball, seamers get real assistance — bounce and lateral movement that can trouble an unsettled top order. That window closes fast. Once the shine wears off, Newlands turns into one of South Africa's better batting surfaces, and totals here tend to be high once a side is set. Spin barely gets a look-in; this has never been a turning pitch. The practical read for a spectator: the first hour after a new ball, in either innings, is when you're most likely to see genuine drama. The middle session of a settled innings is when you're watching batsmen cash in.

That shape has produced some real outliers. Stephen Fleming's 262 for New Zealand in 2006 is still the highest individual score at the ground. Ben Stokes and Jonny Bairstow put on 399 for England's sixth wicket in 2016, with Stokes making 258. And directly relevant to this tour: the highest total ever posted at Newlands is Australia's own, 651 all out against South Africa in March 2009 — built on AB de Villiers' brutal 163, including four consecutive sixes off Andrew McDonald. Australia still lost that match by an innings, chasing a target that size, which tells you plenty about how batting-friendly this ground becomes once the ball goes soft.

Capacity sits at 25,000 now, down from the ground's old sprawl of open grass banks. A redevelopment between 1991 and 1997 replaced much of that grass with permanent stands, and further building work since has continued the trade-off. Cape Town regulars will tell you something's been lost, but what's left still carries more character than most stadiums built from scratch.

The crowd matches the setting. Test cricket here draws serious support without ever getting precious about itself, and England's Barmy Army in particular have turned Newlands into something close to a second home ground during tours here. In January 2019, Ben Stokes bowled England to a famous final-day win here in front of a packed, loud ground.

The Australia Test in October 2026 closes out the tour, the third and final match after Durban and Gqeberha. It's also one of the earliest men's Tests Newlands has hosted on the calendar, played while Cape Town is still cool and green rather than deep into its dry summer.`;

const whyItsSpecial = `I've sat through plenty of Test cricket at grounds that pride themselves on history and give you very little to actually look at beyond the pitch. Newlands solves that by accident of geography. You don't need to know anything about cricket to understand why this ground matters. Turn around during a lunch break and Table Mountain is right there.

But the mountain isn't the whole argument, and neither is the crowd. What makes Newlands genuinely worth building a day around is that the cricket itself tends to deliver — a pitch that gives bowlers a real early chance and then hands the game to batsmen who survive it, which is exactly the shape that produces both collapses and monster scores. Australia's own 651 here in 2009, still the highest total in the ground's history, and still not enough to win, is the kind of result this venue seems built to produce.

Test tickets here sold out before general sale even opened for the January 2027 England series. For a first-time visitor to a Test in Cape Town, this is the one non-negotiable booking. Everything else sits around it.`;

const insiderTips = [
  "The outfield slopes from the Wynberg End down to the Kelvin Grove End, which affects both drainage and how the ball moves off the seam.",
  "The President's Pavilion / South West Stand is the best spot for shade from around midday onward.",
  "If a wicket falls in the first hour with the new ball, don't leave your seat for a coffee — that's the window where Newlands is at its most dramatic. Once the shine goes, the pitch tends to flatten out fast.",
];

const whatToAvoid = "Don't judge the day's ticket price purely by which day of the Test it is — a genuinely useful call is checking the weather and toss result that morning if you can, since Newlands swings hard on new-ball conditions specifically. A cloudy, overcast toss morning is far more likely to produce the seam-and-bounce drama the ground is known for than a hot, dry one, regardless of which day of the five you've booked.";

try {
  const [result] = await db.update(experiences).set({
    bodyContent,
    whyItsSpecial,
    insiderTips,
    whatToAvoid,
    editorialNote: "Sources: newlandscricket.com, Wikipedia (Newlands Cricket Ground), thesouthafrican.com, ESPNcricinfo (ground records, pitch report, 2009 3rd Test scorecard), EWN (ticket sellout report), sportsadda.com (Newlands Test records), fantasykhiladi.com/sportsf1.com (pitch report). Verified 14 Jul 2026. Rewritten to add pitch character and classic-match specifics, matching the depth of the Kingsmead write-up per user feedback.",
  }).where(eq(experiences.id, EXPERIENCE_ID)).returning({ id: experiences.id, title: experiences.title, status: experiences.status });

  console.log("✓ Updated:", result.title, "|", result.id, "| status:", result.status);
} catch (e) {
  console.error("✗ FAILED:", e.message);
  if (e.cause) console.error("CAUSE:", e.cause);
} finally {
  await client.end();
}

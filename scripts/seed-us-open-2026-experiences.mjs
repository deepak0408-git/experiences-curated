// US Open 2026 — 13 experiences
// Images sourced separately; heroImageUrl left null initially.
// Run upload-us-open-images.mjs after this to attach hero images.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEvents } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [event] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, "us-open-2026"));

if (!event) { console.error("US Open 2026 not found — run seed-us-open-2026-event.mjs first"); process.exit(1); }

const NY = "fb782de2-bbe6-410f-b466-2a4e628cda10";
const eventId = event.id;

const EXPERIENCES = [

  // ─── ON THE GROUNDS ──────────────────────────────────────────────────────────

  {
    slug: "arthur-ashe-stadium-" + Date.now().toString(36),
    title: "Arthur Ashe Stadium",
    subtitle: "The world's largest tennis stadium — 23,771 seats, retractable roof, and night sessions unlike any other",
    experienceType: "fan_experience",
    budgetTier: "splurge",
    availability: "event_only",
    neighborhood: "Flushing Meadows",
    moodTags: ["electric", "spectacular", "iconic", "loud"],
    interestCategories: ["tennis", "live sport", "architecture"],
    editorialNote: "World's largest tennis stadium. Night sessions are the primary occasion — evening tickets far more valuable than day. Retractable roof since 2016.",
    specScoreSpecificity: 5, specScoreProvenance: 4, specScoreExceptionalism: 5, specScoreCurrency: 5,
    bodyContent: `Arthur Ashe Stadium seats 23,771 people. That number is worth sitting with for a moment — it's bigger than Madison Square Garden, bigger than the O2 Arena in London, bigger than any other tennis stadium on earth. The scale of it doesn't fully register until you're inside, looking across at the far side of the upper deck and realising the people there are small.

The stadium opened in 1997, named for the American tennis champion and humanitarian Arthur Ashe. A retractable roof was added in 2016, making it the last of the US Open's three main courts to be weatherproofed. The roof closes automatically when rain or extreme heat conditions require it — in practice this mostly means you'll see it used during afternoon sessions when the heat index exceeds the USTA's threshold, or during the evening when storms roll in off the Atlantic.

**Day vs night**

The stadium runs two daily sessions: day (starting around 11am) and night (7pm). They are different experiences. The day session is calmer, the crowd more spread out across the stadium, the light hitting the blue court surface in a way that makes the yellow ball easy to follow. The night session is something else entirely. The upper deck fills by 8pm. The noise amplifies. The lighting drops the court into vivid relief against the dark New York sky. Prime matches — semifinals, marquee matchups, the biggest names in the draw — are scheduled for night sessions, and the atmosphere during a close third set in Arthur Ashe at 10pm on a Tuesday is unlike anything else in sport.

Book night session tickets before anything else in your trip planning. They sell out months in advance, scale in price based on round and expected match quality, and cannot be replicated with a same-day grounds pass.

**Getting to your seat**

The stadium has multiple entry gates and the ground level concourse runs all the way around. Food and drink concessions are on every level — the variety is better than any other tennis venue in the world, because this is New York. Find your section early; the seating is steep in the upper levels and the sight lines are excellent from almost anywhere.

**Hawk-Eye and the replay screens**

One thing that distinguishes the US Open experience from Wimbledon: large replay screens at each end of the court, and Hawk-Eye instant replays shown to the crowd after challenges. The crowd reaction to a challenge — the collective lean-in as the ball's trajectory appears on screen — is one of the specific pleasures of watching tennis at this venue.`,
    whyItsSpecial: `Most sporting venues are defined by their history or their intimacy. Arthur Ashe Stadium is defined by its scale, and the scale is the point. There are 23,771 seats, and when they're full and the match on court is close, the noise the crowd produces is physical. You feel it.

The night sessions are the reason this experience earns its place at the top of the pack. Wimbledon ends play in the early evening. Roland Garros does not do this at all. The Australian Open has night sessions but in a different stadium culture and timezone. The US Open built its identity around prime-time tennis in New York, and the product — a packed Arthur Ashe Stadium under lights, Manhattan visible from the upper deck, a crowd that stays and gets louder as the match goes on — is genuinely singular.

If you're doing one session at the US Open, it's a night session in Arthur Ashe. That's the correct answer.`,
  },

  {
    slug: "us-open-night-sessions-" + Date.now().toString(36),
    title: "The Night Sessions",
    subtitle: "Prime-time tennis starting at 7pm — the US Open's signature offering and the loudest atmosphere in the sport",
    experienceType: "event",
    budgetTier: "splurge",
    availability: "event_only",
    neighborhood: "Flushing Meadows",
    moodTags: ["electric", "unmissable", "loud", "late-night"],
    interestCategories: ["tennis", "live sport", "nightlife"],
    editorialNote: "The defining US Open experience. Books out months ahead. Separate ticket from grounds pass — must book explicitly. Best matches deliberately scheduled for night.",
    specScoreSpecificity: 5, specScoreProvenance: 4, specScoreExceptionalism: 5, specScoreCurrency: 5,
    bodyContent: `The US Open introduced night sessions in 1975. No other Grand Slam has fully replicated what New York does with them. Wimbledon ends play by around 8pm. The French Open schedules a single evening session late in the tournament. The Australian Open has night sessions, but the culture around them is different. The US Open puts its best matches on at 7pm in the world's largest tennis stadium and runs until midnight or later. That's the product.

**What to expect**

Night session tickets are reserved seating in Arthur Ashe Stadium — they are not covered by a grounds pass and must be booked separately. The session begins at 7pm with the first of two scheduled matches, typically a men's and women's singles match in the early rounds scaling to quarterfinals and beyond in the second week. The second match of the night often starts at 9:30pm or later, and if it goes to five sets, you'll be leaving the stadium well past midnight.

The crowd that comes out for night sessions is different from the day session crowd. Earlier in the tournament, it skews younger, louder, more willing to be partisan. Later in the draw, when the biggest names are playing, the stadium fills with people who have been planning this evening for months.

**Booking**

Night session tickets go on sale through the US Open website, typically in the spring before the tournament. Early rounds cost less; second-week night sessions (when the matches are genuinely high-stakes) book out quickly. If you can only do one night session, target the second week when the draw has been reduced to the last 8 or 16 players and every match is consequential.

**After the match**

The 7 train runs late. Mets-Willets Point station handles the post-session crowd efficiently — the platforms fill but the trains come frequently. From there, Manhattan is 40 minutes and the Queens restaurant and bar options are open much later than the trains. Plan accordingly.`,
    whyItsSpecial: `The night session is the answer to the question "what makes the US Open different?" at every level: different from Wimbledon, different from the other Slams, different from any other live tennis experience. The match quality is deliberately maximised — the USTA schedules its best available matchups into prime time because that's what sells the session.

But the atmosphere is what people remember. The New York crowd at 10pm in Arthur Ashe during a close match is not restrained about it. People cheer, groan, argue with line calls out loud, make noise between first and second serves in ways that Wimbledon would never permit. All of it adds up to an energy that tennis, as a sport, doesn't usually produce — and the US Open has been cultivating and leaning into that energy for fifty years.

Book these tickets before you book anything else in your trip. Then build the rest of the plan around them.`,
  },

  {
    slug: "louis-armstrong-stadium-" + Date.now().toString(36),
    title: "Louis Armstrong Stadium",
    subtitle: "The second show court — where upsets happen, where the atmosphere is closer, and where the interesting tennis plays out",
    experienceType: "sports_venue",
    budgetTier: "moderate",
    availability: "event_only",
    neighborhood: "Flushing Meadows",
    moodTags: ["intimate", "atmospheric", "upsets", "electric"],
    interestCategories: ["tennis", "live sport"],
    editorialNote: "14,061 capacity. Retractable roof since 2018. Often better tennis than Ashe in the first week — top seeds vs lower-ranked opponents, upset potential high. Covered by grounds pass or reserved ticket.",
    specScoreSpecificity: 4, specScoreProvenance: 4, specScoreExceptionalism: 4, specScoreCurrency: 5,
    bodyContent: `Louis Armstrong Stadium is the US Open's second show court, with 14,061 seats and a retractable roof added in 2018. Named for the jazz musician who lived in nearby Corona, Queens, it sits adjacent to Arthur Ashe and shares the same blue hard court surface.

**Why Armstrong often beats Ashe**

Counter-intuitive but true: for many first-time US Open visitors, Louis Armstrong Stadium delivers a better experience than Arthur Ashe. The reasons are straightforward. The stadium is smaller, which means the crowd is closer to the court and the noise more focused. The matches scheduled there — typically seeds in the range of 8 to 20, or unseeded players who've made deep runs — are often more competitive and unpredictable than the Ashe matches where a top-3 seed is heavily favoured. And the tickets are more accessible, either as reserved seats or via grounds passes for outer court sessions.

The first week of the tournament is when Armstrong is at its best. Early round matches between top seeds and lower-ranked opponents, or the all-important third-round clashes where the draw starts to open up, frequently land on Armstrong. Pay attention to the schedule the night before — if there's a match between two players you recognise, Armstrong in the first week is where you want to be.

**The roof**

The roof closes automatically at 11pm or when weather requires it. Unlike Arthur Ashe's roof, which changed the acoustic of the stadium noticeably when it was first introduced, Armstrong's roof has been integrated long enough that play under cover feels normal. The change in light quality when the roof closes — the court going from evening natural light to full artificial — is one of the small pleasures of being there when it happens.

**Getting in**

Louis Armstrong Stadium matches are covered by reserved seating tickets (purchased in advance) or, for certain sessions, by grounds passes. Check the schedule: grounds passes give access to the stadium concourse and general seating areas, though specific reserved sections require a ticket. Gates open 90 minutes before the session begins.`,
    whyItsSpecial: `Louis Armstrong Stadium is where you go to watch tennis rather than to watch an event. The distinction matters. Arthur Ashe at night is a spectacle — 23,771 people watching the sport's biggest names on the world's biggest stage. Armstrong is closer, tighter, and more likely to contain a match that's actually in doubt.

The upsets that define US Opens — the high-seeded player who loses in four sets on a muggy Wednesday afternoon, the unseeded qualifier who's been grinding through the draw and suddenly finds themselves on a show court — happen disproportionately at Armstrong. The crowd there is also more knowledgeable; the tourists go to Ashe, and the people who know the draw are at Armstrong tracking the match they wanted to see.

If you have a grounds pass and the evening session at Ashe is sold out, Louis Armstrong is the correct backup. If you have time and want the better chance of witnessing something memorable, Armstrong in the first week is where to put your hours.`,
  },

  {
    slug: "us-open-practice-courts-" + Date.now().toString(36),
    title: "The Practice Courts at the US Open",
    subtitle: "Free with a grounds pass in the mornings — the closest you'll get to the world's best players before the sessions begin",
    experienceType: "fan_experience",
    budgetTier: "budget",
    availability: "event_only",
    neighborhood: "Flushing Meadows",
    moodTags: ["up-close", "relaxed", "morning", "insider"],
    interestCategories: ["tennis", "fan access", "early morning"],
    editorialNote: "Practice facility is separate from main courts — east side of the grounds. No reserved seating needed, just a grounds pass. Best 8am–11am before sessions start and heat peaks.",
    specScoreSpecificity: 5, specScoreProvenance: 4, specScoreExceptionalism: 4, specScoreCurrency: 5,
    bodyContent: `The US Open practice facility is on the eastern side of the USTA Billie Jean King National Tennis Center grounds, a short walk from Arthur Ashe Stadium. It has 12 practice courts and, during the first week of the tournament, you can stand at the fence within arm's reach of players ranked in the world's top 10 going through their pre-match routines.

**When to go**

Morning is the window. Arrive at the grounds when gates open (around 11am for day session grounds passes, but practice begins earlier — check the USTA schedule for practice facility opening times, typically 8am or 9am). The hour before the day session starts is when the most interesting practice activity happens: players warming up for that day's match, working on specific shots, finishing off their preparation. After noon, most of the practice courts clear out as the session has already started.

A grounds pass covers access to the practice facility without any additional ticket. The one advantage over the main stadiums is proximity — the practice courts have no fixed seating, so you stand at the fence and you are genuinely close to the court.

**What you'll see**

In the first week, expect to see players ranging from seeds 10 through 30 using the practice facility, alongside unseeded players and qualifiers. Top seeds (1–5) typically have designated practice times and courts that attract larger crowds, but the total practice facility crowd is much lighter than the main stadiums, and the access is proportionally better.

Doubles teams also practice here, often at times when singles players are in session. If you're interested in doubles, the practice facility is the best opportunity to watch the best players in that format up close.

**Practical notes**

Bring water — the practice facility courts are exposed, and August heat is direct. Shade is limited. Early morning is comfortable; by 11am it can be genuinely hot. A hat is not optional. The practice facility has no dedicated food concessions, but the main grounds concourse is a short walk.`,
    whyItsSpecial: `Practice court access at the US Open is better than any other Grand Slam. At Wimbledon, the practice facility at Aorangi Park is accessible but the AELTC limits close access carefully. At Roland Garros the practice areas are separated from the main crowds. The USTA has a relatively open policy — grounds pass, morning, the practice facility — that puts fans genuinely close to players in a setting that doesn't exist elsewhere at this level of the sport.

The experience is unglamorous in the best sense. No commentary, no crowd noise, no stakes — just players hitting serves and working on the shot pattern they're going to need against a specific opponent later that day. Watching that, close up, without the mediation of a broadcast, is a different kind of sports observation. It's where you see how good these players actually are without the match context to frame it.`,
  },

  {
    slug: "eating-at-the-us-open-" + Date.now().toString(36),
    title: "Eating at the US Open",
    subtitle: "More food diversity than any other Slam — because it's in New York, and the concourse reflects it",
    experienceType: "fan_experience",
    budgetTier: "moderate",
    availability: "event_only",
    neighborhood: "Flushing Meadows",
    moodTags: ["diverse", "casual", "celebratory", "only-here"],
    interestCategories: ["food", "tennis", "New York"],
    editorialNote: "The food at the grounds is genuinely diverse for a sporting event — dozens of vendors, cuisines from multiple countries, the Honey Deuce cocktail ($22) as the ritual item. Not cheap but considerably better than most tournament food.",
    specScoreSpecificity: 5, specScoreProvenance: 4, specScoreExceptionalism: 4, specScoreCurrency: 5,
    bodyContent: `The food at the US Open grounds is better than it has any right to be, and the reason is simple: it's in New York, and the city's food culture has influenced what the tournament serves. The main concourse inside the gates runs dozens of food and drink vendors covering cuisines that no other Grand Slam comes close to matching.

**The Honey Deuce**

The US Open has a signature cocktail: the Honey Deuce, served since 2007 at every session. It's Grey Goose vodka, lemonade, and raspberry liqueur, topped with three honeydew melon balls carved to look like tennis balls. It costs $22. It is thoroughly overpriced and absolutely worth ordering once for the ritual of it — the yellow melon balls, the pink colour, the fact that the US Open has essentially invented a signature drink that has become inseparable from the event. Around 10,000 are sold on busy days.

**What to eat**

The concourse vendors vary by year but consistently cover: pizza (New York style, by the slice), dumplings, tacos, Indian dishes, Japanese rice bowls, Korean fried chicken, burgers, and multiple dessert options including soft-serve and cheesecake. Prices are stadium prices — expect $15–25 for a main dish — but the quality is notably higher than equivalent stadium food elsewhere.

The food court areas in the middle of the grounds, between the main stadiums and the outer courts, are the best place to eat if you want to sit down. Tables there fill quickly during session breaks; arrive a few minutes before the natural break between matches.

**Alcohol and non-alcoholic options**

Beer and wine are served throughout the grounds. The Honey Deuce and other cocktails are available at dedicated bars. Non-alcoholic options include fresh-pressed lemonade (not from concentrate — genuinely good in the heat), iced coffee, and the standard range of soft drinks. Free water filling stations are positioned throughout the grounds; bring a refillable bottle.

**Timing**

Avoid the concessions in the 20 minutes before and after a session begins or ends. The queues during those windows are long and slow. Mid-match, when the crowd is in their seats, is when the concessions are fastest.`,
    whyItsSpecial: `Tournament food is usually an afterthought — overpriced, generic, volume-focused. The US Open is the exception that proves the rule. The diversity of what's available on the concourse reflects where the tournament is: a borough that takes food seriously, serving a crowd from all over the world, during an event that wants to feel like a New York occasion rather than just a tennis tournament.

The Honey Deuce is the specific thing worth doing. It costs too much, it's essentially a tourist item, and doing it anyway with 23,000 other people in Arthur Ashe Stadium is one of those shared rituals that makes a sporting event feel like more than a match. Order it once.`,
  },

  {
    slug: "when-play-stops-us-open-" + Date.now().toString(36),
    title: "When Play Stops",
    subtitle: "Heat delays, afternoon storms, and the specific drama of August weather in Queens — what happens and what to do",
    experienceType: "fan_experience",
    budgetTier: "free",
    availability: "event_only",
    neighborhood: "Flushing Meadows",
    moodTags: ["unpredictable", "atmospheric", "spontaneous"],
    interestCategories: ["tennis", "weather", "New York"],
    editorialNote: "Different from Wimbledon rain delays — heat policy unique to US Open, thunderstorms fast and violent in August. Covers what actually happens when play is suspended and how to use the time.",
    specScoreSpecificity: 4, specScoreProvenance: 4, specScoreExceptionalism: 3, specScoreCurrency: 5,
    bodyContent: `The US Open runs in August because that's when the US Tennis Association schedules it, and August in New York is not mild. The average high in Flushing in late August is 29°C; it routinely exceeds 35°C during the first week. Humidity compounds this. The USTA has an extreme heat policy — when the wet-bulb globe temperature on the outer courts exceeds the threshold, outdoor play is suspended for at least an hour.

**The heat policy**

The heat policy applies to outer courts only. Arthur Ashe and Louis Armstrong both have retractable roofs and climate control — they continue regardless. If you're in the main stadiums, a heat suspension affects the match only if it was already scheduled for an outer court. If you're on the outer courts when the policy is invoked, you have an hour or more to move to a shaded area, get food, or head inside.

The announcement is made over the public address system. It does not mean the session is cancelled — it means a temporary pause. Most heat suspensions in recent years have lasted 60–90 minutes.

**The afternoon storms**

More dramatic and less predictable than the heat: the August thunderstorms that roll in from the west across the East River. These arrive fast, sometimes with very little warning, and when they come they are serious — lightning, heavy rain, and zero visibility for 20–40 minutes, then clearing just as suddenly. The USTA's weather monitoring is advanced, and play is suspended before conditions become dangerous.

When an outdoor match is paused for rain and the roof courts are available, the USTA typically moves priority matches to Arthur Ashe or Louis Armstrong. If you're watching an outer court match that gets rained out, check the Ashe or Armstrong session schedule — your match may have moved rather than been cancelled.

**What to do during a delay**

The concourse stays open. The food vendors continue serving. Covered areas under the stadium structures can hold the crowd comfortably. The US Open app (free to download) shows real-time match status and revised schedules as they're announced. The delay is often when the better conversations happen — there's a specific social quality to a group of people waiting out a storm under the Arthur Ashe concourse, watching the lightning over Queens.`,
    whyItsSpecial: `Wimbledon's version of this is the rain delay — a British cultural ritual with its own rules (take cover, wait, watch the Henman Hill crowd scatter under the same umbrellas they brought knowing this would happen). The US Open version is hotter, louder, and more New York about it. Thunderstorms in August in Queens arrive without much apology and leave the same way.

The experience of being at the US Open when the weather turns is specific. The crowd doesn't disband — it reorganises. The concourse fills up, the umbrellas come out, people buy drinks and wait. There's a reason the US Open crowd has a reputation: it's New York, and New Yorkers don't leave because of the weather.`,
  },

  // ─── BEFORE YOU GO ───────────────────────────────────────────────────────────

  {
    slug: "the-7-train-to-flushing-" + Date.now().toString(36),
    title: "The 7 Train to Flushing",
    subtitle: "The subway route every US Open regular takes — 40 minutes from Midtown Manhattan, no transfers, drops you at the gates",
    experienceType: "transit",
    budgetTier: "free",
    availability: "event_only",
    neighborhood: "Jackson Heights / Flushing",
    moodTags: ["practical", "local", "immersive", "no-brainer"],
    interestCategories: ["transit", "New York", "practical"],
    editorialNote: "The 7 line (Flushing line) is the correct and only practical way to get to the US Open from Manhattan. Uber and taxis become nightmares near the venue. Simple, fast, cheap.",
    specScoreSpecificity: 5, specScoreProvenance: 5, specScoreExceptionalism: 3, specScoreCurrency: 5,
    bodyContent: `The 7 train runs from Hudson Yards on the far west side of Manhattan, along 42nd Street, through Times Square and Grand Central, then east under Queens Boulevard and finally elevated above the streets of Flushing, terminating at Main Street, Flushing. The US Open stop — Mets-Willets Point — is one stop before the end of the line and sits directly next to Citi Field, the Mets' stadium.

**The journey**

Board the 7 at any station between Hudson Yards and Queensboro Plaza. Times Square (7 at 42nd Street, accessible from multiple subway lines) is the busiest and most useful boarding point for most visitors. Grand Central (42nd Street and Park Avenue) works equally well. The journey takes around 38–42 minutes from Times Square, running express during rush hours and local at other times — the express skips several Queens stations but not Mets-Willets Point.

Exit at **Mets-Willets Point**. The platform is elevated and you'll see Citi Field directly to your right. Follow the signs — there's a clear walking path through the parking areas to the USTA complex. The walk takes around 10 minutes and is clearly marked; stay with the crowd.

**Why not Uber or taxi**

Traffic around Flushing Meadows during the US Open is serious. Roads that are typically clear become backed up as the session approaches, and the drop-off area near the venue can add 20–40 minutes to a journey that would have taken 15 minutes by subway. Ride-share surge pricing during sessions adds cost on top of the time penalty. The 7 train costs $2.90 regardless of demand, runs every few minutes, and deposits you closer to the gates than any car can.

**The return journey**

After the session ends, the platform fills quickly. Trains run frequently. The crowd is good-natured after a long day; people compare match notes on the platform and the ride back to Manhattan is social in the way that post-match public transit tends to be. If you're staying in Flushing, you exit at Main Street, the final stop — one more minute.

**The ride itself**

The 7 is worth noticing. It runs elevated through Queens for most of its length, and the view looking south from the elevated section — rooftops, the Citi Field stadium, the towers of Manhattan in the distance — is the specific view of New York you get from a subway, which is to say the real one. Jackson Heights, Woodside, Flushing pass under the train, each a different density and character. By the time you reach Mets-Willets Point you've had 40 minutes of Queens.`,
    whyItsSpecial: `The 7 train to the US Open is not just a practical instruction — it's part of how the tournament works. The pilgrimage quality of the ride, the way the train fills with people in tennis hats and carrying racket bags, the view of Citi Field as you pull in to Mets-Willets Point: it's the transition that marks you as arriving at something rather than just reaching a venue.

Every major New York sporting event has a correct way to travel to it that the locals know. For the US Open, the correct answer is the 7 train, and it has been the correct answer since the tournament moved to Flushing in 1978.`,
  },

  {
    slug: "preparing-for-us-open-" + Date.now().toString(36),
    title: "Preparing for Your US Open Visit",
    subtitle: "Tickets, heat, bag rules, and everything the USTA website buries — what to sort before you arrive",
    experienceType: "transit",
    budgetTier: "budget",
    availability: "event_only",
    neighborhood: "Flushing Meadows",
    moodTags: ["practical", "essential", "first-timer"],
    interestCategories: ["planning", "tennis", "practical"],
    editorialNote: "Covers tickets (grounds pass vs reserved), heat preparation, bag policy, what to bring. Structured as pre-trip logistics guide — the things first-timers get wrong.",
    specScoreSpecificity: 5, specScoreProvenance: 4, specScoreExceptionalism: 3, specScoreCurrency: 5,
    bodyContent: `**Tickets**

The US Open has two types of ticket:

*Grounds passes* give access to the entire USTA grounds — outer courts 4 through 17, the practice facility, all food and retail areas — but not reserved seating in Arthur Ashe or Louis Armstrong stadiums during sessions. They are the right ticket for people who want to move around, watch multiple matches, and spend time on the outer courts. In the first week of the tournament, grounds passes run around $40–$60 (prices vary by day and fluctuate). They go on sale at usopen.org and through the US Open app, typically in the spring.

*Reserved session tickets* get you a specific seat in Arthur Ashe or Louis Armstrong for a specific session (day or night). These are the tickets for the main stadium experience. Night session tickets in the second week — when the quarterfinals, semifinals, and finals are scheduled — book out months in advance. Day session tickets in the first week are more accessible but still sell out for popular matchups.

Both are available at usopen.org. Do not use secondary market platforms during peak demand without checking the official site first.

**Heat**

August in Flushing is hot and humid. The USTA has an extreme heat policy that can pause outdoor play on outer courts, but the sun and temperature are present regardless. Non-negotiable items:
- Sunscreen, applied before you arrive and carried to reapply
- A hat with a brim — the courts are exposed with no natural shade
- A refillable water bottle — free water stations are distributed throughout the grounds, and staying hydrated is practical, not optional
- Loose, light-coloured clothing — the dress code is casual; there's no Wimbledon white requirement

**Bag policy**

The USTA enforces a strict bag policy. Bags must be soft-sided and no larger than 12 inches × 16 inches × 8 inches. Hard-sided bags, backpacks over that size, and large coolers are not permitted. Collapsible reusable bags and smaller daypacks are fine. Security lines are managed well but move slower with large bags — the correct approach is a small bag and no surprises.

**What else to bring**

Layers for the evening — if you're staying for a night session, temperatures in August can drop noticeably after dark, and the stadium air conditioning (when the roof is closed) is cold. A portable phone charger is useful for a full day. The US Open app (free, iOS and Android) has real-time match scores, court assignments, and delay notifications — worth downloading before you arrive.

**Photography**

Point-and-shoot cameras and mobile phones are permitted anywhere on the grounds. Professional equipment (detachable telephoto lenses longer than 6 inches) is not. Video recording during matches is limited to personal use.`,
    whyItsSpecial: `The practical knowledge gap between a first US Open visit and a second one is significant. The first visit, people get the bag wrong at security, don't have sunscreen, buy overpriced water because they didn't bring a bottle, and find out the hard way that night session tickets sold out in February. The second visit, they have a grounds pass for the morning outer courts, reserved seats for the evening session, a hat, and a plan for the Honey Deuce.

This section exists to compress that learning. The US Open is a straightforward event to navigate once you know how it works — the USTA has invested heavily in the fan experience, the signage is clear, and the staff are helpful. The prep is the bit that most guides underweight.`,
  },

  // ─── WHERE TO EAT ────────────────────────────────────────────────────────────

  {
    slug: "flushings-golden-mall-" + Date.now().toString(36),
    title: "Flushing's Golden Mall",
    subtitle: "The basement food court at 41-28 Main St — authentic Chinese regional cooking fifteen minutes from the tournament gates",
    experienceType: "dining",
    budgetTier: "budget",
    availability: "event_adjacent",
    neighborhood: "Flushing",
    moodTags: ["authentic", "cheap", "local", "adventurous"],
    interestCategories: ["dining", "Chinese food", "food halls", "New York"],
    editorialNote: "41-28 Main St, Flushing. Verified open — reopened 2023 after major renovation. Basement food court, founded 1990. Lamb skewers, hand-pulled noodles, dumplings. Very cheap. The correct pre/post match meal from the Flushing side.",
    specScoreSpecificity: 5, specScoreProvenance: 4, specScoreExceptionalism: 4, specScoreCurrency: 5,
    bodyContent: `Golden Mall has been at 41-28 Main Street in Flushing since 1990. In that time it became one of the most written-about food destinations in New York, the subject of near-universal food writer consensus that it was one of the city's most honest and serious eating experiences. It closed for renovation in 2018, reopened in 2023 after a $2 million redesign, and is currently operating with around 18 vendors on the ground floor and basement.

The address is easy to miss — a doorway off Main Street, stairs leading down to a basement level. The cooking is Chinese, but Chinese is not a single cuisine: Golden Mall's vendors represent a specific concentration of regional cooking from Sichuan, Shanghai, Xi'an, and other Chinese provinces, plus a range of specialties that most American cities don't have access to.

**What to eat**

The lamb skewers — cumin-spiced, grilled to order — are probably the most recommended single item. Expect to wait briefly; they're prepared to order and the queue forms fast.

Xi'an-style cold noodles with chili oil are another fixture: hand-pulled, thick, served cold with a sauce that takes some adjustment if you're not used to the Sichuan pepper numbing quality.

Soup dumplings (xiaolongbao) from the Shanghainese vendors are delicate and serious — the technique required to make them well is considerable, and the versions here are made by people who have been doing it for years.

**How it works**

Golden Mall is a food court, not a restaurant — you order at individual stalls and find a table in the common dining area. Most vendors accept cash and card. Prices are low: a full meal with multiple dishes typically runs $15–25 per person. There's no tipping obligation; counter service throughout.

**Getting there**

Golden Mall is on Main Street, Flushing — the 7 train's final stop. From the Mets-Willets Point station (the US Open stop), it's a 5-minute subway ride to the last stop, then a 3-minute walk. The total detour from the tournament gates is around 20 minutes each way, making it a practical pre-match lunch or post-match dinner option.`,
    whyItsSpecial: `Golden Mall exists independently of the US Open and would be worth visiting without it. The tournament is what makes it relevant here — but the reason to go is not proximity, it's the food, and the food is genuinely among the best of its type available in New York.

The price makes it stranger still: the combination of cooking quality and cost at Golden Mall is not available at this level in most cities. A meal there for two people, eating generously across three or four dishes, costs around $30. The fact that it's 20 minutes from Arthur Ashe Stadium is the tournament's best-kept logistical secret.`,
  },

  {
    slug: "jackson-heights-food-mile-" + Date.now().toString(36),
    title: "Jackson Heights: The Food Mile",
    subtitle: "Roosevelt Avenue under the elevated 7 — South Asian, Latin American, and Tibetan food at neighbourhood prices",
    experienceType: "dining",
    budgetTier: "budget",
    availability: "event_adjacent",
    neighborhood: "Jackson Heights",
    moodTags: ["authentic", "diverse", "neighbourhood", "adventurous"],
    interestCategories: ["dining", "South Asian food", "Latin American food", "neighbourhood"],
    editorialNote: "Roosevelt Avenue, Jackson Heights. The neighbourhood's food scene — not a single restaurant but the whole corridor. Himalayan Yak (Tibetan), Birria-Landia (birria truck), Taqueria Coatzingo (Mexican), Dera Restaurant (Indian). 20 min on 7 train from US Open.",
    specScoreSpecificity: 5, specScoreProvenance: 4, specScoreExceptionalism: 4, specScoreCurrency: 5,
    bodyContent: `Jackson Heights is in central Queens, along the 7 train line between Flushing and Midtown Manhattan. Roosevelt Avenue — the main street that runs under the elevated subway tracks — is loud, dense, and one of the most rewarding streets in New York for eating. The noise of the 7 train overhead is constant. The food is not.

The neighbourhood is South Asian, Latin American, and Tibetan in roughly equal measure, with each community having established cooking that reflects what residents actually eat rather than what's been adapted for an outside audience. The prices follow: a full meal here costs what the neighbourhood pays, not what a tourist destination charges.

**What to eat and where**

*Himalayan Yak* at 72-20 Roosevelt Avenue is the most acclaimed Tibetan restaurant in Queens — which means, in practice, one of the best Tibetan restaurants in the United States. The momos (steamed dumplings, typically filled with beef or vegetable) and the thukpa (noodle soup) are the things to order.

*Birria-Landia* is a taco truck operation at Jackson Heights that produces birria tacos — slow-braised beef, corn tortilla, consumed with a small bowl of the braising consommé for dipping. The queue moves; it's worth joining.

*Taqueria Coatzingo* on 82nd Street is a longstanding neighbourhood Mexican restaurant with a menu leaning Pueblan — tacos, tortas, and combination plates that cost $10–15.

*Dera Restaurant* on 74th Street serves North Indian food with a thali (set plate) that is one of the better value meals in the neighbourhood — multiple dishes, rice, bread, around $15.

**How to use it**

Jackson Heights is a 20-minute ride on the 7 train from Mets-Willets Point (the US Open stop) — take the 7 toward Manhattan to the 74th Street-Broadway station. The food is concentrated in a six-block stretch of Roosevelt Avenue between 74th and 85th Streets, easy to walk in an hour. This works best as a pre-match dinner on a night session day (arrive at 5pm, eat, take the train back to Flushing in time for the 7pm start) or as a rest-day lunch exploration.`,
    whyItsSpecial: `Jackson Heights is not a restaurant strip curated for visitors. It's a working neighbourhood that happens to have several of the best representatives of its cuisines available anywhere in the city. The birria truck has a queue because people come from other boroughs specifically for it. The Tibetan restaurant at Himalayan Yak is real Tibetan cooking in a city that has very few places doing it well.

The food mile exists because the community exists. Eating there during the US Open isn't a tourist add-on — it's using the fact that you're in Queens, which is one of the most food-diverse places in the world, and it would be a waste not to.`,
  },

  // ─── WHERE TO STAY ───────────────────────────────────────────────────────────

  {
    slug: "where-to-stay-us-open-" + Date.now().toString(36),
    title: "Where to Stay for the US Open",
    subtitle: "Flushing, Long Island City, or Midtown Manhattan — the honest tradeoffs for each and what to book first",
    experienceType: "accommodation",
    budgetTier: "splurge",
    availability: "event_adjacent",
    neighborhood: "Flushing / Long Island City",
    moodTags: ["practical", "considered", "good value"],
    interestCategories: ["accommodation", "planning", "New York"],
    editorialNote: "No single hotel recommendation — guide format covering Flushing (walking distance, food access), LIC (2 stops on 7, better hotels, skyline views), Midtown (longer commute, better city experience). Book 3–6 months ahead.",
    specScoreSpecificity: 4, specScoreProvenance: 4, specScoreExceptionalism: 3, specScoreCurrency: 5,
    bodyContent: `The US Open runs for two weeks and hotels near Flushing Meadows fill months in advance. The question is not just which hotel but which neighbourhood to base yourself in — and the honest answer depends on what you want from the trip.

**Option 1: Flushing**

Flushing is the most convenient base. The hotels there are within a 15-minute walk of the USTA gates, the 7 train is at Main Street for everything else, and you're in the middle of the food ecosystem that makes this tournament distinctive. The neighbourhood itself — the largest Chinatown outside of China, per many accounts, with Taiwanese, Shanghainese, and other regional cooking concentrated along Main Street and Roosevelt — is worth being embedded in rather than commuting to.

The tradeoff: Flushing hotels are not characterful. They're newer, efficient, and built for the business traveller who ends up in Queens for a trade show at the convention centre. Expect clean rooms, functional service, and limited lobby or common area quality. The neighbourhood is what earns its place.

**Option 2: Long Island City**

Long Island City (LIC) is two stops on the 7 train from Mets-Willets Point, putting you 15–20 minutes from the tournament gates with a direct line and no transfer. The hotels here are newer, more design-forward, and often better value than equivalent Manhattan options. The neighbourhood has a different quality from Flushing — more residential and post-industrial, with waterfront parks that look directly at the Midtown Manhattan skyline.

For a US Open trip where you want convenience to the tournament plus a more interesting base than a Flushing business hotel, Long Island City is the strongest option.

**Option 3: Midtown Manhattan**

The obvious choice for visitors combining the US Open with a broader New York trip. Times Square, Grand Central, and the hotels nearby are all 38–42 minutes on the 7 train from Mets-Willets Point — workable, but that's 80 minutes of transit for each full day at the tournament. For a two- or three-session visit where you're also spending time in the city, Manhattan makes sense. For a dedicated tournament trip, the commute accumulates.

**Booking timing**

US Open hotels — particularly in Flushing — book out 3–6 months ahead of the tournament. If you're planning to attend during the second week (quarterfinals onward), assume high demand and book as soon as your dates are confirmed.`,
    whyItsSpecial: `The accommodation decision for the US Open is more consequential than for most sporting events because the neighbourhood matters. Staying in Flushing means you're in the food scene; staying in LIC means you're in a genuinely interesting part of New York that most visitors don't see; staying in Midtown means you're doing New York and happening to go to some tennis.

All three are reasonable choices depending on what you're optimising for. This section is designed to prevent the default Midtown booking that leaves you with an 80-minute daily commute when 20 minutes was available.`,
  },

  // ─── THE NEIGHBOURHOOD ───────────────────────────────────────────────────────

  {
    slug: "flushing-meadows-corona-park-" + Date.now().toString(36),
    title: "Flushing Meadows-Corona Park",
    subtitle: "The 1,255-acre park that contains the US Open — the Unisphere, the Queens Museum, and New York's August in full",
    experienceType: "neighborhood",
    budgetTier: "free",
    availability: "event_adjacent",
    neighborhood: "Flushing Meadows",
    moodTags: ["exploratory", "open", "cultural", "New York"],
    interestCategories: ["parks", "culture", "architecture", "neighbourhood"],
    editorialNote: "The park context for the US Open — Unisphere (1964 World's Fair), Queens Museum, Citi Field at north end. Worth exploring on match day (free) or rest day. August park atmosphere is genuine Queens.",
    specScoreSpecificity: 4, specScoreProvenance: 4, specScoreExceptionalism: 3, specScoreCurrency: 5,
    bodyContent: `Flushing Meadows-Corona Park covers 1,255 acres in the middle of Queens. It's the largest park in the borough, the fourth largest in New York City overall, and the venue for two World's Fairs (1939 and 1964). It also contains the USTA Billie Jean King National Tennis Center, Citi Field (home of the New York Mets), the Queens Museum, and the New York Hall of Science. The US Open occupies a corner of it, but the park is significantly larger than the tournament footprint.

**The Unisphere**

The Unisphere is the 12-story steel globe that has been standing in the middle of the park since the 1964 World's Fair. It's the largest representation of the Earth ever built — 140 feet in diameter, 700,000 pounds of stainless steel — and visible from across the park and from the 7 train as it approaches the station. Up close, the scale of it is genuine: the rings represent satellites and orbital paths, and the continents are rendered in sufficient detail that you can trace coastlines.

It's free to walk around and photograph. In August, the fountains at its base run during park hours. It's the clearest piece of evidence that Flushing Meadows has a story independent of the tennis tournament happening in one corner of it.

**Queens Museum**

The Queens Museum (Queens Museum of Art until 2013) sits in the park and contains the Panorama of the City of New York — a 9,335-square-foot scale model of every building in all five boroughs, updated periodically, lit to show the time of day. It was built for the 1964 World's Fair and remains one of the stranger and more impressive things in any museum in the city.

The museum is open Wednesday through Sunday, closed Monday and Tuesday. Suggested admission is $10.

**The park in August**

On a warm August weekend afternoon, Flushing Meadows-Corona Park is in full summer operation: families with coolers, cricket matches on the lawn, radio-controlled boats on the Meadow Lake, people taking photos of the Unisphere. The park population during US Open fortnight is genuinely mixed — tournament visitors, Queens families having a weekend in the park, Mets fans coming in early — and the atmosphere is unmistakably New York.`,
    whyItsSpecial: `The park makes the tournament bigger than a tennis event. You can walk from the outer courts of the USTA grounds into Flushing Meadows proper, past the Unisphere and along the lake, and the transition from tournament to city is seamless and immediate. The 1964 World's Fair infrastructure that surrounds you — the Unisphere, the Queens Museum, the pavilion buildings that have been converted to other uses — is the residue of a New York that had a specific idea of what the future would look like. The tennis tournament is a more recent addition to that history.`,
  },

  {
    slug: "queens-a-day-beyond-the-courts-" + Date.now().toString(36),
    title: "Queens: A Day Beyond the Courts",
    subtitle: "A rest-day plan across Queens — Astoria, Long Island City, Jackson Heights, and the view of Manhattan from the east",
    experienceType: "day_trip",
    budgetTier: "budget",
    availability: "event_adjacent",
    neighborhood: "Astoria / Long Island City / Jackson Heights",
    moodTags: ["exploratory", "local", "relaxed", "cultural"],
    interestCategories: ["day trip", "neighbourhood", "culture", "food"],
    editorialNote: "Rest-day Queens itinerary — Astoria (Greek food, neighbourhood), LIC (MoMA PS1, waterfront views), Jackson Heights (food mile). All connected on the 7 and N/W trains. Genuinely interesting borough independent of tennis.",
    specScoreSpecificity: 5, specScoreProvenance: 4, specScoreExceptionalism: 3, specScoreCurrency: 5,
    bodyContent: `Queens is the most ethnically diverse urban area in the world, by most counts. Over 160 languages are spoken in the borough. The food, the street life, and the neighbourhood character vary dramatically within a few subway stops. A rest day in Queens — a day not spent at the tennis — is worth organising around that variety rather than around Manhattan landmarks.

The 7 train and the N/W lines are your spine. Everything described here is on or near those routes.

**Morning: Astoria**

Take the N or W train (from Midtown Manhattan or from the 7 via transfer at Queensboro Plaza) to Astoria. The neighbourhood is the centre of New York's Greek community, with a stretch of tavernas, coffee shops, and fish restaurants along Ditmars Boulevard and 31st Street that have been there long enough to be genuinely established rather than trend-driven.

The coffee shops on Ditmars are the best starting point — Greek-style strong coffee, pastries, table service, no rush. Breakfast in Astoria on a weekday morning is relaxed in a way that most of New York is not.

From Astoria, the waterfront along Astoria Park gives you the best view of the Hell Gate Bridge and the East River, with Manhattan visible across the water. The park itself is large, well-maintained, and almost always quieter than equivalent Central Park areas.

**Midday: Long Island City**

Two stops on the N/W from Astoria, Long Island City is the closest Queens neighbourhood to Midtown Manhattan — you can see the skyline from the waterfront in detail that makes you realise how close you actually are.

MoMA PS1 (46-01 21st Street) is the contemporary art annex of the Museum of Modern Art, in a converted public school building in LIC. Admission is $10 for non-MoMA members (free Thursdays 3–8pm). The summer Warm Up series (Saturdays, outdoor, music-focused) runs through August — worth checking the schedule before you go.

The LIC waterfront — Gantry Plaza State Park — is free, has excellent views, and is where the neighbourhood comes to sit in the afternoon. The old Pepsi-Cola sign (a neon landmark visible from Manhattan) is at the north end.

**Late afternoon: Jackson Heights**

Back on the 7 from Queens Plaza toward Flushing, exit at 74th Street-Broadway for Jackson Heights. This is the food mile covered in the separate experience — Roosevelt Avenue, the Tibetan and Indian and Mexican and Colombian corridor that runs under the elevated tracks. Late afternoon is when the street vendors are at full operation, the bakeries and sweet shops are busy, and the full range of the neighbourhood's food is accessible.

**Getting back**

The 7 train from Jackson Heights toward Flushing connects to Mets-Willets Point for the tournament, or continues to Main Street Flushing if that's your base. The direct ride from 74th Street-Broadway to Times Square is around 25 minutes if you're returning to Midtown Manhattan for the evening.`,
    whyItsSpecial: `The default day in New York is Manhattan. The US Open is one of the better reasons to spend a day in Queens instead — not because the tournament demands it, but because the borough is worth it and the tournament gives you a reason to already be there.

Astoria, LIC, and Jackson Heights are three very different neighbourhoods within 30 minutes of each other on the subway, and each one is the kind of place that takes multiple visits to understand. A rest day during the US Open is the right occasion for one of those visits. The tennis will still be there tomorrow.`,
  },
];

let count = 0;
for (const exp of EXPERIENCES) {
  await db.insert(experiences).values({
    destinationId: NY,
    sportingEventId: eventId,
    status: "in_review",
    curationTier: "editorial",
    lastVerifiedDate: "2026-04-28",
    ...exp,
  });
  console.log(`✓ ${++count}/13  ${exp.title}`);
}

console.log("\nAll 13 US Open experiences seeded (in_review).");
await client.end();

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const updates = [
  {
    title: "Arthur Ashe Stadium",
    insiderTips: [
      "Night session tickets are a separate purchase from grounds passes — they do not include each other. Buy the night session first; everything else builds around it.",
      "The stadium runs two full sessions daily. Day sessions (from ~11am) are calmer and cheaper. Night sessions (7pm) are what the US Open is actually known for — book those.",
      "Hawk-Eye challenge replays are shown to the crowd on the end screens. The collective lean-in when a close call is challenged is one of the specific pleasures of the venue — sit in a position where you can see both screens.",
      "Arrive 30 minutes before the session to get food and find your seat without rushing. The concessions ring all four levels; you don't need to go far.",
      "If the retractable roof starts to close, stay in your seat. Play continues and the atmosphere shifts — the stadium becomes noticeably louder once sealed. Leaving is almost always the wrong call.",
      "Upper levels have excellent sight lines at a steeper angle. For a first visit, mid-level is the sweet spot; don't pay a large premium for the lower bowl unless proximity to the court is specifically what you want.",
    ],
    whatToAvoid: `Don't confuse day and night session tickets — they're separate purchases with different pricing, and the night session is not an upgrade path from a day session. Don't buy from resellers near the venue gates; the USTA official site (usopen.org) is the correct source, and secondary market prices near the gates are sharply inflated on busy session days. Don't leave if weather interrupts play — the roof closes in under ten minutes and the match continues. And don't skip the Hawk-Eye screens when a player challenges a call; the crowd reaction is a specific Arthur Ashe moment that doesn't translate to broadcast.`,
  },

  {
    title: "The Night Sessions",
    insiderTips: [
      "Tickets go on sale in spring via usopen.org — second-week night sessions (quarterfinals, semifinals) sell out fastest. Set an alert for the general sale date.",
      "The second match of the night starts late, often 9:30pm or after. If a fifth set is in play, midnight is not unusual. Factor this into transport planning before you book.",
      "Bring a layer. Arthur Ashe air conditioning when the roof is closed is cold, especially in the upper levels after an hour in the heat outside. The temperature contrast surprises people.",
      "The 7 train runs late enough to handle post-session crowds — trains are frequent after sessions end and the crowd spreads across several trains. No need to bolt for the exit on the last point.",
      "Order of play for night sessions is announced around 6pm the evening before. Check the US Open app at that point — you'll know exactly who's playing before you leave your hotel.",
      "If your session runs late and you're in Flushing, the food options on Main Street stay open much later than you might expect — the neighbourhood doesn't follow early-closing Manhattan hours.",
    ],
    whatToAvoid: `Don't book last transport if you're staying for the second match — it will regularly run past midnight, and the worst part of the US Open experience is watching the end of a close set while watching the time. Don't assume early-round night sessions are lower quality; the USTA schedules its best available matchups for prime time regardless of round, and a third-set tiebreak at 10pm with 23,000 people in the building is not a consolation experience. And don't book upper-level seating as a budget shortcut if you're choosing only one night session; mid-level is the correct choice for the night session specifically — the atmosphere at height is thinner.`,
  },

  {
    title: "Louis Armstrong Stadium",
    insiderTips: [
      "Check the schedule the evening before — if two players you recognise are on Armstrong in the first week, that's where the interesting tennis is. The seeds ranked 8–20 play here, and the upset rate is higher than Ashe.",
      "Grounds passes cover access to the Armstrong concourse and certain general seating sections during some sessions. Check which session type your pass covers before assuming you need a reserved ticket.",
      "The retractable roof has been there since 2018 and is now routine — play continues through rain without the drama. Weather is not a reason to avoid Armstrong the way it might have been before the roof.",
      "Queues at Armstrong are lighter than Ashe. Arriving 20 minutes before a match starts is generally enough; you won't need the 45-minute buffer you'd allow for Arthur Ashe on a busy session day.",
      "The acoustics in Armstrong are tighter than in Ashe — the crowd noise is more focused and the court feels closer. If you want to hear the match as well as see it, Armstrong in the first week beats Ashe.",
    ],
    whatToAvoid: `Don't treat Armstrong as a backup to Arthur Ashe. In the first week of the tournament, the tennis on Armstrong is frequently more competitive and more uncertain than the matches scheduled on the main court. The biggest upsets in US Open history have disproportionately happened on Armstrong, and the crowd there — generally more knowledgeable, lighter on first-time visitors — reacts accordingly. Don't leave after the first match if a second is on schedule; session tickets cover both matches and the second one is often the better draw.`,
  },

  {
    title: "Morning at the Practice Facility",
    insiderTips: [
      "The practice facility is on the eastern side of the USTA grounds — a separate area from the main stadiums. Allow 10 minutes to walk there from the gates and orient yourself.",
      "The window is 8am to 11am. By noon, most players have moved to warm up for the day session and the courts clear out. An early grounds pass or arriving with the gate opening is the right approach.",
      "The USTA publishes a practice schedule the evening before on the US Open app. Player assignments change based on the next-day match schedule — check it the night before rather than hoping to find your preferred player by walking around.",
      "There are no fixed seats at the practice courts — you stand at the fence. Spots at the front rail fill fast on courts with top-10 players. For courts numbered 8–12 with mid-ranked seeds, you can often walk straight to the front.",
      "Doubles teams practice here when singles players are in session. If you follow doubles, the practice facility is your best access point — the crowd is lighter and the proximity is excellent.",
      "Bring water and a hat. The facility courts have no shade structures and are fully exposed. By 10:30am in August the heat is already direct.",
    ],
    whatToAvoid: `Don't arrive expecting top-3 seeds to be uncrowded — the biggest names attract a significant following even at practice, and the front rail fills early. Don't come at noon; the interesting window closes as the day session approaches. Don't ignore the secondary courts where unseeded and lower-seeded players are working — the technique is visible at close range in a way it isn't on the main show courts, and there are no crowds competing for your view. And don't assume practice is a watered-down version of the main event — watching a player work on a specific shot pattern they're going to need in three hours, at arm's reach, is a different quality of sports observation.`,
  },

  {
    title: "The Food Concourse at Flushing",
    insiderTips: [
      "Avoid the concessions in the 20 minutes before and after a session starts or ends. The queues during those windows are long and slow. Mid-match is when the concourse is fastest.",
      "The Honey Deuce ($22, Grey Goose and lemonade with honeydew melon balls) is overpriced and worth ordering once — ideally inside Arthur Ashe for the full effect of drinking the US Open's signature cocktail surrounded by 23,000 people.",
      "Free water filling stations are distributed throughout the grounds. Bring a refillable bottle; skip the $8 bottled water.",
      "The tables in the central plaza between the main stadiums and the outer courts fill quickly at session breaks. If you're eating a full meal, claim a table a few minutes before the natural break, not after.",
      "Freshly pressed lemonade (not from concentrate) is one of the better non-alcoholic options in the heat — it appears at multiple vendors and is considerably better than anything equivalent at most sporting venues.",
      "The vendors closest to the outer courts are less crowded than the main concourse food court and often quicker for a quick bite between sessions.",
    ],
    whatToAvoid: `Don't try to eat a sit-down meal in the 30 minutes before a session — the timing almost always gets tight, and eating standing up under pressure is not the correct US Open experience. Don't overlook the smaller vendors toward the outer courts, which are less crowded and faster than the central food court area during peak session changeover. If you're drinking, pace it in the August heat — a glass of rosé in the sun at 2pm followed by stadium seating is a faster combination than it seems. And don't pay $8 for a bottle of water when the free filling stations are signed throughout the grounds.`,
  },

  {
    title: "When Play Stops",
    insiderTips: [
      "Download the US Open app before you arrive. It shows real-time court status and revised match assignments — if your match has moved from an outer court to Arthur Ashe or Armstrong due to weather, the app tells you before the PA does.",
      "When the heat policy is invoked, check whether your match has moved to a roofed stadium rather than assuming it's postponed. The USTA often relocates priority matches rather than delaying them.",
      "The concourse stays open during all weather delays and the food vendors continue serving. A rain delay is one of the better times to eat — the queues are shorter and you're already sheltered.",
      "Afternoon thunderstorms in August typically arrive from the west between 2pm and 6pm. If the sky to the west is dark at lunchtime, check the forecast before heading to an exposed outer court for the afternoon session.",
      "The heat suspension affects outer courts only. Arthur Ashe and Louis Armstrong are air-conditioned with retractable roofs and are unaffected — if you're in the main stadiums, a heat policy announcement is not your problem.",
      "Stay in your seat when rain starts. USTA staff are efficient, suspension announcements come quickly, and the return to play after a storm often has the specific atmosphere of a crowd that's relieved and ready.",
    ],
    whatToAvoid: `Don't leave the grounds when weather turns — delays resolve faster than they seem, and the atmosphere on the concourse during a storm (people comparing notes, eating, watching the lightning over Queens) is one of the accidental social pleasures of the event. Don't assume a heat suspension cancels the day; it pauses outdoor play for a defined period, typically 60–90 minutes, and the main stadiums continue regardless. Don't get stranded without the US Open app — the PA system covers the grounds but revised schedules and court moves are posted on the app faster than any other channel.`,
  },

  {
    title: "The 7 Train to Flushing",
    insiderTips: [
      "Board at Times Square (42nd Street) or Grand Central (42nd Street and Park Avenue) for the most convenient join. Both are on the 7 line and have frequent service.",
      "The express 7 runs during peak hours and skips several Queens stations but still stops at Mets-Willets Point. Take it when available — it saves 5–8 minutes.",
      "Allow 50–55 minutes total from Times Square to the USTA gates: 38–42 minutes on the train plus a 10-minute walk from the platform to the entrance.",
      "You can tap a contactless credit or debit card directly at the turnstile (OMNY system) — no MetroCard needed. The fare is $2.90 each way.",
      "The return platform fills quickly after sessions end but trains are frequent. Don't sprint out of the stadium on the last point to catch a train — the next one is 3–4 minutes behind it.",
      "If you're staying in Flushing, stay on the train one more stop to Main Street — that's the neighbourhood, not the USTA stop. Mets-Willets Point is for the tournament; Main Street is for everything else.",
    ],
    whatToAvoid: `Don't take a taxi or ride-share on session days. Traffic around Flushing Meadows in the hour before and after sessions is serious, and ride-share surge pricing during peak demand compounds the cost. The 7 train costs $2.90, runs every few minutes, and deposits you closer to the gates than any car can reach. Don't exit at Main Street Flushing instead of Mets-Willets Point thinking it's closer to the tournament — it's not; Mets-Willets Point is the correct stop and the walk from there is straightforward. And don't wear headphones for the whole ride — the elevated section through Queens, with Citi Field and eventually the USTA complex visible out the window, is the arrival sequence that tells you you're actually going to the US Open.`,
  },

  {
    title: "The US Open Briefing",
    insiderTips: [
      "The bag size limit is 12 inches × 16 inches × 8 inches, enforced at security. Pack a smaller bag than you think you need and check the measurement before you leave your hotel — a rejected bag at the front of the security line costs everyone time.",
      "Download the US Open app before leaving your hotel. It has live court assignments, match schedules, and delay notifications — the most useful single tool for navigating the day.",
      "Grounds passes and reserved session tickets are completely separate purchases. A grounds pass does not get you into Arthur Ashe or Louis Armstrong reserved seating. A session ticket does not cover the outer courts without the grounds pass component — read the ticket description carefully.",
      "Apply sunscreen before you arrive and carry it for reapplication. The outer courts and practice facility are fully exposed, and the August sun in Flushing is direct from mid-morning onwards.",
      "The US Open website (usopen.org) is the correct source for tickets. During peak demand, third-party sites list above face value. Check the official site first.",
      "Layers matter if you're staying for a night session. Arthur Ashe with the roof closed is cold — the air conditioning in a sealed 23,000-person stadium is aggressive, especially if you've been sitting in 32°C heat outside all day.",
    ],
    whatToAvoid: `Don't arrive at the gates with a bag that hasn't been size-checked — the inspection is consistent and a non-compliant bag means going back to wherever you came from. Don't assume the order of play is fixed; it's announced around 6pm the evening before, and checking the app that evening is how you know what you're actually watching the next day. Don't confuse the two ticket types (grounds pass vs reserved session) and end up at the wrong gate for the wrong area — the distinction is clearly labelled on the ticket but easy to overlook when buying in a hurry. And don't buy bottled water on the grounds; the free filling stations make it unnecessary.`,
  },

  {
    title: "Flushing's Golden Mall",
    insiderTips: [
      "Arrive before noon or between 2pm and 4pm to avoid the main lunch rush at the most popular stalls — the lamb skewer queue in particular forms fast and moves slowly.",
      "Most vendors now accept card, but cash is still faster at several stalls. Have both options ready.",
      "Order across multiple stalls rather than committing to one — this is a food court, not a restaurant. A full meal built from three or four different vendors is the correct approach.",
      "The basement level has more seating than the ground floor. Check down there before hovering for a table near the stairs.",
      "The entrance is easy to miss — a doorway off Main Street with stairs leading down. The address is 41-28 Main Street; look for the sign above the stairs, not a prominent shopfront.",
      "From the US Open stop (Mets-Willets Point), take the 7 one more stop to Main Street Flushing — total travel time under 10 minutes from the USTA gates.",
    ],
    whatToAvoid: `Don't come expecting a moderated version of Chinese food. The cooking here is regional and specific — Sichuan pepper numbness, cumin-heavy lamb, cold vinegary noodles — and it is not adjusted for people who aren't used to it. That is the point. Don't skip it because the entrance looks unassuming; the doorway and stairs are not what you're going for. Don't try to eat a single dish and consider the visit complete — the format is designed for exploring across multiple stalls, and committing to one vendor means missing the breadth of what's available. And don't come on a full stomach.`,
  },

  {
    title: "Jackson Heights: The Food Mile",
    insiderTips: [
      "Late afternoon (4–7pm) is when the street vendors and bakeries are at full strength. This is the best time to walk Roosevelt Avenue — the evening food corridor is more active than the lunch hour.",
      "Birria-Landia operates a truck at a fixed Jackson Heights location but occasionally moves. Check their Instagram the morning of your visit to confirm the spot before making a detour for it specifically.",
      "Himalayan Yak (72-20 Roosevelt Avenue) is full table service and worth arriving slightly before peak dinner — 5:30pm avoids the worst of the queue and they don't typically take reservations.",
      "The food corridor runs between 74th and 85th Streets on Roosevelt Avenue — walk the whole stretch before deciding where to eat rather than stopping at the first stall.",
      "The 74th Street-Broadway station exit on Roosevelt Avenue drops you directly into the food corridor. Take the 7 from Mets-Willets Point toward Manhattan and exit here — it's a 20-minute ride.",
      "This works best as a pre-match dinner on a night session day: arrive at 5pm, eat for 90 minutes, take the 7 back to Flushing in time for the 7pm start.",
    ],
    whatToAvoid: `Don't mistake the stretch north of 74th Street for the main event — the best concentration is between 74th and 85th. Don't go to Birria-Landia if you're in a hurry; it's to-order cooking and the queue is real. Don't skip Himalayan Yak because Tibetan food is unfamiliar — the momos and thukpa are among the better reasons to be in Jackson Heights, and the restaurant is one of the few in New York doing this cuisine seriously. And don't come on a full stomach expecting to limit yourself to one dish.`,
  },

  {
    title: "Where to Stay for the US Open",
    insiderTips: [
      "Flushing hotels book out 3–6 months ahead of the tournament. When your session tickets are confirmed, book accommodation the same week.",
      "Long Island City (two stops on the 7 from Mets-Willets Point) has newer, more design-forward hotels than Flushing at comparable prices — it's worth comparing the two before defaulting to Flushing.",
      "If staying in Midtown, build in 80 minutes of daily transit time (40 min each way) before planning a full tournament day. It's manageable for a short trip but accumulates over five days.",
      "The Flushing food scene — Golden Mall, the Main Street food corridor, the congee and soup dumpling places along Roosevelt Avenue — is part of the value of staying there. It's not just proximity.",
      "Check your session type (day vs night) before deciding where to stay. Night session attendees often prefer walking from Arthur Ashe to a Flushing hotel at midnight rather than taking the subway; day session visitors may find Midtown more practical.",
    ],
    whatToAvoid: `Don't default to a Midtown hotel without calculating the 7-train journey time first. The commute is workable but it adds up over a tournament trip and Long Island City offers a much shorter connection at comparable cost. Don't leave hotel booking until 6–8 weeks before the tournament — by then, options near the venue are limited and prices are noticeably higher. And don't stay in Flushing purely for transit convenience without factoring in the neighbourhood; the food ecosystem around Main Street is what makes Flushing a worthwhile base rather than just a logistical choice.`,
  },

  {
    title: "Flushing Meadows-Corona Park",
    insiderTips: [
      "The Unisphere fountains run during park hours in summer — the best time to be there is morning before the heat peaks. The scale of the structure is genuinely surprising up close.",
      "The Queens Museum is closed Monday and Tuesday. Check before planning a rest-day visit that centres on it.",
      "The walk from the USTA grounds exit to the Unisphere takes about 5 minutes. It's a genuine change of pace from the tournament — quiet, open, and immediately different in character.",
      "Citi Field is at the north end of the park. If the Mets are playing during your US Open visit, the park has a dual-event atmosphere that's specific to this corner of Queens.",
      "The Panorama of the City of New York in the Queens Museum — a 9,335-square-foot scale model of every building in the five boroughs — is one of the stranger and more impressive things in any museum in New York. Budget 30 minutes for it.",
    ],
    whatToAvoid: `Don't underestimate the park's scale — it's 1,255 acres and the sections of interest are spread across it; pick a specific destination (Unisphere, Queens Museum, Meadow Lake) rather than wandering and ending up nowhere in particular. Don't plan a Queens Museum visit on Monday or Tuesday. And don't skip the park entirely because you came for the tennis; the World's Fair infrastructure around you — the Unisphere, the pavilion buildings, the views across the lake — is worth 30 minutes and costs nothing. The tournament is in one corner of it. The rest of it is free and mostly empty.`,
  },

  {
    title: "Queens: A Day Beyond the Courts",
    insiderTips: [
      "Start in Astoria (N or W train from Midtown, or transfer from the 7 at Queensboro Plaza) and work eastward toward Jackson Heights as the day progresses — the logistics flow better in that direction.",
      "MoMA PS1 is closed Tuesday and Wednesday. The free Thursday evening (3–8pm) is worth prioritising if your rest day falls then.",
      "The Astoria waterfront park (Astoria Park) has the best view of the Hell Gate Bridge and the East River — take 30 minutes there before heading to Long Island City. It's routinely quieter than most Manhattan viewpoints that charge for the equivalent.",
      "Warm Up at MoMA PS1 runs Saturday afternoons through August — outdoor, music-focused, and one of the better things in Queens in summer. If your rest day is a Saturday, it changes the LIC plan.",
      "Jackson Heights is most active in the late afternoon. Time your arrival there for 4pm or later to get the street vendors and bakeries at full operation.",
      "The 7 train elevated section between Jackson Heights and Flushing Meadows runs above the Queens rooftops with a clear view south. Stay on the upper deck and look out the windows.",
    ],
    whatToAvoid: `Don't try to do all three neighbourhoods and a tournament session on the same day. This is a rest-day itinerary, and what makes it work is that it's unhurried — a morning in Astoria at a table in a Greek coffee shop is not a thing you can compress into 40 minutes. Don't plan the MoMA PS1 visit for Tuesday or Wednesday. And don't go to Jackson Heights before 3pm expecting the street food corridor to be at full strength; it builds through the afternoon and the evening is when it's worth the visit.`,
  },
];

let updated = 0;
for (const { title, insiderTips, whatToAvoid } of updates) {
  const result = await db
    .update(experiences)
    .set({ insiderTips, whatToAvoid })
    .where(eq(experiences.title, title))
    .returning({ id: experiences.id, title: experiences.title });

  if (result.length) {
    console.log(`✓ ${title}`);
    updated++;
  } else {
    console.log(`✗ NOT FOUND: ${title}`);
  }
}

console.log(`\n${updated}/13 experiences updated.`);
await client.end();

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const US_OPEN_2026_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9";

function readMinutes(body) {
  const wordCount = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(wordCount / 225));
}

const articles = [
  {
    slug: "arthur-ashe-man-behind-tennis-biggest-stadium",
    title: "Arthur Ashe — The Man Behind Tennis's Biggest Stadium",
    sport: ["tennis"],
    sportingEventId: US_OPEN_2026_ID,
    contentCategory: "history",
    excerpt: "Arthur Ashe won the first US Open in 1968 as an amateur soldier, then spent the rest of his life fighting battles that had nothing to do with tennis. The stadium that carries his name opened four years after he died.",
    bodyContent: `Arthur Ashe won the first US Open in 1968 and never saw a cent of the prize money. He was still an amateur — an Army lieutenant, technically, drawing a per diem as a member of the U.S. Davis Cup team — so the $14,000 winner's check went to the runner-up, Tom Okker, instead. Ashe beat him anyway, in five sets, 14-12, 5-7, 6-3, 3-6, 6-3, in front of 7,100 spectators at the West Side Tennis Club. He was the first Black man ever to win a Grand Slam singles title.

## A win that outgrew the scoreline

The 1968 US Open final happened at the height of the civil rights movement, and Ashe's win read as something larger than a tennis result whether he wanted it to or not. He'd go on to win the Australian Open in 1970 and Wimbledon in 1975 — the only Black man in history to win all three — but 1968 was the one that changed what the sport's ceiling looked like.

Off the court, Ashe kept choosing the harder fight. In 1973, he became the first Black professional tennis player to compete in South Africa's national championships, and he used the platform to say, in public, that he would not play in front of a segregated crowd. Ten years later, he co-founded Artists and Athletes Against Apartheid with Harry Belafonte, pushing for the sanctions that eventually helped isolate the South African government internationally. This wasn't a retired athlete dabbling in causes — Ashe was still ranked, still playing, when he started doing this.

## The diagnosis he didn't choose to make public

In 1988, doctors operating on Ashe for an unrelated brain infection discovered he was HIV-positive. He is believed to have contracted the virus from a blood transfusion during heart bypass surgery five years earlier, in an era before blood banks screened for it. Ashe kept the diagnosis private for years, on his own terms, until a USA Today reporter contacted him in April 1992 to confirm a story they were about to run. He called a press conference the next day rather than let someone else announce it for him.

What followed was, by most accounts, the last chapter of his life spent exactly the way the first chapters had been: choosing the fight nobody was making him take. Ashe became one of the most visible HIV/AIDS advocates in the country, founding the Arthur Ashe Foundation for the Defeat of AIDS and addressing the United Nations General Assembly on World AIDS Day, 1992. "We want to be able to look back and say to all concerned that we did what we had to do, when we had to do it, and with all the resources required," he told the assembly. He died two months later, on February 6, 1993, of AIDS-related pneumonia. He was 49.

## A stadium that opened after he was gone

Arthur Ashe never played a match in the stadium that bears his name. The USTA opened it in 1997, four years after his death, as the new home of the US Open — at 23,771 seats, still the largest tennis stadium in the world. It's louder now than anything Ashe played in during his career: night sessions, a retractable roof, a crowd built for spectacle. None of that was really the point of naming it after him. The point was that the loudest room in tennis carries the name of a man who spent his career, and the rest of his life, insisting the sport account for more than just what happened on the court.`,
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    status: "in_review",
    editorialNote: "Sources: CNN 'How Arthur Ashe transformed tennis—and athlete activism'; HISTORY.com 'How Arthur Ashe Transformed Tennis—and Athlete Activism'; Andscape 'The day Arthur Ashe became the first Black man to win the US Open'; Wikipedia 'Arthur Ashe' (death date/cause, HIV transmission circumstances, disclosure timeline, UN address quote, Army/West Point service dates), cross-referenced against CNN/HISTORY for consistency. All accessed 14 Aug 2026. Fact/opinion check: all dates, scores, quotes, and biographical claims are sourced as listed. Opinionated framing (closing paragraph's interpretation of the stadium naming) flagged as editorial voice, not documented fact.",
    publishedAt: new Date("2026-07-15T10:00:00Z"),
  },
  {
    slug: "voices-you-hear-at-us-open-arent-real",
    title: "The Voices You Hear at the US Open Aren't Real — Here's Why",
    sport: ["tennis"],
    sportingEventId: US_OPEN_2026_ID,
    contentCategory: "history",
    excerpt: "Every \"out\" call at the US Open since 2022 comes from a machine, not a person. Two hundred and four cameras and a bank of pre-recorded human voices replaced every line judge in the sport's loudest stadium.",
    bodyContent: `Stand courtside at the US Open today and you'll hear a call every time a ball lands close to the line. What you won't see is a single line judge making it. Since 2022, no human has stood on a US Open court to call a ball in or out. The job now belongs entirely to a system called Hawk-Eye Live — and the voice you hear isn't reacting to the shot in real time at all.

## How it actually works

Two hundred and four cameras cover all 17 courts at the US Open — 12 tracking cameras per court, plus six dedicated to foot faults. They track the ball at 340 frames per second, feeding the footage instantly to an operations room known as the Hawk-Nest, where the system calculates whether the ball landed in or out. Hawk-Eye's own figures put the accuracy at effectively 100%, with the tracking itself millimeter-precise — a level of consistency no human eye, blinking and refocusing point after point for hours, was ever going to match.

The "voice" making the call is real, but it isn't live. Line-call audio was recorded in advance by real people, at different levels of urgency depending on how close the shot is — a routine call sounds different from a call on set point. When Hawk-Eye determines the outcome, it simply plays the matching clip. Nobody is reacting to your shot. The reaction was recorded years before you hit it.

## Why it happened here first

The shift wasn't sudden. In 2020, the US Open dropped line judges from all but two of its courts, largely as a pandemic-era decision to reduce the number of people on site. The following year, the Australian Open became the first Grand Slam to go fully electronic. The US Open followed in 2022, and the change stuck — not because it was forced by circumstance anymore, but because the accuracy case had become impossible to argue with. Equipping a single court costs close to $100,000 and takes about three days to install. The tournament decided that was worth it, permanently.

## What it changed, and what it didn't

The chair umpire is still there. The theater of the sport — the challenges, the replay shown on the big screen, the crowd groaning or cheering at a close call — hasn't gone anywhere. What's gone is the possibility of a human blinking at the wrong moment on set point. The calls are faster, they're not up for argument, and by most accounts, players have stopped missing the old system almost entirely. It's a strange thing to realize mid-match: the most consequential voice in the stadium isn't responding to what just happened. It already knew what was going to happen, the moment the ball crossed the line.`,
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    status: "in_review",
    editorialNote: "Sources: CNBC 'How Sony's Hawk-Eye electronic line-calling system transformed the U.S. Open' (camera count, frame rate, accuracy claim, cost/setup time); NPR 'Humans are no longer the line judges at the US Open'; ESPN 'US Open to use Hawk-Eye line-calling technology on all tennis courts for first time' (2020/2021/2022 rollout timeline). All accessed 14 Aug 2026. Fact/opinion check: camera counts, accuracy figures, cost, and rollout dates are sourced as above. Closing framing is editorial voice, not a documented claim.",
    publishedAt: new Date("2026-07-19T10:00:00Z"),
  },
  {
    slug: "5-greatest-matches-us-open-history",
    title: "The 5 Greatest Matches in US Open History",
    sport: ["tennis"],
    sportingEventId: US_OPEN_2026_ID,
    contentCategory: "history",
    excerpt: "Five matches that turned Flushing Meadows into the loudest room in tennis — a sisters' rivalry decided by four saved set points, a comeback from a stabbing, and a match that didn't end until 2:50 in the morning.",
    bodyContent: `Some tournaments produce great tennis. The US Open produces theater. Night sessions, a crowd that never fully quiets down, matches that run past midnight because nobody in Flushing Meadows is in a hurry to go home — the format seems to invite chaos, and over more than 50 years, it's delivered some of the sport's most complete matches. These five hold up.

## Serena vs. Venus Williams, 2008 quarterfinal

Two sisters, one net, 7-6(6), 7-6(7). Venus led the second-set tiebreak 6-3 and held four set points to close it out. Serena saved every one of them, then won six of the last seven points to finish the match. *Tennis Magazine* called it the best women's match of the year. It's easy to forget, watching two players who'd go on to define a generation of the sport, that this was still just a quarterfinal.

## Steffi Graf vs. Monica Seles, 1995 final

Seles had been out of tennis for over two years, since being stabbed on court by a spectator in 1993. Her return to a Grand Slam final, against the world No. 1 who'd dominated the sport in her absence, was less a tennis match than a genuine question about whether she could still do this at all. Graf won 7-6, 0-6, 6-3, in three sets that swung as wildly as the emotional register of the match itself.

## John McEnroe vs. Björn Borg, 1980 final

The rivalry that defined the sport's biggest personality clash of its era, settled at the US Open in five sets, 7-6, 6-1, 6-7, 5-7, 6-4. It was McEnroe's second straight US Open title, and one more chapter in a head-to-head that never really had a boring entry.

## Andre Agassi vs. Pete Sampras, 2001 quarterfinal

Four sets, four tiebreaks, zero service breaks in the entire match: 6-7, 7-6, 7-6, 7-6. Two of the most complete players of their era traded holds for nearly three and a half hours without either one cracking the other's serve once. Sampras won it — and it remains one of the tidiest, most relentless matches ever played at Flushing Meadows.

## Carlos Alcaraz vs. Jannik Sinner, 2022 quarterfinal

Five hours and fifteen minutes. Alcaraz, 19 years old, saved a match point to beat Sinner, 21, in a match that didn't finish until 2:50 in the morning — still the latest finish in US Open history. Alcaraz went on to win the whole tournament, his first Grand Slam title. Sinner would get his own, more than once, a few years later. Neither player has ever really stopped being linked to that night.`,
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    status: "in_review",
    editorialNote: "Sources: Bleacher Report 'Ranking the 10 Greatest Matches in US Open Tennis History' (McEnroe-Borg, Agassi-Sampras scores); ESPN 'Serena survives slugfest vs. Venus' (2008 QF score, set-point/tiebreak detail); Yardbarker/USOpen.org/Sky Sports/ESPN 2022 Alcaraz-Sinner coverage (score, duration, finish time, match-point-saved detail); Sportsnaut and general cross-reference for 1995 Graf-Seles final score and Seles's return-from-stabbing context. All accessed 14 Aug 2026. Fact/opinion check: all scores, dates, durations, and quoted attribution (Tennis Magazine) are sourced as above. Framing language is editorial voice, not documented fact.",
    publishedAt: new Date("2026-07-22T10:00:00Z"),
  },
  {
    slug: "why-us-open-night-sessions-are-tennis-best-theater",
    title: "Why US Open Night Sessions Are Tennis's Best Theater",
    sport: ["tennis"],
    sportingEventId: US_OPEN_2026_ID,
    contentCategory: "why_go",
    excerpt: "Novak Djokovic has called it the best atmosphere in the sport. Nearly 24,000 fans, a stadium built for noise, and a record crowd of over 31,000 that turned Arthur Ashe Stadium into the loudest room in tennis.",
    bodyContent: `Every Grand Slam has finals. Only one has a nightly main event. The US Open's night session — first-served matches starting around 7pm in Arthur Ashe Stadium — isn't an add-on to the daytime tournament. For a lot of the sport's biggest fans, it's the whole reason to be there.

## What makes it different

Arthur Ashe Stadium holds close to 24,000 people for a night session, and the crowd that shows up for one behaves differently than a daytime one. New York's night session audience is famously vocal — cheering mid-rally, reacting to a call before the chair umpire does, treating the match less like a tennis event and best described, by more than one player over the years, as closer to a concert with a scoreboard. Novak Djokovic, who has played more Grand Slam matches than almost anyone in the sport's history, has said plainly that the night sessions at the US Open are the best atmosphere in tennis.

The tournament schedules its biggest names for the evening slot deliberately — the players with the largest public profiles get the night session, both for the television audience and for what the arena becomes once the sun goes down. The result compounds on itself: bigger stars draw bigger, louder crowds, which makes the night session the reason those same stars want to play there.

## A record that keeps getting broken

The night session's biggest crowd on record came on opening night of the 2024 tournament — 31,775 fans, a new all-time high for a single US Open night session. It broke the previous record of 29,402, set two years earlier during Serena Williams's farewell match in 2022. Attendance records at the US Open overall have climbed nearly every year this decade, and the night session numbers have led the way — proof that the format isn't just historically popular, it's still growing.

## Why it's worth planning around

If there's one piece of practical advice buried in all of this, it's simple: a day session ticket and a night session ticket are not the same experience, even on the same court, even for the same round. The tennis can be just as good in the afternoon. The atmosphere isn't. If you're building a US Open trip around one unforgettable session, make it the one that starts after dark.`,
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    status: "in_review",
    editorialNote: "Sources: Global Tennis News 'US Open Night Sessions Explained' (~24,000 capacity, scheduling of marquee players); Gulf News 'Night sessions here are best in the world, says Novak Djokovic' (direct quote); QNS 'USTA welcomed record-breaking crowds at 2025 US Open' (attendance record context); cross-referenced night-session attendance record (31,775, 2024) and prior record (29,402, Serena's 2022 farewell match). All accessed 14 Aug 2026. Fact/opinion check: attendance figures, Djokovic quote, and scheduling practice are sourced as above. Comparative framing and closing recommendation are editorial voice. FLAG: no decibel-level or scientific noise-measurement data exists publicly for US Open night sessions — any 'loudest room' framing in this piece is atmospheric/qualitative language, not a measured claim.",
    publishedAt: new Date("2026-07-26T10:00:00Z"),
  },
  {
    slug: "gender-equality-at-the-us-open",
    title: "Gender Equality at the US Open — How Tennis's First Major Got There First",
    sport: ["tennis"],
    sportingEventId: US_OPEN_2026_ID,
    contentCategory: "history",
    excerpt: "In 1972, Billie Jean King won the US Open and took home less than half of what the men's champion did. A year later, she'd fixed it — and the other three majors didn't catch up for decades.",
    bodyContent: `In 1972, Billie Jean King won the US Open. Ilie Năstase also won the US Open, in the men's draw, and walked away with $25,000. King's check was $10,000. "I said: 'This really stinks,'" she said afterward — and she meant it literally enough to threaten that she and the other women wouldn't be back the following year unless something changed.

## The fix wasn't a demand. It was a sponsor.

King didn't just threaten a boycott and wait. She went looking for the $15,000 gap herself, on the theory that money solves arguments money can't win on principle alone: "If I can bring in the money, then how are they going to say no?" Bristol Myers Squibb agreed to fund the difference, and in 1973, the US Open became the first tournament in tennis — arguably the first in major professional sport, period — to pay its men's and women's singles champions the exact same prize. John Newcombe and Margaret Court each collected $25,000 that year. Nobody's check was the asterisk.

## The other three majors took their time

What makes 1973 remarkable in hindsight isn't just that it happened — it's how long everyone else waited to follow. The Australian Open didn't match it until 2001, 28 years later. The French Open got there in 2006. Wimbledon, the oldest and most traditional of the four, held out until 2007 — 34 years after the US Open, and only after Venus Williams spent years publicly pushing the point before finally becoming the first woman to collect an equal winner's check there. For over three decades, "equal pay at a major" meant exactly one tournament.

## A name that stuck

The USTA's home venue in Flushing Meadows carries King's name today — the USTA Billie Jean King National Tennis Center, renamed in 2006, the first major sports venue anywhere named after a woman. It sits a short walk from a stadium named for Arthur Ashe, another player who used his platform at this same tournament for something bigger than his own results. The US Open didn't just start the equal-pay conversation in tennis. It's still, physically, where you go to be reminded who started it.`,
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    status: "in_review",
    editorialNote: "Sources: Tennis.com 'Billie Jean King's push for equal prize money in 1973 will be celebrated at US Open' (1972 prize figures, King quotes, boycott threat, Bristol Myers Squibb sponsorship); Wikipedia '1973 US Open (tennis)' (1973 prize amounts, Newcombe/Court confirmation); Tennis Majors 'The day Wimbledon announced equal prize money' (Feb 22, 2007 announcement date); Tennis.com '2007: After fighting for pay equity at Wimbledon, Venus Williams became the first woman to collect an equal-sized champion's check' (Wimbledon's 2007 adoption, Venus Williams's advocacy); Tennis365 and general cross-reference for Australian Open (2001) and French Open (2006) equal-pay adoption years. USTA National Tennis Center renaming date (2006) cross-referenced against a social-media source, treated as lower-confidence than the rest and flagged accordingly. All accessed 14 Aug 2026. Fact/opinion check: all prize figures, dates, quotes, and the renaming fact are sourced as above. Closing framing is editorial voice, not documented claim.",
    publishedAt: new Date("2026-08-01T10:00:00Z"),
  },
  {
    slug: "5-rookie-mistakes-first-time-us-open-visitors-make",
    title: "5 Rookie Mistakes First-Time US Open Visitors Make",
    sport: ["tennis"],
    sportingEventId: US_OPEN_2026_ID,
    contentCategory: "why_go",
    excerpt: "The tennis is loud. The crowd, mostly, isn't. First-time visitors to the US Open are usually surprised by the wrong things — here's what actually catches people off guard.",
    bodyContent: `The US Open has a reputation as the loud Grand Slam — night sessions, a crowd that cheers mid-rally, a stadium built for spectacle. All of that is true. It's also not what trips up most first-time visitors. The actual mistakes are smaller, and stranger, than people expect.

## Mistake 1: Buying the wrong pass and not realizing it

A grounds pass gets you into every court at the USTA Billie Jean King National Tennis Center except two: Arthur Ashe and Louis Armstrong. That's not a footnote — it's the difference between watching the tournament's headline matches and watching everything else. A lot of first-time buyers assume "grounds pass" means access to the grounds, full stop, and only realize the gap once they're standing outside Ashe with the wrong ticket in hand.

## Mistake 2: Treating it like a normal spectator sport, noise-wise

The stereotype is a rowdy night session. The reality, for most of the tournament, is closer to church. Crowds watch in near-total silence during play and only break into applause between points — quiet enough that first-timers regularly report being able to hear players' shoes squeak on the court and the specific sound of a racket meeting a ball. Show up expecting the atmosphere of a football match during a day-session outer-court rally, and the silence will catch you off guard.

## Mistake 3: Planning a tight schedule around match length

Men's singles matches routinely run close to three hours, and there's no clock forcing them shorter. Visitors who plan their day like they would at a timed sport — one match, then lunch, then another match on schedule — often find themselves stuck mid-match with nowhere to be and no way to leave gracefully. Build slack into the day. The tennis doesn't care what time your dinner reservation is.

## Mistake 4: Skipping breakfast because "there's food there"

There is food there. It's also $23 for the signature cocktail and $35 for a fairly ordinary combo of chicken tenders, fries, and a Coke. None of that's unreasonable for a major sporting event's concession pricing, but it adds up fast if you arrive hungry and plan to eat every meal on-site. Eating before you go, or at least going in with a real number in mind for how much a day of food actually costs, saves the sticker shock.

## Mistake 5: Dressing like you would for any other sporting event

There are no team jerseys in the stands here, and it's noticeable. The unofficial dress code leans smart-casual to genuinely dressed-up — a departure from how most fans show up to most sports. It's not enforced, and nobody will turn you away in a t-shirt, but first-timers who come dressed for a typical stadium day often notice, once they're there, that they read differently than most of the crowd around them.`,
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    status: "in_review",
    editorialNote: "Sources: Time Out New York, 'I went to the U.S. Open for the first time — here are 5 things that surprised me' (crowd silence, match-length surprise, concession pricing, dress-code observation); Lonely Planet/AOL, ticket-strategy guidance (grounds pass scope — excludes Arthur Ashe and Louis Armstrong specifically). All accessed 14 Aug 2026. Fact/opinion check: pricing figures, grounds pass scope, and crowd-behavior/dress-code observations sourced as above. Framing language is editorial voice. Distinctness note: deliberately avoids bag rules, heat/weather planning, and general getting-there logistics — all covered by the existing seeded experience 'Preparing for Your US Open Visit.' This piece covers ticket-type confusion, crowd etiquette, match-length planning, food cost expectations, and dress code instead.",
    publishedAt: new Date("2026-07-29T10:00:00Z"),
  },
];

let inserted = 0;
for (const a of articles) {
  const readMin = readMinutes(a.bodyContent);
  await db
    .insert(blogArticles)
    .values({ ...a, readMinutes: readMin })
    .onConflictDoNothing({ target: blogArticles.slug });
  console.log(`✓ ${a.slug} — ${readMin} min read`);
  inserted++;
}

console.log(`\nDone — seeded ${inserted} blog articles (status: in_review)`);
await client.end();

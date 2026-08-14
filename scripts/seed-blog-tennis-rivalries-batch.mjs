import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { blogArticles } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

function readMinutes(body) {
  const wordCount = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(wordCount / 225));
}

const articles = [
  {
    slug: "djokovic-vs-nadal-closest-rivalry-tennis-ever-had",
    title: "Djokovic vs. Nadal — The Closest Rivalry Tennis Has Ever Had",
    sport: ["tennis"],
    sportingEventId: null,
    contentCategory: "rivalry",
    excerpt: "60 matches, a 31-29 record, and a 2012 Australian Open final that Andre Agassi called the best tennis match he'd ever seen. No two players have pushed each other longer, or closer.",
    bodyContent: `Sixty matches. A head-to-head that sits at 31-29 in Djokovic's favor. No rivalry in tennis history has been fought this close, for this long, at this level.

## A rivalry with no dominant side

Split the record by surface and the picture gets even tighter. Djokovic leads 20-7 on hard courts. Nadal leads 20-9 on clay. Grass is tied at 2-2. Djokovic is the only man to have beaten Nadal at all four Grand Slams — but Nadal still holds an 8-2 record against him specifically at the French Open, the one place nobody has ever solved him for long. Between them, they made sure this rivalry never had a comfortable answer to "who's better."

## The match both of them still get asked about

The 2012 Australian Open final ran five hours and 53 minutes — still the longest Grand Slam final ever played. Djokovic won it 7-5, 6-4, 6-2, 6-7, 6-3. Bjorn Borg called it "truly fantastic." Andre Agassi went further: "I think this was the best tennis match ever in the men's game." A year later, their French Open semifinal drew the same praise from the other direction — John McEnroe called it "the best match ever played on a clay court," and Borg agreed, calling it the greatest clay-court match, period.

## Still going, deep into their careers

They played at least one match a year for 17 straight years, from 2006 through 2022. Their last meeting came at the 2024 Paris Olympics — a full generation after their first. Most rivalries in sport burn hot for a few years and fade. This one just kept finding new ground to fight over.`,
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    status: "in_review",
    editorialNote: "Sourced from Wikipedia's Djokovic-Nadal rivalry page (head-to-head record, surface breakdown, 2012 AO final and 2013 RG semifinal details, quotes from Borg/Agassi/McEnroe), accessed 14 Aug 2026. Fact/opinion check: all records, scores, durations, and quotes are sourced as above. Framing (\"no comfortable answer,\" \"kept finding new ground to fight over\") is editorial voice. Corrected 14 Aug 2026 per founder instruction: every head-to-head figure must name which player it favors, not just state the number.",
    publishedAt: new Date("2026-06-10T10:00:00Z"),
  },
  {
    slug: "borg-vs-mcenroe-fire-and-ice",
    title: "Borg vs. McEnroe — Fire and Ice, Tied at 7-7",
    sport: ["tennis"],
    sportingEventId: null,
    contentCategory: "rivalry",
    excerpt: "One player never showed emotion. The other couldn't hide it. Their rivalry produced two of the greatest Wimbledon finals ever played — and ended, fittingly, in a dead heat.",
    bodyContent: `They played 14 official matches. The record finished 7-7 — a genuine, perfect tie, which might be the only fair outcome for a rivalry this defined by opposites.

## Fire and Ice

Bjorn Borg was ice: a cool, near-expressionless Swede who almost never showed a reaction on court, win or lose. John McEnroe was fire: an American with a notorious temper, prone to on-court outbursts at umpires that became as famous as his tennis. The nickname stuck because it was accurate, not because it was catchy.

## The tiebreak that never ends

Their 1980 Wimbledon final is still, decades later, cited as one of the best matches ever played. Borg won it 8-6 in the fifth set — but only after McEnroe saved five match points and won an 18-16 fourth-set tiebreaker that alone lasted 20 minutes. A few months later, McEnroe beat him in five sets at the US Open final, a match also remembered as an all-time classic.

## The rematch that flipped it

In 1981, McEnroe beat Borg in the Wimbledon final, ending Borg's streak of 41 consecutive match wins at the All England Club. Borg walked off the court before the trophy ceremony and the press conference had even begun. He beat McEnroe again shortly after that at the US Open final — decisively, in four sets. Two players, two finals, and two very different ways of leaving the court.

## What came after

Time did what tennis couldn't — it made them close. Years after both had retired, their relationship improved enough that McEnroe personally talked Borg out of auctioning off his Wimbledon trophies in 2006. Fire and Ice cooled into something else entirely.`,
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    status: "in_review",
    editorialNote: "Sourced from Wikipedia's Borg-McEnroe rivalry page (head-to-head record, 1980/1981 Wimbledon and US Open final details, post-career reconciliation), accessed 14 Aug 2026. Fact/opinion check: record, match scores, and the 2006 auction detail are sourced as above. \"Fire and Ice cooled into something else entirely\" is editorial framing.",
    publishedAt: new Date("2026-06-17T10:00:00Z"),
  },
  {
    slug: "federer-vs-djokovic-never-a-quiet-match",
    title: "Federer vs. Djokovic — The Rivalry That Never Had a Quiet Match",
    sport: ["tennis"],
    sportingEventId: null,
    contentCategory: "rivalry",
    excerpt: "50 matches, a 27-23 record, and a 2019 Wimbledon final that ran to a fifth-set tiebreak for the first time in the tournament's history. Even their ordinary matches weren't ordinary.",
    bodyContent: `Fifty matches over more than a decade, and Djokovic came out ahead 27-23 — 13-6 when it mattered most, in finals. At the majors specifically, Djokovic leads 11-6, with a 4-1 edge in Grand Slam finals. But those numbers undersell how often this rivalry came down to a handful of points.

## The longest final Wimbledon has ever seen

Their 2019 Wimbledon final ran four hours and 57 minutes — the longest final in the tournament's history. Djokovic won it 7-6, 1-6, 7-6, 4-6, 13-12, saving two championship points along the way at 40-15 in the deciding set. It was also the first Wimbledon final ever decided by a fifth-set tiebreak. Djokovic called the win "unreal" — and still acknowledged afterward that "Federer was the better player for most of the match."

## The other final that could've been the headline anywhere else

Five years earlier, the same two players produced a different five-set classic in the 2014 Wimbledon final, Djokovic winning 6-7, 6-4, 7-6, 5-7, 6-4 in just under four hours. Federer saved a championship point before Djokovic closed it out.

## The streak that got broken on clay

Not every big match here went to Djokovic. In the 2011 French Open semifinal, Federer beat him in four sets — and in doing so, ended a run of 43 straight wins and an undefeated 41-0 start to Djokovic's season. It's the kind of result that, against anyone else, would define an entire year. Against Federer, it was just one entry in a rivalry that produced classics on demand.`,
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    status: "in_review",
    editorialNote: "Sourced from Wikipedia's Djokovic-Federer rivalry page (full head-to-head, surface breakdown, 2019/2014 Wimbledon final details and quotes, 2011 French Open semifinal), accessed 14 Aug 2026. Fact/opinion check: all records, scores, durations, and the Djokovic quote are sourced as above. Framing is editorial voice.",
    publishedAt: new Date("2026-06-24T10:00:00Z"),
  },
  {
    slug: "agassi-vs-sampras-best-returner-best-server",
    title: "Agassi vs. Sampras — The Best Returner Against the Best Server of His Generation",
    sport: ["tennis"],
    sportingEventId: null,
    contentCategory: "rivalry",
    excerpt: "Sampras won the head-to-head 20-14. But their 2001 US Open quarterfinal — four tiebreak sets, zero breaks of serve — is still held up as one of the cleanest, most relentless matches ever played.",
    bodyContent: `Pete Sampras led their head-to-head 20-14 across 34 matches, and 9-7 in finals — but the numbers flatten what made this rivalry genuinely interesting: it was a matchup of true opposites, and both of them were the best in the world at their specific thing.

## Two contrasting weapons

Sampras retired with the all-time Grand Slam men's singles record at 14 titles, built largely on one of the best serves the sport had seen. Agassi built his game on the other end of that equation — widely regarded as the best returner in tennis history, someone who could turn a huge serve into a defensive problem for the server almost by instinct. Their matches were, in a sense, a serve fighting a return, over and over, for over a decade.

## The final that decided nothing was easy

They met in five Grand Slam finals. Sampras won four of them. Their first meeting on that stage came at the 1990 US Open, a straight-sets win for Sampras. Their last came at the 2002 US Open final — which turned out to be the final match of Sampras's career. He retired on that win, announcing his retirement the following year.

## The match with no cracks in it

Their 2001 US Open quarterfinal is the one people still bring up. Sampras won 6-7(7-9), 7-6(7-2), 7-6(7-2), 7-6(7-5) — four sets, four tiebreaks, and remarkably, not a single service break in the entire match. Neither player gave the other anything. It's the kind of scoreline that reads more like a technical exercise than a tennis match, and it's remembered as one of the purest examples of both men's games at their peak.`,
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    status: "in_review",
    editorialNote: "Sourced from Wikipedia's Agassi-Sampras rivalry page (head-to-head, surface breakdown, Grand Slam finals record, 2001 US Open QF detail, career context), accessed 14 Aug 2026. Fact/opinion check: all records and scores sourced as above. \"Best returner\"/\"one of the best serves\" framing reflects widely-cited consensus rather than the outlet's own invented claim, still tagged as descriptive characterization rather than a hard statistic.",
    publishedAt: new Date("2026-07-01T10:00:00Z"),
  },
  {
    slug: "evert-vs-navratilova-80-matches-and-a-friendship",
    title: "Evert vs. Navratilova — 80 Matches, and a Friendship That Outlasted All of Them",
    sport: ["tennis"],
    sportingEventId: null,
    contentCategory: "rivalry",
    excerpt: "Martina Navratilova led the head-to-head 43-37 across 80 matches — 60 of them finals. Chris Evert countered with the best clay-court record against her of anyone in the sport. Then they became genuine friends.",
    bodyContent: `Eighty matches. Sixty of them were finals. No rivalry in tennis — men's or women's — has produced anywhere near that ratio of meetings that actually decided a tournament.

## Baseline against the net

Martina Navratilova played an aggressive serve-and-volley game, built for speed and forward pressure. Chris Evert built her game from the baseline, all precision and patience. It's a classic tennis contrast, and it showed clearly in the surface splits: Navratilova dominated on grass (10-5) and indoor courts (21-14), the faster surfaces that rewarded her attacking style. Evert held her own advantage on clay, leading 11-3, where patience mattered more than pace. Hard courts were dead even at 8-8. Across their careers, Navratilova finished ahead overall, 43-37, and 36-24 in their 60 finals meetings.

## The final that's still remembered as the best of theirs

Their 1985 French Open final is widely considered the high point of the rivalry. Evert won it 6-3, 6-7(4-7), 7-5, reclaiming the world No. 1 ranking in the process. A year earlier, their 1984 US Open final had gone the other way — Navratilova recovering from a lost opening set to win the title.

## Rivals, then genuinely close

What sets this rivalry apart from most isn't just the volume of matches — it's what came after. Evert and Navratilova didn't just retire into cordial distance. They built a real friendship, one that's been documented and referenced by both of them for decades since. Eighty matches against each other, and neither one walked away resenting the other for it.`,
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    status: "in_review",
    editorialNote: "Sourced from Wikipedia's Evert-Navratilova rivalry page (full head-to-head, surface breakdown, Grand Slam records, 1985 French Open and 1984 US Open final details, post-career friendship), accessed 14 Aug 2026. Fact/opinion check: all records and scores sourced as above. Framing is editorial voice.",
    publishedAt: new Date("2026-07-08T10:00:00Z"),
  },
  {
    slug: "alcaraz-vs-sinner-six-finals-one-season",
    title: "Alcaraz vs. Sinner — Six Finals, One Season, and Tennis's New Rivalry",
    sport: ["tennis"],
    sportingEventId: null,
    contentCategory: "rivalry",
    excerpt: "In 2025, Carlos Alcaraz and Jannik Sinner met in the final of every Grand Slam played that year, plus two more finals besides. Nothing in men's tennis has looked like this since Federer and Nadal.",
    bodyContent: `In 2025, Carlos Alcaraz and Jannik Sinner played each other six times. All six were finals. Between them, they won every Grand Slam contested that year — the first time in the Open Era that two players have split all four majors' finals in a single season between just themselves.

## A rivalry with almost no gaps in it

Alcaraz leads their head-to-head 10-7, but the surface breakdown shows how close and complete this rivalry actually is: Alcaraz leads 6-2 on outdoor hard courts and 3-2 on clay, the two are tied 1-1 indoors, and Sinner is unbeaten against Alcaraz on grass, 2-0. There isn't a surface where either man has a clean, uncontested edge.

## The final that ran longer than any other

Their 2025 French Open final is already being talked about as one of the greatest matches ever played. It lasted five hours and 29 minutes — the longest final in Roland-Garros history — and Alcaraz won it 4-6, 6-7(4), 6-4, 7-6(3), 7-6(10-2), saving three championship points along the way before closing it out. Roger Federer called it "maybe one of the greatest games we've ever had in our sport." That same season, the two also met in the finals of Wimbledon, Cincinnati, the US Open, and the ATP Finals — six major finals across a single year, an unprecedented run for two players facing only each other.

## A season with an asterisk neither of them chose

The rivalry's 2025 chapter carries real context worth stating plainly: Sinner served a three-month ban that year after two positive tests for a banned substance in 2024. The World Anti-Doping Agency's own resolution found he had been inadvertently contaminated by a member of his support team, with no intent to cheat and no performance benefit gained — and he returned in time for the French Open, where the two met in that record-breaking final. It's part of the story of their 2025 season, whether either player would have chosen it to be or not.

## Tennis hasn't seen this in years

Between them, Alcaraz and Sinner have won the sport's last ten Grand Slam titles dating back to 2024. At 22, Alcaraz became the youngest man to complete the career Grand Slam. The last time men's tennis had a rivalry this dominant, this evenly matched, and this constant, it was Federer and Nadal. This one is just getting started.`,
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    status: "in_review",
    editorialNote: "Sourced from National Bank Open, Olympics.com, SI.com, tennismajors.com (2025 season overview, six-finals detail, French Open final score/duration, Federer quote), accessed 14 Aug 2026; WADA/ITIA resolution details on Sinner's ban sourced from Al Jazeera and BBC coverage, accessed 14 Aug 2026 — presented factually (ban length, WADA's own no-intent finding) without editorializing on guilt, per the skill's hard editorial line against reader-provoking or unfair characterization of a named person. Fact/opinion check: all records, scores, and the ban's resolution details are sourced as above. \"Tennis's new rivalry,\" \"just getting started\" is editorial framing.",
    publishedAt: new Date("2026-07-15T10:00:00Z"),
  },
  {
    slug: "connors-vs-mcenroe-most-contentious-rivalry",
    title: "Connors vs. McEnroe — One of Tennis's Most Contentious Rivalries",
    sport: ["tennis"],
    sportingEventId: null,
    contentCategory: "rivalry",
    excerpt: "John McEnroe led the head-to-head 20-14 across 34 matches. Both men were known for their tempers — but it was on court, against each other, that the rivalry earned its reputation as one of the most bitter in the sport.",
    bodyContent: `Jimmy Connors and John McEnroe played 34 official matches between 1977 and 1991. McEnroe won the series 20-14 — but the scoreline was never really the point. This is remembered as one of the most genuinely contentious rivalries tennis has produced, between two of the sport's most combative on-court personalities.

## Two finals, two opposite outcomes

Connors won their 1982 Wimbledon final in five sets, 3-6, 6-3, 6-7, 7-6, 6-4 — a match that went the distance both in games and in tension. Two years later, McEnroe reversed it completely, dismantling Connors 6-1, 6-1, 6-2 in the 1984 Wimbledon final — one of the most lopsided Grand Slam finals either man ever played, against each other or anyone else.

## Split by surface, split by temperament

Connors held the edge on grass, 4-3. McEnroe dominated hard courts, 6-3, and indoor matches even more decisively, 10-4. Both men reached world No. 1. Connors finished his career with 8 Grand Slam singles titles; McEnroe finished with 7.

## A mark that stuck

Decades later, Connors reflected on the rivalry without much softening: "Something like that never goes away, especially between Mac and myself." He added that the length and intensity of their competition proved they'd "made our mark somewhere." Neither man needed to explain what that meant.`,
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    status: "in_review",
    editorialNote: "Sourced from Wikipedia's Connors-McEnroe rivalry page (head-to-head, surface breakdown, 1982/1984 Wimbledon final scores, Connors quote), accessed 14 Aug 2026. Fact/opinion check: records, scores, and the Connors quote are sourced as above. \"Never really the point\" and closing line are editorial framing.",
    publishedAt: new Date("2026-07-22T10:00:00Z"),
  },
  {
    slug: "connors-vs-lendl-won-first-8-lost-next-17",
    title: "Connors vs. Lendl — Connors Won the First 8. Lendl Won the Last 17.",
    sport: ["tennis"],
    sportingEventId: null,
    contentCategory: "rivalry",
    excerpt: "Jimmy Connors dominated the start of this rivalry. Ivan Lendl dominated everything after. The reversal wasn't close — and the seven-and-a-half-year age gap between them explains why.",
    bodyContent: `Some rivalries stay close the whole way through. This one didn't — and that's exactly what makes it worth telling. Jimmy Connors won their first eight matches. Ivan Lendl won the next seventeen. By the time it was over, Lendl led the head-to-head 22-13 across 35 meetings, and the shape of that record tells its own story about aging in professional tennis.

## An early edge that couldn't last

Connors was 7.5 years older than Lendl, and that gap explains almost everything about how this rivalry unfolded. Connors got the better of a younger, still-developing Lendl early on. Once Lendl matured into his own game, the balance of power flipped completely and never flipped back.

## The finals that Connors somehow kept winning anyway

Even as Lendl closed the overall gap, Connors found a way to win when it mattered most, at least for a while. He beat Lendl in the 1982 US Open final, 6-3, 6-2, 4-6, 6-4, after reportedly challenging Lendl directly to try to hit through him. He beat him again in the 1983 US Open final, 6-3, 6-7, 7-5, 6-0 — a match Connors left briefly during the second set before coming back to close it out. Lendl got his answer eventually: their final meeting, at the 1992 US Open, went to Lendl in four sets, 3-6, 6-3, 6-2, 6-0, after Connors led early and couldn't hold on.

## Two eight-time major champions, two very different careers

Both men finished with 8 Grand Slam singles titles and both reached world No. 1 — nearly identical résumés, built in almost opposite order. At the majors specifically, they met seven times, with Lendl winning the last four in a row. The story of this rivalry isn't who was better. It's how completely the answer to that question changed depending on when you asked it.`,
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    status: "in_review",
    editorialNote: "Sourced from Wikipedia's Connors-Lendl rivalry page (full head-to-head, win-streak reversal, 1982/1983/1992 US Open detail, age gap, career context), accessed 14 Aug 2026. Fact/opinion check: all records and scores sourced as above. Framing throughout is editorial voice.",
    publishedAt: new Date("2026-07-25T10:00:00Z"),
  },
  {
    slug: "hingis-vs-serena-williams-changing-of-the-guard",
    title: "Hingis vs. Serena Williams — The Rivalry That Marked a Changing of the Guard",
    sport: ["tennis"],
    sportingEventId: null,
    contentCategory: "rivalry",
    excerpt: "Serena Williams led their head-to-head 7-6. But their 1999 US Open final — a young American beating the reigning champion in straight sets — is remembered as the moment women's tennis started to change.",
    bodyContent: `Serena Williams and Martina Hingis played 13 times between 1998 and 2002, with Williams winning the series 7-6. The numbers are close. What the rivalry actually represented wasn't.

## Two players, one year apart, two very different games

Hingis and Williams turned professional almost exactly a year apart — Hingis in October 1994, Williams in September 1995 — which made them near-contemporaries rather than players from clearly different eras. But their games couldn't have been more different. Hingis built her success on technical precision and court craft, reading opponents and constructing points rather than overpowering them. Williams brought a level of physical intensity the women's game hadn't fully seen before. Over the course of their rivalry, that physicality gradually took over.

## The final that announced it

Their most significant meeting came at the 1999 US Open final. Williams won it 6-3, 7-6(7-4) — a clean, two-set win over the reigning champion, and Williams's first Grand Slam singles title. It wasn't just a result. It was an early, unmistakable signal of where the power in women's tennis was about to shift.

## A rivalry that mostly played out on hard courts

Williams held the clear edge on hard courts, 7-5. Their only meeting on clay went to Hingis, at the 1999 Italian Open. They never played each other on grass or carpet. In majors specifically, Hingis actually won more of their matches overall, 6 wins to Williams's 7 — but Williams took 2 of their 3 meetings in major finals, including the one that counted most.`,
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    status: "in_review",
    editorialNote: "Sourced from Wikipedia's Hingis-S. Williams rivalry page (head-to-head, surface breakdown, 1999 US Open final score, career-start context), accessed 14 Aug 2026. Fact/opinion check: records and scores sourced as above. Characterization of playing styles and \"changing of the guard\" framing is editorial voice/widely-cited consensus, tagged as interpretation rather than hard fact.",
    publishedAt: new Date("2026-07-29T10:00:00Z"),
  },
  {
    slug: "becker-vs-edberg-three-straight-wimbledon-finals",
    title: "Becker vs. Edberg — Three Straight Wimbledon Finals, Three Different Winners",
    sport: ["tennis"],
    sportingEventId: null,
    contentCategory: "rivalry",
    excerpt: "Boris Becker led their head-to-head 25-10. But at Wimbledon specifically, across three consecutive finals from 1988 to 1990, the two of them traded the title back and forth — and produced one of the sport's great trilogies.",
    bodyContent: `Boris Becker and Stefan Edberg met 35 times between 1984 and 1996, and Becker won the series decisively, 25-10. But reduce this rivalry to that one number and you miss what actually made it matter: three consecutive Wimbledon finals, one after another, that the two of them simply kept trading.

## 1988: the upset

Edberg was expected to lose. Becker was the favorite, the two-time defending champion on a surface that suited his serve-and-volley game perfectly. Edberg won anyway, 4-6, 7-6(7-2), 6-4, 6-2, taking control of a crucial second-set tiebreak after Becker had dominated the first set. It was Edberg's first Wimbledon title.

## 1989: the reversal

A year later, Becker took it back. He beat Edberg 6-0, 7-6(7-1), 6-4 — a first set that Edberg simply couldn't get into at all, followed by a tiebreak Becker controlled from the front. It was Becker's third and, as it turned out, final Wimbledon title.

## 1990: the decider

Their third straight final is the one both men still talk about as the best of the trilogy. Becker rallied from two sets down to level it at two-all, but Edberg closed it out 6-2, 6-2, 3-6, 3-6, 6-4, sealing the fifth set with a topspin lob winner. Three finals, three different winners, and neither man ever got the chance at a fourth — no other pairing has played three consecutive Wimbledon finals against each other since.

## Off the fast courts, a different story

Away from grass and the biggest stage, Becker's dominance was even clearer: 13-4 on carpet, 7-3 on hard courts, and only tied 1-1 on clay, a surface neither man specialized in. It's a reminder that the Wimbledon trilogy, as good as it was, was really the exception in an otherwise one-sided rivalry — which somehow makes those three finals matter even more.`,
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    status: "in_review",
    editorialNote: "Sourced from Wikipedia's Becker-Edberg rivalry page (full head-to-head, surface breakdown, 1988/1989/1990 Wimbledon final scores), tennisworldusa.org and tennis.com coverage of the trilogy, accessed 14 Aug 2026. Fact/opinion check: all records and scores sourced as above. Framing throughout is editorial voice.",
    publishedAt: new Date("2026-07-31T10:00:00Z"),
  },
  {
    slug: "seles-vs-graf-rivalry-interrupted-by-an-attack",
    title: "Seles vs. Graf — A Rivalry Interrupted By an Attack That Changed Tennis",
    sport: ["tennis"],
    sportingEventId: null,
    contentCategory: "rivalry",
    excerpt: "Steffi Graf led their head-to-head 10-5. But the number that matters more is the split: 6-4 before April 1993, and 4-1 after — the year Monica Seles was stabbed on court, and the rivalry never fully recovered.",
    bodyContent: `Before April 1993, this was one of the most competitive rivalries in women's tennis. Monica Seles had taken the world No. 1 ranking from Steffi Graf in March 1991 and won seven of nine Grand Slam titles across the following two years. Their head-to-head through that stretch sat at 6-4 in Graf's favor — close, active, genuinely contested. Then, on April 30, 1993, everything about this rivalry changed, for reasons that had nothing to do with tennis.

## What happened in Hamburg

Seles was playing a quarterfinal match at the Rothenbaum Tennis Club, leading 4-3 in the second set after winning the first, when a man named Günter Parche approached her during a changeover and stabbed her in the back with a nine-inch knife. Parche was later found to have targeted Seles specifically because he wanted Graf to reclaim the world No. 1 ranking. Seles survived the physical injury, but she didn't play another competitive match for over two years.

## A rivalry that resumed, but never the same way

Graf reclaimed the No. 1 ranking that June, with Seles out of the sport entirely. When Seles eventually returned, the two players met five more times between 1995 and 1999 — and Graf won four of them, giving Graf the full career head-to-head, 10-5 across 15 matches. But the pre- and post-1993 splits tell the real story: 6-4 in Graf's favor before the attack, 4-1 in Graf's favor after it. The rivalry didn't end in April 1993. It just stopped being a fair fight.

## What it changed beyond the scoreline

The attack on Seles is widely credited with prompting real changes in how tournaments handle player security — a grim, lasting legacy that has nothing to do with either woman's tennis. It's impossible to say with certainty what the rest of this rivalry would have looked like without it. What's certain is that one of the most promising rivalries of its era was cut short by something that happened off the court entirely, and neither the sport nor the two players involved ever fully got that trajectory back.`,
    heroImageUrl: null,
    heroImageAlt: null,
    heroImageCredit: null,
    status: "in_review",
    editorialNote: "Sourced from Wikipedia's Graf-Seles rivalry page (full head-to-head with before/after split), ESPN \"Isaacson: Stabbing stole Monica Seles' career,\" Tennis.com \"TBT, 1993 Hamburg\" retrospective, accessed 14 Aug 2026. Fact/opinion check: the head-to-head splits, the attack's date/circumstances/motive, and Seles's two-year absence are all sourced as above. This piece handles a real assault on a named individual — written factually, without sensationalizing detail, and without characterizing the attacker beyond his documented, stated motive. Framing (\"stopped being a fair fight,\" closing paragraph) is editorial voice grounded in the sourced facts, not speculation.",
    publishedAt: new Date("2026-08-01T10:00:00Z"),
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

console.log(`\nDone — seeded ${inserted} tennis rivalry blog articles (status: in_review)`);
await client.end();

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const BRIEF_TO = "deepak0408@gmail.com";

// RSS feeds — BBC Sport as primary (reliable, no Cloudflare blocks)
// Motorsport.com for supplementary F1 depth
const FEEDS = [
  { sport: "Tennis",   emoji: "🎾", url: "https://feeds.bbci.co.uk/sport/tennis/rss.xml" },
  { sport: "Golf",     emoji: "⛳", url: "https://feeds.bbci.co.uk/sport/golf/rss.xml" },
  { sport: "F1",       emoji: "🏎️", url: "https://feeds.bbci.co.uk/sport/formula1/rss.xml" },
  { sport: "Cricket",  emoji: "🏏", url: "https://feeds.bbci.co.uk/sport/cricket/rss.xml" },
  { sport: "Football", emoji: "⚽", url: "https://feeds.bbci.co.uk/sport/football/rss.xml" },
];

// Ongoing major events — update this list as events change
const ONGOING_EVENTS = [
  { name: "Wimbledon 2026", sport: "Tennis",   dates: "30 Jun–13 Jul 2026" },
  { name: "India in England Cricket", sport: "Cricket", dates: "Jun–Jul 2026" },
  { name: "The Open Championship", sport: "Golf", dates: "16–19 Jul 2026, Royal Birkdale" },
  { name: "Belgian Grand Prix", sport: "F1",    dates: "25–27 Jul 2026, Spa-Francorchamps" },
];

interface FeedItem {
  sport: string;
  emoji: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
}

function extractText(xml: string, tag: string): string {
  const cdataMatch = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i").exec(xml);
  if (cdataMatch) return cdataMatch[1].trim();
  const plainMatch = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i").exec(xml);
  return plainMatch ? plainMatch[1].replace(/<[^>]+>/g, "").trim() : "";
}

function stripHtml(str: string): string {
  return str.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
}

async function fetchFeed(feed: { sport: string; emoji: string; url: string }): Promise<FeedItem[]> {
  try {
    const res = await fetch(feed.url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ExperiencesCurated/1.0)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const items: FeedItem[] = [];
    const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/gi);
    for (const match of itemMatches) {
      const block = match[1];
      const title = stripHtml(extractText(block, "title"));
      const description = stripHtml(extractText(block, "description")).slice(0, 200);
      const link = extractText(block, "link") || extractText(block, "guid");
      const pubDate = extractText(block, "pubDate");
      if (title) items.push({ sport: feed.sport, emoji: feed.emoji, title, description, link, pubDate });
      if (items.length >= 5) break;
    }
    return items;
  } catch {
    return [];
  }
}

// Score a story higher if it relates to an ongoing major event
function relevanceScore(item: FeedItem): number {
  const text = (item.title + " " + item.description).toLowerCase();
  let score = 0;
  for (const event of ONGOING_EVENTS) {
    const keywords = event.name.toLowerCase().split(" ");
    if (keywords.some(k => k.length > 3 && text.includes(k))) score += 2;
  }
  return score;
}

function buildSocialCaption(item: FeedItem, rank: number): string {
  const ongoingEvent = ONGOING_EVENTS.find(e =>
    e.sport === item.sport &&
    (item.title + item.description).toLowerCase().includes(e.name.split(" ")[0].toLowerCase())
  );
  const eventTag = ongoingEvent ? ` #${ongoingEvent.name.replace(/\s+/g, "")}` : "";

  const hashtagMap: Record<string, string> = {
    Tennis:   "#Tennis #Wimbledon2026 #GrandSlam #TennisFan",
    Golf:     "#Golf #TheOpen #OpenChampionship #GolfFan",
    F1:       "#F1 #Formula1 #BelgianGP #Spa",
    Cricket:  "#Cricket #IndiaInEngland #TestCricket #CricketFan",
    Football: "#Football #Soccer #FootballNews",
  };

  const hashtags = (hashtagMap[item.sport] ?? "") + eventTag + " #ExperiencesCurated";
  const caption = item.description.length > 20 ? item.description : item.title;

  return `${item.emoji} ${caption}\n\n${hashtags}`;
}

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch all feeds in parallel
  const allItems = (await Promise.all(FEEDS.map(fetchFeed))).flat();

  if (allItems.length === 0) {
    return NextResponse.json({ error: "No feed items fetched" }, { status: 500 });
  }

  // Sort: ongoing event stories first, then by feed order
  const sorted = allItems.sort((a, b) => relevanceScore(b) - relevanceScore(a));

  // Pick top 10 with at least 1 story per sport where possible
  const top10: FeedItem[] = [];
  const sportsUsed = new Set<string>();

  // First pass — one per sport
  for (const item of sorted) {
    if (!sportsUsed.has(item.sport) && top10.length < 10) {
      top10.push(item);
      sportsUsed.add(item.sport);
    }
  }
  // Second pass — fill remaining slots by relevance
  for (const item of sorted) {
    if (!top10.includes(item) && top10.length < 10) {
      top10.push(item);
    }
  }

  const top5 = top10.slice(0, 5);

  // Date label
  const now = new Date();
  const dateLabel = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  // Ongoing events context block
  const ongoingHtml = ONGOING_EVENTS.map(e =>
    `<span style="display:inline-block;margin-right:12px;margin-bottom:6px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:4px;padding:2px 8px;font-size:12px;color:#166534">${e.name} · ${e.dates}</span>`
  ).join("");

  // Block 1 — Top 10 headlines
  const headlinesHtml = top10.map((item, i) =>
    `<tr>
      <td style="padding:8px 0;vertical-align:top;color:#a3a3a3;font-size:13px;width:24px">${i + 1}.</td>
      <td style="padding:8px 0 8px 8px">
        <span style="font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#a3a3a3">${item.emoji} ${item.sport}</span><br>
        <a href="${item.link}" style="font-size:14px;font-weight:600;color:#171717;text-decoration:none;line-height:1.4">${item.title}</a>
      </td>
    </tr>`
  ).join("");

  // Block 2 — Top 5 with captions
  const captionsHtml = top5.map((item, i) => {
    const caption = buildSocialCaption(item, i + 1);
    const captionEscaped = caption.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<div style="margin-bottom:28px;padding:20px;background:#fafafa;border-radius:8px;border:1px solid #e5e5e5">
      <p style="font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#a3a3a3;margin:0 0 6px">${item.emoji} ${item.sport} — Story ${i + 1}</p>
      <p style="font-size:14px;font-weight:700;color:#171717;margin:0 0 8px;line-height:1.4">${item.title}</p>
      <p style="font-size:13px;color:#525252;margin:0 0 16px;line-height:1.5">${item.description}</p>
      <div style="background:#fff;border:1px solid #d4d4d4;border-radius:6px;padding:14px">
        <p style="font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#a3a3a3;margin:0 0 8px">Ready to post caption</p>
        <pre style="font-size:13px;color:#171717;margin:0;white-space:pre-wrap;font-family:inherit;line-height:1.6">${captionEscaped}</pre>
      </div>
      <p style="margin:10px 0 0"><a href="${item.link}" style="font-size:12px;color:#6366f1">Read full story →</a></p>
    </div>`;
  }).join("");

  const html = `
    <div style="font-family:sans-serif;max-width:620px;margin:0 auto;padding:40px 24px;color:#171717">
      <p style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#a3a3a3;margin-bottom:6px">Experiences | Curated</p>
      <h1 style="font-size:22px;font-weight:700;margin:0 0 4px">Your Sports Brief</h1>
      <p style="font-size:13px;color:#a3a3a3;margin:0 0 20px">${dateLabel}</p>

      <div style="margin-bottom:28px">
        <p style="font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#a3a3a3;margin-bottom:8px">Ongoing major events</p>
        ${ongoingHtml}
      </div>

      <h2 style="font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#a3a3a3;border-bottom:2px solid #171717;padding-bottom:8px;margin-bottom:0">Top 10 Headlines</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:40px">
        ${headlinesHtml}
      </table>

      <h2 style="font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#a3a3a3;border-bottom:2px solid #171717;padding-bottom:8px;margin-bottom:20px">Top 5 — Ready to Post</h2>
      ${captionsHtml}

      <p style="font-size:11px;color:#a3a3a3;margin-top:32px;border-top:1px solid #e5e5e5;padding-top:16px">
        Delivered daily at 7am IST · Sources: BBC Sport, Motorsport.com · Experiences | Curated
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: "Experiences | Curated <hello@experiences-curated.com>",
      to: BRIEF_TO,
      subject: `Your Sports Brief — ${dateLabel}`,
      html,
    });
  } catch (err) {
    console.error("[sports-brief] email failed:", err);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, storiesFound: allItems.length, sent: BRIEF_TO });
}

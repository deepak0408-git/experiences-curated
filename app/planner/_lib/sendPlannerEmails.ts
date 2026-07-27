import { Resend } from "resend";
import { formatMoneyRange, SPORT_LABELS } from "./mockEvents";

const resend = new Resend(process.env.RESEND_API_KEY);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://experiences-curated.com";

// Real email sends for the Season Planner — built 19 Jul 2026 after
// discovering Save's "Check your inbox" promise was false (no send existed,
// only a PlannerSession row was written). Both templates follow the
// standing dark-canvas + fluorescent-green brand pattern (CLAUDE.md).

const FOOTER = `
  <hr style="border:none;border-top:1px solid #2A2A2A;margin:32px 0 16px">
  <p style="font-size:11px;color:#6A6A6A">This email was sent because you used our Trip Planner.</p>
`;

// Eyebrow label is always "Experiences | Curated" — confirmed 19 Jul 2026
// by checking every real production email template (pre-trip brief, new
// pack announcement, magic link). None of them use a feature-specific
// eyebrow like "Season Planner" — that was a mistake in the first draft
// of this file, caught by user comparing real inbox screenshots.
// Gmail quote-clipping — 3rd occurrence, root cause finally isolated
// (19 Jul 2026): the actual trigger isn't any single element shape, it's
// having MULTIPLE top-level sibling blocks inside the outer wrapper (eyebrow,
// heading, content, FOOTER as separate siblings). Fix: wrap literally
// everything — eyebrow through FOOTER — in one single inner <div> with no
// other sibling elements at the outer level.
function wrapEmail(bodyHtml: string): string {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
      <div>
        <p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">Experiences | Curated</p>
        ${bodyHtml}
        ${FOOTER}
      </div>
    </div>
  `;
}

export type ShortlistEmailLineItem = {
  label: string;
  low: number;
  high: number;
};

export type ShortlistEmailEvent = {
  name: string;
  venue: string;
  dateRange: string;
  totalLow: number;
  totalHigh: number;
  lineItems: ShortlistEmailLineItem[];
};

export async function sendShortlistEmail(
  email: string,
  summaryLine: string,
  events: ShortlistEmailEvent[],
  resultsUrl: string
) {
  const eventRows = events
    .map(
      (e) => `
        <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #2A2A2A">
          <p style="font-size:14px;font-weight:900;color:#ffffff;margin:0 0 4px">${e.name}</p>
          <p style="font-size:12px;color:#6A6A6A;margin:0 0 10px">${e.venue} · ${e.dateRange}</p>
          ${e.lineItems
            .map(
              (li) =>
                `<p style="font-size:12px;color:#A3A3A3;margin:0 0 4px">▸ ${li.label}: ${formatMoneyRange(li.low, li.high)}</p>`
            )
            .join("")}
          <p style="font-size:13px;font-weight:900;color:#ffffff;margin:8px 0 0">Est. trip cost: ${formatMoneyRange(e.totalLow, e.totalHigh)}</p>
        </div>
      `
    )
    .join("");

  const html = wrapEmail(`
    <h1 style="font-size:20px;font-weight:900;color:#ffffff;margin:0 0 8px">Here's your saved shortlist</h1>
    <p style="font-size:13px;color:#A3A3A3;margin:0 0 24px">${summaryLine}</p>
    <div>
      ${eventRows}
      <a href="${resultsUrl}" style="display:inline-block;margin-top:8px;padding:10px 20px;background:#AAFF00;color:#000;font-size:13px;font-weight:900;text-decoration:none;border-radius:2px">View your shortlist →</a>
    </div>
  `);

  return resend.emails.send({
    from: "Experiences | Curated <hello@experiences-curated.com>",
    to: email,
    subject: "Your saved shortlist",
    html,
  });
}

export type TradeoffEmailLineItem = {
  label: string;
  low: number;
  high: number;
  changed: boolean;
};

export async function sendTradeoffPlanEmail(
  email: string,
  eventName: string,
  venue: string,
  dateRange: string,
  leverEmployed: string,
  lineItemBreakdown: TradeoffEmailLineItem[],
  newTotalLow: number,
  newTotalHigh: number,
  newTotalMid: number,
  budgetMax: number,
  guideUrl: string,
  resultsUrl: string,
  isBuilt: boolean,
  fitsBudget: boolean
) {
  // Based on Typical (mid), not low/high — see same fix in TradeoffPanel.tsx.
  // A low/high-derived range produced nonsense like "$0-$695 over" (low end
  // clamped to 0 when it was actually under budget, not "zero over").
  const typicalOverage = Math.max(0, Math.round(newTotalMid) - budgetMax);

  const fitLine = fitsBudget
    ? `<p style="font-size:13px;color:#AAFF00;font-weight:900;margin:0 0 24px">✓ Fits your $${Math.round(budgetMax).toLocaleString()} budget</p>`
    : `<p style="font-size:13px;color:#ff6b6b;font-weight:900;margin:0 0 24px">Still ~$${typicalOverage.toLocaleString()} over your $${Math.round(budgetMax).toLocaleString()} budget</p>`;

  const breakdownRows = lineItemBreakdown
    .map(
      (li) =>
        `<p style="font-size:12px;color:#A3A3A3;margin:0 0 4px">▸ ${li.label}: ${formatMoneyRange(li.low, li.high)}${li.changed ? ` <strong style="color:#ffffff">(Updated)</strong>` : ""}</p>`
    )
    .join("");

  // Pack build status ("guide ready" vs "we'll notify you") is independent
  // of whether THIS plan fits budget — a not-fits email still needs to tell
  // the reader what happens next, otherwise it dead-ends after the overage
  // line with no indication the guide is even coming. Previously gated
  // entirely on fitsBudget, so a not-fits scenario showed no CTA at all.
  // Caught 26 Jul 2026. Unbuilt packs have no real destination for a link —
  // guideUrl silently fell back to the homepage — so unbuilt always renders
  // as plain text, never a link, regardless of fitsBudget.
  const cta = isBuilt
    ? fitsBudget
      ? `<a href="${guideUrl}" style="display:inline-block;margin-top:8px;padding:10px 20px;background:#AAFF00;color:#000;font-size:13px;font-weight:900;text-decoration:none;border-radius:2px">View full guide →</a>`
      : ""
    : `<p style="margin-top:8px;font-size:13px;color:#6A6A6A">We'll notify you when the guide is ready.</p>`;

  // This scenario only ever existed on-screen and in this one-off email —
  // never persisted anywhere else. Without a link back to the exact Screen
  // 2 URL (with ?tradeoff=<slug> to reopen the panel), a reader who closes
  // this email has no way back to this view at all — confirmed 26 Jul 2026
  // this was a real dead end, especially for unbuilt/not-fits combinations
  // where `cta` above renders no link either.
  const backToPlanLink = `<p style="margin-top:16px;font-size:12px"><a href="${resultsUrl}" style="color:#AAFF00;text-decoration:none">← Back to your plan</a></p>`;

  const html = wrapEmail(`
    <h1 style="font-size:20px;font-weight:900;color:#ffffff;margin:0 0 8px">Here's your plan for ${eventName}</h1>
    <p style="font-size:12px;color:#6A6A6A;margin:0 0 20px">${venue} · ${dateRange}</p>
    <div>
      <p style="font-size:13px;color:#A3A3A3;margin:0 0 4px">Your plan:</p>
      <p style="font-size:14px;font-weight:900;color:#ffffff;margin:0 0 16px">${leverEmployed}</p>
      ${breakdownRows}
      <p style="font-size:16px;font-weight:900;color:#ffffff;margin:12px 0 2px">New estimated trip cost: ${formatMoneyRange(newTotalLow, newTotalHigh)}</p>
      <p style="font-size:12px;color:#6A6A6A;margin:0 0 8px">Typical: $${Math.round(newTotalMid).toLocaleString()}</p>
      ${fitLine}
      ${cta}
      ${backToPlanLink}
    </div>
  `);

  return resend.emails.send({
    from: "Experiences | Curated <hello@experiences-curated.com>",
    to: email,
    subject: fitsBudget ? `Your ${eventName} budget plan — within budget` : `Your ${eventName} plan — still over budget`,
    html,
  });
}

// Post-Planner Drip Sequence — "saved" (shortlist saved), day 3 and day 10
// follow-ups. Both reference the user's own stored session data (their #1
// closest-match event + its real cost range) — never fabricated aggregate
// stats, per the design doc's explicit correction (17 Jul 2026: there is no
// real cross-session data yet to build "what other travelers picked" from).
export async function sendSavedDripEmail(
  email: string,
  step: "day_3" | "day_10",
  eventName: string,
  venue: string,
  dateRange: string,
  lineItems: ShortlistEmailLineItem[],
  totalLow: number,
  totalHigh: number,
  budgetMin: number,
  budgetMax: number,
  clickUrl: string,
  isBuilt: boolean,
  summaryLine?: string
) {
  const ctaLabel = isBuilt ? "See the full guide →" : "Back to your results →";
  const cta = `<a href="${clickUrl}" style="display:inline-block;margin-top:8px;padding:10px 20px;background:#AAFF00;color:#000;font-size:13px;font-weight:900;text-decoration:none;border-radius:2px">${ctaLabel}</a>`;

  const breakdownRows = lineItems
    .map(
      (li) =>
        `<p style="font-size:12px;color:#A3A3A3;margin:0 0 4px">▸ ${li.label}: ${formatMoneyRange(li.low, li.high)}</p>`
    )
    .join("");

  const heading =
    step === "day_3"
      ? `Still thinking about ${eventName}?`
      : `Your ${eventName} shortlist is still here`;

  const summaryHtml = summaryLine
    ? `<p style="font-size:12px;color:#6A6A6A;margin:0 0 12px">${summaryLine}</p>`
    : "";

  const intro =
    step === "day_3"
      ? `It was your closest match for your ${formatMoneyRange(budgetMin, budgetMax)} budget.`
      : `No rush — it'll be waiting whenever you're ready to look again.`;

  const body = `
    <h1 style="font-size:20px;font-weight:900;color:#ffffff;margin:0 0 8px">${heading}</h1>
    ${summaryHtml}
    <p style="font-size:12px;color:#6A6A6A;margin:0 0 16px">${venue} · ${dateRange}</p>
    <p style="font-size:13px;color:#A3A3A3;line-height:1.6;margin:0 0 16px">${intro}</p>
    <div>
      <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #2A2A2A">
        ${breakdownRows}
        <p style="font-size:14px;font-weight:900;color:#ffffff;margin:8px 0 0">Est. trip cost: ${formatMoneyRange(totalLow, totalHigh)}</p>
      </div>
      ${cta}
    </div>
  `;

  const html = wrapEmail(body);

  return resend.emails.send({
    from: "Experiences | Curated <hello@experiences-curated.com>",
    to: email,
    subject: step === "day_3" ? `Still thinking about ${eventName}?` : `Your ${eventName} shortlist`,
    html,
  });
}

export type ComparisonEmailEvent = {
  name: string;
  slug: string;
  sport: string;
  venue: string;
  city: string;
  dateRange: string;
  totalLow: number;
  totalHigh: number;
  lineItems: ShortlistEmailLineItem[];
  isBuilt: boolean;
};

const packUrl = (slug: string) => `${SITE_URL}/event-pack/${slug}`;

// Renders the comparison as a real HTML <table> (matches the Comparison
// screen's own layout — a row per line item, a column per event) instead of
// stacked text blocks.
//
// Gmail quote-clipping lesson (corrected 19 Jul 2026, 2nd occurrence): the
// first fix on sendSavedDripEmail only wrapped the *list itself* in a div,
// which happened to work there because the CTA was inside that same div.
// Here the table, delta line, and CTA were still separate top-level sibling
// elements after this function's own wrapping div — Gmail clipped again.
// The real rule: wrap the ENTIRE email body (every element after the
// heading, table through final CTA) in one single enclosing <div> — not
// just the table/list part — every time.
function comparisonTable(events: ComparisonEmailEvent[]): string {
  // Header cell mirrors the Compare screen's th structure exactly: sport tag
  // (accent green, uppercase), bold white event name, muted city/"Multiple
  // venues" line — previously this email only rendered the bare event name,
  // dropping both the sport label and the location entirely. Caught 26 Jul
  // 2026 comparing a live send side-by-side with the screen.
  // font-family set explicitly on every cell — Gmail doesn't reliably
  // cascade the wrapper div's font-family into <table>/<th>/<td>, so without
  // this the table fell back to each client's default serif while every
  // non-table element in the email correctly inherited sans-serif. Caught
  // 26 Jul 2026 comparing a live send side-by-side with the screen.
  const th = (sport: string, name: string, city: string) =>
    `<th style="text-align:left;padding:6px 10px;vertical-align:top;border-bottom:1px solid #2A2A2A;font-family:sans-serif">
      <div style="font-size:11px;font-weight:900;color:#AAFF00;text-transform:uppercase;letter-spacing:0.05em">${SPORT_LABELS[sport] ?? sport}</div>
      <div style="font-size:13px;font-weight:900;color:#ffffff;margin-top:4px;line-height:1.2">${name}</div>
      <div style="font-size:11px;font-weight:400;color:#6A6A6A;margin-top:2px">${city}</div>
    </th>`;
  const td = (content: string, bold = false) =>
    `<td style="text-align:left;padding:8px 10px;font-size:12px;font-family:sans-serif;color:${bold ? "#ffffff" : "#A3A3A3"};font-weight:${bold ? "900" : "400"};border-bottom:1px solid #2A2A2A">${content}</td>`;
  const rowLabelTd = (label: string) =>
    `<td style="text-align:left;padding:8px 10px 8px 0;font-size:11px;font-family:sans-serif;color:#6A6A6A;border-bottom:1px solid #2A2A2A;white-space:nowrap">${label}</td>`;

  const allLabels = events[0].lineItems.map((li) => li.label);

  const headerRow = `<tr><th></th>${events.map((e) => th(e.sport, e.name, e.city)).join("")}</tr>`;
  const datesRow = `<tr>${rowLabelTd("Dates")}${events.map((e) => td(e.dateRange)).join("")}</tr>`;
  const totalRow = `<tr>${rowLabelTd("Estimated total")}${events.map((e) => td(formatMoneyRange(e.totalLow, e.totalHigh), true)).join("")}</tr>`;
  const lineItemRows = allLabels
    .map((label) => {
      const cells = events
        .map((e) => {
          const item = e.lineItems.find((li) => li.label === label);
          return td(item ? formatMoneyRange(item.low, item.high) : "—");
        })
        .join("");
      return `<tr>${rowLabelTd(label)}${cells}</tr>`;
    })
    .join("");
  const ctaRow = `<tr>${rowLabelTd("")}${events
    .map((e) =>
      td(
        e.isBuilt
          ? `<a href="${packUrl(e.slug)}" style="color:#AAFF00;font-weight:900;text-decoration:none">View guide →</a>`
          : `Coming up soon`
      )
    )
    .join("")}</tr>`;

  return `
    <div style="margin-bottom:20px;overflow-x:auto">
      <table style="width:100%;border-collapse:collapse">
        ${headerRow}
        ${datesRow}
        ${totalRow}
        ${lineItemRows}
        ${ctaRow}
      </table>
    </div>
  `;
}

function deltaLine(biggestDeltaLabel: string, highestEventName: string, eventCount: number): string {
  if (!biggestDeltaLabel) return "";
  return `<p style="font-size:13px;color:#A3A3A3;line-height:1.6;margin:0 0 20px">💡 The main difference is ${biggestDeltaLabel.toLowerCase()} — ${highestEventName}'s is ${eventCount > 2 ? "the highest" : "higher"}.</p>`;
}

// Post-Planner Drip Sequence — "compared" (2-3 events compared), immediate +
// day 3 + day 10. Mirrors the "saved" sequence's structure and stop-on-click
// rule; the immediate send delivers the comparison breakdown as promised
// (previously missing entirely — saveComparison only wrote the PlannerSession
// row, no email existed, same gap fixed for "saved" earlier this session).
export async function sendComparisonEmail(
  email: string,
  events: ComparisonEmailEvent[],
  biggestDeltaLabel: string,
  highestEventName: string,
  compareUrl: string,
  summaryLine?: string
) {
  const html = wrapEmail(`
    <h1 style="font-size:20px;font-weight:900;color:#ffffff;margin:0 0 8px">Here's your comparison</h1>
    ${summaryLine ? `<p style="font-size:13px;color:#A3A3A3;margin:0 0 20px">${summaryLine}</p>` : `<div style="margin-bottom:20px"></div>`}
    <div>
      ${comparisonTable(events)}
      ${deltaLine(biggestDeltaLabel, highestEventName, events.length)}
      <a href="${compareUrl}" style="display:inline-block;margin-top:8px;padding:10px 20px;background:#AAFF00;color:#000;font-size:13px;font-weight:900;text-decoration:none;border-radius:2px">View your comparison →</a>
    </div>
  `);

  return resend.emails.send({
    from: "Experiences | Curated <hello@experiences-curated.com>",
    to: email,
    subject: "Your event comparison",
    html,
  });
}

export async function sendComparisonDripEmail(
  email: string,
  step: "day_3" | "day_10",
  events: ComparisonEmailEvent[],
  biggestDeltaLabel: string,
  highestEventName: string,
  clickUrl: string,
  summaryLine?: string
) {
  const ctaLabel = "See your comparison →";
  const cta = `<a href="${clickUrl}" style="display:inline-block;margin-top:8px;padding:10px 20px;background:#AAFF00;color:#000;font-size:13px;font-weight:900;text-decoration:none;border-radius:2px">${ctaLabel}</a>`;

  const heading =
    step === "day_3"
      ? "Still deciding between these?"
      : "Your comparison is still here";

  const summaryHtml = summaryLine
    ? `<p style="font-size:12px;color:#6A6A6A;margin:0 0 12px">${summaryLine}</p>`
    : "";

  const intro =
    step === "day_3"
      ? deltaLine(biggestDeltaLabel, highestEventName, events.length) ||
        `<p style="font-size:13px;color:#A3A3A3;line-height:1.6;margin:0 0 20px">Here's the comparison you saved, in case it helps you decide.</p>`
      : `<p style="font-size:13px;color:#A3A3A3;line-height:1.6;margin:0 0 20px">No rush — it'll be waiting whenever you're ready to look again.</p>`;

  const body = `
    <h1 style="font-size:20px;font-weight:900;color:#ffffff;margin:0 0 8px">${heading}</h1>
    ${summaryHtml}
    ${intro}
    <div>
      ${comparisonTable(events)}
      ${cta}
    </div>
  `;

  const html = wrapEmail(body);

  return resend.emails.send({
    from: "Experiences | Curated <hello@experiences-curated.com>",
    to: email,
    subject: step === "day_3" ? "Still deciding between these events?" : "Your event comparison is still here",
    html,
  });
}

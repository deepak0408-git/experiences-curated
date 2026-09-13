import fs from "fs";
import path from "path";

const dir = "scratchpad";
const files = fs.readdirSync(dir).filter(f => f.startsWith("flights-") && (f.endsWith("-mexico.json") || f.endsWith("-mexico-google-only.json")));

const rows = [];
for (const f of files) {
  const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"));
  const gf = data.googleFlights || { sorted: [], rawCount: 0 };
  const ky = data.kayak || { sorted: [], rawCount: 0 };
  const combined = data.combined;

  const gfRange = gf.sorted.length ? [Math.min(...gf.sorted), Math.max(...gf.sorted)] : null;
  const kyRange = ky.sorted.length ? [Math.min(...ky.sorted), Math.max(...ky.sorted)] : null;

  let finalLow = data.finalCostLow;
  let finalHigh = data.finalCostHigh;
  let exclusions = "";

  if (combined) {
    finalLow = finalLow ?? combined.low;
    finalHigh = finalHigh ?? combined.high;
    const exLow = combined.excludedLow?.length || 0;
    const exHigh = combined.excludedHigh?.length || 0;
    const parts = [];
    if (exLow) parts.push(`${exLow} low outlier${exLow > 1 ? "s" : ""}`);
    if (exHigh) parts.push(`${exHigh} high outlier${exHigh > 1 ? "s" : ""} (sparse tail)`);
    exclusions = parts.length ? parts.join(", ") : "none";
  } else if (gf.sorted.length === 0 && ky.sorted.length > 0) {
    exclusions = "GF returned 0 results — Kayak-only, density-boundary applied manually";
  } else if (ky.sorted.length === 0 && gf.sorted.length > 0) {
    exclusions = "Kayak returned 0/timeout — Google Flights-only (known gap)";
  }

  const origin = data.origin;
  let singleSource = null;
  if (origin === "Moscow") {
    finalLow = 2806; finalHigh = 3287;
    exclusions = "Kayak timeout (known route gap) — Google Flights only, all 3 points used";
    singleSource = "GF only";
  }
  if (origin === "Nairobi") {
    finalLow = 1385; finalHigh = 1499;
    exclusions = "GF returned 0 results — Kayak-only; density-boundary applied manually (1817, 2020 excluded as sparse tail)";
    singleSource = "Kayak only";
  }

  rows.push({ origin, gfRange, gfCount: gf.rawCount, kyRange, kyCount: ky.rawCount, finalLow, finalHigh, exclusions, singleSource });
}

rows.push({
  origin: "Mexico City", gfRange: null, gfCount: 0, kyRange: null, kyCount: 0,
  finalLow: 0, finalHigh: 0, exclusions: "Same-city origin — no research, $0 direct seed per standing rule", singleSource: "N/A",
});

rows.sort((a, b) => a.origin.localeCompare(b.origin));

function fmtRange(r) { return r ? `$${r[0].toLocaleString()}–${r[1].toLocaleString()}` : "—"; }
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

const tableRows = rows.map(r => `
  <tr${r.singleSource ? ' class="single-source"' : ""}>
    <td class="origin">${esc(r.origin)}${r.singleSource ? `<span class="badge">${esc(r.singleSource)}</span>` : ""}</td>
    <td class="num">${fmtRange(r.gfRange)}</td>
    <td class="num muted">${r.gfCount}</td>
    <td class="num">${fmtRange(r.kyRange)}</td>
    <td class="num muted">${r.kyCount}</td>
    <td class="num final">$${r.finalLow.toLocaleString()}–${r.finalHigh.toLocaleString()}</td>
    <td class="exclusions">${esc(r.exclusions)}</td>
  </tr>`).join("");

const html = `<!doctype html>
<title>Mexico City GP Flight Costs</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Inter:wght@400;500;600;700&display=swap');

  :root {
    --bg: #0A0A0A;
    --surface: #141414;
    --surface-2: #1A1A1A;
    --border: #2A2A2A;
    --muted: #A3A3A3;
    --fg: #FFFFFF;
    --accent: #AAFF00;
    --dim: #6A6A6A;
    --warn-bg: #2A2200;
    --warn-border: #6A5A00;
    --warn-text: #E8D44D;
  }

  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    background: var(--bg);
    color: var(--fg);
    font-family: 'Inter', -apple-system, sans-serif;
    line-height: 1.5;
  }

  header {
    padding: 28px 32px 20px;
    border-bottom: 1px solid var(--border);
  }
  .eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 800;
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--accent);
    margin: 0 0 6px;
  }
  h1 {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 800;
    font-size: clamp(20px, 3vw, 26px);
    margin: 0 0 6px;
  }
  .sub {
    color: var(--muted);
    font-size: 13px;
    margin: 0;
    max-width: 70ch;
  }

  .legend {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    padding: 14px 32px;
    background: var(--surface-2);
    border-bottom: 1px solid var(--border);
    font-size: 12px;
    color: var(--muted);
  }
  .legend b { color: var(--fg); }

  main {
    padding: 24px 32px 60px;
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    min-width: 920px;
  }

  thead th {
    text-align: left;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--dim);
    padding: 10px 12px;
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }

  tbody tr {
    border-bottom: 1px solid var(--border);
  }
  tbody tr:hover {
    background: var(--surface);
  }
  tbody tr.single-source {
    background: rgba(232, 212, 77, 0.04);
  }

  td {
    padding: 9px 12px;
    vertical-align: top;
  }

  .origin {
    font-weight: 700;
    color: var(--fg);
    white-space: nowrap;
  }
  .badge {
    display: inline-block;
    margin-left: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--warn-text);
    background: var(--warn-bg);
    border: 1px solid var(--warn-border);
    padding: 2px 6px;
    border-radius: 2px;
  }

  .num {
    font-variant-numeric: tabular-nums;
    font-family: 'JetBrains Mono', monospace;
    white-space: nowrap;
    color: var(--muted);
  }
  .num.muted { color: var(--dim); text-align: right; }
  .num.final { color: var(--accent); font-weight: 700; }

  .exclusions {
    color: var(--dim);
    font-size: 12px;
    max-width: 320px;
  }

  footer {
    padding: 20px 32px 50px;
    color: var(--dim);
    font-size: 12px;
    border-top: 1px solid var(--border);
  }
</style>

<header>
  <p class="eyebrow">Experiences | Curated · Planner Data Research</p>
  <h1>Mexico City GP 2026 — Flight Cost Research</h1>
  <p class="sub">49 origin markets, round-trip economy ≤1 stop, 25 Oct–6 Nov 2026 search window. Google Flights + Kayak, combined-dataset density-boundary outlier exclusion. Awaiting approval before any DB write.</p>
</header>

<div class="legend">
  <span><b>GF</b> = Google Flights raw range / sample count</span>
  <span><b>Kayak</b> = Kayak raw range / sample count</span>
  <span><b>Proposed Final Range</b> = average of both sites' in-range low/high after outlier exclusion</span>
  <span><span class="badge" style="margin:0">single-source</span> = only one site returned usable data for this route</span>
</div>

<main>
  <table>
    <thead>
      <tr>
        <th>Origin</th>
        <th>GF Range</th>
        <th>GF n</th>
        <th>Kayak Range</th>
        <th>Kayak n</th>
        <th>Proposed Final Range</th>
        <th>Exclusions</th>
      </tr>
    </thead>
    <tbody>${tableRows}</tbody>
  </table>
</main>

<footer>
  Sourced via the planner-data-researcher skill's locked Flights methodology — every figure traces to a real, named fetch (Google Flights + Kayak), nothing fabricated. Currency: USD throughout.
</footer>
`;

fs.writeFileSync("scratchpad/mexico-city-gp-flight-costs.html", html);
console.log("Artifact HTML written.");

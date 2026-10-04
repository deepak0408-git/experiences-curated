import fs from "fs";
const dir = "scratchpad/cgp2027-flights";
const files = fs.readdirSync(dir).filter(f => f.endsWith(".json")).sort();

// map iata->city name via origins file
const originsRaw = fs.readFileSync("scratchpad/cgp2027-origins.txt", "utf8").trim().split("\n");
const iataToCity = {};
for (const line of originsRaw) {
  const [city, iata] = line.split("|");
  iataToCity[iata] = city;
}
iataToCity["PVG"] = "Shanghai";

const rows = [];
for (const f of files) {
  const iata = f.replace(".json", "");
  const d = JSON.parse(fs.readFileSync(`${dir}/${f}`, "utf8"));
  const city = iataToCity[iata] || d.origin || iata;
  const gf = d.googleFlights || {};
  const ky = d.kayak || {};
  const gfRange = gf.sorted && gf.sorted.length ? `$${gf.sorted[0]}-${gf.sorted[gf.sorted.length-1]}` : "—";
  const kyRange = ky.sorted && ky.sorted.length ? `$${ky.sorted[0]}-${ky.sorted[ky.sorted.length-1]}` : "—";
  const gfN = gf.rawCount ?? (gf.sorted ? gf.sorted.length : 0);
  const kyN = ky.rawCount ?? (ky.sorted ? ky.sorted.length : 0);

  let finalRange = "—";
  let exclusions = "";
  let singleSource = false;

  if (d.finalCostLow) {
    finalRange = `$${d.finalCostLow}-${d.finalCostHigh}`;
    const exLow = d.combined.excludedLow.length;
    const exHigh = d.combined.excludedHigh.length;
    const parts = [];
    if (exLow) parts.push(`${exLow} low outlier(s)`);
    if (exHigh) parts.push(`${exHigh} high outlier(s)`);
    exclusions = parts.length ? parts.join(", ") : "none — full continuous dense run";
  } else if (d.combined && d.combined.low && !d.finalCostLow) {
    // thin one-site case like Bangalore: fall back to kayak-only or gf-only in-range
    const kyIn = ky.sorted ? ky.sorted.filter(p => p >= d.combined.low && p <= d.combined.high) : [];
    const gfIn = gf.sorted ? gf.sorted.filter(p => p >= d.combined.low && p <= d.combined.high) : [];
    if (kyIn.length && !gfIn.length) {
      finalRange = `$${Math.min(...kyIn)}-${Math.max(...kyIn)}`;
      exclusions = `GF too thin (${gfN} pt, excluded) — Kayak-only; ${d.combined.excludedHigh.length} high outlier(s)`;
      singleSource = true;
    } else if (gfIn.length && !kyIn.length) {
      finalRange = `$${Math.min(...gfIn)}-${Math.max(...gfIn)}`;
      exclusions = `Kayak too thin, excluded — GF-only`;
      singleSource = true;
    }
  } else if ((gf.sorted && gf.sorted.length) && !(ky.sorted && ky.sorted.length)) {
    finalRange = gfRange;
    exclusions = "Kayak returned 0 — Google Flights only (single-source)";
    singleSource = true;
  } else if ((ky.sorted && ky.sorted.length) && !(gf.sorted && gf.sorted.length)) {
    finalRange = kyRange;
    exclusions = "Google Flights returned 0 — Kayak only (single-source)";
    singleSource = true;
  }

  rows.push({ iata, city, gfRange, gfN, kyRange, kyN, finalRange, exclusions, singleSource });
}
console.table(rows.map(r => ({ Origin: r.city, "GF Range": r.gfRange, "GF n": r.gfN, "Kayak Range": r.kyRange, "Kayak n": r.kyN, "Proposed Final": r.finalRange, "Exclusions": r.exclusions })));
fs.writeFileSync("scratchpad/cgp2027-flights-summary.json", JSON.stringify(rows, null, 2));

#!/bin/bash
cd "C:\Users\HP\.claude\projects\ExperienceCurator"

declare -a ROUTES=(
  "Buenos Aires|EZE"
  "Casablanca|CMN"
  "Mexico City|MEX"
  "Moscow|SVO"
)

for route in "${ROUTES[@]}"; do
  IFS='|' read -r city iata <<< "$route"
  slug=$(echo "$city" | tr '[:upper:] ' '[:lower:]_' | tr -d '.')
  outfile="scratchpad/bgt-flights/${slug}.json"
  echo "=== RETRY3: $city ($iata) ==="
  node scripts/_flight-research-tool.mjs "$city" "$iata" "Chennai" "MAA" "2027-01-24" "2027-02-07" "$outfile" 2>&1 | tail -3
done
echo "RETRY3 BATCH COMPLETE"

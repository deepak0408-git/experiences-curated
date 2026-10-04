#!/bin/bash
cd "C:\Users\HP\.claude\projects\ExperienceCurator"
while IFS='|' read -r city iata; do
  [ -z "$city" ] && continue
  outfile="scratchpad/cgp2027-flights/${iata}.json"
  if [ -f "$outfile" ]; then
    echo "skip (exists): $city"
    continue
  fi
  echo "=== researching: $city ($iata) ==="
  node --experimental-strip-types scripts/_flight-research-tool.mjs "$city" "$iata" "Shanghai" "PVG" "2027-04-11" "2027-04-23" "$outfile"
done < scratchpad/cgp2027-origins.txt
echo "ALL DONE"

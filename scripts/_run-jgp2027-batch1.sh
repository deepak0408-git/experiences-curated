#!/bin/bash
cd "C:\Users\HP\.claude\projects\ExperienceCurator"
DEP=2027-04-04
RET=2027-04-16
OUT=scratchpad/jgp2027-flights

declare -a ROUTES=(
"Atlanta ATL"
"Boston BOS"
"Chicago ORD"
"Dallas DFW"
"Los_Angeles LAX"
"Miami MIA"
"Montreal YUL"
"New_York_City JFK"
"Philadelphia PHL"
"San_Francisco SFO"
"Toronto YYZ"
"Vancouver YVR"
"Washington_DC IAD"
"Amsterdam AMS"
"Barcelona BCN"
"Berlin BER"
"Dublin DUB"
"London LHR"
"Madrid MAD"
"Manchester MAN"
"Milan MXP"
"Moscow SVO"
"Munich MUC"
"Paris CDG"
)

for r in "${ROUTES[@]}"; do
  city=$(echo $r | cut -d' ' -f1)
  iata=$(echo $r | cut -d' ' -f2)
  echo "=== $city ($iata) ==="
  node scripts/_flight-research-tool.mjs "$city" "$iata" "Tokyo" "NRT" "$DEP" "$RET" "$OUT/${city}.json" 2>&1
done
echo "BATCH 1 DONE"

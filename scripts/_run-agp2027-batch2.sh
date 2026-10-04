#!/bin/bash
cd "C:\Users\HP\.claude\projects\ExperienceCurator"
DEP=2027-03-28
RET=2027-04-09
OUT=scratchpad/agp2027-flights

declare -a ROUTES=(
"Milan MXP"
"Montreal YUL"
"Moscow SVO"
"Mumbai BOM"
"Munich MUC"
"Nairobi NBO"
"New_Delhi DEL"
"New_York_City JFK"
"Paris CDG"
"Philadelphia PHL"
"Rio_de_Janeiro GIG"
"Rome FCO"
"San_Francisco SFO"
"Sao_Paulo GRU"
"Seoul ICN"
"Shanghai PVG"
"Singapore SIN"
"Stockholm ARN"
"Sydney SYD"
"Tokyo NRT"
"Toronto YYZ"
"Vancouver YVR"
"Washington_DC IAD"
"Zurich ZRH"
)

for r in "${ROUTES[@]}"; do
  city=$(echo $r | cut -d' ' -f1)
  iata=$(echo $r | cut -d' ' -f2)
  echo "=== $city ($iata) ==="
  node scripts/_flight-research-tool.mjs "$city" "$iata" "Melbourne" "MEL" "$DEP" "$RET" "$OUT/${city}.json" 2>&1
done
echo "BATCH 2 DONE"

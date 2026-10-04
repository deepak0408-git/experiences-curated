#!/bin/bash
cd "C:\Users\HP\.claude\projects\ExperienceCurator"
DEP=2027-04-04
RET=2027-04-16
OUT=scratchpad/jgp2027-flights

declare -a ROUTES=(
"Rome FCO"
"Stockholm ARN"
"Zurich ZRH"
"Bangalore BLR"
"Beijing PEK"
"Doha DOH"
"Dubai DXB"
"Hong_Kong HKG"
"Manila MNL"
"Melbourne MEL"
"Mumbai BOM"
"New_Delhi DEL"
"Seoul ICN"
"Shanghai PVG"
"Singapore SIN"
"Sydney SYD"
"Buenos_Aires EZE"
"Mexico_City MEX"
"Rio_de_Janeiro GIG"
"Sao_Paulo GRU"
"Cairo CAI"
"Casablanca CMN"
"Johannesburg JNB"
"Nairobi NBO"
)

for r in "${ROUTES[@]}"; do
  city=$(echo $r | cut -d' ' -f1)
  iata=$(echo $r | cut -d' ' -f2)
  echo "=== $city ($iata) ==="
  node scripts/_flight-research-tool.mjs "$city" "$iata" "Tokyo" "NRT" "$DEP" "$RET" "$OUT/${city}.json" 2>&1
done
echo "BATCH 2 DONE"

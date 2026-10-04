#!/bin/bash
cd "C:\Users\HP\.claude\projects\ExperienceCurator"
DEP=2027-03-28
RET=2027-04-09
OUT=scratchpad/agp2027-flights

declare -a ROUTES=(
"Amsterdam AMS"
"Atlanta ATL"
"Bangalore BLR"
"Barcelona BCN"
"Beijing PEK"
"Berlin BER"
"Boston BOS"
"Buenos_Aires EZE"
"Cairo CAI"
"Casablanca CMN"
"Chicago ORD"
"Dallas DFW"
"Doha DOH"
"Dubai DXB"
"Dublin DUB"
"Hong_Kong HKG"
"Johannesburg JNB"
"London LHR"
"Los_Angeles LAX"
"Madrid MAD"
"Manchester MAN"
"Manila MNL"
"Mexico_City MEX"
"Miami MIA"
)

for r in "${ROUTES[@]}"; do
  city=$(echo $r | cut -d' ' -f1)
  iata=$(echo $r | cut -d' ' -f2)
  echo "=== $city ($iata) ==="
  node scripts/_flight-research-tool.mjs "$city" "$iata" "Melbourne" "MEL" "$DEP" "$RET" "$OUT/${city}.json" 2>&1
done
echo "BATCH 1 DONE"

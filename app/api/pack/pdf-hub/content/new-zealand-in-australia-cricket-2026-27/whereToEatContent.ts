// Extracted static prose from WhereToEatSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/new-zealand-in-australia-cricket-2026-27/WhereToEatSpoke.tsx),
// for the Full Pack PDF build. Prose half only, hand-copied not
// paraphrased.

export const nzAustraliaWhereToEatSpokeContent = {
  intro:
    "Each of the four cities on this tour has its own real, distinct food identity — Perth's built on cheap, excellent Asian cooking; Adelaide runs through its historic Central Market; Melbourne's laneway coffee culture is a genuine reason travellers build extra time into that leg; and Sydney's SCG leg means looking to Paddington, not the ground itself, for a proper meal.",

  // Pro-gated verdict content, matching WhereToEatSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Where we'd actually eat, city by city",
      body:
        "Perth: Tak Chee House in Northbridge for laksa and Hainanese chicken rice — walkable from the CBD, or a short Swan River ferry/rideshare from Perth Stadium. Adelaide: Lucia's at the Central Market for honest Italian pizza and pasta, run by the same family since 1957; Ying Chow on nearby Gouger Street for tea-smoked duck if you want Chinatown instead. The market itself is closed Sunday and Monday — plan around the Tuesday-Saturday window. Melbourne: Brother Baba Budan on Little Bourke Street, one of the laneway-coffee movement's actual originators — expect it to be full by mid-morning. Dukes Coffee Roasters on Flinders Lane is the reliable backup with more seats. Sydney: The Village Inn in Paddington, a 5-minute walk from the SCG — the regularly recommended pre- or post-match pub, since the ground itself sits in Moore Park with no real food precinct of its own.",
    },
    {
      label: "Match-day eating, ground by ground",
      body:
        "Every one of the four grounds has real, decent concourse food — don't plan around it as an afterthought, but don't expect it to be the highlight of the day either. The MCG's food offering genuinely improves the closer you get to Boxing Day itself, since that's when the venue runs its fullest vendor lineup. Adelaide Oval's concourse sits closest in character to the city's own food culture of any of the four grounds — worth actually eating at rather than saving your appetite for after.",
    },
    {
      label: "A real Melbourne laneway coffee sequence",
      body:
        "Start at Brother Baba Budan on Little Bourke Street, then step next door into Rankins Lane itself — a genuinely colourful laneway in its own right, home to Manchester Press if you want a stuffed bagel alongside your coffee. From there it's a 10-15 minute walk down to Degraves Street and Centre Place near Flinders Street Station — Melbourne's most famous laneway strip, with Fieldwork Coffee and Degraves Espresso both worth a stop if Brother Baba Budan already has you sold. Finish at Hosier Lane, a 3-minute walk from Degraves, for the street art the laneways are equally known for. Budget a full morning for this, not a single stop — the walking between laneways is genuinely the point, not a detour from it.",
    },
  ],

  sourcesFooter:
    "Laneway coffee sequence sources: What's On Melbourne and Walk Melbourne (Rankins Lane, Degraves Street/Centre Place, Hosier Lane walking route).",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "where-nz-fans-actually-eat-city-guide" (diningGuide)

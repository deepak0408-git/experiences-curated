import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "day-trips";

// COTA sits inside Austin itself (~15-20 min from downtown), not a satellite
// venue — so this spoke covers both genuine out-of-town day trips (Hill
// Country/Fredericksburg, San Antonio) and Austin's own in-city things to do
// (South Congress, Sixth/Rainey Street, Lady Bird Lake, Zilker/Barton
// Springs, live music, the Super Stage concerts). Spoke mapping agreed with
// the founder before this build — all 8 of these experiences map to
// day-trips per that agreement (itinerary is reserved for the text-only
// hour-by-hour schedule, not standalone activity write-ups).
export default async function DayTripsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const superStage = linkedExperiences.find((e) => e.slug.includes("us-gp-super-stage-concerts"));
  const southCongress = linkedExperiences.find((e) => e.slug.includes("us-gp-south-congress"));
  const sixthRainey = linkedExperiences.find((e) => e.slug.includes("us-gp-sixth-rainey-street"));
  const ladyBirdLake = linkedExperiences.find((e) => e.slug.includes("us-gp-lady-bird-lake"));
  const zilker = linkedExperiences.find((e) => e.slug.includes("us-gp-zilker-barton-springs"));
  const liveMusic = linkedExperiences.find((e) => e.slug.includes("us-gp-austin-live-music"));
  const hillCountry = linkedExperiences.find((e) => e.slug.includes("us-gp-hill-country-fredericksburg"));
  const sanAntonio = linkedExperiences.find((e) => e.slug.includes("us-gp-san-antonio-daytrip"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="United States Grand Prix"
      status="teaser"
      h1="A whole city to explore, plus two real out-of-town options"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      heroImagePosition={spoke.heroImagePosition}
      isUnlocked={isUnlocked}
      ctaCopy="Every place named above is real and free. The pack adds our actual sequencing — which day works for Hill Country versus San Antonio, when to fit in Franklin's line around track sessions, and the one combination of Austin's own neighborhoods that genuinely doesn't fit into a single day."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Circuit of the Americas sits inside Austin itself, a 15-20 minute drive from downtown — not a satellite
        venue that needs its own day-trip logic. That means the whole city is genuinely part of the trip, not a
        separate excursion, and there are two real out-of-town options worth an extra day if your schedule allows.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Austin&apos;s own neighborhoods</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {southCongress && <SpokeExperienceCard experience={southCongress} isPro={isPro} />}
        {sixthRainey && <SpokeExperienceCard experience={sixthRainey} isPro={isPro} />}
        {ladyBirdLake && <SpokeExperienceCard experience={ladyBirdLake} isPro={isPro} />}
        {zilker && <SpokeExperienceCard experience={zilker} isPro={isPro} />}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Race weekend&apos;s built-in entertainment</p>
      <div className="mb-8">
        {superStage && <SpokeExperienceCard experience={superStage} isPro={isPro} />}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Beyond the festival stage</p>
      <div className="mb-8">
        {liveMusic && <SpokeExperienceCard experience={liveMusic} isPro={isPro} />}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Two real out-of-town options</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Both sit about 80-90 minutes from Austin and offer genuinely different flavors — wine country versus
        colonial history — worth an extra day either before or after race weekend rather than a rushed half-day
        between sessions.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {hillCountry && <SpokeExperienceCard experience={hillCountry} isPro={isPro} />}
        {sanAntonio && <SpokeExperienceCard experience={sanAntonio} isPro={isPro} />}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Hill Country vs. San Antonio — which day gets which trip</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Both eat roughly the same 3 hours round trip, so the real decision is what kind of day you want, not
            which drive is shorter. Give Hill Country the day before the race weekend starts, not the day after —
            wine tastings and a slow Main Street walk are a genuinely better way to arrive relaxed than to decompress
            after three days of track noise and crowds, and William Chris Vineyards and Becker Vineyards (see the
            Hill Country guide) are both easy driving stops with no fixed schedule to hit. Give San Antonio the day
            after, if your trip allows a second extra day — the Alamo&apos;s timed Church entry ticket and the
            River Walk give you a defined few hours rather than an open-ended wine day, which suits a day when
            you&apos;re winding down rather than gearing up. If you only have one extra day total, San Antonio
            packs more into it: the Alamo and River Walk alone fill a real afternoon, and the four additional
            missions (free, no reservation) are a genuine half-day add-on if you want it, something Hill Country&apos;s
            wine-tasting pace doesn&apos;t offer. Don&apos;t try to squeeze either one between a morning and
            afternoon track session — the drive alone consumes the 3-hour round trip before you&apos;ve done
            anything at the destination.
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Within Austin itself, South Congress and Sixth/Rainey Street work well as a single evening — SoCo
            earlier for shopping and murals, Sixth Street later for the louder nightlife energy. Lady Bird Lake and
            Zilker/Barton Springs are the daytime counterpoint — genuinely active, and Barton Springs&apos;
            constant 68-70°F water is worth the trip even on a scorching October afternoon.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The one combination that genuinely doesn&apos;t fit in a day</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Don&apos;t pair a Hill Country or San Antonio day trip with a full Sixth/Rainey Street night the same
            evening. The math doesn&apos;t work: 90 minutes back from Fredericksburg or San Antonio, worse in
            Friday/Sunday race-weekend traffic on I-35 and US-290 (see the Getting There guide), lands you back in
            Austin around 6-7pm if you left the day trip by 4:30-5pm — which itself means cutting Hill Country&apos;s
            wine tastings short or skipping the fourth and fifth San Antonio missions. Arrive home that tired and a
            loud, standing-room Sixth Street night stops being fun fast. Give the day trip its own full day,
            evening included, and save Sixth/Rainey for a night when COTA itself is the only other thing on the
            schedule.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Fitting Franklin&apos;s line around track sessions</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Franklin opens at 11am Tuesday-Sunday and typically sells out by 3-4pm — closed Mondays entirely, which
            rules it out on any Monday built into your trip. Arrival time maps directly to your place in line:
            9:30am on a Saturday puts you around 40th, meaning roughly a 2-3 hour wait before you&apos;re served;
            serious regulars start arriving 6-7am specifically to beat that. Arrive after 1pm on a busy day and
            you&apos;re gambling on whether they sell out before you reach the counter at all. That means the only
            realistic way to do the line during race weekend is before an afternoon session, not after one — an
            early-morning arrival (6-7am) clears you by roughly 9-10am, well ahead of a 1-2pm session start, while
            a session that starts before 11am rules out Franklin that day entirely, since the restaurant isn&apos;t
            even open yet. If no morning on your trip has a 3+ hour gap before your session, skip the line
            altogether and use the 5-pound online pre-order pickup (see the Where to Eat guide) instead — it&apos;s
            the only way to get Franklin&apos;s food without betting against track timing.
          </p>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: visitfredericksburgtx.com, texashighways.com, thealamo.org, nps.gov, statesman.com.
      </p>
    </SpokeShell>
  );
}

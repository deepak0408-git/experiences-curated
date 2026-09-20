import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "getting-there";

// Real content sourced from the seeded Getting to Albert Park experience
// (getting-to-albert-park-tram-train-mu9c7ocr), 20 Sep 2026: free tram/train
// on race day with a valid ticket, Anzac Station 8 minutes from Gate 5, the
// real departure-crush timing detail.
export default async function GettingThereSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const gettingThereGuide = linkedExperiences.find((e) => e.slug.includes("getting-to-albert-park-tram-train-mu9c7ocr"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Australian Grand Prix"
      status="public"
      h1="Free tram and train on race day — the real friction is the trip home, not the trip in"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Melbourne&apos;s approach to Grand Prix transport is genuinely unusual for a global sporting event — tram
        and train travel to Albert Park is free on the day with a valid ticket, and around 5,000 extra tram services
        run specifically to handle race-weekend crowds. Most visitors never need a car or a taxi at all.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Free tram and train — with a valid ticket</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-3">
          Anzac Station is the train option, an 8-minute walk from Gate 5 — trains between State Library, Town Hall,
          and Anzac are free with a Grand Prix ticket on the day of travel. Boarding anywhere else on the network
          still needs a tap-on with a valid myki, since the free-travel zone doesn&apos;t cover the whole system
          end to end.
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Tram shuttles run direct from the city to gates around the circuit and are the more commonly used option
          — they drop you closer to most gates than the single train station does.
        </p>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The real friction is the trip home</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Getting to Albert Park in the morning is usually smooth — arrivals spread across several hours. Getting
          away afterward is a different story: at peak departure times Thursday through Saturday, tram shuttle
          waits at Gates 1 and 2 have run up to 40 minutes, and on Sunday after the race, waits of up to an hour
          aren&apos;t unusual. Two things help: don&apos;t rush straight to the nearest gate the moment the flag
          falls — a slow walk to a less obvious gate can put you ahead of the surge rather than in the middle of
          it — and know your gate number before race day, since each gate serves different grandstands.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Essential apps for the trip</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-white mb-1">PTV app (Public Transport Victoria)</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Real-time tram, train, and bus times for the whole Melbourne network, including the extra Grand Prix
              services — worth downloading before you land, since race-weekend timetables run outside the normal
              schedule.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">myki</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Melbourne&apos;s transit card, needed for any travel outside the free Town Hall/State Library/Anzac
              zone. Buy or top up at a quieter city station before race day rather than at Anzac on the morning of
              — ticket-machine queues at the busiest stations get genuinely long once crowds build.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">The official F1 Race Guide app</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Covers every circuit on the calendar, including Albert Park — interactive circuit maps, real-time
              schedule alerts, and geotagged points for grandstands, food, and Fan Zone activities.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Uber and DiDi</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Both are widely used in Melbourne — a real fallback for the trip home if you&apos;d rather not wait
              out a tram queue, though expect race-weekend surge pricing and long pickup waits near the circuit
              itself immediately after the chequered flag.
            </p>
          </div>
        </div>
      </div>

      {gettingThereGuide && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={gettingThereGuide} isPro={isPro} />
        </div>
      )}

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          Take the tram over the train unless you&apos;re staying right by Anzac Station — the tram network drops
          you closer to most gates, and with 5,000 extra services running, wait times on the way in stay
          manageable. Save the real planning for the trip home: know your gate, and build in ten minutes of slack
          before you head for the exit rather than joining the immediate post-flag surge.
        </p>
      </div>
    </SpokeShell>
  );
}

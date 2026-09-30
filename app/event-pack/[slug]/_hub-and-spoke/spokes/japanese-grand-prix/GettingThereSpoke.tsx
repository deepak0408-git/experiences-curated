import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "getting-there";

// Real content sourced from the two seeded transit experiences
// (japanese-gp-suzuka-arriving-airport, japanese-gp-suzuka-getting-there),
// 22 Sep 2026: Chubu Centrair (NGO) as the primary airport, Narita (NRT) +
// Shinkansen as the real secondary option — both covered per the founder's
// explicit instruction (see project_japanese_gp_2027_build_status memory).
// Suzuka has no international airport of its own; every route converges on
// Nagoya Station.
export default async function GettingThereSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const airportGuide = linkedExperiences.find((e) => e.slug.includes("japanese-gp-suzuka-arriving-airport"));
  const gettingThereGuide = linkedExperiences.find((e) => e.slug.includes("japanese-gp-suzuka-getting-there"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Japanese Grand Prix"
      status="public"
      h1="Chubu Centrair (NGO) is the fast route — Narita plus Shinkansen is the real, slower alternative"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Suzuka has no international airport of its own, so the first real decision on this trip happens before
        you&apos;ve even booked a hotel: which airport you fly into. Get it wrong and you&apos;re adding real
        hours to a trip that&apos;s already logistically involved.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Chubu Centrair (NGO) — the right default for almost everyone</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          The real international gateway for the Nagoya and Mie region, roughly an hour from Suzuka Circuit by
          car, and well connected by direct and one-transfer international routes from major hubs across Asia,
          North America, and Europe. From Centrair, the Meitetsu Airport Line runs into Nagoya Station, then onward
          via JR and Ise Railway toward Suzuka Circuit Ino Station — or, for race weekend specifically, a direct
          Kintetsu train to Shiroko Station followed by a short shuttle bus, the connection most guides flag as
          smoothest during the Grand Prix itself.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Narita (NRT) + Shinkansen — the real, slower alternative</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Makes sense if your flight options into Tokyo are meaningfully better than into Centrair, or if
          you&apos;re building a longer Japan trip around the race and want Tokyo as your entry point regardless.
          Narita Express from the airport into central Tokyo, then a Shinkansen transfer bound for Nagoya — budget
          around three hours door to Nagoya Station including the transfer, and roughly US$54 for the rail portion
          at standard pricing. From Nagoya Station, the onward connection to Suzuka is identical to the Centrair
          route.
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Neither option is wrong. What doesn&apos;t make sense is defaulting to Narita purely out of familiarity
          with Tokyo as Japan&apos;s main gateway, when Centrair exists specifically to serve this region and cuts
          real time off the journey — roughly half the total travel time to Nagoya, one fewer transfer.
        </p>
      </div>

      {airportGuide && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={airportGuide} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Nagoya to Suzuka — the leg first-timers underestimate</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Not a quick suburban hop — a genuine cross-region rail journey. The standard route runs Meitetsu from
          Nagoya Station, then a JR Kansai Main Line connection to Yokkaichi Station, then the Ise Railway on to
          Suzuka Circuit Ino Station — roughly 90 minutes door to door outside race weekend. The route most guides
          recommend specifically for race weekend is a direct Kintetsu train from Nagoya to Shiroko Station,
          followed by a shuttle bus for the final five kilometres. During the Grand Prix, JR and Ise Railway also
          run a joint direct express — the Suzuka Grand Prix limited express — cutting the journey to around an
          hour with no transfers, when it&apos;s running.
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Build in real buffer time on race day specifically. Every train and shuttle on these lines runs at
          capacity during the Grand Prix weekend, and a missed connection on a day with a fixed session start time
          is a genuinely bad way to begin your visit.
        </p>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Set up a Suica IC card before you land</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Works nationally, covers trains, buses, and most convenience store purchases, and can be loaded and
          topped up through Apple Pay or Google Wallet before you&apos;ve even landed — avoids a ticket-machine
          queue on your first day.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Essential apps for the trip</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-white mb-1">Google Maps</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Handles most journeys reliably across Japan&apos;s rail network — the default route planner for the
              trip.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">NAVITIME</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              A dedicated Japanese transit app with its own Aichi Prefecture/Nagoya coverage area — gives more
              Suzuka-specific routing detail if Google Maps&apos; suggestion looks uncertain.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">GO</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              The most widely used ride-hailing app in Japan and a genuine option in Nagoya. Uber operates in the
              country but with more limited coverage — don&apos;t assume it&apos;ll be your fallback everywhere.
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
          Fly into Chubu Centrair if your route supports it — it&apos;s the region&apos;s real gateway and cuts a
          genuine hour-plus off the journey compared to landing in Tokyo. Once in Nagoya, take the direct Kintetsu
          route to Shiroko Station on race days specifically, and set up a Suica IC card before you land so your
          first transit connection isn&apos;t also your first ticket-machine queue.
        </p>
      </div>
    </SpokeShell>
  );
}

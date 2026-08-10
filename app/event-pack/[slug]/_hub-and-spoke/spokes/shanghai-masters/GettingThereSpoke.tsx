import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "getting-there";

export default async function GettingThereSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const transit = linkedExperiences.find((e) => e.slug.includes("getting-to-qizhong-shanghai-masters"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Shanghai Masters"
      status="public"
      h1="Two real options: a ¥2 shuttle transfer, or a straight Didi ride"
      question="How do I get to Qizhong, and is the metro enough?"
      heroImageUrl={heroImageUrl}
      heroImagePosition="center 75%"
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Qizhong sits roughly 27-30km southwest of central Shanghai, in Minhang District — far enough out that
        &quot;just take the metro&quot; isn&apos;t the whole answer the way it is at most Masters 1000 venues built
        inside a city core. Budget over an hour door-to-gate from most central hotels.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">By metro + tournament shuttle</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Take Metro Line 1 to Xinzhuang station, or Metro Line 5 to Zhuanqiao station. Neither is walkable from
          Qizhong — you need the tournament&apos;s own shuttle for the final leg, departing from Xinzhuang&apos;s
          South Square, stopping at Zhuanqiao, and terminating between Gates 1 and 2.
        </p>
        <div className="flex flex-col gap-2">
          <FactRow label="Shuttle fare" value="¥2 per journey" />
          <FactRow label="Journey time" value="~45 min from Xinzhuang to the venue" />
          <FactRow label="Outbound hours" value="Roughly 11am-7pm Wed-Sat, 11am-4pm Sun (confirm 2026 timetable)" />
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">By Didi</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Didi (China&apos;s dominant ride-hailing app) works with a foreign card and has an English interface. For a
          group of two or more, it&apos;s often comparable in total cost to the metro-plus-shuttle combination.
          Expect roughly ¥80-150 from central Shanghai depending on traffic — this is a genuine 45-minute-plus drive,
          so build real time into your schedule regardless of which option you pick.
        </p>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Set up Didi before you land</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Download the app and link a foreign card before tournament week, not on the day — first-time card linking
          can take a few minutes and is easier with reliable wifi than curbside at the venue.
        </p>
      </div>

      {transit && (
        <div className="mb-8">
          <SpokeExperienceCard experience={transit} isPro={isPro} />
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: tennistours.com Shanghai Masters FAQ, koobit.com, thetennistribe.com, kkday.com Shanghai transport
        guide, chinafortravelers.com Didi guide. Shuttle schedule based on most recently reported tournament
        timetable — confirm exact 2026 times closer to the event.
      </p>
    </SpokeShell>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-0.5">{label}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{value}</p>
    </div>
  );
}

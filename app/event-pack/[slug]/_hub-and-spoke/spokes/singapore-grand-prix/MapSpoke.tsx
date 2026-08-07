import Image from "next/image";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "map";

export default async function MapSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const turn1 = linkedExperiences.find((e) => e.slug.includes("singapore-gp-turn1-grandstand"));
  const stamford = linkedExperiences.find((e) => e.slug.includes("singapore-gp-stamford-grandstand"));
  const padang = linkedExperiences.find((e) => e.slug.includes("singapore-gp-padang-grandstand"));
  const walkabout = linkedExperiences.find((e) => e.slug.includes("singapore-gp-zone4-walkabout"));
  const f1Village = linkedExperiences.find((e) => e.slug.includes("singapore-gp-f1-village"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Singapore Grand Prix"
      status="public"
      h1="A first-timer's guide to the venue itself"
      question="What facilities are available at Marina Bay Street Circuit?"
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Knowing where your grandstand sits on the lap matters, but so does knowing where to find a toilet, a meal,
        a prayer room, or first aid once you&apos;re actually inside the circuit — a genuinely different question
        from &quot;which stand shows me what.&quot; Marina Bay Street Circuit splits into four zones plus a
        restricted Paddock Zone; some tickets grant entry to all four, others cover just one.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The four zones</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Zone 1</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            The pit straight side: the Pits, the Paddock, the Singapore Flyer, and several of the best-known
            grandstands (Turn 1, Turn 2, Super Pit). Its own F1 Village runs merchandise stalls, bars, food and
            drink outlets, and activity stations.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Zone 2</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Runs along Republic Boulevard past Marina Bay Sands, dominated visually by the Singapore Flyer, home
            to the Republic and Promenade grandstands.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Zone 3 — transit only</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            A connecting corridor along Nicoll Highway and the Esplanade, not a viewing area or ticketed zone in
            its own right — used to move between Zone 2 and Zone 4.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Zone 4</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            The largest zone, accessible by every ticket type including Zone 4 Walkabout. Home to the Padang Stage,
            the Stamford and Padang grandstands, and its own F1 Village with merchandise shops and food stalls.
          </p>
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Circuit facilities</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Esplanade Mall</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Sits between Zone 1 and Zone 4 and is genuinely underused simply because most visitors don&apos;t know
            it&apos;s there. Real toilets, not portable ones, a 7-Eleven for quick supplies, and a water refill
            station right outside — worth the detour if you&apos;re moving between the two zones anyway.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Water refill stations</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Free refill points are placed throughout the circuit, not just at Esplanade Mall — bring a reusable
            bottle rather than relying on buying water once inside, genuinely useful given Singapore&apos;s heat
            hazard designation.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Prayer rooms</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            No dedicated musollah inside the Circuit Park itself is confirmed — the nearest real options are
            outside the venue at Suntec City (Tower 3, Level 3, behind a white door across from the lift at Lobby
            Q) and Marina Square (Basement 1, behind carpark lot 67 in the green zone), both a short walk from
            Zone 2/3.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">First aid and merchandise</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            First-aid stations sit throughout the venue rather than at one central point — ask any circuit staff
            or check wayfinding signage near your grandstand for the nearest one. Merchandise stalls run inside
            both F1 Villages (Zone 1 and Zone 4), not just one.
          </p>
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Wayfinding on the day</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Wayfinding signs and information booths sit next to most entry gates. The official Singapore GP app is
        worth downloading before you arrive, useful beyond tickets for checking which viewing platforms have big
        screens in sightline and for real-time information across the weekend.
      </p>

      <div className="relative w-full aspect-[1920/1080] rounded-sm border border-[#2A2A2A] overflow-hidden mb-4 bg-white">
        <Image
          src="https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/singapore-grand-prix-circuit-layout.jpg"
          alt="Marina Bay Street Circuit's 2023-onward track layout with Turn 1, Stamford, and Padang grandstands and the Zone 4 Walkabout marked"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 720px"
        />
      </div>
      <p className="text-xs text-[#6A6A6A] mb-8">
        The current 2023+ track layout (unchanged for 2026) — Turns 16-19 were removed in 2023 to create the long
        back straight down Raffles Avenue. Use it for orientation, not precise navigation.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">A few named grandstands, by zone</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {turn1 && <SpokeExperienceCard experience={turn1} isPro={isPro} />}
        {stamford && <SpokeExperienceCard experience={stamford} isPro={isPro} />}
        {padang && <SpokeExperienceCard experience={padang} isPro={isPro} />}
        {walkabout && <SpokeExperienceCard experience={walkabout} isPro={isPro} />}
      </div>

      {f1Village && (
        <div className="mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Not a grandstand, but worth knowing where it is</p>
          <SpokeExperienceCard experience={f1Village} isPro={isPro} />
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: official Singapore GP Circuit Park Map (singaporegp.sg), singaporegp.sg fan zones page,
        fastway1.com (Zone 1 vs Zone 4), girleatworld.net (Esplanade Mall facilities), halalzilla.com and
        thesmartlocal.com (prayer room locations). Verified 4 Aug 2026.
      </p>
    </SpokeShell>
  );
}

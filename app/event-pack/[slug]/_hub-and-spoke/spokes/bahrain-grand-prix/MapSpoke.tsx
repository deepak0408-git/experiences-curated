import Link from "next/link";
import Image from "next/image";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "map";

const STANDS = [
  { slug: "main-grandstand-sepang-start-finish", name: "Main Grandstand", position: "Start/finish straight, the grid, pits and podium" },
  { slug: "k1-grandstand-sepang-turn-1", name: "K1 Grandstand", position: "Turn 1 — the main overtaking zone" },
  { slug: "grandstand-f-sepang-panoramic", name: "Grandstand F", position: "Turns 6–8 and the back straight" },
  { slug: "hill-stand-c2-sepang-general-admission", name: "Hill Stand (C2)", position: "Turns 9, 10 and 11, general admission" },
];

export default async function MapSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell eventSlug={eventSlug} eventId={event.id} eventCurrency={event.packCurrency} spokeId={SPOKE_ID} justPurchased={justPurchased} eventName="Bahrain Grand Prix" status="public" h1="A first-timer's guide to the venue itself" question="What facilities are available at Sepang International Circuit?" heroImageUrl={heroImageUrl} isUnlocked={isUnlocked}>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Knowing where your grandstand sits on the lap matters, but so does knowing where to find a toilet, a meal,
        an ATM, or first aid once you&apos;re actually inside the circuit — and that&apos;s a genuinely different
        question from "which stand shows me what." Here&apos;s how the site itself is laid out, not just the seats.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Circuit facilities</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">The Mall</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Sepang&apos;s main food-and-drink hub, sitting directly between the Main Grandstand&apos;s North and
            South wings — around 15 vendors (fast food, a satay bar, drinks stalls), most food in the RM15-30 range.
            If you&apos;re in the Main Grandstand or K1, this is your easiest stop for a proper meal without a long
            walk.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Welcome Centre</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            The main visitor hub near the Main Grandstand and primary entrance — a ticketing station, a Customer
            Service Centre with an ATM and Lost &amp; Found desk, washrooms, and a café, in a mix of covered and
            open-air space. If something goes wrong with your ticket or you lose something, this is where to go.
            (Source: sepangcircuit.com)
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">South Paddock</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Facing the Main Grandstand, and home to the circuit&apos;s Paddock Club and hospitality suites. It also
            houses a fully equipped medical room alongside public toilets and prayer rooms — worth knowing even if
            you&apos;re not in a hospitality package, since it&apos;s the nearest first-aid point for anyone in or
            near the Main Grandstand or K1. (Source: sepangcircuit.com)
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Prayer rooms and merchandise</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            A prayer room (surau) and a merchandise booth are both at the Main Grandstand itself, not just the
            Mall. K1 has its own on-site prayer room and food-and-drink kiosk too, so you don&apos;t need to leave
            your seat there either. (Source: sepangcircuit.com)
          </p>
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Getting between zones</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The walk from the Main Grandstand/Mall area round to the further stands is a real perimeter walk, not a
        shortcut through the middle of the circuit — reported as winding around the hill, past the Hill Stand and
        several car parks. If you leave the circuit during the day and want to come back in, get your ticket
        re-tagged by security on your way out — leaving without that re-tag forfeits same-day re-entry.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The four grandstands, in lap order</p>
      <div className="flex flex-col gap-3 mb-8">
        {STANDS.map((stand) => {
          const exp = linkedExperiences.find((e) => e.slug.includes(stand.slug));
          return (
            <div key={stand.slug} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4 flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-sm font-bold text-white">{stand.name}</p>
                <p className="text-xs text-[#AAFF00]">{stand.position}</p>
              </div>
              {exp && (
                <Link href={`/experience/${exp.slug}`} className="text-xs text-[#AAFF00] hover:text-[#BBFF33] underline">
                  Full guide to this stand →
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <div className="relative w-full aspect-[1464/1035] rounded-sm border border-[#2A2A2A] overflow-hidden mb-8 bg-[#141414]">
        <Image
          src="https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/bahrain-grand-prix-grandstand-map.jpg"
          alt="Sepang International Circuit map showing the Main Grandstand, K1 Grandstand, Grandstand F, and Hill Stand (C2 General Admission) positioned around the track"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 720px"
        />
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">A real circuit map</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Sepang has published detailed spectator guide PDFs for recent race weekends — car parks, gates, and
          grandstands together in one diagram — for its MotoGP events, which run at the same venue.{" "}
          <a href="https://www.sepangcircuit.com/media/wysiwyg/pdf/MGP25_Spectator_Guide_v3.pdf" target="_blank" rel="noopener noreferrer" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            See the 2025 MotoGP spectator guide (PDF)
          </a>{" "}
          for a real sense of the layout — treat it as a guide to the venue&apos;s shape, not a confirmed 2026 F1
          document, since Sepang hasn&apos;t published race-specific materials for this relocated Grand Prix yet.
        </p>
      </div>
    </SpokeShell>
  );
}

import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "map";

export default async function MapSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const vca = linkedExperiences.find((e) => e.slug.includes("vca-stadium-jamtha"));
  const chepauk = linkedExperiences.find((e) => e.slug.includes("chepauk-stadium"));
  const modi = linkedExperiences.find((e) => e.slug.includes("narendra-modi-stadium"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Border-Gavaskar Trophy"
      status="public"
      h1="A working ground, a century-old one, and the largest stadium in the world"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The three grounds in this pack could hardly be more different. VCA Stadium is a modern, purpose-built ground
        on Nagpur&apos;s edge, with no history to speak of and a pitch that provides the character. Chepauk has been
        Tamil Nadu&apos;s cricket ground since 1916. Narendra Modi Stadium is the largest cricket ground on earth.
      </p>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {vca && (
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Nagpur</p>
            <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
              Opened in 2008, seats 45,000, and by field area is the second-largest cricket venue in the country. It
              runs on solar power, has decent sightlines from most tiers, and reviewers rate the crowd management
              well, though queues for food and toilets back up once a session is underway.
            </p>
            <SpokeExperienceCard eventSlug={eventSlug} experience={vca} isPro={isPro} />
          </div>
        )}
        {chepauk && (
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Chennai</p>
            <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
              Home of Tamil Nadu cricket since 1916, hosting its first Test in 1933-34. Stands run almost all the way
              around the ground, lettered A through K, and a 2009-2023 rebuild added glass-fronted new stands and
              upgraded hospitality boxes. The sea breeze off the Bay of Bengal is part of the experience.
            </p>
            <SpokeExperienceCard eventSlug={eventSlug} experience={chepauk} isPro={isPro} />
          </div>
        )}
        {modi && (
          <div className="sm:col-span-2">
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Ahmedabad</p>
            <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
              Rebuilt and reopened in 2021 with 132,000 seats, 11 pitches cut from different soil types, an
              Olympic-size pool and a 55-room clubhouse. It has 76 air-conditioned corporate boxes, each holding 25
              guests. On non-match days the Gujarat Cricket Association runs organised stadium tours covering the
              dressing rooms, presidential suites and Hall of Fame museum.
            </p>
            <SpokeExperienceCard eventSlug={eventSlug} experience={modi} isPro={isPro} />
          </div>
        )}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">At a glance</p>
      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        <Fact label="Capacity" values={["Nagpur: 45,000", "Chennai: stands A–K, capacity not confirmed", "Ahmedabad: 132,000"]} />
        <Fact label="Nearest transit" values={["Nagpur: Khapri metro, ~6km, then auto", "Chennai: Chepauk MRTS, 2-minute walk", "Ahmedabad: Motera Stadium metro"]} />
        <Fact label="Beyond the pitch" values={["Nagpur: food court, parking", "Chennai: Anna Pavilion, AC boxes", "Ahmedabad: stadium tours, museum"]} />
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">On-site facilities</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Food & drink — bring your own water, buy the rest inside</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Outside food and drink, including sealed bottled water, isn&apos;t allowed past the gates at any of the
            three grounds — you buy again inside once you&apos;re through security. Nagpur runs a food court, but
            reviewers note queues back up once a session gets underway. Chennai&apos;s hospitality side, Anna
            Pavilion and the AC boxes, has a fuller food offering than the general stands. Cash in small notes is
            the safer bet everywhere: card readers can be unreliable under a packed matchday queue.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Toilets — expect a queue once play starts</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            All three grounds have permanent toilet facilities built into the stand structure, but none of the
            three has a published per-stand count for the 2027 Tests, and reviewers single out Nagpur specifically
            for queues building up once a session is underway. Go during a break rather than waiting until you
            need to, especially at Ahmedabad, where the walk back to your seat alone eats real time.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Ahmedabad&apos;s scale changes the calculation</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            At 132,000 seats, getting from your block to food, a toilet, or back again takes noticeably longer than
            at Nagpur or Chennai. Build that into any break between sessions — a lunch-break food run that&apos;s
            quick at the other two grounds can eat into the resumption of play here.
          </p>
        </div>
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
        <p className="text-sm font-bold text-white mb-2">Accessibility details aren&apos;t confirmed yet</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          We haven&apos;t confirmed wheelchair-space numbers, accessible entrances or step-free routes for the 2027
          Tests at any of these three grounds, and won&apos;t guess. If you need accessible seating, contact the
          host association (VCA in Nagpur, TNCA in Chennai, the Gujarat Cricket Association in Ahmedabad) before
          booking, and note that Ahmedabad&apos;s scale means the walk from gate to seat is far longer than at most
          grounds.
        </p>
      </div>
    </SpokeShell>
  );
}

function Fact({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-2">{label}</p>
      <ul className="space-y-1">
        {values.map((v) => (
          <li key={v} className="text-xs text-[#A3A3A3] leading-5">{v}</li>
        ))}
      </ul>
    </div>
  );
}

import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "first-timer-guide";

export default async function FirstTimerGuideSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const findExp = (slugFragment: string) => linkedExperiences.find((e) => e.slug.includes(slugFragment));
  const moleAntonelliana = findExp("atp-finals-mole-antonelliana");
  const museoEgizio = findExp("atp-finals-museo-egizio");
  const royalPalace = findExp("atp-finals-royal-palace");
  const turinCathedral = findExp("atp-finals-turin-cathedral");
  const piazzaSanCarlo = findExp("atp-finals-piazza-san-carlo");
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Nitto ATP Finals"
      status="public"
      h1="Format, apps, and the sights beyond the arena"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        If you've never been to a season-ending finale before, the format and rhythm are genuinely different from a
        Grand Slam or a regular tour stop — here's the orientation that makes the rest of the week make sense.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The format, in one paragraph</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Eight singles players and eight doubles teams — the best of the whole season, no qualifying rounds — split
          into two groups of four, playing round-robin (everyone plays everyone in their group). That runs 15-20
          November, two sessions a day. Semifinals are 21 November, the final is 22 November. Every session pairs a
          doubles match with a singles match, so you're never buying a ticket for just one discipline.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Essential apps</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">TO Move (GTT)</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            The essential transit app — buy and validate GTT bus/tram/metro tickets, see real-time vehicle locations.
            Install this before you land; it's the app you'll use most on this trip.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">FreeNow</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Turin's real ride-hailing app — connects you with licensed local taxis at regulated, quoted fares.
            Standard Uber (UberX) doesn't operate in Italy the way it does elsewhere; Uber here is a premium
            chauffeur service, not the budget option. FreeNow is the actual equivalent.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Tennis TV / ATP official app</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            For live scores and schedule updates across every court and match, the official ATP app is the most
            reliable source — worth having during the round-robin days when tracking which players have already
            qualified for the semifinals matters.
          </p>
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Practical essentials</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Turin runs on the euro, standard EU electrical sockets. English is widely spoken in tourist-facing venues
          and among younger Turin residents, less reliably so with older generations or in smaller neighborhood
          spots — a few basic Italian phrases go a long way. Tipping isn't obligatory the way it is in the US;
          rounding up or leaving small change is standard.
        </p>
      </div>

      <p className="text-sm font-bold text-white mb-2">What&apos;s not allowed through the gates</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Suitcases, trolleys, and backpacks — only small handbags or school-style bags up to 40cm are allowed.
          Outside food and drink, cans, glass or plastic bottles, alcohol, spray cans (including sunscreen and
          insect repellent), stadium horns, musical instruments, weapons, laser pointers, selfie sticks, tripods,
          drones, professional cameras and camcorders, tents, sleeping bags, and umbrellas with pointed tips are
          all prohibited. Compact power banks (max 10cm) and small foldable umbrellas are fine.
        </p>
      </div>

      <p className="text-sm font-bold text-white mb-2">Accessibility</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Inalpi Arena has dedicated wheelchair seating and companion seats on the ground floor around the arena&apos;s
          perimeter with direct external access, elevator access to every seating level, and accessible restrooms on
          multiple floors. Disabled parking is available and clearly marked on Corso Galileo Ferraris and Corso IV
          Novembre. Accessible seating for this specific tournament is arranged through the event organiser rather
          than the venue directly — contact the ticket office ahead of your visit to confirm arrangements.
        </p>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The city, not just the tennis</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Turin is a genuinely distinct city — the first capital of unified Italy, birthplace of vermouth and
          gianduja chocolate, home to one of the world's great Egyptian collections. If this is your first trip
          here, budget real time for the city itself, not just the arena — see the Where to Eat and Day Trips guides
          for where to start.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Five sights worth the walk</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {moleAntonelliana && <SpokeExperienceCard experience={moleAntonelliana} isPro={isPro} />}
        {museoEgizio && <SpokeExperienceCard experience={museoEgizio} isPro={isPro} />}
        {royalPalace && <SpokeExperienceCard experience={royalPalace} isPro={isPro} />}
        {turinCathedral && <SpokeExperienceCard experience={turinCathedral} isPro={isPro} />}
        {piazzaSanCarlo && (
          <div className="sm:col-span-2">
            <SpokeExperienceCard experience={piazzaSanCarlo} isPro={isPro} />
          </div>
        )}
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: inalpiarena.it/en/regole (prohibited items and bag policy), turinwhynot.com and the venue&apos;s own
        published accessibility information (wheelchair seating and access).
      </p>
    </SpokeShell>
  );
}

import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "weather";

export default async function WeatherSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const packingGuide = linkedExperiences.find((e) => e.slug.includes("melbourne-january-heat-what-to-pack"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Australian Open"
      status="public"
      h1="Four seasons in a day, and it's not just a saying here"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Melbourne&apos;s January weather genuinely swings 15-20°C in a single day — a cool 20°C morning can turn
        into a 38°C afternoon, then drop again by evening. This isn&apos;t exaggerated local colour; it&apos;s the
        real reason layering matters more here than at most other Grand Slams.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Typical January conditions</p>
      <div className="flex flex-col gap-2 mb-8">
        <FactRow label="Typical daily swing" value="15-20°C between morning and afternoon" />
        <FactRow label="Heatwave risk" value="Real — days above 35-40°C occur most tournaments" />
        <FactRow label="Rain" value="Possible but not the dominant risk — heat is the bigger planning factor" />
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Outdoor courts can be directly affected by heat</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Rod Laver Arena and Margaret Court Arena both have retractable roofs (see the{" "}
          <a href={`/event-pack/${eventSlug}/map`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Venue Map
          </a>
          ), but the outside courts are fully exposed. On a genuine heatwave day, this is a real factor for anyone
          holding a Ground Pass or outer-court ticket — not just a comfort issue but something that can shape when
          and how long you spend outdoors.
        </p>
      </div>

      {packingGuide && (
        <div className="mb-8">
          <SpokeExperienceCard experience={packingGuide} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What to pack</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-2">Clothing</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Layers are non-negotiable — a light jacket or long sleeves for a cool morning, breathable clothing for a
            15-20°C swing into the afternoon. A wide-brimmed hat and sunglasses for the outside courts, where
            there&apos;s little to no shade for hours at a time. Comfortable, broken-in walking shoes — a full day
            covers multiple courts and the wider precinct on foot.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-2">Sun and heat</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Sunscreen applied before you arrive, not after — Australian UV is genuinely strong even on a
            mild-feeling day. A refillable water bottle: Melbourne Park has free water refill points and misting
            fans placed around the grounds specifically for hot sessions. On a genuine heatwave day, the tournament&apos;s
            own Extreme Heat Policy can pause outside-court play entirely — one more reason a roofed-arena ticket is
            worth having in your back pocket if the forecast looks extreme.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-2">On the grounds — what&apos;s allowed</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            One bag per person, sized to fit under your seat — large bags, eskies, and hampers aren&apos;t
            permitted, so a soft day-bag is the practical choice. No outside alcohol at all, unlike some tournaments
            that allow a BYO allowance — anything alcoholic has to be bought inside the grounds. Non-alcoholic
            drinks and food are fine in reasonable, non-glass packaging. Personal cameras are fine; professional
            equipment, large lenses, tripods, and drones need separate accreditation.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-2">No overnight queue here</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Unlike Wimbledon, the Australian Open doesn&apos;t have an overnight-camping queue culture — Ground
            Passes are sold as standard tickets for same-day entry, not earned by waiting outside from the night
            before. One less thing to plan around, and one more reason the presale calendar (see the{" "}
            <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Ticket Guide
            </a>
            ) is where the real advance-planning effort goes instead.
          </p>
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-3">
          The figures above are January climate patterns, not a forecast — for real conditions on your actual
          travel dates, check a live 10-day forecast once you&apos;re within range of the tournament.
        </p>
        <a
          href="https://www.accuweather.com/en/au/melbourne/26216/10-day-weather-forecast/26216"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          10-day forecast for Melbourne on AccuWeather →
        </a>
      </div>

    </SpokeShell>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-sm border border-[#2A2A2A] bg-[#141414] px-4 py-3">
      <span className="text-sm font-bold text-white">{label}</span>
      <span className="text-sm text-[#A3A3A3] font-mono">{value}</span>
    </div>
  );
}

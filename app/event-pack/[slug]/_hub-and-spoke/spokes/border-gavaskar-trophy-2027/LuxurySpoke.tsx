import Link from "next/link";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "luxury";

export default async function LuxurySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Border-Gavaskar Trophy"
      status="teaser"
      h1="Air-conditioned boxes, five-star hotels, and a jungle lodge 300 metres from a tiger reserve gate"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The hospitality options at each ground and the luxury stays are free above. Unlocking adds our verdict on where paying up is worth it and where it isn't: why an air-conditioned box matters more in Ahmedabad's late-February sun than at Nagpur, why Ahmedabad's sponsor-named premium stands aren't automatically the best view, and which hospitality allocations you have to enquire about directly because it will never appear on BookMyShow."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Luxury on this trip is a stack of decisions across three cities, not one purchase. Indian grounds sell
        hospitality very differently from a Grand Slam or an Ashes Test: the top boxes are allocated by the state
        cricket association, not sold through a public platform, and 2027 prices haven&apos;t been announced. What
        follows is what genuinely exists, city by city, and where we have nothing confirmed we say so.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Hospitality at the grounds</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm font-bold text-white mb-2">Nagpur — VIP and corporate exist, but there&apos;s no published product</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          VCA Stadium&apos;s VIP and corporate seating ran at roughly ₹10,000–₹30,000 on a 2025 baseline, but we
          haven&apos;t found a documented hospitality package for the 2027 Test, so we won&apos;t describe one. Enquire
          with the Vidarbha Cricket Association directly (vca.co.in) closer to the fixture.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Luxury stays</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <StayCard
          city="Chennai"
          name="ITC Grand Chola"
          detail="A large luxury hotel on Mount Road near the downtown business district, with 522 rooms and 78 serviced apartments."
        />
        <StayCard
          city="Chennai"
          name="Taj Coromandel"
          detail="A five-star hotel in central Chennai. We haven't confirmed its exact distance to Chepauk, so check it before booking."
        />
        <StayCard
          city="Ahmedabad"
          name="ITC Narmada, Taj Skyline, The Ummed"
          detail="Three five-star options across the city. The Ummed is about 7.8km and roughly 15 minutes' drive from the stadium. Hyatt Regency on Ashram Road, covered in the Where to Stay guide, sits on the riverfront."
        />
        <StayCard
          city="Nagpur"
          name="Le Méridien, near MIHAN"
          detail="A five-star build near the airport, covered in the Where to Stay guide. It's a real trade-off against a longer trip into the city centre."
        />
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">One luxury fact beyond the hotels guide</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Svasara Jungle Lodge sits about 300 metres from the Kolara gate at Tadoba, with 12 suites and naturalist-led
          safari vehicles, roughly a two-hour drive from Nagpur. It&apos;s the practical answer to Tadoba&apos;s 8-10 hour
          day-trip problem: sleep there and do the safari at dawn.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Premium transit and off-venue luxury</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Chauffeur-driven cars</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            None of these are tied specifically to the Test series, but all three cities have established
            chauffeur-driven luxury car operators running Mercedes, BMW and Audi-class fleets for airport
            transfers and outstation day trips: this is the normal, respectable way to do Tadoba, Mahabalipuram,
            the Statue of Unity or Gir in comfort, with a driver who knows the route rather than negotiating with a
            stand taxi each time. Book direct with a local operator rather than a generic aggregator, and confirm
            the car and driver before paying anything. For matchday itself, see the{" "}
            <Link href={`/event-pack/${eventSlug}/getting-there`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Getting There guide
            </Link>
            : Ahmedabad&apos;s metro beats a private car on a big session day regardless of budget.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Off-venue luxury, city by city</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            None of these have a confirmed tie to the Tests either, just real, standing venues worth knowing about
            for an evening off the cricket. Nagpur&apos;s options skew toward private members&apos; clubs rather
            than public venues, so a rooftop restaurant scene is thinner than the other two cities. Chennai has a
            genuine rooftop dining scene, several hotel-attached rooftop restaurants and lounges with proper
            skyline views. Ahmedabad also has a real rooftop dining scene, but Gujarat is a legally dry state:
            restaurants outside GIFT City can&apos;t hold a bar licence, so a &quot;lounge&quot; here means food,
            music and ambience, not alcohol on the menu. Visiting foreign nationals and NRIs can apply for a
            short-term liquor permit through the state&apos;s official e-permit portal and buy from an authorised
            outlet, but public consumption outside a permitted venue isn&apos;t legal, so don&apos;t assume a
            rooftop bar works the way it would in Chennai or Nagpur.
          </p>
        </div>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where paying up is worth it</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Ahmedabad is where hospitality earns its price. Late-February highs of 33-36°C in exposed stands make an
            air-conditioned box, which seats 25 with food included, a genuine comfort decision, and a small group
            can split the cost. Chennai is second: the Anna Pavilion or an AC box is worth serious thought if you
            are attending several days in the humidity. Nagpur is the one to skip unless you find a documented
            package, since the ground&apos;s draw is the pitch, not the amenities.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">How to actually book</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            None of this is on the public platforms. Chennai&apos;s Anna Pavilion and boxes are allocated by the Tamil
            Nadu Cricket Association, so ask there directly, and for past Tests TNCA has also sold hospitality tickets over the counter at
            its Victoria Hostel Road office booth. Ahmedabad&apos;s corporate boxes and premium hospitality go through the Gujarat Cricket
            Association (gujaratcricketassociation.com). Group and corporate enquiries may also come with extras such
            as reserved parking or group entry gates, so ask what is included, in writing, and ask early.
          </p>
          <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The premium-price trap</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              At Narendra Modi Stadium, some higher-priced stands are named for sponsors and positioned for corporate
              visibility rather than the best view. Ask for the actual sightline before paying for a premium tier.
            </p>
          </div>
        </div>
      )}
    </SpokeShell>
  );
}

function StayCard({ city, name, detail }: { city: string; name: string; detail: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-1">{city}</p>
      <p className="text-sm font-bold text-white mb-1">{name}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail}</p>
    </div>
  );
}

import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus, isRealAffiliateLink } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "hotels";

type BookingLink = { platform: string; label?: string; url: string };

export default async function HotelsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const nagpur = linkedExperiences.find((e) => e.slug.includes("where-to-stay-nagpur"));
  const chennai = linkedExperiences.find((e) => e.slug.includes("where-to-stay-chennai"));
  const ahmedabad = linkedExperiences.find((e) => e.slug.includes("where-to-stay-ahmedabad"));

  const nagpurLinks = (nagpur?.bookingLinks as BookingLink[] | undefined) ?? [];
  const chennaiLinks = (chennai?.bookingLinks as BookingLink[] | undefined) ?? [];
  const ahmedabadLinks = (ahmedabad?.bookingLinks as BookingLink[] | undefined) ?? [];

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
      h1="Nagpur makes you choose between the commute and the city, Chennai lets you have both, Ahmedabad offers a heritage stay"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The named hotels for all three cities are free above. Unlocking adds our specific pick per city with direct booking links, the self-catering neighbourhood breakdown, the booking order across the series, and how the Airbnb scene actually differs between a deep-supply metro like Chennai and a shallow one like Nagpur — including the Nagpur call that trades 10-15 minutes off every Jamtha run against having anywhere worth coming back to, why Chennai's Triplicane guesthouses need a second look at the reviews, and which Ahmedabad hotel to lock in first because its rooms run out."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Each of these three cities asks a different accommodation question. Jamtha sits well outside Nagpur, so
        &quot;close to the stadium&quot; and &quot;somewhere worth staying&quot; pull in opposite directions. Chepauk
        is walkable from good neighbourhoods, so Chennai lets you choose on character. Ahmedabad splits into three
        genuinely separate parts of town, one of which is a UNESCO-listed old city. Treat each Test as its own
        decision, and book each city as soon as your dates are fixed, since India-Australia Test dates push rates
        up and availability down as the fixtures approach.
      </p>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {nagpur && (
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Nagpur</p>
            <SpokeExperienceCard eventSlug={eventSlug} experience={nagpur} isPro={isPro} />
          </div>
        )}
        {chennai && (
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Chennai</p>
            <SpokeExperienceCard eventSlug={eventSlug} experience={chennai} isPro={isPro} />
          </div>
        )}
        {ahmedabad && (
          <div className="sm:col-span-2">
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Ahmedabad</p>
            <SpokeExperienceCard eventSlug={eventSlug} experience={ahmedabad} isPro={isPro} />
          </div>
        )}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Neighbourhoods if you&apos;d rather rent or self-cater</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <AreaCard
              city="Nagpur"
              area="Wardha Road corridor"
              detail="The road that leads out to Jamtha, so it's the shortest matchday commute. Functional rather than lively, and matchday traffic on this road affects you before you even reach the final stretch."
            />
            <AreaCard
              city="Nagpur"
              area="Ramdaspeth and Civil Lines"
              detail="The real centre of the city, with the best restaurants and street life. It adds roughly 15-20 minutes each way to Jamtha over a Wardha Road hotel."
            />
            <AreaCard
              city="Chennai"
              area="Triplicane and Marina Beach"
              detail="A 9-minute walk from Chepauk from Triplicane, 11 from Marina Beach, and Chepauk MRTS station is a 2-minute walk from the ground. Check recent reviews carefully on budget guesthouses here, since quality varies widely."
            />
            <AreaCard
              city="Chennai"
              area="Mylapore and Alwarpet"
              detail="Neighbouring areas, a 10-20 minute auto-rickshaw or taxi ride to Chepauk. Mylapore has the Kapaleeshwarar Temple and filter-coffee institutions, Alwarpet the contemporary restaurants, and Mylapore is served by Luz metro station."
            />
            <AreaCard
              city="Ahmedabad"
              area="Ashram Road and the riverfront"
              detail="Closest to Sabarmati Ashram and the stadium side of the city, with the metro and SG Highway to reach Motera."
            />
            <AreaCard
              city="Ahmedabad"
              area="Old City and Kalupur"
              detail="Inside the UNESCO heritage district, a short walk from the pols. It's the furthest from the stadium, so expect a real ride on matchday."
            />
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d actually book, city by city</p>
          <div className="flex flex-col gap-2 mb-6">
            <p className="text-sm text-[#A3A3A3] leading-6">
              <span className="font-bold text-white">Nagpur:</span>{" "}
              Radisson Blu on Wardha Road if you&apos;re going to the ground more than once. It&apos;s a full-service
              hotel and cuts 10-15 minutes off each Jamtha run, which adds up over a five-day Test. Choose Hotel
              Centre Point in Ramdaspeth only if you plan to spend real time in the city and accept a longer
              commute. Le Méridien near MIHAN is only worth it if you&apos;re flying in and out several times.
            </p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              <span className="font-bold text-white">Chennai:</span>{" "}
              Base yourself in Mylapore. The Savera puts you inside a working temple neighbourhood with a short,
              direct ride to Chepauk, and you get a stay that is itself part of the trip. If your priority is zero
              matchday transport, stay in Triplicane or near Marina Beach and walk, but read the last six months of
              reviews before booking any budget guesthouse there. Skip T. Nagar unless shopping is the point:
              it&apos;s the furthest at 20-30 minutes.
            </p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              <span className="font-bold text-white">Ahmedabad:</span>{" "}
              Hyatt Regency on Ashram Road if minimising matchday travel is the priority. The House of MG if you
              want to wake up inside the old city, but it&apos;s a smaller heritage property with limited rooms, so
              book it before any of the others.
            </p>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            <HotelBookingCard
              name="Nagpur"
              note="Radisson Blu for a full-service base on Wardha Road, Hotel Centre Point for Ramdaspeth, Le Méridien if you're flying in and out near MIHAN."
              links={nagpurLinks}
            />
            <HotelBookingCard
              name="Chennai"
              note="The Raintree in Alwarpet and Grand Chennai by GRT in T. Nagar are bookable direct below. The Savera in Mylapore, our top pick for the neighbourhood, currently has no bookable Booking.com listing — check availability directly with the hotel."
              links={chennaiLinks}
            />
            <HotelBookingCard
              name="Ahmedabad"
              note="Hyatt Regency on Ashram Road, Novotel near SG Highway, or The House of MG inside the old city."
              links={ahmedabadLinks}
            />
          </div>

          <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Booking order across the series</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Lock in Nagpur first: it&apos;s the series opener, the ground sells out within days of release, and
              the sensible hotels are a short list. Then Ahmedabad&apos;s House of MG if you want it. Chennai has
              the most choice and can wait longest. Because Chennai and Ahmedabad are four weeks apart, don&apos;t
              hold one booking hostage to the other, and check your cancellation terms before you commit either.
            </p>
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The Airbnb scene</p>
          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
            <p className="text-sm text-[#A3A3A3] leading-6">
              This is three different short-let markets, not one. Chennai has the deepest Airbnb supply of the
              three by a wide margin, concentrated in Mylapore, Alwarpet and T. Nagar, since it&apos;s a large
              metro with a year-round rental market independent of cricket. Ahmedabad&apos;s listings cluster
              around the Old City (handy if you want a heritage-house stay inside the pols) and the Ashram Road
              and SG Highway side near Motera, but the pool is noticeably thinner than Chennai&apos;s. Nagpur is
              the weakest of the three for Airbnb: it&apos;s a smaller city with a shallower short-let market even
              outside a Test, so inventory tightens fast once dates are fixed, and what&apos;s listed is mostly
              standalone apartments rather than full houses. We can&apos;t verify live pricing or availability
              here since Airbnb inventory shifts in real time, but the pattern across all three cities is the
              same: a Test match pulls the same small pool of hosts that every other visitor is also looking at,
              so search and book as soon as your dates are fixed, don&apos;t wait for a deal that won&apos;t come.
            </p>
          </div>
        </div>
      )}
    </SpokeShell>
  );
}

function AreaCard({ city, area, detail }: { city: string; area: string; detail: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-1">{city}</p>
      <p className="text-sm font-bold text-white mb-1">{area}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail}</p>
    </div>
  );
}

function HotelBookingCard({
  name,
  note,
  links = [],
}: {
  name: string;
  note: string;
  links?: BookingLink[];
}) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1.5">{name}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{note}</p>
      {links.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[#2A2A2A]">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {links.map((link, i) => (
              <a
                key={link.url ?? i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#AAFF00] underline underline-offset-2 hover:text-white transition-colors"
              >
                {link.label ?? link.platform} →
              </a>
            ))}
          </div>
          {links.some((link) => isRealAffiliateLink(link.url)) && (
            <p className="mt-2 text-xs text-[#6A6A6A]">Affiliate link — we may earn a small commission at no extra cost to you.</p>
          )}
        </div>
      )}
    </div>
  );
}

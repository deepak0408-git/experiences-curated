import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus, isRealAffiliateLink } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "day-trips";

export default async function DayTripsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const find = (s: string) => linkedExperiences.find((e) => e.slug.includes(s));
  const nagpur = [find("deekshabhoomi"), find("tadoba-tiger-safari")];
  const chennai = [find("marina-beach-kapaleeshwarar"), find("mahabalipuram-daytrip")];
  const ahmedabad = [
    find("sabarmati-ashram"),
    find("ahmedabad-old-city"),
    find("kankaria-riverfront"),
    find("statue-of-unity"),
    find("gir-national-park"),
  ];

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
      h1="Nine things worth leaving the ground for, from a half-day temple stop to a two-day lion safari"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      heroImagePosition="center 40%"
      isUnlocked={isUnlocked}
      ctaCopy="All nine trips are free to read in full. Unlocking gets you direct booking links for every tour, plus the calendar work that decides whether they actually fit: the Monday closure that rules out the Statue of Unity on the third day of the Ahmedabad Test, and the safari permit dates that can cost you ₹3,000 a head if you miss them — Tadoba's booking window opens exactly 120 days out and its core zone is closed on Tuesdays."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        A five-Test series in India leaves real gaps between Tests, and India rewards using them. Nagpur has
        almost nothing to do in the city itself beyond the cricket, so a tiger reserve is the natural answer.
        Chennai is a working commercial capital that sends you south to Mahabalipuram for its temples. Ahmedabad
        has the richest mix of any city here, from Gandhi&apos;s home to a UNESCO-listed old city, with the Statue of
        Unity and Asiatic lions as bigger trips. Two of these (Tadoba and Gir) are genuine multi-hour commitments
        rather than afternoon outings, so plan them as their own days.
      </p>

      <Group label="Nagpur" experiences={nagpur} eventSlug={eventSlug} isPro={isPro} />
      <Group label="Chennai" experiences={chennai} eventSlug={eventSlug} isPro={isPro} />
      <Group label="Ahmedabad" experiences={ahmedabad} eventSlug={eventSlug} isPro={isPro} />

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Book these tours</p>
          <div className="flex flex-col gap-3 mb-8">
            <TourBookingCard name="Deekshabhoomi (Ramtek Temples & City Highlights)" links={nagpur[0]?.bookingLinks ?? []} />
            <TourBookingCard name="Tadoba-Andhari Tiger Reserve" links={nagpur[1]?.bookingLinks ?? []} />
            <TourBookingCard name="Marina Beach & Kapaleeshwarar Temple" links={chennai[0]?.bookingLinks ?? []} />
            <TourBookingCard name="Mahabalipuram" links={chennai[1]?.bookingLinks ?? []} />
            <TourBookingCard name="Sabarmati Ashram" links={ahmedabad[0]?.bookingLinks ?? []} />
            <TourBookingCard name="Statue of Unity" links={ahmedabad[3]?.bookingLinks ?? []} />
            <TourBookingCard name="Gir National Park" links={ahmedabad[4]?.bookingLinks ?? []} />
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Our verdict — one per city, and what fits when</p>
          <div className="flex flex-col gap-2 mb-6">
            <p className="text-sm text-[#A3A3A3] leading-6">
              <span className="font-bold text-white">Nagpur:</span>{" "}
              Deekshabhoomi is the easy half-day, 15-20 minutes from the city centre by taxi, and the one stop that
              will stay with you longer than the cricket. Tadoba is 8-10 hours door to door, so do it on a rest day
              rather than a match day, ideally with a night near the park. Nagpur&apos;s three clear days between the
              last possible day of the Test (25 Jan) and Chennai (29 Jan) are the natural window.
            </p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              <span className="font-bold text-white">Chennai:</span>{" "}
              Pair Kapaleeshwarar Temple in the cool morning with Marina Beach at golden hour as a natural half-day
              close to Chepauk. Mahabalipuram takes 3.5-5 hours on site plus roughly 75 minutes each way, so it
              needs a proper rest day, not a gap between sessions.
            </p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              <span className="font-bold text-white">Ahmedabad:</span>{" "}
              The Old City heritage walk (7:45-10:30am) is the morning, and Sabarmati Ashram (open 10am-6pm) is
              the afternoon, but they sit on opposite sides of the river, so give each real time rather than
              cramming both. Kankaria or the riverfront that evening. Save the Statue of Unity and Gir for days
              when there is no Test.
            </p>
          </div>

          <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-6">
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The Monday trap at Ahmedabad</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              The Ahmedabad Test runs Saturday 27 February to Wednesday 3 March, so every day of the Test is a match
              day, and the Statue of Unity is closed on Mondays (1 March is the Test&apos;s third day). Timed
              Viewing Gallery slots also fill in winter&apos;s peak season. Do the Statue as a full day before the
              Test starts, on a Thursday or Friday (25 or 26 February), and book the slot online in advance.
            </p>
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Book the safari permits first</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Both safaris need permits booked online through the state forest department portals. Tadoba booking
            opens at 12:00am IST exactly 120 days ahead, which for a Wednesday 27 January safari is around 29
            September 2026. Booking that early is the expensive window (₹8,800 weekday against ₹5,800 if you wait
            until inside 59 days, which is around 28 November for that date), so it&apos;s a straight trade between
            price and certainty. The core zone is closed on Tuesdays. Gir opens exactly 90 days
            ahead: for a safari on 25 February, that&apos;s roughly 27 November 2026. Gir is a 2-day trip
            (about 360km, 7-8 hours each way), and the four-week gap after Chennai is where it fits, not Test week.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}

type Exp = NonNullable<Awaited<ReturnType<typeof getSpokeData>>["linkedExperiences"][number]>;

function Group({ label, experiences, eventSlug, isPro }: { label: string; experiences: (Exp | undefined)[]; eventSlug: string; isPro: boolean }) {
  const cards = experiences.filter((e): e is Exp => Boolean(e));
  if (cards.length === 0) return null;
  return (
    <>
      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">{label}</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {cards.map((exp, i) => (
          <div key={exp.id} className={i === cards.length - 1 && cards.length % 2 !== 0 ? "sm:col-span-2" : ""}>
            <SpokeExperienceCard eventSlug={eventSlug} experience={exp} isPro={isPro} />
          </div>
        ))}
      </div>
    </>
  );
}

function TourBookingCard({
  name,
  note,
  links = [],
}: {
  name: string;
  note?: string;
  links?: Array<{ platform: string; label?: string; url: string }>;
}) {
  if (links.length === 0) return null;

  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1.5">{name}</p>
      {note && <p className="text-sm text-[#A3A3A3] leading-6 mb-3">{note}</p>}
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
  );
}

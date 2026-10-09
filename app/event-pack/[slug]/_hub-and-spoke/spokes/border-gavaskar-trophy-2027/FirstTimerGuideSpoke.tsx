import Link from "next/link";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "first-timer-guide";

export default async function FirstTimerGuideSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const rivalry = linkedExperiences.find((e) => e.slug.includes("bgt-rivalry-history"));
  const primer = linkedExperiences.find((e) => e.slug.includes("first-time-india"));

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
      h1="The rivalry you're watching, and the practical basics that make a first India trip smooth"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        This is a long series in a country most visitors haven&apos;t been to before, watching a rivalry that has
        produced some of the best Test cricket this century. You don&apos;t need to know the history to enjoy a day
        at the ground, but a little of it changes what you&apos;re watching for. The practical side matters just as
        much, because most first-timer trouble in India comes from a handful of avoidable basics.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The rivalry you&apos;re actually watching</p>
      <div className="flex flex-col gap-3 mb-6">
        <FactCard title="India has won 10 of the 17 series" detail="The trophy was named in 1996-97 for Allan Border and Sunil Gavaskar. Australia won the last series 3-1 at home in 2024/25, so expect the local coverage to ask whether India can win the trophy back." />
        <FactCard title="Two matches explain the whole rivalry" detail="Kolkata 2001, where Australia enforced the follow-on and VVS Laxman's 281 and Rahul Dravid's 180 turned it into an Indian win, and the Gabba 2021, where a depleted Indian side chased 329 at a ground Australia hadn't lost at in decades. Watch both before you go." />
        <FactCard title="Series here swing hard" detail="India were bowled out for 36 in Adelaide in 2020-21 and still won the series. Don't treat a four-series streak as a foregone conclusion." />
      </div>
      {rivalry && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={rivalry} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">How a Test day works</p>
      <div className="flex flex-col gap-3 mb-8">
        <FactCard title="Play starts at 9:30am IST" detail="At Nagpur, Chennai and Ahmedabad. Each Test runs five days, with three sessions and lunch and tea breaks. Every day has a different feel, so don't judge the whole experience off one day." />
        <FactCard title="Each ground plays differently" detail="Nagpur's pitch tends to play true on day one and turn hard by day three. Chepauk turns too, but slower and lower. Ahmedabad is rated a balanced surface, good for both batting and bowling. Don't assume they behave alike." />
        <FactCard title="These crowds know the game" detail="Chennai's is regarded as among the most knowledgeable in Indian cricket. Ask a local about the 1986 tied Test before play starts: it's a point of civic pride and a good way into a conversation with the people around you." />
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The basics for a first trip to India</p>
      <div className="flex flex-col gap-3 mb-6">
        <FactCard title="Get a local SIM or eSIM the moment you land" detail="Airtel and Jio both cover all three cities, and a 28-day tourist plan costs only a few dollars. Set up an eSIM before you fly if your phone supports it." />
        <FactCard title="Carry rupees, in small notes" detail="Card acceptance has grown, but plenty of transport, small restaurants and street food stalls are cash-only. Exchange money only at authorised outlets." />
        <FactCard title="Digital payments for visitors are limited" detail="India's UPI system now has a wallet product for foreign visitors from a list of countries (UPI One World), set up with a passport and visa. It's for paying merchants, not for sending money to people, and eligibility depends on your nationality, so check before relying on it." />
        <FactCard title="Don't drink the tap water" detail="Use sealed bottled water with an intact cap, including for brushing your teeth, and be cautious with ice. This one habit prevents most first-timer stomach trouble." />
        <FactCard title="Build real slack into every journey" detail="Traffic in all three cities is dense and doesn't move at Western city speeds, and a Test match adds its own surge around the ground before play and after stumps. A trip that Google Maps says is 20 minutes can easily take 40-45 in matchday traffic. Leave earlier than feels necessary for every transfer, especially on your way to the ground." />
        <FactCard title="Right hand, shoes off, modest dress" detail="Use your right hand for handing over money or touching someone, cover shoulders and knees at temples and the ashram, and expect to remove your shoes. Bargaining is normal in markets and not expected in fixed-price shops." />
        <FactCard title="Tipping" detail="Roughly ₹200-500 a day for a driver, ₹300-500 per guide session, ₹50-100 for hotel porters, and 10% at restaurants if a service charge isn't already on the bill." />
      </div>
      {primer && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={primer} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Mistakes most first-timers make</p>
      <div className="flex flex-col gap-3 mb-8">
        <FactCard title="Leaving the visa until late">
          Most eligible visitors use the e-Tourist visa (US$10-40 depending on duration), which typically clears in
          about 72 hours but only works through{" "}
          <a href="https://indianvisaonline.gov.in/evisa/tvoa.html" target="_blank" rel="noopener noreferrer" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            33 designated airports
          </a>
          . Apply before you book flights, not after.
        </FactCard>
        <FactCard title="Treating the four-week gap as an afterthought">
          Chennai ends on 2 February and Ahmedabad starts on 27 February. Decide early what fills the gap. See the{" "}
          <Link href={`/event-pack/${eventSlug}/itinerary`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Trip Schedule guide
          </Link>{" "}
          and the{" "}
          <Link href={`/event-pack/${eventSlug}/day-trips`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Day Trips guide
          </Link>
          .
        </FactCard>
        <FactCard title="Assuming Nagpur to Chennai is a quick hop">
          There&apos;s no direct flight, and the two Tests start only eight days apart. Build in a real travel day,
          and see the{" "}
          <Link href={`/event-pack/${eventSlug}/getting-there`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Getting There guide
          </Link>
          .
        </FactCard>
        <FactCard title="Packing for one climate">
          Nagpur mornings need a jacket, Chennai is humid, Ahmedabad is dry and sunny. See the{" "}
          <Link href={`/event-pack/${eventSlug}/weather`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Weather guide
          </Link>
          .
        </FactCard>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">This tour, in real numbers</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Five Tests across six weeks (21 January to 3 March 2027). This pack covers three of them, Nagpur, Chennai
          and Ahmedabad, at grounds ranging from Nagpur&apos;s 45,000 seats to Ahmedabad&apos;s 132,000. The series also visits
          Guwahati and Ranchi, which this pack doesn&apos;t cover.
        </p>
      </div>
    </SpokeShell>
  );
}

function FactCard({ title, detail, children }: { title: string; detail?: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1">{title}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail ?? children}</p>
    </div>
  );
}

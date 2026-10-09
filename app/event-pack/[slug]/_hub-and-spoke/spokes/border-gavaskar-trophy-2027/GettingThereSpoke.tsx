import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "getting-there";

export default async function GettingThereSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const vca = linkedExperiences.find((e) => e.slug.includes("vca-getting-there"));
  const chepauk = linkedExperiences.find((e) => e.slug.includes("chepauk-getting-there"));
  const motera = linkedExperiences.find((e) => e.slug.includes("motera-getting-there"));

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
      h1="Nagpur is the hard one, Chennai is walkable, and Ahmedabad built a metro station for the stadium"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Three grounds, three completely different transport situations. VCA Stadium sits about 15km outside Nagpur
        with no walkable corridor around it, so getting the plan wrong there genuinely costs you part of a session.
        Chepauk is in the middle of central Chennai. Narendra Modi Stadium is the only ground in this pack with its
        own dedicated metro station, and on matchday it is the option to use.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The three grounds, in order of difficulty</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {vca && <SpokeExperienceCard eventSlug={eventSlug} experience={vca} isPro={isPro} />}
        {chepauk && <SpokeExperienceCard eventSlug={eventSlug} experience={chepauk} isPro={isPro} />}
        {motera && (
          <div className="sm:col-span-2">
            <SpokeExperienceCard eventSlug={eventSlug} experience={motera} isPro={isPro} />
          </div>
        )}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Between the cities</p>
      <div className="flex flex-col gap-3 mb-8">
        <RouteRow route="Nagpur → Chennai" detail="No direct flight. Connect through Hyderabad, Mumbai, or Delhi, and treat it as a genuine travel day. Nagpur's last possible day (25 Jan) and Chennai's first (29 Jan) are only four days apart, so don't plan to catch Nagpur's last session and be in Chennai for the next morning's toss." />
        <RouteRow route="Nagpur → Ahmedabad" detail="A direct route of under two hours, served by IndiGo and Air India, so this leg is easy whenever you end up flying it." />
        <RouteRow route="Chennai → Ahmedabad" detail="Nearly four weeks separate these two Tests, so this is a planning decision more than a flight. Check current schedules when you book, and see the Trip Schedule guide for how to use the gap." />
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Essential apps for this trip</p>
      <div className="flex flex-col gap-3 mb-8">
        <FactRow label="Metro and transit" value="Chennai Metro Rail has its own official app with QR tickets and a journey planner, and Nagpur Metro Rail has an official app for tickets, routes and first/last train times. Ahmedabad's metro is run by GMRC, and QR tickets are also sold through third-party booking apps. Install the one for the city you're in, not all three at once." />
        <FactRow label="Ride-hailing" value="Ola and Uber both work for the airport, station and matchday runs, and auto-rickshaws are available at every ground. On big matchdays, vehicles are often stopped 1-1.5km short of the gates at Ahmedabad, so the metro beats a cab there." />
        <FactRow label="Tickets" value="BookMyShow and Paytm Insider for the main Test ticket sales. Set up your account before tickets are released, since the last India-Australia Test at Nagpur sold out within 10-14 days." />
        <FactRow label="Mobile data" value="Airtel and Jio both cover all three cities. A tourist SIM or eSIM costs a few dollars, and setting up an eSIM before you fly means you land with working data." />
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Plan the route before you book flights</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The e-Tourist visa only works through{" "}
          <a href="https://indianvisaonline.gov.in/evisa/tvoa.html" target="_blank" rel="noopener noreferrer" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            33 designated international airports
          </a>
          , so check your first landing point is on that list before you commit to a routing. And because
          there&apos;s no direct Nagpur-to-Chennai flight, book the Nagpur-to-Chennai connection early, and decide
          what the four-week gap is for before you book Ahmedabad.
        </p>
      </div>
    </SpokeShell>
  );
}

function RouteRow({ route, detail }: { route: string; detail: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1">{route}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail}</p>
    </div>
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

import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "arrival";

export default async function ArrivalSpoke({ eventSlug }: { eventSlug: string }) {
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
      status="public"
      h1="Play starts at 9:30am at all three grounds, but each one needs a different amount of margin"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Play starts at 9:30am IST at Nagpur, Chennai and Ahmedabad. What changes from ground to ground is how
        long it takes to actually get to your seat. Nagpur&apos;s ground is 15km out of town on a road that backs up
        on matchday. Chepauk is walkable from central Chennai. Ahmedabad&apos;s stadium is so large that reaching
        your block from the gate takes far longer than you&apos;d expect.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Ground by ground</p>
      <div className="flex flex-col gap-3 mb-8">
        <ArrivalCard
          title="Nagpur · VCA Stadium"
          detail="Gates typically open around 2 hours before the first ball. Don't trust the normal 25-35 minute drive from Nagpur Junction on matchday: traffic management for an India-Australia fixture backs roads up before the gates open. Outside food, drinks and large bags aren't allowed past the gates, and food court queues get long once play starts. If you drive, leave before the close of play or expect a long exit queue."
        />
        <ArrivalCard
          title="Chennai · Chepauk"
          detail="Chepauk MRTS station is a 2-minute walk from the ground, and Triplicane is about a 9-minute walk. The roads around the stadium are heavily restricted on matchdays, so walk in or take an auto-rickshaw from a few streets back rather than trying to park close. Bring a layer: the sea breeze picks up through the afternoon."
        />
        <ArrivalCard
          title="Ahmedabad · Narendra Modi Stadium"
          detail="Take the metro to Motera Stadium station, the northern terminus of the Red Line, which drops you much closer to the entrances than a cab can. On a big fixture, private vehicles and some rideshares are stopped 1-1.5km short at the main road, leaving a walk to the gates. Then allow extra time inside: with 132,000 seats, getting from the gate to your block, or to food and back, takes noticeably longer than at a normal-sized ground."
        />
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm font-bold text-white mb-2">Exact gate-opening times aren&apos;t published yet</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The 9:30am start time is confirmed for all three grounds, but gate-opening times for the 2027 Tests
          haven&apos;t been announced. The roughly 2-hour figure at Nagpur comes from VCA&apos;s own past practice, and
          we&apos;re not applying it to the other two grounds without confirmation. Check each ground&apos;s ticketing
          channel closer to the Test.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What&apos;s not allowed in</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Indian cricket boards haven&apos;t published a 2027-specific prohibited items list yet, but BCCI venue
        security is consistent across major Tests and has held at every ground in this pack&apos;s recent history.
        Expect all of the following to be enforced, and don&apos;t pack around it:
      </p>
      <div className="flex flex-col gap-3 mb-8">
        <ArrivalCard
          title="Banned outright"
          detail="Outside food and drink (including sealed bottled water — you buy it again inside), any bag larger than a small backpack or clutch, laptops and tablets, professional cameras with detachable lenses or a zoom beyond a small point-and-shoot, power banks above a modest capacity, lighters and matches, and any sharp object including nail files and multi-tools."
        />
        <ArrivalCard
          title="Usually fine, but confirm per ground"
          detail="Small umbrellas (for sun, not rain gear with a metal spike tip), seat cushions, binoculars, and phones with a standard camera. Flags and banners are typically allowed if they don't carry political, commercial or offensive messaging and aren't on a pole long enough to obstruct the row behind you."
        />
        <ArrivalCard
          title="Security process"
          detail="Expect an airport-style check: metal detector, bag search, and a pat-down, with separate queues by gender at most Indian stadiums. This is also why the gates-open-early guidance above matters — the queue itself, not just the walk in, eats your margin."
        />
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What to actually bring</p>
      <div className="flex flex-col gap-3 mb-8">
        <ArrivalCard
          title="Sun protection, non-negotiable"
          detail="All three Tests run through hours of direct sun with no roof over most seating. Sunscreen, a hat, and sunglasses matter more than almost anything else on this list — reapply at the lunch break, not just once in the morning."
        />
        <ArrivalCard
          title="Cash in small notes"
          detail="Food stalls and vendors inside the ground often run cash-first or have unreliable card readers on a packed matchday. Carry small rupee notes rather than relying on digital payment working smoothly under load."
        />
        <ArrivalCard
          title="A compact clear or soft bag"
          detail="Pack only what fits a small bag, since anything larger gets turned away or you'll be sent back to check it, costing you time and your place in the queue. Phone, cash, sunscreen, a compact umbrella for shade, and your printed or digital ticket confirmation is realistically the full kit."
        />
        <ArrivalCard
          title="A physical ticket backup"
          detail="Some Indian Test bookings have required collecting a physical ticket at the ground before play, not just showing a phone screen at the gate. Check your booking confirmation for a collection instruction in advance, and don't assume an e-ticket alone will get you in."
        />
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Arrival mistakes to avoid</p>
      <div className="flex flex-col gap-3">
        <ArrivalCard
          title="Trusting the off-peak drive time"
          detail="Every ground in this pack has a normal, free-flowing journey time that simply doesn't apply on matchday. Nagpur's 25-35 minutes from the centre, a short Ahmedabad metro ride, a walk from Triplicane — all of them lengthen once 30,000-130,000 people are converging on the same roads at once."
        />
        <ArrivalCard
          title="Packing a bag you'll have to check or dump"
          detail="A laptop bag, a backpack with a laptop compartment, or a camera bag with a zoom lens is the single most common reason for a slow, frustrating entry. Decide what you're carrying the night before, not in the queue."
        />
        <ArrivalCard
          title="Skipping the reapply on sunscreen"
          detail="A full day session runs well past when a single morning application wears off. Carry travel-size sunscreen in your small bag and reapply at the lunch interval."
        />
        <ArrivalCard
          title="Not knowing your exit plan before play ends"
          detail="The crush leaving the ground at stumps is often worse than arriving, especially for a packed India-Australia session. Decide your route out, and your ride or metro plan, before the last session starts rather than figuring it out amid the crowd."
        />
      </div>
    </SpokeShell>
  );
}

function ArrivalCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1">{title}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail}</p>
    </div>
  );
}

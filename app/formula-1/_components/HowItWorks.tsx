import { Search, CalendarDays, Ticket, MapPin, Flag } from "lucide-react";

const STEPS = [
  { Icon: Search, title: "Discover", desc: "Find the Grand Prix that fits you." },
  { Icon: CalendarDays, title: "Compare", desc: "Explore dates, costs and options." },
  { Icon: Ticket, title: "Find", desc: "Get the right seats and plan race weekend." },
  { Icon: MapPin, title: "Plan", desc: "Build your itinerary and explore beyond the circuit." },
  { Icon: Flag, title: "Prepare", desc: "Get race-weekend ready and make every moment count." },
];

// Section 2 — informational only, not a navigable wizard, per spec.
export default function HowItWorks() {
  return (
    <section className="bg-[#141414]">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-1">How It Works</p>
        <h2 className="text-xl sm:text-2xl font-black text-white mb-8">From first thought to final lap</h2>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2">
          {STEPS.map(({ Icon, title, desc }, i) => (
            <div key={title} className="relative flex sm:flex-col items-start sm:items-center gap-4 sm:gap-3 sm:text-center">
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-full border border-[#AAFF00] bg-[#0A0A0A] flex items-center justify-center">
                  <Icon size={18} strokeWidth={2} className="text-[#AAFF00]" aria-hidden="true" />
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden sm:block absolute top-1/2 left-full w-full h-px bg-[#2A2A2A] -translate-y-1/2" style={{ width: "calc(100% - 2.75rem)", marginLeft: "0.5rem" }} />
                )}
              </div>
              <div>
                <p className="text-sm font-black text-white">{i + 1}. {title}</p>
                <p className="text-xs text-[#A3A3A3] mt-1 sm:max-w-[9rem]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

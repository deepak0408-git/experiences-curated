"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { phEvent } from "@/lib/posthog-events";
import EventSelectorModal from "./EventSelectorModal";
import TripPlanningModal from "./TripPlanningModal";
import type { CockpitEvent } from "../_lib/getCockpitEvents";

const CARD_TO_PH_KEY = {
  exploring: "exploring",
  budget: "budget",
  "chosen-event": "chosen_event",
  planning: "planning",
} as const;

const CARDS = [
  {
    key: "exploring",
    image: "/tennis/get-started-exploring.jpg",
    title: "I'm exploring",
    label: "Trip Intelligence",
    subtitle: "Find your matching tournament",
    free: true,
  },
  {
    key: "budget",
    image: "/tennis/get-started-budget.jpg",
    title: "I have a budget",
    label: "Trip Planner",
    subtitle: "Plan your trip budget",
    free: true,
  },
  {
    key: "chosen-event",
    image: "/tennis/get-started-chosen-event.jpg",
    title: "I've chosen my tournament",
    label: "Ticket Intelligence & Event Guides",
    subtitle: "Find your ticket and plan your trip",
    free: false,
  },
  {
    key: "planning",
    image: "/tennis/get-started-planning-trip.jpg",
    title: "I'm planning my trip",
    label: "Trip Board & Custom Itineraries",
    subtitle: "Build and share your itinerary",
    free: false,
  },
] as const;

export default function GetStartedCards({
  events,
  userEmail,
}: {
  events: CockpitEvent[];
  userEmail: string | null;
}) {
  const [openModal, setOpenModal] = useState<"event" | "trip" | null>(null);

  return (
    <section className="bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-1">Get Started</p>
        <h2 className="text-xl sm:text-2xl font-black text-white mb-8">Where are you in your tennis travel journey?</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CARDS.map((card) => {
            const inner = (
              <>
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                {/* FREE badge — same visual pattern as the Event Pack's
                    free/paid spoke badges (HubPage.tsx), per founder
                    direction 19 Nov 2026 (Issue 7). Only Trip Intelligence
                    and Trip Planner are genuinely free; the other two cards
                    route to paid products, so they get no badge at all. */}
                {card.free && (
                  <span className="absolute top-3 right-3 text-[9px] font-black tracking-widest uppercase rounded-sm px-2 py-0.5 border backdrop-blur-sm text-[#AAFF00] border-[#AAFF00]/50 bg-black/30">
                    Free
                  </span>
                )}
                <div className="relative p-3.5 flex flex-col justify-end h-full">
                  <p className="text-sm font-black text-white leading-tight mb-1">{card.title}</p>
                  <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-1">{card.label}</p>
                  <p className="text-xs text-white/80 leading-snug">{card.subtitle}</p>
                </div>
              </>
            );

            const className = "group relative overflow-hidden rounded-sm aspect-[3/4] block border border-[#2A2A2A] hover:border-[#AAFF00] transition-colors duration-300 text-left cursor-pointer";

            const fireCardClick = () => phEvent.tennisCockpitCardClicked({ card: CARD_TO_PH_KEY[card.key] });

            if (card.key === "exploring") {
              return (
                <Link key={card.key} href="/trip-intelligence/tennis?from=tennis-cockpit" className={className} onClick={fireCardClick}>
                  {inner}
                </Link>
              );
            }
            if (card.key === "budget") {
              return (
                <Link key={card.key} href="/planner?sport=tennis&from=tennis-cockpit" className={className} onClick={fireCardClick}>
                  {inner}
                </Link>
              );
            }
            if (card.key === "chosen-event") {
              return (
                <button
                  key={card.key}
                  type="button"
                  onClick={() => {
                    fireCardClick();
                    phEvent.tennisCockpitModalOpened({ modal: "event_selector", source: "card" });
                    setOpenModal("event");
                  }}
                  className={className}
                >
                  {inner}
                </button>
              );
            }
            return (
              <button
                key={card.key}
                type="button"
                onClick={() => {
                  fireCardClick();
                  phEvent.tennisCockpitModalOpened({ modal: "trip_planning", source: "card" });
                  setOpenModal("trip");
                }}
                className={className}
              >
                {inner}
              </button>
            );
          })}
        </div>
      </div>

      <EventSelectorModal
        open={openModal === "event"}
        onClose={() => setOpenModal(null)}
        events={events}
        userEmail={userEmail}
      />
      <TripPlanningModal
        open={openModal === "trip"}
        onClose={() => setOpenModal(null)}
        events={events}
        userEmail={userEmail}
      />
    </section>
  );
}

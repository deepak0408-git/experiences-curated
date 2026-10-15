"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { phEvent } from "@/lib/posthog-events";
import GpSelectorModal from "./GpSelectorModal";
import TripPlanningModal from "./TripPlanningModal";
import type { CockpitEvent } from "../_lib/getCockpitEvents";

const CARD_TO_PH_KEY = {
  exploring: "exploring",
  budget: "budget",
  "chosen-gp": "chosen_gp",
  planning: "planning",
} as const;

const CARDS = [
  {
    key: "exploring",
    image: "/formula-1/get-started-exploring.jpg",
    title: "I'm exploring",
    label: "Trip Intelligence · Free",
    subtitle: "Find your matching Grand Prix",
  },
  {
    key: "budget",
    image: "/formula-1/get-started-budget.jpg",
    title: "I have a budget",
    label: "Trip Planner · Free",
    subtitle: "Plan your trip budget",
  },
  {
    key: "chosen-gp",
    image: "/formula-1/get-started-chosen-gp.jpg",
    title: "I've chosen my Grand Prix",
    label: "Ticket Intelligence & Event Guides",
    subtitle: "Find best seats and plan your trip",
  },
  {
    key: "planning",
    image: "/formula-1/get-started-planning-trip.jpg",
    title: "I'm planning my trip",
    label: "Trip Board & Custom Itineraries",
    subtitle: "Build and share your itinerary",
  },
] as const;

export default function GetStartedCards({
  events,
  userEmail,
}: {
  events: CockpitEvent[];
  userEmail: string | null;
}) {
  const [openModal, setOpenModal] = useState<"gp" | "trip" | null>(null);

  return (
    <section className="bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-1">Get Started</p>
        <h2 className="text-xl sm:text-2xl font-black text-white mb-8">Where are you in your F1 journey?</h2>

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
                <div className="relative p-3.5 flex flex-col justify-end h-full">
                  <p className="text-sm font-black text-white leading-tight mb-1">{card.title}</p>
                  <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-1">{card.label}</p>
                  <p className="text-xs text-white/80 leading-snug">{card.subtitle}</p>
                </div>
              </>
            );

            const className = "group relative overflow-hidden rounded-sm aspect-[3/4] block border border-[#2A2A2A] hover:border-[#AAFF00] transition-colors duration-300 text-left cursor-pointer";

            const fireCardClick = () => phEvent.cockpitCardClicked({ card: CARD_TO_PH_KEY[card.key] });

            if (card.key === "exploring") {
              return (
                <Link key={card.key} href="/trip-intelligence/formula-1?from=cockpit" className={className} onClick={fireCardClick}>
                  {inner}
                </Link>
              );
            }
            if (card.key === "budget") {
              return (
                <Link key={card.key} href="/planner?sport=formula_one&from=cockpit" className={className} onClick={fireCardClick}>
                  {inner}
                </Link>
              );
            }
            if (card.key === "chosen-gp") {
              return (
                <button
                  key={card.key}
                  type="button"
                  onClick={() => {
                    fireCardClick();
                    phEvent.cockpitModalOpened({ modal: "gp_selector", source: "card" });
                    setOpenModal("gp");
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
                  phEvent.cockpitModalOpened({ modal: "trip_planning", source: "card" });
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

      <GpSelectorModal
        open={openModal === "gp"}
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

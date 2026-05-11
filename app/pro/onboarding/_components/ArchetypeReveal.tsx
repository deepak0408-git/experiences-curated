"use client";

import Link from "next/link";
import { ARCHETYPE_DETAILS, type Archetype } from "@/lib/quiz";

const R2 = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "";

const EVENT_PACKS = [
  {
    slug: "wimbledon-2026",
    name: "Wimbledon 2026",
    dates: "30 Jun – 13 Jul 2026",
    location: "London",
    sport: "Tennis",
    heroImageUrl: `${R2}/sporting-events/hero/wimbledon-2026.jpg`,
  },
  {
    slug: "us-open-2026",
    name: "US Open 2026",
    dates: "25 Aug – 7 Sep 2026",
    location: "New York",
    sport: "Tennis",
    heroImageUrl: `${R2}/sporting-events/hero/us-open-2026.jpg`,
  },
];

interface Props {
  archetype: Archetype;
}

export default function ArchetypeReveal({ archetype }: Props) {
  const details = ARCHETYPE_DETAILS[archetype];

  return (
    <div className="max-w-xl mx-auto text-center">
      <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-3">
        Your traveller type
      </p>
      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-3">
        {details.label}
      </h1>
      <p className="text-base font-medium text-neutral-600 mb-5 italic">
        &ldquo;{details.tagline}&rdquo;
      </p>
      <p className="text-sm text-neutral-500 leading-7 mb-10">
        {details.description}
      </p>

      <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-5">
        Upcoming event packs
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {EVENT_PACKS.map((pack) => (
          <Link
            key={pack.slug}
            href={`/event-pack/${pack.slug}`}
            className="group text-left rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-400 transition-colors"
          >
            <div className="h-32 overflow-hidden bg-neutral-100">
              <img
                src={pack.heroImageUrl}
                alt={pack.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-1">
                {pack.sport} · {pack.location}
              </p>
              <p className="text-sm font-bold text-neutral-900 group-hover:text-neutral-600 transition-colors mb-1">
                {pack.name}
              </p>
              <p className="text-xs text-neutral-400">{pack.dates}</p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}

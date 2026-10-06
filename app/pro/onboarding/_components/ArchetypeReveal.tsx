"use client";

import Link from "next/link";
import Image from "next/image";
import { ARCHETYPE_DETAILS, type Archetype } from "@/lib/quiz";

const R2 = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "";

const EVENT_PACKS = [
  {
    // Real, current slug post evergreen-slug migration (14 Aug 2026) — was
    // "wimbledon-2026". Updated to the 2027 edition (28 Jun–11 Jul 2027)
    // when the sportingEvents row was rolled over to 2027, 14 Aug 2026 —
    // this hardcoded copy has already gone stale once (drifted to "30 Jun –
    // 13 Jul" against 2026's real dates) and will again every year this
    // table isn't updated in lockstep with the DB row. This whole
    // EVENT_PACKS array is a hardcoded per-event table of the kind flagged
    // in feedback_avoid_hardcoded_per_entity_tables — should be replaced
    // with a real query against sportingEvents (name/dates/heroImageUrl are
    // all already DB fields) rather than patched by hand every time an
    // evergreen event rolls to its next edition.
    slug: "wimbledon",
    name: "Wimbledon 2027",
    dates: "28 Jun – 11 Jul 2027",
    location: "London",
    sport: "Tennis",
    heroImageUrl: `${R2}/sporting-events/hero/wimbledon-2026-v2.jpg`,
  },
  {
    // Evergreen-slug migration done 5 Oct 2026 — DB row renamed from
    // "us-open-2026" to "us-open" (Deploy A confirmed live first, per the
    // migration skill's Deploy A/B hard gate). heroImageUrl below keeps the
    // old R2 object key — renaming the file itself is a separate, low-
    // priority cosmetic task, not a routing concern.
    slug: "us-open",
    name: "US Open 2027",
    dates: "29 Aug – 12 Sep 2027",
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
            <div className="relative h-32 overflow-hidden bg-neutral-100">
              <Image
                src={pack.heroImageUrl}
                alt={pack.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, 33vw"
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

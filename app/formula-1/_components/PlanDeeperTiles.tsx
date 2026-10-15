"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { phEvent } from "@/lib/posthog-events";
import DestinationsModal from "./DestinationsModal";

const TILES = [
  {
    key: "articles",
    image: "/formula-1/deeper-articles.jpg",
    title: "F1 Articles",
    desc: "Insights, race guides and more",
    href: "/blog?sport=formula_one&from=cockpit",
  },
  {
    key: "experiences",
    image: "/formula-1/deeper-experiences.jpg",
    title: "F1 Experiences",
    desc: "Explore all F1 experiences",
    href: "/search?sport=formula_one&from=cockpit",
  },
  {
    key: "destinations",
    image: "/formula-1/deeper-destinations.jpg",
    title: "F1 Destinations",
    desc: "Featured F1-related destinations",
  },
] as const;

export default function PlanDeeperTiles() {
  const [destinationsOpen, setDestinationsOpen] = useState(false);

  return (
    <section className="bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-1">F1 Articles and Destinations</p>
        <h2 className="text-xl sm:text-2xl font-black text-white mb-8">Plan deeper. Travel further.</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TILES.map((tile) => {
            const inner = (
              <>
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    src={tile.image}
                    alt=""
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-sm font-black text-white">{tile.title}</p>
                  <p className="text-xs text-white/70 mt-0.5">{tile.desc}</p>
                </div>
              </>
            );
            const className = "group relative overflow-hidden rounded-sm aspect-[4/3] block border border-[#2A2A2A] hover:border-[#AAFF00] transition-colors duration-300 text-left cursor-pointer";

            if (tile.key === "destinations") {
              return (
                <button
                  key={tile.key}
                  type="button"
                  onClick={() => {
                    phEvent.cockpitDeeperTileClicked({ tile: "destinations" });
                    setDestinationsOpen(true);
                  }}
                  className={className}
                >
                  {inner}
                </button>
              );
            }
            return (
              <Link
                key={tile.key}
                href={tile.href}
                className={className}
                onClick={() => phEvent.cockpitDeeperTileClicked({ tile: tile.key })}
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </div>

      <DestinationsModal open={destinationsOpen} onClose={() => setDestinationsOpen(false)} />
    </section>
  );
}

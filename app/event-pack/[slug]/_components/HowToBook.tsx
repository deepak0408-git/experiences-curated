"use client";

import Link from "next/link";

interface Props {
  howToBook: string;
  isPro: boolean;
  eventSlug: string;
  hideProCtas?: boolean;
}

function linkifyText(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return parts.map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-[#AAFF00] hover:text-white transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        Link
      </a>
    ) : (
      part
    )
  );
}

export default function HowToBook({ howToBook, isPro, hideProCtas = false }: Props) {
  if (!isPro) {
    if (hideProCtas) return null;
    return (
      <div className="mt-4 pt-3 border-t border-[#2A2A2A]">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-[#6A6A6A] mb-2">
          How to book
        </p>
        <div className="rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] px-3 py-2.5 flex items-center justify-between gap-3">
          <p className="text-xs text-[#6A6A6A] leading-5">
            Booking contacts and lead times for Pro subscribers.
          </p>
          <Link
            href="/pro"
            className="flex-shrink-0 px-3 py-1.5 rounded-sm bg-[#AAFF00] text-black text-xs font-black hover:bg-[#BBFF33] transition-colors"
          >
            Unlock
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 pt-3 border-t border-[#2A2A2A]">
      <p className="text-[10px] font-semibold tracking-widest uppercase text-[#AAFF00] mb-2">
        How to book
      </p>
      <p className="text-xs text-[#A3A3A3] leading-5">{linkifyText(howToBook)}</p>
    </div>
  );
}

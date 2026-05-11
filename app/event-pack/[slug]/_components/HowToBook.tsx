import Link from "next/link";

interface Props {
  howToBook: string;
  isPro: boolean;
  eventSlug: string;
}

export default function HowToBook({ howToBook, isPro, eventSlug }: Props) {
  if (!isPro) {
    return (
      <div className="mt-4 pt-3 border-t border-neutral-100">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-2">
          How to book
        </p>
        <div className="rounded-lg bg-neutral-50 border border-neutral-200 px-3 py-2.5 flex items-center justify-between gap-3">
          <p className="text-xs text-neutral-400 leading-5">
            Booking contacts and lead times for Pro subscribers.
          </p>
          <Link
            href="/pro"
            className="flex-shrink-0 px-3 py-1.5 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-700 transition-colors"
          >
            Unlock
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 pt-3 border-t border-neutral-100">
      <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-2">
        How to book
      </p>
      <p className="text-xs text-neutral-700 leading-5">{howToBook}</p>
    </div>
  );
}

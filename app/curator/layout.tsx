import Link from "next/link";

export default function CuratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <header className="bg-[#141414] border-b border-[#2A2A2A] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="hidden sm:block">
              <Link href="/" className="text-sm font-semibold tracking-widest text-[#6A6A6A] uppercase hover:text-[#AAFF00] transition-colors">
                Experiences | Curated
              </Link>
              <span className="mx-2 text-[#2A2A2A]">·</span>
              <span className="text-sm text-[#6A6A6A]">Curator Portal</span>
            </div>
            <nav className="flex items-center gap-1">
              <Link
                href="/curator/review"
                className="px-3 py-1.5 rounded-sm text-sm text-[#6A6A6A] hover:bg-[#1A1A1A] hover:text-[#AAFF00] transition-colors"
              >
                Review
              </Link>
              <Link
                href="/curator/ranker"
                className="px-3 py-1.5 rounded-sm text-sm text-[#6A6A6A] hover:bg-[#1A1A1A] hover:text-[#AAFF00] transition-colors"
              >
                Ranker
              </Link>
              <Link
                href="/curator/events"
                className="px-3 py-1.5 rounded-sm text-sm text-[#6A6A6A] hover:bg-[#1A1A1A] hover:text-[#AAFF00] transition-colors"
              >
                Events
              </Link>
              <Link
                href="/curator/feedback"
                className="px-3 py-1.5 rounded-sm text-sm text-[#6A6A6A] hover:bg-[#1A1A1A] hover:text-[#AAFF00] transition-colors"
              >
                Feedback
              </Link>
              <Link
                href="/curator/destinations"
                className="px-3 py-1.5 rounded-sm text-sm text-[#6A6A6A] hover:bg-[#1A1A1A] hover:text-[#AAFF00] transition-colors"
              >
                Destinations
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}

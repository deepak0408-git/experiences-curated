import Link from "next/link";

export default function CuratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <Link href="/" className="text-sm font-semibold tracking-widest text-neutral-400 uppercase hover:text-neutral-600 transition-colors">
                Experiences | Curated
              </Link>
              <span className="mx-2 text-neutral-300">·</span>
              <span className="text-sm text-neutral-500">Curator Portal</span>
            </div>
            <nav className="flex items-center gap-1">
              <Link
                href="/curator/review"
                className="px-3 py-1.5 rounded-md text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
              >
                Review
              </Link>
              <Link
                href="/curator/destinations"
                className="px-3 py-1.5 rounded-md text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
              >
                Destinations
              </Link>
              <Link
                href="/curator/submit"
                className="px-3 py-1.5 rounded-md text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
              >
                + New Experience
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}

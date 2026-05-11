import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-neutral-100 bg-white">
      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs text-neutral-400">
          © {new Date().getFullYear()} Experiences | Curated
        </span>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">
            Terms
          </Link>
          <a
            href="mailto:hello@experiencescurated.com"
            className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

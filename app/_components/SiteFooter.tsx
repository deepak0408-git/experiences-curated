import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-neutral-100 bg-white">
      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs text-neutral-400">
          Â© {new Date().getFullYear()} Experiences | Curated
        </span>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">
            Terms
          </Link>
          <Link href="/help" className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">
            Support
          </Link>
          <a
            href="mailto:hello@experiences-curated.com"
            className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 pb-5">
        <p className="text-xs text-neutral-300">
          Some booking links are affiliate links. We may earn a small commission at no extra cost to you.{" "}
          <Link href="/terms" className="underline underline-offset-2 hover:text-neutral-400 transition-colors">
            Learn more
          </Link>
        </p>
      </div>
    </footer>
  );
}

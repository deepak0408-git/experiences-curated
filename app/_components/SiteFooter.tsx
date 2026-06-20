import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-auto bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs text-[#6A6A6A]">
          &copy; {new Date().getFullYear()} Experiences | Curated
        </span>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="text-xs text-[#6A6A6A] hover:text-[#AAFF00] transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="text-xs text-[#6A6A6A] hover:text-[#AAFF00] transition-colors">
            Terms
          </Link>
          <Link href="/help" className="text-xs text-[#6A6A6A] hover:text-[#AAFF00] transition-colors">
            Support
          </Link>
          <a
            href="mailto:hello@experiences-curated.com"
            className="text-xs text-[#6A6A6A] hover:text-[#AAFF00] transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 pb-5">
        <p className="text-xs text-[#3A3A3A]">
          Some booking links are affiliate links. We may earn a small commission at no extra cost to you.{" "}
          <Link href="/terms" className="underline underline-offset-2 hover:text-[#6A6A6A] transition-colors">
            Learn more
          </Link>
        </p>
      </div>
    </footer>
  );
}

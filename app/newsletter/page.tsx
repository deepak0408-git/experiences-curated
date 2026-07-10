import Link from "next/link";
import { NewsletterForm } from "./_components/NewsletterForm";

export const metadata = { title: "The one thing you won't know until it's too late — Experiences | Curated" };

export default async function NewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const utmSource = typeof params.utm_source === "string" ? params.utm_source : "direct";

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-4">
          Experiences | Curated
        </p>
        <h1 className="text-2xl sm:text-4xl font-black text-white leading-snug mb-3">
          The one thing you won&apos;t know until it&apos;s too late.
        </h1>
        <p className="max-w-md mx-auto text-sm text-[#A3A3A3] leading-relaxed mb-8">
          Sold-out shuttles. Grandstands gone by June. The restaurant that needed booking
          three weeks ago. The one gate locals use to skip the queue everyone else stands
          in. Most fans find out after. One email when a new event guide goes live —
          nothing else.
        </p>
        <div className="max-w-md mx-auto">
          <NewsletterForm source={utmSource} />
        </div>
        <Link
          href="/"
          className="mt-4 inline-block text-xs text-[#6A6A6A] hover:text-[#AAFF00] transition-colors"
        >
          Not ready? Browse the site first →
        </Link>
      </div>
    </div>
  );
}

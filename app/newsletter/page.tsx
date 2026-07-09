import { NewsletterForm } from "./_components/NewsletterForm";

export const metadata = { title: "Get insider guides for the sports events you're going to — Experiences | Curated" };

export default async function NewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const utmSource = typeof params.utm_source === "string" ? params.utm_source : "direct";

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-4">
          Experiences | Curated
        </p>
        <h1 className="text-2xl sm:text-3xl font-black text-white leading-snug mb-3">
          Insider guides for the sports events you&apos;re going to
        </h1>
        <p className="text-sm text-[#A3A3A3] leading-relaxed mb-8">
          One email when a new event guide goes live — the best experiences, where to
          eat, where to stay, how to actually get there. No noise, no spam.
        </p>
        <NewsletterForm source={utmSource} />
      </div>
    </div>
  );
}

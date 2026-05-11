import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use — Experiences | Curated",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-neutral-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="text-sm font-semibold tracking-widest uppercase text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            Experiences | Curated
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-14 space-y-10">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-1">Legal</p>
          <h1 className="text-3xl font-bold text-neutral-900">Terms of Use</h1>
          <p className="mt-3 text-sm text-neutral-400">Last updated: 7 May 2026</p>
        </div>

        <section className="space-y-4 text-sm text-neutral-700 leading-7">
          <p>
            By using Experiences | Curated (&ldquo;the Service&rdquo;), you agree to these terms. If you don&apos;t agree, please don&apos;t use the Service. These terms, together with our <Link href="/privacy" className="underline underline-offset-2 hover:text-neutral-900 transition-colors">Privacy Policy</Link>, form a binding agreement between you and us, governed by the laws of India including the Information Technology Act 2000 and the Digital Personal Data Protection Act 2023 (DPDPA).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-neutral-900">1. What the Service is</h2>
          <p className="text-sm text-neutral-700 leading-7">
            Experiences | Curated is an editorially curated travel discovery platform. We research and publish guides to handpicked experiences — restaurants, venues, neighbourhoods, sports events, and more. We are not a booking platform, a travel agent, or a ticketing service. Where booking links appear, they are affiliate links to independent third-party services. We have no control over those services and are not party to any booking you make through them.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-neutral-900">2. Accounts and eligibility</h2>
          <p className="text-sm text-neutral-700 leading-7">
            You must be at least 18 years old to create an account or make a purchase. By registering, you confirm that you meet this requirement.
          </p>
          <p className="text-sm text-neutral-700 leading-7">
            You need an account to save experiences, use the Trip Board, or access event packs. We use magic-link email authentication — we never ask for a password. You are responsible for keeping access to your email account secure.
          </p>
          <p className="text-sm text-neutral-700 leading-7">
            We reserve the right to suspend or terminate your account without notice if you breach these terms, misuse the Service, or engage in fraudulent activity.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-neutral-900">3. Event packs and purchases</h2>
          <p className="text-sm text-neutral-700 leading-7">
            Event packs are digital products sold as one-time purchases. All transactions are processed by Paddle as Merchant of Record. Once purchased, access is tied to your account email and is non-transferable.
          </p>
          <p className="text-sm text-neutral-700 leading-7">
            <strong>Refunds.</strong> Because event packs are digital products with immediate access upon purchase, we do not offer refunds except where required by applicable law. If you believe you were charged in error, contact us at{" "}
            <a href="mailto:hello@experiencescurated.com" className="underline underline-offset-2 hover:text-neutral-900 transition-colors">
              hello@experiencescurated.com
            </a>{" "}
            within 14 days of purchase and we will review your case.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-neutral-900">4. Pro subscription</h2>
          <p className="text-sm text-neutral-700 leading-7">
            Pro is a recurring subscription billed monthly or annually. You can cancel at any time via your profile page — access continues until the end of the current billing period. No partial refunds are issued for unused time. Subscriptions are managed by Paddle; Paddle&apos;s own terms apply to billing.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-neutral-900">5. Content accuracy and assumption of risk</h2>
          <p className="text-sm text-neutral-700 leading-7">
            We verify our guides regularly, but venues change, close, or update their details without notice. We cannot guarantee that any information is current at the time of your visit. Always confirm opening hours, prices, dress codes, ticketing requirements, and availability directly with the venue before travelling.
          </p>
          <p className="text-sm text-neutral-700 leading-7">
            You assume full responsibility for your own travel decisions, including any risks associated with visiting a location. We are not liable for disappointment, wasted travel, injury, or loss arising from reliance on content in the Service.
          </p>
          <p className="text-sm text-neutral-700 leading-7">
            Affiliate booking links take you to independent third-party sites. We are not responsible for those sites, their pricing, their availability, or any bookings made on them.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-neutral-900">6. User-generated content</h2>
          <p className="text-sm text-neutral-700 leading-7">
            Ratings and mood tags you submit through My Travels are associated with your account. Aggregate ratings (from at least three travellers) are shown publicly on experience pages. By submitting a rating, you confirm it reflects your genuine experience and you grant us a non-exclusive, royalty-free licence to display it as part of the public rating for that experience.
          </p>
          <p className="text-sm text-neutral-700 leading-7">
            We reserve the right to remove ratings that are fraudulent, abusive, or in violation of these terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-neutral-900">7. Acceptable use</h2>
          <p className="text-sm text-neutral-700 leading-7">You must not:</p>
          <ul className="space-y-2 text-sm text-neutral-700 leading-7 list-disc list-inside">
            <li>Scrape, crawl, or systematically download content from the Service.</li>
            <li>Share your account or event pack access with others.</li>
            <li>Attempt to circumvent the free-view limit, paywalls, or any other access control.</li>
            <li>Submit false, misleading, or malicious ratings.</li>
            <li>Use the Service for any unlawful purpose or in a way that infringes the rights of others.</li>
            <li>Introduce malware, viruses, or any code designed to disrupt or harm the Service.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-neutral-900">8. Intellectual property</h2>
          <p className="text-sm text-neutral-700 leading-7">
            All editorial content, experience guides, pack materials, and design elements are our property or licensed to us. You may share links to the Service freely. You may not reproduce, republish, or commercially exploit content without our written permission.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-neutral-900">9. Disclaimer of warranties</h2>
          <p className="text-sm text-neutral-700 leading-7">
            The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, express or implied. We do not warrant that the Service will be uninterrupted, error-free, or free of harmful components.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-neutral-900">10. Limitation of liability</h2>
          <p className="text-sm text-neutral-700 leading-7">
            To the maximum extent permitted by law, our total liability to you for any claim arising from your use of the Service is limited to the amount you paid us in the 12 months preceding the claim. We are not liable for any indirect, incidental, consequential, or punitive damages, including loss of profits, data, or goodwill.
          </p>
          <p className="text-sm text-neutral-700 leading-7">
            Nothing in these terms limits liability that cannot be excluded by law, including liability for death or personal injury caused by our negligence, or for fraud.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-neutral-900">11. Indemnification</h2>
          <p className="text-sm text-neutral-700 leading-7">
            You agree to indemnify and hold us harmless from any claims, damages, losses, or legal fees arising from your breach of these terms, your misuse of the Service, or any false or malicious content you submit.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-neutral-900">12. Force majeure</h2>
          <p className="text-sm text-neutral-700 leading-7">
            We are not liable for any failure or delay in performance caused by circumstances beyond our reasonable control, including natural disasters, government action, infrastructure outages, or third-party service failures.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-neutral-900">13. Governing law and jurisdiction</h2>
          <p className="text-sm text-neutral-700 leading-7">
            These terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts of India, except where applicable consumer protection law in your country of residence gives you the right to bring proceedings locally.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-neutral-900">14. Changes to these terms</h2>
          <p className="text-sm text-neutral-700 leading-7">
            We may update these terms from time to time. Material changes will be communicated by email or a notice on the site. Continued use after changes take effect constitutes acceptance of the revised terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-neutral-900">15. Contact</h2>
          <p className="text-sm text-neutral-700 leading-7">
            Questions about these terms? Email{" "}
            <a href="mailto:hello@experiencescurated.com" className="underline underline-offset-2 hover:text-neutral-900 transition-colors">
              hello@experiencescurated.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

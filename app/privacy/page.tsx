import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Experiences | Curated",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-neutral-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            Experiences | Curated
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-14 space-y-10">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-1">Legal</p>
          <h1 className="text-3xl font-bold text-neutral-900">Privacy Policy</h1>
          <p className="mt-3 text-sm text-neutral-400">Last updated: 10 Jun 2026</p>
        </div>

        <section className="space-y-4 text-sm text-neutral-700 leading-7">
          <p>
            Experiences | Curated (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting your personal information. This policy explains what we collect, why, how long we keep it, and how you can control it. It applies to all users of our website and services. We comply with India&apos;s Digital Personal Data Protection Act 2023 (DPDPA) and, where applicable to users in those regions, the UK GDPR and EU GDPR.
          </p>
          <p>
            This service is not directed at children under 16. We do not knowingly collect personal data from anyone under 16. If you believe a child has provided us with their data, contact us and we will delete it promptly.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-neutral-900">1. What we collect</h2>
          <ul className="space-y-2 text-sm text-neutral-700 leading-7 list-disc list-inside">
            <li><strong>Account data</strong> &mdash; your email address when you sign up or purchase an event pack.</li>
            <li><strong>Usage data</strong> &mdash; pages you visit, experiences you view, searches you run, and items you save to your Trip Board.</li>
            <li><strong>Travel log data</strong> &mdash; experiences you mark as visited, ratings, and mood tags you add. These are private by default; only your aggregate rating contributes to the public average.</li>
            <li><strong>Personalisation data</strong> &mdash; your traveller archetype, as determined by the onboarding quiz. This is used to personalise the order of content and search results.</li>
            <li><strong>Purchase data</strong> &mdash; transaction records for event pack purchases, processed by Paddle as Merchant of Record. We do not store card details.</li>
            <li><strong>Cookies</strong> &mdash; we use cookies to maintain your session, remember your free-view count, and (if you consent) to measure search performance via Algolia.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-neutral-900">2. Legal bases for processing</h2>
          <p className="text-sm text-neutral-700 leading-7">
            We process your personal data on the following bases under the DPDPA and, where applicable, UK/EU data protection law:
          </p>
          <ul className="space-y-2 text-sm text-neutral-700 leading-7 list-disc list-inside">
            <li><strong>Contract performance</strong> &mdash; processing your purchase, creating your account, and delivering event pack access.</li>
            <li><strong>Legitimate interests</strong> &mdash; improving the service, personalising content, and preventing fraud. We balance these interests against your rights; you may object at any time (see section 7).</li>
            <li><strong>Legal obligation</strong> &mdash; retaining purchase and financial records as required by tax and commercial law.</li>
            <li><strong>Consent</strong> &mdash; optional analytics cookies. You can withdraw consent at any time via the cookie banner or by emailing us.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-neutral-900">3. How we use it</h2>
          <ul className="space-y-2 text-sm text-neutral-700 leading-7 list-disc list-inside">
            <li>Delivering the service &mdash; showing your saved boards, purchase history, and personalised recommendations.</li>
            <li>Sending transactional emails only &mdash; purchase confirmations and magic-link sign-ins. We do not send marketing emails. If this changes, we will ask for your explicit consent first.</li>
            <li>Personalisation &mdash; your archetype and usage patterns are used to reorder search results and content sections. No solely-automated decisions with legal or significant effects are made about you.</li>
            <li>Improving curation &mdash; aggregate, anonymised usage data helps us understand which experiences are most useful.</li>
            <li>Legal compliance &mdash; retaining purchase records as required by applicable law.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-neutral-900">4. Who we share it with</h2>
          <ul className="space-y-2 text-sm text-neutral-700 leading-7 list-disc list-inside">
            <li><strong>Paddle</strong> &mdash; payment processing and subscription management. Paddle is Merchant of Record for all transactions and has its own <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-neutral-900 transition-colors">privacy policy</a>. Data is processed in the US and UK under Standard Contractual Clauses.</li>
            <li><strong>Supabase</strong> &mdash; authentication and database hosting. We use the EU (West) region. Supabase is GDPR-compliant and processes data under Standard Contractual Clauses.</li>
            <li><strong>Algolia</strong> &mdash; search queries are sent to Algolia to return results. Algolia processes data in the EU and does not link query data to individual users. See <a href="https://www.algolia.com/policies/privacy/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-neutral-900 transition-colors">Algolia&apos;s privacy policy</a>.</li>
            <li><strong>Cloudflare</strong> &mdash; image and asset delivery via R2 and CDN. Data is cached globally; Cloudflare processes data under Standard Contractual Clauses.</li>
          </ul>
          <p className="text-sm text-neutral-700 leading-7">We do not sell your data. We do not share it with advertisers.</p>
        </section>

        <section className=”space-y-3”>
          <h2 className=”text-base font-semibold text-neutral-900”>5. Data retention</h2>
          <p className=”text-sm text-neutral-700 leading-7”>We keep different categories of data for different periods:</p>
          <ul className=”space-y-2 text-sm text-neutral-700 leading-7 list-disc list-inside”>
            <li><strong>Account and profile data</strong> &mdash; for the duration of your account. Deleted immediately on account closure.</li>
            <li><strong>Travel logs, Trip Boards, and saved items</strong> &mdash; for the duration of your account. Deleted immediately with your account.</li>
            <li><strong>Purchase records</strong> &mdash; retained for 7 years from the date of purchase as required by Indian tax and commercial law. On account deletion, all personal identifiers (email address, customer ID) are permanently removed from these records. The anonymised transaction record (amount, date, product) is retained solely for legal compliance and cannot be linked back to you.</li>
            <li><strong>System and access logs</strong> &mdash; up to 12 months, for security and debugging purposes.</li>
          </ul>
        </section>

        <section className=”space-y-3”>
          <h2 className=”text-base font-semibold text-neutral-900”>6. Account deletion</h2>
          <p className=”text-sm text-neutral-700 leading-7”>
            You can delete your account at any time from your{“ “}
            <a href=”/profile” className=”underline underline-offset-2 hover:text-neutral-900 transition-colors”>Profile page</a>.
            Deletion is immediate and permanent. The following data is deleted:
          </p>
          <ul className=”space-y-2 text-sm text-neutral-700 leading-7 list-disc list-inside”>
            <li>Your account and sign-in credentials</li>
            <li>Your traveller archetype and quiz responses</li>
            <li>Your Trip Boards and all saved experiences</li>
            <li>Your travel log, ratings, and mood tags</li>
            <li>Your Pro subscription record</li>
          </ul>
          <p className=”text-sm text-neutral-700 leading-7”>
            Purchase transaction records (amount paid, date, product purchased) are anonymised rather than deleted, as we are legally required to retain financial records for 7 years. All personal identifiers are permanently stripped from these records &mdash; they cannot be linked back to you. This is compliant with GDPR right to erasure under Article 17(3)(b), which permits retention of anonymised records where there is a legal obligation to do so.
          </p>
        </section>

        <section className=”space-y-3”>
          <h2 className=”text-base font-semibold text-neutral-900”>7. Your rights</h2>
          <p className=”text-sm text-neutral-700 leading-7”>
            Under the DPDPA and, where applicable, UK GDPR and EU GDPR, you have the following rights:
          </p>
          <ul className=”space-y-2 text-sm text-neutral-700 leading-7 list-disc list-inside”>
            <li><strong>Access</strong> &mdash; request a copy of the personal data we hold about you.</li>
            <li><strong>Correction</strong> &mdash; ask us to correct inaccurate or incomplete data.</li>
            <li><strong>Erasure</strong> &mdash; ask us to delete your data where there is no compelling reason to continue processing it. See section 6 (Account deletion) for how we handle this, including the financial records exemption.</li>
            <li><strong>Restrict processing</strong> &mdash; ask us to pause processing your data while a dispute is resolved.</li>
            <li><strong>Data portability</strong> &mdash; receive your data in a structured, machine-readable format and transfer it to another service.</li>
            <li><strong>Object</strong> &mdash; object to processing based on legitimate interests. We will stop unless we can demonstrate compelling legitimate grounds.</li>
            <li><strong>Withdraw consent</strong> &mdash; where processing is based on consent (e.g. analytics cookies), withdraw it at any time without affecting prior processing.</li>
          </ul>
          <p className=”text-sm text-neutral-700 leading-7”>
            To exercise any of these rights, email{“ “}
            <a href=”mailto:hello@experiences-curated.com” className=”underline underline-offset-2 hover:text-neutral-900 transition-colors”>
              hello@experiences-curated.com
            </a>
            . We will respond within 30 days.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-neutral-900">8. Supervisory authority</h2>
          <p className="text-sm text-neutral-700 leading-7">
            Complaints about our data practices may be directed to the Data Protection Board of India once operational under the DPDPA. If you are in the UK, you may also contact the{" "}
            <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-neutral-900 transition-colors">
              Information Commissioner&apos;s Office (ICO)
            </a>
            ; if you are in the EU, you may contact your local data protection authority. We would appreciate the chance to address your concerns first &mdash; please email us before escalating.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-neutral-900">9. Cookies</h2>
          <p className="text-sm text-neutral-700 leading-7">We use two categories of cookies:</p>
          <ul className="space-y-2 text-sm text-neutral-700 leading-7 list-disc list-inside">
            <li><strong>Strictly necessary</strong> &mdash; session authentication (Supabase) and free-view count tracking (<code className="text-xs bg-neutral-100 px-1 py-0.5 rounded">ec_views</code>). These cannot be declined as the service will not function without them.</li>
            <li><strong>Optional analytics</strong> &mdash; Algolia search analytics, which help us understand which searches return poor results. These are only set with your consent.</li>
          </ul>
          <p className="text-sm text-neutral-700 leading-7">
            You can withdraw consent at any time via the cookie banner or by emailing us. Declining optional cookies has no effect on your access to the service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-neutral-900">10. Automated decision-making and profiling</h2>
          <p className="text-sm text-neutral-700 leading-7">
            We use your quiz responses and usage patterns to personalise the content and search results you see (your &ldquo;traveller archetype&rdquo;). This constitutes profiling under the DPDPA and GDPR, but it does not produce legal or similarly significant effects &mdash; it only affects the order in which curated content is shown to you. You can retake or reset your archetype at any time from your profile page.
          </p>
          <p className="text-sm text-neutral-700 leading-7">
            No solely-automated decisions with legal or significant effects are made about you.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-neutral-900">11. Changes to this policy</h2>
          <p className="text-sm text-neutral-700 leading-7">
            If we make material changes, we will update the date at the top of this page and, where appropriate, notify you by email.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-neutral-900">12. Contact</h2>
          <p className="text-sm text-neutral-700 leading-7">
            Questions or requests? Email{" "}
            <a href="mailto:hello@experiences-curated.com" className="underline underline-offset-2 hover:text-neutral-900 transition-colors">
              hello@experiences-curated.com
            </a>
            . We aim to respond within 5 business days for general queries, and within 30 days for formal data rights requests.
          </p>
        </section>
      </div>

    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAuthUser } from "@/lib/supabase/server";
import HomepageNav from "@/app/_components/HomepageNav";
import ArticleActionSidebar from "../_components/ArticleActionSidebar";
import { getBlogArticleBySlug, getSeriesSiblings, getRelatedByCategory } from "@/lib/queries/blog";

function formatPublishedDate(date: Date | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// Per-slug crop override for hero images whose subject sits off-center in a
// 16:9 crop — same pattern as the hub-and-spoke pack's per-event object-position
// override (HubPage.tsx). Tall portrait-orientation source photos in particular
// tend to crop into the torso rather than the face under plain object-cover.
const HERO_CROP_BY_SLUG: Record<string, string> = {
  "federer-vs-djokovic-never-a-quiet-match": "object-top",
  "connors-vs-lendl-won-first-8-lost-next-17": "object-[center_25%]",
  "connors-vs-mcenroe-most-contentious-rivalry": "object-[center_25%]",
  "hingis-vs-serena-williams-changing-of-the-guard": "object-top",
  "agassi-vs-sampras-best-returner-best-server": "object-top",
  "evert-vs-navratilova-80-matches-and-a-friendship": "object-top",
  "becker-vs-edberg-three-straight-wimbledon-finals": "object-[center_15%]",
};

const CATEGORY_LABELS: Record<string, string> = {
  history: "History",
  rivalry: "Rivalry",
  why_go: "Why Go",
  bucket_list: "Bucket List",
  travel_craft: "Travel Craft",
};

const SPORT_LABELS: Record<string, string> = {
  tennis: "Tennis",
  cricket: "Cricket",
  golf: "Golf",
  formula_one: "Formula 1",
};

// Recognizes "## Heading" lines within bodyContent as real <h2> elements —
// added 8 Aug 2026 so articles carry genuine heading structure (SEO signal
// + skimmability) instead of rendering as one flat run of paragraphs. No
// schema change: bodyContent stays plain text, this is a render-time parse.
// experience-researcher's Content Calendar / blog-article-researcher skill
// output should use this "## " convention for real subheadings going
// forward.
function renderBody(bodyContent: string) {
  return bodyContent.split("\n\n").map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="text-lg font-black text-white mt-8 mb-3">
          {block.slice(3)}
        </h2>
      );
    }
    return (
      <p key={i} className="mb-5">
        {block}
      </p>
    );
  });
}

function buildJsonLd(article: {
  title: string;
  excerpt: string;
  slug: string;
  heroImageUrl: string | null;
  publishedAt: Date | null;
}) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://experiences-curated.com";
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    url: `${base}/blog/${article.slug}`,
    ...(article.heroImageUrl ? { image: article.heroImageUrl } : {}),
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    author: { "@type": "Organization", name: "Experiences | Curated" },
    publisher: { "@type": "Organization", name: "Experiences | Curated" },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlogArticleBySlug(slug);
  return {
    title: `${article.title} — Experiences | Curated`,
    description: article.excerpt,
    alternates: { canonical: `/blog/${article.slug}` },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getBlogArticleBySlug(slug);
  const { user } = await getAuthUser();

  // Live-pack determination mirrors the same three-state logic used on the
  // Sports Calendar page — reachability, not purchase status. A pack is a
  // real, visible next step only when packStatus allows the page to load
  // AND isHidden is false (see CLAUDE.md's documented packFormat/packStatus
  // gating rule).
  const hasLivePack =
    !!article.eventSlug &&
    (article.eventPackStatus === "live" || article.eventPackStatus === "built_hidden") &&
    article.eventIsHidden === false;

  const siblings = article.seriesSlug
    ? await getSeriesSiblings(article.seriesSlug, article.slug)
    : await getRelatedByCategory(article.contentCategory, article.slug, article.sport);

  const relatedLabel = article.seriesSlug
    ? "More in this series"
    : `More "${CATEGORY_LABELS[article.contentCategory]}" pieces`;

  const categoryLabel = CATEGORY_LABELS[article.contentCategory] ?? article.contentCategory;
  const sportLabel = article.sport.map((s) => SPORT_LABELS[s] ?? s).join(" & ");
  const publishedDate = formatPublishedDate(article.publishedAt);
  const jsonLd = buildJsonLd(article);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomepageNav email={user?.email ?? null} />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12 flex-1 w-full">
        <div className="flex items-center gap-2 text-xs mb-7">
          <Link href="/blog" className="text-[#6A6A6A] hover:text-[#AAFF00] transition-colors">
            ← All articles
          </Link>
          <span className="text-[#2A2A2A]">/</span>
          <Link href={`/blog?category=${article.contentCategory}`} className="text-[#6A6A6A] hover:text-[#AAFF00] transition-colors">
            {categoryLabel}
          </Link>
          <span className="text-[#2A2A2A]">/</span>
          <span className="text-[#A3A3A3]">{article.title}</span>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-14 items-start">
          <article>
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3.5">
              {categoryLabel}
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3.5 text-balance">
              {article.title}
            </h1>
            <p className="text-xs text-[#6A6A6A] mb-6">
              <span className="font-black uppercase tracking-widest text-[#AAFF00]">{sportLabel}</span>
              {article.readMinutes && (
                <>
                  <span className="mx-1.5 opacity-50">·</span>
                  {article.readMinutes} min read
                </>
              )}
              {publishedDate && (
                <>
                  <span className="mx-1.5 opacity-50">·</span>
                  {publishedDate}
                </>
              )}
            </p>

            {article.heroImageUrl && (
              <div className="relative w-full aspect-[16/9] mb-8 rounded-sm overflow-hidden border border-[#2A2A2A]">
                <Image
                  src={article.heroImageUrl}
                  alt={article.heroImageAlt ?? article.title}
                  fill
                  className={`object-cover ${HERO_CROP_BY_SLUG[article.slug] ?? ""}`}
                  priority
                />
              </div>
            )}
            {article.heroImageCredit && (
              <p className="text-xs text-[#3A3A3A] -mt-6 mb-8">{article.heroImageCredit}</p>
            )}

            <div className="prose-blog text-sm text-[#A3A3A3] leading-7">
              {renderBody(article.bodyContent)}
            </div>
          </article>

          <div className="lg:sticky lg:top-8">
            <ArticleActionSidebar
              eventSlug={article.eventSlug}
              eventName={article.eventName}
              hasLivePack={hasLivePack}
              seriesSlug={article.seriesSlug}
              siblings={siblings}
              currentSlug={article.slug}
              relatedLabel={relatedLabel}
              categoryHref={`/blog?category=${article.contentCategory}`}
              categoryLabel={categoryLabel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

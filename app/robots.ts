import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.experiences-curated.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/curator/",
          "/trip-board/",
          "/profile/",
          "/my-travels/",
          "/search",
          "/sign-in",
          "/event-pack-preview/",
          "/event-pack/*/checkout",
          "/event-pack/*/welcome",
          "/pack-feedback/thanks",
          "/newsletter/unsubscribe/",
          "/planner/debug-tradeoff",
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://experiences-curated.com";

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
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}

import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev-only. Next.js 15.6+ blocks cross-origin dev requests by default (a
  // security fix) — accessing the dev server via LAN IP from a phone (e.g.
  // 192.168.1.2:3000) counts as cross-origin from the dev server's own
  // perspective, silently failing hydration: the page renders from SSR (so
  // scrolling/static content look fine) but React never attaches, so
  // EVERY click/tap handler site-wide does nothing. No effect on production
  // builds. Diagnosed 26 Jul 2026 after ruling out the Planner's own code —
  // this reproduced on unrelated pages (sign-in, curator/ranker) too, only
  // when accessed via LAN IP in dev, never on localhost or in production.
  allowedDevOrigins: ["192.168.1.2"],
  // PostHog reverse proxy — replaces the old hand-written app/ingest/[...path]/route.ts,
  // which hardcoded Content-Type: application/json on every forwarded request (breaking
  // gzip/binary session-recording payloads) and never routed static/config assets to
  // PostHog's separate assets domain. This is PostHog's own documented approach:
  // https://posthog.com/docs/advanced/proxy/nextjs — EU region since the project is on
  // eu.i.posthog.com. Order matters: the two /static and /array rules must come before
  // the catch-all /ingest/:path* rule.
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://eu-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
    ];
  },
  skipTrailingSlashRedirect: true,
  // Evergreen-slug migration (Operations Checklist T2 #2). Permanent 301s
  // from a dated event-pack slug to its evergreen replacement — added for
  // Wimbledon's classic->hub-and-spoke conversion (14 Aug 2026), the first
  // event to migrate off a dated slug. Add one entry here per event as it
  // migrates; this table only needs to exist once, future migrations just
  // add rows.
  async redirects() {
    return [
      {
        source: "/event-pack/wimbledon-2026",
        destination: "/event-pack/wimbledon",
        permanent: true,
      },
      {
        source: "/event-pack/wimbledon-2026/:spoke",
        destination: "/event-pack/wimbledon/:spoke",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/search",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "experiences-curated",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});

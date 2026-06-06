import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteFooter from "./_components/SiteFooter";
import CookieBanner from "./_components/CookieBanner";
import { PostHogProvider } from "./_components/PostHogProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Experiences | Curated",
    template: "%s — Experiences | Curated",
  },
  description:
    "Handpicked travel experiences matched to your taste. Discover the world's best destinations, curated by experts who've actually been there.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
          <PostHogProvider>
            {children}
            <SiteFooter />
            <CookieBanner />
          </PostHogProvider>
        </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import AOSInit from "./components/aos-init";
import { siteUrl, siteName, siteTitle, siteDescription } from "./lib/seo";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | MovingPace",
  },
  description: siteDescription,
  keywords: [
    "moving company",
    "movers",
    "verhuisbedrijf",
    "Almere",
    "Amsterdam",
    "Lelystad",
    "relocation",
    "furniture moving",
    "Netherlands",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName,
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    locale: "en_NL",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} antialiased`}>
        <AOSInit />
        {children}
      </body>
    </html>
  );
}

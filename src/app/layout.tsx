import type { Metadata } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Mono, IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import { MobileActions } from "@/components/MobileActions";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { UtilityBar } from "@/components/UtilityBar";
import { company } from "@/lib/site";
import "./globals.css";

const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const serif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: {
    default: "Northcoast Orthopedic Sales | Orthopedic DME & billing",
    template: "%s | Northcoast Orthopedic Sales",
  },
  description: company.description,
  openGraph: {
    title: "Northcoast Orthopedic Sales",
    description: company.tagline,
    url: company.url,
    siteName: company.tradeName,
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plex.variable} ${serif.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper text-ink">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <UtilityBar />
        <SiteHeader />
        <main id="main" className="pb-20 md:pb-0">
          {children}
        </main>
        <SiteFooter />
        <MobileActions />
      </body>
    </html>
  );
}

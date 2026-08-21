import type { Metadata } from "next";
import "./globals.css";

const title = "Akimasa Watanuki — High-Performance Computing and Compilers";
const description = "Portfolio of Akimasa Watanuki, a researcher working on high-performance computing and compiler infrastructure.";
const siteUrl = "https://akimasa-watanuki.mencotton.chatgpt.site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    type: "website",
    locale: "en_US",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

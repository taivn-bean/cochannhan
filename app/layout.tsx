import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { fontMap } from "./fontMap";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "Cổ Chân Nhân",
  description: "Đọc sách trực tuyến với trải nghiệm tuyệt vời",
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  generator: "Taivn",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontVars = Object.values(fontMap)
    .map((f) => f.variable)
    .join(" ");
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Cổ Chân Nhân" />
      </head>
      <body className={fontVars} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"

          enableSystem
          disableTransitionOnChange
        >
          <Header />

          {children}
          <ScrollToTop />
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="GTM-K7W9DBDX" />
    </html>
  );
}

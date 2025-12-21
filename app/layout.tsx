import type React from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { fontMap } from "./fontMap";
import { GoogleAnalytics } from "@next/third-parties/google";
import { QueryProvider } from "@/components/providers/query.provider";
import { AuthProvider } from "@/components/providers/auth.provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Cổ Chân Nhân",
  description: "Cổ Chân Nhân",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: [
    "cổ chân nhân",
    "đọc truyện",
    "truyện cổ chân nhân",
    "cổ chân nhân",
  ],
  authors: [{ name: "Your Name" }],
  icons: [
    { rel: "apple-touch-icon", url: "/favicon/apple-touch-icon.png" },
    { rel: "icon", url: "/favicon/icon-192x192.png" },
  ],
};

export const viewport: Viewport = {
  themeColor: "#000000",
  minimumScale: 1,
  initialScale: 1,
  width: "device-width",
  viewportFit: "cover",
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
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Cổ Chân Nhân" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Cổ Chân Nhân" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={fontVars} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <Header />
              {children}
              <ScrollToTop />
              <Toaster />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-10WDPX8V4W" />
    </html>
  );
}

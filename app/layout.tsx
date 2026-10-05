import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CampusBackground } from "@/components/CampusBackground";
import { ToastProvider } from "@/lib/toast-context";
import { ToastViewport } from "@/components/ui/Toast";

import LiquidCursor from "@/components/CursorSpotlight";

export const metadata: Metadata = {
  metadataBase: new URL("https://rbu-campus-os.vercel.app"),
  title: {
    default: "RBU CampusOS",
    template: "%s · RBU CampusOS",
  },
  description:
    "A social operating system for campus life, student community discovery, academics, peer exchange, and facilities.",
  icons: { icon: "/icon.svg" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "RBU CampusOS",
    title: "RBU CampusOS",
    description:
      "A social operating system for campus life, student community discovery, academics, peer exchange, and facilities.",
    images: [],
  },
  twitter: {
    card: "summary_large_image",
    title: "RBU CampusOS",
    description:
      "A social operating system for campus life, student community discovery, academics, peer exchange, and facilities.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfa" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1216" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col relative" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CampusBackground />
          <LiquidCursor />
          <ToastProvider>
            {children}
            <ToastViewport />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

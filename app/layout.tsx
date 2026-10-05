import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CampusBackground } from "@/components/CampusBackground";
import { ToastProvider } from "@/lib/toast-context";
import { ToastViewport } from "@/components/ui/Toast";

import LiquidCursor from "@/components/CursorSpotlight";

export const metadata: Metadata = {
  title: "RBU CampusOS",
  description: "A social operating system for campus life, student community discovery, academics, peer exchange, and facilities.",
  openGraph: {
    title: "RBU CampusOS",
    description: "A social operating system for campus life, student community discovery, academics, peer exchange, and facilities.",
  },
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

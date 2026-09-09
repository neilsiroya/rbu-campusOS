import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import LiquidCursor from "@/components/CursorSpotlight";

export const metadata: Metadata = {
  title: "RBU CampusOS",
  description: "One campus. One identity. Every experience.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col relative">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="aurora-bg" />
          <LiquidCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

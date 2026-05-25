import type { Metadata, Viewport } from "next";
import { Inter, DM_Serif_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Codeparkdevs — Crafted code. Thoughtful tech.",
    template: "%s | Codeparkdevs",
  },
  description: "AI • Dev Tools • Automation. We build robust, scalable solutions that bridge the gap between art and technology.",
};

export const viewport: Viewport = {
  themeColor: "#111009",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${dmSerifDisplay.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="h-full bg-[#111009] text-[#F2EDE6] antialiased">
        <Providers>
          {children}
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: "#1A1712",
                border: "1px solid #2C271F",
                color: "#F2EDE6",
                fontFamily: "var(--font-inter)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}

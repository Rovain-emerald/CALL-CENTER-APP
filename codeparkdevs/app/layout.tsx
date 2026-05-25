import type { Metadata } from "next";
import { Inter, DM_Serif_Display, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const dmSerifDisplay = DM_Serif_Display({ variable: "--font-dm-serif", subsets: ["latin"], weight: ["400"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Codeparkdevs — Crafted code. Thoughtful tech.", template: "%s | Codeparkdevs" },
  description: "AI-powered creative platform for social media automation, content creation, and intelligent agents.",
  keywords: ["AI", "social media automation", "content creation", "AI agents", "image generation"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Codeparkdevs",
    title: "Codeparkdevs — Crafted code. Thoughtful tech.",
    description: "AI-powered creative platform for social media automation, content creation, and intelligent agents.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full dark">
        <body className={`${inter.variable} ${dmSerifDisplay.variable} ${jetbrainsMono.variable} h-full bg-[#111009] text-[#F2EDE6] antialiased`}>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#1A1712",
                border: "1px solid #2C271F",
                color: "#F2EDE6",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}

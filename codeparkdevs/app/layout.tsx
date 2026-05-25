import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "@/components/providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "CodeParkDevs — Build anything. Create everything. Automate the rest.",
    template: "%s | CodeParkDevs",
  },
  description: "The world's first truly unified AI creative and business platform.",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full`} suppressHydrationWarning>
      <body className="h-full bg-[#0A0A0A] text-white antialiased">
        <Providers>
          {children}
          <Toaster
            theme="dark"
            toastOptions={{
              style: { background: "#1A1A1A", border: "1px solid #2A2A2A", color: "#fff" },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}

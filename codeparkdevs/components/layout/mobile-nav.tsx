"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Sparkles, Bot, Library, Plus } from "lucide-react";

const TABS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/create", icon: Sparkles, label: "Create" },
  null, // FAB placeholder
  { href: "/agents", icon: Bot, label: "Agents" },
  { href: "/library", icon: Library, label: "Library" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-[#0D0D0D] border-t border-[#1E1E1E] flex items-center justify-around px-2">
      {TABS.map((tab, i) => {
        if (!tab) {
          // FAB — center glowing Create button
          return (
            <Link
              key="fab"
              href="/create"
              className={cn(
                "relative -top-4 w-14 h-14 rounded-full bg-[#00FF87] flex items-center justify-center",
                "shadow-[0_0_24px_rgba(0,255,135,0.5)]",
                // Emil: animate-pulse for pulse-green effect, but not on hover (reduce motion)
                "transition-[transform,box-shadow] duration-150 active:scale-[0.95]",
                "@media (hover: hover) { hover:shadow-[0_0_32px_rgba(0,255,135,0.7)] }"
              )}
              aria-label="Create"
            >
              <Plus className="w-6 h-6 text-black" strokeWidth={2.5} />
            </Link>
          );
        }

        const { href, icon: Icon, label } = tab;
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1",
              "transition-[color] duration-150",
              active ? "text-[#00FF87]" : "text-[#555]"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

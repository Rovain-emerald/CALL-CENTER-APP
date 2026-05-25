"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Sparkles, Bot, Library, Plus } from "lucide-react";

const TABS = [
  { href: "/",        icon: Home,     label: "Home" },
  { href: "/create",  icon: Sparkles, label: "Create" },
  null, // FAB
  { href: "/agents",  icon: Bot,      label: "Agents" },
  { href: "/library", icon: Library,  label: "Library" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 h-16 bg-[#0E0C08] border-t border-[#2C271F] flex items-center justify-around px-2">
      {TABS.map((tab, i) => {
        if (!tab) {
          return (
            <Link
              key="fab"
              href="/create"
              className={cn(
                "relative -top-4 w-12 h-12 rounded-full",
                "bg-[#C8A882] flex items-center justify-center",
                "shadow-[0_0_24px_rgba(200,168,130,0.4)]",
                "transition-[transform,box-shadow] duration-150 active:scale-[0.95]"
              )}
              aria-label="Create"
            >
              <Plus className="w-5 h-5 text-[#111009]" strokeWidth={2.5} />
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
              active ? "text-[#C8A882]" : "text-[#6B5E50]"
            )}
          >
            <Icon style={{ width: 18, height: 18 }} />
            <span className="text-[10px] font-medium tracking-wide">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

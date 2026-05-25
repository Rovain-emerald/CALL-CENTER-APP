"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, MessageSquare, Sparkles, Bot, BookOpen } from "lucide-react";

const TABS = [
  { href: "/",        icon: Home,          label: "Home" },
  { href: "/chat",    icon: MessageSquare, label: "Chat" },
  { href: "/create",  icon: Sparkles,      label: "Create" },
  { href: "/agents",  icon: Bot,           label: "Agents" },
  { href: "/library", icon: BookOpen,      label: "Library" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 h-16 bg-[#0E0C08] border-t border-[#2C271F] flex items-center justify-around px-2">
      {TABS.map(({ href, icon: Icon, label }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1 rounded-[8px]",
              "transition-colors duration-150",
              active ? "text-[#C8A882]" : "text-[#6B5E50] hover:text-[#A89880]"
            )}
          >
            <Icon style={{ width: 18, height: 18 }} />
            <span
              className={cn(
                "text-[10px] font-medium tracking-wide",
                active ? "text-[#C8A882]" : "text-[#6B5E50]"
              )}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

// Keep default export for backward compatibility
export default MobileNav;

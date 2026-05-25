"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  MessageSquare,
  Sparkles,
  Palette,
  Smartphone,
  Code2,
  Bot,
  Library,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/chat", icon: MessageSquare, label: "Chat" },
  { href: "/create", icon: Sparkles, label: "Create" },
  { href: "/studio", icon: Palette, label: "Studio" },
  { href: "/content", icon: Smartphone, label: "Content" },
  { href: "/code", icon: Code2, label: "Code" },
  { href: "/agents", icon: Bot, label: "Agents" },
];

const BOTTOM_NAV = [
  { href: "/library", icon: Library, label: "Library" },
  { href: "/community", icon: Users, label: "Community" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-full bg-[#0D0D0D] border-r border-[#1E1E1E]",
        "transition-[width] duration-200",
        // Emil: ease-out for entering, specify property not `all`
        collapsed ? "w-[64px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center h-16 px-4 border-b border-[#1E1E1E] shrink-0",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-[#00FF87] flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-sm text-white tracking-tight">CodeParkDevs</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded-lg bg-[#00FF87] flex items-center justify-center">
            <Zap className="w-4 h-4 text-black" />
          </div>
        )}
        <button
          onClick={onToggle}
          className={cn(
            "w-6 h-6 rounded-md flex items-center justify-center",
            "text-[#555] hover:text-white hover:bg-[#1A1A1A]",
            "transition-[background-color,color] duration-150",
            collapsed && "hidden"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 h-9 rounded-xl text-sm",
              "transition-[background-color,color] duration-150",
              isActive(href)
                ? "bg-[#1A1A1A] text-white font-medium"
                : "text-[#888] hover:text-white hover:bg-[#161616]",
              collapsed && "justify-center px-0"
            )}
            title={collapsed ? label : undefined}
          >
            <Icon
              className={cn(
                "shrink-0 transition-colors duration-150",
                isActive(href) ? "text-[#00FF87]" : "text-current",
                collapsed ? "w-5 h-5" : "w-4 h-4"
              )}
            />
            {!collapsed && <span>{label}</span>}
            {/* Active dot when collapsed */}
            {collapsed && isActive(href) && (
              <span className="absolute right-1 w-1 h-1 rounded-full bg-[#00FF87]" />
            )}
          </Link>
        ))}

        <div className="my-2 border-t border-[#1E1E1E]" />

        {BOTTOM_NAV.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 h-9 rounded-xl text-sm",
              "transition-[background-color,color] duration-150",
              isActive(href)
                ? "bg-[#1A1A1A] text-white font-medium"
                : "text-[#888] hover:text-white hover:bg-[#161616]",
              collapsed && "justify-center px-0"
            )}
            title={collapsed ? label : undefined}
          >
            <Icon
              className={cn(
                "shrink-0",
                isActive(href) ? "text-[#00FF87]" : "text-current",
                collapsed ? "w-5 h-5" : "w-4 h-4"
              )}
            />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className={cn("border-t border-[#1E1E1E] p-3 space-y-2", collapsed && "flex flex-col items-center")}>
        {!collapsed && (
          <>
            {/* Credits bar */}
            <div className="px-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-[#666]">Credits</span>
                <span className="text-xs text-[#AAAAAA] font-medium">240 / 500</span>
              </div>
              <div className="h-1.5 bg-[#1E1E1E] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00FF87] rounded-full transition-[width] duration-500"
                  style={{ width: "48%" }}
                />
              </div>
            </div>
            <Link
              href="/settings/billing"
              className={cn(
                "flex items-center justify-center w-full h-8 rounded-xl text-xs font-medium",
                "border border-[#00FF87]/30 text-[#00FF87]",
                "hover:bg-[#00FF87]/10 transition-[background-color] duration-150",
                "active:scale-[0.97]"
              )}
            >
              Upgrade Plan
            </Link>
          </>
        )}
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 h-9 rounded-xl text-sm text-[#888] hover:text-white hover:bg-[#161616]",
            "transition-[background-color,color] duration-150",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings className={cn("shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")} />
          {!collapsed && <span>Settings</span>}
        </Link>
        {/* Expand button when collapsed */}
        {collapsed && (
          <button
            onClick={onToggle}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#555] hover:text-white hover:bg-[#1A1A1A] transition-[background-color,color] duration-150"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}

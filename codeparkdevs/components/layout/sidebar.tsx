"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home, MessageSquare, Sparkles, Palette, Smartphone,
  Code2, Bot, Library, Users, Settings, ChevronLeft, ChevronRight,
} from "lucide-react";

const NAV_PRIMARY = [
  { href: "/",        icon: Home,         label: "Home" },
  { href: "/chat",    icon: MessageSquare, label: "Chat" },
  { href: "/create",  icon: Sparkles,     label: "Create" },
  { href: "/studio",  icon: Palette,      label: "Studio" },
  { href: "/content", icon: Smartphone,   label: "Content" },
  { href: "/code",    icon: Code2,        label: "Code" },
  { href: "/agents",  icon: Bot,          label: "Agents" },
];

const NAV_SECONDARY = [
  { href: "/library",   icon: Library, label: "Library" },
  { href: "/community", icon: Users,   label: "Community" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-full border-r border-[#2C271F] bg-[#0E0C08]",
        "transition-[width] duration-200",
        collapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      {/* ── Logo ─────────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex items-center h-[60px] px-4 border-b border-[#2C271F] shrink-0",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        {!collapsed && (
          <Link href="/" className="flex items-center gap-0 group">
            {/* CPD} monogram mark */}
            <span
              className="font-serif text-[15px] font-normal tracking-tight text-[#F2EDE6] leading-none"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              CPD
            </span>
            <span
              className="text-[15px] font-mono text-[#C8A882] leading-none"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              {"}"}
            </span>
          </Link>
        )}

        {collapsed && (
          <div className="flex items-center">
            <span className="font-serif text-[13px] text-[#F2EDE6]" style={{ fontFamily: "var(--font-dm-serif)" }}>C</span>
            <span className="font-mono text-[13px] text-[#C8A882]" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{"}"}</span>
          </div>
        )}

        {!collapsed && (
          <button
            onClick={onToggle}
            className="w-6 h-6 rounded-md flex items-center justify-center text-[#6B5E50] hover:text-[#C8A882] hover:bg-[#1A1712] transition-[background-color,color] duration-150"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ── Nav ──────────────────────────────────────────────────── */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV_PRIMARY.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-2.5 px-2.5 h-9 rounded-[8px] text-[13px]",
                "transition-[background-color,color] duration-150 active:scale-[0.98]",
                active
                  ? "bg-[#221E18] text-[#F2EDE6] font-medium"
                  : "text-[#6B5E50] hover:text-[#A89880] hover:bg-[#16130E]",
                collapsed && "justify-center px-0"
              )}
            >
              <Icon
                className={cn(
                  "shrink-0 transition-colors duration-150",
                  active ? "text-[#C8A882]" : "text-current",
                  collapsed ? "w-4.5 h-4.5" : "w-4 h-4"
                )}
                style={collapsed ? { width: 18, height: 18 } : { width: 15, height: 15 }}
              />
              {!collapsed && <span>{label}</span>}
              {/* Active indicator — left border alternative */}
              {active && !collapsed && (
                <span className="ml-auto w-1 h-1 rounded-full bg-[#C8A882]" />
              )}
            </Link>
          );
        })}

        <div className="my-2.5 border-t border-[#2C271F]" />

        {NAV_SECONDARY.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-2.5 px-2.5 h-9 rounded-[8px] text-[13px]",
                "transition-[background-color,color] duration-150 active:scale-[0.98]",
                active
                  ? "bg-[#221E18] text-[#F2EDE6] font-medium"
                  : "text-[#6B5E50] hover:text-[#A89880] hover:bg-[#16130E]",
                collapsed && "justify-center px-0"
              )}
            >
              <Icon
                className={cn(active ? "text-[#C8A882]" : "text-current", "shrink-0")}
                style={collapsed ? { width: 18, height: 18 } : { width: 15, height: 15 }}
              />
              {!collapsed && <span>{label}</span>}
              {active && !collapsed && (
                <span className="ml-auto w-1 h-1 rounded-full bg-[#C8A882]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <div className={cn("border-t border-[#2C271F] p-3 space-y-2", collapsed && "flex flex-col items-center gap-2")}>
        {!collapsed && (
          <>
            {/* Credits */}
            <div className="px-0.5 mb-1">
              <div className="flex justify-between mb-1.5">
                <span className="font-mono text-[10px] text-[#6B5E50] tracking-wide">CREDITS</span>
                <span className="font-mono text-[10px] text-[#A89880]">240 / 500</span>
              </div>
              <div className="h-1 bg-[#2C271F] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#C8A882] transition-[width] duration-500"
                  style={{ width: "48%" }}
                />
              </div>
            </div>
            <Link
              href="/settings/billing"
              className="flex items-center justify-center w-full h-8 rounded-[8px] text-[12px] font-medium border border-[#C8A882]/25 text-[#C8A882] hover:bg-[#C8A882]/8 transition-[background-color] duration-150 active:scale-[0.98]"
            >
              Upgrade Plan
            </Link>
          </>
        )}

        <Link
          href="/settings"
          title={collapsed ? "Settings" : undefined}
          className={cn(
            "flex items-center gap-2.5 px-2.5 h-9 rounded-[8px] text-[13px] text-[#6B5E50]",
            "hover:text-[#A89880] hover:bg-[#16130E] transition-[background-color,color] duration-150",
            collapsed && "justify-center px-0"
          )}
        >
          <Settings style={{ width: 15, height: 15 }} className="shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>

        {collapsed && (
          <button
            onClick={onToggle}
            className="w-9 h-9 rounded-[8px] flex items-center justify-center text-[#6B5E50] hover:text-[#A89880] hover:bg-[#16130E] transition-[background-color,color] duration-150"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}

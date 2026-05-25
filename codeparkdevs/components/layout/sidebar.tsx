"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Home,
  MessageSquare,
  Sparkles,
  Palette,
  FileText,
  Bot,
  BookOpen,
  Users,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const NAV_PRIMARY = [
  { href: "/",         icon: Home,          label: "Home" },
  { href: "/chat",     icon: MessageSquare, label: "Chat" },
  { href: "/create",   icon: Sparkles,      label: "Create" },
  { href: "/studio",   icon: Palette,       label: "Studio" },
  { href: "/content",  icon: FileText,      label: "Content" },
  { href: "/agents",   icon: Bot,           label: "Agents" },
];

const NAV_SECONDARY = [
  { href: "/library",   icon: BookOpen, label: "Library" },
  { href: "/community", icon: Users,    label: "Community" },
];

type Plan = "FREE" | "STARTER" | "PRO" | "AGENCY";

const PLAN_STYLES: Record<Plan, { bg: string; text: string }> = {
  FREE:    { bg: "bg-[#1A1712] border border-[#2C271F]", text: "text-[#6B5E50]" },
  STARTER: { bg: "bg-[#1A1712] border border-[#8A9E8C]/30", text: "text-[#8A9E8C]" },
  PRO:     { bg: "bg-[#1A1712] border border-[#C8A882]/30", text: "text-[#C8A882]" },
  AGENCY:  { bg: "bg-[#1A1712] border border-[#B5704F]/30", text: "text-[#B5704F]" },
};

interface SidebarProps {
  /** Plan badge to display. Defaults to FREE. */
  plan?: Plan;
  /** Credits used (for progress bar). */
  creditsUsed?: number;
  /** Total credits available. */
  creditsTotal?: number;
}

export function Sidebar({
  plan = "FREE",
  creditsUsed = 0,
  creditsTotal = 500,
}: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const usagePercent = creditsTotal > 0
    ? Math.min(100, Math.round((creditsUsed / creditsTotal) * 100))
    : 0;

  const planStyle = PLAN_STYLES[plan];

  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r border-[#2C271F] bg-[#0E0C08]",
        "transition-[width] duration-200",
        collapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      {/* ── Logo ──────────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex items-center h-[60px] px-4 border-b border-[#2C271F] shrink-0",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        {!collapsed && (
          <Link href="/" className="flex items-center gap-0 group">
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
            <span
              className="font-serif text-[13px] text-[#F2EDE6]"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              C
            </span>
            <span
              className="font-mono text-[13px] text-[#C8A882]"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              {"}"}
            </span>
          </div>
        )}

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="w-6 h-6 rounded-md flex items-center justify-center text-[#6B5E50] hover:text-[#C8A882] hover:bg-[#1A1712] transition-[background-color,color] duration-150"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ── Primary Nav ──────────────────────────────────────────── */}
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
                "transition-[background-color,color,border-color] duration-150 active:scale-[0.98]",
                active
                  ? "bg-[#221E18] text-[#F2EDE6] font-medium border-l-2 border-[#C8A882]"
                  : "text-[#6B5E50] hover:text-[#A89880] hover:bg-[#1A1712]",
                collapsed ? "justify-center px-0 border-l-0" : ""
              )}
            >
              <Icon
                className={cn(
                  "shrink-0 transition-colors duration-150",
                  active ? "text-[#C8A882]" : "text-current"
                )}
                style={collapsed ? { width: 18, height: 18 } : { width: 15, height: 15 }}
              />
              {!collapsed && <span>{label}</span>}
              {active && !collapsed && (
                <span className="ml-auto w-1 h-1 rounded-full bg-[#C8A882]" />
              )}
            </Link>
          );
        })}

        <div className="my-2.5 border-t border-[#2C271F]" />

        {/* ── Secondary Nav ──────────────────────────────────────── */}
        {NAV_SECONDARY.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-2.5 px-2.5 h-9 rounded-[8px] text-[13px]",
                "transition-[background-color,color,border-color] duration-150 active:scale-[0.98]",
                active
                  ? "bg-[#221E18] text-[#F2EDE6] font-medium border-l-2 border-[#C8A882]"
                  : "text-[#6B5E50] hover:text-[#A89880] hover:bg-[#1A1712]",
                collapsed ? "justify-center px-0 border-l-0" : ""
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

      {/* ── Footer ──────────────────────────────────────────────── */}
      <div
        className={cn(
          "border-t border-[#2C271F] p-3 space-y-2",
          collapsed && "flex flex-col items-center gap-2 space-y-0"
        )}
      >
        {!collapsed && (
          <>
            {/* Credits progress */}
            <div className="px-0.5 mb-1">
              <div className="flex justify-between mb-1.5">
                <span className="font-mono text-[10px] text-[#6B5E50] tracking-wide flex items-center gap-1">
                  <Zap style={{ width: 9, height: 9 }} />
                  CREDITS
                </span>
                <span className="font-mono text-[10px] text-[#A89880]">
                  {creditsUsed.toLocaleString()} / {creditsTotal.toLocaleString()}
                </span>
              </div>
              <div className="h-1 bg-[#2C271F] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#C8A882] transition-[width] duration-500"
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>

            {/* Plan badge */}
            <div className="flex items-center justify-between px-0.5 mb-0.5">
              <span className={cn("text-[10px] font-mono px-2 py-0.5 rounded-full", planStyle.bg, planStyle.text)}>
                {plan}
              </span>
              <Link
                href="/settings/billing"
                className="text-[10px] font-mono text-[#C8A882]/70 hover:text-[#C8A882] transition-colors duration-150"
              >
                Upgrade →
              </Link>
            </div>
          </>
        )}

        {/* Settings */}
        <Link
          href="/settings"
          title={collapsed ? "Settings" : undefined}
          className={cn(
            "flex items-center gap-2.5 px-2.5 h-9 rounded-[8px] text-[13px] text-[#6B5E50]",
            "hover:text-[#A89880] hover:bg-[#1A1712] transition-[background-color,color] duration-150",
            collapsed && "justify-center px-0"
          )}
        >
          <Settings style={{ width: 15, height: 15 }} className="shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>

        {/* Expand button when collapsed */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="w-9 h-9 rounded-[8px] flex items-center justify-center text-[#6B5E50] hover:text-[#A89880] hover:bg-[#1A1712] transition-[background-color,color] duration-150"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}

// Keep default export for backward compatibility
export default Sidebar;

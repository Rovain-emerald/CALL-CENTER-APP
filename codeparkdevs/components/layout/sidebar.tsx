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
  Globe,
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

const PLAN_META: Record<Plan, { label: string; color: string; border: string; dot: string }> = {
  FREE:    { label: "Free",    color: "text-[#4A4135]", border: "border-[#2C271F]",          dot: "bg-[#4A4135]" },
  STARTER: { label: "Starter", color: "text-[#8A9E8C]", border: "border-[#8A9E8C]/40",       dot: "bg-[#8A9E8C]" },
  PRO:     { label: "Pro",     color: "text-[#C8A882]", border: "border-[#C8A882]/40",       dot: "bg-[#C8A882]" },
  AGENCY:  { label: "Agency",  color: "text-[#B5704F]", border: "border-[#B5704F]/40",       dot: "bg-[#B5704F]" },
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

  const planMeta = PLAN_META[plan];

  return (
    <aside
      className={cn(
        "relative flex flex-col h-full",
        "border-r border-[#2C271F] bg-[#0F0D0A]",
        "transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        collapsed ? "w-[56px]" : "w-[240px]"
      )}
    >
      {/* Subtle right-edge glow */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-px"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(200,168,130,0.06) 30%, rgba(200,168,130,0.08) 50%, rgba(200,168,130,0.06) 70%, transparent 100%)",
        }}
      />

      {/* ── Logo ──────────────────────────────────────────────────── */}
      <div
        className={cn(
          "relative flex items-center h-[60px] shrink-0 border-b border-[#2C271F]",
          collapsed ? "justify-center px-0" : "px-4 justify-between"
        )}
      >
        {/* Logo glow backdrop */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "radial-gradient(ellipse 60% 80% at 20% 50%, rgba(200,168,130,0.04) 0%, transparent 70%)",
          }}
        />

        <Link href="/" className="flex items-center gap-0 group relative">
          {/* Hover glow on logo */}
          <span
            className="absolute -inset-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(200,168,130,0.06) 0%, transparent 70%)",
            }}
          />

          {collapsed ? (
            <>
              <span
                className="relative font-serif text-[13px] text-[#F2EDE6] leading-none"
                style={{ fontFamily: "var(--font-dm-serif)" }}
              >
                C
              </span>
              <span
                className="relative font-mono text-[13px] text-[#C8A882] leading-none"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                {"}"}
              </span>
            </>
          ) : (
            <>
              <span
                className="relative font-serif text-[15px] font-normal tracking-tight text-[#F2EDE6] leading-none"
                style={{ fontFamily: "var(--font-dm-serif)" }}
              >
                CPD
              </span>
              <span
                className="relative text-[15px] font-mono text-[#C8A882] leading-none"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                {"}"}
              </span>
            </>
          )}
        </Link>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="w-6 h-6 rounded-md flex items-center justify-center text-[#4A4135] hover:text-[#C8A882] hover:bg-[#1A1712] transition-all duration-200"
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
                "group relative flex items-center gap-2.5 h-9 rounded-[8px] text-[13px]",
                "transition-all duration-150 active:scale-[0.98]",
                collapsed ? "justify-center px-0" : "px-2.5",
                active
                  ? "nav-active-bar bg-[#1A1712] text-[#F2EDE6] font-medium"
                  : "text-[#6B5E50] hover:text-[#A89880] hover:bg-[#161310]"
              )}
            >
              {/* Hover left-border glow (non-active) */}
              {!active && !collapsed && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-0 group-hover:h-[60%] rounded-r bg-[#2C271F] group-hover:bg-[#C8A882]/20 transition-all duration-200"
                />
              )}

              <Icon
                className={cn(
                  "shrink-0 transition-colors duration-150",
                  active ? "text-[#C8A882]" : "text-current"
                )}
                style={collapsed ? { width: 18, height: 18 } : { width: 15, height: 15 }}
              />
              {!collapsed && <span className="truncate">{label}</span>}
              {active && !collapsed && (
                <span className="ml-auto w-1 h-1 rounded-full bg-[#C8A882] shrink-0 glow-clay-sm" />
              )}
            </Link>
          );
        })}

        {/* Divider */}
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
                "group relative flex items-center gap-2.5 h-9 rounded-[8px] text-[13px]",
                "transition-all duration-150 active:scale-[0.98]",
                collapsed ? "justify-center px-0" : "px-2.5",
                active
                  ? "nav-active-bar bg-[#1A1712] text-[#F2EDE6] font-medium"
                  : "text-[#6B5E50] hover:text-[#A89880] hover:bg-[#161310]"
              )}
            >
              {!active && !collapsed && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-0 group-hover:h-[60%] rounded-r bg-[#2C271F] group-hover:bg-[#C8A882]/20 transition-all duration-200"
                />
              )}

              <Icon
                className={cn(
                  "shrink-0 transition-colors duration-150",
                  active ? "text-[#C8A882]" : "text-current"
                )}
                style={collapsed ? { width: 18, height: 18 } : { width: 15, height: 15 }}
              />
              {!collapsed && <span className="truncate">{label}</span>}
              {active && !collapsed && (
                <span className="ml-auto w-1 h-1 rounded-full bg-[#C8A882] shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <div
        className={cn(
          "border-t border-[#2C271F] p-3",
          collapsed ? "flex flex-col items-center gap-2" : "space-y-3"
        )}
      >
        {!collapsed && (
          <>
            {/* Plan badge */}
            <div
              className={cn(
                "flex items-center justify-between px-2.5 py-1.5 rounded-[8px]",
                "bg-[#161310] border",
                planMeta.border
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn("w-1.5 h-1.5 rounded-full shrink-0", planMeta.dot)}
                  style={
                    plan === "PRO" || plan === "AGENCY"
                      ? { boxShadow: `0 0 5px currentColor` }
                      : {}
                  }
                />
                <span
                  className={cn(
                    "font-mono text-[10px] tracking-widest uppercase",
                    planMeta.color
                  )}
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {planMeta.label}
                </span>
              </div>
              {plan !== "AGENCY" && (
                <Link
                  href="/settings/billing"
                  className="font-mono text-[9px] text-[#C8A882]/50 hover:text-[#C8A882] transition-colors duration-150 tracking-wide"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  Upgrade ↑
                </Link>
              )}
            </div>

            {/* Credits progress */}
            <div className="px-0.5 space-y-1.5">
              <div className="flex justify-between items-center">
                <span
                  className="font-mono text-[10px] text-[#4A4135] tracking-widest uppercase flex items-center gap-1"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  <Zap style={{ width: 9, height: 9 }} className="text-[#C8A882]/40" />
                  Credits
                </span>
                <span
                  className="font-mono text-[10px] text-[#6B5E50]"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {creditsUsed.toLocaleString()}
                  <span className="text-[#3A3328]"> / </span>
                  {creditsTotal.toLocaleString()}
                </span>
              </div>

              {/* Progress track */}
              <div className="relative h-[3px] bg-[#1A1712] rounded-full overflow-hidden border border-[#2C271F]">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-out"
                  style={{
                    width: `${usagePercent}%`,
                    background: "linear-gradient(90deg, #A88C68 0%, #C8A882 60%, #D4B896 100%)",
                    boxShadow: usagePercent > 0 ? "0 0 8px rgba(200,168,130,0.4)" : "none",
                  }}
                />
              </div>

              <div className="flex justify-between">
                <span
                  className="font-mono text-[9px] text-[#3A3328]"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {usagePercent}% used
                </span>
                <span
                  className="font-mono text-[9px] text-[#3A3328]"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  {(creditsTotal - creditsUsed).toLocaleString()} left
                </span>
              </div>
            </div>
          </>
        )}

        {/* Settings link */}
        <Link
          href="/settings"
          title={collapsed ? "Settings" : undefined}
          className={cn(
            "group relative flex items-center gap-2.5 h-9 rounded-[8px] text-[13px]",
            "text-[#6B5E50] hover:text-[#A89880] hover:bg-[#161310]",
            "transition-all duration-150",
            collapsed ? "justify-center px-0" : "px-2.5"
          )}
        >
          <Settings
            style={{ width: 15, height: 15 }}
            className="shrink-0 transition-transform duration-300 group-hover:rotate-45"
          />
          {!collapsed && <span>Settings</span>}
        </Link>

        {/* Expand button when collapsed */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="w-9 h-9 rounded-[8px] flex items-center justify-center text-[#4A4135] hover:text-[#A89880] hover:bg-[#161310] transition-all duration-150"
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

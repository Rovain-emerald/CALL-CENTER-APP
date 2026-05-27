"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  MessageSquare, Sparkles, Music, Palette, Code2, Bot,
  Play, Zap, ChevronRight, CheckCircle2, ArrowUpRight, AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const QUICK_ACTIONS = [
  { label: "Chat",           icon: MessageSquare, href: "/chat",    accent: "#C8A882" },
  { label: "Generate Video", icon: Play,          href: "/create",  accent: "#B5704F" },
  { label: "Make Music",     icon: Music,         href: "/create",  accent: "#8A9E8C" },
  { label: "Design",         icon: Palette,       href: "/studio",  accent: "#C8A882" },
  { label: "Write Code",     icon: Code2,         href: "/code",    accent: "#8A9E8C" },
  { label: "Run Agent",      icon: Bot,           href: "/agents",  accent: "#B5704F" },
];

const MODES = ["All", "Image", "Video", "Music", "Design"];

const RECENT = [
  { id: 1, title: "Product Launch Video",   type: "VIDEO",  date: "2h ago",    colors: "from-[#B5704F]/60 to-[#C8A882]/30" },
  { id: 2, title: "Brand Identity Pack",    type: "DESIGN", date: "5h ago",    colors: "from-[#8A9E8C]/60 to-[#C8A882]/25" },
  { id: 3, title: "Sunset Café Campaign",   type: "IMAGE",  date: "Yesterday", colors: "from-[#C8A882]/50 to-[#B5704F]/30" },
  { id: 4, title: "Lead Research Agent",    type: "AGENT",  date: "Yesterday", colors: "from-[#B5704F]/40 to-[#8A9E8C]/30" },
  { id: 5, title: "API Server Boilerplate", type: "CODE",   date: "2d ago",    colors: "from-[#1A1712] to-[#221E18]" },
  { id: 6, title: "Ambient Soundscape",     type: "MUSIC",  date: "3d ago",    colors: "from-[#8A9E8C]/40 to-[#C8A882]/20" },
];

const TYPE_COLORS: Record<string, string> = {
  VIDEO:  "#B5704F", DESIGN: "#C8A882", IMAGE: "#8A9E8C",
  AGENT:  "#B5704F", CODE:   "#A89880", MUSIC: "#8A9E8C",
};

const AGENTS_MOCK = [
  { name: "Customer Service Bot", lastRun: "2 min ago", runs: "1,234", success: 98 },
  { name: "Lead Research Agent",  lastRun: "4h ago",    runs: "456",   success: 94 },
];

const LOW_CREDITS_THRESHOLD = 20;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomePage() {
  const { user } = useUser();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("All");
  const [credits, setCredits] = useState<number | null>(null);
  const [creditsLoading, setCreditsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/credits")
      .then((r) => r.json())
      .then((d) => {
        setCredits(d.data?.credits ?? d.credits ?? 0);
      })
      .catch(() => {
        toast.error("Failed to load credits");
        setCredits(0);
      })
      .finally(() => setCreditsLoading(false));
  }, []);

  function handleGenerate() {
    if (!prompt.trim()) return;
    const params = new URLSearchParams({ prompt: prompt.trim() });
    if (mode !== "All") params.set("mode", mode.toLowerCase());
    router.push(`/create?${params.toString()}`);
  }

  const lowCredits = credits !== null && credits < LOW_CREDITS_THRESHOLD;

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <header className="h-[60px] flex items-center justify-between px-6 border-b border-[#2C271F] shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[#F2EDE6] tracking-wide">Home</span>
          <span className="artisan-label">[ artisan_build: v1.2 ]</span>
        </div>
        <div className="w-7 h-7 rounded-full border border-[#C8A882]/30 bg-[#221E18] flex items-center justify-center text-[11px] font-medium text-[#C8A882] cursor-pointer hover:border-[#C8A882]/60 transition-[border-color] duration-150">
          {user?.firstName?.[0]?.toUpperCase() ?? "A"}
        </div>
      </header>

      <div className={cn("flex-1 max-w-[820px] mx-auto w-full px-6 py-8 space-y-9", lowCredits && "pb-20")}>

        {/* ── Greeting ─────────────────────────────────────────────── */}
        <div className="animate-fade-up">
          <h2
            className="text-[32px] font-normal text-[#F2EDE6] leading-tight"
            style={{ fontFamily: "var(--font-dm-serif)", letterSpacing: "-0.02em" }}
          >
            {getGreeting()}, {user?.firstName ?? "friend"}.
          </h2>
          <p className="text-[13px] text-[#6B5E50] mt-1 tracking-wide">
            What will you craft today?
          </p>
        </div>

        {/* ── Quick actions ────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 animate-fade-up" style={{ animationDelay: "40ms" }}>
          {QUICK_ACTIONS.map(({ label, icon: Icon, href, accent }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-2 h-8 px-3.5 rounded-[8px] text-[12px] font-medium border border-[#2C271F] bg-[#1A1712] text-[#A89880] hover:border-[#3A3328] hover:text-[#F2EDE6] transition-[border-color,color,transform] duration-150 active:scale-[0.97]"
            >
              <Icon style={{ width: 12, height: 12, color: accent }} className="shrink-0" />
              {label}
            </Link>
          ))}
        </div>

        {/* ── Central prompt bar ───────────────────────────────────── */}
        <div
          className="bg-[#1A1712] border border-[#2C271F] rounded-[12px] p-4 space-y-3 animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          {/* Artisan motif top */}
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] text-[#6B5E50] tracking-wider">{"{ craft }"}</span>
            <span className="font-mono text-[10px] text-[#6B5E50]">status: ready</span>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
            }}
            placeholder="Describe what you want to create…"
            rows={3}
            className="w-full bg-transparent text-[#F2EDE6] placeholder:text-[#6B5E50]/60 text-[14px] resize-none focus:outline-none leading-relaxed"
          />
          <div className="flex items-center justify-between pt-1 border-t border-[#2C271F]">
            {/* Mode pills */}
            <div className="flex gap-1">
              {MODES.map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "h-6 px-2.5 rounded-full text-[11px] font-medium tracking-wide",
                    "transition-[background-color,color] duration-150 active:scale-[0.97]",
                    mode === m
                      ? "bg-[#C8A882]/15 text-[#C8A882] border border-[#C8A882]/25"
                      : "text-[#6B5E50] hover:text-[#A89880]"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className={cn(
                "flex items-center gap-2 h-8 px-5 rounded-[8px] text-[12px] font-semibold",
                "bg-[#C8A882] text-[#111009]",
                "hover:bg-[#BFA070] hover:shadow-[0_0_16px_rgba(200,168,130,0.3)]",
                "transition-[background-color,box-shadow,transform] duration-150 active:scale-[0.97]",
                !prompt.trim() && "opacity-40 pointer-events-none"
              )}
            >
              <Zap style={{ width: 12, height: 12 }} />
              Generate
            </button>
          </div>
        </div>

        {/* ── Stats row ────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 animate-fade-up" style={{ animationDelay: "120ms" }}>
          {[
            { label: "Total Creations", value: "1,284",  mono: "const created" },
            { label: "Active Agents",   value: "2 / 3",  mono: "agents.running" },
            {
              label: "Credits Left",
              value: creditsLoading
                ? "—"
                : credits !== null
                  ? credits.toLocaleString()
                  : "—",
              mono: "credits.balance",
              highlight: lowCredits,
            },
          ].map(({ label, value, mono, highlight }) => (
            <div
              key={label}
              className={cn(
                "bg-[#1A1712] border rounded-[12px] p-4 transition-[border-color] duration-150",
                highlight ? "border-[#B5704F]/40" : "border-[#2C271F]"
              )}
            >
              <p
                className="font-mono text-[10px] tracking-wide mb-3"
                style={{ fontFamily: "var(--font-jetbrains-mono)", color: "#6B5E50" }}
              >
                {mono}
              </p>
              <p
                className={cn(
                  "text-[28px] leading-none",
                  highlight ? "text-[#B5704F]" : "text-[#F2EDE6]",
                  creditsLoading && label === "Credits Left" && "animate-pulse"
                )}
                style={{ fontFamily: "var(--font-dm-serif)", letterSpacing: "-0.02em" }}
              >
                {value}
              </p>
              <p className="text-[11px] text-[#6B5E50] mt-1.5 tracking-wide">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Recent projects ──────────────────────────────────────── */}
        <section className="animate-fade-up" style={{ animationDelay: "160ms" }}>
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-[18px] text-[#F2EDE6]"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Recent Projects
            </h3>
            <Link
              href="/library"
              className="flex items-center gap-1 text-[12px] text-[#6B5E50] hover:text-[#C8A882] transition-colors duration-150"
            >
              View all <ChevronRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {RECENT.map((p, i) => (
              <div
                key={p.id}
                className="group relative rounded-[12px] overflow-hidden border border-[#2C271F] hover:border-[#3A3328] cursor-pointer transition-[border-color,transform] duration-200 hover:-translate-y-0.5 animate-fade-up"
                style={{ animationDelay: `${160 + i * 30}ms` }}
              >
                {/* Gradient thumbnail */}
                <div className={cn("h-28 bg-gradient-to-br", p.colors)} />
                {/* Decorative bracket */}
                <div className="absolute top-3 right-3 font-mono text-[11px] text-white/20">{"{ }"}</div>
                {/* Type badge */}
                <span
                  className="absolute top-2.5 left-2.5 font-mono text-[10px] font-medium px-2 py-0.5 rounded-[4px] border"
                  style={{
                    backgroundColor: `${TYPE_COLORS[p.type]}15`,
                    color: TYPE_COLORS[p.type],
                    borderColor: `${TYPE_COLORS[p.type]}30`,
                  }}
                >
                  {p.type}
                </span>
                {/* Info */}
                <div className="p-3 bg-[#1A1712]">
                  <p className="text-[13px] font-medium text-[#F2EDE6] truncate">{p.title}</p>
                  <p className="text-[11px] text-[#6B5E50] mt-0.5">{p.date}</p>
                </div>
                {/* Hover arrow */}
                <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <ArrowUpRight style={{ width: 14, height: 14 }} className="text-white/40" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Agent status ─────────────────────────────────────────── */}
        <section className="animate-fade-up" style={{ animationDelay: "320ms" }}>
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-[18px] text-[#F2EDE6]"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Agent Status
            </h3>
            <Link
              href="/agents"
              className="flex items-center gap-1 text-[12px] text-[#6B5E50] hover:text-[#C8A882] transition-colors duration-150"
            >
              Manage Agents <ChevronRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>
          <div className="space-y-2">
            {AGENTS_MOCK.map((agent) => (
              <div
                key={agent.name}
                className="flex items-center justify-between bg-[#1A1712] border border-[#2C271F] rounded-[10px] px-4 py-3 hover:border-[#3A3328] transition-[border-color] duration-150"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-[#8A9E8C]" />
                    <div className="absolute inset-0 rounded-full bg-[#8A9E8C] animate-ping opacity-30" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[#F2EDE6]">{agent.name}</p>
                    <p
                      className="text-[10px] text-[#6B5E50]"
                      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                    >
                      last_run: {agent.lastRun}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[12px] text-[#A89880]">{agent.runs} runs</p>
                    <p
                      className="text-[11px] text-[#8A9E8C]"
                      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                    >
                      {agent.success}% success
                    </p>
                  </div>
                  <CheckCircle2 style={{ width: 14, height: 14 }} className="text-[#8A9E8C]" />
                </div>
              </div>
            ))}
          </div>

          {/* Footer artisan mark */}
          <div className="mt-8 pt-6 border-t border-[#2C271F] flex items-center justify-between">
            <span
              className="text-[10px] text-[#6B5E50]"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              Codeparkdevs · 2025 · All rights reserved
            </span>
            <span
              className="text-[10px] text-[#6B5E50]"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              [ status: crafted ]
            </span>
          </div>
        </section>

      </div>

      {/* ── Low credits warning bar ──────────────────────────────────── */}
      {lowCredits && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-4 px-6 py-3 bg-[#1A1712] border-t border-[#B5704F]/30 shadow-[0_-4px_24px_rgba(181,112,79,0.12)]">
          <div className="flex items-center gap-2.5">
            <AlertTriangle style={{ width: 14, height: 14 }} className="text-[#B5704F] shrink-0" />
            <p className="text-[13px] text-[#F2EDE6]">
              You have{" "}
              <span className="font-semibold text-[#B5704F]">
                {credits} credit{credits === 1 ? "" : "s"}
              </span>{" "}
              remaining. Top up to keep creating.
            </p>
          </div>
          <Link
            href="/settings?tab=billing"
            className="shrink-0 flex items-center gap-1.5 h-8 px-4 rounded-[8px] text-[12px] font-semibold bg-[#B5704F] text-[#F2EDE6] hover:bg-[#A3603E] transition-[background-color,transform] duration-150 active:scale-[0.97]"
          >
            <Zap style={{ width: 11, height: 11 }} />
            Get More Credits
          </Link>
        </div>
      )}
    </div>
  );
}

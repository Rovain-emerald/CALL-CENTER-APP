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

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header className="h-[60px] flex items-center justify-between px-6 border-b border-[#2C271F] shrink-0 bg-[#111009]/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span
            className="text-[13px] font-medium text-[#F2EDE6] tracking-wide"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Home
          </span>
          <span
            className="text-[10px] text-[#4A4135] tracking-widest"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          >
            [ artisan_build: v1.2 ]
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="hidden sm:inline text-[10px] text-[#4A4135]"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          >
            status: ready
          </span>
          <div className="w-7 h-7 rounded-full border border-[#C8A882]/30 bg-[#221E18] flex items-center justify-center text-[11px] font-medium text-[#C8A882] cursor-pointer hover:border-[#C8A882]/60 transition-[border-color] duration-200">
            {user?.firstName?.[0]?.toUpperCase() ?? "A"}
          </div>
        </div>
      </header>

      <div className={cn("flex-1 max-w-[820px] mx-auto w-full px-6 py-10 space-y-10", lowCredits && "pb-20")}>

        {/* ── Greeting ──────────────────────────────────────────────────── */}
        <div className="animate-fade-up">
          <h2
            className="text-[38px] font-normal text-[#F2EDE6] leading-tight"
            style={{ fontFamily: "var(--font-dm-serif)", letterSpacing: "-0.025em" }}
          >
            {getGreeting()}, {user?.firstName ?? "friend"}.
          </h2>
          <p
            className="text-[16px] text-[#A89880] mt-1.5 leading-snug"
            style={{ fontFamily: "var(--font-dm-serif)", fontStyle: "italic" }}
          >
            What will you craft today?
          </p>
          <div className="w-16 h-px bg-gradient-to-r from-[#C8A882]/40 to-transparent mt-4" />
        </div>

        {/* ── Quick actions ──────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 animate-fade-up" style={{ animationDelay: "40ms" }}>
          {QUICK_ACTIONS.map(({ label, icon: Icon, href, accent }, i) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-2 h-8 px-3.5 rounded-[8px] text-[12px] font-medium border border-[#2C271F] bg-[#1A1712] text-[#A89880] hover:border-[#3A3328] hover:text-[#F2EDE6] hover:shadow-[0_4px_20px_rgba(200,168,130,0.12)] hover:-translate-y-0.5 transition-[border-color,color,transform,box-shadow] duration-200 active:scale-[0.97] animate-fade-up"
              style={{ animationDelay: `${40 + i * 25}ms` }}
            >
              <Icon style={{ width: 12, height: 12, color: accent }} className="shrink-0" />
              {label}
            </Link>
          ))}
        </div>

        {/* ── Central prompt bar ────────────────────────────────────────── */}
        <div
          className="relative bg-[#0F0D0A] border border-[#2C271F] rounded-[14px] overflow-hidden shadow-[0_0_0_1px_rgba(200,168,130,0.04)] animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          {/* Decorative top clay hairline */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8A882]/20 to-transparent" />

          <div className="p-5 space-y-4">
            {/* Artisan motif header row */}
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] text-[#6B5E50] tracking-widest"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                {"{ craft }"}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8A9E8C]" />
                <span
                  className="text-[10px] text-[#6B5E50]"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                  status: ready
                </span>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
              }}
              placeholder="Describe what you want to create…"
              rows={4}
              className="w-full bg-transparent text-[#F2EDE6] placeholder:text-[#4A4135] text-[14px] resize-none focus:outline-none leading-[1.7]"
            />

            {/* Bottom bar: modes + generate */}
            <div className="flex items-center justify-between pt-3 border-t border-[#2C271F]/80">
              <div className="flex gap-1">
                {MODES.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={cn(
                      "h-6 px-2.5 rounded-full text-[11px] font-medium tracking-wide",
                      "transition-[background-color,color,border-color] duration-150 active:scale-[0.97]",
                      mode === m
                        ? "bg-[#C8A882]/15 text-[#C8A882] border border-[#C8A882]/30"
                        : "text-[#6B5E50] hover:text-[#A89880] border border-transparent"
                    )}
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
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
                  "transition-[background-color,box-shadow,transform] duration-200 active:scale-[0.97]",
                  prompt.trim()
                    ? "hover:bg-[#BFA070] hover:shadow-[0_0_20px_rgba(200,168,130,0.25)]"
                    : "opacity-35 pointer-events-none"
                )}
              >
                <Zap style={{ width: 12, height: 12 }} />
                Generate
              </button>
            </div>
          </div>

          {/* Decorative bottom clay line */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#C8A882]/10 to-transparent" />
        </div>

        {/* ── Stats row ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 animate-fade-up" style={{ animationDelay: "120ms" }}>
          {[
            { label: "Total Creations", value: "1,284",  mono: "const created",   highlight: false },
            { label: "Active Agents",   value: "2 / 3",  mono: "agents.running",  highlight: false },
            {
              label: "Credits Left",
              value: creditsLoading ? "—" : credits !== null ? credits.toLocaleString() : "—",
              mono: "credits.balance",
              highlight: lowCredits,
            },
          ].map(({ label, value, mono, highlight }) => (
            <div
              key={label}
              className={cn(
                "group relative bg-[#0F0D0A] border rounded-[12px] p-4 overflow-hidden",
                "transition-[border-color,box-shadow] duration-200",
                highlight
                  ? "border-[#B5704F]/40 hover:border-[#B5704F]/60"
                  : "border-[#2C271F] hover:border-[#3A3328]"
              )}
            >
              {/* Hover top accent */}
              <div
                className={cn(
                  "absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                  highlight
                    ? "bg-gradient-to-r from-transparent via-[#B5704F]/50 to-transparent"
                    : "bg-gradient-to-r from-transparent via-[#C8A882]/20 to-transparent"
                )}
              />
              <p
                className="text-[10px] tracking-widest mb-3 uppercase"
                style={{ fontFamily: "var(--font-jetbrains-mono)", color: "#4A4135" }}
              >
                {mono}
              </p>
              <p
                className={cn(
                  "text-[30px] leading-none",
                  highlight ? "text-[#B5704F]" : "text-[#F2EDE6]",
                  creditsLoading && label === "Credits Left" && "animate-pulse"
                )}
                style={{ fontFamily: "var(--font-dm-serif)", letterSpacing: "-0.025em" }}
              >
                {value}
              </p>
              <p
                className="text-[11px] text-[#6B5E50] mt-2 tracking-wide"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Recent projects ────────────────────────────────────────────── */}
        <section className="animate-fade-up" style={{ animationDelay: "160ms" }}>
          <div className="flex items-center justify-between mb-5">
            <h3
              className="text-[20px] text-[#F2EDE6]"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Recent Projects
            </h3>
            <Link
              href="/library"
              className="flex items-center gap-1 text-[12px] text-[#6B5E50] hover:text-[#C8A882] transition-colors duration-150"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              View all <ChevronRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {RECENT.map((p, i) => (
              <div
                key={p.id}
                className="group relative rounded-[12px] overflow-hidden border border-[#2C271F] bg-[#0F0D0A] hover:border-[#3A3328] cursor-pointer transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] animate-fade-up"
                style={{ animationDelay: `${160 + i * 30}ms` }}
              >
                {/* Gradient thumbnail */}
                <div className={cn("h-[100px] bg-gradient-to-br relative", p.colors)}>
                  {/* Subtle noise overlay */}
                  <div className="absolute inset-0 opacity-[0.04] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC43NSIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWx0ZXI9InVybCgjbikiIG9wYWNpdHk9IjEiLz48L3N2Zz4=')] bg-repeat" />
                </div>

                {/* Type badge */}
                <span
                  className="absolute top-2.5 left-2.5 font-mono text-[9px] font-medium px-1.5 py-0.5 rounded-[4px] border tracking-widest"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono)",
                    backgroundColor: `${TYPE_COLORS[p.type]}12`,
                    color: TYPE_COLORS[p.type],
                    borderColor: `${TYPE_COLORS[p.type]}28`,
                  }}
                >
                  {p.type}
                </span>

                {/* Hover arrow — slides in from off-screen top-right */}
                <div className="absolute top-2.5 right-2.5 translate-x-1 -translate-y-1 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-[transform,opacity] duration-200">
                  <ArrowUpRight style={{ width: 13, height: 13 }} className="text-white/50" />
                </div>

                {/* Info row */}
                <div className="px-3 py-2.5 bg-[#0F0D0A] border-t border-[#2C271F]/60">
                  <p className="text-[12px] font-medium text-[#F2EDE6] truncate leading-snug">{p.title}</p>
                  <p
                    className="text-[10px] text-[#4A4135] mt-0.5"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                  >
                    {p.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Agent status ──────────────────────────────────────────────── */}
        <section className="animate-fade-up" style={{ animationDelay: "320ms" }}>
          <div className="flex items-center justify-between mb-5">
            <h3
              className="text-[20px] text-[#F2EDE6]"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Agent Status
            </h3>
            <Link
              href="/agents"
              className="flex items-center gap-1 text-[12px] text-[#6B5E50] hover:text-[#C8A882] transition-colors duration-150"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              Manage Agents <ChevronRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>
          <div className="space-y-2">
            {AGENTS_MOCK.map((agent) => (
              <div
                key={agent.name}
                className="group flex items-center justify-between bg-[#0F0D0A] border border-[#2C271F] rounded-[10px] px-4 py-3.5 hover:border-[#3A3328] hover:shadow-[0_2px_16px_rgba(200,168,130,0.04)] transition-[border-color,box-shadow] duration-200"
              >
                <div className="flex items-center gap-3">
                  {/* Pulsing green dot with ring */}
                  <div className="relative flex items-center justify-center w-4 h-4 shrink-0">
                    <div className="absolute inset-0 rounded-full bg-[#8A9E8C]/20 animate-ping" />
                    <div className="relative w-2 h-2 rounded-full bg-[#8A9E8C] ring-2 ring-[#8A9E8C]/20" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[#F2EDE6]">{agent.name}</p>
                    <p
                      className="text-[10px] text-[#4A4135] mt-0.5"
                      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                    >
                      last_run: {agent.lastRun}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p
                      className="text-[12px] text-[#A89880]"
                      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                    >
                      {agent.runs} runs
                    </p>
                    <p
                      className="text-[11px] text-[#8A9E8C]"
                      style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                    >
                      {agent.success}% success
                    </p>
                  </div>
                  <CheckCircle2 style={{ width: 14, height: 14 }} className="text-[#8A9E8C] shrink-0" />
                </div>
              </div>
            ))}
          </div>

          {/* Footer artisan mark */}
          <div className="mt-10 pt-5 border-t border-[#2C271F] flex items-center justify-between">
            <span
              className="text-[10px] text-[#3A3328]"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              CPD{"}"} · 2025
            </span>
            <span
              className="text-[10px] text-[#3A3328]"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              [ v1.2.0 · crafted ]
            </span>
          </div>
        </section>

      </div>

      {/* ── Low credits warning bar ───────────────────────────────────────── */}
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

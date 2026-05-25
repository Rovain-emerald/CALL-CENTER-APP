"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageSquare, Sparkles, Music, Palette, Code2, Bot,
  ArrowRight, Zap, TrendingUp, Image, Play, ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const QUICK_ACTIONS = [
  { label: "Chat", icon: MessageSquare, href: "/chat", color: "#7C3AED" },
  { label: "Generate Video", icon: Play, href: "/create", color: "#00FF87" },
  { label: "Make Music", icon: Music, href: "/create", color: "#EC4899" },
  { label: "Design", icon: Palette, href: "/studio", color: "#F59E0B" },
  { label: "Write Code", icon: Code2, href: "/code", color: "#3B82F6" },
  { label: "Run Agent", icon: Bot, href: "/agents", color: "#00FF87" },
];

const CREATE_MODES = ["Image", "Video", "Music", "Design", "All"];

const RECENT_PROJECTS = [
  {
    id: 1,
    title: "Product Launch Video",
    type: "VIDEO",
    typeColor: "#7C3AED",
    gradient: "from-[#7C3AED] to-[#EC4899]",
    time: "2h ago",
  },
  {
    id: 2,
    title: "Brand Identity Pack",
    type: "DESIGN",
    typeColor: "#EC4899",
    gradient: "from-[#EC4899] to-[#F59E0B]",
    time: "5h ago",
  },
  {
    id: 3,
    title: "Sunset Café Campaign",
    type: "IMAGE",
    typeColor: "#00FF87",
    gradient: "from-[#00FF87] to-[#3B82F6]",
    time: "Yesterday",
  },
  {
    id: 4,
    title: "Agent: Lead Research",
    type: "AGENT",
    typeColor: "#F59E0B",
    gradient: "from-[#F59E0B] to-[#EF4444]",
    time: "Yesterday",
  },
  {
    id: 5,
    title: "E-comm Chat Script",
    type: "CHAT",
    typeColor: "#3B82F6",
    gradient: "from-[#3B82F6] to-[#7C3AED]",
    time: "2d ago",
  },
  {
    id: 6,
    title: "Ambient Soundscape",
    type: "MUSIC",
    typeColor: "#EC4899",
    gradient: "from-[#EC4899] to-[#7C3AED]",
    time: "3d ago",
  },
];

const MOCK_AGENTS = [
  {
    name: "Customer Service Bot",
    status: "active" as const,
    runs: "1,234",
    lastRun: "2 min ago",
    success: 98,
  },
  {
    name: "Lead Research Agent",
    status: "active" as const,
    runs: "456",
    lastRun: "4h ago",
    success: 94,
  },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("All");

  return (
    <div className="flex flex-col min-h-full">
      {/* Top bar */}
      <header className="h-14 flex items-center justify-between px-5 border-b border-[#1E1E1E] shrink-0">
        <span className="text-sm font-semibold text-white">Home</span>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#EC4899] flex items-center justify-center text-xs font-bold text-white">
            A
          </div>
        </div>
      </header>

      <div className="flex-1 px-5 py-7 max-w-4xl mx-auto w-full space-y-8">
        {/* Greeting */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            {getGreeting()} 👋
          </h2>
          <p className="text-sm text-[#666] mt-1">What will you create today?</p>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map(({ label, icon: Icon, href, color }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex items-center gap-2 h-9 px-4 rounded-full text-sm font-medium",
                "border border-[#2A2A2A] bg-[#111111] text-[#AAAAAA]",
                "hover:border-[#3A3A3A] hover:text-white",
                "transition-[border-color,color,transform] duration-150 active:scale-[0.97]"
              )}
            >
              <Icon className="w-3.5 h-3.5" style={{ color }} />
              {label}
            </Link>
          ))}
        </div>

        {/* Central prompt bar */}
        <div className="bg-[#111111] rounded-2xl border border-[#2A2A2A] p-4 space-y-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to create…"
            rows={3}
            className={cn(
              "w-full bg-transparent text-white placeholder:text-[#444] text-sm resize-none",
              "focus:outline-none leading-relaxed"
            )}
          />
          <div className="flex items-center justify-between">
            {/* Mode pills */}
            <div className="flex gap-1">
              {CREATE_MODES.map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "h-7 px-3 rounded-full text-xs font-medium",
                    "transition-[background-color,color] duration-150 active:scale-[0.97]",
                    mode === m
                      ? "bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/30"
                      : "text-[#666] hover:text-white hover:bg-[#1A1A1A]"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
            {/* Generate button */}
            <button
              className={cn(
                "flex items-center gap-2 h-9 px-5 rounded-full text-sm font-semibold",
                "bg-[#00FF87] text-black",
                "hover:bg-[#00E077] hover:shadow-[0_0_20px_rgba(0,255,135,0.35)]",
                "transition-[background-color,box-shadow,transform] duration-150 active:scale-[0.97]",
                !prompt && "opacity-50 pointer-events-none"
              )}
              disabled={!prompt}
            >
              <Zap className="w-3.5 h-3.5" />
              Generate
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Creations", value: "1,284", icon: Sparkles, color: "#7C3AED" },
            { label: "Active Agents", value: "2 / 3", icon: Bot, color: "#00FF87" },
            { label: "Credits Left", value: "240", icon: Zap, color: "#F59E0B" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#666]">{label}</span>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${color}18` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Recent projects */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Recent Projects</h3>
            <Link
              href="/library"
              className="flex items-center gap-1 text-xs text-[#666] hover:text-white transition-colors duration-150"
            >
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {RECENT_PROJECTS.map((p) => (
              <div
                key={p.id}
                className={cn(
                  "group relative rounded-2xl overflow-hidden cursor-pointer",
                  "border border-[#2A2A2A] hover:border-[#3A3A3A]",
                  "transition-[border-color,transform] duration-200",
                  "@media (hover: hover) { hover:-translate-y-0.5 }"
                )}
              >
                {/* Thumbnail gradient */}
                <div className={cn("h-28 bg-gradient-to-br", p.gradient, "opacity-70")} />
                {/* Type badge */}
                <span
                  className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${p.typeColor}25`, color: p.typeColor }}
                >
                  {p.type}
                </span>
                {/* Info */}
                <div className="p-3 bg-[#111111]">
                  <p className="text-sm font-medium text-white truncate">{p.title}</p>
                  <p className="text-xs text-[#555] mt-0.5">{p.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Agent status */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Agent Status</h3>
            <Link
              href="/agents"
              className="flex items-center gap-1 text-xs text-[#666] hover:text-white transition-colors duration-150"
            >
              Manage <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {MOCK_AGENTS.map((agent) => (
              <div
                key={agent.name}
                className="flex items-center justify-between bg-[#111111] border border-[#2A2A2A] rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  {/* Pulse dot */}
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-[#00FF87]" />
                    <div className="absolute inset-0 rounded-full bg-[#00FF87] animate-ping opacity-30" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{agent.name}</p>
                    <p className="text-xs text-[#555]">Last run {agent.lastRun}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-[#AAAAAA] font-medium">{agent.runs} runs</p>
                    <p className="text-xs text-[#00FF87]">{agent.success}% success</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-[#00FF87]" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

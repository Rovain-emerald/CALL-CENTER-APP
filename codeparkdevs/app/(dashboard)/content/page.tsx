"use client";

import { useState } from "react";
import { Calendar, RefreshCw, Zap, BarChart2, Plus, ChevronLeft, ChevronRight, Check, Image } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "scheduler", label: "Scheduler", icon: Calendar },
  { id: "repurpose", label: "Repurpose", icon: RefreshCw },
  { id: "autopilot", label: "Autopilot", icon: Zap },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
];

const PLATFORMS = [
  { id: "instagram", label: "Instagram", color: "#EC4899", connected: true },
  { id: "tiktok", label: "TikTok", color: "#FFFFFF", connected: true },
  { id: "youtube", label: "YouTube", color: "#EF4444", connected: false },
  { id: "twitter", label: "X / Twitter", color: "#FFFFFF", connected: true },
  { id: "linkedin", label: "LinkedIn", color: "#3B82F6", connected: false },
  { id: "facebook", label: "Facebook", color: "#3B82F6", connected: false },
];

const UPCOMING = [
  { id: 1, platform: "Instagram", caption: "Launching our new AI video tool — generate cinematic content in seconds 🎬", time: "Today 3:00 PM", color: "#EC4899" },
  { id: 2, platform: "TikTok", caption: "5 things you didn't know AI could do for your business 🤖", time: "Tomorrow 9:00 AM", color: "#FFFFFF" },
  { id: 3, platform: "X / Twitter", caption: "Thread: How we automated 80% of our content workflow using agents 🧵", time: "Wed 12:00 PM", color: "#888888" },
];

const REPURPOSE_TARGETS = [
  { id: "short", label: "YouTube Short", color: "#EF4444" },
  { id: "tiktok", label: "TikTok", color: "#FFFFFF" },
  { id: "reel", label: "Instagram Reel", color: "#EC4899" },
  { id: "thread", label: "Twitter Thread", color: "#888" },
  { id: "linkedin", label: "LinkedIn Post", color: "#3B82F6" },
  { id: "blog", label: "Blog Summary", color: "#00FF87" },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SCHEDULED_DAYS = new Set([3, 7, 10, 14, 17, 21, 24, 28]);

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState("scheduler");
  const [selectedTargets, setSelectedTargets] = useState<string[]>(["short", "tiktok", "reel"]);

  const toggleTarget = (id: string) =>
    setSelectedTargets((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  return (
    <div className="flex flex-col h-full">
      <header className="h-14 flex items-center px-5 border-b border-[#1E1E1E] shrink-0 gap-5">
        <span className="text-sm font-semibold text-white">Content</span>
        <div className="flex gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-medium",
                "transition-[background-color,color] duration-150",
                activeTab === id
                  ? "bg-[#1A1A1A] text-white"
                  : "text-[#666] hover:text-white"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <button className="flex items-center gap-2 h-8 px-4 rounded-full text-xs font-semibold bg-[#00FF87] text-black hover:bg-[#00E077] transition-[background-color,transform] duration-150 active:scale-[0.97]">
            <Plus className="w-3.5 h-3.5" />
            Schedule Post
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
        {activeTab === "scheduler" && (
          <>
            {/* Platform strip */}
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(({ id, label, color, connected }) => (
                <div
                  key={id}
                  className={cn(
                    "flex items-center gap-2 h-8 px-3 rounded-full text-xs font-medium border",
                    connected
                      ? "border-[#2A2A2A] bg-[#111111] text-white"
                      : "border-[#1A1A1A] bg-transparent text-[#444]"
                  )}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: connected ? color : "#333" }} />
                  {label}
                  {connected && <Check className="w-3 h-3 text-[#00FF87]" />}
                </div>
              ))}
            </div>

            {/* Calendar */}
            <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">May 2026</h3>
                <div className="flex gap-1">
                  {[ChevronLeft, ChevronRight].map((Icon, i) => (
                    <button key={i} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#666] hover:text-white hover:bg-[#1A1A1A] transition-colors duration-150 active:scale-[0.97]">
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {DAYS.map((d) => (
                  <div key={d} className="text-center text-[10px] text-[#555] font-medium pb-2">{d}</div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 3;
                  const inMonth = day >= 1 && day <= 31;
                  const hasPost = SCHEDULED_DAYS.has(day);
                  const isToday = day === 25;
                  return (
                    <div
                      key={i}
                      className={cn(
                        "relative h-9 rounded-lg flex flex-col items-center justify-center text-xs",
                        "transition-[background-color] duration-150",
                        inMonth ? "cursor-pointer hover:bg-[#1A1A1A]" : "opacity-20",
                        isToday && "bg-[#00FF87]/10 text-[#00FF87] font-bold"
                      )}
                    >
                      {inMonth && <span>{day}</span>}
                      {hasPost && (
                        <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#EC4899]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming posts */}
            <div>
              <h3 className="text-xs font-semibold text-[#666] uppercase tracking-wider mb-3">Upcoming Posts</h3>
              <div className="space-y-2">
                {UPCOMING.map((post) => (
                  <div key={post.id} className="flex items-start gap-3 bg-[#111111] border border-[#2A2A2A] rounded-xl p-3">
                    <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center" style={{ backgroundColor: `${post.color}18` }}>
                      <Image className="w-4 h-4" style={{ color: post.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{post.caption}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#555]">{post.platform}</span>
                        <span className="text-[10px] text-[#444]">·</span>
                        <span className="text-xs text-[#555]">{post.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "repurpose" && (
          <div className="max-w-lg space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">Upload Source Content</h3>
              <div className="border-2 border-dashed border-[#2A2A2A] hover:border-[#3A3A3A] rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-[border-color] duration-150">
                <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-[#555]" />
                </div>
                <p className="text-sm text-[#666] text-center">Drop a video, blog post, or audio file</p>
                <button className="text-xs text-[#00FF87] font-medium hover:underline">or browse files</button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Repurpose to</h3>
              <div className="grid grid-cols-2 gap-2">
                {REPURPOSE_TARGETS.map(({ id, label, color }) => {
                  const selected = selectedTargets.includes(id);
                  return (
                    <button
                      key={id}
                      onClick={() => toggleTarget(id)}
                      className={cn(
                        "flex items-center gap-3 h-10 px-4 rounded-xl text-sm font-medium border",
                        "transition-[background-color,border-color,color] duration-150 active:scale-[0.97]",
                        selected
                          ? "border-[#2A2A2A] bg-[#1A1A1A] text-white"
                          : "border-[#1A1A1A] text-[#555] hover:border-[#2A2A2A] hover:text-white"
                      )}
                    >
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: selected ? color : "#333" }} />
                      {label}
                      {selected && <Check className="w-3.5 h-3.5 text-[#00FF87] ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>
            <button className="w-full h-10 rounded-full text-sm font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] hover:shadow-[0_0_20px_rgba(124,58,237,0.35)] transition-[background-color,box-shadow,transform] duration-150 active:scale-[0.97]">
              Repurpose with AI
            </button>
          </div>
        )}

        {(activeTab === "autopilot" || activeTab === "analytics") && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] flex items-center justify-center">
              {activeTab === "autopilot" ? <Zap className="w-8 h-8 text-[#555]" /> : <BarChart2 className="w-8 h-8 text-[#555]" />}
            </div>
            <p className="text-sm text-[#666]">
              {activeTab === "autopilot" ? "Autopilot coming soon" : "Analytics coming soon"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

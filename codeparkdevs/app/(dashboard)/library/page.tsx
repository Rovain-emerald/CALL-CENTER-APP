"use client";

import { useState } from "react";
import { Search, Download, Share2, Trash2, Folder, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Images", "Videos", "Music", "Designs", "Code"];

const ASSETS = [
  { id: 1, title: "Product Hero Video", type: "VIDEO", gradient: "from-[#7C3AED] to-[#EC4899]", typeColor: "#7C3AED", date: "Today", h: "h-48" },
  { id: 2, title: "Brand Logo Pack", type: "DESIGN", gradient: "from-[#EC4899] to-[#F59E0B]", typeColor: "#EC4899", date: "Yesterday", h: "h-36" },
  { id: 3, title: "Sunset Mood Board", type: "IMAGE", gradient: "from-[#F59E0B] to-[#EF4444]", typeColor: "#00FF87", date: "2d ago", h: "h-52" },
  { id: 4, title: "Ambient Track Vol.1", type: "MUSIC", gradient: "from-[#3B82F6] to-[#7C3AED]", typeColor: "#EC4899", date: "3d ago", h: "h-32" },
  { id: 5, title: "Instagram Story Set", type: "DESIGN", gradient: "from-[#00FF87] to-[#3B82F6]", typeColor: "#EC4899", date: "4d ago", h: "h-44" },
  { id: 6, title: "API Server Boilerplate", type: "CODE", gradient: "from-[#1A1A1A] to-[#2A2A2A]", typeColor: "#3B82F6", date: "5d ago", h: "h-36" },
  { id: 7, title: "Campaign Video Ad", type: "VIDEO", gradient: "from-[#EF4444] to-[#F59E0B]", typeColor: "#7C3AED", date: "1w ago", h: "h-40" },
  { id: 8, title: "Portrait Series", type: "IMAGE", gradient: "from-[#EC4899] to-[#7C3AED]", typeColor: "#00FF87", date: "1w ago", h: "h-48" },
];

const FOLDERS = [
  { name: "Client Projects", count: 12, color: "#7C3AED" },
  { name: "Social Content", count: 34, color: "#EC4899" },
  { name: "Brand Assets", count: 8, color: "#00FF87" },
  { name: "Code Snippets", count: 21, color: "#3B82F6" },
];

const COMMUNITY = [
  { id: 1, title: "Neon City", gradient: "from-[#7C3AED] to-[#3B82F6]", author: "@alex_creates" },
  { id: 2, title: "Forest Rain", gradient: "from-[#00FF87] to-[#3B82F6]", author: "@designstudio" },
  { id: 3, title: "Abstract Flow", gradient: "from-[#EC4899] to-[#F59E0B]", author: "@motion_labs" },
  { id: 4, title: "Retro Sunset", gradient: "from-[#F59E0B] to-[#EF4444]", author: "@vibe.visuals" },
  { id: 5, title: "Cyber Grid", gradient: "from-[#3B82F6] to-[#7C3AED]", author: "@techwave" },
  { id: 6, title: "Bloom", gradient: "from-[#EC4899] to-[#EF4444]", author: "@bloom_ai" },
];

export default function LibraryPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col h-full">
      <header className="h-14 flex items-center gap-4 px-5 border-b border-[#1E1E1E] shrink-0">
        <span className="text-sm font-semibold text-white">Library</span>
        <div className="flex-1 max-w-xs">
          <div className="flex items-center gap-2 bg-[#111111] border border-[#2A2A2A] rounded-xl px-3 h-9">
            <Search className="w-3.5 h-3.5 text-[#555] shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assets…"
              className="flex-1 bg-transparent text-xs text-white placeholder:text-[#444] focus:outline-none"
            />
          </div>
        </div>
        <div className="flex gap-1 ml-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "h-8 px-3 rounded-full text-xs font-medium",
                "transition-[background-color,color] duration-150",
                activeFilter === f
                  ? "bg-[#1A1A1A] text-white"
                  : "text-[#555] hover:text-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-7">
        {/* Folders */}
        <section>
          <h3 className="text-xs font-semibold text-[#666] uppercase tracking-wider mb-3">Folders</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {FOLDERS.map(({ name, count, color }) => (
              <button
                key={name}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl bg-[#111111] border border-[#2A2A2A]",
                  "hover:border-[#3A3A3A] text-left",
                  "transition-[border-color,transform] duration-150 active:scale-[0.98]"
                )}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${color}18` }}
                >
                  <Folder className="w-4 h-4" style={{ color }} />
                </div>
                <div>
                  <p className="text-xs font-medium text-white">{name}</p>
                  <p className="text-[10px] text-[#555]">{count} items</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Assets masonry grid */}
        <section>
          <h3 className="text-xs font-semibold text-[#666] uppercase tracking-wider mb-3">All Assets</h3>
          <div className="columns-2 md:columns-4 gap-3 space-y-3">
            {ASSETS.map((asset) => (
              <div
                key={asset.id}
                className={cn(
                  "group relative break-inside-avoid rounded-xl overflow-hidden",
                  "border border-[#2A2A2A] hover:border-[#3A3A3A]",
                  "transition-[border-color] duration-200 cursor-pointer",
                  asset.h
                )}
              >
                <div className={cn("w-full h-full bg-gradient-to-br", asset.gradient, "opacity-75")} />
                {/* Type badge */}
                <span
                  className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${asset.typeColor}25`, color: asset.typeColor }}
                >
                  {asset.type}
                </span>
                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end">
                  <div className="p-3 w-full">
                    <p className="text-xs font-medium text-white mb-2 truncate">{asset.title}</p>
                    <div className="flex gap-1.5">
                      {[Download, Share2, Trash2].map((Icon, i) => (
                        <button
                          key={i}
                          className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center",
                            "bg-white/10 hover:bg-white/20 text-white",
                            "transition-[background-color,transform] duration-150 active:scale-[0.95]"
                          )}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-3.5 h-3.5 text-[#666]" />
            <h3 className="text-xs font-semibold text-[#666] uppercase tracking-wider">Trending from Community</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {COMMUNITY.map((item) => (
              <div
                key={item.id}
                className="shrink-0 w-40 rounded-xl overflow-hidden border border-[#2A2A2A] hover:border-[#3A3A3A] cursor-pointer transition-[border-color] duration-150"
              >
                <div className={cn("h-28 bg-gradient-to-br", item.gradient, "opacity-70")} />
                <div className="p-2 bg-[#111111]">
                  <p className="text-xs font-medium text-white truncate">{item.title}</p>
                  <p className="text-[10px] text-[#555] mt-0.5">{item.author}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

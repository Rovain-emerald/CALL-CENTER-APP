"use client";

import { useState } from "react";
import {
  Search, Upload, Folder, Image as ImageIcon, Video,
  FileText, Code2, Music, Star, Download, MoreHorizontal,
  X, FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

type FilterType = "all" | "image" | "video" | "document" | "brand_asset" | "code" | "audio";

const FILTERS: { id: FilterType; label: string }[] = [
  { id: "all",        label: "All" },
  { id: "image",      label: "Images" },
  { id: "video",      label: "Videos" },
  { id: "document",   label: "Docs" },
  { id: "brand_asset",label: "Brand" },
  { id: "code",       label: "Code" },
  { id: "audio",      label: "Audio" },
];

const FOLDERS = [
  { name: "Brand Assets",    count: 24, icon: Star },
  { name: "Client Work",     count: 18, icon: FolderOpen },
  { name: "Social Content",  count: 47, icon: ImageIcon },
  { name: "Code Snippets",   count: 12, icon: Code2 },
];

const ITEMS = [
  { id: "1", name: "Hero Banner v3.png",   type: "image",       size: "2.4 MB", date: "Today",     color: "from-[#C8A882]/40 to-[#B5704F]/25" },
  { id: "2", name: "Brand Identity.pdf",   type: "document",    size: "4.1 MB", date: "Yesterday", color: "" },
  { id: "3", name: "Logo Mark.svg",        type: "brand_asset", size: "48 KB",  date: "2d ago",    color: "from-[#8A9E8C]/40 to-[#C8A882]/25" },
  { id: "4", name: "Product Demo.mp4",     type: "video",       size: "18.2 MB",date: "3d ago",    color: "from-[#B5704F]/40 to-[#8A9E8C]/25" },
  { id: "5", name: "api-helpers.ts",       type: "code",        size: "12 KB",  date: "4d ago",    color: "" },
  { id: "6", name: "Campaign Artwork.png", type: "image",       size: "3.7 MB", date: "5d ago",    color: "from-[#C8A882]/25 to-[#8A9E8C]/30" },
  { id: "7", name: "Intro Jingle.mp3",     type: "audio",       size: "3.2 MB", date: "1w ago",    color: "" },
  { id: "8", name: "Q2 Strategy.docx",     type: "document",    size: "820 KB", date: "1w ago",    color: "" },
];

const TYPE_ICON: Record<string, React.ElementType> = {
  image: ImageIcon, video: Video, document: FileText,
  brand_asset: Star, code: Code2, audio: Music,
};

const TYPE_COLOR: Record<string, string> = {
  image: "#C8A882", video: "#B5704F", document: "#A89880",
  brand_asset: "#8A9E8C", code: "#6B8CBF", audio: "#9B7FB5",
};

export default function LibraryPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const filtered = ITEMS.filter(item =>
    (filter === "all" || item.type === filter) &&
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <header className="h-[60px] flex items-center justify-between px-6 border-b border-[#2C271F] shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[#F2EDE6] tracking-wide">Library</span>
          <span className="font-mono text-[10px] text-[#6B5E50] border border-[#2C271F] px-2 py-0.5 rounded-[4px]">[ {ITEMS.length} assets ]</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search style={{ width: 13, height: 13, color: "#6B5E50" }} className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search assets…"
              className="h-8 pl-8 pr-3 rounded-[8px] bg-[#1A1712] border border-[#2C271F] text-[12px] text-[#F2EDE6] placeholder:text-[#6B5E50] focus:outline-none focus:border-[#C8A882]/40 transition-[border-color] duration-150 w-48"
            />
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 h-8 px-4 rounded-[8px] text-[12px] font-semibold bg-[#C8A882] text-[#111009] hover:bg-[#BFA070] hover:shadow-[0_0_16px_rgba(200,168,130,0.2)] transition-[background-color,box-shadow,transform] duration-150 active:scale-[0.97]"
          >
            <Upload style={{ width: 12, height: 12 }} /> Upload
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* ── Folders ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FOLDERS.map(({ name, count, icon: Icon }) => (
            <div key={name} className="flex items-center gap-3 bg-[#0F0D0A] border border-[#2C271F] rounded-[12px] p-3 cursor-pointer hover:border-[#3A3328] transition-[border-color] duration-150 group">
              <div className="w-9 h-9 rounded-[8px] bg-[#1A1712] border border-[#2C271F] flex items-center justify-center shrink-0 group-hover:border-[#C8A882]/20 transition-[border-color] duration-150">
                <Icon style={{ width: 14, height: 14, color: "#C8A882" }} />
              </div>
              <div>
                <p className="text-[12px] font-medium text-[#F2EDE6]">{name}</p>
                <p className="font-mono text-[10px] text-[#6B5E50]">{count} files</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex gap-1 flex-wrap">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={cn(
                "h-7 px-3 rounded-full text-[11px] font-medium transition-[background-color,color,border-color] duration-150 active:scale-[0.97]",
                filter === id
                  ? "bg-[#C8A882]/15 text-[#C8A882] border border-[#C8A882]/30"
                  : "text-[#6B5E50] hover:text-[#A89880] border border-transparent hover:border-[#2C271F]"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Grid ── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((item) => {
              const Icon = TYPE_ICON[item.type] ?? FileText;
              const color = TYPE_COLOR[item.type] ?? "#A89880";
              return (
                <div key={item.id} className="group bg-[#0F0D0A] border border-[#2C271F] rounded-[12px] overflow-hidden hover:border-[#3A3328] transition-[border-color,box-shadow] duration-150 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] cursor-pointer">
                  {/* Thumbnail */}
                  <div className="h-28 flex items-center justify-center relative">
                    {item.color ? (
                      <div className={cn("absolute inset-0 bg-gradient-to-br", item.color)} />
                    ) : (
                      <div className="absolute inset-0 bg-[#1A1712]" />
                    )}
                    <div className="relative z-10 w-10 h-10 rounded-[10px] bg-[#111009]/60 flex items-center justify-center">
                      <Icon style={{ width: 18, height: 18, color }} />
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-[#111009]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center z-20">
                      <button className="w-8 h-8 rounded-full bg-[#C8A882] flex items-center justify-center active:scale-[0.95]">
                        <Download style={{ width: 13, height: 13, color: "#111009" }} />
                      </button>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-3">
                    <p className="text-[12px] font-medium text-[#F2EDE6] truncate">{item.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-mono text-[10px] text-[#6B5E50]">{item.size}</span>
                      <span className="font-mono text-[10px] text-[#4A4135]">{item.date}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-[14px] bg-[#1A1712] border border-[#2C271F] flex items-center justify-center mb-4">
              <Folder style={{ width: 22, height: 22, color: "#6B5E50" }} />
            </div>
            <p className="text-[15px] text-[#F2EDE6] mb-2" style={{ fontFamily: "var(--font-dm-serif)" }}>
              No {filter === "all" ? "" : filter} files yet
            </p>
            <p className="text-[13px] text-[#6B5E50] mb-5">Upload your first file to get started</p>
            <button onClick={() => setShowUpload(true)} className="flex items-center gap-2 h-8 px-4 rounded-[8px] text-[12px] font-semibold bg-[#C8A882] text-[#111009] hover:bg-[#BFA070] transition-[background-color,transform] duration-150 active:scale-[0.97]">
              <Upload style={{ width: 12, height: 12 }} /> Upload Files
            </button>
          </div>
        )}
      </div>

      {/* ── Upload modal ── */}
      {showUpload && (
        <div className="fixed inset-0 bg-[#111009]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F0D0A] border border-[#2C271F] rounded-[20px] p-6 w-full max-w-md shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[16px] text-[#F2EDE6]" style={{ fontFamily: "var(--font-dm-serif)" }}>Upload Files</h2>
              <button onClick={() => setShowUpload(false)} className="w-7 h-7 rounded-[6px] flex items-center justify-center text-[#6B5E50] hover:text-[#A89880] hover:bg-[#1A1712] transition-all duration-150">
                <X style={{ width: 13, height: 13 }} />
              </button>
            </div>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={() => setDragOver(false)}
              className={cn(
                "border-2 border-dashed rounded-[14px] p-10 text-center transition-[border-color,background-color] duration-150",
                dragOver ? "border-[#C8A882]/60 bg-[#C8A882]/5" : "border-[#2C271F] hover:border-[#3A3328]"
              )}
            >
              <Upload style={{ width: 28, height: 28, color: "#6B5E50" }} className="mx-auto mb-3" />
              <p className="text-[14px] text-[#A89880] mb-1">Drop files here</p>
              <p className="text-[12px] text-[#6B5E50] mb-3">PDF, DOCX, PNG, JPG, SVG, MP4, JSON, ZIP</p>
              <button className="font-mono text-[11px] text-[#C8A882] hover:text-[#F2EDE6] transition-colors duration-150">
                or browse files
              </button>
            </div>
            <p className="font-mono text-[10px] text-[#6B5E50] mt-3 text-center">Max 50MB per file</p>
          </div>
        </div>
      )}
    </div>
  );
}

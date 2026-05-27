"use client";

import { useState } from "react";
import {
  Undo2, Redo2, MousePointer2, Type, Square, ImageIcon,
  Download, Share2, Eye, EyeOff, Lock, Plus, Minus, Wand2,
  Eraser, Palette, Layers, Sparkles, ZoomIn,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TOOLS = [
  { id: "select", icon: MousePointer2, label: "Select" },
  { id: "text",   icon: Type,          label: "Text" },
  { id: "shape",  icon: Square,        label: "Shape" },
  { id: "image",  icon: ImageIcon,     label: "Image" },
  { id: "draw",   icon: Eraser,        label: "Draw" },
  { id: "color",  icon: Palette,       label: "Color" },
];

const AI_TOOLS = [
  { label: "Remove Background", desc: "Cut out subject instantly", icon: Eraser,   color: "#C8A882" },
  { label: "Upscale 4×",        desc: "Enhance resolution",        icon: ZoomIn,   color: "#8A9E8C" },
  { label: "Style Transfer",    desc: "Apply artistic styles",      icon: Wand2,    color: "#B5704F" },
  { label: "Magic Erase",       desc: "Remove unwanted objects",    icon: Sparkles, color: "#C8A882" },
  { label: "Colorize",          desc: "Add color to B&W images",   icon: Palette,  color: "#8A9E8C" },
  { label: "Extend Canvas",     desc: "Expand image boundaries",    icon: Square,   color: "#B5704F" },
];

const TEMPLATES = [
  { title: "Instagram Post",   type: "Social",   color: "from-[#C8A882]/30 to-[#B5704F]/20", size: "1080×1080" },
  { title: "Twitter Banner",   type: "Banner",   color: "from-[#8A9E8C]/30 to-[#C8A882]/20", size: "1500×500" },
  { title: "Logo Concept",     type: "Branding", color: "from-[#B5704F]/30 to-[#8A9E8C]/20", size: "800×800" },
  { title: "Slide Deck",       type: "Present.", color: "from-[#C8A882]/20 to-[#8A9E8C]/30", size: "1920×1080" },
];

const LAYERS = [
  { id: 1, name: "Headline Text",  visible: true,  locked: false },
  { id: 2, name: "Brand Logo",     visible: true,  locked: true },
  { id: 3, name: "Background",     visible: true,  locked: false },
];

export default function StudioPage() {
  const [activeTool, setActiveTool] = useState("select");
  const [zoom, setZoom] = useState(100);
  const [layers, setLayers] = useState(LAYERS);
  const [activePanel, setActivePanel] = useState<"layers" | "ai">("layers");

  const toggleVisible = (id: number) =>
    setLayers(ls => ls.map(l => l.id === id ? { ...l, visible: !l.visible } : l));

  return (
    <div className="flex flex-col h-full bg-[#111009]">
      {/* ── Top bar ── */}
      <header className="h-[52px] flex items-center justify-between px-4 border-b border-[#2C271F] bg-[#0F0D0A] shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#F2EDE6] tracking-wide">Studio</span>
          <span className="font-mono text-[10px] text-[#6B5E50] border border-[#2C271F] px-2 py-0.5 rounded-[4px]">[ canvas: ready ]</span>
        </div>
        <div className="flex items-center gap-1">
          {[Undo2, Redo2].map((Icon, i) => (
            <button key={i} className="w-7 h-7 rounded-[6px] flex items-center justify-center text-[#6B5E50] hover:text-[#A89880] hover:bg-[#1A1712] transition-[background-color,color] duration-150 active:scale-[0.97]">
              <Icon style={{ width: 13, height: 13 }} />
            </button>
          ))}
          <div className="w-px h-4 bg-[#2C271F] mx-1" />
          <button className="flex items-center gap-1.5 h-7 px-3 rounded-[6px] text-[11px] font-medium text-[#6B5E50] hover:text-[#A89880] hover:bg-[#1A1712] border border-[#2C271F] transition-all duration-150 active:scale-[0.97]">
            <Download style={{ width: 11, height: 11 }} /> Export
          </button>
          <button className="flex items-center gap-1.5 h-7 px-3 rounded-[6px] text-[11px] font-medium bg-[#C8A882] text-[#111009] hover:bg-[#BFA070] transition-[background-color,transform] duration-150 active:scale-[0.97] ml-1">
            <Share2 style={{ width: 11, height: 11 }} /> Share
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left tool palette ── */}
        <div className="w-11 bg-[#0F0D0A] border-r border-[#2C271F] flex flex-col items-center py-3 gap-1 shrink-0">
          {TOOLS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              title={label}
              onClick={() => setActiveTool(id)}
              className={cn(
                "w-8 h-8 rounded-[8px] flex items-center justify-center transition-[background-color,color,box-shadow] duration-150 active:scale-[0.95]",
                activeTool === id
                  ? "bg-[#C8A882]/15 text-[#C8A882] shadow-[0_0_0_1px_rgba(200,168,130,0.3)]"
                  : "text-[#6B5E50] hover:text-[#A89880] hover:bg-[#1A1712]"
              )}
            >
              <Icon style={{ width: 14, height: 14 }} />
            </button>
          ))}
        </div>

        {/* ── Canvas ── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#111009] dot-grid">
          {/* Canvas center */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div
              className="relative bg-[#1E1B15] rounded-[4px] shadow-[0_32px_80px_rgba(0,0,0,0.6)] flex items-center justify-center"
              style={{ width: "560px", height: "420px", border: "1px solid #3A3328" }}
            >
              {/* Grid lines */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: "linear-gradient(#3A3328 1px, transparent 1px), linear-gradient(90deg, #3A3328 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }} />
              {/* Center cross */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                <div className="absolute w-full h-px bg-[#C8A882]" />
                <div className="absolute h-full w-px bg-[#C8A882]" />
              </div>
              {/* Empty state */}
              <div className="relative z-10 text-center">
                <div className="w-12 h-12 rounded-[14px] bg-[#2C271F] border border-[#3A3328] flex items-center justify-center mx-auto mb-3">
                  <Plus style={{ width: 20, height: 20, color: "#6B5E50" }} />
                </div>
                <p className="text-[13px] text-[#6B5E50] mb-3">Start from scratch or choose a template</p>
                <button className="flex items-center gap-2 h-7 px-4 rounded-[6px] text-[11px] font-medium bg-[#C8A882] text-[#111009] hover:bg-[#BFA070] transition-[background-color,transform] duration-150 active:scale-[0.97] mx-auto">
                  Browse Templates
                </button>
              </div>
            </div>
          </div>

          {/* ── Zoom bar ── */}
          <div className="h-10 border-t border-[#2C271F] bg-[#0F0D0A] flex items-center justify-between px-4 shrink-0">
            <div className="font-mono text-[10px] text-[#6B5E50]">1080 × 1080px · RGB</div>
            <div className="flex items-center gap-1">
              <button onClick={() => setZoom(z => Math.max(25, z - 25))} className="w-6 h-6 rounded-[4px] flex items-center justify-center text-[#6B5E50] hover:text-[#A89880] hover:bg-[#1A1712] transition-all duration-100 active:scale-[0.95]">
                <Minus style={{ width: 11, height: 11 }} />
              </button>
              <span className="font-mono text-[11px] text-[#A89880] w-12 text-center">{zoom}%</span>
              <button onClick={() => setZoom(z => Math.min(400, z + 25))} className="w-6 h-6 rounded-[4px] flex items-center justify-center text-[#6B5E50] hover:text-[#A89880] hover:bg-[#1A1712] transition-all duration-100 active:scale-[0.95]">
                <Plus style={{ width: 11, height: 11 }} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="w-60 bg-[#0F0D0A] border-l border-[#2C271F] flex flex-col shrink-0 overflow-hidden">
          {/* Panel tabs */}
          <div className="flex border-b border-[#2C271F]">
            {(["layers", "ai"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setActivePanel(p)}
                className={cn(
                  "flex-1 h-9 text-[11px] font-medium capitalize flex items-center justify-center gap-1.5 transition-[color,background-color] duration-150",
                  activePanel === p
                    ? "text-[#F2EDE6] bg-[#1A1712] border-b-2 border-b-[#C8A882]"
                    : "text-[#6B5E50] hover:text-[#A89880]"
                )}
              >
                {p === "layers" ? <Layers style={{ width: 11, height: 11 }} /> : <Wand2 style={{ width: 11, height: 11 }} />}
                {p === "layers" ? "Layers" : "AI Tools"}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {activePanel === "layers" ? (
              layers.map((layer) => (
                <div key={layer.id} className="flex items-center gap-2 px-2 py-2 rounded-[8px] hover:bg-[#1A1712] transition-[background-color] duration-100 group cursor-pointer">
                  <button onClick={() => toggleVisible(layer.id)} className="text-[#6B5E50] hover:text-[#A89880] transition-colors duration-100">
                    {layer.visible ? <Eye style={{ width: 12, height: 12 }} /> : <EyeOff style={{ width: 12, height: 12 }} />}
                  </button>
                  <span className="flex-1 text-[12px] text-[#A89880] truncate">{layer.name}</span>
                  {layer.locked && <Lock style={{ width: 10, height: 10, color: "#6B5E50" }} />}
                </div>
              ))
            ) : (
              AI_TOOLS.map(({ label, desc, icon: Icon, color }) => (
                <button key={label} className="w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-[10px] hover:bg-[#1A1712] border border-transparent hover:border-[#2C271F] transition-all duration-150 active:scale-[0.98] group">
                  <div className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: color + "18", border: `1px solid ${color}25` }}>
                    <Icon style={{ width: 13, height: 13, color }} />
                  </div>
                  <div>
                    <p className="text-[12px] font-medium text-[#F2EDE6]">{label}</p>
                    <p className="text-[10px] text-[#6B5E50] mt-0.5">{desc}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Template gallery ── */}
      <div className="border-t border-[#2C271F] bg-[#0F0D0A] px-4 py-3 shrink-0">
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          <span className="font-mono text-[10px] text-[#6B5E50] shrink-0">templates:</span>
          {TEMPLATES.map((t) => (
            <div key={t.title} className="flex items-center gap-2 shrink-0 cursor-pointer group">
              <div className={cn("w-20 h-12 rounded-[8px] bg-gradient-to-br border border-[#2C271F] group-hover:border-[#3A3328] transition-all duration-150", t.color)} />
              <div>
                <p className="text-[11px] text-[#A89880] group-hover:text-[#F2EDE6] transition-colors duration-150">{t.title}</p>
                <p className="font-mono text-[9px] text-[#6B5E50]">{t.size}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

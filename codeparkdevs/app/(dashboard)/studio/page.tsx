"use client";

import { useState } from "react";
import {
  Undo2, Redo2, MousePointer2, Type, Square, ImageIcon,
  Download, Share2, Eye, EyeOff, Lock, Plus, ZoomIn, ZoomOut,
  Wand2, Eraser, Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TOOLS = [
  { id: "select", icon: MousePointer2, label: "Select" },
  { id: "text", icon: Type, label: "Text" },
  { id: "shape", icon: Square, label: "Shape" },
  { id: "image", icon: ImageIcon, label: "Image" },
  { id: "erase", icon: Eraser, label: "Erase" },
  { id: "palette", icon: Palette, label: "Palette" },
];

const AI_TOOLS = [
  { label: "Remove Background", desc: "Clean cutout in seconds" },
  { label: "Upscale 4×", desc: "Enhance resolution with AI" },
  { label: "Style Transfer", desc: "Apply artistic styles" },
  { label: "Magic Erase", desc: "Remove unwanted objects" },
  { label: "Colorize", desc: "Add color to B&W images" },
  { label: "Extend Canvas", desc: "Expand image boundaries" },
];

const TEMPLATES = [
  { title: "Summer Launch", type: "Social Post", gradient: "from-[#C8A882]/30 to-[#B5704F]/20" },
  { title: "Header Banner", type: "Banner", gradient: "from-[#8A9E8C]/30 to-[#C8A882]/20" },
  { title: "Monogram Mark", type: "Logo", gradient: "from-[#B5704F]/30 to-[#C8A882]/20" },
  { title: "Deck Starter", type: "Presentation", gradient: "from-[#C8A882]/20 to-[#8A9E8C]/30" },
];

const INITIAL_LAYERS = [
  { id: 1, name: "Text Layer", visible: true, locked: false },
  { id: 2, name: "Shape", visible: true, locked: false },
  { id: 3, name: "Background", visible: true, locked: true },
];

export default function StudioPage() {
  const [selectedTool, setSelectedTool] = useState("select");
  const [zoom, setZoom] = useState(100);
  const [layers, setLayers] = useState(INITIAL_LAYERS);

  const toggleVisibility = (id: number) =>
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)));

  return (
    <div className="flex flex-col h-full bg-[#111009]">
      {/* Header */}
      <header className="h-12 flex items-center justify-between px-4 border-b border-[#2C271F] shrink-0 gap-4 bg-[#1A1712]">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-[#F2EDE6]" style={{ fontFamily: "var(--font-dm-serif)" }}>
            Studio
          </span>
          <span className="text-[10px] text-[#6B5E50]" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
            [ canvas: ready ]
          </span>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1">
          {[Undo2, Redo2].map((Icon, i) => (
            <button
              key={i}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B5E50] hover:text-[#F2EDE6] hover:bg-[#221E18] transition-[background-color,color] duration-150 active:scale-[0.97]"
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
          <div className="h-4 w-px bg-[#2C271F] mx-1" />
          {TOOLS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setSelectedTool(id)}
              title={label}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                "transition-[background-color,color] duration-150 active:scale-[0.97]",
                selectedTool === id
                  ? "bg-[#C8A882]/15 text-[#C8A882]"
                  : "text-[#6B5E50] hover:text-[#F2EDE6] hover:bg-[#221E18]"
              )}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
          <div className="h-4 w-px bg-[#2C271F] mx-1" />
          {[Download, Share2].map((Icon, i) => (
            <button
              key={i}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B5E50] hover:text-[#F2EDE6] hover:bg-[#221E18] transition-[background-color,color] duration-150 active:scale-[0.97]"
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        <button className="flex items-center gap-2 h-8 px-4 rounded-full text-sm font-semibold bg-[#C8A882] text-[#111009] hover:bg-[#D4B896] transition-[background-color,transform] duration-150 active:scale-[0.97]">
          <Plus className="w-3.5 h-3.5" />
          New Canvas
        </button>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Canvas area */}
        <div className="flex-1 bg-[#0D0B08] flex items-center justify-center overflow-hidden relative">
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, #F2EDE6 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Canvas surface */}
          <div
            className="relative bg-[#1A1712] border border-[#2C271F] rounded-[12px] flex flex-col items-center justify-center gap-5 shadow-2xl"
            style={{
              width: 520,
              height: 460,
              transform: `scale(${zoom / 100})`,
              transition: "transform 200ms cubic-bezier(0.23,1,0.32,1)",
            }}
          >
            <div className="w-16 h-16 rounded-2xl bg-[#221E18] border border-[#2C271F] flex items-center justify-center">
              <Plus className="w-8 h-8 text-[#6B5E50]" />
            </div>
            <div className="text-center">
              <p className="text-sm text-[#A89880]">Start creating or choose a template</p>
            </div>
            <button className="flex items-center gap-2 h-8 px-5 rounded-full text-xs font-medium bg-[#C8A882]/10 text-[#C8A882] border border-[#C8A882]/25 hover:bg-[#C8A882]/20 hover:border-[#C8A882]/40 transition-[background-color,border-color] duration-150 active:scale-[0.97]">
              Browse Templates
            </button>
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-[#1A1712] border border-[#2C271F] rounded-xl px-2 py-1">
            <button
              onClick={() => setZoom((z) => Math.max(25, z - 25))}
              className="w-7 h-7 flex items-center justify-center text-[#6B5E50] hover:text-[#F2EDE6] transition-[color] duration-150 active:scale-[0.97]"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-11 text-center text-xs font-medium text-[#A89880]" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
              {zoom}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(400, z + 25))}
              className="w-7 h-7 flex items-center justify-center text-[#6B5E50] hover:text-[#F2EDE6] transition-[color] duration-150 active:scale-[0.97]"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-64 bg-[#1A1712] border-l border-[#2C271F] flex flex-col overflow-y-auto">
          {/* Layers */}
          <div className="p-3 border-b border-[#2C271F]">
            <p className="text-[10px] font-semibold text-[#6B5E50] uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
              Layers
            </p>
            <div className="space-y-0.5">
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  className="flex items-center gap-2 px-2 h-8 rounded-lg hover:bg-[#221E18] text-xs text-[#A89880] cursor-pointer transition-[background-color] duration-150 group"
                >
                  <button
                    onClick={() => toggleVisibility(layer.id)}
                    className="text-[#6B5E50] hover:text-[#A89880] transition-[color] duration-150 shrink-0"
                  >
                    {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <span className="flex-1 truncate">{layer.name}</span>
                  {layer.locked && <Lock className="w-3 h-3 text-[#6B5E50] shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {/* AI Tools */}
          <div className="p-3">
            <p className="text-[10px] font-semibold text-[#6B5E50] uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
              <Wand2 className="w-3 h-3 text-[#C8A882]" />
              AI Tools
            </p>
            <div className="space-y-1.5">
              {AI_TOOLS.map(({ label, desc }) => (
                <button
                  key={label}
                  className="w-full text-left px-3 py-2 rounded-xl border border-[#2C271F] hover:border-[#3A3328] hover:bg-[#221E18] transition-[background-color,border-color] duration-150 active:scale-[0.97]"
                >
                  <p className="text-xs font-medium text-[#F2EDE6]">{label}</p>
                  <p className="text-[10px] text-[#6B5E50] mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Template gallery */}
      <div className="bg-[#1A1712] border-t border-[#2C271F] px-4 py-3 shrink-0">
        <p className="text-[10px] font-semibold text-[#6B5E50] uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
          Templates
        </p>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {TEMPLATES.map(({ title, type, gradient }) => (
            <div
              key={title}
              className="shrink-0 w-[120px] h-[80px] rounded-xl border border-[#2C271F] hover:border-[#3A3328] overflow-hidden relative cursor-pointer transition-[border-color] duration-150 active:scale-[0.97]"
            >
              <div className={cn("w-full h-full bg-gradient-to-br", gradient)} />
              <div className="absolute inset-0 flex flex-col items-start justify-end p-2 gap-1">
                <p className="text-[10px] font-medium text-[#F2EDE6] leading-none truncate w-full">{title}</p>
                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-[#C8A882]/20 text-[#C8A882]" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                  {type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  MousePointer2, Crop, Pen, Type, Shapes, Star, Sliders, Wand2,
  Undo2, Redo2, ZoomIn, ZoomOut, Download, Layers, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TOOLS = [
  { id: "select", icon: MousePointer2, label: "Select" },
  { id: "crop", icon: Crop, label: "Crop" },
  { id: "draw", icon: Pen, label: "Draw" },
  { id: "text", icon: Type, label: "Text" },
  { id: "shapes", icon: Shapes, label: "Shapes" },
  { id: "stickers", icon: Star, label: "Stickers" },
  { id: "adjust", icon: Sliders, label: "Adjust" },
  { id: "ai", icon: Wand2, label: "AI Tools" },
];

const LAYERS = [
  { id: 1, name: "Background", visible: true, locked: false },
  { id: 2, name: "Logo", visible: true, locked: false },
  { id: 3, name: "Text — Headline", visible: true, locked: false },
];

const AI_TOOLS = [
  { label: "Remove Background", color: "#7C3AED" },
  { label: "Enhance Face", color: "#EC4899" },
  { label: "AI Fill", color: "#00FF87" },
  { label: "Object Remove", color: "#F59E0B" },
  { label: "Style Transfer", color: "#3B82F6" },
  { label: "Upscale 4×", color: "#00FF87" },
];

export default function StudioPage() {
  const [activeTool, setActiveTool] = useState("select");
  const [zoom, setZoom] = useState(100);

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <header className="h-12 flex items-center justify-between px-4 border-b border-[#1E1E1E] shrink-0 gap-4">
        <input
          defaultValue="Untitled Design"
          className="bg-transparent text-sm font-medium text-white focus:outline-none border-b border-transparent focus:border-[#00FF87] pb-0.5 transition-colors duration-150 w-40"
        />
        <div className="flex items-center gap-1">
          {[Undo2, Redo2].map((Icon, i) => (
            <button
              key={i}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#666] hover:text-white hover:bg-[#1A1A1A] transition-[background-color,color] duration-150 active:scale-[0.97]"
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
          <div className="h-4 w-px bg-[#2A2A2A] mx-1" />
          <div className="flex items-center gap-1 text-xs text-[#666]">
            <button onClick={() => setZoom(z => Math.max(25, z - 25))} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white transition-colors duration-150 active:scale-[0.97]">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-12 text-center font-medium text-white">{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(400, z + 25))} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white transition-colors duration-150 active:scale-[0.97]">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <button className="flex items-center gap-2 h-8 px-4 rounded-full text-sm font-semibold bg-[#00FF87] text-black hover:bg-[#00E077] transition-[background-color,transform] duration-150 active:scale-[0.97]">
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Left tool bar */}
        <div className="w-12 bg-[#0D0D0D] border-r border-[#1E1E1E] flex flex-col items-center py-3 gap-1">
          {TOOLS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTool(id)}
              title={label}
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center",
                "transition-[background-color,color] duration-150 active:scale-[0.97]",
                activeTool === id
                  ? "bg-[#00FF87]/15 text-[#00FF87]"
                  : "text-[#666] hover:text-white hover:bg-[#1A1A1A]"
              )}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-[#080808] flex items-center justify-center overflow-hidden relative">
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Canvas surface */}
          <div
            className="relative bg-white rounded-xl shadow-2xl overflow-hidden"
            style={{ width: 540, height: 540, transform: `scale(${zoom / 100})`, transition: "transform 200ms cubic-bezier(0.23,1,0.32,1)" }}
          >
            {/* Mock design content */}
            <div className="w-full h-full bg-gradient-to-br from-[#7C3AED] via-[#EC4899] to-[#F59E0B] flex flex-col items-center justify-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Star className="w-10 h-10 text-white" fill="white" />
              </div>
              <div className="text-white text-center">
                <div className="text-2xl font-black tracking-tight">Brand Name</div>
                <div className="text-sm opacity-70 mt-1">Est. 2025</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-56 bg-[#0D0D0D] border-l border-[#1E1E1E] flex flex-col overflow-y-auto">
          {/* Layers */}
          <div className="p-3 border-b border-[#1E1E1E]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#666]" /> Layers
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#666]" />
            </div>
            <div className="space-y-0.5">
              {LAYERS.map((layer) => (
                <div
                  key={layer.id}
                  className="flex items-center gap-2 px-2 h-8 rounded-lg hover:bg-[#1A1A1A] text-xs text-[#AAAAAA] cursor-pointer transition-colors duration-150"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3A3A3A]" />
                  {layer.name}
                </div>
              ))}
            </div>
          </div>

          {/* AI Tools */}
          <div className="p-3">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5 mb-2">
              <Wand2 className="w-3.5 h-3.5 text-[#7C3AED]" /> AI Tools
            </span>
            <div className="space-y-1.5">
              {AI_TOOLS.map(({ label, color }) => (
                <button
                  key={label}
                  className="w-full text-left px-3 h-8 rounded-xl text-xs font-medium text-[#AAAAAA] hover:text-white hover:bg-[#1A1A1A] border border-[#1E1E1E] hover:border-[#2A2A2A] transition-[background-color,border-color,color] duration-150 active:scale-[0.98]"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

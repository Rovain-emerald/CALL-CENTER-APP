"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Search, Send, Mic, Paperclip, Pin, MessageSquare, Globe, Sparkles, BookOpen, Code2, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const MODES = [
  { id: "chat",     label: "Chat",     icon: MessageSquare },
  { id: "think",    label: "Think",    icon: Brain },
  { id: "search",   label: "Search",   icon: Globe },
  { id: "create",   label: "Create",   icon: Sparkles },
  { id: "research", label: "Research", icon: BookOpen },
  { id: "code",     label: "Code",     icon: Code2 },
];

const HISTORY = [
  { id: 1, title: "Brand identity direction", time: "2h ago", pinned: true },
  { id: 2, title: "API architecture review",  time: "Yesterday" },
  { id: 3, title: "Content calendar Q3",      time: "2d ago" },
];

const INITIAL_MESSAGES = [
  { id: 1, role: "user",      content: "Can you review our brand identity approach? We're going for an artisan, editorial aesthetic." },
  { id: 2, role: "assistant", content: "Your editorial serif direction is compelling — DM Serif Display with JetBrains Mono creates a rare tension between craft and code that few tech brands achieve.\n\nThe key is restraint: let the typography carry the weight. Warm off-whites against Carbon Ink with Raw Clay (#C8A882) as your sole accent will feel premium without shouting.\n\nUse the { } bracket as a recurring micro-motif — it bridges your dev DNA with the artisan narrative beautifully." },
  { id: 3, role: "user",      content: "That's exactly the direction. What about the agents dashboard?" },
];

function Bubble({ role, content }: { role: string; content: string }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div className={cn("w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[11px] font-medium border", isUser ? "border-[#C8A882]/30 bg-[#221E18] text-[#C8A882]" : "border-[#2C271F] bg-[#1A1712] text-[#8A9E8C]")}>
        {isUser ? "A" : "C"}
      </div>
      <div className={cn("max-w-[72%] px-4 py-3 rounded-[12px] text-[13px] leading-relaxed whitespace-pre-line", isUser ? "bg-[#C8A882]/10 text-[#F2EDE6] border border-[#C8A882]/18 rounded-tr-[4px]" : "bg-[#1A1712] text-[#A89880] border border-[#2C271F] rounded-tl-[4px]")}>
        {content}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [mode, setMode] = useState("chat");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev,
      { id: prev.length + 1, role: "user", content: input },
      { id: prev.length + 2, role: "assistant", content: "Artisan labels like `[ status: active ]` and monospace run counts give the agent dashboard that crafted-data aesthetic. Sage Smoke (#8A9E8C) pulse dots for live agents feel premium without the neon anxiety of typical AI dashboards." },
    ]);
    setInput("");
  };

  return (
    <div className="flex h-full">
      <aside className="hidden md:flex w-[210px] flex-col border-r border-[#2C271F] bg-[#0E0C08]">
        <div className="p-3 border-b border-[#2C271F]">
          <button className="flex items-center gap-2 w-full h-9 px-3 rounded-[8px] text-[12px] font-medium border border-[#2C271F] text-[#A89880] hover:border-[#3A3328] hover:text-[#F2EDE6] transition-[border-color,color] duration-150 active:scale-[0.98]">
            <Plus style={{ width: 13, height: 13 }} /> New Chat
          </button>
        </div>
        <div className="p-2 border-b border-[#2C271F]">
          <div className="flex items-center gap-2 bg-[#1A1712] border border-[#2C271F] rounded-[8px] px-3 h-8">
            <Search style={{ width: 11, height: 11 }} className="text-[#6B5E50] shrink-0" />
            <input placeholder="Search…" className="flex-1 bg-transparent text-[11px] text-[#F2EDE6] placeholder:text-[#6B5E50] focus:outline-none" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <p className="px-2 py-1.5 font-mono text-[9px] text-[#6B5E50] tracking-widest uppercase">Today</p>
          {HISTORY.map((h) => (
            <button key={h.id} className={cn("w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-[8px] text-[12px] transition-[background-color,color] duration-150", h.id === 1 ? "bg-[#221E18] text-[#F2EDE6]" : "text-[#6B5E50] hover:bg-[#16130E] hover:text-[#A89880]")}>
              {h.pinned && <Pin style={{ width: 9, height: 9 }} className="text-[#C8A882] shrink-0" />}
              <span className="truncate">{h.title}</span>
            </button>
          ))}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[60px] flex items-center justify-between px-5 border-b border-[#2C271F] shrink-0">
          <div className="flex gap-1">
            {MODES.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setMode(id)} className={cn("flex items-center gap-1.5 h-7 px-2.5 rounded-full text-[11px] font-medium tracking-wide transition-[background-color,color] duration-150 active:scale-[0.97]", mode === id ? "bg-[#C8A882]/12 text-[#C8A882] border border-[#C8A882]/22" : "text-[#6B5E50] hover:text-[#A89880]")}>
                <Icon style={{ width: 11, height: 11 }} />{label}
              </button>
            ))}
          </div>
          <span className="artisan-label">[ mode: {mode} ]</span>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {messages.map((m) => <Bubble key={m.id} role={m.role} content={m.content} />)}
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[11px] border border-[#2C271F] bg-[#1A1712] text-[#8A9E8C]">C</div>
            <div className="flex items-center gap-1 px-4 py-3 bg-[#1A1712] border border-[#2C271F] rounded-[12px] rounded-tl-[4px]">
              {[0,1,2].map((i) => <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#6B5E50] animate-bounce" style={{ animationDelay: `${i*150}ms`, animationDuration: "900ms" }} />)}
            </div>
          </div>
          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-[#2C271F]">
          <div className="flex items-end gap-2 bg-[#1A1712] border border-[#2C271F] rounded-[12px] px-4 py-3 focus-within:border-[#C8A882]/35 transition-[border-color] duration-150">
            <button className="text-[#6B5E50] hover:text-[#A89880] transition-colors duration-150 mb-0.5 active:scale-[0.95]"><Paperclip style={{ width: 14, height: 14 }} /></button>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }}} placeholder="Message Claude…" rows={1} className="flex-1 bg-transparent text-[13px] text-[#F2EDE6] placeholder:text-[#6B5E50]/60 resize-none focus:outline-none leading-relaxed" style={{ maxHeight: 120 }} />
            <div className="flex items-center gap-1 mb-0.5">
              <button className="text-[#6B5E50] hover:text-[#A89880] transition-colors duration-150 active:scale-[0.95]"><Mic style={{ width: 14, height: 14 }} /></button>
              <button onClick={send} disabled={!input.trim()} className={cn("w-7 h-7 rounded-[6px] flex items-center justify-center bg-[#C8A882] text-[#111009] hover:bg-[#BFA070] transition-[background-color,transform] duration-150 active:scale-[0.95]", !input.trim() && "opacity-30 pointer-events-none")}><Send style={{ width: 12, height: 12 }} /></button>
            </div>
          </div>
          <p className="text-center font-mono text-[10px] text-[#6B5E50] mt-2">Codeparkdevs AI · crafted responses · use with judgement</p>
        </div>
      </div>
    </div>
  );
}

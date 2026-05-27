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

const SUGGESTION_CHIPS = [
  "Write a blog post",
  "Create social captions",
  "Explain a concept",
  "Review my code",
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: "user",
    content: "Can you review our brand identity approach? We're going for an artisan, editorial aesthetic.",
    time: "2:14 PM",
  },
  {
    id: 2,
    role: "assistant",
    content: "Your editorial serif direction is compelling — DM Serif Display with JetBrains Mono creates a rare tension between craft and code that few tech brands achieve.\n\nThe key is restraint: let the typography carry the weight. Warm off-whites against Carbon Ink with Raw Clay (#C8A882) as your sole accent will feel premium without shouting.\n\nUse the { } bracket as a recurring micro-motif — it bridges your dev DNA with the artisan narrative beautifully.",
    time: "2:14 PM",
  },
  {
    id: 3,
    role: "user",
    content: "That's exactly the direction. What about the agents dashboard?",
    time: "2:16 PM",
  },
];

function AssistantAvatar() {
  return (
    <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center border border-[#2C271F] bg-[#1A1712] text-[10px] font-medium text-[#8A9E8C] select-none"
      style={{ fontFamily: "var(--font-dm-serif)" }}
    >
      CPD
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center border border-[#C8A882]/30 bg-[#221E18] text-[10px] font-medium text-[#C8A882] select-none">
      A
    </div>
  );
}

function StreamingDots() {
  const [dots, setDots] = useState(".");
  useEffect(() => {
    const id = setInterval(() => {
      setDots((d) => (d === "..." ? "." : d + "."));
    }, 400);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex items-center gap-3">
      <AssistantAvatar />
      <div className="flex items-center gap-1 px-4 py-3 bg-[#0F0D0A] border border-[#2C271F] rounded-[14px] rounded-tl-[4px]">
        <span
          className="text-[13px] text-[#6B5E50] tracking-widest"
          style={{ fontFamily: "var(--font-jetbrains-mono)", minWidth: 24 }}
        >
          {dots}
        </span>
      </div>
    </div>
  );
}

interface Message {
  id: number;
  role: string;
  content: string;
  time: string;
}

function Bubble({ role, content, time }: { role: string; content: string; time: string }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      {isUser ? <UserAvatar /> : <AssistantAvatar />}
      <div className="flex flex-col gap-1" style={{ maxWidth: "72%" }}>
        <div
          className={cn(
            "px-4 py-3 text-[13px] leading-relaxed whitespace-pre-line",
            isUser
              ? "bg-[#C8A882]/10 text-[#F2EDE6] border border-[#C8A882]/15 rounded-[14px] rounded-tr-[4px]"
              : "bg-[#0F0D0A] text-[#A89880] border border-[#2C271F] rounded-[14px] rounded-tl-[4px]"
          )}
        >
          {content}
        </div>
        <span
          className={cn(
            "text-[10px] text-[#4A4135] px-1",
            isUser ? "text-right self-end" : "text-left self-start"
          )}
          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
        >
          {time}
        </span>
      </div>
    </div>
  );
}

function EmptyState({ onChipClick }: { onChipClick: (text: string) => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-12">
      {/* Monogram */}
      <div className="flex flex-col items-center gap-3">
        <span
          className="text-[52px] leading-none text-[#2C271F] select-none"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          CPD{"}"}
        </span>
        <p
          className="text-[18px] text-[#6B5E50]"
          style={{ fontFamily: "var(--font-dm-serif)", fontStyle: "italic" }}
        >
          How can I help you today?
        </p>
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#2C271F] to-transparent" />
      </div>

      {/* Suggestion chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-[440px]">
        {SUGGESTION_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => onChipClick(chip)}
            className="h-8 px-4 rounded-full text-[12px] text-[#A89880] border border-[#2C271F] bg-[#1A1712] hover:border-[#3A3328] hover:text-[#F2EDE6] hover:shadow-[0_4px_16px_rgba(200,168,130,0.08)] transition-[border-color,color,box-shadow] duration-200 active:scale-[0.97]"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [mode, setMode] = useState("chat");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  const send = () => {
    if (!input.trim() || isStreaming) return;
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    setTimeout(() => {
      const assistantMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Artisan labels like `[ status: active ]` and monospace run counts give the agent dashboard that crafted-data aesthetic. Sage Smoke (#8A9E8C) pulse dots for live agents feel premium without the neon anxiety of typical AI dashboards.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsStreaming(false);
    }, 1800);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full">

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="hidden md:flex w-[210px] flex-col border-r border-[#2C271F] bg-[#0E0C08] shrink-0">
        <div className="p-3 border-b border-[#2C271F]">
          <button className="flex items-center gap-2 w-full h-9 px-3 rounded-[8px] text-[12px] font-medium border border-[#2C271F] text-[#A89880] hover:border-[#3A3328] hover:text-[#F2EDE6] hover:shadow-[0_2px_12px_rgba(200,168,130,0.06)] transition-[border-color,color,box-shadow] duration-150 active:scale-[0.98]">
            <Plus style={{ width: 13, height: 13 }} />
            New Chat
          </button>
        </div>

        {/* Search */}
        <div className="p-2 border-b border-[#2C271F]">
          <div className="flex items-center gap-2 bg-[#1A1712] border border-[#2C271F] rounded-[8px] px-3 h-8 focus-within:border-[#3A3328] transition-[border-color] duration-150">
            <Search style={{ width: 11, height: 11 }} className="text-[#6B5E50] shrink-0" />
            <input
              placeholder="Search…"
              className="flex-1 bg-transparent text-[11px] text-[#F2EDE6] placeholder:text-[#4A4135] focus:outline-none"
            />
          </div>
        </div>

        {/* History */}
        <div className="flex-1 overflow-y-auto p-2">
          <p
            className="px-2 py-1.5 text-[9px] text-[#4A4135] tracking-widest uppercase"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          >
            Today
          </p>
          {HISTORY.map((h) => (
            <button
              key={h.id}
              className={cn(
                "w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-[8px] text-[12px] transition-[background-color,color] duration-150",
                h.id === 1
                  ? "bg-[#1A1712] text-[#F2EDE6]"
                  : "text-[#6B5E50] hover:bg-[#16130E] hover:text-[#A89880]"
              )}
            >
              {h.pinned && (
                <Pin style={{ width: 9, height: 9 }} className="text-[#C8A882] shrink-0" />
              )}
              <span className="truncate">{h.title}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* ── Main chat area ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="h-[60px] flex items-center justify-between px-5 border-b border-[#2C271F] shrink-0 bg-[#111009]/80 backdrop-blur-sm">
          {/* Mode tabs */}
          <div className="flex gap-0.5">
            {MODES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                className={cn(
                  "flex items-center gap-1.5 h-7 px-2.5 rounded-full text-[11px] font-medium tracking-wide transition-[background-color,color,border-color] duration-150 active:scale-[0.97]",
                  mode === id
                    ? "bg-[#C8A882]/12 text-[#C8A882] border border-[#C8A882]/22"
                    : "text-[#6B5E50] hover:text-[#A89880] border border-transparent"
                )}
              >
                <Icon style={{ width: 11, height: 11 }} />
                {label}
              </button>
            ))}
          </div>

          {/* Right: mode label + model badge */}
          <div className="flex items-center gap-3">
            <span
              className="hidden sm:inline text-[10px] text-[#4A4135]"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              [ mode: {mode} ]
            </span>
            {/* Model badge */}
            <div className="flex items-center gap-1.5 h-6 px-2.5 rounded-full border border-[#2C271F] bg-[#0F0D0A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8A9E8C]" />
              <span
                className="text-[10px] text-[#6B5E50]"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                GPT-4o
              </span>
            </div>
          </div>
        </header>

        {/* Messages or empty state */}
        {isEmpty ? (
          <EmptyState onChipClick={(text) => setInput(text)} />
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            {messages.map((m) => (
              <Bubble key={m.id} role={m.role} content={m.content} time={m.time} />
            ))}
            {isStreaming && <StreamingDots />}
            <div ref={bottomRef} />
          </div>
        )}

        {/* ── Input area ──────────────────────────────────────────────── */}
        <div className="shrink-0 bg-[#0F0D0A] border-t border-[#2C271F] px-4 pt-3 pb-4">

          {/* Suggestion pills — only when empty and no input */}
          {isEmpty && !input && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
              {SUGGESTION_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => setInput(chip)}
                  className="shrink-0 h-7 px-3 rounded-full text-[11px] text-[#A89880] border border-[#2C271F] bg-[#1A1712] hover:border-[#3A3328] hover:text-[#F2EDE6] transition-[border-color,color] duration-150 whitespace-nowrap"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input field */}
          <div
            className={cn(
              "flex items-end gap-2 border rounded-[12px] px-4 py-3 transition-[border-color,box-shadow] duration-200",
              "bg-[#1A1712] border-[#2C271F]",
              "focus-within:border-[#C8A882]/40 focus-within:shadow-[0_0_0_3px_rgba(200,168,130,0.08)]"
            )}
          >
            <button className="text-[#6B5E50] hover:text-[#A89880] transition-colors duration-150 mb-0.5 active:scale-[0.95] shrink-0">
              <Paperclip style={{ width: 14, height: 14 }} />
            </button>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Message Claude…"
              rows={1}
              className="flex-1 bg-transparent text-[13px] text-[#F2EDE6] placeholder:text-[#4A4135] resize-none focus:outline-none leading-relaxed"
              style={{ maxHeight: 120, overflow: "hidden" }}
            />
            <div className="flex items-center gap-1 mb-0.5 shrink-0">
              <button className="text-[#6B5E50] hover:text-[#A89880] transition-colors duration-150 active:scale-[0.95]">
                <Mic style={{ width: 14, height: 14 }} />
              </button>
              <button
                onClick={send}
                disabled={!input.trim() || isStreaming}
                className={cn(
                  "w-7 h-7 rounded-[6px] flex items-center justify-center transition-[background-color,box-shadow,transform] duration-150 active:scale-[0.95]",
                  input.trim() && !isStreaming
                    ? "bg-[#C8A882] text-[#111009] hover:bg-[#BFA070] hover:shadow-[0_0_12px_rgba(200,168,130,0.3)]"
                    : "bg-[#1A1712] border border-[#2C271F] text-[#4A4135] pointer-events-none"
                )}
              >
                <Send style={{ width: 12, height: 12 }} />
              </button>
            </div>
          </div>

          {/* Keyboard hint + footer */}
          <div className="flex items-center justify-between mt-2 px-1">
            <span
              className="text-[10px] text-[#3A3328]"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              ⌘↵ or Ctrl+Enter to send · Shift+Enter for newline
            </span>
            <span
              className="text-[10px] text-[#3A3328]"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              CPD{"}"} · crafted
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

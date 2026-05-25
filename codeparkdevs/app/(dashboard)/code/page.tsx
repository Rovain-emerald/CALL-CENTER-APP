"use client";

import { useState } from "react";
import { Play, Terminal, ChevronRight, ChevronDown, File, Folder, SendHorizontal, X, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const FILE_TREE = [
  { type: "folder", name: "src", depth: 0, open: true },
  { type: "file", name: "index.ts", depth: 1, active: true },
  { type: "file", name: "app.ts", depth: 1, active: false },
  { type: "folder", name: "utils", depth: 1, open: false },
  { type: "file", name: "helpers.ts", depth: 2, active: false },
  { type: "folder", name: "components", depth: 0, open: false },
  { type: "file", name: "Button.tsx", depth: 1, active: false },
];

const MOCK_CODE = `import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(json());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/agents', require('./routes/agents'));

app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
});

export default app;`;

const OPEN_TABS = ["index.ts", "app.ts"];

const AI_MESSAGES = [
  {
    role: "assistant",
    content: "Hi! I'm Claude, your AI coding assistant. I can help you write, debug, and improve your code. What would you like to work on?",
  },
];

const TERMINAL_OUTPUT = [
  "$ npm run dev",
  "> ts-node-dev --respawn src/index.ts",
  "[INFO] Server starting...",
  "🚀 Server running on port 3001",
  "[INFO] Connected to database",
  "",
  "$ _",
];

export default function CodePage() {
  const [activeTab, setActiveTab] = useState("index.ts");
  const [showTerminal, setShowTerminal] = useState(true);
  const [aiInput, setAiInput] = useState("");
  const [messages, setMessages] = useState(AI_MESSAGES);

  const sendMessage = () => {
    if (!aiInput.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: aiInput },
      { role: "assistant", content: "I can help with that! Let me analyze your code... The structure looks good. Consider adding error handling to the route handlers using a middleware wrapper." },
    ]);
    setAiInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <header className="h-12 flex items-center px-4 border-b border-[#1E1E1E] shrink-0 gap-3">
        <span className="text-sm font-semibold text-white">Code</span>
        <div className="flex gap-0.5 ml-2">
          {OPEN_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex items-center gap-1.5 h-7 px-3 rounded-t-lg text-xs border-t border-x",
                "transition-[background-color,color] duration-150",
                activeTab === tab
                  ? "bg-[#111111] text-white border-[#2A2A2A] border-b-[#111111]"
                  : "bg-transparent text-[#555] border-transparent hover:text-white"
              )}
            >
              <File className="w-3 h-3" />
              {tab}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs text-[#666] hover:text-white hover:bg-[#1A1A1A] border border-[#1E1E1E] transition-[background-color,color] duration-150 active:scale-[0.97]"
          >
            <Terminal className="w-3.5 h-3.5" />
            Terminal
          </button>
          <button className="flex items-center gap-1.5 h-8 px-4 rounded-full text-xs font-semibold bg-[#00FF87] text-black hover:bg-[#00E077] transition-[background-color,transform] duration-150 active:scale-[0.97]">
            <Play className="w-3 h-3" fill="black" />
            Run
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* File tree */}
        <div className="w-44 bg-[#0D0D0D] border-r border-[#1E1E1E] overflow-y-auto py-2">
          {FILE_TREE.map((item, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-1.5 h-7 text-xs cursor-pointer",
                "transition-[background-color,color] duration-150",
                item.type === "file" && item.active
                  ? "bg-[#1A1A1A] text-white"
                  : "text-[#666] hover:text-white hover:bg-[#141414]"
              )}
              style={{ paddingLeft: `${8 + item.depth * 12}px` }}
            >
              {item.type === "folder" ? (
                <>
                  {item.open ? <ChevronDown className="w-3 h-3 shrink-0" /> : <ChevronRight className="w-3 h-3 shrink-0" />}
                  <Folder className="w-3.5 h-3.5 shrink-0 text-[#F59E0B]" />
                </>
              ) : (
                <>
                  <span className="w-3 shrink-0" />
                  <File className="w-3.5 h-3.5 shrink-0 text-[#3B82F6]" />
                </>
              )}
              <span>{item.name}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-1 flex-col min-w-0">
          {/* Code editor */}
          <div className="flex-1 overflow-auto">
            <pre className="text-xs font-mono p-5 text-[#AAAAAA] leading-6 select-text">
              {MOCK_CODE.split("\n").map((line, i) => (
                <div key={i} className="flex hover:bg-[#111111] transition-colors duration-75">
                  <span className="w-8 shrink-0 text-[#333] text-right mr-4 select-none">{i + 1}</span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: line
                        .replace(/\b(import|export|const|let|var|function|return|require|from|default)\b/g, '<span style="color:#7C3AED">$1</span>')
                        .replace(/('[^']*'|`[^`]*`)/g, '<span style="color:#00FF87">$1</span>')
                        .replace(/\b(app|express|cors|json|PORT|process)\b/g, '<span style="color:#3B82F6">$1</span>')
                        .replace(/(\/\/.*)/g, '<span style="color:#444">$1</span>'),
                    }}
                  />
                </div>
              ))}
            </pre>
          </div>

          {/* Terminal */}
          {showTerminal && (
            <div className="h-36 border-t border-[#1E1E1E] bg-[#080808] overflow-auto">
              <div className="flex items-center justify-between px-3 h-7 border-b border-[#1E1E1E]">
                <span className="text-[10px] text-[#555] font-medium flex items-center gap-1.5">
                  <Terminal className="w-3 h-3" /> Terminal
                </span>
                <button onClick={() => setShowTerminal(false)} className="text-[#444] hover:text-white transition-colors duration-150">
                  <X className="w-3 h-3" />
                </button>
              </div>
              <pre className="p-3 text-[11px] font-mono leading-5">
                {TERMINAL_OUTPUT.map((line, i) => (
                  <div key={i} className={cn(
                    line.startsWith("$") ? "text-[#00FF87]" :
                    line.startsWith("[INFO]") ? "text-[#3B82F6]" :
                    line.startsWith("🚀") ? "text-[#F59E0B]" :
                    "text-[#AAAAAA]"
                  )}>
                    {line || " "}
                  </div>
                ))}
              </pre>
            </div>
          )}
        </div>

        {/* AI assistant */}
        <div className="w-64 border-l border-[#1E1E1E] bg-[#0D0D0D] flex flex-col">
          <div className="h-10 flex items-center px-3 border-b border-[#1E1E1E] gap-2">
            <Bot className="w-4 h-4 text-[#7C3AED]" />
            <span className="text-xs font-semibold text-white">AI Assistant</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={cn("text-xs leading-5", m.role === "user" ? "text-right" : "text-left")}>
                <span
                  className={cn(
                    "inline-block px-3 py-2 rounded-xl max-w-[90%] text-left",
                    m.role === "user"
                      ? "bg-[#7C3AED]/20 text-white"
                      : "bg-[#1A1A1A] text-[#AAAAAA]"
                  )}
                >
                  {m.content}
                </span>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-[#1E1E1E]">
            <div className="flex items-center gap-2 bg-[#111111] border border-[#2A2A2A] rounded-xl px-3 py-2">
              <input
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask Claude…"
                className="flex-1 bg-transparent text-xs text-white placeholder:text-[#444] focus:outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={!aiInput.trim()}
                className="text-[#444] hover:text-[#00FF87] transition-colors duration-150 disabled:opacity-30"
              >
                <SendHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

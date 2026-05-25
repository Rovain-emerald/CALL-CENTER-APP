"use client";

import { useState } from "react";
import { Plus, Play, Pause, Settings, Trash2, FileText, CheckCircle2, XCircle, Clock, Zap, Bot, TrendingUp, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const AGENTS = [
  {
    id: 1,
    name: "Customer Service Bot",
    type: "customer_service",
    status: "active" as const,
    description: "Handles inbound customer enquiries 24/7 via website chat",
    runs: 1234,
    lastRun: "2 min ago",
    success: 98.2,
    color: "#00FF87",
  },
  {
    id: 2,
    name: "Lead Research Agent",
    type: "lead_gen",
    status: "active" as const,
    description: "Finds businesses without websites that need automation services",
    runs: 456,
    lastRun: "4h ago",
    success: 94.1,
    color: "#7C3AED",
  },
  {
    id: 3,
    name: "Content Scheduler",
    type: "content",
    status: "paused" as const,
    description: "Auto-publishes social media content on schedule",
    runs: 89,
    lastRun: "1d ago",
    success: 91.0,
    color: "#F59E0B",
  },
];

const APPROVALS = [
  {
    id: 1,
    agent: "Lead Research Agent",
    type: "Send Email",
    preview: "To: info@plumbingpros.co.za — Hi, I noticed your business doesn't have a website…",
    time: "5 min ago",
  },
  {
    id: 2,
    agent: "Customer Service Bot",
    type: "Issue Refund",
    preview: "Customer #4821 — R450 refund for order #ORD-9921 (item not delivered)",
    time: "12 min ago",
  },
  {
    id: 3,
    agent: "Content Scheduler",
    type: "Publish Post",
    preview: "Instagram: \"Transform your business with AI — book a free demo today! 🚀\" + image",
    time: "1h ago",
  },
];

const RECENT_LOGS = [
  { agent: "Customer Service Bot", status: "completed", duration: "2.1s", tokens: 412, time: "2m ago" },
  { agent: "Lead Research Agent", status: "completed", duration: "18.4s", tokens: 3201, time: "4h ago" },
  { agent: "Customer Service Bot", status: "completed", duration: "1.8s", tokens: 389, time: "4h ago" },
  { agent: "Customer Service Bot", status: "failed", duration: "0.4s", tokens: 42, time: "6h ago" },
  { agent: "Lead Research Agent", status: "completed", duration: "22.1s", tokens: 4100, time: "8h ago" },
];

export default function AgentsPage() {
  const [approvals, setApprovals] = useState(APPROVALS);

  const dismiss = (id: number) => setApprovals((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="flex flex-col h-full">
      <header className="h-14 flex items-center justify-between px-5 border-b border-[#1E1E1E] shrink-0">
        <span className="text-sm font-semibold text-white">Agents</span>
        <button className="flex items-center gap-2 h-8 px-4 rounded-full text-xs font-semibold bg-[#00FF87] text-black hover:bg-[#00E077] transition-[background-color,transform] duration-150 active:scale-[0.97]">
          <Plus className="w-3.5 h-3.5" />
          New Agent
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-7">
        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total Agents", value: "3", icon: Bot, color: "#7C3AED" },
            { label: "Active", value: "2", icon: Play, color: "#00FF87" },
            { label: "Runs Today", value: "47", icon: TrendingUp, color: "#3B82F6" },
            { label: "Pending Approval", value: String(approvals.length), icon: AlertCircle, color: "#F59E0B" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#666]">{label}</span>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                  <Icon className="w-3 h-3" style={{ color }} />
                </div>
              </div>
              <p className="text-xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* Agent cards */}
        <section>
          <h3 className="text-xs font-semibold text-[#666] uppercase tracking-wider mb-3">Your Agents</h3>
          <div className="space-y-3">
            {AGENTS.map((agent) => (
              <div key={agent.id} className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {/* Status indicator */}
                    <div className="relative mt-0.5">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: agent.status === "active" ? "#00FF87" : "#F59E0B" }}
                      />
                      {agent.status === "active" && (
                        <div
                          className="absolute inset-0 rounded-full animate-ping opacity-40"
                          style={{ backgroundColor: "#00FF87" }}
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{agent.name}</p>
                      <p className="text-xs text-[#555] mt-0.5">{agent.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-[#AAAAAA]">{agent.runs.toLocaleString()} runs</span>
                        <span className="text-xs text-[#444]">·</span>
                        <span className="text-xs text-[#AAAAAA]">Last: {agent.lastRun}</span>
                        <span className="text-xs text-[#444]">·</span>
                        <span className="text-xs" style={{ color: agent.color }}>{agent.success}% success</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button className="w-8 h-8 rounded-xl flex items-center justify-center text-[#555] hover:text-white hover:bg-[#1A1A1A] transition-[background-color,color] duration-150 active:scale-[0.97]" title="Edit">
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-8 h-8 rounded-xl flex items-center justify-center text-[#555] hover:text-white hover:bg-[#1A1A1A] transition-[background-color,color] duration-150 active:scale-[0.97]" title="Logs">
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-8 h-8 rounded-xl flex items-center justify-center text-[#555] hover:text-white hover:bg-[#1A1A1A] transition-[background-color,color] duration-150 active:scale-[0.97]">
                      {agent.status === "active" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button className="w-8 h-8 rounded-xl flex items-center justify-center text-[#555] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-[background-color,color] duration-150 active:scale-[0.97]">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Approval inbox */}
        {approvals.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold text-[#666] uppercase tracking-wider mb-3 flex items-center gap-2">
              Approval Inbox
              <span className="bg-[#F59E0B]/20 text-[#F59E0B] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {approvals.length}
              </span>
            </h3>
            <div className="space-y-2">
              {approvals.map((a) => (
                <div key={a.id} className="bg-[#111111] border border-[#F59E0B]/20 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-[#F59E0B]">{a.type}</span>
                        <span className="text-xs text-[#444]">·</span>
                        <span className="text-xs text-[#555]">{a.agent}</span>
                        <span className="text-xs text-[#444]">·</span>
                        <span className="text-xs text-[#444]">{a.time}</span>
                      </div>
                      <p className="text-xs text-[#888] truncate">{a.preview}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => dismiss(a.id)}
                        className="flex items-center gap-1 h-7 px-3 rounded-full text-xs font-medium bg-[#00FF87]/15 text-[#00FF87] hover:bg-[#00FF87]/25 transition-[background-color] duration-150 active:scale-[0.97]"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Approve
                      </button>
                      <button
                        onClick={() => dismiss(a.id)}
                        className="flex items-center gap-1 h-7 px-3 rounded-full text-xs font-medium bg-[#EF4444]/15 text-[#EF4444] hover:bg-[#EF4444]/25 transition-[background-color] duration-150 active:scale-[0.97]"
                      >
                        <XCircle className="w-3 h-3" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent logs */}
        <section>
          <h3 className="text-xs font-semibold text-[#666] uppercase tracking-wider mb-3">Recent Logs</h3>
          <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1E1E1E]">
                  {["Agent", "Status", "Duration", "Tokens", "Time"].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 text-[#555] font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_LOGS.map((log, i) => (
                  <tr key={i} className="border-b border-[#1A1A1A] last:border-0 hover:bg-[#161616] transition-colors duration-75">
                    <td className="px-4 py-2.5 text-[#AAAAAA]">{log.agent}</td>
                    <td className="px-4 py-2.5">
                      <span className={cn(
                        "flex items-center gap-1",
                        log.status === "completed" ? "text-[#00FF87]" : "text-[#EF4444]"
                      )}>
                        {log.status === "completed" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-[#666]">{log.duration}</td>
                    <td className="px-4 py-2.5 text-[#666]">{log.tokens.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-[#444]">{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
